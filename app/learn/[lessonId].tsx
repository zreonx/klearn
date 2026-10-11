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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLearn } from '@/features/learn/useLearn';
import { LearningItem } from '@/domain/learning/types';

export default function LessonDetailScreen() {
  const { lessonId } = useLocalSearchParams<{ lessonId: string }>();
  const router = useRouter();
  const { colors, theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { getLessonDetails, markItemLearned, speak, recordsMap } = useLearn();

  const [lessonData, setLessonData] = useState<Awaited<
    ReturnType<typeof getLessonDetails>
  > | null>(null);

  useEffect(() => {
    if (lessonId) {
      getLessonDetails(lessonId).then(async (details) => {
        setLessonData(details);
        // Automatically mark all unseen items in this lesson as learned when viewed
        if (details && details.items) {
          for (const item of details.items) {
            const currentRecord = recordsMap.get(item.id);
            if (!currentRecord || currentRecord.status === 'unseen') {
              await markItemLearned(item.id);
            }
          }
        }
      });
    }
  }, [lessonId, recordsMap, markItemLearned]);

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
      contentContainerStyle={[
        styles.content,
        {
          padding: theme.spacing.lg,
          paddingBottom: Math.max(insets.bottom + 16, theme.spacing['4xl']),
        },
      ]}
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

      {/* Concept Note & Politeness / Grammar Tip */}
      {lesson.conceptNote && (
        <Card subtle style={{ marginBottom: theme.spacing.xl, padding: theme.spacing.lg }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing.xs }}>
            <Ionicons name="bulb-outline" size={18} color={colors.primary} />
            <Typography variant="label" color="primary" style={{ marginLeft: theme.spacing.xs }}>
              Lesson Concept
            </Typography>
            {lesson.conceptNote.formalityLevel && (
              <Badge
                label={lesson.conceptNote.formalityLevel.toUpperCase()}
                variant="vocab"
                style={{ marginLeft: 'auto' }}
              />
            )}
          </View>
          <Typography variant="body" weight="600" style={{ marginTop: theme.spacing.xs }}>
            {lesson.conceptNote.summary}
          </Typography>
          <Typography variant="body" color="foregroundMuted" style={{ marginTop: theme.spacing.xs }}>
            {lesson.conceptNote.explanation}
          </Typography>
          {lesson.conceptNote.grammarTip && (
            <View style={{ backgroundColor: colors.surfaceElevated, padding: theme.spacing.sm, borderRadius: theme.radii.sm, marginTop: theme.spacing.sm }}>
              <Typography variant="caption" color="primary" weight="600">
                Tip: {lesson.conceptNote.grammarTip}
              </Typography>
            </View>
          )}
        </Card>
      )}

      {/* Learning Objectives */}
      {lesson.learningObjectives && lesson.learningObjectives.length > 0 && (
        <View style={{ marginBottom: theme.spacing.xl }}>
          <Typography variant="label" color="foregroundMuted" style={{ marginBottom: theme.spacing.xs }}>
            Learning Goals
          </Typography>
          {lesson.learningObjectives.map((obj, idx) => (
            <View key={idx} style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
              <Ionicons name="checkmark-circle-outline" size={16} color={colors.primary} />
              <Typography variant="caption" color="foreground" style={{ marginLeft: theme.spacing.xs }}>
                {obj}
              </Typography>
            </View>
          ))}
        </View>
      )}

      {/* Mini Dialogue / Reading Comprehension (Phase 4) */}
      {lesson.dialogue && (
        <Card elevated style={{ marginBottom: theme.spacing.xl, padding: theme.spacing.lg }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing.xs }}>
            <Ionicons name="chatbubbles-outline" size={18} color={colors.primary} />
            <Typography variant="label" color="primary" style={{ marginLeft: theme.spacing.xs }}>
              Context Dialogue: {lesson.dialogue.title}
            </Typography>
          </View>
          <Typography variant="caption" color="foregroundMuted" style={{ marginBottom: theme.spacing.md }}>
            {lesson.dialogue.description}
          </Typography>

          <View style={{ gap: theme.spacing.sm }}>
            {lesson.dialogue.lines.map((line, idx) => (
              <View
                key={idx}
                style={{
                  backgroundColor: colors.surfaceSubtle,
                  borderRadius: theme.radii.md,
                  padding: theme.spacing.md,
                }}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="caption" color="primary" weight="600">
                    {line.speaker}
                  </Typography>
                  <TouchableOpacity
                    onPress={() => speak(line.korean)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    style={{ padding: 2 }}
                    accessibilityLabel="Listen"
                  >
                    <Ionicons name="volume-medium" size={18} color={colors.primary} />
                  </TouchableOpacity>
                </View>
                <Typography variant="body" weight="600" style={{ marginTop: 2 }}>
                  {line.korean}
                </Typography>
                {line.romanization && (
                  <Typography variant="caption" color="foregroundMuted" style={{ marginTop: 2 }}>
                    [{line.romanization}]
                  </Typography>
                )}
                <Typography variant="caption" color="foreground" style={{ marginTop: 2 }}>
                  {line.translation}
                </Typography>
              </View>
            ))}
          </View>
        </Card>
      )}

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
              <View style={styles.learnedStatus}>
                <Ionicons name="checkmark-circle" size={18} color={colors.success} />
                <Typography variant="label" color="success" style={{ marginLeft: theme.spacing.xs }}>
                  Learned · Scheduled for Review
                </Typography>
              </View>
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
