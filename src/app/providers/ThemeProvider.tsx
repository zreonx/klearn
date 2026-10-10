import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { lightTheme, darkTheme, Theme, ThemeColors } from '@/components/ui/theme';
import { ThemeMode } from '@/domain/settings/types';
import { services } from '@/application/services';

interface ThemeContextValue {
  theme: Theme;
  colors: ThemeColors;
  mode: 'light' | 'dark';
  themePreference: ThemeMode;
  setThemePreference: (preference: ThemeMode) => Promise<void>;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: darkTheme,
  colors: darkTheme.colors,
  mode: 'dark',
  themePreference: 'system',
  setThemePreference: async () => {},
  isDark: true,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [themePreference, setThemePreferenceState] = useState<ThemeMode>('system');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    services.settingsRepo.getUserSettings().then((settings) => {
      if (settings?.themeMode) {
        setThemePreferenceState(settings.themeMode);
      }
      setIsReady(true);
    });
  }, []);

  const activeMode: 'light' | 'dark' = useMemo(() => {
    if (themePreference === 'light') return 'light';
    if (themePreference === 'dark') return 'dark';
    return systemColorScheme === 'light' ? 'light' : 'dark';
  }, [themePreference, systemColorScheme]);

  const activeTheme = activeMode === 'light' ? lightTheme : darkTheme;

  const setThemePreference = async (newPref: ThemeMode) => {
    setThemePreferenceState(newPref);
    const current = await services.settingsRepo.getUserSettings();
    await services.settingsRepo.saveUserSettings({
      ...current,
      themeMode: newPref,
    });
  };

  const contextValue = useMemo<ThemeContextValue>(() => ({
    theme: activeTheme,
    colors: activeTheme.colors,
    mode: activeMode,
    themePreference,
    setThemePreference,
    isDark: activeMode === 'dark',
  }), [activeTheme, activeMode, themePreference]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  return context;
}
