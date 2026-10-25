import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Typography, Card, Badge, useTheme } from '@/components/ui';
import { toSinoKorean, SINO_PRESET_EXAMPLES } from '@/domain/numbers/sinoKorean';
import { toNativeKorean, NATIVE_PRESET_EXAMPLES } from '@/domain/numbers/nativeKorean';
import {
  KOREAN_COUNTERS,
  formatKoreanClockTime,
  KoreanCounter,
} from '@/domain/numbers/counters';
import { hapticService } from '@/infrastructure/haptics/hapticService';

type TabMode = 'converter' | 'time' | 'counters';

export default function NumbersPlaygroundScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, theme } = useTheme();

  const [activeTab, setActiveTab] = useState<TabMode>('converter');
  const [inputNumber, setInputNumber] = useState<string>('24');
  const [selectedHour, setSelectedHour] = useState<number>(3);
  const [selectedMinute, setSelectedMinute] = useState<number>(30);
  const [selectedCounter, setSelectedCounter] = useState<KoreanCounter>(KOREAN_COUNTERS[0]);

  const speak = (text: string) => {
    hapticService.lightTick();
    Speech.speak(text, { language: 'ko-KR', rate: 0.9 });
  };

  const parsedNum = parseInt(inputNumber, 10);
  const validNum = Number.isFinite(parsedNum) && parsedNum >= 0 ? parsedNum : 0;
  const sinoResult = toSinoKorean(validNum);
  const nativeResult = validNum >= 1 && validNum <= 99 ? toNativeKorean(validNum, false) : null;
  const nativeCounterResult = validNum >= 1 && validNum <= 99 ? toNativeKorean(validNum, true) : null;

  const clockTime = formatKoreanClockTime(selectedHour, selectedMinute);

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
            Numbers & Counters
          </Typography>
          <Typography variant="caption" color="foregroundMuted">
            숫자 & 단위 연습기 • Dual System
          </Typography>
        </View>
      </View>

      {/* Segmented Tab Switcher */}
      <View style={[styles.tabBar, { paddingHorizontal: theme.spacing.lg, marginVertical: theme.spacing.sm }]}>
        <View
          style={[
            styles.tabBarInner,
            {
              backgroundColor: colors.surfaceSubtle,
              borderRadius: theme.radii.lg,
              padding: 4,
            },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.tabPill,
              activeTab === 'converter' && {
                backgroundColor: colors.surface,
                borderRadius: theme.radii.md,
                borderWidth: 1,
                borderColor: colors.borderSubtle,
              },
            ]}
            onPress={() => {
              hapticService.lightTick();
              setActiveTab('converter');
            }}
          >
            <Typography
              variant="label"
              weight="600"
              color={activeTab === 'converter' ? 'primary' : 'foregroundMuted'}
            >
              Converter
            </Typography>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tabPill,
              activeTab === 'time' && {
                backgroundColor: colors.surface,
                borderRadius: theme.radii.md,
                borderWidth: 1,
                borderColor: colors.borderSubtle,
              },
            ]}
            onPress={() => {
              hapticService.lightTick();
              setActiveTab('time');
            }}
          >
            <Typography
              variant="label"
              weight="600"
              color={activeTab === 'time' ? 'primary' : 'foregroundMuted'}
            >
              Time Teller
            </Typography>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.tabPill,
              activeTab === 'counters' && {
                backgroundColor: colors.surface,
                borderRadius: theme.radii.md,
                borderWidth: 1,
                borderColor: colors.borderSubtle,
              },
            ]}
            onPress={() => {
              hapticService.lightTick();
              setActiveTab('counters');
            }}
          >
            <Typography
              variant="label"
              weight="600"
              color={activeTab === 'counters' ? 'primary' : 'foregroundMuted'}
            >
              12 Counters
            </Typography>
          </TouchableOpacity>
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
        {activeTab === 'converter' && (
          <View>
            {/* Input Card */}
            <Card elevated style={{ padding: theme.spacing.lg, marginBottom: theme.spacing.lg }}>
              <Typography variant="label" color="foregroundMuted" style={{ marginBottom: theme.spacing.xs }}>
                Enter any number (0 to 999,999,999):
              </Typography>
              <View style={styles.inputRow}>
                <TextInput
                  style={[
                    styles.numInput,
                    {
                      color: colors.foreground,
                      borderColor: colors.borderSubtle,
                      backgroundColor: colors.surfaceSubtle,
                      borderRadius: theme.radii.md,
                    },
                  ]}
                  value={inputNumber}
                  onChangeText={setInputNumber}
                  keyboardType="number-pad"
                  maxLength={9}
                  placeholder="e.g. 25"
                  placeholderTextColor={colors.foregroundSubtle}
                />
                <TouchableOpacity
                  style={[styles.quickClearBtn, { backgroundColor: colors.surfaceSubtle, borderRadius: theme.radii.md }]}
                  onPress={() => setInputNumber('')}
                >
                  <Typography variant="caption" color="foregroundMuted">
                    Clear
                  </Typography>
                </TouchableOpacity>
              </View>

              {/* Quick Preset Number Pills */}
              <Typography variant="caption" color="foregroundSubtle" style={{ marginTop: theme.spacing.md, marginBottom: theme.spacing.xs }}>
                Quick Presets:
              </Typography>
              <View style={styles.presetWrap}>
                {['1', '4', '10', '15', '20', '24', '42', '100', '4500', '10000', '50000'].map((preset) => (
                  <TouchableOpacity
                    key={preset}
                    style={[
                      styles.presetChip,
                      {
                        backgroundColor: inputNumber === preset ? colors.primary : colors.surfaceSubtle,
                        borderColor: inputNumber === preset ? colors.primary : colors.borderSubtle,
                        borderRadius: theme.radii.sm,
                      },
                    ]}
                    onPress={() => {
                      hapticService.lightTick();
                      setInputNumber(preset);
                    }}
                  >
                    <Typography
                      variant="caption"
                      weight="600"
                      color={inputNumber === preset ? 'primaryForeground' : 'foreground'}
                    >
                      {preset}
                    </Typography>
                  </TouchableOpacity>
                ))}
              </View>
            </Card>

            {/* Results: Side-by-Side Systems */}
            <View style={{ gap: theme.spacing.md, marginBottom: theme.spacing.lg }}>
              {/* Sino-Korean Result Card */}
              <Card elevated style={{ padding: theme.spacing.lg }}>
                <View style={styles.cardHeaderRow}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Badge label="Sino-Korean (한자어)" variant="vocab" />
                    <Typography variant="caption" color="foregroundMuted">
                      For money, dates, minutes
                    </Typography>
                  </View>
                  {sinoResult ? (
                    <TouchableOpacity onPress={() => speak(sinoResult)}>
                      <Ionicons name="volume-high" size={20} color={colors.primary} />
                    </TouchableOpacity>
                  ) : null}
                </View>
                <Typography variant="display" weight="700" color="primary" style={{ marginTop: theme.spacing.sm }}>
                  {sinoResult || '—'}
                </Typography>
                <Typography variant="caption" color="foregroundMuted" style={{ marginTop: theme.spacing.xs }}>
                  Example in context: {sinoResult ? `${sinoResult} 원 (Won) • ${sinoResult} 분 (Minutes)` : 'Enter a number'}
                </Typography>
              </Card>

              {/* Native Korean Result Card */}
              <Card elevated style={{ padding: theme.spacing.lg }}>
                <View style={styles.cardHeaderRow}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Badge label="Native Korean (고유어)" variant="hangul" />
                    <Typography variant="caption" color="foregroundMuted">
                      For items, people, age, hours (1-99)
                    </Typography>
                  </View>
                  {nativeResult ? (
                    <TouchableOpacity onPress={() => speak(nativeResult)}>
                      <Ionicons name="volume-high" size={20} color={colors.primary} />
                    </TouchableOpacity>
                  ) : null}
                </View>
                {nativeResult ? (
                  <View style={{ marginTop: theme.spacing.sm }}>
                    <Typography variant="display" weight="700" color="foreground">
                      {nativeResult}
                    </Typography>
                    {nativeCounterResult && nativeCounterResult !== nativeResult && (
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 4 }}>
                        <Typography variant="label" weight="600" color="accent">
                          Before counter: {nativeCounterResult}
                        </Typography>
                        <Typography variant="caption" color="foregroundMuted">
                          (e.g. {nativeCounterResult} 개, {nativeCounterResult} 명, {nativeCounterResult} 살)
                        </Typography>
                      </View>
                    )}
                  </View>
                ) : (
                  <Typography variant="body" color="foregroundSubtle" style={{ marginTop: theme.spacing.sm }}>
                    {validNum > 99
                      ? 'Native Korean numbers are used up to 99. Above 99, use Sino-Korean.'
                      : 'Zero does not have a native form; use Sino-Korean 영.'}
                  </Typography>
                )}
              </Card>
            </View>

            {/* Practical Real-World Drills */}
            <Typography variant="title" style={{ marginBottom: theme.spacing.sm }}>
              Daily Real-World Examples
            </Typography>
            <View style={{ gap: theme.spacing.sm }}>
              {[...NATIVE_PRESET_EXAMPLES.slice(0, 3), ...SINO_PRESET_EXAMPLES.slice(0, 3)].map((ex, idx) => (
                <TouchableOpacity
                  key={idx}
                  onPress={() => speak(ex.korean)}
                  style={[
                    styles.exampleRow,
                    {
                      backgroundColor: colors.surfaceSubtle,
                      borderColor: colors.borderSubtle,
                      borderRadius: theme.radii.md,
                      padding: theme.spacing.md,
                    },
                  ]}
                >
                  <View style={{ flex: 1 }}>
                    <Typography variant="heading" weight="700" color="foreground">
                      {ex.korean}
                    </Typography>
                    <Typography variant="caption" color="foregroundMuted" style={{ marginTop: 2 }}>
                      {ex.meaning}
                    </Typography>
                  </View>
                  <Ionicons name="volume-medium-outline" size={20} color={colors.primary} />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {activeTab === 'time' && (
          <View>
            {/* Clock Big Display Card */}
            <Card elevated style={{ padding: theme.spacing.xl, alignItems: 'center', marginBottom: theme.spacing.lg }}>
              <Badge label="Korean Time Telling Rule" variant="grammar" style={{ marginBottom: theme.spacing.sm }} />
              <Typography variant="caption" color="foregroundMuted" align="center" style={{ marginBottom: theme.spacing.md }}>
                Hours use <Typography variant="caption" weight="700" color="primary">Native Korean (시)</Typography> • Minutes use <Typography variant="caption" weight="700" color="accent">Sino-Korean (분)</Typography>
              </Typography>

              <Typography variant="display" weight="700" color="primary" align="center">
                {clockTime.korean}
              </Typography>
              <Typography variant="body" color="foregroundMuted" align="center" style={{ marginTop: 4 }}>
                {selectedHour % 12 === 0 ? 12 : selectedHour % 12}:{String(selectedMinute).padStart(2, '0')} {selectedHour >= 12 ? 'PM' : 'AM'}
              </Typography>

              <TouchableOpacity
                onPress={() => speak(clockTime.korean)}
                style={[
                  styles.playTimeBtn,
                  {
                    backgroundColor: colors.surfaceSubtle,
                    borderColor: colors.borderSubtle,
                    borderRadius: theme.radii.full,
                    marginTop: theme.spacing.md,
                  },
                ]}
              >
                <Ionicons name="volume-high" size={18} color={colors.primary} />
                <Typography variant="label" color="primary" weight="700" style={{ marginLeft: 6 }}>
                  Listen to Time
                </Typography>
              </TouchableOpacity>
            </Card>

            {/* Hour Selector */}
            <Typography variant="label" weight="700" style={{ marginBottom: theme.spacing.xs }}>
              Pick Hour (Native: 1 to 12 시):
            </Typography>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingVertical: 4 }}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((h) => {
                const isSelected = selectedHour === h || selectedHour === h + 12;
                return (
                  <TouchableOpacity
                    key={h}
                    style={[
                      styles.timeChip,
                      {
                        backgroundColor: isSelected ? colors.primary : colors.surfaceSubtle,
                        borderColor: isSelected ? colors.primary : colors.borderSubtle,
                        borderRadius: theme.radii.md,
                      },
                    ]}
                    onPress={() => {
                      hapticService.lightTick();
                      setSelectedHour(h);
                    }}
                  >
                    <Typography variant="label" weight="700" color={isSelected ? 'primaryForeground' : 'foreground'}>
                      {h}시
                    </Typography>
                    <Typography variant="caption" color={isSelected ? 'primaryForeground' : 'foregroundMuted'} style={{ fontSize: 10 }}>
                      {toNativeKorean(h, true)}
                    </Typography>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Minute Selector */}
            <Typography variant="label" weight="700" style={{ marginTop: theme.spacing.lg, marginBottom: theme.spacing.xs }}>
              Pick Minute (Sino: 분):
            </Typography>
            <View style={styles.minuteGrid}>
              {[0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55].map((m) => {
                const isSelected = selectedMinute === m;
                return (
                  <TouchableOpacity
                    key={m}
                    style={[
                      styles.minuteChip,
                      {
                        backgroundColor: isSelected ? colors.accent : colors.surfaceSubtle,
                        borderColor: isSelected ? colors.accent : colors.borderSubtle,
                        borderRadius: theme.radii.md,
                      },
                    ]}
                    onPress={() => {
                      hapticService.lightTick();
                      setSelectedMinute(m);
                    }}
                  >
                    <Typography variant="label" weight="700" color={isSelected ? 'primaryForeground' : 'foreground'}>
                      {m === 0 ? '정각 (:00)' : m === 30 ? '반 (:30)' : `${m}분`}
                    </Typography>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {activeTab === 'counters' && (
          <View>
            <Typography variant="caption" color="foregroundMuted" style={{ marginBottom: theme.spacing.md }}>
              Korean uses distinct counter words depending on the object type. Tap any counter below to study its rules and examples:
            </Typography>

            <View style={{ gap: theme.spacing.md }}>
              {KOREAN_COUNTERS.map((counter) => {
                const isSelected = selectedCounter.id === counter.id;
                return (
                  <Card
                    key={counter.id}
                    elevated={isSelected}
                    style={{
                      padding: theme.spacing.lg,
                      borderWidth: isSelected ? 1.5 : 1,
                      borderColor: isSelected ? colors.primary : colors.borderSubtle,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        hapticService.lightTick();
                        setSelectedCounter(counter);
                      }}
                    >
                      <View style={styles.cardHeaderRow}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                          <Typography variant="title" weight="700" color="primary">
                            {counter.hangul}
                          </Typography>
                          <Typography variant="caption" color="foregroundMuted">
                            [{counter.romanization}]
                          </Typography>
                          <Badge
                            label={counter.system === 'native' ? 'Native #' : 'Sino #'}
                            variant={counter.system === 'native' ? 'hangul' : 'vocab'}
                          />
                        </View>
                        <TouchableOpacity onPress={() => speak(counter.exampleKorean)}>
                          <Ionicons name="volume-high" size={20} color={colors.primary} />
                        </TouchableOpacity>
                      </View>

                      <Typography variant="body" weight="600" color="foreground" style={{ marginTop: theme.spacing.xs }}>
                        Used for: {counter.usedFor}
                      </Typography>

                      <View
                        style={[
                          styles.exampleBox,
                          {
                            backgroundColor: colors.surfaceSubtle,
                            borderRadius: theme.radii.sm,
                            padding: theme.spacing.sm,
                            marginTop: theme.spacing.sm,
                          },
                        ]}
                      >
                        <Typography variant="label" weight="700" color="foreground">
                          "{counter.exampleKorean}"
                        </Typography>
                        <Typography variant="caption" color="foregroundMuted" style={{ marginTop: 2 }}>
                          {counter.exampleTranslation}
                        </Typography>
                      </View>

                      <Typography variant="caption" color="foregroundSubtle" style={{ marginTop: theme.spacing.xs }}>
                        💡 {counter.tip}
                      </Typography>
                    </TouchableOpacity>
                  </Card>
                );
              })}
            </View>
          </View>
        )}
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
  tabBar: {},
  tabBarInner: {
    flexDirection: 'row',
  },
  tabPill: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingTop: 8,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  numInput: {
    flex: 1,
    fontSize: 22,
    fontWeight: '700',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1.5,
  },
  quickClearBtn: {
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  presetWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  presetChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  exampleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
  },
  playTimeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
  },
  timeChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: 'center',
    minWidth: 64,
    borderWidth: 1.5,
  },
  minuteGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  minuteChip: {
    flexBasis: '30%',
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderWidth: 1.5,
  },
  exampleBox: {},
});
