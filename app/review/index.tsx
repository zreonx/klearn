import React, { useEffect, useState } from 'react';
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
import { services } from '@/application/services';
import { hapticService } from '@/infrastructure/haptics/hapticService';

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

  const [isStarred, setIsStarred] = useState<boolean>(false);

  useEffect(() => {
    startSession();
    return () => {
      resetSession();
    };
  }, []);

  useEffect(() => {
    if (currentCard?.item.id) {
      services.learningRepo.getByItemId(currentCard.item.id).then((rec) => {
        setIsStarred(Boolean(rec?.isStarred));
      });
    }
  }, [currentCard]);

  const handleToggleStar = async () => {
    if (!currentCard?.item) return;
    hapticService.lightTick();
    const newStatus = await services.learningRepo.toggleStar(currentCard.item.id);
    setIsStarred(newStatus);
  };

  const handleFlipCard = () => {
    hapticService.lightTick();
    flipCard();
  };

  const handleRatingPress = async (rating: ReviewRating) => {
    hapticService.lightTick();
    await submitRating(rating);
  };

  if (loading) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.background, padding: theme.spacing.xl }]}>
        <Typography variant="body" color="foregroundMuted">
          Loading review session...
        </Typography>
      </View>
    );
  }

  // Empty queue / completed state
  if (queue.length === 0 || currentIndex >= queue.length) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.background, padding: theme.spacing.xl }]}>
        <View style={[styles.trophyCircle, { backgroundColor: colors.surfaceSubtle }]}>
          <Ionicons name="checkmark-done" size={48} color={colors.primary} />
        </View>
        <Typography variant="heading" align="center" style={{ marginBottom: theme.spacing.xs }}>
          All Caught Up!
        </Typography>
        <Typography variant="body" color="foregroundMuted" align="center" style={{ marginBottom: theme.spacing.xl }}>
          You have zero cards due for review today. Great job keeping your memory fresh!
        </Typography>
        <Button
          title="Return to Dashboard"
          onPress={() => router.back()}
          style={{ minWidth: 200 }}
        />
      </View>
    );
  }

  const item = currentCard!.item;
  const progress = queue.length > 0 ? (currentIndex + 1) / queue.length : 1;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Top Header */}
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
            Reviewing {currentIndex + 1} of {queue.length}
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
        <Card elevated style={[styles.flashcard, { padding: theme.spacing.xl, borderRadius: theme.radii.xl }]} onPress={handleFlipCard}>
          <View style={styles.flashcardHeader}>
            <Badge label="Korean" variant="vocab" />
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <TouchableOpacity
                onPress={handleToggleStar}
                accessibilityLabel={isStarred ? 'Unstar card' : 'Star card'}
                style={{ padding: theme.spacing.xs }}
              >
                <Ionicons
                  name={isStarred ? 'star' : 'star-outline'}
                  size={24}
                  color={isStarred ? colors.accent : colors.foregroundMuted}
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => speak(item.korean)}
                style={{ padding: theme.spacing.xs }}
                accessibilityLabel="Listen"
              >
                <Ionicons name="volume-medium" size={24} color={colors.primary} />
              </TouchableOpacity>
            </View>
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
              onPress={() => handleRatingPress(ReviewRating.Again)}
            >
              <Typography variant="label" color="destructive">
                Again
              </Typography>
              <Typography variant="caption" color="foregroundMuted" style={{ fontSize: 10 }}>
                &lt; 1d
              </Typography>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.ratingBtn, { backgroundColor: colors.surfaceElevated, borderColor: colors.warning, borderRadius: theme.radii.md, paddingVertical: theme.spacing.md }]}
              onPress={() => handleRatingPress(ReviewRating.Hard)}
            >
              <Typography variant="label" color="warning">
                Hard
              </Typography>
              <Typography variant="caption" color="foregroundMuted" style={{ fontSize: 10 }}>
                ~ 1d
              </Typography>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.ratingBtn, { backgroundColor: colors.surfaceElevated, borderColor: colors.primary, borderRadius: theme.radii.md, paddingVertical: theme.spacing.md }]}
              onPress={() => handleRatingPress(ReviewRating.Good)}
            >
              <Typography variant="label" color="primary">
                Good
              </Typography>
              <Typography variant="caption" color="foregroundMuted" style={{ fontSize: 10 }}>
                ~ 3d
              </Typography>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.ratingBtn, { backgroundColor: colors.surfaceElevated, borderColor: colors.success, borderRadius: theme.radii.md, paddingVertical: theme.spacing.md }]}
              onPress={() => handleRatingPress(ReviewRating.Easy)}
            >
              <Typography variant="label" color="success">
                Easy
              </Typography>
              <Typography variant="caption" color="foregroundMuted" style={{ fontSize: 10 }}>
                ~ 5d
              </Typography>
            </TouchableOpacity>
          </View>
        </View>
      ) : null}
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
    width: '100%',
    minHeight: 340,
    justifyContent: 'space-between',
  },
  flashcardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  promptArea: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  koreanText: {
    fontSize: 44,
    lineHeight: 54,
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
  },
  ratingBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  trophyCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
});
