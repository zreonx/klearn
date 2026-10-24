import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Typography,
  Card,
  Badge,
  useTheme,
} from '@/components/ui';
import { CONVERSATION_SCENARIOS } from '@/domain/conversation/scenarios';
import { services } from '@/application/services';
import { AIProvider } from '@/domain/settings/types';

export default function ConversationHubScreen() {
  const router = useRouter();
  const { colors, theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [aiProvider, setAiProvider] = useState<AIProvider>('offline');

  useEffect(() => {
    async function load() {
      try {
        const userSettings = await services.settingsRepo.getUserSettings();
        if (userSettings.aiTutor?.provider) {
          setAiProvider(userSettings.aiTutor.provider);
        }
      } catch {
        // Silently default
      }
    }
    load();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Top Header */}
      <View
        style={[
          styles.header,
          {
            paddingTop: Math.max(insets.top + 8, theme.spacing.lg),
            paddingHorizontal: theme.spacing.lg,
            paddingBottom: theme.spacing.md,
            backgroundColor: colors.surfaceSubtle,
            borderBottomWidth: 1,
            borderBottomColor: colors.borderSubtle,
          },
        ]}
      >
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={[
              styles.backButton,
              {
                backgroundColor: colors.background,
                borderColor: colors.borderSubtle,
                borderRadius: theme.radii.full,
              },
            ]}
            accessibilityLabel="Go back"
          >
            <Ionicons name="chevron-back" size={22} color={colors.foreground} />
          </TouchableOpacity>

          <View style={{ flex: 1 }}>
            <Typography variant="heading" weight="700">
              AI Conversation & Speaking
            </Typography>
            <Typography variant="caption" color="foregroundMuted">
              한국어 회화 & 롤플레이 • Real Scenarios & Politeness Coach
            </Typography>
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingHorizontal: theme.spacing.lg,
            paddingTop: theme.spacing.lg,
            paddingBottom: Math.max(insets.bottom + 24, theme.spacing['4xl']),
          },
        ]}
      >
        {/* Hub Banner */}
        <Card subtle style={{ marginBottom: theme.spacing.lg, padding: theme.spacing.md }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <Typography variant="title" color="primary" weight="700">
              Interactive Dialogue & Speaking
            </Typography>
            <Badge
              label={
                aiProvider === 'gemini'
                  ? 'Gemini AI'
                  : aiProvider === 'deepseek'
                  ? 'DeepSeek AI'
                  : 'Offline Engine'
              }
              variant="hangul"
            />
          </View>
          <Typography variant="body" color="foreground" style={{ fontSize: 13, lineHeight: 19 }}>
            Practice real-life Korean conversations with native audio pronunciation, live formality coaching, and suggested responses. Works 100% offline or with your custom AI key in Settings.
          </Typography>
        </Card>

        {/* Scenarios List */}
        <Typography variant="title" weight="700" style={{ marginBottom: theme.spacing.md }}>
          Curated Scenarios
        </Typography>

        <View style={{ gap: theme.spacing.md }}>
          {CONVERSATION_SCENARIOS.map((scenario) => (
            <TouchableOpacity
              key={scenario.id}
              activeOpacity={0.8}
              onPress={() => router.push(`/conversation/${scenario.id}` as any)}
            >
              <Card elevated style={{ padding: theme.spacing.lg }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 8 }}>
                    <View
                      style={[
                        styles.iconWrap,
                        {
                          backgroundColor: colors.surfaceSubtle,
                          borderColor: colors.borderSubtle,
                          borderRadius: theme.radii.md,
                          marginRight: 10,
                        },
                      ]}
                    >
                      <Ionicons name={scenario.icon as any} size={22} color={colors.primary} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Typography variant="heading" weight="700" color="foreground" style={{ fontSize: 18 }}>
                        {scenario.koreanTitle}
                      </Typography>
                      <Typography variant="caption" color="foregroundMuted">
                        {scenario.title}
                      </Typography>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={colors.foregroundSubtle} />
                </View>

                <Typography variant="body" color="foreground" style={{ fontSize: 13, lineHeight: 18, marginBottom: 12 }}>
                  {scenario.description}
                </Typography>

                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
                  <Badge label={scenario.level} variant="vocab" />
                  <Badge
                    label={
                      scenario.targetFormality === 'formal-polite'
                        ? '격식체 (Formal -습니다)'
                        : '존댓말 (Polite -해요)'
                    }
                    variant="grammar"
                  />
                  <Badge label={`${scenario.turns.length} turns`} variant="default" />
                </View>
              </Card>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {},
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    marginRight: 12,
  },
  scrollContent: {},
  iconWrap: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
});
