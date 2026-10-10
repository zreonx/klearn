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
import { useQuiz } from '@/features/quiz/useQuiz';

export default function QuizSessionModal() {
  const router = useRouter();
  const { colors, theme } = useTheme();
  const insets = useSafeAreaInsets();
  const {
    currentQuestion,
    currentIndex,
    questions,
    selectedOptionId,
    hasAnswered,
    result,
    loading,
    startQuiz,
    selectOption,
    submitAnswer,
    nextStep,
    speak,
    resetQuiz,
  } = useQuiz();

  useEffect(() => {
    startQuiz();
    return () => {
      resetQuiz();
    };
  }, []);

  if (loading) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.background, padding: theme.spacing.xl }]}>
        <Typography variant="body" color="foregroundMuted">
          Generating quiz questions...
        </Typography>
      </View>
    );
  }

  // Quiz Results View (Section 18)
  if (result) {
    return (
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={[
          styles.resultContent,
          {
            padding: theme.spacing.lg,
            paddingTop: Math.max(insets.top + 16, theme.spacing['2xl']),
            paddingBottom: Math.max(insets.bottom + 16, theme.spacing['3xl']),
          },
        ]}
      >
        <Card elevated style={{ padding: theme.spacing.xl, alignItems: 'center' }}>
          <View style={[styles.trophyCircle, { backgroundColor: colors.surfaceSubtle }]}>
            <Ionicons name="trophy-outline" size={44} color={colors.primary} />
          </View>
          <Typography variant="heading" align="center">
            Quiz Completed!
          </Typography>
          <Typography variant="display" weight="700" color="primary" align="center" style={styles.scoreText}>
            {result.accuracy}%
          </Typography>
          <Typography variant="body" color="foregroundMuted" align="center">
            {result.correctCount} of {result.totalQuestions} questions answered correctly
          </Typography>

          <Divider style={{ marginVertical: theme.spacing.xl }} />

          {result.mistakeItems.length > 0 && (
            <View style={[styles.mistakesSection, { marginBottom: theme.spacing.xl }]}>
              <Typography variant="title" style={{ marginBottom: theme.spacing.md }}>
                Items to Review ({result.mistakeItems.length})
              </Typography>
              <View style={{ gap: theme.spacing.sm }}>
                {result.mistakeItems.map((item) => (
                  <View
                    key={item.id}
                    style={[
                      styles.mistakeRow,
                      {
                        backgroundColor: colors.surfaceSubtle,
                        borderRadius: theme.radii.md,
                        paddingHorizontal: theme.spacing.md,
                        paddingVertical: theme.spacing.md,
                      },
                    ]}
                  >
                    <View>
                      <Typography variant="bodyLarge" weight="600">
                        {item.korean}
                      </Typography>
                      <Typography variant="caption" color="foregroundMuted">
                        {item.translation}
                      </Typography>
                    </View>
                    <TouchableOpacity onPress={() => speak(item.korean)}>
                      <Ionicons name="volume-medium" size={20} color={colors.primary} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            </View>
          )}

          <Button
            title="Return to Dashboard"
            fullWidth
            onPress={() => router.back()}
            style={{ marginTop: theme.spacing.md }}
          />
        </Card>
      </ScrollView>
    );
  }

  if (!currentQuestion) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.background, padding: theme.spacing.xl }]}>
        <Typography variant="body" color="foregroundMuted">
          No questions available.
        </Typography>
        <Button title="Back" variant="outline" onPress={() => router.back()} style={{ marginTop: 16 }} />
      </View>
    );
  }

  const progress = questions.length > 0 ? (currentIndex + 1) / questions.length : 1;

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
            Question {currentIndex + 1} of {questions.length}
          </Typography>
          <TouchableOpacity
            onPress={() => router.back()}
            accessibilityLabel="Close quiz"
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            style={styles.closeBtn}
          >
            <Ionicons name="close" size={24} color={colors.foreground} />
          </TouchableOpacity>
        </View>
        <ProgressBar progress={progress} color={colors.primary} />
      </View>

      <ScrollView contentContainerStyle={[styles.questionContent, { padding: theme.spacing.lg, paddingBottom: theme.spacing['4xl'] }]}>
        {/* Question Prompt */}
        <Card elevated style={{ padding: theme.spacing.xl, marginBottom: theme.spacing.xl }}>
          <View style={[styles.promptTop, { marginBottom: theme.spacing.md }]}>
            <Badge label="Quiz Question" variant="vocab" />
            {currentQuestion.speakText && (
              <TouchableOpacity
                onPress={() => speak(currentQuestion.speakText!)}
                accessibilityLabel="Listen"
                style={{ padding: theme.spacing.xs }}
              >
                <Ionicons name="volume-medium" size={24} color={colors.primary} />
              </TouchableOpacity>
            )}
          </View>

          <Typography variant="display" weight="700" align="center" style={styles.promptTitle}>
            {currentQuestion.prompt}
          </Typography>

          {currentQuestion.subPrompt && (
            <Typography variant="body" color="foregroundMuted" align="center" style={{ marginTop: theme.spacing.xs }}>
              {currentQuestion.subPrompt}
            </Typography>
          )}
        </Card>

        {/* Options */}
        <View style={[styles.optionsList, { gap: theme.spacing.md }]}>
          {currentQuestion.options.map((option) => {
            const isSelected = selectedOptionId === option.id;
            let optionBg: string = colors.surface;
            let borderColor: string = colors.borderSubtle;

            if (hasAnswered) {
              if (option.isCorrect) {
                optionBg = colors.successSurface;
                borderColor = colors.success;
              } else if (isSelected && !option.isCorrect) {
                optionBg = colors.destructiveSurface;
                borderColor = colors.destructive;
              }
            } else if (isSelected) {
              optionBg = colors.surfaceElevated;
              borderColor = colors.primary;
            }

            return (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.optionCard,
                  {
                    backgroundColor: optionBg,
                    borderColor,
                    borderRadius: theme.radii.lg,
                    padding: theme.spacing.lg,
                  },
                ]}
                disabled={hasAnswered}
                onPress={() => selectOption(option.id)}
              >
                <Typography variant="bodyLarge" weight="600" color="foreground">
                  {option.label}
                </Typography>
                {hasAnswered && option.isCorrect && (
                  <Ionicons name="checkmark-circle" size={22} color={colors.success} />
                )}
                {hasAnswered && isSelected && !option.isCorrect && (
                  <Ionicons name="close-circle" size={22} color={colors.destructive} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Footer Controls */}
      <View
        style={[
          styles.footer,
          {
            backgroundColor: colors.surfaceSubtle,
            borderTopColor: colors.borderSubtle,
            padding: theme.spacing.lg,
            paddingBottom: Math.max(insets.bottom, theme.spacing.lg),
          },
        ]}
      >
        {!hasAnswered ? (
          <Button
            title="Check Answer"
            disabled={!selectedOptionId}
            fullWidth
            onPress={submitAnswer}
          />
        ) : (
          <Button
            title={currentIndex + 1 >= questions.length ? 'View Results' : 'Next Question'}
            fullWidth
            onPress={nextStep}
          />
        )}
      </View>
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
  closeBtn: {
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  questionContent: {},
  promptTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  promptTitle: {
    fontSize: 34,
    marginVertical: 8,
  },
  optionsList: {},
  optionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1.5,
  },
  footer: {
    borderTopWidth: 1,
  },
  resultContent: {},
  trophyCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  scoreText: {
    fontSize: 48,
    marginVertical: 8,
  },
  mistakesSection: {
    width: '100%',
  },
  mistakeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
