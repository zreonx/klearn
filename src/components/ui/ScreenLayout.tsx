import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  ViewStyle,
  StyleProp,
  Platform,
  KeyboardAvoidingView,
  RefreshControlProps,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/app/providers/ThemeProvider';

export interface ScreenLayoutProps {
  children: React.ReactNode;
  /** Whether the screen should scroll (default: true) */
  scrollable?: boolean;
  /** Custom style for the outer container */
  style?: StyleProp<ViewStyle>;
  /** Custom style for the inner content / scroll container */
  contentContainerStyle?: StyleProp<ViewStyle>;
  /**
   * Safe area handling mode:
   * - 'top-only': tab screens where bottom tabs handle bottom insets
   * - 'full': modals, stacks, or standalone screens needing both top and bottom safe area
   * - 'bottom-only': screens with native navigation header (Stack) that already handles top safe area
   * - 'none': custom safe area handling
   * @default 'top-only'
   */
  safeAreaMode?: 'top-only' | 'full' | 'bottom-only' | 'none';
  /** Fixed footer pinned to bottom (e.g. action buttons) */
  footer?: React.ReactNode;
  /** Refresh control component for pull-to-refresh */
  refreshControl?: React.ReactElement<RefreshControlProps>;
  /** Enable keyboard avoiding behavior (default: false) */
  keyboardAvoiding?: boolean;
}

/**
 * ScreenLayout provides a resilient, responsive application layout foundation.
 * It systematically handles:
 * - Dynamic system insets (status bars, notches, display cutouts, navigation bars)
 * - Safe spacing without double insets
 * - Keyboard avoidance on iOS & Android
 * - Theme-aware background rendering
 */
export function ScreenLayout({
  children,
  scrollable = true,
  style,
  contentContainerStyle,
  safeAreaMode = 'top-only',
  footer,
  refreshControl,
  keyboardAvoiding = false,
}: ScreenLayoutProps) {
  const { colors, theme } = useTheme();
  const insets = useSafeAreaInsets();

  const topInset =
    safeAreaMode === 'top-only' || safeAreaMode === 'full'
      ? Math.max(insets.top + 10, theme.spacing.xl)
      : 0;

  const bottomInset =
    safeAreaMode === 'full' || safeAreaMode === 'bottom-only'
      ? Math.max(insets.bottom, theme.spacing.lg)
      : theme.spacing['4xl'];

  const containerContent = scrollable ? (
    <ScrollView
      style={styles.scrollFlex}
      contentContainerStyle={[
        styles.scrollContent,
        {
          paddingHorizontal: theme.spacing.lg,
          paddingTop: topInset,
          paddingBottom: footer ? theme.spacing.lg : bottomInset,
        },
        contentContainerStyle,
      ]}
      keyboardShouldPersistTaps="handled"
      refreshControl={refreshControl}
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  ) : (
    <View
      style={[
        styles.staticContent,
        {
          paddingHorizontal: theme.spacing.lg,
          paddingTop: topInset,
          paddingBottom: footer ? 0 : bottomInset,
        },
        contentContainerStyle,
      ]}
    >
      {children}
    </View>
  );

  const footerArea = footer ? (
    <View
      style={[
        styles.footerContainer,
        {
          backgroundColor: colors.surfaceSubtle,
          borderTopColor: colors.borderSubtle,
          paddingHorizontal: theme.spacing.lg,
          paddingTop: theme.spacing.md,
          paddingBottom: Math.max(insets.bottom, theme.spacing.lg),
        },
      ]}
    >
      {footer}
    </View>
  ) : null;

  const body = (
    <View style={[styles.root, { backgroundColor: colors.background }, style]}>
      {containerContent}
      {footerArea}
    </View>
  );

  if (keyboardAvoiding) {
    return (
      <KeyboardAvoidingView
        style={styles.root}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {body}
      </KeyboardAvoidingView>
    );
  }

  return body;
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scrollFlex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  staticContent: {
    flex: 1,
  },
  footerContainer: {
    borderTopWidth: 1,
  },
});
