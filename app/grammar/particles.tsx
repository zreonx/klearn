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
import {
  Typography,
  Card,
  Badge,
  useTheme,
} from '@/components/ui';
import {
  PARTICLE_GUIDE_DATA,
  ParticleCategory,
  ParticleGuideItem,
} from '@/content/grammar/particleData';
import { services } from '@/application/services';
import { hapticService } from '@/infrastructure/haptics/hapticService';

export default function ParticlesGuideScreen() {
  const router = useRouter();
  const { colors, theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [selectedCategory, setSelectedCategory] = useState<ParticleCategory | 'all'>('all');
  const [playingId, setPlayingId] = useState<string | null>(null);

  const categories: Array<{ id: ParticleCategory | 'all'; label: string }> = [
    { id: 'all', label: 'All Particles' },
    { id: 'subject-topic', label: 'Subject & Topic (은/는 vs 이/가)' },
    { id: 'object', label: 'Object (을/를)' },
    { id: 'location-direction', label: 'Location & Direction (에, 에서, 로)' },
    { id: 'connector', label: 'Connectors (하고, 랑, 와/과)' },
    { id: 'recipient', label: 'Recipient (에게, 한테, 께)' },
    { id: 'delimiters', label: 'Delimiters (도, 만, 부터~까지)' },
  ];

  const filteredItems: ParticleGuideItem[] =
    selectedCategory === 'all'
      ? PARTICLE_GUIDE_DATA
      : PARTICLE_GUIDE_DATA.filter((p) => p.category === selectedCategory);

  const handlePlayAudio = (id: string, text: string) => {
    hapticService.lightTick();
    setPlayingId(id);
    services.speech.speak(text, { rate: 0.85 });
    setTimeout(() => {
      setPlayingId(null);
    }, 700);
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
            paddingBottom: theme.spacing.sm,
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

          <View style={{ flex: 1 }}>
            <Typography variant="heading" weight="700">
              Korean Particles Guide
            </Typography>
            <Typography variant="caption" color="foregroundMuted">
              한국어 조사 완벽 정리 • Comparison, Rules & Examples
            </Typography>
          </View>
        </View>

        {/* Filter Category Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[styles.categoryTabs, { paddingTop: theme.spacing.md }]}
        >
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <TouchableOpacity
                key={cat.id}
                onPress={() => {
                  hapticService.lightTick();
                  setSelectedCategory(cat.id);
                }}
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
                  {cat.label}
                </Typography>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Main List */}
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
        {/* Intro Tip Banner */}
        <Card subtle style={{ marginBottom: theme.spacing.lg, padding: theme.spacing.md }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
            <Ionicons name="bulb-outline" size={18} color={colors.primary} />
            <Typography variant="label" color="primary" weight="700" style={{ marginLeft: 6 }}>
              Golden Particle Rule
            </Typography>
          </View>
          <Typography variant="caption" color="foreground" style={{ lineHeight: 18 }}>
            Korean particles (조사) attach directly to the end of nouns with zero spaces. Most come in pairs where your choice depends on whether the preceding noun ends in a consonant (받침) or a vowel!
          </Typography>
        </Card>

        {/* Particle Cards */}
        <View style={{ gap: theme.spacing.lg }}>
          {filteredItems.map((item) => (
            <Card key={item.id} elevated style={{ padding: theme.spacing.lg }}>
              {/* Card Header */}
              <View style={[styles.cardHeader, { marginBottom: 8 }]}>
                <Typography variant="display" weight="700" color="primary" style={{ fontSize: 28, lineHeight: 34 }}>
                  {item.korean}
                </Typography>
                <Badge label={item.englishRole} variant="vocab" />
              </View>

              {/* Attachment Rule Box */}
              <View
                style={[
                  styles.ruleBox,
                  {
                    backgroundColor: colors.surfaceSubtle,
                    borderColor: colors.borderSubtle,
                    borderRadius: theme.radii.md,
                    padding: theme.spacing.sm + 2,
                    marginBottom: theme.spacing.md,
                  },
                ]}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
                  <Ionicons name="git-commit-outline" size={14} color={colors.primary} />
                  <Typography variant="caption" color="primary" weight="700" style={{ marginLeft: 4 }}>
                    Attachment Rule:
                  </Typography>
                </View>
                <Typography variant="caption" weight="600" color="foreground">
                  {item.consonantVowelRule}
                </Typography>
              </View>

              {/* Core Explanation */}
              <Typography variant="body" color="foreground" style={{ marginBottom: theme.spacing.md, lineHeight: 20 }}>
                {item.coreExplanation}
              </Typography>

              {/* Comparison Box (if available) */}
              {item.comparisonVs && (
                <View
                  style={[
                    styles.comparisonBox,
                    {
                      backgroundColor: colors.surface,
                      borderColor: colors.accent,
                      borderRadius: theme.radii.md,
                      padding: theme.spacing.md,
                      marginBottom: theme.spacing.md,
                    },
                  ]}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                    <Ionicons name="swap-horizontal" size={16} color={colors.accent} />
                    <Typography variant="label" color="accent" weight="700" style={{ marginLeft: 6 }}>
                      Key Distinction: vs. {item.comparisonVs.versus}
                    </Typography>
                  </View>
                  <Typography variant="caption" color="foregroundMuted" style={{ lineHeight: 18 }}>
                    {item.comparisonVs.keyDifference}
                  </Typography>
                </View>
              )}

              {/* Example Sentences */}
              <Typography variant="label" color="foregroundMuted" weight="700" style={{ marginBottom: 6 }}>
                Context Examples:
              </Typography>

              <View style={{ gap: 8 }}>
                {item.examples.map((ex, exIdx) => {
                  const isPlaying = playingId === `${item.id}-${exIdx}`;
                  return (
                    <TouchableOpacity
                      key={`${item.id}-${exIdx}`}
                      activeOpacity={0.7}
                      onPress={() => handlePlayAudio(`${item.id}-${exIdx}`, ex.korean)}
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
                      <View style={{ flex: 1, marginRight: 8 }}>
                        <Typography variant="body" weight="700" color="foreground">
                          {ex.korean}
                        </Typography>
                        <Typography variant="caption" color="foregroundMuted" style={{ marginTop: 2 }}>
                          [{ex.romanization}]
                        </Typography>
                        <Typography variant="caption" color="foreground" style={{ marginTop: 2 }}>
                          {ex.translation}
                        </Typography>
                      </View>
                      <Ionicons
                        name={isPlaying ? 'volume-high' : 'volume-medium-outline'}
                        size={22}
                        color={colors.primary}
                      />
                    </TouchableOpacity>
                  );
                })}
              </View>
            </Card>
          ))}
        </View>
      </ScrollView>
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
  categoryTabs: {
    flexDirection: 'row',
  },
  categoryPill: {
    borderWidth: 1.5,
  },
  scrollContent: {},
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ruleBox: {
    borderWidth: 1,
  },
  comparisonBox: {
    borderWidth: 1.5,
  },
  exampleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
  },
});
