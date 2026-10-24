import React, { useState, useMemo } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  Typography,
  Card,
  Badge,
  useTheme,
} from '@/components/ui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { services } from '@/application/services';
import { LearningItem } from '@/domain/learning/types';
import { matchesChoseong } from '@/domain/hangul/choseongSearch';

export default function SearchScreen() {
  const router = useRouter();
  const { colors, theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');

  const allItems = useMemo(() => {
    return services.catalog.getAllItems();
  }, []);

  const results = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return [];

    return allItems
      .filter((item) => {
        const matchKorean = item.korean.toLowerCase().includes(trimmed);
        const matchChoseong = matchesChoseong(item.korean, trimmed);
        const matchTrans = item.translation.toLowerCase().includes(trimmed);
        const matchRom = item.romanization?.toLowerCase().includes(trimmed);
        const matchTags = item.tags?.some((t) => t.toLowerCase().includes(trimmed));
        const matchHanja = (item as any).hanja?.toLowerCase().includes(trimmed);
        return matchKorean || matchChoseong || matchTrans || matchRom || matchTags || matchHanja;
      })
      .slice(0, 50); // Fast responsive rendering
  }, [query, allItems]);

  const speak = (text: string) => {
    services.speech.speak(text);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: Math.max(insets.top + 8, theme.spacing.lg) }]}>
      {/* Search Header Bar */}
      <View style={[styles.headerRow, { paddingHorizontal: theme.spacing.lg, marginBottom: theme.spacing.md }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={{ marginRight: theme.spacing.sm, padding: 4 }}
        >
          <Ionicons name="arrow-back" size={24} color={colors.foreground} />
        </TouchableOpacity>

        <View
          style={[
            styles.inputContainer,
            {
              backgroundColor: colors.surfaceSubtle,
              borderColor: colors.borderSubtle,
              borderRadius: theme.radii.full,
              paddingHorizontal: theme.spacing.md,
            },
          ]}
        >
          <Ionicons name="search" size={18} color={colors.foregroundMuted} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search Korean, English, Hangul, or 초성 (ㄱㅅ)..."
            placeholderTextColor={colors.foregroundSubtle}
            autoFocus
            style={[styles.input, { color: colors.foreground }]}
            returnKeyType="search"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')} style={{ padding: 4 }}>
              <Ionicons name="close-circle" size={18} color={colors.foregroundMuted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Results List */}
      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingHorizontal: theme.spacing.lg,
            paddingBottom: Math.max(insets.bottom + 16, theme.spacing['4xl']),
          },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        {query.trim().length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={48} color={colors.foregroundSubtle} style={{ marginBottom: theme.spacing.md }} />
            <Typography variant="heading" weight="700" align="center">
              Search Korean Dictionary & Lessons
            </Typography>
            <Typography variant="body" color="foregroundMuted" align="center" style={{ marginTop: 4, maxWidth: 280 }}>
              Type any Korean word, Hangul syllable, English translation, or grammar pattern.
            </Typography>

            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginTop: theme.spacing.xl }}>
              {['안녕', '사과', '감사합니다', '보다', '은/는', '한국'].map((tag) => (
                <TouchableOpacity
                  key={tag}
                  onPress={() => setQuery(tag)}
                  style={{
                    backgroundColor: colors.surfaceSubtle,
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: theme.radii.full,
                    borderWidth: 1,
                    borderColor: colors.borderSubtle,
                  }}
                >
                  <Typography variant="caption" weight="600" color="primary">
                    {tag}
                  </Typography>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ) : results.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="alert-circle-outline" size={44} color={colors.foregroundSubtle} style={{ marginBottom: theme.spacing.sm }} />
            <Typography variant="title" weight="700" align="center">
              No matches found
            </Typography>
            <Typography variant="caption" color="foregroundMuted" align="center" style={{ marginTop: 4 }}>
              Try searching with another spelling, romanization, or keyword.
            </Typography>
          </View>
        ) : (
          <>
            <Typography variant="label" color="foregroundMuted" style={{ marginBottom: theme.spacing.md }}>
              Found {results.length} result{results.length > 1 ? 's' : ''}
            </Typography>

            {results.map((item) => (
              <Card
                key={item.id}
                elevated
                style={{ marginBottom: theme.spacing.md }}
                onPress={() => router.push(`/learn/item/${item.id}` as any)}
              >
                <View style={styles.rowBetween}>
                  <View style={{ flex: 1, marginRight: theme.spacing.md }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <Typography variant="heading" weight="700">
                        {item.korean}
                      </Typography>
                      {(item as any).hanja ? (
                        <Badge label={(item as any).hanja} variant="default" />
                      ) : null}
                      <Badge label={item.type.replace('_', ' ')} variant="vocab" style={{ transform: [{ scale: 0.85 }] }} />
                    </View>

                    {item.romanization ? (
                      <Typography variant="caption" color="foregroundMuted" style={{ marginTop: 2 }}>
                        [{item.romanization}]
                      </Typography>
                    ) : null}

                    <Typography variant="body" weight="600" color="foreground" style={{ marginTop: 4 }}>
                      {item.translation}
                    </Typography>

                    {item.explanation ? (
                      <Typography variant="caption" color="foregroundMuted" numberOfLines={2} style={{ marginTop: 2 }}>
                        {item.explanation}
                      </Typography>
                    ) : null}
                  </View>

                  <TouchableOpacity
                    onPress={() => speak(item.korean)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    style={{
                      backgroundColor: colors.surfaceSubtle,
                      borderRadius: theme.radii.full,
                      padding: theme.spacing.xs,
                      alignSelf: 'flex-start',
                    }}
                  >
                    <Ionicons name="volume-medium" size={20} color={colors.primary} />
                  </TouchableOpacity>
                </View>
              </Card>
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    borderWidth: 1,
  },
  input: {
    flex: 1,
    fontSize: 15,
    marginLeft: 8,
    paddingVertical: 0,
  },
  content: {},
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
