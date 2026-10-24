# Klearn — Project Rules & Agent Harness

## 1. Design & Layout Principles

Klearn adheres to a **Premium Minimalist** design philosophy with the signature **Deep Jade + Warm Ivory** (Light) and **Muted Jade + Ink Charcoal** (Dark) themes.

### Safe-Area & System Inset Rules
1. **Dynamic Inset Handling**:
   - Always wrap root stacks in `<SafeAreaProvider>` from `react-native-safe-area-context`.
   - Never use hardcoded device heights, fixed top coordinates (`top: 40`), or arbitrary bottom offsets.
   - Use `useSafeAreaInsets()` dynamically or the shared [`<ScreenLayout>`](file:///D:/Projects/klearn/src/components/ui/ScreenLayout.tsx) component.
2. **Tab Navigation**:
   - Always keep tab screen headers hidden in tab navigators (`headerShown: false`) to prevent duplicate titles.
   - Tab bars must compute dynamic height and bottom padding using `insets.bottom`:
     ```tsx
     const bottomInset = Math.max(insets.bottom, 8);
     tabBarStyle: {
       height: 56 + bottomInset,
       paddingBottom: bottomInset,
       paddingTop: 6,
     }
     ```
   - Tab screens must apply safe top padding below status bars and display cutouts (`Math.max(insets.top + 12, theme.spacing.xl)`).
3. **Footers, Floating Action Bars & Modals**:
   - Pinned bottom bars (e.g. SRS flashcard rating bars, quiz check answer buttons) must apply bottom safe padding: `paddingBottom: Math.max(insets.bottom, theme.spacing.lg)`.
   - Scrollable containers behind pinned footers must include appropriate bottom padding so the last item is never obscured.
4. **Android & iOS System UI**:
   - Ensure support for both Android 3-button navigation (Back, Home, Recent) and gesture navigation pills.
   - Synchronize `<StatusBar style={isDark ? 'light' : 'dark'} />` with the active theme.

---

## 2. Token-Based UI & Theming

1. **Semantic Design Tokens**:
   - Never hardcode raw hex values in screen components or stylesheets.
   - Always consume `useTheme()` for `colors` and `theme` (spacing, radii, typography).
   - Brand tokens:
     - Light: Primary `#176B55` (Deep Jade), Background `#F8F7F2` (Warm Ivory), Accent `#C5684D`.
     - Dark: Primary `#78B99B` (Muted Jade), Background `#151C1A` (Ink Charcoal), Accent `#E99A7E`.
2. **Korean Typography & Readability**:
   - Keep Korean Hangul text prominent, comfortable, and readable.
   - Maintain appropriate line heights to prevent Korean syllable clipping.
   - Keep translations and romanizations visually subordinate to Korean glyphs.

---

## 3. Clean Architecture & Local-First Guarantees

1. **Strict Layer Boundaries** (see [`ARCHITECTURE.md`](file:///D:/Projects/klearn/ARCHITECTURE.md) & [`.agents/rules/architecture-boundaries.md`](file:///D:/Projects/klearn/.agents/rules/architecture-boundaries.md)):
   - `src/domain/`: Pure TypeScript business logic (Curriculum, SRS SM-2, Quiz Generator, Streak Calculator) with zero React/Expo/AsyncStorage imports.
   - `src/content/`: Static, immutable Korean curriculum definitions (`LearningItem` ≠ mutable `LearningRecord`).
   - `src/application/`: Use cases and `LearningService` orchestrating domain logic and repositories.
   - `src/infrastructure/`: Concrete adapters (`AsyncStorage` repositories with versioned `StorageEnvelope<T>`, `expo-speech` TTS, `expo-notifications`).
   - `app/` & `src/components/ui/`: Expo Router screens and token-based UI components.
2. **Offline & Local Storage**:
   - All learning records, SRS schedules, and settings must persist locally via `AsyncStorage` repositories.
   - Network connectivity must never be required for learning, reviewing, or taking quizzes.

---

## 4. Verification, Documentation & Handoff Hygiene

1. **Mandatory Verification Gate**:
   - Before completing tasks, always run:
     - `npx tsc --noEmit`
     - `npm test -- --runInBand`
2. **Living Documentation & Handoff**:
   - Keep [`CHANGELOG.md`](file:///D:/Projects/klearn/CHANGELOG.md) updated for user-facing changes and releases.
   - Keep [`ARCHITECTURE.md`](file:///D:/Projects/klearn/ARCHITECTURE.md) updated when modifying layer contracts or schemas.
   - Keep [`.agents/docs/HANDOFF.md`](file:///D:/Projects/klearn/.agents/docs/HANDOFF.md) updated at the end of milestones or sessions.

---

## 5. Workspace Agent Harness Map (`.agents/`)

### Rules (`.agents/rules/`)
- [`architecture-boundaries.md`](file:///D:/Projects/klearn/.agents/rules/architecture-boundaries.md) — Clean Architecture layer rules & Content vs. User State separation.
- [`korean-content-standards.md`](file:///D:/Projects/klearn/.agents/rules/korean-content-standards.md) — Hangul orthography, Revised Romanization, and pedagogical standards.
- [`testing-and-verification.md`](file:///D:/Projects/klearn/.agents/rules/testing-and-verification.md) — Verification gates, unit test coverage, and documentation hygiene.

### Skills (`.agents/skills/`)
- `premium-minimalist-mobile-ui` — Designing and refactoring minimalist mobile UI screens and components.
- `session-handoff` — Onboarding session context and updating `.agents/docs/HANDOFF.md`.
- `changelog-and-release` — Maintaining `CHANGELOG.md`, version bumping, building APKs, and tagging GitHub Releases.
- `korean-curriculum-authoring` — Authoring and validating Korean lessons, Hangul, vocabulary, and grammar in `src/content/`.
- `architecture-guardian` — Auditing Clean Architecture boundaries, extending domain/quiz engines, and evolving storage schemas.

### Reference Docs (`.agents/docs/`)
- [`HANDOFF.md`](file:///D:/Projects/klearn/.agents/docs/HANDOFF.md) — Current project snapshot, completed milestones, platform gotchas, and next backlog items.
- [`CURRICULUM_ROADMAP.md`](file:///D:/Projects/klearn/.agents/docs/CURRICULUM_ROADMAP.md) — 5-Stage Korean proficiency curriculum & unit roadmap.
- [`RELEASE_RUNBOOK.md`](file:///D:/Projects/klearn/.agents/docs/RELEASE_RUNBOOK.md) — Step-by-step release, local APK build, and CI/CD runbook.
