import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'rn_lipsync_avatar_session_id_v1';

function uuidv4(): string {
  const c: any = (globalThis as any).crypto;
  if (c?.randomUUID) return c.randomUUID();

  const getRandomValues: ((arr: Uint8Array) => Uint8Array) | undefined =
    c?.getRandomValues?.bind(c);

  const bytes = new Uint8Array(16);
  if (getRandomValues) {
    getRandomValues(bytes);
  } else {
    for (let i = 0; i < 16; i++) bytes[i] = Math.floor(Math.random() * 256);
  }

  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export async function getOrCreateSessionId(): Promise<string> {
  const existing = await AsyncStorage.getItem(KEY);
  if (existing) return existing;

  const id = uuidv4();
  await AsyncStorage.setItem(KEY, id);
  return id;
}
