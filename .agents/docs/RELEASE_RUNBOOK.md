# Klearn — Release & CI/CD Runbook

This runbook documents how to verify, version, build, tag, and release **Klearn**.

---

## 1. Pre-Release Verification Gate

Every release must pass all local quality gates before bumping versions or tagging:

```bash
# 1. Static TypeScript check
npx tsc --noEmit

# 2. Full unit & domain test suite
npm test -- --runInBand

# 3. Verify web static export
npx expo export --platform web
```

---

## 2. Version Bump & Changelog Checklist

1. **Determine Semantic Version (`MAJOR.MINOR.PATCH`)**:
   - `MAJOR`: Incompatible data schema changes or major product overhaul.
   - `MINOR`: New curriculum stages/lessons, quiz modes, or features.
   - `PATCH`: Bug fixes, UI polish, safe-area tweaks, or asset updates.
2. **Update Version Metadata**:
   - `package.json` → `"version": "X.Y.Z"`
   - `app.json` → `expo.version: "X.Y.Z"`, `expo.android.versionCode` (+1), `expo.ios.buildNumber` (+1)
3. **Update [`CHANGELOG.md`](../../CHANGELOG.md)**:
   - Add a `## [X.Y.Z] - YYYY-MM-DD` section under `# Changelog` with `Added`, `Changed`, `Fixed`, or `Removed` subsections.
   - Add the comparison link at the bottom of `CHANGELOG.md`.
4. **Update [`.agents/docs/HANDOFF.md`](./HANDOFF.md)**:
   - Update `Current Version` and `Recently Completed Milestones`.

---

## 3. Automated GitHub Release (Recommended)

Pushing a `v*.*.*` tag triggers [`.github/workflows/release.yml`](../../.github/workflows/release.yml), which automatically verifies the repo, runs `npx expo prebuild --platform android`, builds the standalone Release APK on Ubuntu with Java 21 + Android SDK, computes the SHA-256 checksum, extracts the version's notes from `CHANGELOG.md`, and publishes the GitHub Release.

```bash
git add .
git commit -m "chore(release): prepare vX.Y.Z"
git tag -a vX.Y.Z -m "Klearn vX.Y.Z"
git push origin main
git push origin vX.Y.Z
```

---

## 4. Local Standalone Android APK Build (Windows PowerShell)

To build the standalone signed Release APK locally:

```powershell
# 1. Regenerate native Android project if app.json or plugins changed
npx expo prebuild --platform android

# 2. Ensure android/local.properties points to Android SDK
"sdk.dir=C\:\\Users\\Zorenl\\AppData\\Local\\Android\\Sdk" | Set-Content android/local.properties

# 3. Build Release APK using Android Studio OpenJDK 21
$env:JAVA_HOME="C:\Program Files\Android\openjdk\jdk-21.0.8"
$env:ANDROID_HOME="$env:LOCALAPPDATA\Android\Sdk"
cd android
.\gradlew.bat assembleRelease
cd ..

# 4. Copy artifact to root and release/ directory
Copy-Item "android/app/build/outputs/apk/release/app-release.apk" "klearn-release.apk" -Force
Copy-Item "android/app/build/outputs/apk/release/app-release.apk" "release/klearn-vX.Y.Z.apk" -Force
```
