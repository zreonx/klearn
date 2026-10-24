# Changelog

All notable changes to **Klearn** are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added
- **Korean Number Systems & Counters Playground (`숫자 & 단위 연습기`)**:
  - Implemented full Sino-Korean integer conversion (0 to 999,999,999) with units (십, 백, 천, 만, 억) and daily presets (money, minutes, dates) (`src/domain/numbers/sinoKorean.ts`).
  - Implemented Native Korean conversion (1 to 99) with standalone vs. counter contractions (`한, 두, 세, 네, 스무`) (`src/domain/numbers/nativeKorean.ts`).
  - Added catalog of 12 essential Korean counters (`개, 명, 잔, 병, 마리, 권, 살, 시, 분, 원, 층, 번`) and `formatKoreanClockTime` combining Native hours with Sino minutes (`src/domain/numbers/counters.ts`).
  - Created interactive Playground screen (`app/tools/numbers.tsx`) featuring real-time integer conversion, live Korean clock preview, and counter catalog with TTS audio playback.
- **Korean Verb & Adjective Conjugator (`동사/형용사 활용기`)**:
  - Curated 25+ essential Korean verbs and adjectives covering regular roots and all major irregulars (`ㄷ, ㅂ, ㅡ, 르, ㄹ, ㅅ, ㅎ`) (`src/domain/conjugation/curatedVerbs.ts`).
  - Built pure Unicode vowel harmony engine generating 6 essential spoken forms: Polite Present (`-아요/어요`), Formal Deferential (`-습니다/습니까`), Past (`-았/었어요`), Future (`-(으)ㄹ 거예요`), Polite Request (`-(으)세요`), and Negation (`안 ~ / -지 않아요`) (`src/domain/conjugation/engine.ts`).
  - Created interactive Conjugator screen (`app/tools/conjugator.tsx`) with dictionary root search, filter chips (All, Verbs, Adjectives, Irregulars), rule callout badges, and pronunciation audio.
- **Korean Sound-Change & Pronunciation Rules Guide (`한국어 발음 법칙`)**:
  - Comprehensive guide covering Liaison (`연음`), Nasalization (`비음화`), Tensification (`경음화`), Aspiration (`격음화`), and Palatalization (`구개음화`) (`src/content/grammar/soundChangeRules.ts`).
  - Created interactive sound-rules screen (`app/grammar/sound-rules.tsx`) with rule-by-rule tabs, side-by-side written vs. real spoken `[발음]` badges, and comparative TTS audio.
- **Cultural Micro-Stories & Reading Bites (`짧은 한국어 읽기`)**:
  - Authored 4 authentic, bite-sized Seoul life stories (*Late-Night Convenience Store*, *Han River Chicken*, *Subway Etiquette*, *Iced Americano "얼죽아"*) with reading time estimates and CEFR/Level tags (`src/content/reading/stories.ts`).
  - Created Reading Hub (`app/reading/index.tsx`) and Reader screen (`app/reading/[storyId].tsx`) with sentence-by-sentence audio playback, interactive vocabulary chips, translation toggles, and instant-feedback reading comprehension questions.
- **Korean Dictation / Bada-sseugi (`받아쓰기`) & Configurable Quiz Sessions**:
  - Extended domain quiz engine (`src/domain/quiz/types.ts`, `generator.ts`) with new `'dictation'` question type: plays audio and presents target syllable tiles with distractor tiles for spelling assembly.
  - Added dictation mode and customizable session length chips (`5, 10, 15, 20` questions) to the Quiz tab (`app/(tabs)/quiz.tsx`) and quiz runner (`app/quiz/session.tsx`).
- **Search Category Filters & Learn Tab Mastery Toolkit**:
  - Added horizontal category filter chips (`All Items, Vocabulary, Grammar, Sentences, Hangul`) and instant browsing in global search (`app/search.tsx`).
  - Redesigned the Learn tab (`app/(tabs)/learn.tsx`) to replace stacked vertical feature banners with a sleek, non-overwhelming horizontal **Mastery Toolkit** carousel, keeping beginner onboarding calm and welcoming while providing 1-tap reference access.
- **CI/CD Pipeline Hardening & NPM Dependency Resolution**:
  - Aligned `@react-native/jest-preset` to `^0.86.3` in `package.json` to resolve `ERESOLVE` peer dependency conflicts with `jest-expo@57.0.5` and `react-native@0.86.3`.
  - Added `.npmrc` (`legacy-peer-deps=true`) and `--legacy-peer-deps` to `npm ci` across `.github/workflows/ci.yml` and `.github/workflows/release.yml`.
  - Reordered Android prebuild steps in `release.yml` so Gradle caching initializes directly on the generated `android/` workspace.
  - Explicitly configured `GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}` on GitHub Release actions.
- **Configurable Daily Study Notifications & Sentence Reminders (`일일 학습 알림`)**:
  - Implemented configurable daily study reminder scheduling (`src/infrastructure/notifications/notificationService.ts`) with dedicated Android Notification Channel (`klearn-study-reminders`, High Importance, sound, vibration, and Deep Jade `#176B55` brand color).
  - Added 5 one-tap study schedule presets in the **Me** settings tab: *Morning* (08:00 AM), *Lunch* (12:30 PM), *Evening* (06:00 PM), *Night* (08:00 PM), and *Bedtime* (10:00 PM) (`src/domain/settings/types.ts`, `app/(tabs)/me.tsx`).
  - Added an interactive **"Test Alert"** preview action allowing learners to immediately preview their daily notification with today's Korean sentence, English translation, active streak counter, and review prompts.
  - Added `expo-notifications` and Android `POST_NOTIFICATIONS` runtime permissions configuration in `app.json`.
- **Hangul Initial Consonant Search (초성 검색 — Choseong Search)**:
  - Added pure Unicode Choseong extraction and matching (`src/domain/hangul/choseongSearch.ts`) in the global Search screen (`app/search.tsx`), enabling instant matching via initial consonants (e.g. `ㄱㅅ` -> `감사합니다`, `ㅂㅂㅂ` -> `비빔밥`, `ㅎㄱ` -> `한글` / `한국어`).
- **Interactive Korean Particles Guide (`한국어 조사 정리`)**:
  - Comprehensive reference guide and contrastive cheatsheet (`src/content/grammar/particleData.ts`, `app/grammar/particles.tsx`) covering Topic vs. Subject (`은/는` vs. `이/가`), Object (`을/를`), Location & Direction (`에`, `에서`, `(으)로`), Connectors (`(이)랑`, `하고`, `와/과`), Recipients (`에게`, `한테`, `께`), and Delimiters (`도`, `만`, `부터~까지`) with side-by-side rules, distinction callouts, and audio examples.
- **Hangul Stroke Order Visualizer (`획순 가이드`)**:
  - Added step-by-step stroke counts and directional writing instructions (`src/domain/hangul/strokeOrder.ts`) in the Hangul Chart detail modal (`app/hangul/index.tsx`) for consonants, double consonants, and basic vowels.
- **Milestone Achievements & Badges (`학습 업적`)**:
  - Implemented milestone tracking (`src/domain/achievements/evaluator.ts`) on the **Me** screen (`app/(tabs)/me.tsx`) rewarding daily streaks, Hangul mastery, star collections, and review completion.
- **Interactive Sentence Builder (SOV Word-Tile Assembly)**:
  - Added interactive word and particle tile assembly questions (`sentence_assembly`) where learners assemble Korean sentences in proper SOV order with tap-to-place and tap-to-remove mechanics, tile banking, whitespace-tolerant verification, and TTS audio readout.
- **Acoustic Discrimination Quiz (소리 구분 퀴즈 - Minimal Pairs)**:
  - Curated Korean minimal triads in `src/content/hangul/minimalPairs.ts` distinguishing plain, aspirated, and tense consonant triads (`불` vs `풀` vs `뿔`, `달` vs `탈` vs `딸`, `방` vs `팡` vs `빵`, `살` vs `쌀`, `자다` vs `차다` vs `짜다`).
  - Added dedicated auditory perception drills in `src/domain/quiz/generator.ts` and `app/quiz/session.tsx`.
- **Starred / Bookmarked Tricky Cards Deck**:
  - Added 1-tap star/bookmark controls on lesson item screens (`app/learn/item/[itemId].tsx`) and review cards (`app/review/index.tsx`).
  - Integrated a dedicated "Starred Tricky Cards" deck mode in `app/(tabs)/quiz.tsx` with instant targeted review.
- **Haptic Feedback Service**:
  - Lightweight, safe tactile feedback (`src/infrastructure/haptics/hapticService.ts`) providing subtle ticks on tile taps, celebratory success notches on correct answers, and error double-ticks.
- **Interactive AI Conversation, Speaking Roleplay & Politeness Coach (`회화 & AI 튜터`)**:
  - Pure domain conversation engine (`src/domain/conversation/`) with 5 authentic roleplay scenarios: *Ordering at a Seoul Cafe* (`카페에서 주문하기`), *First Meeting & Introductions* (`처음 만났을 때 자기소개`), *Asking Directions & Subway* (`길 묻기와 지하철역 찾기`), *Ordering at a Korean Restaurant* (`식당에서 음식 주문하기`), and *Formal Business Greeting* (`회사 첫 출근 및 격식 인사`).
  - Native Korean voice audio with standard (`0.85x`) and slow (`0.65x`) pronunciation playback for shadowing and listening practice.
  - Real-time politeness register evaluator (`존댓말 -해요체` vs. `격식체 -습니다/습니까`) providing instant grammar and register feedback on user replies.
  - Hybrid offline-first architecture with optional **Groq Cloud** (Llama 3.3 70B, free & fast), **OpenRouter**, **Google Gemini**, and **DeepSeek** API key support in the **Me** screen for open-ended AI conversation.
  - Interactive Conversation Hub (`app/conversation/index.tsx`) and chat interface (`app/conversation/[scenarioId].tsx`) with quick suggested replies, Romanization & English translation toggles, free-form text input, and study streak rewards.
- **Full 5-Stage Curriculum Expansion (Levels 3–6)**:
  - Completed Level 3 Unit 3 (*Locations & Movement* with destination `에` vs. action location `에서`).
  - Added Stage 3 (`Level 4: Elementary Communication`) covering Negation (`안`, `못`, `-지 않아요`), Clause Connectors (`-고`, `-지만`), and Cause & Reason (`-아서/어서`, `-(으)니까`).
  - Added Stage 4 (`Level 5: Honorifics & Formal Registers`) covering Subject Honorifics (`-(으)시-`, `드시다`, `주무시다`) and Formal Polite Deferential Style (`-습니다 / -습니까`).
  - Added Stage 5 (`Level 6: Idioms, Proverbs & Cultural Fluency`) covering Korean body-part idioms (`눈이 높다`, `손이 크다`) and classical proverbs (`시작이 반이다`).
- **Interactive Hangul Syllable Builder (`음절 조합기`)**:
  - Added a pure Unicode Hangul syllable composition engine (`src/domain/hangul/syllableBuilder.ts`) and interactive **Syllable Builder** playground tab in the Hangul Chart (`app/hangul/index.tsx`) with live Initial (초성), Medial (중성), and Batchim (종성) selectors, quick word presets, meaning hints, and TTS audio playback.
- **SRS Mastery Distribution, 7-Day Review Forecast & 6-Skill Profile (`Me` Screen)**:
  - Extended `DataUseCases.getLearningStats()` and `app/(tabs)/me.tsx` with a stacked SRS Mastery Distribution bar, a 7-day SM-2 review forecast chart, and a 6-Skill Proficiency breakdown card.

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
