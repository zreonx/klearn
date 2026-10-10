# Klearn — Curriculum Architecture & Long-Term Roadmap

**Document Type:** Architectural Blueprint & Curriculum Specification  
**Status:** Living Document  
**Target:** Absolute Beginner → TOPIK II / Advanced Practical Korean  

---

## 1. Core Principles & Educational Philosophy

1. **Teach Before Testing**: Learners are introduced to clear concept notes, cultural/formality guidance, and example sentences before being quizzed.
2. **Mastery vs. Completion**:
   - *Explored/Studied*: All items in the lesson viewed.
   - *Mastered*: Demonstrated retention in Spaced Repetition (SRS SM-2 interval ≥ 3) and quiz recall accuracy ≥ 80%.
3. **Authentic Formality Guidance**: Korean cannot be understood without politeness registers. Every lesson explicitly states its formality register (`formal polite - 습니다/습니까`, `informal polite - 아요/어요`, or `casual - 반말`).
4. **Active Recall**: Lessons transition from character/word recognition to productive sentence assembly.
5. **Local-First & Offline**: All curriculum metadata, study records, and review scheduling persist locally without requiring internet access.

---

## 2. Curriculum Domain Hierarchy

```
Curriculum
 └── Level (Proficiency Stage: Foundation → Beginner A1 → Beginner A2 → Elementary ...)
      └── Unit (Thematic Group: Hangul, Particles, Daily Verbs, Locations ...)
           └── Lesson (Focused Pedagogical Unit)
                ├── Learning Objectives (e.g., "Identify and conjugate present tense verbs")
                ├── Concept Note (Grammar explanations, politeness conventions)
                ├── Prerequisites (Optional prerequisite lesson IDs)
                └── Learning Items (Vocabulary, Grammar Particles, Phrasal Patterns)
```

---

## 3. Four-Tier Foundational Progression Ladder

### Level 1: Foundations (기초 한글과 첫걸음)
- **Unit 1: Hangul Core Letters (기본 자모)**
  - Lesson 1: Basic Consonants (`ㄱ, ㄴ, ㄷ, ㄹ, ㅁ, ㅂ, ㅅ, ㅇ`)
  - Lesson 2: Basic Vowels (`ㅏ, ㅓ, ㅗ, ㅜ, ㅡ, ㅣ`)
  - Lesson 3: Aspirated & Tense Consonants (`ㅋ, ㅌ, ㅍ, ㅊ, ㄲ, ㄸ, ㅃ, ㅆ, ㅉ`)
- **Unit 2: Syllable Structure & Batchim (음절과 받침)**
  - Lesson 1: Syllable Assembly (`CV`, `CVC`)
  - Lesson 2: Final Consonants / Batchim (`ㄱ, ㄴ, ㄷ, ㄹ, ㅁ, ㅂ, ㅇ`)
- **Unit 3: Essential Courtesies (필수 인사와 예절)**
  - Lesson 1: Daily Greetings & Gratitude (`안녕하세요`, `감사합니다`, `죄송합니다`)
  - Lesson 2: Polite Partings (`안녕히 가세요` vs. `안녕히 계세요`)

### Level 2: Beginner A1 (초급 1 — 기본 문장 만들기)
- **Unit 1: Introductions & Identity (자기소개)**
  - Lesson 1: Topic Particle 은/는
  - Lesson 2: Identification: 이에요 / 예요 ("It is / I am")
  - Lesson 3: Nationality & Occupations (`한국 사람`, `학생`, `선생님`)
- **Unit 2: Demonstratives & Asking (지시대명사)**
  - Lesson 1: This & That: 이, 그, 저 (이것, 그것, 저것)
  - Lesson 2: Asking What & Who: 뭐예요? 누구예요?
- **Unit 3: Existence & Possession (존재와 소유)**
  - Lesson 1: Subject Particle 이/가
  - Lesson 2: Expressing Existence: 있어요 / 없어요 ("Have / Don't have / Exists")

### Level 3: Beginner A2 (초급 2 — 일상 행동과 장소)
- **Unit 1: Daily Routines & Verbs (기본 동사와 현재 시제)**
  - Lesson 1: Present Tense Conjugation: -아요 / -어요 / -해요
  - Lesson 2: Essential Verbs (`가다`, `오다`, `먹다`, `마시다`, `자다`)
  - Lesson 3: Object Particle 을/를
- **Unit 2: Locations & Movement (장소와 이동)**
  - Lesson 1: Location of Action vs. Destination: 에 vs. 에서
  - Lesson 2: Daily Places (`집`, `학교`, `회사`, `카페`, `식당`)
- **Unit 3: Numbers & Counting (숫자와 수량)**
  - Lesson 1: Native Korean Numbers & Common Counters (`하나, 둘, 셋` + `개, 명, 잔`)
  - Lesson 2: Sino-Korean Numbers for Dates, Money & Phone (`일, 이, 삼` + `원, 월, 일`)

### Level 4: Elementary (기본 회화와 시제 확장)
- **Unit 1: Past Tense & Timelines (과거 시제)**
  - Lesson 1: Past Tense Conjugation: -았어요 / -었어요
  - Lesson 2: Time Words (`어제`, `오늘`, `내일`, `지금`)
- **Unit 2: Desires & Negation (희망과 부정)**
  - Lesson 1: Wanting to do: -고 싶어요
  - Lesson 2: Short & Long Negation: 안 + Verb vs. -지 않아요
- **Unit 3: Connecting Sentences (문장 연결)**
  - Lesson 1: And / Sequence: -고
  - Lesson 2: But / Contrast: -지만

---

## 4. Implementation Phasing Strategy

| Phase | Target Scope | Key Deliverables |
|---|---|---|
| **Phase 1** *(Current)* | Domain model upgrade & Foundation catalog expansion | Extended `Lesson` interface (`conceptNote`, `learningObjectives`, `formalityLevel`), Batchim & Beginner A1 items, Level 1 & 2 curriculum catalog. |
| **Phase 2** | UI enhancements on Lesson Detail | Redesigned Lesson Overview in `app/learn/[lessonId].tsx` presenting concept notes and grammar breakdown before card drills. |
| **Phase 3** | Prerequisite tracking & sequential unlocking | Lesson locking mechanism preventing jumping ahead until prerequisites are satisfied. |
| **Phase 4** | Multimodal practice (Listening, Grammar Assembly) | Quiz engine expansion to support sentence assembly and particle placement. |
| **Phase 5** | Graded Reading & Conversations | Short dialogues and authentic micro-scenarios connecting learned grammar and vocabulary in context. |
