# Klearn — Agent Session Handoff & State Tracker

> **Purpose**: This living document provides immediate context for any AI agent or developer picking up work on **Klearn**. Update this file at the end of significant feature work, architectural changes, or releases using the `session-handoff` skill.

---

## 1. Current Project Snapshot

- **Current Version**: `v1.0.0` (Tagged and released on GitHub)
- **Repository**: [`https://github.com/zreonx/klearn`](https://github.com/zreonx/klearn)
- **Tech Stack**: Expo SDK 57, React Native 0.86.3, Expo Router, TypeScript 6.0, Zustand, AsyncStorage, Jest
- **Verification Health**:
  - TypeScript (`npx tsc --noEmit`): **PASS (0 errors)**
  - Unit & Integration Tests (`npm test -- --runInBand`): **PASS (8 suites, 31 tests)**
  - CI/CD Workflows: `.github/workflows/ci.yml` & `.github/workflows/release.yml` active

---

## 2. Recently Completed Milestones

1. **Initial Release `v1.0.0` & CI/CD Automation (2026-10-24)**:
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

- [ ] **Curriculum Expansion**: Expand Stages 2–5 lessons with additional vocabulary, grammar breakdowns, and dialogue examples in `src/content/`.
- [ ] **Quiz Format Expansion**: Add sentence-building / word-ordering and character-matching question types to `src/domain/quiz/generator.ts`.
- [ ] **Detailed Skill Analytics**: Add per-skill breakdown visualizations (Reading, Listening, Vocabulary, Grammar, Sentence Building, Cultural Context) on the **Me** screen.

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
