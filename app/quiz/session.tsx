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
import { useQuiz } from '@/features/quiz/useQuiz';

export default function QuizSessionModal() {
  const router = useRouter();
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
      <View style={styles.centerContainer}>
        <Typography variant="body" color="foregroundMuted">
          Generating quiz questions...
        </Typography>
      </View>
    );
  }

  // Quiz Results View (Section 18)
  if (result) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.resultContent}>
        <Card elevated style={styles.resultCard}>
          <View style={styles.trophyCircle}>
            <Ionicons name="trophy-outline" size={44} color={theme.colors.primary} />
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

          <Divider style={styles.resultDivider} />

          {result.mistakeItems.length > 0 && (
            <View style={styles.mistakesSection}>
              <Typography variant="title" style={styles.mistakeHeading}>
                Items to Review ({result.mistakeItems.length})
              </Typography>
              {result.mistakeItems.map((item) => (
                <View key={item.id} style={styles.mistakeRow}>
                  <View>
                    <Typography variant="bodyLarge" weight="600">
                      {item.korean}
                    </Typography>
                    <Typography variant="caption" color="foregroundMuted">
                      {item.translation}
                    </Typography>
                  </View>
                  <TouchableOpacity onPress={() => speak(item.korean)}>
                    <Ionicons name="volume-medium" size={20} color={theme.colors.primary} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          <Button
            title="Return to Dashboard"
            fullWidth
            onPress={() => router.back()}
            style={styles.doneBtn}
          />
        </Card>
      </ScrollView>
    );
  }

  if (!currentQuestion) {
    return (
      <View style={styles.centerContainer}>
        <Typography variant="body" color="foregroundMuted">
          No questions available.
        </Typography>
        <Button title="Back" variant="outline" onPress={() => router.back()} style={{ marginTop: 16 }} />
      </View>
    );
  }

  const progress = questions.length > 0 ? (currentIndex + 1) / questions.length : 1;

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Typography variant="label" color="foregroundMuted">
            Question {currentIndex + 1} of {questions.length}
          </Typography>
          <TouchableOpacity onPress={() => router.back()} accessibilityLabel="Close quiz">
            <Ionicons name="close" size={24} color={theme.colors.foregroundMuted} />
          </TouchableOpacity>
        </View>
        <ProgressBar progress={progress} color={theme.colors.primary} />
      </View>

      <ScrollView contentContainerStyle={styles.questionContent}>
        {/* Question Prompt */}
        <Card elevated style={styles.promptCard}>
          <View style={styles.promptTop}>
            <Badge label="Quiz Question" variant="vocab" />
            {currentQuestion.speakText && (
              <TouchableOpacity
                onPress={() => speak(currentQuestion.speakText!)}
                accessibilityLabel="Listen"
                style={styles.speakerBtn}
              >
                <Ionicons name="volume-medium" size={24} color={theme.colors.primary} />
              </TouchableOpacity>
            )}
          </View>

          <Typography variant="display" weight="700" align="center" style={styles.promptTitle}>
            {currentQuestion.prompt}
          </Typography>

          {currentQuestion.subPrompt && (
            <Typography variant="body" color="foregroundMuted" align="center" style={styles.subPrompt}>
              {currentQuestion.subPrompt}
            </Typography>
          )}
        </Card>

        {/* Options */}
        <View style={styles.optionsList}>
          {currentQuestion.options.map((option) => {
            const isSelected = selectedOptionId === option.id;
            let optionBg: string = theme.colors.surface;
            let borderColor: string = theme.colors.borderSubtle;

            if (hasAnswered) {
              if (option.isCorrect) {
                optionBg = 'rgba(16, 185, 129, 0.2)';
                borderColor = theme.colors.success;
              } else if (isSelected && !option.isCorrect) {
                optionBg = 'rgba(239, 68, 68, 0.2)';
                borderColor = theme.colors.destructive;
              }
            } else if (isSelected) {
              optionBg = theme.colors.surfaceElevated;
              borderColor = theme.colors.primary;
            }

            return (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.optionCard,
                  { backgroundColor: optionBg, borderColor },
                ]}
                disabled={hasAnswered}
                onPress={() => selectOption(option.id)}
              >
                <Typography variant="bodyLarge" weight="600" color="foreground">
                  {option.label}
                </Typography>
                {hasAnswered && option.isCorrect && (
                  <Ionicons name="checkmark-circle" size={22} color={theme.colors.success} />
                )}
                {hasAnswered && isSelected && !option.isCorrect && (
                  <Ionicons name="close-circle" size={22} color={theme.colors.destructive} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Footer Controls */}
      <View style={styles.footer}>
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
  questionContent: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing['4xl'],
  },
  promptCard: {
    padding: theme.spacing.xl,
    marginBottom: theme.spacing.xl,
  },
  promptTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  speakerBtn: {
    padding: theme.spacing.xs,
  },
  promptTitle: {
    fontSize: 34,
    marginVertical: theme.spacing.sm,
  },
  subPrompt: {
    marginTop: theme.spacing.xs,
  },
  optionsList: {
    gap: theme.spacing.md,
  },
  optionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.lg,
    borderRadius: theme.radii.lg,
    borderWidth: 1.5,
  },
  footer: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing['3xl'],
    backgroundColor: theme.colors.surfaceSubtle,
    borderTopWidth: 1,
    borderTopColor: theme.colors.borderSubtle,
  },
  resultContent: {
    padding: theme.spacing.lg,
    paddingTop: theme.spacing['3xl'],
    paddingBottom: theme.spacing['4xl'],
  },
  resultCard: {
    padding: theme.spacing.xl,
    alignItems: 'center',
  },
  trophyCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  scoreText: {
    fontSize: 48,
    marginVertical: theme.spacing.sm,
  },
  resultDivider: {
    marginVertical: theme.spacing.xl,
  },
  mistakesSection: {
    width: '100%',
    marginBottom: theme.spacing.xl,
  },
  mistakeHeading: {
    marginBottom: theme.spacing.md,
  },
  mistakeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderSubtle,
  },
  doneBtn: {
    marginTop: theme.spacing.md,
  },
});
