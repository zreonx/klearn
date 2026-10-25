import React, { useState, useCallback } from 'react';
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
import { hapticService } from '@/infrastructure/haptics/hapticService';

type DailyBiteType = 'word' | 'phrase' | 'sentence';

export default function TodayScreen() {
  const router = useRouter();
  const { colors, theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { data, loading, refresh, speak } = useDashboard();
  const [biteTab, setBiteTab] = useState<DailyBiteType>('word');

  // Auto-refresh stats and recommendations whenever user switches to or views the Today tab
  useFocusEffect(
    useCallback(() => {
      refresh();
    }, [refresh])
  );

  const getActiveBiteText = () => {
    if (!data) return '';
    if (biteTab === 'word') return data.dailyWord?.korean || '';
    if (biteTab === 'phrase') return data.dailyPhrase?.korean || '';
    return data.dailySentence?.korean || '';
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

      {/* Hero Recommendation Card (Single Unambiguous Primary Action) */}
      {data?.recommendation && (
        <Card elevated style={[styles.heroCard, { marginBottom: theme.spacing.lg }]}>
          <View style={{ marginBottom: theme.spacing.sm }}>
            <Badge
              label={data.recommendation.badge ?? 'Recommended Next'}
              variant={data.recommendation.type === 'review' ? 'warning' : 'vocab'}
            />
          </View>
          <Typography variant="heading" style={{ marginBottom: theme.spacing.xs }}>
            {data.recommendation.title}
          </Typography>
          <Typography variant="body" color="foregroundMuted" style={{ marginBottom: theme.spacing.lg, lineHeight: 20 }}>
            {data.recommendation.description}
          </Typography>
          <Button
            title="Continue Now"
            onPress={() => router.push(data.recommendation.route as any)}
            fullWidth
          />
        </Card>
      )}

      {/* Daily Goal Card (Clean, Encouraging, Compact) */}
      {data && (
        <Card style={[styles.card, { marginBottom: theme.spacing.lg }]}>
          <View style={styles.rowBetween}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Ionicons
                name={data.isGoalReached ? 'checkmark-circle' : 'flag-outline'}
                size={16}
                color={data.isGoalReached ? colors.success : colors.primary}
              />
              <Typography variant="title">Daily Goal</Typography>
            </View>
            <Typography variant="label" color={data.isGoalReached ? 'success' : 'primary'} weight="700">
              {data.goalScore} / {data.goalTarget} items
            </Typography>
          </View>

          <ProgressBar
            progress={data.goalProgress}
            color={data.isGoalReached ? colors.success : colors.primary}
            style={{ marginVertical: theme.spacing.md }}
          />

          <View style={[styles.goalStatsRow, { marginTop: theme.spacing.xs }]}>
            <View style={styles.goalStat}>
              <Typography variant="caption" color="foregroundMuted">
                New Learned
              </Typography>
              <Typography variant="title" weight="700">{data.newItemsCount}</Typography>
            </View>
            <View style={styles.goalStat}>
              <Typography variant="caption" color="foregroundMuted">
                Reviews Done
              </Typography>
              <Typography variant="title" weight="700">{data.reviewsCompletedToday}</Typography>
            </View>
            <View style={styles.goalStat}>
              <Typography variant="caption" color="foregroundMuted">
                Pending Due
              </Typography>
              <Typography
                variant="title"
                weight="700"
                color={data.dueReviewsCount > 0 ? 'warning' : 'foreground'}
              >
                {data.dueReviewsCount}
              </Typography>
            </View>
          </View>
        </Card>
      )}

      {/* Unified Daily Korean Bite Card (Word, Phrase, Sentence in 1 Sleek Card) */}
      {data && (data.dailyWord || data.dailyPhrase || data.dailySentence) && (
        <Card elevated style={[styles.card, { marginBottom: theme.spacing.lg, padding: theme.spacing.lg }]}>
          {/* Card Header & Audio */}
          <View style={[styles.rowBetween, { marginBottom: theme.spacing.md }]}>
            <View>
              <Typography variant="title" weight="700">
                Daily Korean Bite
              </Typography>
              <Typography variant="caption" color="foregroundMuted">
                오늘의 한마디 • Fresh every day
              </Typography>
            </View>
            <TouchableOpacity
              onPress={() => speak(getActiveBiteText())}
              accessibilityLabel="Listen to pronunciation"
              style={[
                styles.audioBtn,
                {
                  backgroundColor: colors.surfaceSubtle,
                  borderRadius: theme.radii.full,
                },
              ]}
            >
              <Ionicons name="volume-high" size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>

          {/* Interactive 3-Way Segment Switcher */}
          <View
            style={[
              styles.segmentContainer,
              {
                backgroundColor: colors.surfaceSubtle,
                borderRadius: theme.radii.lg,
              },
            ]}
          >
            <TouchableOpacity
              style={[
                styles.segmentTab,
                biteTab === 'word' && {
                  backgroundColor: colors.surface,
                  borderRadius: theme.radii.md,
                  borderWidth: 1,
                  borderColor: colors.borderSubtle,
                },
              ]}
              onPress={() => {
                hapticService.lightTick();
                setBiteTab('word');
              }}
            >
              <Typography
                variant="caption"
                weight="700"
                color={biteTab === 'word' ? 'primary' : 'foregroundMuted'}
              >
                단어 Word
              </Typography>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.segmentTab,
                biteTab === 'phrase' && {
                  backgroundColor: colors.surface,
                  borderRadius: theme.radii.md,
                  borderWidth: 1,
                  borderColor: colors.borderSubtle,
                },
              ]}
              onPress={() => {
                hapticService.lightTick();
                setBiteTab('phrase');
              }}
            >
              <Typography
                variant="caption"
                weight="700"
                color={biteTab === 'phrase' ? 'primary' : 'foregroundMuted'}
              >
                표현 Phrase
              </Typography>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.segmentTab,
                biteTab === 'sentence' && {
                  backgroundColor: colors.surface,
                  borderRadius: theme.radii.md,
                  borderWidth: 1,
                  borderColor: colors.borderSubtle,
                },
              ]}
              onPress={() => {
                hapticService.lightTick();
                setBiteTab('sentence');
              }}
            >
              <Typography
                variant="caption"
                weight="700"
                color={biteTab === 'sentence' ? 'primary' : 'foregroundMuted'}
              >
                문장 Sentence
              </Typography>
            </TouchableOpacity>
          </View>

          {/* Active Bite View: Word */}
          {biteTab === 'word' && data.dailyWord && (
            <View style={{ alignItems: 'center', marginVertical: theme.spacing.md }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <Typography variant="display" weight="700" style={styles.koreanWord}>
                  {data.dailyWord.korean}
                </Typography>
                {(data.dailyWord as any).hanja ? (
                  <Badge label={(data.dailyWord as any).hanja} variant="default" />
                ) : null}
              </View>

              {data.dailyWord.romanization ? (
                <Typography variant="body" color="foregroundMuted" style={{ marginBottom: 4 }}>
                  [{data.dailyWord.romanization}]
                </Typography>
              ) : null}

              <Typography variant="heading" color="foreground" weight="700">
                {data.dailyWord.translation}
              </Typography>

              {data.dailyWord.explanation ? (
                <>
                  <Divider style={{ marginVertical: theme.spacing.md, width: '100%' }} />
                  <Typography variant="caption" color="foregroundMuted" align="center" style={{ lineHeight: 18 }}>
                    {data.dailyWord.explanation}
                  </Typography>
                </>
              ) : null}

              {data.dailyWord.examples && data.dailyWord.examples.length > 0 ? (
                <View
                  style={[
                    styles.exampleBox,
                    {
                      backgroundColor: colors.surfaceSubtle,
                      borderColor: colors.borderSubtle,
                      borderRadius: theme.radii.md,
                      marginTop: theme.spacing.md,
                    },
                  ]}
                >
                  <Typography variant="label" color="primary" weight="700" style={{ marginBottom: 2 }}>
                    Example in Context:
                  </Typography>
                  <Typography variant="body" weight="600">
                    {data.dailyWord.examples[0].korean}
                  </Typography>
                  {data.dailyWord.examples[0].romanization ? (
                    <Typography variant="caption" color="foregroundMuted" style={{ marginTop: 1 }}>
                      [{data.dailyWord.examples[0].romanization}]
                    </Typography>
                  ) : null}
                  <Typography variant="caption" color="foreground" style={{ marginTop: 2 }}>
                    {data.dailyWord.examples[0].translation}
                  </Typography>
                </View>
              ) : null}
            </View>
          )}

          {/* Active Bite View: Phrase */}
          {biteTab === 'phrase' && data.dailyPhrase && (
            <View style={{ alignItems: 'center', marginVertical: theme.spacing.md }}>
              <Typography variant="heading" weight="700" align="center" style={{ fontSize: 24, marginBottom: 4 }}>
                {data.dailyPhrase.korean}
              </Typography>

              {data.dailyPhrase.romanization ? (
                <Typography variant="body" color="foregroundMuted" style={{ marginBottom: 4 }}>
                  [{data.dailyPhrase.romanization}]
                </Typography>
              ) : null}

              <Typography variant="title" color="foreground" weight="700" align="center">
                {data.dailyPhrase.translation}
              </Typography>

              {data.dailyPhrase.explanation ? (
                <>
                  <Divider style={{ marginVertical: theme.spacing.md, width: '100%' }} />
                  <Typography variant="caption" color="foregroundMuted" align="center" style={{ lineHeight: 18 }}>
                    {data.dailyPhrase.explanation}
                  </Typography>
                </>
              ) : null}
            </View>
          )}

          {/* Active Bite View: Sentence */}
          {biteTab === 'sentence' && data.dailySentence && (
            <View style={{ alignItems: 'center', marginVertical: theme.spacing.md }}>
              <Typography
                variant="heading"
                weight="700"
                align="center"
                style={{ fontSize: 20, lineHeight: 28, marginBottom: 6 }}
              >
                {data.dailySentence.korean}
              </Typography>

              {data.dailySentence.romanization ? (
                <Typography variant="body" color="foregroundMuted" style={{ marginBottom: 4 }}>
                  [{data.dailySentence.romanization}]
                </Typography>
              ) : null}

              <Typography variant="title" color="foreground" weight="700" align="center">
                {data.dailySentence.translation}
              </Typography>

              {data.dailySentence.explanation ? (
                <>
                  <Divider style={{ marginVertical: theme.spacing.md, width: '100%' }} />
                  <Typography variant="caption" color="foregroundMuted" align="center" style={{ lineHeight: 18 }}>
                    {data.dailySentence.explanation}
                  </Typography>
                </>
              ) : null}
            </View>
          )}
        </Card>
      )}

      {/* AI Conversation & Speaking Roleplay Teaser */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          hapticService.lightTick();
          router.push('/conversation' as any);
        }}
      >
        <Card elevated style={[styles.card, { marginBottom: theme.spacing.lg, padding: theme.spacing.lg }]}>
          <View style={[styles.rowBetween, { marginBottom: theme.spacing.xs }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="chatbubbles" size={20} color={colors.primary} />
              <Typography variant="heading" color="primary" weight="700" style={{ marginLeft: 8 }}>
                AI Conversation & Speaking
              </Typography>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.foregroundSubtle} />
          </View>
          <Typography variant="body" color="foreground" style={{ fontSize: 13, lineHeight: 18, marginTop: 4 }}>
            Practice interactive roleplay scenarios (Seoul Cafe, Introductions, Directions, Dining) with native voice audio & politeness coaching.
          </Typography>
          <View style={{ flexDirection: 'row', gap: 6, marginTop: theme.spacing.sm }}>
            <Badge label="5 Scenarios" variant="hangul" />
            <Badge label="Voice Audio" variant="vocab" />
            <Badge label="Politeness Coach" variant="default" />
          </View>
        </Card>
      </TouchableOpacity>

      {/* Review Queue Summary Card (Conditional) */}
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
  audioBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentContainer: {
    flexDirection: 'row',
    padding: 4,
    marginBottom: 8,
  },
  segmentTab: {
    flex: 1,
    paddingVertical: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  koreanWord: {
    fontSize: 36,
  },
  exampleBox: {
    width: '100%',
    padding: 12,
    borderWidth: 1,
  },
});
