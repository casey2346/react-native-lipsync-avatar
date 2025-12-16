import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Canvas } from '@react-three/fiber';
import Environment from '../components/Environment';
import Avatar from '../components/Avatar';
import MessageCard from '../components/MessageCard';
import { Audio } from 'expo-av';
import { getOrCreateSessionId } from '../utils/session';
import { insertMessage, subscribeToSessionMessages, MessageRow } from '../supabase/messages';

type LocalMsg = {
  id: string;
  name: string;
  message: string;
  created_at: string;
};

export default function ExperienceScreen() {
  const [sessionId, setSessionId] = useState<string>('');
  const [name, setName] = useState('Guest');
  const [message, setMessage] = useState('');
  const [items, setItems] = useState<LocalMsg[]>([]);

  // Lipsync driver (works on Web + native)
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);

  const soundRef = useRef<Audio.Sound | null>(null);

  // Create/get session id
  useEffect(() => {
    (async () => {
      const id = await getOrCreateSessionId();
      setSessionId(id);
    })();
  }, []);

  // Subscribe messages
  useEffect(() => {
    if (!sessionId) return;
    const sub = subscribeToSessionMessages(sessionId, (row: MessageRow) => {
      const m: LocalMsg = {
        id: row.id ?? `${Date.now()}`,
        name: row.name,
        message: row.message,
        created_at: row.created_at ?? new Date().toISOString(),
      };
      setItems((prev) => [m, ...prev]);
    });
    return () => sub.unsubscribe();
  }, [sessionId]);

  // Fake meter while speaking (stable + visible)
  useEffect(() => {
    if (!isSpeaking) {
      setAudioLevel(0);
      return;
    }
    let t = 0;
    const id = setInterval(() => {
      t += 0.12;
      // 0..1 range, looks like mouth opening/closing
      const v = 0.55 + 0.30 * Math.sin(t) + 0.15 * Math.sin(t * 2.7);
      const clamped = Math.max(0, Math.min(1, v));
      setAudioLevel(clamped);
    }, 33); // ~30fps
    return () => clearInterval(id);
  }, [isSpeaking]);

  async function stopAudio() {
    setIsSpeaking(false);
    setAudioLevel(0);

    if (soundRef.current) {
      try {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
      } catch {}
      soundRef.current = null;
    }
  }

  async function speak() {
    if (!sessionId) return;

    const trimmed = message.trim();
    if (!trimmed) return;

    const local: LocalMsg = {
      id: `${Date.now()}`,
      name,
      message: trimmed,
      created_at: new Date().toISOString(),
    };
    setItems((prev) => [local, ...prev]);

    insertMessage({ session_id: sessionId, name, message: trimmed }).catch(() => {});

    await stopAudio();

    // Start lipsync immediately (fake meter)
    setIsSpeaking(true);

    // Demo audio (replace later with real TTS)
    const demoAudio = 'https://www2.cs.uic.edu/~i101/SoundFiles/StarWars60.wav';

    const sound = new Audio.Sound();
    soundRef.current = sound;

    try {
      await sound.loadAsync({ uri: demoAudio }, { shouldPlay: true });

      sound.setOnPlaybackStatusUpdate((st) => {
        if (!st.isLoaded) return;
        if (st.didJustFinish) {
          stopAudio();
        }
      });
    } catch (e) {
      // If audio fails (common on some web setups), still stop the fake meter
      stopAudio();
    }

    setMessage('');
  }

  const header = useMemo(() => {
    return (
      <View style={styles.header}>
        <Text style={styles.h2}>Session</Text>
        <Text style={styles.session}>{sessionId || 'loading...'}</Text>
      </View>
    );
  }, [sessionId]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        <View style={styles.canvasWrap}>
          <Suspense
            fallback={
              <View style={styles.fallback}>
                <Text>Loading 3D...</Text>
              </View>
            }
          >
            <Canvas>
              <Environment />
              <Avatar audioLevel={audioLevel} />
            </Canvas>
          </Suspense>
        </View>

        <View style={styles.form}>
          {header}

          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Name"
            autoCapitalize="words"
          />

          <TextInput
            style={[styles.input, styles.messageInput]}
            value={message}
            onChangeText={setMessage}
            placeholder="Message"
            multiline
          />

          <Button title={isSpeaking ? 'Speaking...' : 'Speak'} onPress={speak} />
        </View>

        <View style={styles.list}>
          <FlatList
            data={items}
            keyExtractor={(it) => it.id}
            renderItem={({ item }) => (
              <MessageCard
                name={item.name}
                message={item.message}
                timestamp={new Date(item.created_at).toLocaleString()}
              />
            )}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  canvasWrap: { height: 320, backgroundColor: '#f3f3f3' },
  fallback: { height: 320, alignItems: 'center', justifyContent: 'center' },

  form: { padding: 12, gap: 10 },
  header: { gap: 4 },
  h2: { fontSize: 14, fontWeight: '700' },
  session: { fontSize: 12, color: '#444' },

  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: 'white',
  },
  messageInput: { minHeight: 60 },

  list: { flex: 1, padding: 12 },
});
