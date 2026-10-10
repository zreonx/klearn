import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { theme } from '@/components/ui/theme';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.colors.background,
          },
          headerTintColor: theme.colors.foreground,
          headerTitleStyle: {
            fontWeight: '600',
          },
          headerShadowVisible: false,
          contentStyle: {
            backgroundColor: theme.colors.background,
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
