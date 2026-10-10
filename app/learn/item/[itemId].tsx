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
} from '@/components/ui';
import { theme } from '@/components/ui/theme';
import { useLearn } from '@/features/learn/useLearn';
import { services } from '@/application/services';
import { LearningItem, LearningRecord } from '@/domain/learning/types';

export default function ItemDetailScreen() {
  const { itemId } = useLocalSearchParams<{ itemId: string }>();
  const router = useRouter();
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
      <View style={styles.centerContainer}>
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
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Card elevated style={styles.card}>
        <View style={styles.topRow}>
          <Badge label={item.type.replace('_', ' ').toUpperCase()} variant="vocab" />
          <TouchableOpacity
            onPress={() => speak(item.korean)}
            accessibilityLabel="Listen"
            style={styles.speakerBtn}
          >
            <Ionicons name="volume-medium" size={26} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.koreanBlock}>
          <Typography variant="display" weight="700" align="center" style={styles.koreanText}>
            {item.korean}
          </Typography>
          {item.romanization && (
            <Typography variant="bodyLarge" color="foregroundMuted" align="center">
              [{item.romanization}]
            </Typography>
          )}
        </View>

        <Divider style={styles.divider} />

        <Typography variant="heading" color="foreground" style={styles.translation}>
          {item.translation}
        </Typography>

        {item.explanation && (
          <Typography variant="body" color="foregroundMuted" style={styles.explanation}>
            {item.explanation}
          </Typography>
        )}

        {item.examples && item.examples.length > 0 && (
          <View style={styles.examplesContainer}>
            <Typography variant="title" style={styles.exampleTitle}>
              Examples
            </Typography>
            {item.examples.map((ex, idx) => (
              <View key={idx} style={styles.exampleItem}>
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
          <View style={styles.srsStatusBox}>
            <Typography variant="label" color="primary">
              Spaced Repetition Status
            </Typography>
            <Typography variant="caption" color="foregroundMuted" style={styles.srsText}>
              Status: {record.status} | Reviews: {record.reviewCount} | Correct streak: {record.streak}
            </Typography>
          </View>
        )}

        <Divider style={styles.divider} />

        {isLearned ? (
          <View style={styles.learnedStatus}>
            <Ionicons name="checkmark-circle" size={20} color={theme.colors.success} />
            <Typography variant="label" color="success" style={styles.learnedText}>
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
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing['5xl'],
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  card: {
    padding: theme.spacing.xl,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  speakerBtn: {
    padding: theme.spacing.xs,
  },
  koreanBlock: {
    alignItems: 'center',
    marginVertical: theme.spacing.lg,
  },
  koreanText: {
    fontSize: 54,
    marginBottom: theme.spacing.xs,
  },
  divider: {
    marginVertical: theme.spacing.lg,
  },
  translation: {
    marginBottom: theme.spacing.sm,
  },
  explanation: {
    marginBottom: theme.spacing.lg,
  },
  examplesContainer: {
    marginTop: theme.spacing.md,
    backgroundColor: theme.colors.surfaceSubtle,
    padding: theme.spacing.lg,
    borderRadius: theme.radii.md,
  },
  exampleTitle: {
    marginBottom: theme.spacing.sm,
  },
  exampleItem: {
    marginBottom: theme.spacing.sm,
  },
  srsStatusBox: {
    marginTop: theme.spacing.lg,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surfaceSubtle,
    borderRadius: theme.radii.md,
  },
  srsText: {
    marginTop: 4,
  },
  learnedStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.sm,
  },
  learnedText: {
    marginLeft: theme.spacing.xs,
  },
});
