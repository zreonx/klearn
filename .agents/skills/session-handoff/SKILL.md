---
name: session-handoff
description: >-
  Manage session continuity, context onboarding, and handoff documentation for Klearn.
  Use when starting a new development session, wrapping up a milestone, or when the user
  asks for a project status summary or handoff update.
---

# Session Handoff & Context Continuity Skill

This skill ensures seamless context transfer across agent sessions and human-agent pair programming on **Klearn**.

---

## 1. Starting a Session (Onboarding)

When resuming development or starting a complex task:

1. Read [`.agents/docs/HANDOFF.md`](../../docs/HANDOFF.md) to review the current release version, recently completed milestones, platform gotchas, and next backlog priorities.
2. Check [`CHANGELOG.md`](../../../CHANGELOG.md) and [`ARCHITECTURE.md`](../../../ARCHITECTURE.md) if working on core architecture or release tasks.
3. Inspect workspace state:
   ```bash
   git status -s
   git log -n 5 --oneline
   ```

---

## 2. Completing a Milestone or Session (Handoff Update)

Before wrapping up a significant feature, bug fix, or release:

1. **Run Quality Gates**:
   ```bash
   npx tsc --noEmit
   npm test -- --runInBand
   ```
2. **Update [`.agents/docs/HANDOFF.md`](../../docs/HANDOFF.md)**:
   - Update **Current Project Snapshot** (version, test suite counts, verification status).
   - Add the completed work to **Recently Completed Milestones**.
   - Document any newly discovered platform quirks under **Important Platform Notes & Gotchas**.
   - Check off completed items and add follow-up tasks under **Next Recommended Priorities**.
   - Update the **Last Session Summary** block with changed files, verification results, and next steps.
