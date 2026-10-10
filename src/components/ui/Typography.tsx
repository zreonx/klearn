import React from 'react';
import { Text as RNText, TextProps as RNTextProps } from 'react-native';
import { ThemeColors } from './theme';
import { useTheme } from '@/app/providers/ThemeProvider';

export interface TypographyProps extends RNTextProps {
  variant?: 'display' | 'heading' | 'title' | 'bodyLarge' | 'body' | 'label' | 'caption';
  color?: keyof ThemeColors;
  align?: 'left' | 'center' | 'right';
  weight?: '400' | '500' | '600' | '700';
  children: React.ReactNode;
}

export function Typography({
  variant = 'body',
  color = 'foreground',
  align = 'left',
  weight,
  style,
  children,
  ...rest
}: TypographyProps) {
  const { colors, theme } = useTheme();
  const tokenTypography = theme.typography[variant];
  const textColor = colors[color] ?? colors.foreground;

  return (
    <RNText
      style={[
        tokenTypography,
        { color: textColor, textAlign: align },
        weight ? { fontWeight: weight } : null,
        style,
      ]}
      {...rest}
    >
      {children}
    </RNText>
  );
}

// Convenient aliases
export const Display = (props: Omit<TypographyProps, 'variant'>) => (
  <Typography variant="display" {...props} />
);
export const Heading = (props: Omit<TypographyProps, 'variant'>) => (
  <Typography variant="heading" {...props} />
);
export const Title = (props: Omit<TypographyProps, 'variant'>) => (
  <Typography variant="title" {...props} />
);
export const Body = (props: Omit<TypographyProps, 'variant'>) => (
  <Typography variant="body" {...props} />
);
export const Caption = (props: Omit<TypographyProps, 'variant'>) => (
  <Typography variant="caption" color="foregroundMuted" {...props} />
);
export const Label = (props: Omit<TypographyProps, 'variant'>) => (
  <Typography variant="label" {...props} />
);
