export interface ThemeColors {
  readonly primary: string;
  readonly primaryPressed: string;
  readonly primaryForeground: string;
  readonly primaryMuted: string;
  readonly background: string;
  readonly surface: string;
  readonly surfaceElevated: string;
  readonly surfaceSubtle: string;
  readonly secondarySurface: string;
  readonly foreground: string;
  readonly foregroundMuted: string;
  readonly foregroundSubtle: string;
  readonly border: string;
  readonly borderSubtle: string;
  readonly accent: string;
  readonly success: string;
  readonly successSurface: string;
  readonly warning: string;
  readonly warningSurface: string;
  readonly destructive: string;
  readonly destructiveSurface: string;
  readonly info: string;
  readonly infoSurface: string;
  readonly hangulAccent: string;
  readonly vocabAccent: string;
  readonly grammarAccent: string;
}

export const lightColors: ThemeColors = {
  // Brand & Background (Deep Jade + Warm Ivory)
  primary: '#176B55',
  primaryPressed: '#105441',
  primaryForeground: '#FFFFFF',
  primaryMuted: '#105441',
  background: '#F8F7F2',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  surfaceSubtle: '#EEEEE6',
  secondarySurface: '#EEEEE6',

  // Typography
  foreground: '#202923',
  foregroundMuted: '#626B64',
  foregroundSubtle: '#8B948D',

  // Dividers & Borders
  border: '#E2E3DA',
  borderSubtle: '#ECECE5',

  // Accent & Milestone Highlights (Persimmon)
  accent: '#C5684D',

  // Semantic Status
  success: '#287D4F',
  successSurface: '#EAF5EF',
  warning: '#93621A',
  warningSurface: '#FAF2E4',
  destructive: '#B93838',
  destructiveSurface: '#FCEBEB',
  info: '#3568B8',
  infoSurface: '#EBF1FC',

  // Learning category tags
  hangulAccent: '#2D7D68',
  vocabAccent: '#176B55',
  grammarAccent: '#C5684D',
};

export const darkColors: ThemeColors = {
  // Brand & Background (Muted Jade + Ink Charcoal)
  primary: '#78B99B',
  primaryPressed: '#A0D4B8',
  primaryForeground: '#151C1A',
  primaryMuted: '#4F8A70',
  background: '#151C1A',
  surface: '#1E2723',
  surfaceElevated: '#25302C',
  surfaceSubtle: '#26332D',
  secondarySurface: '#26332D',

  // Typography
  foreground: '#F2F4EF',
  foregroundMuted: '#ADB7B0',
  foregroundSubtle: '#7C8780',

  // Dividers & Borders
  border: '#34413A',
  borderSubtle: '#2A3530',

  // Accent & Milestone Highlights
  accent: '#E99A7E',

  // Semantic Status
  success: '#79D49A',
  successSurface: '#193325',
  warning: '#EBC16D',
  warningSurface: '#362A14',
  destructive: '#FF9292',
  destructiveSurface: '#3D1C1C',
  info: '#8DB8FF',
  infoSurface: '#192842',

  // Learning category tags
  hangulAccent: '#9FD9C0',
  vocabAccent: '#78B99B',
  grammarAccent: '#E99A7E',
};

export const typography = {
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
} as const;

export const spacing = {
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
} as const;

export const radii = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  full: 9999,
} as const;

export interface Theme {
  isDark: boolean;
  colors: ThemeColors;
  typography: typeof typography;
  spacing: typeof spacing;
  radii: typeof radii;
}

export const lightTheme: Theme = {
  isDark: false,
  colors: lightColors,
  typography,
  spacing,
  radii,
};

export const darkTheme: Theme = {
  isDark: true,
  colors: darkColors,
  typography,
  spacing,
  radii,
};

// Default theme exported for static lookups or SSR fallback
export const theme: Theme = darkTheme;
