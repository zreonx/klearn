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
} from '@/components/ui';
import { theme } from '@/components/ui/theme';
import { useReview } from '@/features/review/useReview';
import { ReviewRating } from '@/domain/srs/types';

export default function ReviewSessionScreen() {
  const router = useRouter();
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
      <View style={styles.centerContainer}>
        <Typography variant="body" color="foregroundMuted">
          Loading review session...
        </Typography>
      </View>
    );
  }

  // Session completed or empty queue
  if (!currentCard || queue.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Card elevated style={styles.completionCard}>
          <View style={styles.checkCircle}>
            <Ionicons name="checkmark-done" size={40} color={theme.colors.success} />
          </View>
          <Typography variant="heading" align="center" style={styles.completionTitle}>
            All Reviews Complete!
          </Typography>
          <Typography variant="body" color="foregroundMuted" align="center" style={styles.completionText}>
            You have reviewed all cards scheduled for today. Great job keeping your memory fresh!
          </Typography>
          <Button
            title="Return to Today"
            fullWidth
            onPress={() => router.back()}
            style={styles.completionButton}
          />
        </Card>
      </View>
    );
  }

  const progress = queue.length > 0 ? (currentIndex + 1) / queue.length : 1;
  const item = currentCard.item;

  return (
    <View style={styles.container}>
      {/* Session Progress Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Typography variant="label" color="foregroundMuted">
            Review {currentIndex + 1} of {queue.length}
          </Typography>
          <TouchableOpacity onPress={() => router.back()} accessibilityLabel="Close review">
            <Ionicons name="close" size={24} color={theme.colors.foregroundMuted} />
          </TouchableOpacity>
        </View>
        <ProgressBar progress={progress} color={theme.colors.primary} style={styles.progressBar} />
      </View>

      <ScrollView contentContainerStyle={styles.cardContainer}>
        <Card elevated style={styles.flashcard} onPress={flipCard}>
          <View style={styles.flashcardHeader}>
            <Badge label="Korean" variant="vocab" />
            <TouchableOpacity
              onPress={() => speak(item.korean)}
              style={styles.audioButton}
              accessibilityLabel="Listen"
            >
              <Ionicons name="volume-medium" size={24} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>

          {/* Front Prompt */}
          <View style={styles.promptArea}>
            <Typography variant="display" weight="700" align="center" style={styles.koreanText}>
              {item.korean}
            </Typography>
            {item.romanization && !isFlipped && (
              <Typography variant="body" color="foregroundMuted" align="center" style={styles.romanization}>
                [{item.romanization}]
              </Typography>
            )}
          </View>

          {!isFlipped ? (
            <View style={styles.revealHint}>
              <Ionicons name="eye-outline" size={18} color={theme.colors.foregroundSubtle} />
              <Typography variant="caption" color="foregroundSubtle" style={styles.revealText}>
                Tap anywhere to reveal meaning
              </Typography>
            </View>
          ) : (
            /* Back Answer Revealed */
            <View style={styles.answerArea}>
              <Divider style={styles.answerDivider} />
              <Typography variant="heading" color="foreground" align="center" style={styles.translation}>
                {item.translation}
              </Typography>
              {item.explanation && (
                <Typography variant="body" color="foregroundMuted" align="center" style={styles.explanation}>
                  {item.explanation}
                </Typography>
              )}
            </View>
          )}
        </Card>
      </ScrollView>

      {/* SRS Rating Bar (Visible when card is revealed) */}
      {isFlipped ? (
        <View style={styles.ratingBar}>
          <Typography variant="caption" color="foregroundMuted" align="center" style={styles.ratingPrompt}>
            How well did you recall this?
          </Typography>
          <View style={styles.ratingButtonsRow}>
            <TouchableOpacity
              style={[styles.ratingBtn, styles.btnAgain]}
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
              style={[styles.ratingBtn, styles.btnHard]}
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
              style={[styles.ratingBtn, styles.btnGood]}
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
              style={[styles.ratingBtn, styles.btnEasy]}
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
        <View style={styles.revealButtonContainer}>
          <Button title="Reveal Meaning" fullWidth onPress={flipCard} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    padding: theme.spacing.xl,
  },
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.sm,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  progressBar: {
    marginTop: theme.spacing.xs,
  },
  cardContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: theme.spacing.lg,
  },
  flashcard: {
    padding: theme.spacing.xl,
    minHeight: 280,
    justifyContent: 'space-between',
  },
  flashcardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  audioButton: {
    padding: theme.spacing.xs,
  },
  promptArea: {
    alignItems: 'center',
    marginVertical: theme.spacing['2xl'],
  },
  koreanText: {
    fontSize: 48,
    marginBottom: theme.spacing.xs,
  },
  romanization: {
    marginTop: theme.spacing.xs,
  },
  revealHint: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
  },
  revealText: {
    marginLeft: theme.spacing.xs,
  },
  answerArea: {
    alignItems: 'center',
    marginTop: theme.spacing.md,
  },
  answerDivider: {
    marginBottom: theme.spacing.lg,
  },
  translation: {
    fontSize: 22,
    marginBottom: theme.spacing.xs,
  },
  explanation: {
    marginTop: theme.spacing.sm,
  },
  ratingBar: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing['3xl'],
    backgroundColor: theme.colors.surfaceSubtle,
    borderTopWidth: 1,
    borderTopColor: theme.colors.borderSubtle,
  },
  ratingPrompt: {
    marginBottom: theme.spacing.sm,
  },
  ratingButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing.sm,
  },
  ratingBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
    borderRadius: theme.radii.md,
    backgroundColor: theme.colors.surfaceElevated,
    borderWidth: 1,
  },
  btnAgain: { borderColor: 'rgba(239, 68, 68, 0.4)' },
  btnHard: { borderColor: 'rgba(245, 158, 11, 0.4)' },
  btnGood: { borderColor: 'rgba(56, 189, 248, 0.4)' },
  btnEasy: { borderColor: 'rgba(16, 185, 129, 0.4)' },
  revealButtonContainer: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing['3xl'],
    backgroundColor: theme.colors.surfaceSubtle,
  },
  completionCard: {
    padding: theme.spacing['2xl'],
    alignItems: 'center',
    width: '100%',
  },
  checkCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  completionTitle: {
    marginBottom: theme.spacing.sm,
  },
  completionText: {
    marginBottom: theme.spacing['2xl'],
  },
  completionButton: {
    marginTop: theme.spacing.sm,
  },
});
