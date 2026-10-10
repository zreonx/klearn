import React from 'react';
import {
  View,
  ViewProps,
  Pressable,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { useTheme } from '@/app/providers/ThemeProvider';

export interface CardProps extends ViewProps {
  elevated?: boolean;
  subtle?: boolean;
  bordered?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}

export function Card({
  elevated = false,
  subtle = false,
  bordered = true,
  onPress,
  style,
  children,
  ...rest
}: CardProps) {
  const { colors, theme } = useTheme();

  const backgroundColor = subtle
    ? colors.surfaceSubtle
    : elevated
    ? colors.surfaceElevated
    : colors.surface;

  const cardStyle: ViewStyle = {
    backgroundColor,
    borderRadius: theme.radii.lg,
    borderWidth: bordered ? 1 : 0,
    borderColor: elevated ? colors.border : colors.borderSubtle,
    padding: theme.spacing.lg,
  };

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          cardStyle,
          { opacity: pressed ? 0.85 : 1 },
          style,
        ]}
        accessibilityRole="button"
      >
        {children}
      </Pressable>
    );
  }

  return (
    <View style={[cardStyle, style]} {...rest}>
      {children}
    </View>
  );
}
