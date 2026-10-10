import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Typography } from './Typography';
import { useTheme } from '@/app/providers/ThemeProvider';
import { ThemeColors } from './theme';

export type BadgeVariant =
  | 'default'
  | 'hangul'
  | 'vocab'
  | 'grammar'
  | 'success'
  | 'warning'
  | 'destructive';

export interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  style?: ViewStyle;
}

export function Badge({ label, variant = 'default', style }: BadgeProps) {
  const { colors, theme } = useTheme();

  const getColors = (): { bg: string; text: keyof ThemeColors } => {
    switch (variant) {
      case 'hangul':
        return {
          bg: theme.isDark ? 'rgba(159, 217, 192, 0.15)' : 'rgba(45, 125, 104, 0.12)',
          text: 'hangulAccent',
        };
      case 'vocab':
        return {
          bg: theme.isDark ? 'rgba(120, 185, 155, 0.15)' : 'rgba(23, 107, 85, 0.12)',
          text: 'vocabAccent',
        };
      case 'grammar':
        return {
          bg: theme.isDark ? 'rgba(233, 154, 126, 0.15)' : 'rgba(197, 104, 77, 0.12)',
          text: 'grammarAccent',
        };
      case 'success':
        return { bg: colors.successSurface, text: 'success' };
      case 'warning':
        return { bg: colors.warningSurface, text: 'warning' };
      case 'destructive':
        return { bg: colors.destructiveSurface, text: 'destructive' };
      default:
        return { bg: colors.surfaceSubtle, text: 'foregroundMuted' };
    }
  };

  const { bg, text } = getColors();

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: bg,
          borderRadius: theme.radii.full,
          paddingHorizontal: theme.spacing.sm,
        },
        style,
      ]}
    >
      <Typography variant="caption" weight="600" color={text}>
        {label}
      </Typography>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingVertical: 3,
    alignSelf: 'flex-start',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
