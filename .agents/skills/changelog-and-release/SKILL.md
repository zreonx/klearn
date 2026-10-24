---
name: changelog-and-release
description: >-
  Maintain CHANGELOG.md, bump semantic versions, build standalone Android APKs,
  and publish tagged GitHub Releases for Klearn. Use whenever the user asks to
  document changes, cut a release, tag a version, or build a release APK.
---

# Changelog & Release Management Skill

Follow this runbook whenever documenting releases, bumping versions, building standalone APKs, or tagging releases on GitHub.

---

## 1. Documenting Changes in `CHANGELOG.md`

1. Follow the [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) specification and [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
2. Group entries under `## [X.Y.Z] - YYYY-MM-DD` (or `## [Unreleased]`) using standard subsections:
   - `### Added` — New features, curriculum stages/lessons, or capabilities.
   - `### Changed` — Refinements to existing UI, learning loop, or architecture.
   - `### Fixed` — Bug fixes, layout/safe-area fixes, or asset corrections.
   - `### Removed` — Deprecated or removed code/assets.
3. Update the version comparison link at the bottom of [`CHANGELOG.md`](../../../CHANGELOG.md):
   ```markdown
   [X.Y.Z]: https://github.com/zreonx/klearn/compare/vPREV...vX.Y.Z
   ```

---

## 2. Version Synchronization

When cutting a new release `X.Y.Z`, keep version numbers synchronized across:
- [`package.json`](../../../package.json): `"version": "X.Y.Z"`
- [`app.json`](../../../app.json):
  - `expo.version`: `"X.Y.Z"`
  - `expo.android.versionCode`: increment integer by `1`
  - `expo.ios.buildNumber`: increment integer string by `1`

---

## 3. Pre-Release Verification & Tagging

1. Read the complete checklist in [`.agents/docs/RELEASE_RUNBOOK.md`](../../docs/RELEASE_RUNBOOK.md).
2. Run mandatory verification:
   ```bash
   npx tsc --noEmit
   npm test -- --runInBand
   ```
3. Commit, create an annotated git tag, and push to trigger [`.github/workflows/release.yml`](../../../.github/workflows/release.yml):
   ```bash
   git add .
   git commit -m "chore(release): prepare vX.Y.Z"
   git tag -a vX.Y.Z -m "Klearn vX.Y.Z"
   git push origin main
   git push origin vX.Y.Z
   ```
4. Update [`.agents/docs/HANDOFF.md`](../../docs/HANDOFF.md) with the new release tag.
