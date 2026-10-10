# Klearn --- AI Agent Build Specification

> **Project:** Klearn\
> **Type:** Local-first Korean learning application\
> **Platform:** Expo / React Native, with web compatibility where
> practical\
> **Purpose:** Build a structured Korean-learning app around a daily
> learning loop, curriculum progression, review, quizzes, and spaced
> repetition.

------------------------------------------------------------------------

## 1. Product Vision

Klearn is a focused Korean-learning application designed to help a
learner build a consistent daily habit while gradually progressing
through structured Korean content.

The product should not behave like a generic flashcard application. The
core experience is a learning loop:

1.  Discover and learn new material.
2.  Practice material that has already been learned.
3.  Review due material using spaced repetition.
4.  Test understanding through quizzes.
5.  Track progress and maintain a daily learning habit.
6.  Gradually unlock and progress through a curriculum.

The application should feel polished, calm, focused, and modern rather
than gamified to the point of distraction.

### Core product principle

> **Make Korean learning feel like a small, repeatable daily practice
> rather than a large study session.**

------------------------------------------------------------------------

# 2. V1 Scope

## In scope

### Today

-   Daily learning dashboard
-   Daily goal/progress
-   Due reviews
-   New items for today
-   Daily word
-   Current streak
-   Recent learning activity
-   Quick actions to continue learning or reviewing

### Learn

-   Structured Korean curriculum
-   Lessons
-   Vocabulary
-   Hangul learning
-   Item detail
-   Pronunciation/audio through TTS
-   Marking content as learned
-   Lesson progression

### Review

-   Due spaced-repetition cards
-   Review rating
-   SM-2 initial algorithm implementation
-   Review scheduling
-   Review progress

### Quiz

-   Quiz session
-   Multiple question types through an extensible quiz engine
-   Immediate feedback
-   Score/progress
-   Quiz results
-   Quiz history

### Me

-   Learning statistics
-   Streak
-   Settings
-   Notification settings
-   TTS settings
-   Daily goal
-   Data management
-   Export/import

### Notifications

-   Optional reminders
-   Scheduled local notifications
-   User-controlled reminder settings

### Local-first persistence

-   AsyncStorage initially
-   Repository abstraction
-   Versioned persistence
-   Migration support
-   Export/import

------------------------------------------------------------------------

# 3. Explicitly Out of Scope for V1

Do not implement these unless the architecture requires a clean
abstraction for future support:

-   Backend
-   Authentication
-   User accounts
-   Cloud synchronization
-   Social features
-   Leaderboards
-   Payments
-   Subscription billing
-   AI tutor
-   AI-generated lessons
-   Online multiplayer
-   Remote analytics platform
-   Complex gamification
-   Web push notifications
-   Enterprise administration

The architecture should allow these capabilities to be added later
without requiring a rewrite of the learning domain.

------------------------------------------------------------------------

# 4. Learning Model

Klearn should clearly distinguish three related concepts:

## Learn

The learner encounters new material.

Examples:

-   Hangul character
-   Vocabulary word
-   Phrase
-   Grammar concept
-   Lesson content

## Review

The learner recalls material they have previously learned.

Review is governed by the spaced-repetition system.

## Quiz

The learner is tested in a more structured way.

Quiz questions should eventually support multiple formats such as:

-   Multiple choice
-   Korean → English
-   English → Korean
-   Listening recognition
-   Character recognition
-   Sentence completion
-   Matching

The quiz engine must be extensible so additional question types do not
require rewriting the quiz session.

------------------------------------------------------------------------

# 5. Core Learning Loop

The primary user journey should be:

``` text
Today
  ↓
Start Daily Learning
  ↓
Learn New Material
  ↓
Practice / Quiz
  ↓
Review Due Material
  ↓
Complete Daily Goal
  ↓
View Progress
  ↓
Return Tomorrow
```

The application should make the next recommended action obvious.

The Today screen should answer:

-   What should I learn today?
-   What is due for review?
-   How much have I completed?
-   What should I do next?
-   How am I progressing?

------------------------------------------------------------------------

# 6. Content Model

Content should be separated from user-specific learning state.

A content item represents material supplied by the curriculum.

Example:

``` ts
type LearningItem = {
  id: string
  type: LearningItemType
  korean: string
  romanization?: string
  translation?: string
  pronunciation?: string
  explanation?: string
  examples?: ExampleSentence[]
  tags?: string[]
  lessonId?: string
}
```

The exact domain model may evolve during implementation, but maintain
the separation:

``` text
Content
  ≠
User Learning Record
```

This is important because one vocabulary item may exist once in the
content catalog while the user's progress, review schedule, and history
belong to a separate record.

------------------------------------------------------------------------

# 7. Curriculum

Klearn should not treat the entire vocabulary/content catalog as one
flat list.

Use a curriculum structure such as:

``` text
Curriculum
  └── Level
       └── Unit
            └── Lesson
                 └── Learning Items
```

Example:

``` text
Beginner
  ├── Hangul
  │    ├── Basic Consonants
  │    ├── Basic Vowels
  │    └── Syllable Blocks
  │
  ├── Unit 1
  │    ├── Greetings
  │    ├── Introductions
  │    └── Numbers
  │
  └── Unit 2
       ├── Family
       ├── Time
       └── Daily Activities
```

The curriculum should support future progression without hardcoding
every lesson into UI components.

------------------------------------------------------------------------

# 8. Learning Record

The learner's state for an item should be separate from the item itself.

Conceptually:

``` ts
type LearningRecord = {
  itemId: string
  status: LearningStatus
  firstLearnedAt?: string
  lastReviewedAt?: string
  reviewCount: number
  correctCount: number
  incorrectCount: number
  streak: number
}
```

The exact fields can evolve.

Do not store user progress directly inside static content definitions.

------------------------------------------------------------------------

# 9. Spaced Repetition

## Architecture

Spaced repetition must be behind an abstraction.

Do not make SM-2 a hardcoded architectural dependency.

Example conceptual interface:

``` ts
interface SpacedRepetitionAlgorithm {
  initialize(itemId: string): ReviewState

  review(
    state: ReviewState,
    rating: ReviewRating,
    reviewedAt: Date
  ): ReviewState

  getNextReviewDate(state: ReviewState): Date
}
```

The initial implementation should be:

``` text
SM-2
```

Future implementations could include:

-   FSRS
-   Custom adaptive scheduling
-   Other research-based algorithms

The rest of the application should not need to know which algorithm is
being used.

------------------------------------------------------------------------

# 10. Review Ratings

The review system should support a small, understandable rating model.

Example:

``` ts
enum ReviewRating {
  Again = 'again',
  Hard = 'hard',
  Good = 'good',
  Easy = 'easy',
}
```

The UI should clearly communicate what each rating means.

Avoid exposing algorithm terminology to users unless necessary.

------------------------------------------------------------------------

# 11. Review Queue

The review queue should be generated from persisted learning state.

Conceptually:

``` text
Learning Records
      ↓
Due Review Query
      ↓
Review Queue
      ↓
Review Session
      ↓
Rating
      ↓
SRS Algorithm
      ↓
Updated Learning Record
```

The queue should support:

-   Due items
-   Ordering
-   Daily limits
-   New vs review items
-   Session progress

------------------------------------------------------------------------

# 12. Learning Sessions

Learning activity should be represented as sessions where appropriate.

A session can track:

``` ts
type LearningSession = {
  id: string
  startedAt: string
  completedAt?: string
  mode: LearningSessionMode
  itemsAttempted: number
  itemsCompleted: number
  correctAnswers: number
  incorrectAnswers: number
}
```

The model should remain simple in V1.

The purpose is to support meaningful progress statistics without
building an analytics platform.

------------------------------------------------------------------------

# 13. Today Dashboard

Today is the main dashboard.

It should include:

### Daily goal

Example:

``` text
Today's goal

████████░░ 80%

8 / 10 items
```

### Review

``` text
12 reviews due
```

### New learning

``` text
5 new words
```

### Continue learning

Show the next recommended lesson.

### Daily word

Show one highlighted vocabulary item.

### Streak

Show the current learning streak.

### Recent activity

Provide a lightweight history of what the learner has recently
completed.

Avoid filling the dashboard with unnecessary metrics.

------------------------------------------------------------------------

# 14. Daily Word

The daily word should be deterministic for a given day.

Do not randomly change it every time the application renders.

A daily word can be selected using:

``` text
current date
+
stable content ordering
```

This allows the same daily word to remain consistent throughout the day.

------------------------------------------------------------------------

# 15. Learn Screen

The Learn section should represent structured progression.

It should allow the user to:

-   Browse curriculum
-   Open a level
-   Open a unit
-   Open a lesson
-   Start a lesson
-   View learning items
-   Mark items as learned
-   Continue where they left off

The UI should make locked/completed/current lessons understandable.

Do not make the entire curriculum look like an unrestricted database
browser.

------------------------------------------------------------------------

# 16. Review Screen

The Review screen should be focused.

A review card may contain:

``` text
Korean
한국어

[Reveal meaning]

Korean language
```

Then:

``` text
Again   Hard   Good   Easy
```

The review session should show:

-   Current item
-   Session progress
-   Optional pronunciation
-   Answer/reveal interaction
-   Rating controls

Avoid distracting navigation while a review session is active.

------------------------------------------------------------------------

# 17. Quiz Engine

The quiz system should be implemented as an extensible
domain/application feature.

Conceptually:

``` ts
interface QuizQuestion {
  id: string
  type: QuizQuestionType
  prompt: string
  options?: QuizOption[]
  correctAnswer: string
}
```

Question generation should be separated from rendering.

For example:

``` text
Quiz Generator
      ↓
Quiz Question
      ↓
Quiz UI
      ↓
Answer
      ↓
Evaluation
      ↓
Result
```

Do not place question-generation logic directly inside React components.

------------------------------------------------------------------------

# 18. Quiz Results

After a quiz session, show:

-   Score
-   Correct answers
-   Incorrect answers
-   Accuracy
-   Items that need more practice
-   Option to review mistakes
-   Option to return to Today

Do not over-gamify the result screen.

------------------------------------------------------------------------

# 19. Text-to-Speech

Use `expo-speech`.

TTS should be an explicit capability rather than a hidden side effect.

Support:

-   Manual pronunciation
-   Optional automatic pronunciation
-   TTS settings
-   Korean language configuration

### Important

Do not autoplay speech by default.

Autoplay should be an opt-in setting because unexpected speech can be
disruptive.

------------------------------------------------------------------------

# 20. Onboarding

Do not immediately request notification permissions on first launch.

Onboarding should establish value first.

Possible flow:

``` text
Welcome
  ↓
Learning goal
  ↓
Daily target
  ↓
Optional reminder
  ↓
Start learning
```

Collect only information that is useful for the learning experience.

------------------------------------------------------------------------

# 21. Daily Goals

Support configurable daily goals.

Examples:

-   5 items
-   10 items
-   15 items
-   20 items

The daily goal should be represented in domain/application logic rather
than being hardcoded in the UI.

------------------------------------------------------------------------

# 22. Notifications

Use local notifications.

Notifications should be optional.

Possible reminder configuration:

``` ts
type ReminderSettings = {
  enabled: boolean
  hour: number
  minute: number
}
```

Do not request permission until the user enables or explicitly chooses
reminders.

Notification scheduling should be isolated from the learning domain.

------------------------------------------------------------------------

# 23. Me / Profile

The Me screen should contain:

### Progress

-   Total items learned
-   Reviews completed
-   Quiz accuracy
-   Current streak
-   Learning days
-   Lessons completed

### Settings

-   Daily goal
-   Reminder
-   TTS
-   Appearance
-   Data management

### Data management

-   Export data
-   Import data
-   Reset local data

Avoid unnecessary account/profile concepts because authentication is out
of scope for V1.

------------------------------------------------------------------------

# 24. Local-First Architecture

Klearn should be local-first.

Initial persistence:

``` text
AsyncStorage
```

However, UI code must not directly depend on AsyncStorage.

Use repositories.

Architecture:

``` text
UI
 ↓
Hooks / Application Services
 ↓
Use Cases
 ↓
Repositories
 ↓
Storage Adapter
 ↓
AsyncStorage
```

------------------------------------------------------------------------

# 25. Repository Abstraction

Example:

``` ts
interface LearningRepository {
  getByItemId(itemId: string): Promise<LearningRecord | null>

  save(record: LearningRecord): Promise<void>

  getAll(): Promise<LearningRecord[]>

  getDueReviews(date: Date): Promise<LearningRecord[]>
}
```

The exact interfaces should be determined during implementation.

The key requirement is:

> React components must not know that AsyncStorage exists.

This makes future migration to SQLite, IndexedDB, or a remote API
significantly easier.

------------------------------------------------------------------------

# 26. Storage Versioning

Persisted data must be versioned.

Example:

``` ts
type StorageEnvelope<T> = {
  version: number
  data: T
}
```

When the data model changes:

``` text
Stored Version 1
      ↓
Migration
      ↓
Stored Version 2
```

Do not silently break existing user data.

------------------------------------------------------------------------

# 27. Data Export / Import

Because V1 is local-first, users should be able to export their learning
data.

Export should contain user-generated state such as:

-   Learning records
-   Review state
-   Settings
-   Progress
-   Session history

Static application content does not need to be duplicated in every
export unless necessary.

Import should validate the data before modifying existing state.

Use Zod schemas for validation.

------------------------------------------------------------------------

# 28. Zustand

Use Zustand for application state where reactive state is useful.

Good candidates:

-   Current session
-   Current review session
-   Current quiz session
-   UI preferences
-   Temporary onboarding state

Do not use Zustand as the universal database.

Persisted domain data should remain repository-backed.

Prefer:

``` text
Repository = source of truth
Zustand = reactive application/session state
```

------------------------------------------------------------------------

# 29. Application / Use-Case Layer

Do not allow feature hooks to become a replacement for domain
architecture.

Use cases should coordinate domain behavior and repositories.

Examples:

``` text
StartLesson
CompleteLearningItem
GetTodayDashboard
StartReviewSession
SubmitReview
StartQuiz
SubmitQuizAnswer
CompleteDailyGoal
GetProgress
ExportLearningData
ImportLearningData
```

A typical flow:

``` text
Screen
  ↓
Feature Hook
  ↓
Use Case
  ↓
Domain + Repository
  ↓
Persistence
```

------------------------------------------------------------------------

# 30. Domain Layer

The domain layer should contain rules rather than UI behavior.

Possible domain areas:

``` text
learning
review
srs
quiz
curriculum
progress
streak
```

Domain code should not import:

-   React
-   React Native
-   Expo
-   AsyncStorage
-   Zustand
-   Navigation libraries

The domain should remain testable independently.

------------------------------------------------------------------------

# 31. Folder Structure

Use a structure similar to:

``` text
src/
├── app/
│   ├── providers/
│   └── store/
│
├── domain/
│   ├── learning/
│   ├── review/
│   ├── srs/
│   ├── quiz/
│   ├── curriculum/
│   ├── progress/
│   └── streak/
│
├── application/
│   ├── learning/
│   ├── review/
│   ├── quiz/
│   ├── dashboard/
│   ├── progress/
│   └── data/
│
├── infrastructure/
│   ├── storage/
│   │   ├── async-storage/
│   │   ├── repositories/
│   │   └── migrations/
│   ├── notifications/
│   └── speech/
│
├── features/
│   ├── today/
│   ├── learn/
│   ├── review/
│   ├── quiz/
│   └── me/
│
├── components/
│   ├── ui/
│   └── shared/
│
├── content/
│   ├── hangul/
│   ├── vocabulary/
│   ├── lessons/
│   └── daily/
│
├── hooks/
├── lib/
├── config/
└── types/
```

Use Expo Router's `app/` directory separately for routes.

------------------------------------------------------------------------

# 32. Navigation

The primary navigation should have four tabs:

``` text
Today
Learn
Quiz
Me
```

Review can be launched as a focused session from Today or Learn rather
than necessarily being a permanent bottom tab.

The navigation should remain simple.

------------------------------------------------------------------------

# 33. Expo Router

Use Expo Router for navigation.

Route organization should reflect the product structure.

Example:

``` text
app/
├── _layout.tsx
├── (tabs)/
│   ├── _layout.tsx
│   ├── index.tsx
│   ├── learn.tsx
│   ├── quiz.tsx
│   └── me.tsx
│
├── learn/
│   ├── [lessonId].tsx
│   └── item/
│       └── [itemId].tsx
│
├── review/
│   └── index.tsx
│
└── quiz/
    └── session.tsx
```

------------------------------------------------------------------------

# 34. Design System

The UI should be:

-   Minimal
-   Modern
-   Dark-first
-   Calm
-   Focused
-   Accessible
-   SaaS-quality
-   Educational rather than game-like

Do not use a third-party UI component library.

Build reusable primitives.

------------------------------------------------------------------------

# 35. Theme Tokens

Use semantic design tokens.

Example:

``` ts
colors: {
  background,
  surface,
  surfaceElevated,
  foreground,
  mutedForeground,
  primary,
  primaryForeground,
  border,
  success,
  warning,
  destructive,
}
```

Components should consume semantic tokens rather than hardcoded colors.

Avoid scattering hex values throughout the application.

------------------------------------------------------------------------

# 36. Typography

Typography should establish a clear hierarchy:

``` text
Display
Heading
Title
Body
Caption
Label
```

Korean text should have sufficient font support and rendering quality.

Do not use overly decorative typography.

------------------------------------------------------------------------

# 37. Spacing

Use a consistent spacing scale.

For example:

``` text
4
8
12
16
20
24
32
40
48
64
```

Do not randomly choose spacing values per component.

------------------------------------------------------------------------

# 38. Radius

Use a consistent radius system.

Example:

``` text
sm
md
lg
xl
full
```

Cards and controls should have consistent visual language.

------------------------------------------------------------------------

# 39. UI Components

Build reusable primitives such as:

``` text
Button
IconButton
Card
Badge
ProgressBar
Divider
Text
Input
Modal
BottomSheet
EmptyState
LoadingState
ErrorState
```

Feature-specific components should live within their feature.

Avoid duplicating generic components.

For example, do not create separate copies of `RatingRow` in both:

``` text
components/
features/review/
```

Decide whether a component is:

-   Generic UI primitive
-   Shared application component
-   Feature-specific component

and keep it in one place.

------------------------------------------------------------------------

# 40. Responsive Design

The app should work well on:

-   iOS
-   Android
-   Web

Do not assume a fixed phone width.

For web:

-   Use responsive layouts
-   Avoid stretched mobile-only UI
-   Provide appropriate maximum content widths
-   Keep learning sessions focused

Native-only functionality such as local notification scheduling may have
different behavior on web.

The core learning experience should remain usable.

------------------------------------------------------------------------

# 41. Accessibility

Support:

-   Accessible labels
-   Sufficient contrast
-   Large touch targets
-   Screen reader compatibility
-   Reduced-motion considerations
-   Keyboard navigation where relevant on web

Do not rely only on color to communicate state.

------------------------------------------------------------------------

# 42. Animation

Animations should be subtle.

Good uses:

-   Progress transitions
-   Card transitions
-   Completion feedback
-   Screen transitions

Avoid:

-   Excessive bouncing
-   Distracting effects
-   Long transitions
-   Animation on every interaction

Learning should remain the focus.

------------------------------------------------------------------------

# 43. Engineering Standards

Use strict TypeScript.

Required:

``` text
strict: true
```

Do not use:

``` ts
any
```

Do not use:

``` ts
@ts-ignore
```

Do not use unsafe type assertions unless there is a documented reason.

Prefer explicit types and type-safe APIs.

------------------------------------------------------------------------

# 44. Exports

Prefer named exports.

Example:

``` ts
export function createReviewQueue() {}
```

Avoid default exports except where required by Expo Router or framework
conventions.

------------------------------------------------------------------------

# 45. Validation

Use Zod for validating:

-   Imported data
-   Persisted data boundaries
-   External/untrusted input
-   Configuration
-   Content schemas where useful

Do not use Zod unnecessarily for every internal function.

------------------------------------------------------------------------

# 46. Result Types

A `Result<T, E>` pattern may be used for operations where failure is an
expected part of the application flow.

For example:

``` text
Import data
Storage migration
Repository operations
```

Do not force every function in the application to return `Result`.

Use normal exceptions/errors when appropriate.

------------------------------------------------------------------------

# 47. Error Handling

Errors should be:

-   Structured
-   Logged
-   User-friendly where surfaced to users
-   Actionable where possible

Do not expose internal stack traces or implementation details in
user-facing UI.

Provide:

``` text
Loading
Empty
Error
Success
```

states where appropriate.

------------------------------------------------------------------------

# 48. Logging

Create a lightweight logger abstraction.

Example:

``` ts
logger.debug(...)
logger.info(...)
logger.warn(...)
logger.error(...)
```

Avoid scattered `console.log` calls throughout production code.

Development logging can be more verbose than production logging.

------------------------------------------------------------------------

# 49. Documentation

Do not require JSDoc for every function.

Use documentation where it adds value, especially for:

-   Public domain APIs
-   Complex algorithms
-   Repository contracts
-   SRS behavior
-   Migration behavior
-   Non-obvious business rules

Prefer clear naming and small functions over excessive comments.

------------------------------------------------------------------------

# 50. Content

Initial content should be represented as structured data rather than
hardcoded directly into components.

Example directories:

``` text
content/
├── hangul/
├── vocabulary/
├── lessons/
└── daily/
```

Content should be typed and validated where appropriate.

------------------------------------------------------------------------

# 51. Initial Content Strategy

Start with a small but coherent curriculum rather than attempting to
create hundreds of items immediately.

For example:

``` text
Hangul
  ↓
Basic vocabulary
  ↓
Greetings
  ↓
Introductions
  ↓
Numbers
  ↓
Time
  ↓
Daily activities
```

The goal is to validate the learning loop before massively expanding
content.

------------------------------------------------------------------------

# 52. Data Integrity

The application must protect user progress.

Never silently:

-   Delete learning records
-   Reset review schedules
-   Change historical progress
-   Overwrite imported data

When destructive operations occur, require explicit confirmation.

------------------------------------------------------------------------

# 53. Storage Migration

Every persistence model change must consider existing users.

Migration architecture should allow:

``` text
v1 → v2
v2 → v3
v3 → v4
```

Avoid writing migration logic directly into UI components.

Test migrations independently.

------------------------------------------------------------------------

# 54. Testing Strategy

Testing should cover the business rules first.

## Domain tests

Test:

-   SM-2 behavior
-   Review scheduling
-   Review ratings
-   Daily goal calculation
-   Streak calculation
-   Quiz evaluation
-   Quiz generation
-   Curriculum progression

## Application tests

Test:

-   Start lesson
-   Complete learning item
-   Submit review
-   Start quiz
-   Complete quiz
-   Generate Today dashboard
-   Export/import
-   Data migration

## Infrastructure tests

Test:

-   Repository behavior
-   Storage serialization
-   Migration behavior
-   Notification scheduling abstraction where practical

## UI tests

Focus on important user flows rather than testing every visual detail.

------------------------------------------------------------------------

# 55. Testing the SRS

The SRS implementation must have deterministic tests.

For example:

``` text
Given initial review state
When rating = Good
Then next interval should match expected behavior
```

Test edge cases such as:

-   First review
-   Again
-   Hard
-   Good
-   Easy
-   Repeated failures
-   High ease factor
-   Minimum interval
-   Date boundaries

Do not rely on random dates in algorithm tests.

------------------------------------------------------------------------

# 56. Testing Streaks

Streak logic should be isolated and tested with deterministic dates.

Test:

``` text
First learning day
Consecutive day
Missed day
Multiple missed days
Same-day activity
Timezone/date boundary
```

Use a clear date policy.

Do not scatter date arithmetic across UI components.

------------------------------------------------------------------------

# 57. Testing Quiz Generation

Quiz generation must avoid invalid questions.

For example:

-   Correct answer must exist
-   Options should not contain accidental duplicates
-   Distractors should be valid
-   Question type must match required data
-   Empty content should be handled safely

------------------------------------------------------------------------

# 58. Web Compatibility

The core architecture should remain platform-neutral.

Avoid importing React Native APIs into domain code.

Platform-specific infrastructure should be isolated.

Example:

``` text
domain
  ↓
application
  ↓
platform abstraction
  ↓
native/web implementation
```

------------------------------------------------------------------------

# 59. Dependencies

Use the planned technology stack where appropriate:

-   Expo
-   Expo Router
-   expo-speech
-   expo-notifications
-   AsyncStorage
-   Zustand
-   Zod
-   date-fns
-   Vector icons
-   Safe area context
-   Fonts as required
-   ESLint
-   Prettier
-   Husky
-   Jest

Do not add dependencies simply because they make a small task slightly
easier.

Every dependency should have a clear purpose.

------------------------------------------------------------------------

# 60. Path Aliases

Use a consistent alias such as:

``` text
@/*
```

Example:

``` ts
import { ReviewSession } from '@/domain/review'
```

Do not create multiple competing alias conventions.

------------------------------------------------------------------------

# 61. Configuration

Environment/configuration values should be centralized.

Do not scatter magic constants throughout the application.

Examples:

``` text
Daily goal defaults
SRS defaults
Storage version
Feature flags
Notification defaults
```

------------------------------------------------------------------------

# 62. Daily Learning Logic

The application should distinguish:

``` text
New items
Due reviews
Completed today
```

These should not be treated as the same thing.

A learner who completes five reviews should not automatically be
considered to have learned five new words.

The dashboard should communicate this distinction clearly.

------------------------------------------------------------------------

# 63. Progress Model

Progress should eventually represent multiple dimensions.

Examples:

``` text
Curriculum progress
Vocabulary learned
Review consistency
Quiz accuracy
Learning streak
Daily goal completion
```

Avoid reducing the entire learner state to a single percentage.

------------------------------------------------------------------------

# 64. Streak Model

A streak represents consecutive days where the user satisfies the
application's defined learning activity requirement.

Define the rule explicitly.

Example:

``` text
A day counts when the learner completes the minimum daily learning goal.
```

Do not update streaks based merely on opening the application.

------------------------------------------------------------------------

# 65. Recommended Daily Activity

Today should calculate a recommendation.

Conceptually:

``` text
If due reviews exist:
    Recommend Review

Else if today's new learning remains:
    Recommend Learn

Else if lesson progression exists:
    Recommend Continue Lesson

Else:
    Recommend Quiz / Practice
```

The exact prioritization should be implemented as application/domain
logic, not buried in JSX.

------------------------------------------------------------------------

# 66. Application State vs Persistent State

Keep these concepts separate.

### Application/session state

Examples:

-   Current quiz question
-   Current review card
-   Temporary UI state
-   Modal visibility
-   Onboarding step

Zustand is appropriate.

### Persistent state

Examples:

-   Learning records
-   Review schedule
-   User settings
-   Progress history

Repositories are appropriate.

------------------------------------------------------------------------

# 67. Offline Behavior

Klearn should work without an internet connection for all V1 core
features.

Core learning content should ship with the application.

The app should not depend on a backend to:

-   Start a lesson
-   Review cards
-   Run quizzes
-   Calculate progress
-   Maintain streaks
-   Read existing content

------------------------------------------------------------------------

# 68. Future Extensibility

The architecture should make these possible later:

``` text
Backend synchronization
Authentication
Cloud backup
Multiple devices
SQLite
IndexedDB
Remote content
Content versioning
AI tutoring
Advanced SRS
Analytics
Subscriptions
Social learning
```

However:

> Do not implement future features merely because the architecture could
> support them.

Build the smallest architecture that keeps these future paths possible.

------------------------------------------------------------------------

# 69. What Not to Over-Engineer

Do not build:

-   Microservices
-   Backend APIs
-   Complex dependency injection frameworks
-   Event buses
-   CQRS infrastructure
-   Enterprise analytics
-   Cloud infrastructure
-   Authentication
-   Plugin systems
-   Complex design-system frameworks

unless the actual V1 requirements demand them.

The architecture should be clean, not unnecessarily complicated.

------------------------------------------------------------------------

# 70. Delivery Order

Build in this order.

## Phase 1 --- Foundation

-   Expo project
-   TypeScript
-   Expo Router
-   Theme
-   Basic UI primitives
-   Path aliases
-   ESLint/Prettier
-   Logger
-   Error handling
-   Testing setup

## Phase 2 --- Domain

-   Learning item model
-   Curriculum model
-   Learning record
-   Review state
-   SRS interface
-   SM-2 implementation
-   Quiz domain
-   Streak logic
-   Daily goal logic

## Phase 3 --- Persistence

-   Storage envelope
-   AsyncStorage adapter
-   Repository implementations
-   Storage migrations
-   Tests

## Phase 4 --- Learning

-   Curriculum
-   Lessons
-   Learning item screen
-   TTS
-   Completion flow

## Phase 5 --- Review

-   Review queue
-   Review session
-   Rating UI
-   SRS persistence

## Phase 6 --- Quiz

-   Quiz generator
-   Question types
-   Quiz session
-   Results

## Phase 7 --- Today

-   Dashboard
-   Daily goal
-   Due review summary
-   Daily word
-   Streak
-   Recommendation

## Phase 8 --- Me

-   Progress
-   Settings
-   Reminder settings
-   TTS settings
-   Data management

## Phase 9 --- Notifications

-   Permission flow
-   Local scheduling
-   Reminder management

## Phase 10 --- Hardening

-   Migration tests
-   Export/import
-   Accessibility
-   Web compatibility
-   Error states
-   Performance
-   UX polish

------------------------------------------------------------------------

# 71. Agent Operating Mode

The AI coding agent must not blindly implement the specification.

Before implementing a major feature:

1.  Inspect the current codebase.
2.  Identify the relevant architectural boundaries.
3.  Confirm existing patterns.
4.  Check whether the requested feature already exists partially.
5.  Avoid duplicate abstractions.
6.  Propose changes when the specification conflicts with the actual
    codebase.
7.  Prefer the smallest correct implementation.
8.  Keep domain logic independent from UI.
9.  Add tests for business rules.
10. Validate the implementation before moving on.

------------------------------------------------------------------------

# 72. Agent Decision Rules

When uncertain:

### Prefer existing architecture

Do not introduce a new pattern if the existing architecture already
solves the problem.

### Prefer domain/application logic over UI logic

If a rule affects correctness, it belongs outside JSX.

### Prefer abstractions at real boundaries

Good boundaries:

``` text
Storage
Notifications
Speech
SRS
Quiz generation
Repositories
```

Bad abstractions:

``` text
Every tiny helper
Every component
Every function
```

### Prefer simple implementations

Do not build infrastructure for hypothetical requirements.

------------------------------------------------------------------------

# 73. Agent Interaction During Planning

The agent should support an iterative planning workflow.

If requirements are incomplete:

-   Identify ambiguity.
-   Explain the impact.
-   Propose reasonable options.
-   Ask focused questions when a decision materially affects
    architecture or product behavior.
-   Do not invent major requirements silently.

During implementation, maintain project documentation when appropriate.

Recommended project documentation:

``` text
docs/
├── architecture/
├── decisions/
├── product/
├── domain/
└── operations/
```

Architecture decisions that materially affect the system should be
recorded.

------------------------------------------------------------------------

# 74. Quality Gates

Before considering a feature complete:

## Type safety

``` text
No TypeScript errors
No any
No @ts-ignore
```

## Tests

Relevant tests pass.

## Architecture

Domain code does not depend on UI or infrastructure.

## Persistence

Existing data is not accidentally broken.

## UX

Loading, empty, error, and success states are handled.

## Accessibility

Important interactions are accessible.

## Web

Core functionality remains usable on web where supported.

## Performance

Avoid unnecessary re-renders and expensive work in render paths.

------------------------------------------------------------------------

# 75. Definition of Done

A feature is complete when:

-   It satisfies the intended user behavior.
-   It follows the architecture.
-   It has appropriate tests.
-   It handles failure states.
-   It does not introduce unnecessary dependencies.
-   It does not duplicate existing components or logic.
-   It preserves existing data.
-   It works across supported platforms where applicable.
-   It has reasonable accessibility.
-   It is understandable to another developer.

------------------------------------------------------------------------

# 76. Core Product Principle

The most important rule for Klearn is:

> **Do not optimize for the number of features. Optimize for the quality
> of the daily learning loop.**

The learner should be able to open Klearn and immediately understand:

``` text
What should I do today?
Why should I do it?
How much have I completed?
What should I do next?
```

Everything else is secondary.
