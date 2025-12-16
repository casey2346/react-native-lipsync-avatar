<<<<<<< HEAD
# react-native-lipsync-avatar
3D avatar lipsync demo using React Native, Expo, React Three Fiber, and TTS
=======
# React Native 3D Lipsync Avatar (Supabase Realtime Demo)

This project is a mobile React Native application demonstrating a real-time 3D avatar experience with speech-driven lipsync, session isolation, and optional Supabase realtime persistence.

It was built as a skills assessment focusing on:
- React Native (Expo + TypeScript)
- Mobile 3D rendering with Three.js / React Three Fiber
- Real-time avatar animation (lipsync)
- Session management and concurrency
- Clean, production-oriented architecture

---

## Features

- 📱 Cross-platform mobile app (iOS & Android via Expo)
- 🧍 3D avatar rendering using GLB/GLTF assets
- 🗣️ Speech-driven lipsync (audio-energy based, extensible to viseme mapping)
- 🎮 Simple 3D environment with lighting and controls
- 👥 Isolated user sessions using UUID-based session IDs
- 💬 User messages triggering avatar speech and animation
- 🔄 Optional Supabase persistence and realtime sync
- ⚡ Performance optimizations for mobile devices

---

## Tech Stack

**Frontend / Mobile**
- React Native (Expo)
- TypeScript
- React Navigation
- Expo AV (audio playback)

**3D / Graphics**
- three
- @react-three/fiber
- @react-three/drei
- GLB / GLTF avatar assets

**Realtime / Backend (Optional)**
- Supabase
- PostgreSQL
- Supabase Realtime
- Row Level Security (RLS)

---

## App Structure

```text
.
├── App.tsx
├── assets/
│   ├── avatar.glb
│   └── preview.png
├── components/
│   ├── Avatar.tsx
│   ├── Environment.tsx
│   └── MessageCard.tsx
├── lipsync/
│   └── wawaAdapter.ts
├── navigation/
│   └── RootNavigator.tsx
├── screens/
│   ├── LandingScreen.tsx
│   └── ExperienceScreen.tsx
├── supabase/
│   ├── client.ts
│   └── messages.ts
├── utils/
│   └── session.ts
├── package.json
└── README.md
The codebase is organized to clearly separate:

navigation

UI screens

reusable components

lipsync / animation logic

session and backend integration

User Flow
1. User launches the app and lands on the Landing screen

2. User enters the Experience screen

3. A unique session ID is generated and stored locally

4. User enters their name and a message

5. On "Speak":

    - Message is rendered in the UI

    - Optional persistence to Supabase

    - TTS audio is played

    - Avatar mouth animates in real time

6. Each session remains isolated from others

Session Management
Each user session is isolated using a UUID generated on first launch:

uuid.v4()
The session ID is stored locally using AsyncStorage and reused across app restarts.

This ensures:

- No collisions between concurrent users

- Safe isolation of messages

- Clear boundaries for realtime subscriptions

Lipsync Architecture
Lipsync is handled through a lightweight adapter layer:

- Audio playback drives a real-time "energy" signal

- Energy is mapped to the avatar’s mouth-related morph target

- Animation updates are throttled for mobile performance

The system is designed to be extensible:

- Current implementation: audio RMS → mouth open

- Can be upgraded to full Wawa Lipsync viseme mapping depending on avatar morph targets

All lipsync logic is encapsulated in lipsync/wawaAdapter.ts.

Supabase Integration (Optional)
Supabase is used optionally for:

- Persisting messages

- Realtime message subscriptions per session

Table Schema
create table messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null,
  name text not null,
  message text not null,
  created_at timestamptz default now()
);

Realtime
Each client subscribes only to messages matching its session_id, preventing cross-session interference.

Row Level Security (RLS)
For demo purposes, RLS is permissive.
In production, session IDs should be bound to authenticated users or signed session tokens.

Performance Optimizations
The app includes several mobile-focused optimizations:

- Suspense fallback while loading 3D assets

- Throttled animation updates (~30 FPS for lipsync)

- Preloading of GLB assets

- Lightweight environment geometry

- Avoidance of unnecessary re-renders

These choices ensure smooth performance on low-to-mid range mobile devices.

Running the Project
Install Dependencies
npm install
Start the App
npx expo start
Then run on:

- iOS Simulator

- Android Emulator

- Physical device via Expo Go

Known Limitations
- Current lipsync implementation uses audio energy rather than full phoneme/viseme extraction

- Accuracy of mouth animation depends on avatar morph target naming

- Demo audio placeholder should be replaced with real TTS (e.g., ElevenLabs, Google TTS) for production

These trade-offs were made to prioritize reliability and mobile performance within the assessment timeframe.

Future Improvements
- Full Wawa Lipsync phoneme → viseme mapping

- Authenticated users with stricter RLS policies

- Multiple avatar selection

- Network-synced multi-user scenes

- Improved facial expression blending

Demo
GitHub Repository: (this repo)

Demo Video: See submission link
>>>>>>> 9ddabf84 (Initial commit)
