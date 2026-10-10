import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from '@/components/ui';

function RootNavigation() {
  const { colors, isDark } = useTheme();

  // Keep Android navigation bar / gesture bar transparent and edge-to-edge (fullscreen)
  // so the gesture navigation background seamlessly merges with the navigation menu background
  useEffect(() => {
    if (Platform.OS === 'android') {
      try {
        const NavigationBar = require('expo-navigation-bar');
        NavigationBar.setPositionAsync('absolute').catch(() => {});
        NavigationBar.setBackgroundColorAsync('#00000000').catch(() => {});
        NavigationBar.setButtonStyleAsync(isDark ? 'light' : 'dark').catch(() => {});
      } catch {
        // Safe fallback if native module is absent in test environment
      }
    }
  }, [isDark]);

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.foreground,
          headerTitleStyle: {
            fontWeight: '600',
          },
          headerShadowVisible: false,
          contentStyle: {
            backgroundColor: colors.background,
          },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="review/index"
          options={{
            title: 'Review Session',
            presentation: 'modal',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="quiz/session"
          options={{
            title: 'Quiz',
            presentation: 'modal',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="learn/[lessonId]"
          options={{
            title: 'Lesson',
          }}
        />
        <Stack.Screen
          name="learn/item/[itemId]"
          options={{
            title: 'Learning Item',
          }}
        />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <RootNavigation />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
