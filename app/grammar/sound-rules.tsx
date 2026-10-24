import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Typography, Card, Badge, useTheme } from '@/components/ui';
import { SOUND_CHANGE_RULES, SoundChangeRule } from '@/content/grammar/soundChangeRules';
import { hapticService } from '@/infrastructure/haptics/hapticService';

export default function SoundRulesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, theme } = useTheme();

  const [selectedRuleId, setSelectedRuleId] = useState<string>(SOUND_CHANGE_RULES[0].id);

  const activeRule =
    SOUND_CHANGE_RULES.find((r) => r.id === selectedRuleId) || SOUND_CHANGE_RULES[0];

  const speak = (text: string) => {
    hapticService.lightTick();
    Speech.speak(text, { language: 'ko-KR', rate: 0.85 });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            paddingTop: Math.max(insets.top + 8, theme.spacing.lg),
            paddingHorizontal: theme.spacing.lg,
            paddingBottom: theme.spacing.sm,
            borderBottomColor: colors.borderSubtle,
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          style={styles.backBtn}
        >
          <Ionicons name="chevron-back" size={24} color={colors.foreground} />
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: theme.spacing.xs }}>
          <Typography variant="title" weight="700">
            Pronunciation Rules
          </Typography>
          <Typography variant="caption" color="foregroundMuted">
            한국어 발음 법칙 • Spelling vs. Real Sound
          </Typography>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingHorizontal: theme.spacing.lg,
            paddingBottom: Math.max(insets.bottom + 24, theme.spacing['4xl']),
          },
        ]}
      >
        {/* Intro Banner */}
        <Card elevated style={{ padding: theme.spacing.lg, marginTop: theme.spacing.md, marginBottom: theme.spacing.lg }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <Ionicons name="sparkles" size={16} color={colors.primary} />
            <Typography variant="label" weight="700" color="primary">
              Why Does Spoken Korean Differ from Spelling?
            </Typography>
          </View>
          <Typography variant="caption" color="foregroundMuted">
            Korean written Hangul preserves the original meaning of word roots, while pronunciation naturally shifts to make speech smoother and easier for your mouth.
          </Typography>
        </Card>

        {/* Horizontal Category Switcher */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8, marginBottom: theme.spacing.lg }}
        >
          {SOUND_CHANGE_RULES.map((rule) => {
            const isSelected = selectedRuleId === rule.id;
            return (
              <TouchableOpacity
                key={rule.id}
                style={[
                  styles.ruleTabChip,
                  {
                    backgroundColor: isSelected ? colors.primary : colors.surfaceSubtle,
                    borderColor: isSelected ? colors.primary : colors.borderSubtle,
                    borderRadius: theme.radii.lg,
                    paddingHorizontal: 16,
                    paddingVertical: 10,
                  },
                ]}
                onPress={() => {
                  hapticService.lightTick();
                  setSelectedRuleId(rule.id);
                }}
              >
                <Typography
                  variant="label"
                  weight="700"
                  color={isSelected ? 'primaryForeground' : 'foreground'}
                >
                  {rule.titleKorean}
                </Typography>
                <Typography
                  variant="caption"
                  color={isSelected ? 'primaryForeground' : 'foregroundMuted'}
                  style={{ fontSize: 10, marginTop: 1 }}
                >
                  {rule.titleEnglish.split(' ')[0]}
                </Typography>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Active Rule Main Card */}
        <Card elevated style={{ padding: theme.spacing.xl, marginBottom: theme.spacing.xl }}>
          <View style={styles.cardHeaderRow}>
            <View>
              <Typography variant="display" weight="700" color="primary">
                {activeRule.titleKorean}
              </Typography>
              <Typography variant="body" weight="600" color="foregroundMuted" style={{ marginTop: 2 }}>
                {activeRule.titleEnglish}
              </Typography>
            </View>
            <Badge label={activeRule.badgeLabel} variant="grammar" />
          </View>

          {/* Formula Callout */}
          <View
            style={[
              styles.formulaBox,
              {
                backgroundColor: colors.surfaceSubtle,
                borderColor: colors.borderSubtle,
                borderRadius: theme.radii.md,
                padding: theme.spacing.md,
                marginVertical: theme.spacing.md,
              },
            ]}
          >
            <Typography variant="caption" weight="700" color="primary">
              Core Shift Formula:
            </Typography>
            <Typography variant="body" weight="700" color="foreground" style={{ marginTop: 2 }}>
              {activeRule.ruleFormula}
            </Typography>
          </View>

          <Typography variant="caption" color="foregroundMuted" style={{ lineHeight: 18 }}>
            {activeRule.description}
          </Typography>

          {/* Examples Header */}
          <Typography variant="label" weight="700" style={{ marginTop: theme.spacing.lg, marginBottom: theme.spacing.sm }}>
            Side-by-Side Audio Comparisons:
          </Typography>

          <View style={{ gap: theme.spacing.md }}>
            {activeRule.examples.map((ex, idx) => (
              <View
                key={idx}
                style={[
                  styles.exampleCard,
                  {
                    backgroundColor: colors.surfaceSubtle,
                    borderColor: colors.borderSubtle,
                    borderRadius: theme.radii.md,
                    padding: theme.spacing.md,
                  },
                ]}
              >
                <View style={styles.exampleHeaderRow}>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <Typography variant="title" weight="700" color="foreground">
                        {ex.written}
                      </Typography>
                      <Ionicons name="arrow-forward" size={14} color={colors.foregroundSubtle} />
                      <View
                        style={[
                          styles.spokenBadge,
                          {
                            backgroundColor: colors.surface,
                            borderColor: colors.primary,
                            borderRadius: theme.radii.sm,
                          },
                        ]}
                      >
                        <Typography variant="label" weight="700" color="primary">
                          [{ex.spoken}]
                        </Typography>
                      </View>
                    </View>

                    <Typography variant="caption" color="foregroundMuted" style={{ marginTop: 2 }}>
                      {ex.romanization} • {ex.translation}
                    </Typography>
                  </View>

                  <TouchableOpacity
                    onPress={() => speak(ex.written)}
                    style={[styles.audioIconBtn, { backgroundColor: colors.surface, borderRadius: theme.radii.full }]}
                  >
                    <Ionicons name="volume-high" size={20} color={colors.primary} />
                  </TouchableOpacity>
                </View>

                <Typography variant="caption" color="foregroundSubtle" style={{ marginTop: theme.spacing.xs }}>
                  💡 {ex.explanation}
                </Typography>
              </View>
            ))}
          </View>

          {/* Pro Tip Box */}
          <View
            style={[
              styles.tipBox,
              {
                backgroundColor: colors.surfaceSubtle,
                borderRadius: theme.radii.md,
                padding: theme.spacing.md,
                marginTop: theme.spacing.lg,
              },
            ]}
          >
            <Typography variant="caption" weight="700" color="accent">
              Pro Practice Tip:
            </Typography>
            <Typography variant="caption" color="foreground" style={{ marginTop: 2 }}>
              {activeRule.proTip}
            </Typography>
          </View>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  backBtn: {
    padding: 4,
  },
  scrollContent: {
    paddingTop: 8,
  },
  ruleTabChip: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  formulaBox: {
    borderWidth: 1,
  },
  exampleCard: {
    borderWidth: 1,
  },
  exampleHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  spokenBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderWidth: 1,
  },
  audioIconBtn: {
    padding: 8,
  },
  tipBox: {},
});
