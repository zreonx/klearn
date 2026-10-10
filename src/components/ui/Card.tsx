import React from 'react';
import {
  View,
  ViewProps,
  Pressable,
  PressableProps,
  StyleSheet,
  ViewStyle,
  StyleProp,
} from 'react-native';
import { theme } from './theme';

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
  const backgroundColor = subtle
    ? theme.colors.surfaceSubtle
    : elevated
    ? theme.colors.surfaceElevated
    : theme.colors.surface;

  const cardStyle: ViewStyle = {
    backgroundColor,
    borderRadius: theme.radii.lg,
    borderWidth: bordered ? 1 : 0,
    borderColor: elevated ? theme.colors.border : theme.colors.borderSubtle,
    padding: theme.spacing.lg,
  };

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          cardStyle,
          { opacity: pressed ? 0.88 : 1 },
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
