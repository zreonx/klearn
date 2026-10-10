import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  Typography,
  Card,
  Button,
  Badge,
  ProgressBar,
  Divider,
} from '@/components/ui';
import { theme } from '@/components/ui/theme';
import { useLearn } from '@/features/learn/useLearn';
import { LearningItem } from '@/domain/learning/types';

export default function LessonDetailScreen() {
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();
  const router = useRouter();
  const { getLessonDetails, markItemLearned, speak, recordsMap } = useLearn();

  const [lessonData, setLessonData] = useState<Awaited<
    ReturnType<typeof getLessonDetails>
  > | null>(null);

  useEffect(() => {
    if (lessonId) {
      getLessonDetails(lessonId).then(setLessonData);
    }
  }, [lessonId, recordsMap]);

  if (!lessonData || !lessonData.lesson) {
    return (
      <View style={styles.centerContainer}>
        <Typography variant="body" color="foregroundMuted">
          Loading lesson...
        </Typography>
      </View>
    );
  }

  const { lesson, items, progress, isCompleted } = lessonData;

  const handleLearnItem = async (item: LearningItem) => {
    await markItemLearned(item.id);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Lesson Header */}
      <View style={styles.header}>
        <View style={styles.badgeRow}>
          <Badge
            label={isCompleted ? 'Completed' : `${Math.round(progress * 100)}%`}
            variant={isCompleted ? 'success' : 'vocab'}
          />
        </View>
        <Typography variant="display" weight="700">
          {lesson.title}
        </Typography>
        {lesson.koreanTitle && (
          <Typography variant="title" color="foregroundMuted" style={styles.koreanTitle}>
            {lesson.koreanTitle}
          </Typography>
        )}
        <Typography variant="body" color="foregroundMuted" style={styles.description}>
          {lesson.description}
        </Typography>
        <ProgressBar
          progress={progress}
          color={isCompleted ? theme.colors.success : theme.colors.primary}
          style={styles.progressBar}
        />
      </View>

      {/* Item List */}
      <Typography variant="title" style={styles.sectionTitle}>
        Items in this lesson ({items.length})
      </Typography>

      {items.map((item) => {
        const record = recordsMap.get(item.id);
        const isLearned = record && record.status !== 'unseen';

        return (
          <Card key={item.id} elevated style={styles.itemCard}>
            <View style={styles.itemTopRow}>
              <View style={styles.koreanContainer}>
                <Typography variant="display" weight="700" style={styles.koreanText}>
                  {item.korean}
                </Typography>
                {item.romanization && (
                  <Typography variant="caption" color="foregroundMuted">
                    [{item.romanization}]
                  </Typography>
                )}
              </View>

              <TouchableOpacity
                onPress={() => speak(item.korean)}
                accessibilityLabel="Listen"
                style={styles.speakerButton}
              >
                <Ionicons name="volume-medium" size={22} color={theme.colors.primary} />
              </TouchableOpacity>
            </View>

            <Typography variant="title" color="foreground" style={styles.translation}>
              {item.translation}
            </Typography>

            {item.explanation && (
              <Typography variant="body" color="foregroundMuted" style={styles.explanation}>
                {item.explanation}
              </Typography>
            )}

            {item.examples && item.examples.length > 0 && (
              <View style={styles.exampleBox}>
                <Typography variant="label" color="primary">
                  Example:
                </Typography>
                {item.examples.map((ex, idx) => (
                  <View key={idx} style={styles.exampleItem}>
                    <Typography variant="body" weight="500">
                      {ex.korean}
                    </Typography>
                    <Typography variant="caption" color="foregroundMuted">
                      {ex.translation}
                    </Typography>
                  </View>
                ))}
              </View>
            )}

            <Divider style={styles.divider} />

            <View style={styles.actionRow}>
              {isLearned ? (
                <View style={styles.learnedStatus}>
                  <Ionicons name="checkmark-circle" size={18} color={theme.colors.success} />
                  <Typography variant="label" color="success" style={styles.learnedText}>
                    Learned (in Spaced Repetition)
                  </Typography>
                </View>
              ) : (
                <Button
                  title="Mark as Learned"
                  size="sm"
                  onPress={() => handleLearnItem(item)}
                />
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
    paddingBottom: theme.spacing['6xl'],
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  header: {
    marginBottom: theme.spacing.xl,
  },
  badgeRow: {
    marginBottom: theme.spacing.sm,
  },
  koreanTitle: {
    marginTop: theme.spacing.xs,
  },
  description: {
    marginTop: theme.spacing.sm,
  },
  progressBar: {
    marginTop: theme.spacing.md,
  },
  sectionTitle: {
    marginBottom: theme.spacing.md,
  },
  itemCard: {
    marginBottom: theme.spacing.lg,
  },
  itemTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  koreanContainer: {
    flex: 1,
  },
  koreanText: {
    fontSize: 32,
    marginBottom: 2,
  },
  speakerButton: {
    padding: theme.spacing.xs,
    backgroundColor: theme.colors.surfaceSubtle,
    borderRadius: theme.radii.full,
  },
  translation: {
    marginTop: theme.spacing.sm,
  },
  explanation: {
    marginTop: theme.spacing.xs,
  },
  exampleBox: {
    marginTop: theme.spacing.md,
    backgroundColor: theme.colors.surfaceSubtle,
    padding: theme.spacing.md,
    borderRadius: theme.radii.md,
  },
  exampleItem: {
    marginTop: theme.spacing.xs,
  },
  divider: {
    marginVertical: theme.spacing.md,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  learnedStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  learnedText: {
    marginLeft: theme.spacing.xs,
  },
});
