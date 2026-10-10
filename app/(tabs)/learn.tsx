import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  Typography,
  Card,
  ProgressBar,
  Badge,
} from '@/components/ui';
import { theme } from '@/components/ui/theme';
import { useLearn } from '@/features/learn/useLearn';
import { getLessonProgress, isLessonCompleted } from '@/domain/curriculum/types';

export default function LearnScreen() {
  const router = useRouter();
  const { curriculum, recordsMap, loading, refresh } = useLearn();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={refresh} tintColor={theme.colors.primary} />
      }
    >
      <View style={styles.header}>
        <Typography variant="display" weight="700">
          Curriculum
        </Typography>
        <Typography variant="caption" color="foregroundMuted">
          Structured Korean lessons from Hangul to everyday mastery
        </Typography>
      </View>

      {curriculum?.levels.map((level) => (
        <View key={level.id} style={styles.levelContainer}>
          <Typography variant="title" color="primary" style={styles.levelTitle}>
            Level {level.order}: {level.title}
          </Typography>
          <Typography variant="caption" color="foregroundMuted" style={styles.levelDesc}>
            {level.description}
          </Typography>

          {level.units.map((unit) => (
            <View key={unit.id} style={styles.unitContainer}>
              <View style={styles.unitHeader}>
                <Ionicons name="folder-outline" size={16} color={theme.colors.foregroundMuted} />
                <Typography variant="label" color="foregroundMuted" style={styles.unitTitle}>
                  Unit {unit.order}: {unit.title}
                </Typography>
              </View>

              {unit.lessons.map((lesson) => {
                const progress = getLessonProgress(lesson, recordsMap);
                const completed = isLessonCompleted(lesson, recordsMap);

                return (
                  <Card
                    key={lesson.id}
                    elevated
                    style={styles.lessonCard}
                    onPress={() => router.push(`/learn/${lesson.id}`)}
                  >
                    <View style={styles.lessonTopRow}>
                      <View style={styles.lessonInfo}>
                        <View style={styles.titleRow}>
                          <Typography variant="title">{lesson.title}</Typography>
                          {lesson.koreanTitle ? (
                            <Typography variant="caption" color="foregroundMuted" style={styles.koreanTitle}>
                              ({lesson.koreanTitle})
                            </Typography>
                          ) : null}
                        </View>
                        <Typography variant="body" color="foregroundMuted" style={styles.lessonDesc}>
                          {lesson.description}
                        </Typography>
                      </View>

                      {completed ? (
                        <Badge label="Completed" variant="success" />
                      ) : progress > 0 ? (
                        <Badge label={`${Math.round(progress * 100)}%`} variant="vocab" />
                      ) : (
                        <Badge label="Start" variant="default" />
                      )}
                    </View>

                    <ProgressBar
                      progress={progress}
                      color={completed ? theme.colors.success : theme.colors.primary}
                      style={styles.lessonProgress}
                    />

                    <View style={styles.lessonFooter}>
                      <Typography variant="caption" color="foregroundSubtle">
                        {lesson.itemIds.length} items
                      </Typography>
                      <Ionicons name="chevron-forward" size={16} color={theme.colors.foregroundSubtle} />
                    </View>
                  </Card>
                );
              })}
            </View>
          ))}
        </View>
      ))}
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
  levelContainer: {
    marginBottom: theme.spacing['2xl'],
  },
  levelTitle: {
    marginBottom: theme.spacing.xs,
  },
  levelDesc: {
    marginBottom: theme.spacing.lg,
  },
  unitContainer: {
    marginBottom: theme.spacing.lg,
  },
  unitHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  unitTitle: {
    marginLeft: theme.spacing.xs,
  },
  lessonCard: {
    marginBottom: theme.spacing.md,
  },
  lessonTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  lessonInfo: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  koreanTitle: {
    marginLeft: theme.spacing.xs,
  },
  lessonDesc: {
    marginTop: theme.spacing.xs,
  },
  lessonProgress: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  lessonFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
