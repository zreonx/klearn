import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  Typography,
  Card,
  ProgressBar,
  Badge,
  StageJourneyModal,
  useTheme,
} from '@/components/ui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLearn } from '@/features/learn/useLearn';
import { getLessonProgress, isLessonCompleted, isLessonUnlocked } from '@/domain/curriculum/types';
import { services } from '@/application/services';

export default function LearnScreen() {
  const router = useRouter();
  const { colors, theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { curriculum, recordsMap, allLessonsMap, loading, refresh } = useLearn();
  const [showStageModal, setShowStageModal] = useState(false);
  const [isFirstTimeOnboarding, setIsFirstTimeOnboarding] = useState(false);

  // Check onboarding on mount
  useEffect(() => {
    let mounted = true;
    async function checkOnboarding() {
      try {
        const userSettings = await services.settingsRepo.getUserSettings();
        if (mounted && !userSettings.hasCompletedOnboarding) {
          setIsFirstTimeOnboarding(true);
          setShowStageModal(true);
        }
      } catch (e) {
        // Fallback silently if settings fail
      }
    }
    checkOnboarding();
    return () => {
      mounted = false;
    };
  }, []);

  const handleCloseStageModal = async () => {
    setShowStageModal(false);
    if (isFirstTimeOnboarding) {
      setIsFirstTimeOnboarding(false);
      try {
        const userSettings = await services.settingsRepo.getUserSettings();
        await services.settingsRepo.saveUserSettings({
          ...userSettings,
          hasCompletedOnboarding: true,
        });
      } catch (e) {
        // Ignore persistence error
      }
    }
  };

  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

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
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={refresh} tintColor={colors.primary} />
      }
    >
      <View style={[styles.headerRow, { marginBottom: theme.spacing.xl, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
        <View style={{ flex: 1 }}>
          <Typography variant="display" weight="700">
            Curriculum
          </Typography>
          <Typography variant="caption" color="foregroundMuted">
            Structured Korean lessons from Hangul to everyday mastery
          </Typography>
        </View>

        <TouchableOpacity
          onPress={() => router.push('/search' as any)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={{
            width: 38,
            height: 38,
            borderRadius: 19,
            backgroundColor: colors.surfaceSubtle,
            borderWidth: 1,
            borderColor: colors.borderSubtle,
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: theme.spacing.sm,
          }}
          accessibilityLabel="Search dictionary and lessons"
        >
          <Ionicons name="search" size={18} color={colors.foreground} />
        </TouchableOpacity>
      </View>

      {/* Hangul & Numbers Chart Quick Access Card */}
      <Card
        elevated
        style={[styles.hangulHeroCard, { marginBottom: theme.spacing.xl }]}
        onPress={() => router.push('/hangul' as any)}
      >
        <View style={styles.hangulHeroRow}>
          <View style={styles.hangulHeroLeft}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
              <Badge label="Interactive Chart" variant="hangul" />
            </View>
            <Typography variant="heading" weight="700">
              Hangul & Numbers Chart
            </Typography>
            <Typography variant="caption" color="foregroundMuted" style={{ marginTop: 2 }}>
              Letters, Batchim, Native counting & Sino-Korean numbers with audio
            </Typography>
          </View>
          <View style={[styles.hangulBadgeIcon, { backgroundColor: colors.surfaceSubtle }]}>
            <Typography variant="display" weight="700" color="primary" style={{ fontSize: 28 }}>
              한
            </Typography>
          </View>
        </View>
      </Card>

      {/* 5-Stage Proficiency Journey Quick Access Banner */}
      {curriculum?.stages && curriculum.stages.length > 0 ? (
        <Card
          subtle
          style={[styles.journeyBannerCard, { marginBottom: theme.spacing.xl }]}
          onPress={() => setShowStageModal(true)}
        >
          <View style={styles.journeyBannerRow}>
            <View style={{ flex: 1, paddingRight: theme.spacing.sm }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <Badge label="5-Stage Roadmap" variant="vocab" />
                <Badge label="TOPIK Aligned" variant="default" />
              </View>
              <Typography variant="title" weight="700">
                Korean Proficiency Journey
              </Typography>
              <Typography
                variant="caption"
                color="foregroundMuted"
                style={{ marginTop: 2, lineHeight: 18 }}
              >
                From Hangul foundations to real-world fluency. View all 5 stages and learning outcomes.
              </Typography>
            </View>

            <View
              style={[
                styles.journeyArrowCircle,
                { backgroundColor: colors.surface, borderColor: colors.borderSubtle },
              ]}
            >
              <Ionicons name="chevron-forward" size={18} color={colors.primary} />
            </View>
          </View>
        </Card>
      ) : null}

      {curriculum?.levels.map((level) => {
        const isBonus = level.id.includes('bonus') || level.id.includes('casual');
        return (
          <View key={level.id} style={{ marginBottom: theme.spacing['2xl'] }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing.xs }}>
              {isBonus ? (
                <Badge label="Bonus Track" variant="vocab" style={{ marginRight: theme.spacing.xs }} />
              ) : null}
              <Typography variant="title" color="primary" weight="700">
                {level.title}
              </Typography>
            </View>
            <Typography variant="caption" color="foregroundMuted" style={{ marginBottom: theme.spacing.lg }}>
              {level.description}
            </Typography>

          {level.units.map((unit) => (
            <View key={unit.id} style={{ marginBottom: theme.spacing.lg }}>
              <View style={[styles.unitHeader, { marginBottom: theme.spacing.sm }]}>
                <Ionicons name="folder-outline" size={16} color={colors.foregroundMuted} />
                <Typography variant="label" color="foregroundMuted" style={{ marginLeft: theme.spacing.xs }}>
                  Unit {unit.order}: {unit.title}
                </Typography>
              </View>

              {unit.lessons.map((lesson) => {
                const progress = getLessonProgress(lesson, recordsMap);
                const completed = isLessonCompleted(lesson, recordsMap);
                const unlocked = isLessonUnlocked(lesson, allLessonsMap, recordsMap);

                return (
                  <Card
                    key={lesson.id}
                    elevated={unlocked}
                    subtle={!unlocked}
                    style={[
                      { marginBottom: theme.spacing.md },
                      !unlocked && { opacity: 0.65 },
                    ]}
                    onPress={unlocked ? () => router.push(`/learn/${lesson.id}`) : undefined}
                  >
                    <View style={styles.lessonTopRow}>
                      <View style={[styles.lessonInfo, { marginRight: theme.spacing.md }]}>
                        <View style={styles.titleRow}>
                          <Typography variant="title" color={unlocked ? 'foreground' : 'foregroundMuted'}>
                            {lesson.title}
                          </Typography>
                          {lesson.koreanTitle ? (
                            <Typography variant="caption" color="foregroundMuted" style={{ marginLeft: theme.spacing.xs }}>
                              ({lesson.koreanTitle})
                            </Typography>
                          ) : null}
                        </View>
                        <Typography variant="body" color="foregroundMuted" style={{ marginTop: theme.spacing.xs }}>
                          {lesson.description}
                        </Typography>
                      </View>

                      {!unlocked ? (
                        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surfaceSubtle, paddingHorizontal: 8, paddingVertical: 4, borderRadius: theme.radii.sm }}>
                          <Ionicons name="lock-closed" size={14} color={colors.foregroundSubtle} />
                          <Typography variant="caption" color="foregroundSubtle" style={{ marginLeft: 4 }}>
                            Locked
                          </Typography>
                        </View>
                      ) : completed ? (
                        <Badge label="Completed" variant="success" />
                      ) : progress > 0 ? (
                        <Badge label={`${Math.round(progress * 100)}%`} variant="vocab" />
                      ) : (
                        <Badge label="Start" variant="default" />
                      )}
                    </View>

                    {unlocked ? (
                      <ProgressBar
                        progress={progress}
                        color={completed ? colors.success : colors.primary}
                        style={{ marginTop: theme.spacing.md, marginBottom: theme.spacing.sm }}
                      />
                    ) : (
                      <View style={{ marginTop: theme.spacing.md, marginBottom: theme.spacing.xs }}>
                        <Typography variant="caption" color="foregroundSubtle">
                          Complete previous prerequisite lessons to unlock
                        </Typography>
                      </View>
                    )}

                    <View style={styles.lessonFooter}>
                      <Typography variant="caption" color="foregroundSubtle">
                        {lesson.itemIds.length} items
                      </Typography>
                      {unlocked ? (
                        <Ionicons name="chevron-forward" size={16} color={colors.foregroundSubtle} />
                      ) : (
                        <Ionicons name="lock-closed-outline" size={14} color={colors.foregroundSubtle} />
                      )}
                    </View>
                  </Card>
                );
              })}
            </View>
          ))}
        </View>
      );
    })}

      <StageJourneyModal
        visible={showStageModal}
        stages={curriculum?.stages ?? []}
        onClose={handleCloseStageModal}
        isFirstTime={isFirstTimeOnboarding}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {},
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hangulHeroCard: {
    padding: 16,
  },
  hangulHeroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  hangulHeroLeft: {
    flex: 1,
    marginRight: 12,
  },
  hangulBadgeIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  journeyBannerCard: {
    padding: 16,
  },
  journeyBannerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  journeyArrowCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unitHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lessonTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  lessonInfo: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  lessonFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
