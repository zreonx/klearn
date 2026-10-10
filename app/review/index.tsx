import React, { useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
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
import { useReview } from '@/features/review/useReview';
import { ReviewRating } from '@/domain/srs/types';

export default function ReviewSessionScreen() {
  const router = useRouter();
  const { colors, theme } = useTheme();
  const insets = useSafeAreaInsets();
  const {
    currentCard,
    currentIndex,
    queue,
    isFlipped,
    loading,
    startSession,
    flipCard,
    submitRating,
    speak,
    resetSession,
  } = useReview();

  useEffect(() => {
    startSession();
    return () => {
      resetSession();
    };
  }, []);

  if (loading) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.background, padding: theme.spacing.xl }]}>
        <Typography variant="body" color="foregroundMuted">
          Loading review session...
        </Typography>
      </View>
    );
  }

  // Session completed or empty queue
  if (!currentCard || queue.length === 0) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.background, padding: theme.spacing.xl }]}>
        <Card elevated style={[styles.completionCard, { padding: theme.spacing['2xl'], borderRadius: theme.radii.xl }]}>
          <View style={[styles.checkCircle, { backgroundColor: colors.successSurface }]}>
            <Ionicons name="checkmark-done" size={40} color={colors.success} />
          </View>
          <Typography variant="heading" align="center" style={{ marginBottom: theme.spacing.sm }}>
            All Reviews Complete!
          </Typography>
          <Typography variant="body" color="foregroundMuted" align="center" style={{ marginBottom: theme.spacing['2xl'] }}>
            You have reviewed all cards scheduled for today. Great job keeping your memory fresh!
          </Typography>
          <Button
            title="Return to Today"
            fullWidth
            onPress={() => router.back()}
          />
        </Card>
      </View>
    );
  }

  const progress = queue.length > 0 ? (currentIndex + 1) / queue.length : 1;
  const item = currentCard.item;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Session Progress Header */}
      <View
        style={[
          styles.header,
          {
            paddingHorizontal: theme.spacing.lg,
            paddingTop: Math.max(insets.top + 12, theme.spacing.xl),
            paddingBottom: theme.spacing.md,
          },
        ]}
      >
        <View style={[styles.headerTop, { marginBottom: theme.spacing.md }]}>
          <Typography variant="label" color="foregroundMuted">
            Review {currentIndex + 1} of {queue.length}
          </Typography>
          <TouchableOpacity
            onPress={() => router.back()}
            accessibilityLabel="Close review"
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            style={{ padding: 4 }}
          >
            <Ionicons name="close" size={24} color={colors.foreground} />
          </TouchableOpacity>
        </View>
        <ProgressBar progress={progress} color={colors.primary} />
      </View>

      <ScrollView contentContainerStyle={[styles.cardContainer, { padding: theme.spacing.lg }]}>
        <Card elevated style={[styles.flashcard, { padding: theme.spacing.xl, borderRadius: theme.radii.xl }]} onPress={flipCard}>
          <View style={styles.flashcardHeader}>
            <Badge label="Korean" variant="vocab" />
            <TouchableOpacity
              onPress={() => speak(item.korean)}
              style={{ padding: theme.spacing.xs }}
              accessibilityLabel="Listen"
            >
              <Ionicons name="volume-medium" size={24} color={colors.primary} />
            </TouchableOpacity>
          </View>

          {/* Front Prompt */}
          <View style={[styles.promptArea, { marginVertical: theme.spacing['2xl'] }]}>
            <Typography variant="display" weight="700" align="center" style={styles.koreanText}>
              {item.korean}
            </Typography>
            {item.romanization && !isFlipped && (
              <Typography variant="body" color="foregroundMuted" align="center" style={{ marginTop: theme.spacing.xs }}>
                [{item.romanization}]
              </Typography>
            )}
          </View>

          {!isFlipped ? (
            <View style={[styles.revealHint, { paddingVertical: theme.spacing.md }]}>
              <Ionicons name="eye-outline" size={18} color={colors.foregroundSubtle} />
              <Typography variant="caption" color="foregroundSubtle" style={{ marginLeft: theme.spacing.xs }}>
                Tap anywhere to reveal meaning
              </Typography>
            </View>
          ) : (
            /* Back Answer Revealed */
            <View style={[styles.answerArea, { marginTop: theme.spacing.md }]}>
              <Divider style={{ marginBottom: theme.spacing.lg }} />
              <Typography variant="heading" color="foreground" align="center" style={styles.translation}>
                {item.translation}
              </Typography>
              {item.explanation && (
                <Typography variant="body" color="foregroundMuted" align="center" style={{ marginTop: theme.spacing.sm }}>
                  {item.explanation}
                </Typography>
              )}
            </View>
          )}
        </Card>
      </ScrollView>

      {/* SRS Rating Bar (Visible when card is revealed) */}
      {isFlipped ? (
        <View
          style={[
            styles.ratingBar,
            {
              backgroundColor: colors.surfaceSubtle,
              borderTopColor: colors.borderSubtle,
              padding: theme.spacing.lg,
              paddingBottom: Math.max(insets.bottom, theme.spacing.lg),
            },
          ]}
        >
          <Typography variant="caption" color="foregroundMuted" align="center" style={{ marginBottom: theme.spacing.sm }}>
            How well did you recall this?
          </Typography>
          <View style={[styles.ratingButtonsRow, { gap: theme.spacing.sm }]}>
            <TouchableOpacity
              style={[styles.ratingBtn, { backgroundColor: colors.surfaceElevated, borderColor: colors.destructive, borderRadius: theme.radii.md, paddingVertical: theme.spacing.md }]}
              onPress={() => submitRating(ReviewRating.Again)}
            >
              <Typography variant="label" color="destructive">
                Again
              </Typography>
              <Typography variant="caption" color="foregroundSubtle">
                1 day
              </Typography>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.ratingBtn, { backgroundColor: colors.surfaceElevated, borderColor: colors.warning, borderRadius: theme.radii.md, paddingVertical: theme.spacing.md }]}
              onPress={() => submitRating(ReviewRating.Hard)}
            >
              <Typography variant="label" color="warning">
                Hard
              </Typography>
              <Typography variant="caption" color="foregroundSubtle">
                Slow
              </Typography>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.ratingBtn, { backgroundColor: colors.surfaceElevated, borderColor: colors.primary, borderRadius: theme.radii.md, paddingVertical: theme.spacing.md }]}
              onPress={() => submitRating(ReviewRating.Good)}
            >
              <Typography variant="label" color="primary">
                Good
              </Typography>
              <Typography variant="caption" color="foregroundSubtle">
                Standard
              </Typography>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.ratingBtn, { backgroundColor: colors.surfaceElevated, borderColor: colors.success, borderRadius: theme.radii.md, paddingVertical: theme.spacing.md }]}
              onPress={() => submitRating(ReviewRating.Easy)}
            >
              <Typography variant="label" color="success">
                Easy
              </Typography>
              <Typography variant="caption" color="foregroundSubtle">
                Bonus
              </Typography>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View
          style={[
            styles.revealButtonContainer,
            {
              backgroundColor: colors.surfaceSubtle,
              borderTopWidth: 1,
              borderTopColor: colors.borderSubtle,
              padding: theme.spacing.lg,
              paddingBottom: Math.max(insets.bottom, theme.spacing.lg),
            },
          ]}
        >
          <Button title="Reveal Meaning" fullWidth onPress={flipCard} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {},
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  flashcard: {
    minHeight: 280,
    justifyContent: 'space-between',
  },
  flashcardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  promptArea: {
    alignItems: 'center',
  },
  koreanText: {
    fontSize: 48,
    marginBottom: 4,
  },
  revealHint: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  answerArea: {
    alignItems: 'center',
  },
  translation: {
    fontSize: 22,
    marginBottom: 4,
  },
  ratingBar: {
    borderTopWidth: 1,
  },
  ratingButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ratingBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  revealButtonContainer: {},
  completionCard: {
    alignItems: 'center',
    width: '100%',
  },
  checkCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
});
