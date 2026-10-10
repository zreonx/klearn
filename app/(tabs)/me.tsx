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
  Divider,
  useTheme,
} from '@/components/ui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useMe } from '@/features/me/useMe';
import { DailyGoalTarget } from '@/config';
import { ThemeMode } from '@/domain/settings/types';

export default function MeScreen() {
  const { colors, theme, themePreference, setThemePreference } = useTheme();
  const insets = useSafeAreaInsets();
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
  const themeOptions: Array<{ mode: ThemeMode; label: string; icon: keyof typeof Ionicons.glyphMap }> = [
    { mode: 'system', label: 'System', icon: 'phone-portrait-outline' },
    { mode: 'light', label: 'Light', icon: 'sunny-outline' },
    { mode: 'dark', label: 'Dark', icon: 'moon-outline' },
  ];

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
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={[
        styles.content,
        {
          paddingHorizontal: theme.spacing.lg,
          paddingTop: Math.max(insets.top + 12, theme.spacing.xl),
          paddingBottom: theme.spacing['6xl'],
        },
      ]}
    >
      <View style={{ marginBottom: theme.spacing.xl }}>
        <Typography variant="display" weight="700">
          Me
        </Typography>
        <Typography variant="caption" color="foregroundMuted">
          Progress statistics, daily goals, and appearance
        </Typography>
      </View>

      {/* Appearance Section (Section 4 & 9: Light & Dark Theme) */}
      <Typography variant="title" style={{ marginTop: theme.spacing.md, marginBottom: theme.spacing.md }}>
        Appearance
      </Typography>

      <Card style={{ padding: theme.spacing.lg, marginBottom: theme.spacing.lg }}>
        <Typography variant="body" weight="600">
          Theme Mode
        </Typography>
        <Typography variant="caption" color="foregroundMuted" style={{ marginTop: theme.spacing.xs, marginBottom: theme.spacing.md }}>
          Deep Jade + Warm Ivory (Light) or Muted Jade + Ink Charcoal (Dark).
        </Typography>

        <View style={styles.themeOptionsRow}>
          {themeOptions.map((opt) => {
            const isSelected = themePreference === opt.mode;
            return (
              <TouchableOpacity
                key={opt.mode}
                style={[
                  styles.themePill,
                  {
                    backgroundColor: isSelected ? colors.primary : colors.surfaceSubtle,
                    borderColor: isSelected ? colors.primary : colors.borderSubtle,
                    borderRadius: theme.radii.md,
                    paddingVertical: theme.spacing.sm,
                  },
                ]}
                onPress={() => setThemePreference(opt.mode)}
              >
                <Ionicons
                  name={opt.icon}
                  size={16}
                  color={isSelected ? colors.primaryForeground : colors.foreground}
                  style={{ marginBottom: 4 }}
                />
                <Typography
                  variant="label"
                  color={isSelected ? 'primaryForeground' : 'foreground'}
                >
                  {opt.label}
                </Typography>
              </TouchableOpacity>
            );
          })}
        </View>
      </Card>

      {/* Statistics Section (Section 23) */}
      <Typography variant="title" style={{ marginTop: theme.spacing.sm, marginBottom: theme.spacing.md }}>
        Learning Statistics
      </Typography>

      <View style={[styles.statsGrid, { gap: theme.spacing.md }]}>
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
      <Card elevated style={{ marginTop: theme.spacing.md, marginBottom: theme.spacing.lg }}>
        <View style={styles.rowBetween}>
          <View>
            <Typography variant="title">Streak Milestone</Typography>
            <Typography variant="caption" color="foregroundMuted">
              Current: {stats?.currentStreak ?? 0} days | Longest: {stats?.longestStreak ?? 0} days
            </Typography>
          </View>
          <Ionicons name="flame" size={28} color={colors.accent} />
        </View>
      </Card>

      {/* Settings Section */}
      <Typography variant="title" style={{ marginTop: theme.spacing.sm, marginBottom: theme.spacing.md }}>
        Daily Target & Habits
      </Typography>

      <Card style={{ padding: theme.spacing.lg, marginBottom: theme.spacing.lg }}>
        <Typography variant="body" weight="600">
          Daily Learning Goal
        </Typography>
        <Typography variant="caption" color="foregroundMuted" style={{ marginTop: theme.spacing.xs, marginBottom: theme.spacing.md }}>
          How many items you aim to learn or review every day.
        </Typography>

        <View style={[styles.goalPillsRow, { gap: theme.spacing.sm }]}>
          {goalOptions.map((opt) => {
            const isSelected = settings?.dailyGoal === opt;
            return (
              <TouchableOpacity
                key={opt}
                style={[
                  styles.goalPill,
                  {
                    backgroundColor: isSelected ? colors.primary : colors.surfaceSubtle,
                    borderColor: isSelected ? colors.primary : colors.borderSubtle,
                    borderRadius: theme.radii.md,
                    paddingVertical: theme.spacing.sm,
                  },
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

        <Divider style={{ marginVertical: theme.spacing.lg }} />

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
            trackColor={{ false: colors.surfaceSubtle, true: colors.primary }}
          />
        </View>

        <Divider style={{ marginVertical: theme.spacing.lg }} />

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
                {
                  backgroundColor: settings?.speech.rate === 0.75 ? colors.primary : colors.surfaceSubtle,
                  borderRadius: theme.radii.sm,
                  paddingHorizontal: theme.spacing.sm,
                  paddingVertical: theme.spacing.xs,
                },
              ]}
              onPress={() =>
                updateSettings({
                  speech: { autoPlay: false, rate: 0.75 },
                })
              }
            >
              <Typography
                variant="caption"
                color={settings?.speech.rate === 0.75 ? 'primaryForeground' : 'foreground'}
              >
                0.75x
              </Typography>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.speedPill,
                {
                  backgroundColor: settings?.speech.rate === 0.9 ? colors.primary : colors.surfaceSubtle,
                  borderRadius: theme.radii.sm,
                  paddingHorizontal: theme.spacing.sm,
                  paddingVertical: theme.spacing.xs,
                },
              ]}
              onPress={() =>
                updateSettings({
                  speech: { autoPlay: false, rate: 0.9 },
                })
              }
            >
              <Typography
                variant="caption"
                color={settings?.speech.rate === 0.9 ? 'primaryForeground' : 'foreground'}
              >
                0.9x
              </Typography>
            </TouchableOpacity>
          </View>
        </View>
      </Card>

      {/* Data Management Section (Section 27 & 52) */}
      <Typography variant="title" style={{ marginTop: theme.spacing.sm, marginBottom: theme.spacing.md }}>
        Data & Storage (Local-First)
      </Typography>

      <Card style={{ padding: theme.spacing.lg }}>
        <Typography variant="body" weight="600">
          Data Export & Backup
        </Typography>
        <Typography variant="caption" color="foregroundMuted" style={{ marginTop: theme.spacing.xs, marginBottom: theme.spacing.md }}>
          Export your complete learning history, spaced repetition schedules, and streak to JSON.
        </Typography>

        <Button
          title={exportJson ? 'Refresh Export JSON' : 'Export Learning Data'}
          variant="outline"
          onPress={handleExport}
        />

        {exportJson && (
          <View style={[styles.exportBox, { backgroundColor: colors.surfaceSubtle, padding: theme.spacing.md, borderRadius: theme.radii.md, marginTop: theme.spacing.md }]}>
            <Typography variant="caption" color="foregroundSubtle" numberOfLines={6}>
              {exportJson}
            </Typography>
          </View>
        )}

        <Divider style={{ marginVertical: theme.spacing.lg }} />

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
  },
  content: {},
  themeOptionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  themePill: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    padding: 14,
  },
  goalPillsRow: {
    flexDirection: 'row',
  },
  goalPill: {
    flex: 1,
    alignItems: 'center',
    borderWidth: 1.5,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingTextContainer: {
    flex: 1,
    marginRight: 16,
  },
  speedButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  speedPill: {},
  exportBox: {},
});
