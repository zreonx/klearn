---
name: architecture-guardian
description: >-
  Audit, extend, and enforce Klearn's local-first Clean Architecture boundaries,
  domain models, use cases, quiz types, and versioned storage repositories.
  Use when refactoring architecture, adding new domain features, or modifying storage schemas.
---

# Architecture Guardian Skill

Use this skill when designing new features, adding domain logic, extending quiz question formats, or modifying persistence schemas in **Klearn**.

---

## 1. Architectural Reference

Always consult [`ARCHITECTURE.md`](../../../ARCHITECTURE.md) and [`.agents/rules/architecture-boundaries.md`](../../rules/architecture-boundaries.md) before introducing new modules or cross-layer imports.

### Layer Dependency Rule
```text
app/ & src/components/ui/ (Presentation)
  ↓
src/application/ (Use Cases & Services)
  ↓
src/domain/ & src/content/ (Pure Domain & Static Catalog)
```
`src/infrastructure/` implements persistence, TTS, and notification adapters consumed by `src/application/` and `app/`.

---

## 2. Common Extension Playbooks

### Playbook A: Adding a New Use Case
1. Create or update the pure domain calculation in `src/domain/`.
2. Add or extend the use case in `src/application/useCases/`.
3. Expose the operation through `LearningService` in `src/application/services/LearningService.ts`.
4. Add unit tests in `src/application/useCases/useCases.test.ts`.

### Playbook B: Adding a New Quiz Question Format
1. Add the new type to `QuizQuestionType` in `src/domain/quiz/`.
2. Implement distractor selection and prompt construction in `src/domain/quiz/generator.ts`.
3. Add deterministic unit tests in `src/domain/quiz/generator.test.ts`.
4. Render the new question layout in `app/quiz/session.tsx` using theme tokens (`useTheme()`).

### Playbook C: Updating Storage Schemas
1. Update the entity type and `zod` validation schema in `src/infrastructure/storage/`.
2. Ensure backward compatibility or version envelope migration (`StorageEnvelope<T>`) so existing local user data in `AsyncStorage` is preserved.
3. Add repository persistence and backup/import tests in `src/infrastructure/storage/repositories/repositories.test.ts`.

---

## 3. Audit & Verification Commands

```bash
# 1. Verify zero TypeScript or boundary errors
npx tsc --noEmit

# 2. Run all domain, repository, and application use-case tests
npm test -- --runInBand
```
