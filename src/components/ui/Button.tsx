import React from 'react';
import {
  Pressable,
  PressableProps,
  StyleSheet,
  ActivityIndicator,
  View,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { ThemeColors } from './theme';
import { Typography } from './Typography';
import { useTheme } from '@/app/providers/ThemeProvider';

export interface ButtonProps extends Omit<PressableProps, 'style'> {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function Button({
  title,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  fullWidth = false,
  style,
  ...rest
}: ButtonProps) {
  const { colors, theme } = useTheme();

  const getBackgroundColor = (pressed: boolean) => {
    if (disabled) return colors.surfaceSubtle;
    switch (variant) {
      case 'primary':
        return pressed ? colors.primaryPressed : colors.primary;
      case 'secondary':
        return pressed ? colors.surfaceSubtle : colors.surfaceElevated;
      case 'outline':
        return pressed ? colors.surfaceSubtle : 'transparent';
      case 'ghost':
        return pressed ? colors.surfaceSubtle : 'transparent';
      case 'destructive':
        return pressed ? colors.destructiveSurface : colors.destructive;
      default:
        return colors.primary;
    }
  };

  const getTextColor = (): keyof ThemeColors => {
    if (disabled) return 'foregroundSubtle';
    switch (variant) {
      case 'primary':
        return 'primaryForeground';
      case 'secondary':
      case 'outline':
      case 'ghost':
        return 'foreground';
      case 'destructive':
        return 'primaryForeground';
      default:
        return 'primaryForeground';
    }
  };

  const sizeStyles = {
    sm: { paddingVertical: theme.spacing.xs, paddingHorizontal: theme.spacing.md, height: 36 },
    md: { paddingVertical: theme.spacing.sm, paddingHorizontal: theme.spacing.lg, height: 48 },
    lg: { paddingVertical: theme.spacing.md, paddingHorizontal: theme.spacing['2xl'], height: 56 },
  }[size];

  return (
    <Pressable
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        sizeStyles,
        {
          borderRadius: theme.radii.md,
          backgroundColor: getBackgroundColor(pressed),
          borderColor:
            variant === 'outline'
              ? disabled
                ? colors.borderSubtle
                : colors.border
              : 'transparent',
          borderWidth: variant === 'outline' ? 1 : 0,
          opacity: disabled ? 0.5 : 1,
          width: fullWidth ? '100%' : 'auto',
        },
        style,
      ]}
      accessibilityRole="button"
      {...rest}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? colors.primaryForeground : colors.foreground}
        />
      ) : (
        <View style={styles.content}>
          {icon ? <View style={[styles.iconContainer, { marginRight: theme.spacing.sm }]}>{icon}</View> : null}
          <Typography
            variant={size === 'sm' ? 'caption' : 'body'}
            weight="600"
            color={getTextColor()}
          >
            {title}
          </Typography>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {},
});
