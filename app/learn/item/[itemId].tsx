import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  Typography,
  Card,
  Button,
  Badge,
  Divider,
  useTheme,
} from '@/components/ui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLearn } from '@/features/learn/useLearn';
import { services } from '@/application/services';
import { LearningItem, LearningRecord } from '@/domain/learning/types';

export default function ItemDetailScreen() {
  const { itemId } = useLocalSearchParams<{ itemId: string }>();
  const router = useRouter();
  const { colors, theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { markItemLearned, speak, recordsMap } = useLearn();

  const [item, setItem] = useState<LearningItem | null>(null);

  useEffect(() => {
    if (itemId) {
      const found = services.catalog.getItemById(itemId);
      if (found) setItem(found);
    }
  }, [itemId]);

  if (!item) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.background }]}>
        <Typography variant="body" color="foregroundMuted">
          Item not found.
        </Typography>
        <Button title="Back" variant="outline" onPress={() => router.back()} style={{ marginTop: 16 }} />
      </View>
    );
  }

  const record: LearningRecord | undefined = recordsMap.get(item.id);
  const isLearned = record && record.status !== 'unseen';

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={[
        styles.content,
        {
          padding: theme.spacing.lg,
          paddingBottom: Math.max(insets.bottom + 16, theme.spacing['4xl']),
        },
      ]}
    >
      <Card elevated style={{ padding: theme.spacing.xl }}>
        <View style={[styles.topRow, { marginBottom: theme.spacing.lg }]}>
          <Badge label={item.type.replace('_', ' ').toUpperCase()} variant="vocab" />
          <TouchableOpacity
            onPress={() => speak(item.korean)}
            accessibilityLabel="Listen"
            style={{ padding: theme.spacing.xs }}
          >
            <Ionicons name="volume-medium" size={26} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <View style={[styles.koreanBlock, { marginVertical: theme.spacing.lg }]}>
          <Typography variant="display" weight="700" align="center" style={styles.koreanText}>
            {item.korean}
          </Typography>
          {item.romanization && (
            <Typography variant="bodyLarge" color="foregroundMuted" align="center">
              [{item.romanization}]
            </Typography>
          )}
        </View>

        <Divider style={{ marginVertical: theme.spacing.lg }} />

        <Typography variant="heading" color="foreground" style={{ marginBottom: theme.spacing.sm }}>
          {item.translation}
        </Typography>

        {item.explanation && (
          <Typography variant="body" color="foregroundMuted" style={{ marginBottom: theme.spacing.lg }}>
            {item.explanation}
          </Typography>
        )}

        {item.examples && item.examples.length > 0 && (
          <View style={[styles.examplesContainer, { backgroundColor: colors.surfaceSubtle, padding: theme.spacing.lg, borderRadius: theme.radii.md, marginTop: theme.spacing.md }]}>
            <Typography variant="title" style={{ marginBottom: theme.spacing.sm }}>
              Examples
            </Typography>
            {item.examples.map((ex, idx) => (
              <View key={idx} style={{ marginBottom: theme.spacing.sm }}>
                <Typography variant="bodyLarge" weight="600">
                  {ex.korean}
                </Typography>
                {ex.romanization && (
                  <Typography variant="caption" color="foregroundMuted">
                    {ex.romanization}
                  </Typography>
                )}
                <Typography variant="body" color="foreground">
                  {ex.translation}
                </Typography>
              </View>
            ))}
          </View>
        )}

        {/* SRS Status */}
        {record && (
          <View style={[styles.srsStatusBox, { backgroundColor: colors.surfaceSubtle, padding: theme.spacing.md, borderRadius: theme.radii.md, marginTop: theme.spacing.lg }]}>
            <Typography variant="label" color="primary">
              Spaced Repetition Status
            </Typography>
            <Typography variant="caption" color="foregroundMuted" style={{ marginTop: 4 }}>
              Status: {record.status} | Reviews: {record.reviewCount} | Correct streak: {record.streak}
            </Typography>
          </View>
        )}

        <Divider style={{ marginVertical: theme.spacing.lg }} />

        {isLearned ? (
          <View style={styles.learnedStatus}>
            <Ionicons name="checkmark-circle" size={20} color={colors.success} />
            <Typography variant="label" color="success" style={{ marginLeft: theme.spacing.xs }}>
              Learned and active in review schedule
            </Typography>
          </View>
        ) : (
          <Button
            title="Mark as Learned"
            fullWidth
            onPress={() => markItemLearned(item.id)}
          />
        )}
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {},
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  koreanBlock: {
    alignItems: 'center',
  },
  koreanText: {
    fontSize: 54,
    marginBottom: 4,
  },
  examplesContainer: {},
  srsStatusBox: {},
  learnedStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
});
