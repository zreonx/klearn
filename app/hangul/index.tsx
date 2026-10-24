import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Typography,
  Card,
  Badge,
  Button,
  Divider,
  useTheme,
} from '@/components/ui';
import {
  HANGUL_CATEGORIES,
  HangulCategory,
  HangulCharacter,
} from '@/content/hangul/alphabetData';
import {
  CHOSEONG_LIST,
  JUNGSEONG_LIST,
  JONGSEONG_LIST,
  PRESET_SYLLABLES,
  composeHangulSyllable,
} from '@/domain/hangul/syllableBuilder';
import { getStrokeOrder } from '@/domain/hangul/strokeOrder';
import { speechService } from '@/infrastructure/speech/speechService';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function HangulChartScreen() {
  const router = useRouter();
  const { colors, theme } = useTheme();
  const insets = useSafeAreaInsets();

  const [selectedCategory, setSelectedCategory] = useState<string>('basic-consonants');
  const [activeChar, setActiveChar] = useState<HangulCharacter | null>(null);
  const [playingChar, setPlayingChar] = useState<string | null>(null);

  // Syllable Builder state (defaults to ㅎ + ㅏ + ㄴ = 한)
  const [choseongIdx, setChoseongIdx] = useState<number>(18);
  const [jungseongIdx, setJungseongIdx] = useState<number>(0);
  const [jongseongIdx, setJongseongIdx] = useState<number>(4);

  const composedSyllable = composeHangulSyllable(choseongIdx, jungseongIdx, jongseongIdx);
  const isSyllableBuilder = selectedCategory === 'syllable-builder';

  const activeCategoryData: HangulCategory =
    HANGUL_CATEGORIES.find((c) => c.id === selectedCategory) ?? HANGUL_CATEGORIES[0];

  const handlePlaySound = async (char: HangulCharacter) => {
    setPlayingChar(char.char);
    await speechService.speak(char.audioText, { rate: 0.85 });
    setTimeout(() => {
      setPlayingChar(null);
    }, 600);
  };

  const handlePlayWord = async (word: string) => {
    await speechService.speak(word, { rate: 0.85 });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Top Header */}
      <View
        style={[
          styles.header,
          {
            paddingTop: Math.max(insets.top + 8, theme.spacing.lg),
            paddingHorizontal: theme.spacing.lg,
            paddingBottom: theme.spacing.md,
            backgroundColor: colors.surfaceSubtle,
            borderBottomWidth: 1,
            borderBottomColor: colors.borderSubtle,
          },
        ]}
      >
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={[
              styles.backButton,
              {
                backgroundColor: colors.background,
                borderColor: colors.borderSubtle,
                borderRadius: theme.radii.full,
              },
            ]}
            accessibilityLabel="Go back"
          >
            <Ionicons name="chevron-back" size={22} color={colors.foreground} />
          </TouchableOpacity>

          <View style={styles.headerTitleWrap}>
            <Typography variant="heading" weight="700">
              Hangul & Numbers Chart
            </Typography>
            <Typography variant="caption" color="foregroundMuted">
              한글 자모 & 숫자 표 • Letters, Batchim & Counting
            </Typography>
          </View>
        </View>

        {/* Category Pill Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[styles.categoryTabs, { paddingTop: theme.spacing.md }]}
        >
          {HANGUL_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                onPress={() => setSelectedCategory(cat.id)}
                style={[
                  styles.categoryPill,
                  {
                    backgroundColor: isSelected ? colors.primary : colors.background,
                    borderColor: isSelected ? colors.primary : colors.borderSubtle,
                    borderRadius: theme.radii.full,
                    paddingHorizontal: theme.spacing.md,
                    paddingVertical: theme.spacing.xs + 2,
                    marginRight: theme.spacing.sm,
                  },
                ]}
              >
                <Typography
                  variant="label"
                  color={isSelected ? 'primaryForeground' : 'foreground'}
                  weight={isSelected ? '700' : '500'}
                >
                  {cat.title}
                </Typography>
              </TouchableOpacity>
            );
          })}

          {/* Interactive Syllable Builder Tab */}
          <TouchableOpacity
            onPress={() => setSelectedCategory('syllable-builder')}
            style={[
              styles.categoryPill,
              {
                backgroundColor: isSyllableBuilder ? colors.accent : colors.background,
                borderColor: isSyllableBuilder ? colors.accent : colors.accent,
                borderRadius: theme.radii.full,
                paddingHorizontal: theme.spacing.md,
                paddingVertical: theme.spacing.xs + 2,
                marginRight: theme.spacing.sm,
                flexDirection: 'row',
                alignItems: 'center',
              },
            ]}
          >
            <Ionicons
              name="construct-outline"
              size={14}
              color={isSyllableBuilder ? colors.primaryForeground : colors.accent}
              style={{ marginRight: 4 }}
            />
            <Typography
              variant="label"
              weight="700"
              color={isSyllableBuilder ? 'primaryForeground' : 'accent'}
            >
              Syllable Builder (조합기)
            </Typography>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Main Grid & Explanations */}
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingHorizontal: theme.spacing.lg,
            paddingTop: theme.spacing.lg,
            paddingBottom: Math.max(insets.bottom + 24, theme.spacing['4xl']),
          },
        ]}
      >
        {isSyllableBuilder ? (
          <>
            {/* Syllable Builder Intro Banner */}
            <Card subtle style={{ marginBottom: theme.spacing.md, padding: theme.spacing.md }}>
              <View style={styles.bannerRow}>
                <View style={{ flex: 1 }}>
                  <Typography variant="title" color="primary" weight="700">
                    Hangul Syllable Builder (음절 조합기)
                  </Typography>
                  <Typography variant="caption" color="foregroundMuted" style={{ marginTop: 4 }}>
                    Combine any Initial Consonant (초성), Medial Vowel (중성), and optional Final Batchim (종성) to compose and hear live Korean syllable blocks.
                  </Typography>
                </View>
                <Badge label={composedSyllable.structure} variant="hangul" />
              </View>
            </Card>

            {/* Live Composed Syllable Stage */}
            <Card elevated style={{ marginBottom: theme.spacing.md, padding: theme.spacing.lg }}>
              <View style={{ alignItems: 'center' }}>
                <Badge label={composedSyllable.formula} variant="default" />
                <Typography
                  variant="display"
                  weight="700"
                  align="center"
                  style={{
                    fontSize: 76,
                    lineHeight: 88,
                    color: colors.primary,
                    marginVertical: theme.spacing.sm,
                  }}
                >
                  {composedSyllable.char}
                </Typography>

                <Typography variant="title" weight="600" color="foreground">
                  [{composedSyllable.romanization || 'a'}]
                </Typography>

                {composedSyllable.meaningHint ? (
                  <View
                    style={{
                      marginTop: theme.spacing.xs,
                      paddingHorizontal: theme.spacing.md,
                      paddingVertical: 4,
                      backgroundColor: colors.surfaceSubtle,
                      borderRadius: theme.radii.full,
                    }}
                  >
                    <Typography variant="caption" color="accent" weight="700">
                      Word Meaning: {composedSyllable.meaningHint}
                    </Typography>
                  </View>
                ) : (
                  <Typography variant="caption" color="foregroundSubtle" style={{ marginTop: 4 }}>
                    {composedSyllable.choseong.name} + {composedSyllable.jungseong.name}
                    {composedSyllable.jongseong.index > 0 ? ` + ${composedSyllable.jongseong.name}` : ''}
                  </Typography>
                )}

                <Button
                  title={`Pronounce "${composedSyllable.char}"`}
                  icon={<Ionicons name="volume-high-outline" size={18} color={colors.primaryForeground} />}
                  onPress={() => handlePlayWord(composedSyllable.char)}
                  style={{ marginTop: theme.spacing.md, minWidth: 180 }}
                />
              </View>
            </Card>

            {/* Quick Word Presets */}
            <Card style={{ marginBottom: theme.spacing.md, padding: theme.spacing.md }}>
              <Typography variant="label" color="foregroundMuted" weight="700" style={{ marginBottom: theme.spacing.xs }}>
                Quick Word Presets:
              </Typography>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {PRESET_SYLLABLES.map((preset) => {
                  const isActivePreset =
                    choseongIdx === preset.choseongIndex &&
                    jungseongIdx === preset.jungseongIndex &&
                    jongseongIdx === preset.jongseongIndex;
                  return (
                    <TouchableOpacity
                      key={preset.label}
                      onPress={() => {
                        setChoseongIdx(preset.choseongIndex);
                        setJungseongIdx(preset.jungseongIndex);
                        setJongseongIdx(preset.jongseongIndex);
                      }}
                      style={{
                        backgroundColor: isActivePreset ? colors.primary : colors.surfaceSubtle,
                        borderColor: isActivePreset ? colors.primary : colors.borderSubtle,
                        borderWidth: 1,
                        borderRadius: theme.radii.md,
                        paddingHorizontal: theme.spacing.sm + 2,
                        paddingVertical: 6,
                      }}
                    >
                      <Typography
                        variant="caption"
                        weight="700"
                        color={isActivePreset ? 'primaryForeground' : 'foreground'}
                      >
                        {preset.label}
                      </Typography>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </Card>

            {/* 1. Choseong (Initial Consonant) Selector */}
            <Card style={{ marginBottom: theme.spacing.md, padding: theme.spacing.md }}>
              <Typography variant="label" color="primary" weight="700" style={{ marginBottom: 6 }}>
                1. Initial Consonant • 초성 ({composedSyllable.choseong.name})
              </Typography>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                {CHOSEONG_LIST.map((item) => {
                  const selected = choseongIdx === item.index;
                  return (
                    <TouchableOpacity
                      key={`cho-${item.index}`}
                      onPress={() => setChoseongIdx(item.index)}
                      style={{
                        width: 44,
                        height: 44,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: theme.radii.md,
                        borderWidth: 1,
                        backgroundColor: selected ? colors.primary : colors.surfaceSubtle,
                        borderColor: selected ? colors.primary : colors.borderSubtle,
                      }}
                    >
                      <Typography
                        variant="title"
                        weight="700"
                        color={selected ? 'primaryForeground' : 'foreground'}
                      >
                        {item.jamo}
                      </Typography>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </Card>

            {/* 2. Jungseong (Medial Vowel) Selector */}
            <Card style={{ marginBottom: theme.spacing.md, padding: theme.spacing.md }}>
              <Typography variant="label" color="primary" weight="700" style={{ marginBottom: 6 }}>
                2. Medial Vowel • 중성 ({composedSyllable.jungseong.name})
              </Typography>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                {JUNGSEONG_LIST.map((item) => {
                  const selected = jungseongIdx === item.index;
                  return (
                    <TouchableOpacity
                      key={`jung-${item.index}`}
                      onPress={() => setJungseongIdx(item.index)}
                      style={{
                        width: 44,
                        height: 44,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: theme.radii.md,
                        borderWidth: 1,
                        backgroundColor: selected ? colors.primary : colors.surfaceSubtle,
                        borderColor: selected ? colors.primary : colors.borderSubtle,
                      }}
                    >
                      <Typography
                        variant="title"
                        weight="700"
                        color={selected ? 'primaryForeground' : 'foreground'}
                      >
                        {item.jamo}
                      </Typography>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </Card>

            {/* 3. Jongseong (Final Batchim) Selector */}
            <Card style={{ marginBottom: theme.spacing.md, padding: theme.spacing.md }}>
              <Typography variant="label" color="primary" weight="700" style={{ marginBottom: 6 }}>
                3. Final Batchim • 종성 ({composedSyllable.jongseong.name})
              </Typography>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                {JONGSEONG_LIST.map((item) => {
                  const selected = jongseongIdx === item.index;
                  return (
                    <TouchableOpacity
                      key={`jong-${item.index}`}
                      onPress={() => setJongseongIdx(item.index)}
                      style={{
                        width: 44,
                        height: 44,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: theme.radii.md,
                        borderWidth: 1,
                        backgroundColor: selected ? colors.primary : colors.surfaceSubtle,
                        borderColor: selected ? colors.primary : colors.borderSubtle,
                      }}
                    >
                      <Typography
                        variant="title"
                        weight="700"
                        color={selected ? 'primaryForeground' : 'foreground'}
                      >
                        {item.jamo}
                      </Typography>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </Card>
          </>
        ) : (
          <>
        {/* Category Description Banner */}
        <Card subtle style={{ marginBottom: theme.spacing.lg, padding: theme.spacing.md }}>
          <View style={styles.bannerRow}>
            <View style={{ flex: 1 }}>
              <Typography variant="title" color="primary" weight="700">
                {activeCategoryData.title} ({activeCategoryData.koreanTitle})
              </Typography>
              <Typography variant="caption" color="foregroundMuted" style={{ marginTop: 4 }}>
                {activeCategoryData.description}
              </Typography>
            </View>
            <Badge
              label={`${activeCategoryData.characters.length} ${activeCategoryData.id.includes('numbers') ? 'numbers' : 'letters'}`}
              variant="hangul"
            />
          </View>
          <TouchableOpacity
            onPress={() => setSelectedCategory('syllable-builder')}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: theme.spacing.sm,
              paddingTop: theme.spacing.xs,
              borderTopWidth: 1,
              borderTopColor: colors.borderSubtle,
            }}
          >
            <Ionicons name="construct-outline" size={15} color={colors.accent} />
            <Typography variant="caption" color="accent" weight="700" style={{ marginLeft: 6 }}>
              Open Interactive Syllable Builder (음절 조합기) →
            </Typography>
          </TouchableOpacity>
        </Card>

        {/* Simplified Number Construction Cheat-Sheet */}
        {activeCategoryData.id === 'native-numbers' && (
          <>
            <Card elevated style={{ marginBottom: theme.spacing.md, padding: theme.spacing.md }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                <Ionicons name="sparkles" size={16} color={colors.accent} />
                <Typography variant="label" color="accent" weight="700" style={{ marginLeft: 4 }}>
                  Simplified Rule: 1 to 99
                </Typography>
              </View>
              <Typography variant="caption" color="foreground" weight="600">
                Combine Tens + Ones:
              </Typography>
              <Typography variant="caption" color="foregroundMuted" style={{ marginTop: 2 }}>
                • 11 = 열(10) + 하나(1) = 열하나{'\n'}
                • 25 = 스물(20) + 다섯(5) = 스물다섯{'\n'}
                • 33 = 서른(30) + 셋(3) = 서른셋{'\n'}
                • Counter Rule: 1, 2, 3, 4, 20 shorten before counters (한 개, 두 명, 세 권, 네 마리, 스무 살). Above 100, use Sino-Korean 백!
              </Typography>
            </Card>

            <Card subtle style={{ marginBottom: theme.spacing.lg, padding: theme.spacing.md }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                <Ionicons name="mic-outline" size={16} color={colors.primary} />
                <Typography variant="label" color="primary" weight="700" style={{ marginLeft: 4 }}>
                  Coda Neutralization (끝소리 규칙) in Numbers
                </Typography>
              </View>
              <Typography variant="caption" color="foreground" weight="600">
                Final consonants neutralize to unreleased stops [t̚] or [p̚]:
              </Typography>
              <Typography variant="caption" color="foregroundMuted" style={{ marginTop: 2 }}>
                • <Typography variant="caption" weight="700" color="foreground">ㅅ → [ㄷ / t̚]</Typography>: 셋(3) is pronounced [섿 / set̚], 넷(4) is [넫 / net̚], 다섯(5) is [다섣], 여섯(6) is [여섣].{'\n'}
                • <Typography variant="caption" weight="700" color="foreground">ㅂ → [ㅂ / p̚]</Typography>: 일곱(7) and 아홉(9) lips seal shut without releasing an air puff.{'\n'}
                • <Typography variant="caption" weight="700" color="foreground">ㄼ → [ㄹ / l]</Typography>: 여덟(8) cluster reduces to pure [여덜] before consonants or in isolation.
              </Typography>
              <View style={{ marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: colors.borderSubtle }}>
                <Typography variant="caption" color="accent" weight="700">
                  Native vs. Sino Quick Distinction:
                </Typography>
                <Typography variant="caption" color="foregroundMuted" style={{ marginTop: 2 }}>
                  Use Native (하나, 둘, 셋...) for physical objects, people, age & hours. For money, minutes, math & 100+, switch to Sino-Korean! Master this interactively in Learn Level 2 Unit 5.
                </Typography>
              </View>
            </Card>
          </>
        )}

        {activeCategoryData.id === 'sino-numbers' && (
          <>
            <Card elevated style={{ marginBottom: theme.spacing.md, padding: theme.spacing.md }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                <Ionicons name="sparkles" size={16} color={colors.accent} />
                <Typography variant="label" color="accent" weight="700" style={{ marginLeft: 4 }}>
                  Simplified Math: Any Number in Seconds
                </Typography>
              </View>
              <Typography variant="caption" color="foreground" weight="600">
                Zero exceptions, pure multiplication + addition:
              </Typography>
              <Typography variant="caption" color="foregroundMuted" style={{ marginTop: 2 }}>
                • 20 = 이(2) + 십(10) = 이십{'\n'}
                • 35 = 삼(3) + 십(10) + 오(5) = 삼십오{'\n'}
                • 2,500원 = 이천(2,000) + 오백(500) 원{'\n'}
                • Units: 10 (십), 100 (백), 1,000 (천), 10,000 (만), 100M (억).
              </Typography>
            </Card>

            <Card subtle style={{ marginBottom: theme.spacing.lg, padding: theme.spacing.md }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                <Ionicons name="mic-outline" size={16} color={colors.primary} />
                <Typography variant="label" color="primary" weight="700" style={{ marginLeft: 4 }}>
                  Coda Neutralization & Liaison in Sino Numbers
                </Typography>
              </View>
              <Typography variant="caption" color="foreground" weight="600">
                Stops & smooth sound linkages:
              </Typography>
              <Typography variant="caption" color="foregroundMuted" style={{ marginTop: 2 }}>
                • <Typography variant="caption" weight="700" color="foreground">육 (6) → [k̚]</Typography>: Final ㄱ stops airflow at the velum [육].{'\n'}
                • <Typography variant="caption" weight="700" color="foreground">십 (10) → [p̚]</Typography>: Final ㅂ seals unreleased [십]. Before vowels (11 = 십일), links as [시빌].{'\n'}
                • <Typography variant="caption" weight="700" color="foreground">Special Month Dropping</Typography>: 6월 is written/said as <Typography variant="caption" weight="700" color="primary">유월</Typography> (not 육월), and 10월 is <Typography variant="caption" weight="700" color="primary">시월</Typography> (not 십월).
              </Typography>
              <View style={{ marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: colors.borderSubtle }}>
                <Typography variant="caption" color="accent" weight="700">
                  Hybrid Time Example:
                </Typography>
                <Typography variant="caption" color="foregroundMuted" style={{ marginTop: 2 }}>
                  Telling time combines both: Native for Hours (<Typography variant="caption" weight="700" color="foreground">세 시</Typography> = 3:00) + Sino for Minutes (<Typography variant="caption" weight="700" color="foreground">삼십 분</Typography> = 30 min) → <Typography variant="caption" weight="700" color="primary">세 시 삼십 분 (3:30)</Typography>.
                </Typography>
              </View>
            </Card>
          </>
        )}

        {/* Character Grid */}
        <View style={styles.charGrid}>
          {activeCategoryData.characters.map((char) => {
            const isPlaying = playingChar === char.char;
            return (
              <TouchableOpacity
                key={char.char}
                activeOpacity={0.7}
                style={[
                  styles.gridItem,
                  {
                    backgroundColor: isPlaying ? colors.surfaceSubtle : colors.surface,
                    borderColor: isPlaying ? colors.primary : colors.borderSubtle,
                    borderRadius: theme.radii.lg,
                    padding: theme.spacing.md,
                    marginBottom: theme.spacing.md,
                  },
                ]}
                onPress={() => handlePlaySound(char)}
                onLongPress={() => setActiveChar(char)}
              >
                <View style={styles.cardHeaderAction}>
                  <Badge label={char.romanization} variant="default" />
                  <TouchableOpacity
                    onPress={() => setActiveChar(char)}
                    style={styles.infoIconWrap}
                    accessibilityLabel="View details"
                  >
                    <Ionicons name="information-circle-outline" size={18} color={colors.foregroundSubtle} />
                  </TouchableOpacity>
                </View>

                <View style={styles.charCenterWrap}>
                  <Typography
                    variant="display"
                    weight="700"
                    align="center"
                    style={{
                      fontSize: 44,
                      lineHeight: 52,
                      color: isPlaying ? colors.primary : colors.foreground,
                    }}
                  >
                    {char.char}
                  </Typography>
                </View>

                <View style={styles.cardBottomRow}>
                  <Typography
                    variant="caption"
                    color="foregroundMuted"
                    align="center"
                    numberOfLines={1}
                    style={{ fontSize: 11 }}
                  >
                    {char.name}
                  </Typography>
                  <View style={[styles.soundPill, { backgroundColor: colors.surfaceSubtle }]}>
                    <Ionicons
                      name={isPlaying ? 'volume-high' : 'volume-medium-outline'}
                      size={14}
                      color={isPlaying ? colors.primary : colors.primary}
                    />
                    <Typography variant="caption" color="primary" style={{ marginLeft: 3, fontSize: 10, fontWeight: '600' }}>
                      Listen
                    </Typography>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Helpful Learning Tip Footer */}
        <Card style={{ marginTop: theme.spacing.md, padding: theme.spacing.lg }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing.xs }}>
            <Ionicons name="bulb-outline" size={18} color={colors.accent} />
            <Typography variant="title" color="accent" style={{ marginLeft: theme.spacing.xs }}>
              Pronunciation Tip
            </Typography>
          </View>
          <Typography variant="body" color="foregroundMuted">
            Tap any letter to hear its native Korean pronunciation immediately. Tap the info icon (i) or press and hold any card to inspect stroke names, IPA values, and everyday sample words.
          </Typography>
        </Card>
          </>
        )}
      </ScrollView>

      {/* Detail Modal */}
      {activeChar && (
        <Modal
          visible={true}
          transparent
          animationType="fade"
          onRequestClose={() => setActiveChar(null)}
        >
          <View style={styles.modalOverlay}>
            <View
              style={[
                styles.modalContent,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.borderSubtle,
                  borderRadius: theme.radii.xl,
                  padding: theme.spacing.xl,
                  maxHeight: '80%',
                },
              ]}
            >
              {/* Modal Top Bar */}
              <View style={styles.modalTopRow}>
                <Badge label="Hangul Letter Details" variant="hangul" />
                <TouchableOpacity
                  onPress={() => setActiveChar(null)}
                  style={[styles.closeModalBtn, { backgroundColor: colors.surfaceSubtle }]}
                  accessibilityLabel="Close details"
                >
                  <Ionicons name="close" size={20} color={colors.foreground} />
                </TouchableOpacity>
              </View>

              {/* Character Big Display */}
              <View style={[styles.modalCharBox, { marginVertical: theme.spacing.lg }]}>
                <Typography
                  variant="display"
                  weight="700"
                  align="center"
                  style={{ fontSize: 72, lineHeight: 82, color: colors.primary }}
                >
                  {activeChar.char}
                </Typography>
                <Typography variant="heading" weight="600" align="center" style={{ marginTop: 4 }}>
                  {activeChar.name}
                </Typography>
                <View style={styles.tagRow}>
                  <Badge label={`Romanization: [${activeChar.romanization}]`} variant="default" />
                  {activeChar.ipa && <Badge label={`IPA: ${activeChar.ipa}`} variant="vocab" />}
                </View>
              </View>

              {/* Sound Description */}
              <View style={[styles.modalDescBox, { backgroundColor: colors.surfaceSubtle, padding: theme.spacing.md, borderRadius: theme.radii.md }]}>
                <Typography variant="label" color="primary" weight="700" style={{ marginBottom: 4 }}>
                  How to Pronounce
                </Typography>
                <Typography variant="body" color="foreground">
                  {activeChar.soundDescription}
                </Typography>
              </View>

              {/* Stroke Order Guide (획순 가이드) */}
              {(() => {
                const strokeInfo = getStrokeOrder(activeChar.char);
                if (!strokeInfo) return null;
                return (
                  <View
                    style={[
                      styles.modalDescBox,
                      {
                        backgroundColor: colors.surfaceSubtle,
                        borderColor: colors.borderSubtle,
                        borderWidth: 1,
                        padding: theme.spacing.md,
                        borderRadius: theme.radii.md,
                        marginTop: theme.spacing.md,
                      },
                    ]}
                  >
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <Typography variant="label" color="primary" weight="700">
                        Stroke Order (획순)
                      </Typography>
                      <Badge
                        label={`${strokeInfo.strokeCount} ${strokeInfo.strokeCount === 1 ? 'stroke' : 'strokes'}`}
                        variant="hangul"
                      />
                    </View>
                    <Typography variant="caption" color="foregroundMuted" style={{ marginBottom: 4 }}>
                      {strokeInfo.generalRule}
                    </Typography>
                    {strokeInfo.steps.map((step, sIdx) => (
                      <Typography key={sIdx} variant="caption" color="foreground" weight="500">
                        • {step}
                      </Typography>
                    ))}
                  </View>
                );
              })()}

              {/* Example Word */}
              {activeChar.exampleWord && (
                <View style={{ marginTop: theme.spacing.lg }}>
                  <Typography variant="label" color="foregroundMuted" style={{ marginBottom: theme.spacing.xs }}>
                    Example Word:
                  </Typography>
                  <TouchableOpacity
                    onPress={() => handlePlayWord(activeChar.exampleWord!.korean)}
                    style={[
                      styles.exampleWordCard,
                      {
                        backgroundColor: colors.surfaceSubtle,
                        borderColor: colors.borderSubtle,
                        borderRadius: theme.radii.md,
                        padding: theme.spacing.md,
                      },
                    ]}
                  >
                    <View style={{ flex: 1 }}>
                      <Typography variant="title" weight="700" color="foreground">
                        {activeChar.exampleWord.korean}
                      </Typography>
                      <Typography variant="caption" color="foregroundMuted">
                        [{activeChar.exampleWord.romanization}] — {activeChar.exampleWord.translation}
                      </Typography>
                    </View>
                    <Ionicons name="volume-medium" size={22} color={colors.primary} />
                  </TouchableOpacity>
                </View>
              )}

              <Divider style={{ marginVertical: theme.spacing.lg }} />

              {/* Action Buttons */}
              <View style={styles.modalActionsRow}>
                <Button
                  title={`Listen "${activeChar.char}"`}
                  icon={<Ionicons name="volume-medium-outline" size={18} color={colors.primaryForeground} />}
                  onPress={() => handlePlaySound(activeChar)}
                  style={{ flex: 1, marginRight: theme.spacing.sm }}
                />
                <Button
                  title="Close"
                  variant="outline"
                  onPress={() => setActiveChar(null)}
                  style={{ minWidth: 90 }}
                />
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {},
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    marginRight: 12,
  },
  headerTitleWrap: {
    flex: 1,
  },
  categoryTabs: {
    flexDirection: 'row',
  },
  categoryPill: {
    borderWidth: 1.5,
  },
  scrollContent: {},
  bannerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  charGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: (SCREEN_WIDTH - 48) / 2, // 2-column layout on mobile screens
    borderWidth: 1,
    minHeight: 140,
    justifyContent: 'space-between',
  },
  cardHeaderAction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoIconWrap: {
    padding: 2,
  },
  charCenterWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
  },
  cardBottomRow: {
    alignItems: 'center',
    gap: 6,
  },
  soundPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 420,
    borderWidth: 1,
  },
  modalTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  closeModalBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCharBox: {
    alignItems: 'center',
  },
  tagRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  modalDescBox: {},
  exampleWordCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
  },
  modalActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
