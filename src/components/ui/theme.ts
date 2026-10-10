export const theme = {
  colors: {
    // Dark-first palette (calm, minimal, refined)
    background: '#0B0F17',
    surface: '#151D2A',
    surfaceElevated: '#1E293B',
    surfaceSubtle: '#111722',
    border: '#27354A',
    borderSubtle: '#1C2636',

    // Text & foreground
    foreground: '#F8FAFC',
    foregroundMuted: '#94A3B8',
    foregroundSubtle: '#64748B',

    // Brand accent (Korean indigo / clean ultramarine accent)
    primary: '#38BDF8',
    primaryForeground: '#09131F',
    primaryMuted: '#0369A1',

    // Semantic status
    success: '#10B981',
    successSurface: '#064E3B',
    warning: '#F59E0B',
    warningSurface: '#78350F',
    destructive: '#EF4444',
    destructiveSurface: '#7F1D1D',

    // Accents for learning tags & categories
    hangulAccent: '#A78BFA',
    vocabAccent: '#38BDF8',
    grammarAccent: '#F472B6',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    '2xl': 24,
    '3xl': 32,
    '4xl': 40,
    '5xl': 48,
    '6xl': 64,
  },
  radii: {
    sm: 6,
    md: 10,
    lg: 14,
    xl: 20,
    full: 9999,
  },
  typography: {
    display: {
      fontSize: 32,
      lineHeight: 40,
      fontWeight: '700' as const,
      letterSpacing: -0.5,
    },
    heading: {
      fontSize: 24,
      lineHeight: 32,
      fontWeight: '700' as const,
      letterSpacing: -0.3,
    },
    title: {
      fontSize: 18,
      lineHeight: 26,
      fontWeight: '600' as const,
      letterSpacing: -0.2,
    },
    bodyLarge: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: '400' as const,
    },
    body: {
      fontSize: 14,
      lineHeight: 20,
      fontWeight: '400' as const,
    },
    label: {
      fontSize: 13,
      lineHeight: 18,
      fontWeight: '600' as const,
      letterSpacing: 0.2,
    },
    caption: {
      fontSize: 12,
      lineHeight: 16,
      fontWeight: '400' as const,
      letterSpacing: 0.1,
    },
  },
} as const;

export type Theme = typeof theme;
