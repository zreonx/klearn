# Klearn — Project Rules & Guidelines

## 1. Design & Layout Principles

Klearn adheres to a **Premium Minimalist** design philosophy with the signature **Deep Jade + Warm Ivory** (Light) and **Muted Jade + Ink Charcoal** (Dark) themes.

### Safe-Area & System Inset Rules
1. **Dynamic Inset Handling**:
   - Always wrap root stacks in `<SafeAreaProvider>` from `react-native-safe-area-context`.
   - Never use hardcoded device heights, fixed top coordinates (`top: 40`), or arbitrary bottom offsets.
   - Use `useSafeAreaInsets()` dynamically or the shared [`<ScreenLayout>`](file:///D:/Projects/klearn/src/components/ui/ScreenLayout.tsx) component.
2. **Tab Navigation**:
   - Always keep tab screen headers hidden in tab navigators (`headerShown: false`) to prevent duplicate titles.
   - Tab bars must compute dynamic height and bottom padding using `insets.bottom`:
     ```tsx
     const bottomInset = Math.max(insets.bottom, 8);
     tabBarStyle: {
       height: 56 + bottomInset,
       paddingBottom: bottomInset,
       paddingTop: 6,
     }
     ```
   - Tab screens must apply safe top padding below status bars and display cutouts (`Math.max(insets.top + 12, theme.spacing.xl)`).
3. **Footers, Floating Action Bars & Modals**:
   - Pinned bottom bars (e.g. SRS flashcard rating bars, quiz check answer buttons) must apply bottom safe padding: `paddingBottom: Math.max(insets.bottom, theme.spacing.lg)`.
   - Scrollable containers behind pinned footers must include appropriate bottom padding so the last item is never obscured.
4. **Android & iOS System UI**:
   - Ensure support for both Android 3-button navigation (Back, Home, Recent) and gesture navigation pills.
   - Synchronize `<StatusBar style={isDark ? 'light' : 'dark'} />` with the active theme.

## 2. Token-Based UI & Theming

1. **Semantic Design Tokens**:
   - Never hardcode raw hex values in screen components or stylesheets.
   - Always consume `useTheme()` for `colors` and `theme` (spacing, radii, typography).
   - Brand tokens:
     - Light: Primary `#176B55` (Deep Jade), Background `#F8F7F2` (Warm Ivory), Accent `#C5684D`.
     - Dark: Primary `#78B99B` (Muted Jade), Background `#151C1A` (Ink Charcoal), Accent `#E99A7E`.
2. **Korean Typography & Readability**:
   - Keep Korean Hangul text prominent, comfortable, and readable.
   - Maintain appropriate line heights to prevent Korean syllable clipping.
   - Keep translations and romanizations visually subordinate to Korean glyphs.

## 3. Architecture & Local-First Guarantees

1. **Offline & Local Storage**:
   - All learning records, SRS schedules, and settings must persist locally via AsyncStorage repositories.
   - Network connectivity should never be required for learning or reviewing.
2. **Verification & Stability**:
   - Before completing tasks, always run `npx tsc --noEmit` and `npm test`.
