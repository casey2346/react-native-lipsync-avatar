import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Landing'>;

export default function LandingScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.h1}>3D Avatar Lipsync Demo</Text>
      <Text style={styles.p}>
        React Native + R3F + TTS + session isolation (Supabase optional).
      </Text>

      <View style={styles.previewPlaceholder} />

      <Button
        title="Enter Experience"
        onPress={() => navigation.navigate('Experience')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, justifyContent: 'center', gap: 14 },
  h1: { fontSize: 22, fontWeight: '700' },
  p: { fontSize: 14, color: '#444' },
  previewPlaceholder: {
    width: '100%',
    height: 160,
    backgroundColor: '#eee',
    borderRadius: 12,
    marginBottom: 12,
  },
});
