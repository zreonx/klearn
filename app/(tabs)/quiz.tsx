import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  Typography,
  Card,
  Button,
  Badge,
  Divider,
} from '@/components/ui';
import { theme } from '@/components/ui/theme';
import { QuizQuestionType } from '@/domain/quiz/types';

export default function QuizTabScreen() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<QuizQuestionType | 'all'>('all');

  const modes: Array<{ id: QuizQuestionType | 'all'; title: string; desc: string }> = [
    {
      id: 'all',
      title: 'Balanced Practice',
      desc: 'Mix of Korean to English, English to Korean, and Listening',
    },
    {
      id: 'korean_to_english',
      title: 'Korean → English',
      desc: 'Recognize Korean words and select their English meaning',
    },
    {
      id: 'english_to_korean',
      title: 'English → Korean',
      desc: 'Recall and produce the right Korean Hangul representation',
    },
    {
      id: 'listening_recognition',
      title: 'Listening Practice',
      desc: 'Listen to spoken audio and identify the meaning',
    },
  ];

  const handleStart = () => {
    router.push('/quiz/session');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Typography variant="display" weight="700">
          Quiz
        </Typography>
        <Typography variant="caption" color="foregroundMuted">
          Test your retention and sharpen active Korean recall
        </Typography>
      </View>

      <Card elevated style={styles.heroCard}>
        <View style={styles.heroTop}>
          <Badge label="Quiz Engine" variant="vocab" />
        </View>
        <Typography variant="heading" style={styles.heroTitle}>
          Ready to test your Korean?
        </Typography>
        <Typography variant="body" color="foregroundMuted" style={styles.heroDesc}>
          Questions are dynamically generated based on the items you've encountered in your lessons.
        </Typography>
        <Button title="Start Practice Quiz" fullWidth onPress={handleStart} />
      </Card>

      <Typography variant="title" style={styles.sectionTitle}>
        Quiz Modes
      </Typography>

      {modes.map((mode) => {
        const isSelected = selectedType === mode.id;
        return (
          <Card
            key={mode.id}
            subtle={!isSelected}
            elevated={isSelected}
            style={[styles.modeCard, isSelected && styles.modeCardSelected]}
            onPress={() => setSelectedType(mode.id)}
          >
            <View style={styles.modeRow}>
              <View style={styles.modeInfo}>
                <Typography variant="title" color={isSelected ? 'primary' : 'foreground'}>
                  {mode.title}
                </Typography>
                <Typography variant="caption" color="foregroundMuted" style={styles.modeDesc}>
                  {mode.desc}
                </Typography>
              </View>
              {isSelected ? (
                <Ionicons name="checkmark-circle" size={22} color={theme.colors.primary} />
              ) : (
                <Ionicons name="ellipse-outline" size={22} color={theme.colors.foregroundSubtle} />
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
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing['5xl'],
  },
  header: {
    marginBottom: theme.spacing.xl,
  },
  heroCard: {
    marginBottom: theme.spacing.xl,
  },
  heroTop: {
    marginBottom: theme.spacing.sm,
  },
  heroTitle: {
    marginBottom: theme.spacing.xs,
  },
  heroDesc: {
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
    marginBottom: theme.spacing.md,
  },
  modeCard: {
    marginBottom: theme.spacing.md,
  },
  modeCardSelected: {
    borderColor: theme.colors.primary,
  },
  modeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modeInfo: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  modeDesc: {
    marginTop: theme.spacing.xs,
  },
});
