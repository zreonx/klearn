import React from 'react';
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
import { CULTURAL_STORIES } from '@/content/reading/stories';
import { hapticService } from '@/infrastructure/haptics/hapticService';

export default function ReadingHubScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, theme } = useTheme();

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
            Cultural Micro-Stories
          </Typography>
          <Typography variant="caption" color="foregroundMuted">
            짧은 한국어 읽기 • Everyday Seoul Life
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
        {/* Intro Card */}
        <Card elevated style={{ padding: theme.spacing.lg, marginTop: theme.spacing.md, marginBottom: theme.spacing.lg }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <Ionicons name="book-outline" size={18} color={colors.primary} />
            <Typography variant="label" weight="700" color="primary">
              Gentle Reading Comprehension
            </Typography>
          </View>
          <Typography variant="caption" color="foregroundMuted">
            Read authentic, bite-sized 3-4 sentence stories with inline audio, vocabulary annotations, and a quick cultural comprehension check.
          </Typography>
        </Card>

        {/* Stories List */}
        <Typography variant="label" weight="700" style={{ marginBottom: theme.spacing.sm }}>
          Available Cultural Stories ({CULTURAL_STORIES.length}):
        </Typography>

        <View style={{ gap: theme.spacing.md }}>
          {CULTURAL_STORIES.map((story) => (
            <TouchableOpacity
              key={story.id}
              activeOpacity={0.8}
              onPress={() => {
                hapticService.lightTick();
                router.push(`/reading/${story.id}` as any);
              }}
            >
              <Card elevated style={{ padding: theme.spacing.lg }}>
                <View style={styles.cardHeaderRow}>
                  <View
                    style={[
                      styles.iconCircle,
                      {
                        backgroundColor: colors.surfaceSubtle,
                        borderRadius: theme.radii.full,
                      },
                    ]}
                  >
                    <Ionicons name={story.coverIcon as any} size={24} color={colors.primary} />
                  </View>

                  <View style={{ flex: 1, marginLeft: 12, marginRight: 8 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <Typography variant="title" weight="700" color="foreground">
                        {story.titleKorean}
                      </Typography>
                    </View>
                    <Typography variant="caption" color="foregroundMuted" style={{ marginTop: 1 }}>
                      {story.titleEnglish}
                    </Typography>
                  </View>

                  <Badge label={story.levelTag} variant="vocab" />
                </View>

                <Typography variant="caption" color="foregroundSubtle" numberOfLines={2} style={{ marginTop: theme.spacing.sm }}>
                  {story.culturalNote}
                </Typography>

                <View
                  style={[
                    styles.cardFooter,
                    {
                      borderTopColor: colors.borderSubtle,
                      marginTop: theme.spacing.md,
                      paddingTop: theme.spacing.sm,
                    },
                  ]}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Ionicons name="time-outline" size={14} color={colors.foregroundSubtle} />
                    <Typography variant="caption" color="foregroundMuted">
                      {story.sentences.length} sentences • ~2 min read
                    </Typography>
                  </View>

                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                    <Typography variant="caption" weight="700" color="primary">
                      Read Story
                    </Typography>
                    <Ionicons name="chevron-forward" size={14} color={colors.primary} />
                  </View>
                </View>
              </Card>
            </TouchableOpacity>
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
  },
  iconCircle: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
  },
});
