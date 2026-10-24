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
import { conjugatePredicate } from '@/domain/conjugation/engine';
import { CURATED_PREDICATES } from '@/domain/conjugation/curatedVerbs';
import { CuratedPredicate, WordType } from '@/domain/conjugation/types';
import { hapticService } from '@/infrastructure/haptics/hapticService';

type FilterType = 'all' | 'verb' | 'adjective' | 'irregular';

export default function ConjugatorScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, theme } = useTheme();

  const [inputRoot, setInputRoot] = useState<string>('듣다');
  const [selectedWordType, setSelectedWordType] = useState<WordType>('verb');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const speak = (text: string) => {
    hapticService.lightTick();
    Speech.speak(text, { language: 'ko-KR', rate: 0.85 });
  };

  const conjugation = conjugatePredicate(
    inputRoot.trim() ? inputRoot.trim() : '가다',
    selectedWordType
  );

  const filteredPredicates = CURATED_PREDICATES.filter((p) => {
    if (activeFilter === 'verb') return p.wordType === 'verb';
    if (activeFilter === 'adjective') return p.wordType === 'adjective';
    if (activeFilter === 'irregular') return p.irregularType !== 'regular';
    return true;
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
            Korean Verb Conjugator
          </Typography>
          <Typography variant="caption" color="foregroundMuted">
            동사 & 형용사 활용기 • Stem & Tense Rules
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
        {/* Search / Input Box */}
        <Card elevated style={{ padding: theme.spacing.lg, marginTop: theme.spacing.md, marginBottom: theme.spacing.lg }}>
          <Typography variant="label" color="foregroundMuted" style={{ marginBottom: theme.spacing.xs }}>
            Search or type any dictionary root verb/adjective (ending in -다):
          </Typography>
          <View style={styles.inputRow}>
            <TextInput
              style={[
                styles.rootInput,
                {
                  color: colors.foreground,
                  borderColor: colors.borderSubtle,
                  backgroundColor: colors.surfaceSubtle,
                  borderRadius: theme.radii.md,
                },
              ]}
              value={inputRoot}
              onChangeText={setInputRoot}
              placeholder="e.g. 가다, 먹다, 듣다, 춥다"
              placeholderTextColor={colors.foregroundSubtle}
              autoCapitalize="none"
              autoCorrect={false}
            />
            {inputRoot.length > 0 && (
              <TouchableOpacity
                style={[styles.clearBtn, { backgroundColor: colors.surfaceSubtle, borderRadius: theme.radii.md }]}
                onPress={() => setInputRoot('')}
              >
                <Typography variant="caption" color="foregroundMuted">
                  Clear
                </Typography>
              </TouchableOpacity>
            )}
          </View>
        </Card>

        {/* Main Conjugation Results Card */}
        <Card elevated style={{ padding: theme.spacing.xl, marginBottom: theme.spacing.xl }}>
          {/* Header with Badges */}
          <View style={styles.cardHeaderRow}>
            <View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Typography variant="display" weight="700" color="primary">
                  {conjugation.root}
                </Typography>
                <Badge
                  label={conjugation.wordType === 'verb' ? 'Verb 동사' : 'Adjective 형용사'}
                  variant="vocab"
                />
                {conjugation.irregularType !== 'regular' && (
                  <Badge label={conjugation.irregularType} variant="grammar" />
                )}
              </View>
              <Typography variant="body" weight="600" color="foregroundMuted" style={{ marginTop: 2 }}>
                Meaning: {conjugation.meaning}
              </Typography>
            </View>

            <TouchableOpacity
              onPress={() => speak(conjugation.root)}
              style={[styles.audioBtn, { backgroundColor: colors.surfaceSubtle, borderRadius: theme.radii.full }]}
            >
              <Ionicons name="volume-high" size={22} color={colors.primary} />
            </TouchableOpacity>
          </View>

          {/* Stem & Rule Banner */}
          <View
            style={[
              styles.ruleBox,
              {
                backgroundColor: colors.surfaceSubtle,
                borderColor: colors.borderSubtle,
                borderRadius: theme.radii.md,
                padding: theme.spacing.md,
                marginVertical: theme.spacing.md,
              },
            ]}
          >
            <Typography variant="caption" weight="700" color="primary">
              Grammar Rule & Harmony:
            </Typography>
            <Typography variant="caption" color="foreground" style={{ marginTop: 2 }}>
              {conjugation.ruleExplanation}
            </Typography>
          </View>

          {/* Conjugated Forms Breakdown Grid */}
          <Typography variant="label" weight="700" style={{ marginBottom: theme.spacing.sm }}>
            6 Essential Spoken Forms:
          </Typography>

          <View style={{ gap: theme.spacing.sm }}>
            {/* 1. Present Polite */}
            <TouchableOpacity
              onPress={() => speak(conjugation.presentPolite)}
              style={[styles.formRow, { backgroundColor: colors.surfaceSubtle, borderRadius: theme.radii.md }]}
            >
              <View style={{ flex: 1 }}>
                <Typography variant="caption" color="foregroundMuted">
                  Polite Present (-아요/어요)
                </Typography>
                <Typography variant="title" weight="700" color="primary" style={{ marginTop: 1 }}>
                  {conjugation.presentPolite}
                </Typography>
              </View>
              <Ionicons name="volume-medium-outline" size={20} color={colors.primary} />
            </TouchableOpacity>

            {/* 2. Formal Deferential */}
            <TouchableOpacity
              onPress={() => speak(conjugation.formalPolite)}
              style={[styles.formRow, { backgroundColor: colors.surfaceSubtle, borderRadius: theme.radii.md }]}
            >
              <View style={{ flex: 1 }}>
                <Typography variant="caption" color="foregroundMuted">
                  Formal Polite (-습니다/습니까)
                </Typography>
                <Typography variant="title" weight="700" color="foreground" style={{ marginTop: 1 }}>
                  {conjugation.formalPolite}
                </Typography>
              </View>
              <Ionicons name="volume-medium-outline" size={20} color={colors.primary} />
            </TouchableOpacity>

            {/* 3. Past Polite */}
            <TouchableOpacity
              onPress={() => speak(conjugation.pastPolite)}
              style={[styles.formRow, { backgroundColor: colors.surfaceSubtle, borderRadius: theme.radii.md }]}
            >
              <View style={{ flex: 1 }}>
                <Typography variant="caption" color="foregroundMuted">
                  Past Tense (-았어요/었어요)
                </Typography>
                <Typography variant="title" weight="700" color="foreground" style={{ marginTop: 1 }}>
                  {conjugation.pastPolite}
                </Typography>
              </View>
              <Ionicons name="volume-medium-outline" size={20} color={colors.primary} />
            </TouchableOpacity>

            {/* 4. Future Polite */}
            <TouchableOpacity
              onPress={() => speak(conjugation.futurePolite)}
              style={[styles.formRow, { backgroundColor: colors.surfaceSubtle, borderRadius: theme.radii.md }]}
            >
              <View style={{ flex: 1 }}>
                <Typography variant="caption" color="foregroundMuted">
                  Future Tense (-(으)ㄹ 거예요)
                </Typography>
                <Typography variant="title" weight="700" color="foreground" style={{ marginTop: 1 }}>
                  {conjugation.futurePolite}
                </Typography>
              </View>
              <Ionicons name="volume-medium-outline" size={20} color={colors.primary} />
            </TouchableOpacity>

            {/* 5. Polite Request (Verbs only) */}
            {conjugation.politeRequest && (
              <TouchableOpacity
                onPress={() => speak(conjugation.politeRequest!)}
                style={[styles.formRow, { backgroundColor: colors.surfaceSubtle, borderRadius: theme.radii.md }]}
              >
                <View style={{ flex: 1 }}>
                  <Typography variant="caption" color="foregroundMuted">
                    Polite Request (-(으)세요)
                  </Typography>
                  <Typography variant="title" weight="700" color="foreground" style={{ marginTop: 1 }}>
                    {conjugation.politeRequest}
                  </Typography>
                </View>
                <Ionicons name="volume-medium-outline" size={20} color={colors.primary} />
              </TouchableOpacity>
            )}

            {/* 6. Negation */}
            <View style={[styles.formRow, { backgroundColor: colors.surfaceSubtle, borderRadius: theme.radii.md }]}>
              <View style={{ flex: 1 }}>
                <Typography variant="caption" color="foregroundMuted">
                  Negation (Short & Long Form)
                </Typography>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 2 }}>
                  <TouchableOpacity onPress={() => speak(conjugation.negationShort)}>
                    <Typography variant="body" weight="700" color="accent">
                      {conjugation.negationShort}
                    </Typography>
                  </TouchableOpacity>
                  <Typography variant="caption" color="foregroundSubtle">
                    •
                  </Typography>
                  <TouchableOpacity onPress={() => speak(conjugation.negationLong)}>
                    <Typography variant="body" weight="700" color="foreground">
                      {conjugation.negationLong}
                    </Typography>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Card>

        {/* Curated Vocabulary Chips */}
        <Typography variant="title" style={{ marginBottom: theme.spacing.sm }}>
          Curated Predicates Catalog
        </Typography>

        {/* Filter Pills */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, marginBottom: theme.spacing.md }}>
          {(['all', 'verb', 'adjective', 'irregular'] as FilterType[]).map((filter) => {
            const isSelected = activeFilter === filter;
            return (
              <TouchableOpacity
                key={filter}
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
                  setActiveFilter(filter);
                }}
              >
                <Typography variant="caption" weight="600" color={isSelected ? 'primaryForeground' : 'foreground'}>
                  {filter === 'all'
                    ? 'All Words'
                    : filter === 'verb'
                    ? 'Verbs Only'
                    : filter === 'adjective'
                    ? 'Adjectives'
                    : 'Irregulars Only ⚡'}
                </Typography>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={styles.chipGrid}>
          {filteredPredicates.map((item) => {
            const isSelected = inputRoot === item.root;
            return (
              <TouchableOpacity
                key={item.root}
                style={[
                  styles.verbChip,
                  {
                    backgroundColor: isSelected ? colors.primary : colors.surfaceSubtle,
                    borderColor: isSelected ? colors.primary : colors.borderSubtle,
                    borderRadius: theme.radii.md,
                  },
                ]}
                onPress={() => {
                  hapticService.lightTick();
                  setInputRoot(item.root);
                  setSelectedWordType(item.wordType);
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
                  <Typography variant="label" weight="700" color={isSelected ? 'primaryForeground' : 'foreground'}>
                    {item.root}
                  </Typography>
                  {item.irregularType !== 'regular' && (
                    <Typography variant="caption" style={{ fontSize: 9 }} color={isSelected ? 'primaryForeground' : 'accent'}>
                      ⚡ {item.irregularType.split('-')[0]}
                    </Typography>
                  )}
                </View>
                <Typography variant="caption" color={isSelected ? 'primaryForeground' : 'foregroundMuted'} numberOfLines={1}>
                  {item.meaning}
                </Typography>
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
  inputRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  rootInput: {
    flex: 1,
    fontSize: 20,
    fontWeight: '700',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1.5,
  },
  clearBtn: {
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  audioBtn: {
    padding: 10,
  },
  ruleBox: {
    borderWidth: 1,
  },
  formRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 1,
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  verbChip: {
    flexBasis: '48%',
    flexGrow: 1,
    padding: 12,
    borderWidth: 1.5,
  },
});
