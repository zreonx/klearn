# Korean Content & Pedagogical Standards

1. **Hangul Orthography & Accuracy**:
   - All Korean text (`korean` field and example sentences) must use accurate modern standard Korean (표준어) spelling and natural spacing (띄어쓰기).
2. **Romanization**:
   - Always follow the **Revised Romanization of Korean** (국어의 로마자 표기법) consistently across lessons, Hangul charts, and examples.
3. **Pedagogical Clarity**:
   - Provide concise, learner-friendly `explanation` notes highlighting politeness levels (해요체 vs. 합쇼체 vs. 반말), particle attachment rules (batchim vs. no-batchim), or pronunciation assimilation when relevant.
   - Every vocabulary, phrase, and grammar item should include at least one natural `ExampleSentence` (`korean`, `romanization`, `translation`).
4. **Catalog Integrity**:
   - Every `LearningItem`, `Lesson`, `Unit`, and `Level` must have a unique, deterministic `id`.
   - Whenever modifying `src/content/`, always run `npm test -- src/content/catalog.test.ts` to validate referential integrity.
