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
import { theme } from './theme';
import { Typography } from './Typography';

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
  const getBackgroundColor = (pressed: boolean) => {
    if (disabled) return theme.colors.surfaceSubtle;
    switch (variant) {
      case 'primary':
        return pressed ? '#0284C7' : theme.colors.primary;
      case 'secondary':
        return pressed ? theme.colors.surfaceSubtle : theme.colors.surfaceElevated;
      case 'outline':
        return pressed ? theme.colors.surface : 'transparent';
      case 'ghost':
        return pressed ? theme.colors.surface : 'transparent';
      case 'destructive':
        return pressed ? '#DC2626' : theme.colors.destructive;
      default:
        return theme.colors.primary;
    }
  };

  const getTextColor = (): keyof typeof theme.colors => {
    if (disabled) return 'foregroundSubtle';
    switch (variant) {
      case 'primary':
        return 'primaryForeground';
      case 'secondary':
      case 'outline':
      case 'ghost':
        return 'foreground';
      case 'destructive':
        return 'foreground';
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
          backgroundColor: getBackgroundColor(pressed),
          borderColor:
            variant === 'outline'
              ? disabled
                ? theme.colors.borderSubtle
                : theme.colors.border
              : 'transparent',
          borderWidth: variant === 'outline' ? 1 : 0,
          opacity: disabled ? 0.6 : 1,
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
          color={variant === 'primary' ? theme.colors.primaryForeground : theme.colors.foreground}
        />
      ) : (
        <View style={styles.content}>
          {icon ? <View style={styles.iconContainer}>{icon}</View> : null}
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
    borderRadius: theme.radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginRight: theme.spacing.sm,
  },
});
