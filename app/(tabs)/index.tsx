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
} from '@/components/ui';
import { theme } from '@/components/ui/theme';
import { useDashboard } from '@/features/today/useDashboard';

export default function TodayScreen() {
  const router = useRouter();
  const { data, loading, refresh, speak } = useDashboard();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={refresh} tintColor={theme.colors.primary} />
      }
    >
      {/* Top Header */}
      <View style={styles.headerRow}>
        <View>
          <Typography variant="display" weight="700">
            Today
          </Typography>
          <Typography variant="caption" color="foregroundMuted">
            Small daily practice, consistent mastery
          </Typography>
        </View>

        {data ? (
          <View style={styles.streakBadge}>
            <Ionicons name="flame" size={18} color="#F97316" />
            <Typography variant="label" color="foreground" style={styles.streakText}>
              {data.streak} {data.streak === 1 ? 'day' : 'days'}
            </Typography>
          </View>
        ) : null}
      </View>

      {/* Recommended Action Card (Section 65) */}
      {data?.recommendation && (
        <Card elevated style={styles.heroCard}>
          <View style={styles.heroHeader}>
            <Badge
              label={data.recommendation.badge ?? 'Recommended'}
              variant={data.recommendation.type === 'review' ? 'warning' : 'vocab'}
            />
          </View>
          <Typography variant="heading" style={styles.heroTitle}>
            {data.recommendation.title}
          </Typography>
          <Typography variant="body" color="foregroundMuted" style={styles.heroDesc}>
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
        <Card style={styles.card}>
          <View style={styles.rowBetween}>
            <Typography variant="title">Daily Goal</Typography>
            <Typography variant="label" color={data.isGoalReached ? 'success' : 'primary'}>
              {data.goalScore} / {data.goalTarget} items
            </Typography>
          </View>

          <ProgressBar
            progress={data.goalProgress}
            color={data.isGoalReached ? theme.colors.success : theme.colors.primary}
            style={styles.progressBar}
          />

          <View style={styles.goalStatsRow}>
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

      {/* Daily Word Card (Section 14: Deterministic) */}
      {data?.dailyWord && (
        <Card style={styles.card}>
          <View style={styles.rowBetween}>
            <Badge label="Daily Word" variant="hangul" />
            <TouchableOpacity
              onPress={() => speak(data.dailyWord.korean)}
              accessibilityLabel="Listen pronunciation"
              style={styles.audioButton}
            >
              <Ionicons name="volume-medium" size={20} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>

          <View style={styles.wordCenter}>
            <Typography variant="display" weight="700" style={styles.koreanWord}>
              {data.dailyWord.korean}
            </Typography>
            {data.dailyWord.romanization ? (
              <Typography variant="body" color="foregroundMuted" style={styles.romanization}>
                [{data.dailyWord.romanization}]
              </Typography>
            ) : null}
            <Typography variant="title" color="foreground">
              {data.dailyWord.translation}
            </Typography>
          </View>

          {data.dailyWord.explanation ? (
            <>
              <Divider style={styles.cardDivider} />
              <Typography variant="caption" color="foregroundMuted">
                {data.dailyWord.explanation}
              </Typography>
            </>
          ) : null}
        </Card>
      )}

      {/* Review Queue Summary Card */}
      {data && data.dueReviewsCount > 0 && (
        <Card subtle style={styles.card}>
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
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing['5xl'],
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceElevated,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radii.full,
    borderWidth: 1,
    borderColor: 'rgba(249, 115, 22, 0.3)',
  },
  streakText: {
    marginLeft: theme.spacing.xs,
  },
  heroCard: {
    marginBottom: theme.spacing.lg,
    borderColor: theme.colors.border,
  },
  heroHeader: {
    marginBottom: theme.spacing.sm,
  },
  heroTitle: {
    marginBottom: theme.spacing.xs,
  },
  heroDesc: {
    marginBottom: theme.spacing.lg,
  },
  card: {
    marginBottom: theme.spacing.lg,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressBar: {
    marginVertical: theme.spacing.md,
  },
  goalStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.sm,
  },
  goalStat: {
    alignItems: 'center',
  },
  wordCenter: {
    alignItems: 'center',
    marginVertical: theme.spacing.md,
  },
  koreanWord: {
    fontSize: 38,
    marginBottom: theme.spacing.xs,
  },
  romanization: {
    marginBottom: theme.spacing.xs,
  },
  cardDivider: {
    marginVertical: theme.spacing.md,
  },
  audioButton: {
    padding: theme.spacing.xs,
  },
});
