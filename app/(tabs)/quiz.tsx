import React, { useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
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

export default function QuizTabScreen() {
  const router = useRouter();
  const { colors, theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [selectedType, setSelectedType] = useState<QuizQuestionType | 'all'>('all');
  const [starredCount, setStarredCount] = useState<number>(0);

  useFocusEffect(
    useCallback(() => {
      services.learningRepo.getStarredItemIds().then((ids) => {
        setStarredCount(ids.length);
      });
    }, [])
  );

  const modes: Array<{ id: QuizQuestionType | 'all'; title: string; desc: string }> = [
    {
      id: 'all',
      title: 'Balanced Practice',
      desc: 'Mix of Korean to English, English to Korean, and Listening',
    },
    {
      id: 'sentence_assembly',
      title: 'Interactive Sentence Builder (SOV)',
      desc: 'Tap scrambled word & particle tiles to assemble Korean sentences',
    },
    {
      id: 'acoustic_discrimination',
      title: 'Acoustic Minimal Pairs (소리 구분 퀴즈)',
      desc: 'Discriminate plain vs. aspirated vs. tense sounds (불 vs 풀 vs 뿔)',
    },
    {
      id: 'listening_recognition',
      title: 'Auditory & Listening Mastery',
      desc: 'Listen to native pronunciation and sharpen spoken recognition',
    },
    {
      id: 'particle_fill',
      title: 'Grammar & Particles (조사)',
      desc: 'Master Korean particles (은/는, 이/가, 을/를) in real context',
    },
    {
      id: 'korean_to_english',
      title: 'Korean → English Recall',
      desc: 'Recognize Korean words and select their English meaning',
    },
    {
      id: 'english_to_korean',
      title: 'English → Korean Production',
      desc: 'Recall and produce the right Korean Hangul representation',
    },
  ];

  const handleStart = () => {
    router.push({
      pathname: '/quiz/session',
      params: selectedType !== 'all' ? { type: selectedType } : undefined,
    });
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

      <Card elevated style={{ marginBottom: theme.spacing.xl }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: theme.spacing.sm }}>
          <Badge label="Adaptive Quiz Engine" variant="vocab" />
          <Badge label="TOPIK Referenced" variant="hangul" />
        </View>
        <Typography variant="heading" style={{ marginBottom: theme.spacing.xs }}>
          Active Retrieval Practice
        </Typography>
        <Typography variant="body" color="foregroundMuted" style={{ marginBottom: theme.spacing.lg }}>
          Questions target your current proficiency stage across the 6 skill areas (Vocabulary, Grammar, Listening, Speaking, Reading, Writing).
        </Typography>
        <Button title="Start Practice Quiz" fullWidth onPress={handleStart} />
      </Card>

      {/* Starred Deck Banner */}
      {starredCount > 0 && (
        <Card
          subtle
          style={{ marginBottom: theme.spacing.xl, padding: theme.spacing.md }}
          onPress={() => router.push({ pathname: '/quiz/session', params: { starred: 'true' } } as any)}
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
              onPress={() => router.push({ pathname: '/quiz/session', params: { starred: 'true' } } as any)}
            />
          </View>
        </Card>
      )}

      <Typography variant="title" style={{ marginBottom: theme.spacing.md }}>
        Quiz Modes
      </Typography>

      {modes.map((mode) => {
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
            onPress={() => setSelectedType(mode.id)}
          >
            <View style={styles.modeRow}>
              <View style={[styles.modeInfo, { marginRight: theme.spacing.md }]}>
                <Typography variant="title" color={isSelected ? 'primary' : 'foreground'}>
                  {mode.title}
                </Typography>
                <Typography variant="caption" color="foregroundMuted" style={{ marginTop: theme.spacing.xs }}>
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
      })}
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
});
