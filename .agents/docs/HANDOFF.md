# Klearn — Agent Session Handoff & State Tracker

> **Purpose**: This living document provides immediate context for any AI agent or developer picking up work on **Klearn**. Update this file at the end of significant feature work, architectural changes, or releases using the `session-handoff` skill.

---

## 1. Current Project Snapshot

- **Current Version**: `v1.0.0` (Tagged and released on GitHub)
- **Repository**: [`https://github.com/zreonx/klearn`](https://github.com/zreonx/klearn)
- **Tech Stack**: Expo SDK 57, React Native 0.86.3, Expo Router, TypeScript 6.0, Zustand, AsyncStorage, Jest
- **Verification Health**:
  - TypeScript (`npx tsc --noEmit`): **PASS (0 errors)**
  - Unit & Integration Tests (`npm test -- --runInBand`): **PASS (13 suites, 57 tests)**
  - CI/CD Workflows: `.github/workflows/ci.yml` & `.github/workflows/release.yml` active
  - Live AI Integration: Tested & verified Groq API key with fast Korean inference (~300ms)

---

## 2. Recently Completed Milestones

1. **CI/CD Pipeline Hardening & NPM ERESOLVE Resolution (2026-10-25)**:
   - Diagnosed GitHub Actions workflow failure on `npm ci` due to peer dependency mismatch between `@react-native/jest-preset@^0.87.1` and `jest-expo@57.0.5`.
   - Aligned `@react-native/jest-preset` to `^0.86.3` in `package.json` and generated clean `package-lock.json`.
   - Created `.npmrc` (`legacy-peer-deps=true`) and added `--legacy-peer-deps` to `npm ci` in `.github/workflows/ci.yml` and `.github/workflows/release.yml`.
   - Reordered `setup-gradle@v4` in `release.yml` to target the generated `android/` project after `npx expo prebuild`.
   - Verified local simulation of all CI steps: `npm ci`, `npx tsc --noEmit`, `npm test -- --ci --runInBand`, and `npx expo export --platform web` (all passing).
2. **Configurable Daily Study Notifications & Sentence Reminders (2026-10-24)**:
   - Implemented daily study notifications (`src/infrastructure/notifications/notificationService.ts`) with dedicated Android Notification Channel (`klearn-study-reminders`, High Importance, sound, vibration, and Deep Jade `#176B55` color).
   - Added 5 one-tap study schedule presets in the **Me** settings tab: *Morning* (08:00 AM), *Lunch* (12:30 PM), *Evening* (06:00 PM), *Night* (08:00 PM), and *Bedtime* (10:00 PM) (`src/domain/settings/types.ts`, `app/(tabs)/me.tsx`).
   - Added interactive "Test Alert" preview action in `app/(tabs)/me.tsx` displaying the Korean sentence of the day, streak counter, and translation.
   - Configured `expo-notifications` and Android `POST_NOTIFICATIONS` runtime permissions in `app.json`.
   - Added 13-suite unit test coverage (`src/infrastructure/notifications/notificationService.test.ts`) covering scheduling, presets, rich content formatting, and cancellation.
2. **Choseong Search, Particles Guide, Stroke Order & Achievements (2026-10-24)**:
   - Added Hangul initial consonant search (`초성 검색`: `ㄱㅅ` -> `감사합니다`, `ㅂㅂㅂ` -> `비빔밥`) in `src/domain/hangul/choseongSearch.ts` and `app/search.tsx`.
   - Created comprehensive Korean Particles Guide & Cheatsheet (`app/grammar/particles.tsx`) comparing `은/는` vs `이/가`, `에` vs `에서`, `(으)로`, and connectors with audio.
   - Added Hangul stroke order visualizer (`획순 가이드`) in `app/hangul/index.tsx`.
   - Added milestone badges and progress tracking (`src/domain/achievements/evaluator.ts`) on the **Me** tab (`app/(tabs)/me.tsx`).
2. **Interactive Sentence Builder, Acoustic Discrimination & Starred Cards Deck (2026-10-24)**:
   - Built interactive word & particle tile assembly (`sentence_assembly`) in `src/domain/quiz/generator.ts` and `app/quiz/session.tsx`.
   - Created curated Korean minimal triads (`src/content/hangul/minimalPairs.ts`) for acoustic discrimination (`불` vs `풀` vs `뿔`, `달` vs `탈` vs `딸`, `방` vs `팡` vs `빵`, `살` vs `쌀`, `자다` vs `차다` vs `짜다`).
   - Added Star/Bookmark capabilities across items and flashcards with a dedicated "Starred Tricky Cards" deck mode in `app/(tabs)/quiz.tsx`.
   - Added haptic tactile feedback service (`src/infrastructure/haptics/hapticService.ts`).
2. **Interactive Korean Conversation, Speaking Roleplay & Groq AI Integration (2026-10-24)**:
   - Built pure domain conversation engine (`src/domain/conversation/`) with 5 realistic roleplay scenarios (Seoul Cafe ordering, Self-introductions, Subway directions, Restaurant dining, and Business meetings).
   - Added standard (`0.85x`) and slow (`0.65x`) voice pronunciation, Romanization/English translation toggles, and live politeness register coaching (`존댓말 -해요체` vs. `격식체 -습니다`).
   - Integrated **Groq Cloud** (`qwen/qwen3.8-27b`, `openai/gpt-oss-120b`, `llama-3.3-70b-versatile`), **OpenRouter**, **Google Gemini**, and **DeepSeek** with graceful offline fallback and local persistence.
   - Verified live API key communication with Groq; pre-configured default settings and UI controls in `app/(tabs)/me.tsx`.
2. **Roadmap Expansion — 5-Stage Curriculum, Hangul Syllable Builder & SRS Analytics (2026-10-24)**:
   - Expanded curriculum content across all 5 proficiency stages (`Level 3 Unit 3: Locations & Movement`, `Level 4: Elementary Communication`, `Level 5: Honorifics & Formal Registers`, and `Level 6: Idioms, Proverbs & Cultural Fluency`).
   - Built pure Unicode Hangul Syllable Builder domain module (`src/domain/hangul/syllableBuilder.ts`) and interactive **Syllable Builder (음절 조합기)** playground in `app/hangul/index.tsx`.
   - Added **SRS Mastery Distribution**, **7-Day SRS Review Forecast**, and **6-Skill Proficiency Profile** visualizations to `src/application/useCases/dataUseCases.ts` and `app/(tabs)/me.tsx`.
2. **Initial Release `v1.0.0` & CI/CD Automation (2026-10-24)**:
   - Added GitHub Actions CI (`ci.yml`) for typechecking, Jest tests, and web export validation.
   - Added automated tag-triggered Android APK build & GitHub Release pipeline (`release.yml`).
   - Created [`CHANGELOG.md`](../../CHANGELOG.md) and [`ARCHITECTURE.md`](../../ARCHITECTURE.md).
2. **Clean Native Splash Screen & Standalone APK Build**:
   - Configured `app.json` (`expo.splash` and `expo-splash-screen`) to use the unpadded, transparent `assets/klearn-icon.png` directly.
   - Built standalone signed Android Release APK (`klearn-release.apk` / `release/klearn-v1.0.0.apk`).
3. **5-Stage Proficiency Journey & 6-Skill Engine**:
   - Implemented the 5-stage curriculum roadmap viewer, onboarding modal, recommended daily focus card (*Practice Now*), and live global search (`app/search.tsx`).

---

## 3. Important Platform Notes & Gotchas

- **Expo Go vs. Standalone APK Splash Screen**:
  - On Android, the **Expo Go** client app wraps project icons inside a hardcoded `200x200dp` white card with a `4dp` rounded shadow while bundling JS (`SplashScreenView.kt` inside Expo Go).
  - In **standalone builds** (`./gradlew assembleRelease` or `npx expo run:android`), Android's native splash screen API renders `klearn-icon.png` cleanly centered with zero card border, shadow, or padding.
- **Android Local Build Environment (Windows)**:
  - JDK 21 path: `C:\Program Files\Android\openjdk\jdk-21.0.8`
  - Android SDK path: `$env:LOCALAPPDATA\Android\Sdk`
- **Expo Notifications in Expo Go**:
  - Guarded safely so missing push-token support in Expo Go never crashes local reminder scheduling.

---

## 4. Next Recommended Priorities (Backlog)

- [x] **5-Stage Curriculum Expansion**: Full Level 1 through Level 6 coverage with concept notes, dialogues, and items.
- [x] **Hangul Syllable Builder Playground**: Pure Unicode initial, medial, batchim syllable generator and audio playback.
- [x] **Visual Analytics on Me Tab**: SRS Mastery Distribution, 7-Day review forecast, and 6-Skill proficiency profile.
- [x] **Interactive Conversation & AI Roleplay Hub**: 5 real-life scenarios, speech audio, politeness coach, and hybrid offline + Gemini/DeepSeek AI support.
- [x] **Quiz Format Expansion (Sentence Builder)**: Interactive word-tile ordering questions with tile bank and whitespace-tolerant verification.
- [x] **Acoustic Discrimination Quiz**: Audio minimal-pair drills (`불` vs `풀` vs `뿔`, `달` vs `탈` vs `딸`, `방` vs `팡` vs `빵`, `살` vs `쌀`, `자다` vs `차다` vs `짜다`).
- [x] **Starred / Bookmarked Tricky Cards Deck**: 1-tap star/bookmark controls on items and flashcards with a dedicated review deck.
- [ ] **Voice Pitch Shadowing Recorder**: Side-by-side pitch/audio comparison recorder for speaking practice.

---

## 5. Session Handoff Template

When concluding a work session, update the section below (or append a brief entry):

```markdown
### Last Session Summary (YYYY-MM-DD)
- **What Changed**:
  - ...
- **Files Touched**:
  - ...
- **Verification**:
  - `npx tsc --noEmit`: PASS
  - `npm test -- --runInBand`: PASS
- **Open Questions / Next Steps**:
  - ...
```
