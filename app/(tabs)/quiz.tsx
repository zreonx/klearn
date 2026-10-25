import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  Typography,
  Card,
  Button,
  Badge,
  useTheme,
} from '@/components/ui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { QuizQuestionType } from '@/domain/quiz/types';
import { services } from '@/application/services';
import { hapticService } from '@/infrastructure/haptics/hapticService';

interface QuizModeItem {
  id: QuizQuestionType | 'all';
  title: string;
  desc: string;
  tag?: string;
}

const CORE_MODES: QuizModeItem[] = [
  {
    id: 'all',
    title: 'Balanced Practice',
    desc: 'Adaptive mix of Korean recall, English recognition, and audio comprehension',
    tag: 'Recommended',
  },
  {
    id: 'korean_to_english',
    title: 'Korean → English Recall',
    desc: 'Recognize Korean words and match their English meaning',
  },
  {
    id: 'english_to_korean',
    title: 'English → Korean Production',
    desc: 'Recall and produce the right Korean Hangul representation',
  },
  {
    id: 'listening_recognition',
    title: 'Auditory & Listening Mastery',
    desc: 'Listen to native Korean audio and sharpen spoken recognition',
  },
];

const SPECIALIZED_DRILLS: QuizModeItem[] = [
  {
    id: 'dictation',
    title: 'Korean Dictation (받아쓰기)',
    desc: 'Listen to spoken Korean and assemble the syllables you hear',
    tag: 'New',
  },
  {
    id: 'sentence_assembly',
    title: 'Sentence Builder (SOV)',
    desc: 'Tap scrambled word & particle tiles in proper Subject-Object-Verb order',
  },
  {
    id: 'acoustic_discrimination',
    title: 'Minimal Pairs (소리 구분 퀴즈)',
    desc: 'Discriminate plain vs. aspirated vs. tense sounds (불 vs 풀 vs 뿔)',
  },
  {
    id: 'particle_fill',
    title: 'Grammar & Particles (조사)',
    desc: 'Master Korean particles (은/는, 이/가, 을/를) in real context',
  },
];

export default function QuizTabScreen() {
  const router = useRouter();
  const { colors, theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [selectedType, setSelectedType] = useState<QuizQuestionType | 'all'>('all');
  const [selectedCount, setSelectedCount] = useState<number>(10);
  const [starredCount, setStarredCount] = useState<number>(0);

  useFocusEffect(
    useCallback(() => {
      services.learningRepo.getStarredItemIds().then((ids) => {
        setStarredCount(ids.length);
      });
    }, [])
  );

  const handleStart = () => {
    hapticService.lightTick();
    router.push({
      pathname: '/quiz/session',
      params: {
        ...(selectedType !== 'all' ? { type: selectedType } : {}),
        count: String(selectedCount),
      },
    });
  };

  const renderModeCard = (mode: QuizModeItem) => {
    const isSelected = selectedType === mode.id;
    return (
      <Card
        key={mode.id}
        subtle={!isSelected}
        elevated={isSelected}
        style={[
          { marginBottom: theme.spacing.md },
          isSelected && { borderColor: colors.primary, borderWidth: 1.5 },
        ]}
        onPress={() => {
          hapticService.lightTick();
          setSelectedType(mode.id);
        }}
      >
        <View style={styles.modeRow}>
          <View style={[styles.modeInfo, { marginRight: theme.spacing.md }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Typography variant="title" color={isSelected ? 'primary' : 'foreground'} weight="700">
                {mode.title}
              </Typography>
              {mode.tag ? (
                <Badge label={mode.tag} variant={mode.tag === 'New' ? 'vocab' : 'default'} />
              ) : null}
            </View>
            <Typography variant="caption" color="foregroundMuted" style={{ marginTop: theme.spacing.xs, lineHeight: 18 }}>
              {mode.desc}
            </Typography>
          </View>
          {isSelected ? (
            <Ionicons name="checkmark-circle" size={22} color={colors.primary} />
          ) : (
            <Ionicons name="ellipse-outline" size={22} color={colors.foregroundSubtle} />
          )}
        </View>
      </Card>
    );
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={[
        styles.content,
        {
          paddingHorizontal: theme.spacing.lg,
          paddingTop: Math.max(insets.top + 12, theme.spacing.xl),
          paddingBottom: theme.spacing['5xl'],
        },
      ]}
    >
      <View style={{ marginBottom: theme.spacing.xl }}>
        <Typography variant="display" weight="700">
          Quiz
        </Typography>
        <Typography variant="caption" color="foregroundMuted">
          Test your retention and sharpen active Korean recall
        </Typography>
      </View>

      {/* Hero Session Launcher Card */}
      <Card elevated style={{ marginBottom: theme.spacing.xl, padding: theme.spacing.lg }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: theme.spacing.xs }}>
          <Badge label="Active Retrieval" variant="vocab" />
          <Badge label="Adaptive" variant="hangul" />
        </View>
        <Typography variant="heading" style={{ marginBottom: theme.spacing.xs }}>
          Targeted Practice
        </Typography>
        <Typography variant="body" color="foregroundMuted" style={{ marginBottom: theme.spacing.md, lineHeight: 20 }}>
          Questions adapt to your progress across vocabulary, grammar, listening, and sentence structure.
        </Typography>

        {/* Session Length Chips */}
        <View style={{ marginBottom: theme.spacing.lg }}>
          <Typography variant="caption" color="foregroundSubtle" weight="600" style={{ marginBottom: 6 }}>
            Session Length:
          </Typography>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {[5, 10, 15, 20].map((cnt) => {
              const isSelected = selectedCount === cnt;
              return (
                <TouchableOpacity
                  key={cnt}
                  style={[
                    styles.countPill,
                    {
                      backgroundColor: isSelected ? colors.primary : colors.surfaceSubtle,
                      borderColor: isSelected ? colors.primary : colors.borderSubtle,
                      borderRadius: theme.radii.md,
                    },
                  ]}
                  onPress={() => {
                    hapticService.lightTick();
                    setSelectedCount(cnt);
                  }}
                >
                  <Typography
                    variant="caption"
                    weight="700"
                    color={isSelected ? 'primaryForeground' : 'foreground'}
                  >
                    {cnt} Qs
                  </Typography>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <Button title="Start Practice Quiz" fullWidth onPress={handleStart} />
      </Card>

      {/* Starred Deck Banner */}
      {starredCount > 0 && (
        <Card
          subtle
          style={{ marginBottom: theme.spacing.xl, padding: theme.spacing.md }}
          onPress={() => {
            hapticService.lightTick();
            router.push({ pathname: '/quiz/session', params: { starred: 'true' } } as any);
          }}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 8 }}>
              <Ionicons name="star" size={24} color={colors.accent} style={{ marginRight: 10 }} />
              <View style={{ flex: 1 }}>
                <Typography variant="body" weight="700" color="foreground">
                  Starred Tricky Cards ({starredCount})
                </Typography>
                <Typography variant="caption" color="foregroundMuted">
                  Practice cards you starred during lessons or reviews
                </Typography>
              </View>
            </View>
            <Button
              title="Practice"
              size="sm"
              variant="outline"
              onPress={() => {
                hapticService.lightTick();
                router.push({ pathname: '/quiz/session', params: { starred: 'true' } } as any);
              }}
            />
          </View>
        </Card>
      )}

      {/* Group 1: Core Practice */}
      <View style={{ marginBottom: theme.spacing.lg }}>
        <Typography variant="title" weight="700">
          Core Practice Modes
        </Typography>
        <Typography variant="caption" color="foregroundMuted" style={{ marginTop: 2, marginBottom: theme.spacing.md }}>
          Standard multiple-choice and auditory comprehension
        </Typography>
        {CORE_MODES.map(renderModeCard)}
      </View>

      {/* Group 2: Interactive Drills */}
      <View style={{ marginBottom: theme.spacing.lg }}>
        <Typography variant="title" weight="700">
          Interactive Drills & Writing
        </Typography>
        <Typography variant="caption" color="foregroundMuted" style={{ marginTop: 2, marginBottom: theme.spacing.md }}>
          Hands-on tile assembly, dictation spelling, and sound discrimination
        </Typography>
        {SPECIALIZED_DRILLS.map(renderModeCard)}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {},
  modeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modeInfo: {
    flex: 1,
  },
  countPill: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderWidth: 1.5,
  },
});
