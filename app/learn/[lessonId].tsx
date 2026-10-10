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
  useTheme,
} from '@/components/ui';
import { useLearn } from '@/features/learn/useLearn';
import { LearningItem } from '@/domain/learning/types';

export default function LessonDetailScreen() {
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();
  const router = useRouter();
  const { colors, theme } = useTheme();
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
      <View style={[styles.centerContainer, { backgroundColor: colors.background }]}>
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
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={[styles.content, { padding: theme.spacing.lg, paddingBottom: theme.spacing['6xl'] }]}
    >
      {/* Lesson Header */}
      <View style={{ marginBottom: theme.spacing.xl }}>
        <View style={{ marginBottom: theme.spacing.sm }}>
          <Badge
            label={isCompleted ? 'Completed' : `${Math.round(progress * 100)}%`}
            variant={isCompleted ? 'success' : 'vocab'}
          />
        </View>
        <Typography variant="display" weight="700">
          {lesson.title}
        </Typography>
        {lesson.koreanTitle && (
          <Typography variant="title" color="foregroundMuted" style={{ marginTop: theme.spacing.xs }}>
            {lesson.koreanTitle}
          </Typography>
        )}
        <Typography variant="body" color="foregroundMuted" style={{ marginTop: theme.spacing.sm }}>
          {lesson.description}
        </Typography>
        <ProgressBar
          progress={progress}
          color={isCompleted ? colors.success : colors.primary}
          style={{ marginTop: theme.spacing.md }}
        />
      </View>

      {/* Item List */}
      <Typography variant="title" style={{ marginBottom: theme.spacing.md }}>
        Items in this lesson ({items.length})
      </Typography>

      {items.map((item) => {
        const record = recordsMap.get(item.id);
        const isLearned = record && record.status !== 'unseen';

        return (
          <Card key={item.id} elevated style={{ marginBottom: theme.spacing.lg }}>
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
                style={[styles.speakerButton, { backgroundColor: colors.surfaceSubtle, borderRadius: theme.radii.full, padding: theme.spacing.xs }]}
              >
                <Ionicons name="volume-medium" size={22} color={colors.primary} />
              </TouchableOpacity>
            </View>

            <Typography variant="title" color="foreground" style={{ marginTop: theme.spacing.sm }}>
              {item.translation}
            </Typography>

            {item.explanation && (
              <Typography variant="body" color="foregroundMuted" style={{ marginTop: theme.spacing.xs }}>
                {item.explanation}
              </Typography>
            )}

            {item.examples && item.examples.length > 0 && (
              <View style={[styles.exampleBox, { backgroundColor: colors.surfaceSubtle, padding: theme.spacing.md, borderRadius: theme.radii.md, marginTop: theme.spacing.md }]}>
                <Typography variant="label" color="primary">
                  Example:
                </Typography>
                {item.examples.map((ex, idx) => (
                  <View key={idx} style={{ marginTop: theme.spacing.xs }}>
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

            <Divider style={{ marginVertical: theme.spacing.md }} />

            <View style={styles.actionRow}>
              {isLearned ? (
                <View style={styles.learnedStatus}>
                  <Ionicons name="checkmark-circle" size={18} color={colors.success} />
                  <Typography variant="label" color="success" style={{ marginLeft: theme.spacing.xs }}>
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
  },
  content: {},
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    fontSize: 34,
    marginBottom: 2,
  },
  speakerButton: {},
  exampleBox: {},
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  learnedStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
