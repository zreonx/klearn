import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@/app/providers/ThemeProvider';

export interface ProgressBarProps {
  progress: number; // 0 to 1
  color?: string;
  backgroundColor?: string;
  height?: number;
  style?: ViewStyle;
}

export function ProgressBar({
  progress,
  color,
  backgroundColor,
  height = 8,
  style,
}: ProgressBarProps) {
  const { colors } = useTheme();
  const clampedProgress = Math.min(Math.max(progress, 0), 1);

  const activeColor = color ?? colors.primary;
  const activeBg = backgroundColor ?? colors.surfaceSubtle;

  return (
    <View
      style={[
        styles.track,
        {
          backgroundColor: activeBg,
          height,
          borderRadius: height / 2,
        },
        style,
      ]}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: Math.round(clampedProgress * 100) }}
    >
      <View
        style={[
          styles.fill,
          {
            backgroundColor: activeColor,
            width: `${clampedProgress * 100}%`,
            height,
            borderRadius: height / 2,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: '100%',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
  },
});
