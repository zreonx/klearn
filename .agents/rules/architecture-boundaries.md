# Architecture & Layer Boundary Rules

1. **Strict Layer Separation**:
   - `src/domain/`: Pure TypeScript business logic (Curriculum, SRS SM-2, Quiz Generator, Streak Calculator). Must **never** import `react`, `react-native`, `expo-*`, or `@react-native-async-storage/async-storage`.
   - `src/content/`: Static, immutable Korean curriculum definitions (`LearningItem`, `Lesson`, `Unit`, `Level`, Hangul data). Must **never** store mutable user progress.
   - `src/application/`: Application services (`LearningService`) and Use Cases (`useCases/`). Orchestrates domain models and repository interfaces.
   - `src/infrastructure/`: Concrete adapters (`storage/`, `audio/`, `notifications/`). All `AsyncStorage` operations and versioned `StorageEnvelope<T>` serialization must stay inside `src/infrastructure/storage/`.
   - `app/` & `src/components/ui/`: Expo Router screens and reusable UI components. Must **never** access `AsyncStorage` directly; always go through `LearningService` or application use cases.

2. **Content ≠ User State**:
   - Never mutate objects exported from `src/content/`.
   - User progress, review history, and SM-2 state must always be persisted and queried as separate `LearningRecord` entities via `LearningRepository`.
