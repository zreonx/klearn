import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
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
import { QuizQuestionType } from '@/domain/quiz/types';
import { hapticService } from '@/infrastructure/haptics/hapticService';

export default function QuizSessionModal() {
  const router = useRouter();
  const params = useLocalSearchParams<{ type?: string; starred?: string }>();
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

  // Sentence Assembly interactive tile state
  const [assembledTiles, setAssembledTiles] = useState<string[]>([]);
  const [availableTiles, setAvailableTiles] = useState<string[]>([]);
  const [isAssemblyCorrect, setIsAssemblyCorrect] = useState<boolean | null>(null);

  useEffect(() => {
    const config = {
      types: params.type ? [params.type as QuizQuestionType] : undefined,
      starredOnly: params.starred === 'true',
    };
    startQuiz(config);
    return () => {
      resetQuiz();
    };
  }, [params.type, params.starred]);

  // Synchronize tiles when current question changes
  useEffect(() => {
    if (currentQuestion?.type === 'sentence_assembly' && currentQuestion.tiles) {
      setAssembledTiles([]);
      setAvailableTiles([...currentQuestion.tiles]);
      setIsAssemblyCorrect(null);
    }
  }, [currentIndex, currentQuestion]);

  const handleTilePress = (tile: string, indexInAvailable: number) => {
    if (hasAnswered) return;
    hapticService.lightTick();
    setAvailableTiles((prev) => prev.filter((_, idx) => idx !== indexInAvailable));
    setAssembledTiles((prev) => [...prev, tile]);
  };

  const handleRemoveTilePress = (tile: string, indexInAssembled: number) => {
    if (hasAnswered) return;
    hapticService.lightTick();
    setAssembledTiles((prev) => prev.filter((_, idx) => idx !== indexInAssembled));
    setAvailableTiles((prev) => [...prev, tile]);
  };

  const handleResetTiles = () => {
    if (hasAnswered || !currentQuestion?.tiles) return;
    hapticService.lightTick();
    setAssembledTiles([]);
    setAvailableTiles([...currentQuestion.tiles]);
  };

  const handleCheckSentenceAssembly = () => {
    if (!currentQuestion) return;
    const cleanAssembled = assembledTiles.join('').replace(/\s+/g, '');
    const cleanTarget = (currentQuestion.correctAnswerText || '').replace(/\s+/g, '').replace(/[.,?!~]/g, '');

    const correct = cleanAssembled === cleanTarget;
    setIsAssemblyCorrect(correct);

    if (correct) {
      hapticService.success();
      if (currentQuestion.correctAnswerText) {
        speak(currentQuestion.correctAnswerText);
      }
      submitAnswer(true);
    } else {
      hapticService.error();
      submitAnswer(false);
    }
  };

  const handleSelectOptionWithHaptic = (optionId: string) => {
    hapticService.lightTick();
    selectOption(optionId);
  };

  const handleSubmitOptionAnswer = () => {
    if (!currentQuestion || !selectedOptionId) return;
    const isCorrect = selectedOptionId === currentQuestion.correctAnswerId;
    if (isCorrect) {
      hapticService.success();
      if (currentQuestion.speakText) {
        speak(currentQuestion.speakText);
      }
    } else {
      hapticService.error();
    }
    submitAnswer(isCorrect);
  };

  if (loading) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.background, padding: theme.spacing.xl }]}>
        <Typography variant="body" color="foregroundMuted">
          Generating quiz questions...
        </Typography>
      </View>
    );
  }

  // Quiz Results View
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
              {result.mistakeItems.map((item) => (
                <View
                  key={item.id}
                  style={[
                    styles.mistakeRow,
                    { borderBottomColor: colors.borderSubtle, paddingVertical: theme.spacing.sm },
                  ]}
                >
                  <View style={{ flex: 1 }}>
                    <Typography variant="bodyLarge" weight="600">
                      {item.korean}
                    </Typography>
                    <Typography variant="caption" color="foregroundMuted">
                      {item.translation}
                    </Typography>
                  </View>
                  <TouchableOpacity onPress={() => speak(item.korean)} style={{ padding: 4 }}>
                    <Ionicons name="volume-medium" size={20} color={colors.primary} />
                  </TouchableOpacity>
                </View>
              ))}
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

  const isSentenceAssembly = currentQuestion.type === 'sentence_assembly' && !!currentQuestion.tiles;
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
            <Badge
              label={
                isSentenceAssembly
                  ? 'Sentence Assembly'
                  : currentQuestion.type === 'acoustic_discrimination'
                  ? 'Acoustic Discrimination'
                  : currentQuestion.type === 'listening_recognition'
                  ? 'Listening Comprehension'
                  : 'Quiz Question'
              }
              variant={
                isSentenceAssembly
                  ? 'hangul'
                  : currentQuestion.type === 'acoustic_discrimination'
                  ? 'vocab'
                  : 'default'
              }
            />
            {currentQuestion.speakText && (
              <TouchableOpacity
                onPress={() => speak(currentQuestion.speakText!)}
                accessibilityLabel="Listen"
                style={{ padding: theme.spacing.xs }}
              >
                <Ionicons name="volume-medium" size={26} color={colors.primary} />
              </TouchableOpacity>
            )}
          </View>

          <Typography
            variant={isSentenceAssembly ? 'heading' : 'display'}
            weight="700"
            align="center"
            style={styles.promptTitle}
          >
            {currentQuestion.prompt}
          </Typography>

          {currentQuestion.subPrompt && (
            <Typography variant="body" color="foregroundMuted" align="center" style={{ marginTop: theme.spacing.xs }}>
              {currentQuestion.subPrompt}
            </Typography>
          )}

          {currentQuestion.type === 'acoustic_discrimination' && (
            <TouchableOpacity
              onPress={() => speak(currentQuestion.speakText!)}
              style={[
                styles.listenAgainPill,
                {
                  backgroundColor: colors.surfaceSubtle,
                  borderColor: colors.borderSubtle,
                  borderRadius: theme.radii.full,
                  marginTop: theme.spacing.md,
                },
              ]}
            >
              <Ionicons name="volume-high" size={16} color={colors.primary} />
              <Typography variant="label" color="primary" weight="700" style={{ marginLeft: 6 }}>
                Play Sound Again
              </Typography>
            </TouchableOpacity>
          )}
        </Card>

        {/* Dynamic Question Body: 1) Interactive Sentence Builder OR 2) Multiple Choice Options */}
        {isSentenceAssembly ? (
          <View style={{ marginBottom: theme.spacing.lg }}>
            {/* Top Assembled Slots Area */}
            <Typography variant="label" color="foregroundMuted" weight="700" style={{ marginBottom: 6 }}>
              Your Assembled Sentence:
            </Typography>

            <View
              style={[
                styles.assembledBox,
                {
                  backgroundColor: colors.surface,
                  borderColor: hasAnswered
                    ? isAssemblyCorrect
                      ? colors.success
                      : colors.destructive
                    : colors.borderSubtle,
                  borderRadius: theme.radii.lg,
                  padding: theme.spacing.md,
                  minHeight: 70,
                },
              ]}
            >
              {assembledTiles.length === 0 ? (
                <Typography variant="body" color="foregroundSubtle" style={{ fontStyle: 'italic' }}>
                  Tap the word tiles below in the correct order...
                </Typography>
              ) : (
                <View style={styles.tilesRow}>
                  {assembledTiles.map((tile, idx) => (
                    <TouchableOpacity
                      key={`assembled-${idx}`}
                      onPress={() => handleRemoveTilePress(tile, idx)}
                      disabled={hasAnswered}
                      style={[
                        styles.wordTile,
                        {
                          backgroundColor: colors.primary,
                          borderColor: colors.primary,
                          borderRadius: theme.radii.md,
                        },
                      ]}
                    >
                      <Typography variant="title" weight="700" color="primaryForeground">
                        {tile}
                      </Typography>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Available Tiles Bank */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: theme.spacing.lg, marginBottom: 8 }}>
              <Typography variant="label" color="primary" weight="700">
                Word & Particle Tiles:
              </Typography>
              {!hasAnswered && assembledTiles.length > 0 && (
                <TouchableOpacity onPress={handleResetTiles}>
                  <Typography variant="caption" color="accent" weight="700">
                    Reset Tiles
                  </Typography>
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.tilesRow}>
              {availableTiles.map((tile, idx) => (
                <TouchableOpacity
                  key={`available-${idx}`}
                  onPress={() => handleTilePress(tile, idx)}
                  disabled={hasAnswered}
                  style={[
                    styles.wordTile,
                    {
                      backgroundColor: colors.surfaceSubtle,
                      borderColor: colors.borderSubtle,
                      borderRadius: theme.radii.md,
                    },
                  ]}
                >
                  <Typography variant="title" weight="700" color="foreground">
                    {tile}
                  </Typography>
                </TouchableOpacity>
              ))}
            </View>

            {/* Answer Feedback Callout */}
            {hasAnswered && (
              <Card
                elevated
                style={{
                  marginTop: theme.spacing.lg,
                  padding: theme.spacing.md,
                  borderColor: isAssemblyCorrect ? colors.success : colors.destructive,
                  borderWidth: 1.5,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                  <Ionicons
                    name={isAssemblyCorrect ? 'checkmark-circle' : 'close-circle'}
                    size={20}
                    color={isAssemblyCorrect ? colors.success : colors.destructive}
                  />
                  <Typography
                    variant="title"
                    weight="700"
                    color={isAssemblyCorrect ? 'success' : 'destructive'}
                    style={{ marginLeft: 6 }}
                  >
                    {isAssemblyCorrect ? 'Correct Assembly!' : 'Incorrect Word Order'}
                  </Typography>
                </View>
                <Typography variant="body" weight="700" color="foreground" style={{ fontSize: 16 }}>
                  Target: {currentQuestion.correctAnswerText}
                </Typography>
                {currentQuestion.explanation && (
                  <Typography variant="caption" color="foregroundMuted" style={{ marginTop: 4 }}>
                    {currentQuestion.explanation}
                  </Typography>
                )}
              </Card>
            )}
          </View>
        ) : (
          /* Standard Multiple Choice / Acoustic Options */
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
                  onPress={() => handleSelectOptionWithHaptic(option.id)}
                >
                  <Typography variant="bodyLarge" weight="600" color="foreground" style={{ flex: 1 }}>
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

            {hasAnswered && currentQuestion.explanation && (
              <Card subtle style={{ marginTop: theme.spacing.sm, padding: theme.spacing.md }}>
                <Typography variant="caption" color="foregroundMuted">
                  {currentQuestion.explanation}
                </Typography>
              </Card>
            )}
          </View>
        )}
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
          isSentenceAssembly ? (
            <Button
              title="Check Sentence"
              disabled={assembledTiles.length === 0}
              fullWidth
              onPress={handleCheckSentenceAssembly}
            />
          ) : (
            <Button
              title="Check Answer"
              disabled={!selectedOptionId}
              fullWidth
              onPress={handleSubmitOptionAnswer}
            />
          )
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
    fontSize: 26,
    lineHeight: 34,
    marginVertical: 8,
  },
  listenAgainPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
  },
  assembledBox: {
    borderWidth: 1.5,
    justifyContent: 'center',
  },
  tilesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  wordTile: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
    borderBottomWidth: 1,
  },
});
