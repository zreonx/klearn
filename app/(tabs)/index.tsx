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
            <Typography variant="display" weight="700" style={styles.koreanWord}>
              {data.dailyWord.korean}
            </Typography>
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
