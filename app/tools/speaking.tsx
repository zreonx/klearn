import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Typography, Card, Badge, useTheme } from '@/components/ui';
import { services } from '@/application/services';
import { hapticService } from '@/infrastructure/haptics/hapticService';
import {
  evaluatePronunciation,
  PronunciationEvaluationResult,
} from '@/domain/speech/pronunciationEvaluator';

interface SpeakingPhrase {
  id: string;
  category: 'greetings' | 'cafe' | 'directions' | 'dining' | 'idioms';
  korean: string;
  romanization: string;
  translation: string;
  tip: string;
}

const SPEAKING_PHRASES: SpeakingPhrase[] = [
  {
    id: 'sp-1',
    category: 'greetings',
    korean: '안녕하세요',
    romanization: 'An-nyeong-ha-se-yo',
    translation: 'Hello / Good day (Polite)',
    tip: 'Keep the vowels balanced. The final "yo" should be clear and gentle.',
  },
  {
    id: 'sp-2',
    category: 'greetings',
    korean: '만나서 반갑습니다',
    romanization: 'Man-na-seo ban-gap-seum-ni-da',
    translation: 'Nice to meet you (Formal polite)',
    tip: 'Pronounce the batchim ㅂ in "반갑" smoothly into "습니다" as [반갑씀니다].',
  },
  {
    id: 'sp-3',
    category: 'greetings',
    korean: '감사합니다',
    romanization: 'Gam-sa-ham-ni-da',
    translation: 'Thank you (Formal polite)',
    tip: 'Note the nasalization: "합" sounds like [함] before "니".',
  },
  {
    id: 'sp-4',
    category: 'cafe',
    korean: '아이스 아메리카노 한 잔 주세요',
    romanization: 'A-i-seu a-me-ri-ka-no han jan ju-se-yo',
    translation: 'One iced Americano, please',
    tip: 'Use the Native counter "한 잔" for cups/glasses.',
  },
  {
    id: 'sp-5',
    category: 'cafe',
    korean: '여기서 마시고 갈게요',
    romanization: 'Yeo-gi-seo ma-si-go gal-ge-yo',
    translation: 'I will drink it here for here',
    tip: 'The tensification rule makes "갈게요" sound crisp like [갈께요].',
  },
  {
    id: 'sp-6',
    category: 'directions',
    korean: '지하철역이 어디예요?',
    romanization: 'Ji-ha-cheol-yeo-gi eo-di-ye-yo?',
    translation: 'Where is the subway station?',
    tip: 'Liaison shifts the batchim ㄹ to the next vowel: [지하철려기].',
  },
  {
    id: 'sp-7',
    category: 'directions',
    korean: '이쪽으로 쭉 가세요',
    romanization: 'I-tto-geu-ro jjuk ga-se-yo',
    translation: 'Go straight in this direction',
    tip: 'Pronounce the tense consonant ㅉ in "쭉" with sharp breath tension.',
  },
  {
    id: 'sp-8',
    category: 'dining',
    korean: '메뉴판 좀 보여주세요',
    romanization: 'Me-nyu-pan jom bo-yeo-ju-se-yo',
    translation: 'Please show me the menu',
    tip: 'Adding "좀" (a little) makes requests sound natural and polite.',
  },
  {
    id: 'sp-9',
    category: 'dining',
    korean: '덜 맵게 해 주세요',
    romanization: 'Deol maep-ge hae ju-se-yo',
    translation: 'Please make it less spicy',
    tip: 'Useful survival phrase at Korean restaurants.',
  },
  {
    id: 'sp-10',
    category: 'idioms',
    korean: '시작이 반이에요',
    romanization: 'Si-ja-gi ba-ni-e-yo',
    translation: 'Starting is half the battle (Proverb)',
    tip: 'Liaison connects "시작이" as [시자기] and "반이" as [바니].',
  },
];

type CategoryFilter = 'all' | 'greetings' | 'cafe' | 'directions' | 'dining' | 'idioms';

export default function SpeakingCoachScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, theme } = useTheme();

  const [selectedPhrase, setSelectedPhrase] = useState<SpeakingPhrase>(SPEAKING_PHRASES[0]);
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [interimText, setInterimText] = useState<string>('');
  const [lastSpoken, setLastSpoken] = useState<string>('');
  const [evaluation, setEvaluation] = useState<PronunciationEvaluationResult | null>(null);

  const speak = (text: string, slow = false) => {
    hapticService.lightTick();
    services.speech.speak(text, { rate: slow ? 0.65 : 0.85 });
  };

  const handleStartRecording = async () => {
    hapticService.lightTick();
    setEvaluation(null);
    setLastSpoken('');
    setInterimText('');

    const started = await services.voiceRecognition.startListening({
      onInterim: (text) => setInterimText(text),
    });

    if (started) {
      setIsListening(true);
    }
  };

  const handleStopRecording = async () => {
    hapticService.lightTick();
    setIsListening(false);
    const spoken = await services.voiceRecognition.stopListening();
    const finalSpoken = spoken || interimText;
    setInterimText('');
    setLastSpoken(finalSpoken);

    if (finalSpoken.trim()) {
      const evalResult = evaluatePronunciation(selectedPhrase.korean, finalSpoken.trim());
      setEvaluation(evalResult);

      if (evalResult.score >= 80) {
        hapticService.success();
      } else {
        hapticService.error();
      }
    }
  };

  const filteredPhrases = SPEAKING_PHRASES.filter((p) => {
    if (activeCategory === 'all') return true;
    return p.category === activeCategory;
  });

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
          <Typography variant="title" weight="700">
            Speaking & Shadowing Coach
          </Typography>
          <Typography variant="caption" color="foregroundMuted">
            말하기 & 발음 연습 • Voice Accuracy Evaluator
          </Typography>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingHorizontal: theme.spacing.lg,
            paddingBottom: Math.max(insets.bottom + 24, theme.spacing['4xl']),
          },
        ]}
      >
        {/* Active Target Phrase Card */}
        <Card elevated style={{ padding: theme.spacing.xl, marginTop: theme.spacing.md, marginBottom: theme.spacing.lg }}>
          <View style={styles.cardHeaderRow}>
            <Badge label={selectedPhrase.category.toUpperCase()} variant="vocab" />
            <View style={{ flexDirection: 'row', gap: 6 }}>
              <TouchableOpacity
                onPress={() => speak(selectedPhrase.korean, false)}
                style={[styles.audioPill, { backgroundColor: colors.surfaceSubtle, borderRadius: theme.radii.full }]}
              >
                <Ionicons name="volume-high" size={16} color={colors.primary} />
                <Typography variant="caption" weight="700" color="primary" style={{ marginLeft: 4 }}>
                  Normal
                </Typography>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => speak(selectedPhrase.korean, true)}
                style={[styles.audioPill, { backgroundColor: colors.surfaceSubtle, borderRadius: theme.radii.full }]}
              >
                <Ionicons name="play-forward" size={16} color={colors.accent} />
                <Typography variant="caption" weight="700" color="accent" style={{ marginLeft: 4 }}>
                  Slow (0.65x)
                </Typography>
              </TouchableOpacity>
            </View>
          </View>

          {/* Korean Target Text */}
          <View style={{ alignItems: 'center', marginVertical: theme.spacing.lg }}>
            <Typography variant="display" weight="700" align="center" style={{ fontSize: 28, lineHeight: 38 }}>
              {selectedPhrase.korean}
            </Typography>
            <Typography variant="body" color="foregroundMuted" align="center" style={{ marginTop: 4 }}>
              [{selectedPhrase.romanization}]
            </Typography>
            <Typography variant="title" color="foreground" weight="700" align="center" style={{ marginTop: 4 }}>
              {selectedPhrase.translation}
            </Typography>
          </View>

          {/* Pronunciation Tip */}
          <View
            style={[
              styles.tipBox,
              {
                backgroundColor: colors.surfaceSubtle,
                borderColor: colors.borderSubtle,
                borderRadius: theme.radii.md,
                padding: theme.spacing.md,
              },
            ]}
          >
            <Typography variant="caption" weight="700" color="primary">
              Pronunciation Guide:
            </Typography>
            <Typography variant="caption" color="foreground" style={{ marginTop: 2 }}>
              {selectedPhrase.tip}
            </Typography>
          </View>

          {/* Interactive Voice Action Section */}
          <View style={{ alignItems: 'center', marginTop: theme.spacing.xl }}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={isListening ? handleStopRecording : handleStartRecording}
              style={[
                styles.bigMicBtn,
                {
                  backgroundColor: isListening ? colors.accent : colors.primary,
                  borderRadius: 36,
                },
              ]}
            >
              <Ionicons
                name={isListening ? 'stop' : 'mic'}
                size={34}
                color={colors.primaryForeground}
              />
            </TouchableOpacity>

            <Typography variant="label" weight="700" color={isListening ? 'accent' : 'foreground'} style={{ marginTop: 8 }}>
              {isListening ? 'Listening... Tap to Stop' : 'Tap to Speak & Evaluate'}
            </Typography>
            <Typography variant="caption" color="foregroundMuted" style={{ marginTop: 2 }}>
              {isListening ? (interimText || 'Speak clearly in Korean now...') : 'Shadow the phrase and get phonetic feedback'}
            </Typography>
          </View>

          {/* Pronunciation Evaluation Results Card */}
          {evaluation && (
            <View
              style={[
                styles.evalBox,
                {
                  backgroundColor: colors.surfaceSubtle,
                  borderColor: evaluation.score >= 80 ? colors.success : colors.borderSubtle,
                  borderRadius: theme.radii.lg,
                  padding: theme.spacing.lg,
                  marginTop: theme.spacing.xl,
                },
              ]}
            >
              <View style={[styles.rowBetween, { marginBottom: theme.spacing.sm }]}>
                <View>
                  <Typography variant="title" weight="700">
                    Pronunciation Score
                  </Typography>
                  <Typography variant="caption" color="foregroundMuted">
                    Phonetic Jamo & Syllable Accuracy
                  </Typography>
                </View>

                <View
                  style={[
                    styles.scoreBadge,
                    {
                      backgroundColor: colors.surface,
                      borderColor: evaluation.score >= 80 ? colors.success : colors.accent,
                    },
                  ]}
                >
                  <Typography
                    variant="title"
                    weight="700"
                    color={evaluation.score >= 80 ? 'success' : 'accent'}
                  >
                    {evaluation.score}%
                  </Typography>
                </View>
              </View>

              <Typography variant="body" weight="600" color="foreground" style={{ marginBottom: theme.spacing.md }}>
                {evaluation.feedback}
              </Typography>

              {/* Syllable-by-syllable Breakdown Tiles */}
              <Typography variant="caption" color="foregroundMuted" weight="700" style={{ marginBottom: 6 }}>
                Syllable Match Breakdown:
              </Typography>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                {evaluation.syllableBreakdown.map((s, idx) => (
                  <View
                    key={idx}
                    style={[
                      styles.syllableTile,
                      {
                        backgroundColor: s.isMatch ? colors.surface : colors.surfaceSubtle,
                        borderColor: s.isMatch ? colors.success : colors.destructive,
                        borderRadius: theme.radii.sm,
                      },
                    ]}
                  >
                    <Typography
                      variant="title"
                      weight="700"
                      color={s.isMatch ? 'success' : 'destructive'}
                    >
                      {s.targetChar}
                    </Typography>
                    <Typography variant="caption" style={{ fontSize: 9 }} color="foregroundMuted">
                      {s.isMatch ? '✓' : (s.spokenChar || '✗')}
                    </Typography>
                  </View>
                ))}
              </View>

              {lastSpoken ? (
                <View style={{ marginTop: theme.spacing.md }}>
                  <Typography variant="caption" color="foregroundSubtle">
                    Recognized Speech: <Typography variant="caption" weight="700" color="foreground">"{lastSpoken}"</Typography>
                  </Typography>
                </View>
              ) : null}
            </View>
          )}
        </Card>

        {/* Phrases Catalog Section */}
        <Typography variant="title" weight="700" style={{ marginBottom: theme.spacing.sm }}>
          Select Practice Phrase:
        </Typography>

        {/* Category Filter Pills */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, marginBottom: theme.spacing.md }}>
          {(['all', 'greetings', 'cafe', 'directions', 'dining', 'idioms'] as CategoryFilter[]).map((cat) => {
            const isSelected = activeCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.filterPill,
                  {
                    backgroundColor: isSelected ? colors.primary : colors.surfaceSubtle,
                    borderColor: isSelected ? colors.primary : colors.borderSubtle,
                    borderRadius: theme.radii.full,
                  },
                ]}
                onPress={() => {
                  hapticService.lightTick();
                  setActiveCategory(cat);
                }}
              >
                <Typography variant="caption" weight="600" color={isSelected ? 'primaryForeground' : 'foreground'}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </Typography>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={{ gap: theme.spacing.sm }}>
          {filteredPhrases.map((phrase) => {
            const isSelected = selectedPhrase.id === phrase.id;
            return (
              <TouchableOpacity
                key={phrase.id}
                style={[
                  styles.phraseCard,
                  {
                    backgroundColor: isSelected ? colors.surface : colors.surfaceSubtle,
                    borderColor: isSelected ? colors.primary : colors.borderSubtle,
                    borderWidth: isSelected ? 1.5 : 1,
                    borderRadius: theme.radii.md,
                    padding: theme.spacing.md,
                  },
                ]}
                onPress={() => {
                  hapticService.lightTick();
                  setSelectedPhrase(phrase);
                  setEvaluation(null);
                  setLastSpoken('');
                }}
              >
                <View style={styles.rowBetween}>
                  <View style={{ flex: 1, marginRight: 8 }}>
                    <Typography variant="title" weight="700" color={isSelected ? 'primary' : 'foreground'}>
                      {phrase.korean}
                    </Typography>
                    <Typography variant="caption" color="foregroundMuted" style={{ marginTop: 2 }}>
                      {phrase.translation}
                    </Typography>
                  </View>
                  <TouchableOpacity
                    onPress={() => speak(phrase.korean)}
                    style={[styles.smallAudioBtn, { backgroundColor: colors.surfaceSubtle, borderRadius: theme.radii.full }]}
                  >
                    <Ionicons name="volume-medium" size={18} color={colors.primary} />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
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
  scrollContent: {
    paddingTop: 8,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  audioPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  tipBox: {
    borderWidth: 1,
  },
  bigMicBtn: {
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
  },
  evalBox: {
    borderWidth: 1.5,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  scoreBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1.5,
  },
  syllableTile: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    minWidth: 36,
  },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 1,
  },
  phraseCard: {},
  smallAudioBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
