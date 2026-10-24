# Klearn (클린)

[![CI](https://github.com/zreonx/klearn/actions/workflows/ci.yml/badge.svg)](https://github.com/zreonx/klearn/actions/workflows/ci.yml)
[![Release](https://github.com/zreonx/klearn/actions/workflows/release.yml/badge.svg)](https://github.com/zreonx/klearn/actions/workflows/release.yml)
[![Latest Release](https://img.shields.io/github/v/release/zreonx/klearn)](https://github.com/zreonx/klearn/releases)

A modern, local-first Korean language learning application built with **React Native**, **Expo Router**, and a **Premium Minimalist** design system.

---

## Features

- **5-Stage Structured Curriculum**: Progressive learning path from Hangul foundations (Consonants, Vowels, Batchim, Numbers) through Beginner A1/A2, Intermediate, and Natural Fluency with an interactive roadmap viewer.
- **6-Skill Personal Learning Engine**: Tracks mastery across Reading, Listening, Vocabulary, Grammar, Sentence Building, and Cultural Context with personalized daily focus recommendations.
- **Spaced Repetition (SRS)**: Powered by the SM-2 algorithm (`Again`, `Hard`, `Good`, `Easy`) for long-term vocabulary and grammar retention.
- **Dynamic Quiz Engine**: Multiple question formats including Korean-to-English, English-to-Korean, and Listening comprehension with mistake review.
- **Interactive Hangul Chart & Global Search**: Instant lookup and native TTS pronunciation across consonants, vowels, number systems, vocabulary, and lessons.
- **Offline & Local-First**: 100% functional offline with versioned local persistence via `AsyncStorage` plus full JSON backup export/import.
- **Streak & Habit Tracking**: Configurable daily target goals, active study streaks, and optional local reminders.
- **Premium Minimalist Theming**:
  - **Light Mode**: Deep Jade (`#176B55`) & Warm Ivory (`#F8F7F2`)
  - **Dark Mode**: Muted Jade (`#78B99B`) & Ink Charcoal (`#151C1A`)
- **System Safe-Area Responsive**: Full support for Android 3-button navigation, gesture pills, and camera cutouts without clipped content.

---

## Download & Releases

Prebuilt standalone Android APKs are published on the [**GitHub Releases**](https://github.com/zreonx/klearn/releases) page.

- **Latest Release**: [`v1.0.0`](https://github.com/zreonx/klearn/releases/tag/v1.0.0)
- **Changelog**: See [CHANGELOG.md](./CHANGELOG.md) for detailed release notes.

---

## Tech Stack

- **Framework**: [Expo](https://expo.dev/) (SDK 57) / [React Native](https://reactnative.dev/) (0.86)
- **Routing**: [Expo Router](https://docs.expo.dev/router/introduction/) (File-based navigation)
- **State & Storage**: Zustand, AsyncStorage, Zod validation
- **Theming & Insets**: Custom token-based design system + `react-native-safe-area-context` + `expo-navigation-bar`
- **Audio**: `expo-speech`
- **Testing**: Jest + TypeScript static checking

---

## Getting Started

### 1. Prerequisites
- Node.js (v20+)
- npm
- Expo Go on Android / iOS (or Android Studio / Xcode for native builds)

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

### 4. Running Verification & Tests
```bash
npx tsc --noEmit
npm test
```

---

## CI/CD & Release Workflow

Klearn uses **GitHub Actions** for automated verification and release publishing:

1. **Continuous Integration ([`.github/workflows/ci.yml`](./.github/workflows/ci.yml))**:
   - Runs automatically on every `push` and `pull_request` to `main`.
   - Executes TypeScript static checking (`npx tsc --noEmit`), Jest test suites (`npm test -- --ci`), and Expo web bundle verification (`npx expo export --platform web`).
2. **Automated Release & APK Build ([`.github/workflows/release.yml`](./.github/workflows/release.yml))**:
   - Triggers automatically whenever a semantic version tag (`v*.*.*`) is pushed (or manually via `workflow_dispatch`).
   - Runs full verification, performs `npx expo prebuild --platform android`, compiles a standalone signed Release APK via Gradle (`assembleRelease`), generates a SHA-256 checksum, extracts release notes from [CHANGELOG.md](./CHANGELOG.md), and publishes the **GitHub Release** with the APK attached.

### Creating a New Release
1. Update the version in `package.json` and `app.json`.
2. Document the changes under a new version heading in [CHANGELOG.md](./CHANGELOG.md).
3. Commit, tag, and push:
   ```bash
   git add .
   git commit -m "chore(release): v1.x.y"
   git tag -a v1.x.y -m "Release v1.x.y"
   git push origin main --follow-tags
   ```

---

## Project Structure

```text
klearn/
├── .github/workflows/    # GitHub Actions CI & Release pipelines
├── app/                  # Expo Router file-based screens and tabs
│   ├── (tabs)/           # Today, Learn, Quiz, Me
│   ├── hangul/           # Interactive Hangul & Numbers chart
│   ├── learn/            # Lesson detail & item view
│   ├── quiz/             # Quiz session modal
│   ├── review/           # SRS flashcard review modal
│   └── search.tsx        # Global live search screen
├── src/
│   ├── application/      # Use cases & application services
│   ├── components/ui/    # Theme tokens, Typography, Button, Card, ScreenLayout
│   ├── content/          # Educational curriculum, Hangul & Vocab catalog
│   ├── domain/           # Core models (Curriculum, SRS SM-2, Quiz, Streak)
│   └── infrastructure/   # Storage repositories, audio TTS, notifications
├── CHANGELOG.md          # Release history and version notes
└── README.md             # Project documentation
```

---

## License

MIT
