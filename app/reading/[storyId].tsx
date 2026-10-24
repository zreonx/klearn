import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Typography, Card, Button, Badge, useTheme } from '@/components/ui';
import { CULTURAL_STORIES, CulturalStory, StoryVocabulary } from '@/content/reading/stories';
import { hapticService } from '@/infrastructure/haptics/hapticService';

export default function StoryDetailScreen() {
  const { storyId } = useLocalSearchParams<{ storyId: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, theme } = useTheme();

  const story: CulturalStory | undefined = CULTURAL_STORIES.find((s) => s.id === storyId);

  const [selectedVocab, setSelectedVocab] = useState<StoryVocabulary | null>(null);
  const [showTranslations, setShowTranslations] = useState<boolean>(true);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);
  const [hasSubmittedCheck, setHasSubmittedCheck] = useState<boolean>(false);

  const speak = (text: string) => {
    hapticService.lightTick();
    Speech.speak(text, { language: 'ko-KR', rate: 0.85 });
  };

  if (!story) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, padding: theme.spacing.xl }]}>
        <Typography variant="body" color="foregroundMuted">
          Story not found.
        </Typography>
        <Button title="Back" variant="outline" onPress={() => router.back()} style={{ marginTop: 16 }} />
      </View>
    );
  }

  const isCorrect = selectedAnswerIndex === story.comprehension.correctAnswerIndex;

  const handleSelectOption = (idx: number) => {
    if (hasSubmittedCheck) return;
    hapticService.lightTick();
    setSelectedAnswerIndex(idx);
  };

  const handleCheckAnswer = () => {
    if (selectedAnswerIndex === null) return;
    setHasSubmittedCheck(true);
    if (isCorrect) {
      hapticService.success();
    } else {
      hapticService.error();
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            paddingTop: Math.max(insets.top + 8, theme.spacing.lg),
            paddingHorizontal: theme.spacing.lg,
            paddingBottom: theme.spacing.sm,
            borderBottomColor: colors.borderSubtle,
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          style={styles.backBtn}
        >
          <Ionicons name="chevron-back" size={24} color={colors.foreground} />
        </TouchableOpacity>

        <View style={{ flex: 1, marginLeft: theme.spacing.xs }}>
          <Typography variant="title" weight="700" numberOfLines={1}>
            {story.titleKorean}
          </Typography>
          <Typography variant="caption" color="foregroundMuted" numberOfLines={1}>
            {story.titleEnglish}
          </Typography>
        </View>

        <TouchableOpacity
          onPress={() => setShowTranslations((prev) => !prev)}
          style={[styles.transToggle, { backgroundColor: colors.surfaceSubtle, borderRadius: theme.radii.sm }]}
        >
          <Ionicons
            name={showTranslations ? 'eye-outline' : 'eye-off-outline'}
            size={18}
            color={colors.primary}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingHorizontal: theme.spacing.lg,
            paddingBottom: Math.max(insets.bottom + 32, theme.spacing['4xl']),
          },
        ]}
      >
        {/* Cultural Context Banner */}
        <Card elevated style={{ padding: theme.spacing.md, marginTop: theme.spacing.md, marginBottom: theme.spacing.lg }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 }}>
            <Ionicons name="information-circle-outline" size={16} color={colors.primary} />
            <Typography variant="label" weight="700" color="primary">
              Cultural Snapshot:
            </Typography>
          </View>
          <Typography variant="caption" color="foregroundMuted" style={{ lineHeight: 18 }}>
            {story.culturalNote}
          </Typography>
        </Card>

        {/* Story Sentences List */}
        <Typography variant="label" weight="700" style={{ marginBottom: theme.spacing.sm }}>
          Read & Listen:
        </Typography>

        <View style={{ gap: theme.spacing.md }}>
          {story.sentences.map((sent, idx) => (
            <Card key={idx} elevated style={{ padding: theme.spacing.lg }}>
              <View style={styles.sentenceHeaderRow}>
                <Badge label={`Sentence ${idx + 1}`} variant="default" />
                <TouchableOpacity
                  onPress={() => speak(sent.korean)}
                  style={[styles.audioPill, { backgroundColor: colors.surfaceSubtle, borderRadius: theme.radii.full }]}
                >
                  <Ionicons name="volume-high" size={18} color={colors.primary} />
                  <Typography variant="caption" weight="600" color="primary" style={{ marginLeft: 4 }}>
                    Listen
                  </Typography>
                </TouchableOpacity>
              </View>

              <Typography variant="heading" weight="700" color="foreground" style={{ marginTop: theme.spacing.sm, lineHeight: 28 }}>
                {sent.korean}
              </Typography>

              {showTranslations && (
                <View style={{ marginTop: theme.spacing.xs }}>
                  <Typography variant="caption" color="foregroundSubtle" style={{ fontStyle: 'italic' }}>
                    {sent.romanization}
                  </Typography>
                  <Typography variant="body" color="foregroundMuted" style={{ marginTop: 2 }}>
                    {sent.translation}
                  </Typography>
                </View>
              )}

              {/* Inline Vocab Chips */}
              <View style={styles.vocabWrap}>
                {sent.vocab.map((v, vIdx) => {
                  const isSelected = selectedVocab?.word === v.word;
                  return (
                    <TouchableOpacity
                      key={vIdx}
                      style={[
                        styles.vocabChip,
                        {
                          backgroundColor: isSelected ? colors.primary : colors.surfaceSubtle,
                          borderColor: isSelected ? colors.primary : colors.borderSubtle,
                          borderRadius: theme.radii.sm,
                        },
                      ]}
                      onPress={() => {
                        hapticService.lightTick();
                        setSelectedVocab(isSelected ? null : v);
                      }}
                    >
                      <Typography
                        variant="caption"
                        weight="600"
                        color={isSelected ? 'primaryForeground' : 'foreground'}
                      >
                        {v.word}
                      </Typography>
                      <Typography
                        variant="caption"
                        color={isSelected ? 'primaryForeground' : 'foregroundMuted'}
                        style={{ fontSize: 10, marginLeft: 4 }}
                      >
                        ({v.meaning})
                      </Typography>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </Card>
          ))}
        </View>

        {/* Selected Vocabulary Detail Sheet if active */}
        {selectedVocab && (
          <Card
            elevated
            style={{
              padding: theme.spacing.md,
              marginTop: theme.spacing.lg,
              borderColor: colors.primary,
              borderWidth: 1.5,
            }}
          >
            <View style={styles.sentenceHeaderRow}>
              <View>
                <Typography variant="title" weight="700" color="primary">
                  {selectedVocab.word}
                </Typography>
                <Typography variant="caption" color="foregroundMuted">
                  [{selectedVocab.romanization}] • Meaning: {selectedVocab.meaning}
                </Typography>
              </View>
              <TouchableOpacity onPress={() => speak(selectedVocab.word)}>
                <Ionicons name="volume-high" size={22} color={colors.primary} />
              </TouchableOpacity>
            </View>
          </Card>
        )}

        {/* Gentle Comprehension Check Card */}
        <Card elevated style={{ padding: theme.spacing.xl, marginTop: theme.spacing.xl }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: theme.spacing.xs }}>
            <Ionicons name="checkmark-circle-outline" size={18} color={colors.primary} />
            <Typography variant="label" weight="700" color="primary">
              Comprehension Check
            </Typography>
          </View>

          <Typography variant="body" weight="700" color="foreground" style={{ marginVertical: theme.spacing.sm }}>
            {story.comprehension.question}
          </Typography>

          <View style={{ gap: theme.spacing.sm, marginTop: theme.spacing.xs }}>
            {story.comprehension.options.map((option, idx) => {
              const isSelected = selectedAnswerIndex === idx;
              const isOptionCorrect = idx === story.comprehension.correctAnswerIndex;

              let optionBg = colors.surfaceSubtle;
              let optionBorder = colors.borderSubtle;
              let textColor: any = 'foreground';

              if (hasSubmittedCheck) {
                if (isOptionCorrect) {
                  optionBg = colors.surface;
                  optionBorder = colors.primary;
                  textColor = 'primary';
                } else if (isSelected && !isOptionCorrect) {
                  optionBg = colors.surface;
                  optionBorder = colors.destructive;
                  textColor = 'foreground';
                }
              } else if (isSelected) {
                optionBg = colors.primary;
                optionBorder = colors.primary;
                textColor = 'primaryForeground';
              }

              return (
                <TouchableOpacity
                  key={idx}
                  style={[
                    styles.optionPill,
                    {
                      backgroundColor: optionBg,
                      borderColor: optionBorder,
                      borderRadius: theme.radii.md,
                      padding: theme.spacing.md,
                    },
                  ]}
                  onPress={() => handleSelectOption(idx)}
                >
                  <Typography variant="body" weight="600" color={textColor}>
                    {idx + 1}. {option}
                  </Typography>
                </TouchableOpacity>
              );
            })}
          </View>

          {!hasSubmittedCheck ? (
            <Button
              title="Check Answer"
              disabled={selectedAnswerIndex === null}
              onPress={handleCheckAnswer}
              style={{ marginTop: theme.spacing.lg }}
            />
          ) : (
            <View
              style={[
                styles.feedbackBox,
                {
                  backgroundColor: colors.surfaceSubtle,
                  borderColor: isCorrect ? colors.primary : colors.borderSubtle,
                  borderRadius: theme.radii.md,
                  padding: theme.spacing.md,
                  marginTop: theme.spacing.lg,
                },
              ]}
            >
              <Typography variant="label" weight="700" color={isCorrect ? 'primary' : 'foreground'}>
                {isCorrect ? '🎉 Correct!' : '💡 Take another look:'}
              </Typography>
              <Typography variant="caption" color="foregroundMuted" style={{ marginTop: 2 }}>
                {story.comprehension.explanation}
              </Typography>
            </View>
          )}
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  backBtn: {
    padding: 4,
  },
  transToggle: {
    padding: 8,
  },
  scrollContent: {
    paddingTop: 8,
  },
  sentenceHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  audioPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  vocabWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 10,
  },
  vocabChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
  },
  optionPill: {
    borderWidth: 1.5,
  },
  feedbackBox: {
    borderWidth: 1,
  },
});
