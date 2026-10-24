# Changelog

All notable changes to **Klearn** are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2026-10-24

### Added

#### 1. 5-Stage Korean Proficiency Curriculum & Roadmap
- **Structured Progression**: Organized curriculum across 5 progressive stages (from Hangul & Sound Foundations through Beginner A1/A2, Intermediate, and Natural Fluency).
- **Onboarding & Roadmap Viewer**: Interactive 5-stage proficiency journey modal and readable curriculum roadmap viewer.
- **Lesson & Item Detail Experience**: View Hangul, vocabulary, phrases, and grammar concepts with pronunciation, romanization, explanations, and example sentences, plus manual & automatic completion tracking.

#### 2. 6-Skill Personal Learning Engine
- **Skill Tracking & Balance**: Tracks progress across Reading, Listening, Vocabulary, Grammar, Sentence Building, and Cultural Context.
- **Recommended Daily Focus**: Intelligent "Today" dashboard highlighting the highest-priority next action (*Practice Now*, due reviews, or next curriculum lesson), deterministic Word of the Day, daily goal progress bar, and study streak tracker.

#### 3. Spaced Repetition System (SM-2)
- **SM-2 Scheduling Engine**: Domain-isolated spaced repetition algorithm with `Again`, `Hard`, `Good`, and `Easy` review ratings.
- **Dedicated Review Session Modal**: Focused flashcard review flow with meaning reveal, native audio playback, and real-time queue progress.

#### 4. Extensible Quiz Engine
- **Multi-Format Assessments**: Supports Korean-to-English (`ko-to-en`), English-to-Korean (`en-to-ko`), and Listening comprehension (`listening`) question types.
- **Detailed Results & Mistake Review**: Immediate answer feedback, session accuracy summary, and targeted mistake review.

#### 5. Interactive Hangul & Numbers Reference
- **Hangul Chart**: Complete interactive reference for Basic Consonants, Double Consonants, Basic Vowels, Compound Vowels, Batchim (final consonants), and Korean Number systems (Sino-Korean & Native Korean) with instant audio playback.
- **Live Global Search**: Instant search across all curriculum lessons, vocabulary, grammar patterns, and Hangul characters.

#### 6. Local-First Architecture & Data Portability
- **Offline Persistence**: Repository-backed local storage via `AsyncStorage` with versioned storage envelopes and schema validation (`zod`).
- **Backup & Restore**: Full JSON data export, import, and local progress reset in the **Me** tab.
- **Configurable Study Habits**: Customizable daily item goals (5, 10, 15, 20 items), optional local study reminders (`expo-notifications`), and Korean TTS speed/autoplay controls (`expo-speech`).

#### 7. Premium Minimalist Design System & Native Polish
- **Dual Signature Themes**:
  - **Light Mode**: Deep Jade (`#176B55`) + Warm Ivory (`#F8F7F2`) + Terracotta Accent (`#C5684D`).
  - **Dark Mode**: Muted Jade (`#78B99B`) + Ink Charcoal (`#151C1A`) + Soft Terracotta Accent (`#E99A7E`).
- **Safe-Area & Edge-to-Edge Support**: Dynamic inset handling across Android 3-button navigation, gesture bars, display cutouts, and status bars.
- **Clean Native Splash & Adaptive Icons**: Centered, borderless `klearn-icon.png` splash screen and adaptive icons across light and dark modes.
- **CI/CD Automation**: GitHub Actions workflows for continuous verification (`ci.yml`) and automated tag-driven Android APK release publishing (`release.yml`).

[1.0.0]: https://github.com/zreonx/klearn/releases/tag/v1.0.0
