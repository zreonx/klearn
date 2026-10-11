import React, { useCallback } from 'react';
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
  Button,
  ProgressBar,
  Badge,
  Divider,
  useTheme,
} from '@/components/ui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDashboard } from '@/features/today/useDashboard';

export default function TodayScreen() {
  const router = useRouter();
  const { colors, theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { data, loading, refresh, speak } = useDashboard();

  // Auto-refresh stats and recommendations whenever user switches to or views the Today tab
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
      {/* Top Header */}
      <View style={[styles.headerRow, { marginBottom: theme.spacing.xl }]}>
        <View>
          <Typography variant="display" weight="700">
            Today
          </Typography>
          <Typography variant="caption" color="foregroundMuted">
            Small daily practice, consistent mastery
          </Typography>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
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
            }}
            accessibilityLabel="Search dictionary and lessons"
          >
            <Ionicons name="search" size={18} color={colors.foreground} />
          </TouchableOpacity>

          {data ? (
            <View
              style={[
                styles.streakBadge,
                {
                  backgroundColor: colors.surfaceSubtle,
                  borderColor: colors.borderSubtle,
                  paddingHorizontal: theme.spacing.md,
                  paddingVertical: theme.spacing.xs,
                  borderRadius: theme.radii.full,
                },
              ]}
            >
              <Ionicons name="flame" size={18} color={colors.accent} />
              <Typography variant="label" color="foreground" style={[styles.streakText, { marginLeft: theme.spacing.xs }]}>
                {data.streak} {data.streak === 1 ? 'day' : 'days'}
              </Typography>
            </View>
          ) : null}
        </View>
      </View>

      {/* Recommended Action Card (Section 65) */}
      {data?.recommendation && (
        <Card elevated style={[styles.heroCard, { marginBottom: theme.spacing.lg }]}>
          <View style={{ marginBottom: theme.spacing.sm }}>
            <Badge
              label={data.recommendation.badge ?? 'Recommended'}
              variant={data.recommendation.type === 'review' ? 'warning' : 'vocab'}
            />
          </View>
          <Typography variant="heading" style={{ marginBottom: theme.spacing.xs }}>
            {data.recommendation.title}
          </Typography>
          <Typography variant="body" color="foregroundMuted" style={{ marginBottom: theme.spacing.lg }}>
            {data.recommendation.description}
          </Typography>
          <Button
            title="Continue Now"
            onPress={() => router.push(data.recommendation.route as any)}
            fullWidth
          />
        </Card>
      )}

      {/* 5-Stage Long-Term Milestone Card */}
      {data?.learnerProfile && (
        <Card elevated style={[styles.card, { marginBottom: theme.spacing.lg }]}>
          <View style={styles.rowBetween}>
            <View style={{ flex: 1, marginRight: theme.spacing.sm }}>
              <Badge label="Active Milestone" variant="success" style={{ alignSelf: 'flex-start', marginBottom: 6 }} />
              <Typography variant="title" weight="700">
                {data.learnerProfile.stageName}
              </Typography>
              <Typography variant="caption" color="foregroundMuted" style={{ marginTop: 2 }}>
                {data.learnerProfile.stageOutcome}
              </Typography>
            </View>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                width: 58,
                height: 58,
                borderRadius: 29,
                backgroundColor: colors.surfaceSubtle,
                borderWidth: 1,
                borderColor: colors.borderSubtle,
              }}
            >
              <Typography variant="title" weight="700" color="primary">
                {data.learnerProfile.overallFluencyScore}%
              </Typography>
              <Typography variant="caption" color="foregroundSubtle" style={{ fontSize: 9 }}>
                Fluency
              </Typography>
            </View>
          </View>

          {data.learnerProfile.recommendedFocus && (
            <View
              style={{
                backgroundColor: colors.surfaceSubtle,
                padding: theme.spacing.md,
                borderRadius: theme.radii.md,
                marginTop: theme.spacing.md,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderWidth: 1,
                borderColor: colors.borderSubtle,
              }}
            >
              <View style={{ flex: 1, marginRight: theme.spacing.md }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                  <Ionicons name="sparkles" size={14} color={colors.accent} />
                  <Typography variant="label" color="accent" weight="700">
                    Recommended Focus
                  </Typography>
                </View>
                <Typography variant="caption" color="foregroundMuted" style={{ lineHeight: 18 }}>
                  {data.learnerProfile.recommendedFocus.reason}
                </Typography>
              </View>
              <TouchableOpacity
                onPress={() => router.push('/review')}
                style={{
                  backgroundColor: colors.primary,
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  borderRadius: theme.radii.md,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <Typography variant="caption" color="background" weight="700">
                  Practice Now
                </Typography>
                <Ionicons name="arrow-forward" size={13} color={colors.primaryForeground} />
              </TouchableOpacity>
            </View>
          )}
        </Card>
      )}

      {/* 6-Skill Fluency Radar / Breakdown Card */}
      {data?.learnerProfile && (
        <Card style={[styles.card, { marginBottom: theme.spacing.lg }]}>
          <View style={[styles.rowBetween, { marginBottom: theme.spacing.md }]}>
            <View>
              <Typography variant="title" weight="700">
                6-Skill Competency
              </Typography>
              <Typography variant="caption" color="foregroundMuted">
                Real retention, application & vocabulary memory
              </Typography>
            </View>
            <TouchableOpacity onPress={() => router.push('/learn')}>
              <Typography variant="caption" color="primary" weight="600">
                View Path →
              </Typography>
            </TouchableOpacity>
          </View>

          <View style={{ gap: 10 }}>
            {Object.values(data.learnerProfile.skills).map((skillStat) => (
              <View key={skillStat.skill}>
                <View style={[styles.rowBetween, { marginBottom: 3 }]}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Typography variant="body" weight="600">
                      {skillStat.label}
                    </Typography>
                    <Typography variant="caption" color="foregroundMuted">
                      ({skillStat.koreanLabel})
                    </Typography>
                    {skillStat.isWeakArea ? (
                      <Badge label="Needs Review" variant="warning" style={{ transform: [{ scale: 0.85 }] }} />
                    ) : null}
                  </View>
                  <Typography variant="label" color="foregroundMuted">
                    {skillStat.score}%
                  </Typography>
                </View>
                <ProgressBar
                  progress={skillStat.score / 100}
                  color={skillStat.isWeakArea ? colors.accent : colors.primary}
                />
              </View>
            ))}
          </View>
        </Card>
      )}

      {/* Daily Goal Card (Section 13 & 21) */}
      {data && (
        <Card style={[styles.card, { marginBottom: theme.spacing.lg }]}>
          <View style={styles.rowBetween}>
            <Typography variant="title">Daily Goal</Typography>
            <Typography variant="label" color={data.isGoalReached ? 'success' : 'primary'}>
              {data.goalScore} / {data.goalTarget} items
            </Typography>
          </View>

          <ProgressBar
            progress={data.goalProgress}
            color={data.isGoalReached ? colors.success : colors.primary}
            style={{ marginVertical: theme.spacing.md }}
          />

          <View style={[styles.goalStatsRow, { marginTop: theme.spacing.sm }]}>
            <View style={styles.goalStat}>
              <Typography variant="caption" color="foregroundMuted">
                New Learned
              </Typography>
              <Typography variant="title">{data.newItemsCount}</Typography>
            </View>
            <View style={styles.goalStat}>
              <Typography variant="caption" color="foregroundMuted">
                Reviews Done
              </Typography>
              <Typography variant="title">{data.reviewsCompletedToday}</Typography>
            </View>
            <View style={styles.goalStat}>
              <Typography variant="caption" color="foregroundMuted">
                Pending Due
              </Typography>
              <Typography variant="title" color={data.dueReviewsCount > 0 ? 'warning' : 'foreground'}>
                {data.dueReviewsCount}
              </Typography>
            </View>
          </View>
        </Card>
      )}

      {/* Daily Word Card */}
      {data?.dailyWord && (
        <Card style={[styles.card, { marginBottom: theme.spacing.lg }]}>
          <View style={styles.rowBetween}>
            <Badge label="Daily Word" variant="hangul" />
            <TouchableOpacity
              onPress={() => speak(data.dailyWord.korean)}
              accessibilityLabel="Listen pronunciation"
              style={{ padding: theme.spacing.xs }}
            >
              <Ionicons name="volume-medium" size={22} color={colors.primary} />
            </TouchableOpacity>
          </View>

          <View style={[styles.wordCenter, { marginVertical: theme.spacing.md }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Typography variant="display" weight="700" style={styles.koreanWord}>
                {data.dailyWord.korean}
              </Typography>
              {(data.dailyWord as any).hanja ? (
                <Badge label={(data.dailyWord as any).hanja} variant="default" style={{ marginBottom: 4 }} />
              ) : null}
            </View>
            {data.dailyWord.romanization ? (
              <Typography variant="body" color="foregroundMuted" style={{ marginBottom: theme.spacing.xs }}>
                [{data.dailyWord.romanization}]
              </Typography>
            ) : null}
            <Typography variant="title" color="foreground">
              {data.dailyWord.translation}
            </Typography>
          </View>

          {data.dailyWord.explanation ? (
            <>
              <Divider style={{ marginVertical: theme.spacing.md }} />
              <Typography variant="caption" color="foregroundMuted">
                {data.dailyWord.explanation}
              </Typography>
            </>
          ) : null}

          {data.dailyWord.examples && data.dailyWord.examples.length > 0 ? (
            <View style={{ backgroundColor: colors.surfaceSubtle, padding: theme.spacing.md, borderRadius: theme.radii.md, marginTop: theme.spacing.md }}>
              <Typography variant="label" color="primary" style={{ marginBottom: 2 }}>
                Example in Context:
              </Typography>
              <Typography variant="body" weight="600">
                {data.dailyWord.examples[0].korean}
              </Typography>
              {data.dailyWord.examples[0].romanization ? (
                <Typography variant="caption" color="foregroundMuted">
                  [{data.dailyWord.examples[0].romanization}]
                </Typography>
              ) : null}
              <Typography variant="caption" color="foreground">
                {data.dailyWord.examples[0].translation}
              </Typography>
            </View>
          ) : null}
        </Card>
      )}

      {/* Daily Phrase Card */}
      {data?.dailyPhrase && (
        <Card style={[styles.card, { marginBottom: theme.spacing.lg }]}>
          <View style={styles.rowBetween}>
            <Badge label="Daily Phrase" variant="vocab" />
            <TouchableOpacity
              onPress={() => speak(data.dailyPhrase.korean)}
              accessibilityLabel="Listen pronunciation"
              style={{ padding: theme.spacing.xs }}
            >
              <Ionicons name="volume-medium" size={22} color={colors.primary} />
            </TouchableOpacity>
          </View>

          <View style={[styles.wordCenter, { marginVertical: theme.spacing.md }]}>
            <Typography variant="heading" weight="700" align="center" style={{ fontSize: 26, marginBottom: 4 }}>
              {data.dailyPhrase.korean}
            </Typography>
            {data.dailyPhrase.romanization ? (
              <Typography variant="body" color="foregroundMuted" style={{ marginBottom: theme.spacing.xs }}>
                [{data.dailyPhrase.romanization}]
              </Typography>
            ) : null}
            <Typography variant="title" color="foreground" align="center">
              {data.dailyPhrase.translation}
            </Typography>
          </View>

          {data.dailyPhrase.explanation ? (
            <>
              <Divider style={{ marginVertical: theme.spacing.md }} />
              <Typography variant="caption" color="foregroundMuted">
                {data.dailyPhrase.explanation}
              </Typography>
            </>
          ) : null}
        </Card>
      )}

      {/* Daily Practical Sentence Card */}
      {data?.dailySentence && (
        <Card style={[styles.card, { marginBottom: theme.spacing.lg }]}>
          <View style={styles.rowBetween}>
            <Badge label="Daily Sentence" variant="hangul" />
            <TouchableOpacity
              onPress={() => speak(data.dailySentence.korean)}
              accessibilityLabel="Listen pronunciation"
              style={{ padding: theme.spacing.xs }}
            >
              <Ionicons name="volume-medium" size={22} color={colors.primary} />
            </TouchableOpacity>
          </View>

          <View style={[styles.wordCenter, { marginVertical: theme.spacing.md }]}>
            <Typography variant="heading" weight="700" align="center" style={{ fontSize: 22, lineHeight: 30, marginBottom: 4 }}>
              {data.dailySentence.korean}
            </Typography>
            {data.dailySentence.romanization ? (
              <Typography variant="body" color="foregroundMuted" style={{ marginBottom: theme.spacing.xs }}>
                [{data.dailySentence.romanization}]
              </Typography>
            ) : null}
            <Typography variant="title" color="foreground" align="center">
              {data.dailySentence.translation}
            </Typography>
          </View>

          {data.dailySentence.explanation ? (
            <>
              <Divider style={{ marginVertical: theme.spacing.md }} />
              <Typography variant="caption" color="foregroundMuted">
                {data.dailySentence.explanation}
              </Typography>
            </>
          ) : null}
        </Card>
      )}

      {/* Review Queue Summary Card */}
      {data && data.dueReviewsCount > 0 && (
        <Card subtle style={[styles.card, { marginBottom: theme.spacing.lg }]}>
          <View style={styles.rowBetween}>
            <View>
              <Typography variant="title">Spaced Reviews</Typography>
              <Typography variant="caption" color="foregroundMuted">
                {data.dueReviewsCount} card{data.dueReviewsCount > 1 ? 's' : ''} ready for review
              </Typography>
            </View>
            <Button
              title="Review Now"
              size="sm"
              variant="outline"
              onPress={() => router.push('/review')}
            />
          </View>
        </Card>
      )}
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
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
  },
  streakText: {},
  heroCard: {},
  card: {},
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  goalStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  goalStat: {
    alignItems: 'center',
  },
  wordCenter: {
    alignItems: 'center',
  },
  koreanWord: {
    fontSize: 40,
    marginBottom: 4,
  },
});
