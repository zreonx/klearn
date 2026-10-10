import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { theme } from './theme';
import { Typography } from './Typography';

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
  const getColors = (): { bg: string; text: keyof typeof theme.colors } => {
    switch (variant) {
      case 'hangul':
        return { bg: 'rgba(167, 139, 250, 0.16)', text: 'hangulAccent' };
      case 'vocab':
        return { bg: 'rgba(56, 189, 248, 0.16)', text: 'vocabAccent' };
      case 'grammar':
        return { bg: 'rgba(244, 114, 182, 0.16)', text: 'grammarAccent' };
      case 'success':
        return { bg: 'rgba(16, 185, 129, 0.16)', text: 'success' };
      case 'warning':
        return { bg: 'rgba(245, 158, 11, 0.16)', text: 'warning' };
      case 'destructive':
        return { bg: 'rgba(239, 68, 68, 0.16)', text: 'destructive' };
      default:
        return { bg: theme.colors.surfaceElevated, text: 'foregroundMuted' };
    }
  };

  const { bg, text } = getColors();

  return (
    <View style={[styles.badge, { backgroundColor: bg }, style]}>
      <Typography variant="caption" weight="600" color={text}>
        {label}
      </Typography>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: theme.radii.full,
    alignSelf: 'flex-start',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
