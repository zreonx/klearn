import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider, useTheme } from '@/components/ui';

function RootNavigation() {
  const { colors, isDark } = useTheme();

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
          }}
        />
        <Stack.Screen
          name="quiz/session"
          options={{
            title: 'Quiz',
            presentation: 'modal',
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
    <ThemeProvider>
      <RootNavigation />
    </ThemeProvider>
  );
}
