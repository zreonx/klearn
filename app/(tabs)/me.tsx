import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Switch,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  Typography,
  Card,
  Button,
  Badge,
  Divider,
} from '@/components/ui';
import { theme } from '@/components/ui/theme';
import { useMe } from '@/features/me/useMe';
import { DailyGoalTarget } from '@/config';

export default function MeScreen() {
  const {
    stats,
    settings,
    loading,
    updateSettings,
    exportData,
    resetData,
  } = useMe();

  const [exportJson, setExportJson] = useState<string | null>(null);

  const goalOptions: DailyGoalTarget[] = [5, 10, 15, 20];

  const handleToggleReminder = async (enabled: boolean) => {
    if (!settings) return;
    await updateSettings({
      reminder: {
        ...settings.reminder,
        enabled,
      },
    });
  };

  const handleExport = async () => {
    const json = await exportData();
    setExportJson(json);
  };

  const handleReset = () => {
    Alert.alert(
      'Reset All Progress',
      'Are you sure you want to delete all learning records and reset your streak? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset Everything',
          style: 'destructive',
          onPress: async () => {
            await resetData();
            setExportJson(null);
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Typography variant="display" weight="700">
          Me
        </Typography>
        <Typography variant="caption" color="foregroundMuted">
          Progress statistics, daily goals, and settings
        </Typography>
      </View>

      {/* Statistics Section (Section 23) */}
      <Typography variant="title" style={styles.sectionTitle}>
        Learning Statistics
      </Typography>

      <View style={styles.statsGrid}>
        <Card style={styles.statCard}>
          <Typography variant="caption" color="foregroundMuted">
            Items Learned
          </Typography>
          <Typography variant="heading" color="primary">
            {stats?.totalItemsLearned ?? 0}
          </Typography>
        </Card>

        <Card style={styles.statCard}>
          <Typography variant="caption" color="foregroundMuted">
            Mastered (SRS)
          </Typography>
          <Typography variant="heading" color="success">
            {stats?.totalMastered ?? 0}
          </Typography>
        </Card>

        <Card style={styles.statCard}>
          <Typography variant="caption" color="foregroundMuted">
            Reviews Done
          </Typography>
          <Typography variant="heading">
            {stats?.totalReviewsDone ?? 0}
          </Typography>
        </Card>

        <Card style={styles.statCard}>
          <Typography variant="caption" color="foregroundMuted">
            Active Days
          </Typography>
          <Typography variant="heading">
            {stats?.activeLearningDays ?? 0}
          </Typography>
        </Card>
      </View>

      {/* Streak Info */}
      <Card elevated style={styles.streakCard}>
        <View style={styles.rowBetween}>
          <View>
            <Typography variant="title">Streak Milestone</Typography>
            <Typography variant="caption" color="foregroundMuted">
              Current: {stats?.currentStreak ?? 0} days | Longest: {stats?.longestStreak ?? 0} days
            </Typography>
          </View>
          <Ionicons name="flame" size={28} color="#F97316" />
        </View>
      </Card>

      {/* Settings Section */}
      <Typography variant="title" style={styles.sectionTitle}>
        Daily Target & Habits
      </Typography>

      <Card style={styles.settingsCard}>
        <Typography variant="body" weight="600">
          Daily Learning Goal
        </Typography>
        <Typography variant="caption" color="foregroundMuted" style={styles.settingDesc}>
          How many items you aim to learn or review every day.
        </Typography>

        <View style={styles.goalPillsRow}>
          {goalOptions.map((opt) => {
            const isSelected = settings?.dailyGoal === opt;
            return (
              <TouchableOpacity
                key={opt}
                style={[
                  styles.goalPill,
                  isSelected && styles.goalPillSelected,
                ]}
                onPress={() => updateSettings({ dailyGoal: opt })}
              >
                <Typography
                  variant="label"
                  color={isSelected ? 'primaryForeground' : 'foreground'}
                >
                  {opt} items
                </Typography>
              </TouchableOpacity>
            );
          })}
        </View>

        <Divider style={styles.divider} />

        {/* Daily Reminder */}
        <View style={styles.rowBetween}>
          <View style={styles.settingTextContainer}>
            <Typography variant="body" weight="600">
              Daily Study Reminder
            </Typography>
            <Typography variant="caption" color="foregroundMuted">
              Receive a quiet local notification every evening (8:00 PM)
            </Typography>
          </View>
          <Switch
            value={settings?.reminder.enabled ?? false}
            onValueChange={handleToggleReminder}
            trackColor={{ false: theme.colors.surfaceElevated, true: theme.colors.primary }}
          />
        </View>

        <Divider style={styles.divider} />

        {/* Speech Rate */}
        <View style={styles.rowBetween}>
          <View style={styles.settingTextContainer}>
            <Typography variant="body" weight="600">
              Audio Pronunciation Speed
            </Typography>
            <Typography variant="caption" color="foregroundMuted">
              Current speech rate: {settings?.speech.rate ?? 0.9}x
            </Typography>
          </View>
          <View style={styles.speedButtons}>
            <TouchableOpacity
              style={[
                styles.speedPill,
                settings?.speech.rate === 0.75 && styles.speedPillSelected,
              ]}
              onPress={() =>
                updateSettings({
                  speech: { autoPlay: false, rate: 0.75 },
                })
              }
            >
              <Typography variant="caption">0.75x</Typography>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.speedPill,
                settings?.speech.rate === 0.9 && styles.speedPillSelected,
              ]}
              onPress={() =>
                updateSettings({
                  speech: { autoPlay: false, rate: 0.9 },
                })
              }
            >
              <Typography variant="caption">0.9x</Typography>
            </TouchableOpacity>
          </View>
        </View>
      </Card>

      {/* Data Management Section (Section 27 & 52) */}
      <Typography variant="title" style={styles.sectionTitle}>
        Data & Storage (Local-First)
      </Typography>

      <Card style={styles.dataCard}>
        <Typography variant="body" weight="600">
          Data Export & Backup
        </Typography>
        <Typography variant="caption" color="foregroundMuted" style={styles.settingDesc}>
          Export your complete learning history, spaced repetition schedules, and streak to JSON.
        </Typography>

        <Button
          title={exportJson ? 'Refresh Export JSON' : 'Export Learning Data'}
          variant="outline"
          onPress={handleExport}
        />

        {exportJson && (
          <View style={styles.exportBox}>
            <Typography variant="caption" color="foregroundSubtle" numberOfLines={6}>
              {exportJson}
            </Typography>
          </View>
        )}

        <Divider style={styles.divider} />

        <Button
          title="Reset All Progress"
          variant="destructive"
          onPress={handleReset}
        />
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
    paddingBottom: theme.spacing['6xl'],
  },
  header: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    padding: theme.spacing.md,
  },
  streakCard: {
    marginTop: theme.spacing.md,
  },
  settingsCard: {
    padding: theme.spacing.lg,
  },
  settingDesc: {
    marginTop: theme.spacing.xs,
    marginBottom: theme.spacing.md,
  },
  goalPillsRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  goalPill: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.surfaceElevated,
    borderRadius: theme.radii.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
  },
  goalPillSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingTextContainer: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  speedButtons: {
    flexDirection: 'row',
    gap: theme.spacing.xs,
  },
  speedPill: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radii.sm,
    backgroundColor: theme.colors.surfaceElevated,
  },
  speedPillSelected: {
    backgroundColor: theme.colors.primaryMuted,
  },
  divider: {
    marginVertical: theme.spacing.lg,
  },
  dataCard: {
    padding: theme.spacing.lg,
  },
  exportBox: {
    marginTop: theme.spacing.md,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surfaceSubtle,
    borderRadius: theme.radii.md,
  },
});
