# Testing, Verification & Documentation Hygiene

1. **Mandatory Verification Gate**:
   - Before completing any code or content task, always execute:
     - `npx tsc --noEmit`
     - `npm test -- --runInBand`
2. **Domain & Use-Case Test Coverage**:
   - Any changes to SM-2 scheduling (`src/domain/srs/`), streak calculation (`src/domain/streak/`), quiz generation (`src/domain/quiz/`), repositories (`src/infrastructure/storage/repositories/`), or use cases (`src/application/useCases/`) must include corresponding unit tests.
3. **Documentation & Handoff Hygiene**:
   - When adding user-visible features, fixes, or curriculum updates, record them in [`CHANGELOG.md`](../../CHANGELOG.md).
   - When changing architectural boundaries or storage schemas, update [`ARCHITECTURE.md`](../../ARCHITECTURE.md).
   - When completing a major milestone or ending a session, update [`.agents/docs/HANDOFF.md`](../docs/HANDOFF.md).
