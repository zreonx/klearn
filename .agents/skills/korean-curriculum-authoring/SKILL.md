---
name: korean-curriculum-authoring
description: >-
  Author, expand, and validate Korean lessons, Hangul data, vocabulary, phrases,
  and grammar items across Klearn's 5-stage proficiency journey and 6-skill engine.
  Use whenever adding or editing Korean educational content in src/content/.
---

# Korean Curriculum Authoring Skill

Use this skill when adding or refining Korean lessons, vocabulary, grammar patterns, or Hangul reference data in `src/content/`.

---

## 1. Curriculum & Content References

Before authoring new content, review:
- [`.agents/docs/CURRICULUM_ROADMAP.md`](../../docs/CURRICULUM_ROADMAP.md) — The 5-stage proficiency journey and unit progression plan.
- [`.agents/rules/korean-content-standards.md`](../../rules/korean-content-standards.md) — Orthography, Revised Romanization, and explanation rules.
- [`src/content/catalog.ts`](../../../src/content/catalog.ts) — Curriculum hierarchy (`Level` → `Unit` → `Lesson` → `LearningItem`).

---

## 2. Authoring Checklist for `LearningItem`

Every `LearningItem` added to `src/content/` must include:
1. **`id`**: Unique, deterministic identifier (e.g., `vocab-food-bibimbap`, `grammar-particle-eun-neun`).
2. **`type`**: `'hangul' | 'vocabulary' | 'phrase' | 'grammar'`.
3. **`korean`**: Accurate standard Korean (표준어) with proper spacing (띄어쓰기).
4. **`romanization`**: Standard Revised Romanization of Korean.
5. **`translation`**: Clear, natural English meaning.
6. **`explanation`**: Concise usage note (politeness level, batchim rule, cultural nuance, or literal breakdown).
7. **`examples`**: At least 1–2 realistic `ExampleSentence` objects (`korean`, `romanization`, `translation`).
8. **`lessonId` & `tags`**: Properly linked to its parent `Lesson.id` and relevant skill/topic tags.

---

## 3. Validation Steps

After editing any file in `src/content/`:

1. Run the catalog & Hangul integrity tests:
   ```bash
   npm test -- src/content/catalog.test.ts src/content/hangul/alphabetData.test.ts
   ```
2. Run the full TypeScript check:
   ```bash
   npx tsc --noEmit
   ```
