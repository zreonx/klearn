# Klearn (클린)

A modern, local-first Korean language learning application built with **React Native**, **Expo Router**, and a **Premium Minimalist** design system.

---

## Features

- **Structured Curriculum**: Progressive learning path from Hangul foundations (Consonants, Vowels, Batchim) through Beginner A1 (Topic particles, Identification, Existence).
- **Spaced Repetition (SRS)**: Powered by the SM-2 algorithm for long-term vocabulary retention.
- **Dynamic Quiz Engine**: Multiple question formats including Korean-to-English, English-to-Korean, and Listening comprehension.
- **Offline & Local-First**: 100% functional offline with local persistence via AsyncStorage.
- **Audio & Pronunciation**: Native text-to-speech support for Hangul and example sentences.
- **Streak & Habit Tracking**: Daily target goals, active study streaks, and review reminders.
- **Premium Minimalist Theming**:
  - **Light Mode**: Deep Jade (`#176B55`) & Warm Ivory (`#F8F7F2`)
  - **Dark Mode**: Muted Jade (`#78B99B`) & Ink Charcoal (`#151C1A`)
- **System Safe-Area Responsive**: Full support for Android 3-button navigation, gesture pills, and camera cutouts without clipped content.

---

## Tech Stack

- **Framework**: [Expo](https://expo.dev/) (SDK 57) / [React Native](https://reactnative.dev/) (0.86)
- **Routing**: [Expo Router](https://docs.expo.dev/router/introduction/) (File-based navigation)
- **State & Storage**: Zustand, AsyncStorage
- **Theming & Insets**: Custom token-based design system + `react-native-safe-area-context` + `expo-navigation-bar`
- **Audio**: `expo-speech`
- **Testing**: Jest + TypeScript static checking

---

## Getting Started

### 1. Prerequisites
- Node.js (v18+)
- npm or yarn
- Expo Go on Android / iOS (or Android Studio / Xcode)

### 2. Installation
```bash
git clone https://github.com/zreonx/klearn.git
cd klearn
npm install
```

### 3. Running the App
```bash
# Start Metro bundler
npx expo start -c

# Run on Android emulator / device
npx expo run:android

# Run on iOS simulator
npx expo run:ios

# Run on Web
npx expo start --web
```

### 4. Running Tests
```bash
npm test
npx tsc --noEmit
```

---

## Project Structure

```
klearn/
├── app/                  # Expo Router file-based screens and tabs
│   ├── (tabs)/           # Today, Learn, Quiz, Me
│   ├── learn/            # Lesson detail & item view
│   ├── quiz/             # Quiz session modal
│   └── review/           # SRS flashcard review modal
├── src/
│   ├── application/      # Use cases & application services
│   ├── components/ui/    # Theme tokens, Typography, Button, Card, ScreenLayout
│   ├── content/          # Educational curriculum, Hangul & Vocab catalog
│   ├── domain/           # Core models (Curriculum, SRS SM-2, Quiz, Streak)
│   └── infrastructure/   # Storage repositories, audio TTS, notifications
└── .agents/              # Agent skills, documentation & curriculum roadmap
```

---

## License

MIT
