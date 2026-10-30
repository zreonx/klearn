import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Switch,
  Alert,
  TouchableOpacity,
  TextInput,
  Linking,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
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
import { useMe } from '@/features/me/useMe';
import { DailyGoalTarget } from '@/config';
import { ThemeMode, AIProvider, REMINDER_PRESETS, ReminderPreset } from '@/domain/settings/types';

export default function MeScreen() {
  const { colors, theme, themePreference, setThemePreference } = useTheme();
  const insets = useSafeAreaInsets();
  const {
    stats,
    settings,
    loading,
    todaySentence,
    updateSettings,
    sendTestNotification,
    exportData,
    importData,
    resetData,
  } = useMe();

  const [exportJson, setExportJson] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [importJsonInput, setImportJsonInput] = useState<string>('');
  const [showImportBox, setShowImportBox] = useState<boolean>(false);
  const [isTestingNotification, setIsTestingNotification] = useState<boolean>(false);

  // AI Tutor Settings state
  const [selectedAIProvider, setSelectedAIProvider] = useState<AIProvider>(
    settings?.aiTutor?.provider || 'offline'
  );
  const [aiApiKeyInput, setAiApiKeyInput] = useState<string>(settings?.aiTutor?.apiKey || '');
  const [showApiKey, setShowApiKey] = useState<boolean>(false);
  const [isAiSaved, setIsAiSaved] = useState<boolean>(false);

  // Synchronize AI settings when loaded
  React.useEffect(() => {
    if (settings?.aiTutor) {
      setSelectedAIProvider(settings.aiTutor.provider);
      setAiApiKeyInput(settings.aiTutor.apiKey || '');
    }
  }, [settings?.aiTutor]);

  const handleSaveAISettings = async () => {
    await updateSettings({
      aiTutor: {
        provider: selectedAIProvider,
        apiKey: aiApiKeyInput.trim() || undefined,
      },
    });
    setIsAiSaved(true);
    Alert.alert(
      'AI Tutor Settings Saved',
      selectedAIProvider === 'offline'
        ? 'Using built-in offline Korean dialogue & politeness coach.'
        : `Connected to ${
            selectedAIProvider === 'groq'
              ? 'Groq Cloud'
              : selectedAIProvider === 'openrouter'
              ? 'OpenRouter'
              : selectedAIProvider === 'gemini'
              ? 'Google Gemini'
              : 'DeepSeek'
          } AI Tutor!`
    );
    setTimeout(() => setIsAiSaved(false), 3000);
  };

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
    if (enabled) {
      const activeHour = String(settings.reminder.hour).padStart(2, '0');
      const activeMin = String(settings.reminder.minute).padStart(2, '0');
      Alert.alert(
        'Daily Reminder Enabled 🔔',
        `You will receive a daily Korean study & sentence reminder every day at ${activeHour}:${activeMin}.`
      );
    }
  };

  const handleSelectReminderPreset = async (preset: ReminderPreset) => {
    await updateSettings({
      reminder: {
        enabled: true,
        hour: preset.hour,
        minute: preset.minute,
      },
    });
    Alert.alert(
      'Daily Reminder Set ⏰',
      `Your daily Korean reminder is scheduled for ${preset.sublabel} (${preset.label}).`
    );
  };

  const handleSendTestNotification = async () => {
    try {
      setIsTestingNotification(true);
      const result = await sendTestNotification();
      if (result.success) {
        if (result.isSimulated) {
          Alert.alert(
            '🔔 Daily Reminder Preview',
            `Title: ${result.preview.title}\n\nBody: ${result.preview.body}\n\n💡 Note: In standalone Android builds, this notification appears in your system notification drawer with sound and vibration.`,
            [{ text: 'Got it!' }]
          );
        } else {
          Alert.alert(
            '🔔 Notification Delivered!',
            `Check your device notification tray to see your daily Korean study alert:\n\n"${result.preview.body}"`,
            [{ text: 'Awesome' }]
          );
        }
      } else {
        Alert.alert('Notification Permission', result.message);
      }
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Failed to send test notification.');
    } finally {
      setIsTestingNotification(false);
    }
  };

  const handleExport = async () => {
    const json = await exportData();
    setExportJson(json);
    setCopied(false);
  };

  const handleCopyJson = async () => {
    if (!exportJson) return;
    await Clipboard.setStringAsync(exportJson);
    setCopied(true);
    Alert.alert('Copied to Clipboard!', 'Your full backup data has been copied. You can now paste and save it safely anywhere (e.g. Notes or Email).');
    setTimeout(() => setCopied(false), 3000);
  };

  const handleImport = async () => {
    if (!importJsonInput.trim()) {
      Alert.alert('Empty Input', 'Please paste valid JSON data to restore your progress.');
      return;
    }

    try {
      const res = await importData(importJsonInput.trim());
      if (res.success) {
        Alert.alert('Success', 'Learning progress and settings restored successfully!');
        setImportJsonInput('');
        setShowImportBox(false);
      } else {
        Alert.alert('Import Failed', res.error ?? 'Invalid format.');
      }
    } catch (e: any) {
      Alert.alert('Import Error', e?.message ?? 'Malformed JSON.');
    }
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
        <Typography variant="body" weight="600" style={{ marginBottom: theme.spacing.md }}>
          Theme Mode
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

      {/* SRS Mastery Distribution & 7-Day Review Forecast */}
      {stats?.masteryDistribution && (
        <Card style={{ padding: theme.spacing.lg, marginBottom: theme.spacing.lg }}>
          <View style={[styles.rowBetween, { marginBottom: theme.spacing.xs }]}>
            <Typography variant="body" weight="700">
              SRS Mastery Distribution
            </Typography>
            <Badge
              label={`${stats.totalItemsLearned} / ${stats.masteryDistribution.totalCatalog} seen`}
              variant="vocab"
            />
          </View>
          <Typography variant="caption" color="foregroundMuted" style={{ marginBottom: theme.spacing.md }}>
            Breakdown of curriculum items across Spaced Repetition retention tiers.
          </Typography>

          {/* Stacked Progress Bar */}
          <View
            style={{
              flexDirection: 'row',
              height: 12,
              borderRadius: theme.radii.full,
              overflow: 'hidden',
              backgroundColor: colors.surfaceSubtle,
              marginBottom: theme.spacing.md,
            }}
          >
            {stats.masteryDistribution.mastered > 0 && (
              <View
                style={{
                  flex: stats.masteryDistribution.mastered,
                  backgroundColor: colors.success,
                }}
              />
            )}
            {stats.masteryDistribution.reviewing > 0 && (
              <View
                style={{
                  flex: stats.masteryDistribution.reviewing,
                  backgroundColor: colors.primary,
                }}
              />
            )}
            {stats.masteryDistribution.learning > 0 && (
              <View
                style={{
                  flex: stats.masteryDistribution.learning,
                  backgroundColor: colors.accent,
                }}
              />
            )}
            {stats.masteryDistribution.unseen > 0 && (
              <View
                style={{
                  flex: stats.masteryDistribution.unseen,
                  backgroundColor: colors.borderSubtle,
                }}
              />
            )}
          </View>

          {/* Legend Row */}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.success, marginRight: 6 }} />
              <Typography variant="caption" color="foregroundMuted">
                Mastered ({stats.masteryDistribution.mastered})
              </Typography>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary, marginRight: 6 }} />
              <Typography variant="caption" color="foregroundMuted">
                Reviewing ({stats.masteryDistribution.reviewing})
              </Typography>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.accent, marginRight: 6 }} />
              <Typography variant="caption" color="foregroundMuted">
                Learning ({stats.masteryDistribution.learning})
              </Typography>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.borderSubtle, marginRight: 6 }} />
              <Typography variant="caption" color="foregroundMuted">
                Unseen ({stats.masteryDistribution.unseen})
              </Typography>
            </View>
          </View>

          {/* 7-Day Review Forecast */}
          {stats.reviewForecast && stats.reviewForecast.length > 0 && (
            <>
              <Divider style={{ marginVertical: theme.spacing.lg }} />
              <Typography variant="body" weight="700" style={{ marginBottom: 4 }}>
                7-Day SRS Review Forecast
              </Typography>
              <Typography variant="caption" color="foregroundMuted" style={{ marginBottom: theme.spacing.md }}>
                Upcoming flashcards scheduled by your SM-2 retention intervals.
              </Typography>

              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 96, paddingTop: 16 }}>
                {(() => {
                  const maxDue = Math.max(5, ...stats.reviewForecast.map((d) => d.dueCount));
                  return stats.reviewForecast.map((day, idx) => {
                    const barHeight = Math.max(6, Math.round((day.dueCount / maxDue) * 52));
                    const isToday = idx === 0;
                    return (
                      <View key={day.dateKey} style={{ flex: 1, alignItems: 'center' }}>
                        <Typography
                          variant="caption"
                          weight={day.dueCount > 0 ? '700' : '400'}
                          color={isToday && day.dueCount > 0 ? 'accent' : 'foregroundMuted'}
                          style={{ fontSize: 11, marginBottom: 4 }}
                        >
                          {day.dueCount}
                        </Typography>
                        <View
                          style={{
                            width: 18,
                            height: barHeight,
                            borderRadius: theme.radii.sm,
                            backgroundColor:
                              day.dueCount === 0
                                ? colors.surfaceSubtle
                                : isToday
                                ? colors.accent
                                : colors.primary,
                          }}
                        />
                        <Typography
                          variant="caption"
                          weight={isToday ? '700' : '500'}
                          color={isToday ? 'foreground' : 'foregroundSubtle'}
                          style={{ fontSize: 11, marginTop: 6 }}
                        >
                          {day.label}
                        </Typography>
                      </View>
                    );
                  });
                })()}
              </View>
            </>
          )}
        </Card>
      )}

      {/* 6-Skill Proficiency Breakdown */}
      {stats?.learnerProfile && (
        <Card style={{ padding: theme.spacing.lg, marginBottom: theme.spacing.lg }}>
          <View style={[styles.rowBetween, { marginBottom: 4 }]}>
            <Typography variant="body" weight="700">
              6-Skill Proficiency Profile
            </Typography>
            <Badge label={stats.learnerProfile.stageName} variant="hangul" />
          </View>
          <Typography variant="caption" color="foregroundMuted" style={{ marginBottom: theme.spacing.md }}>
            {stats.learnerProfile.stageOutcome} • Fluency Score: {stats.learnerProfile.overallFluencyScore}%
          </Typography>

          <View style={{ gap: 12 }}>
            {Object.values(stats.learnerProfile.skills).map((skillItem) => (
              <View key={skillItem.skill}>
                <View style={[styles.rowBetween, { marginBottom: 4 }]}>
                  <Typography variant="caption" weight="600" color="foreground">
                    {skillItem.label} ({skillItem.koreanLabel})
                  </Typography>
                  <Typography variant="caption" weight="700" color={skillItem.isWeakArea ? 'accent' : 'primary'}>
                    {skillItem.score}%
                  </Typography>
                </View>
                <View
                  style={{
                    height: 8,
                    borderRadius: theme.radii.full,
                    backgroundColor: colors.surfaceSubtle,
                    overflow: 'hidden',
                  }}
                >
                  <View
                    style={{
                      width: `${Math.max(4, skillItem.score)}%`,
                      height: '100%',
                      borderRadius: theme.radii.full,
                      backgroundColor: skillItem.isWeakArea ? colors.accent : colors.primary,
                    }}
                  />
                </View>
              </View>
            ))}
          </View>
        </Card>
      )}

      {/* Milestone Achievements & Badges */}
      {stats?.achievements && (
        <Card style={{ padding: theme.spacing.lg, marginBottom: theme.spacing.lg }}>
          <View style={[styles.rowBetween, { marginBottom: 4 }]}>
            <Typography variant="body" weight="700">
              Milestone Badges (학습 업적)
            </Typography>
            <Badge
              label={`${stats.achievements.filter((a) => a.isUnlocked).length} / ${stats.achievements.length} unlocked`}
              variant="hangul"
            />
          </View>
          <Typography variant="caption" color="foregroundMuted" style={{ marginBottom: theme.spacing.md }}>
            Earn badges by building your streak, mastering Hangul, and completing reviews.
          </Typography>

          <View style={{ gap: 10 }}>
            {stats.achievements.map((ach) => (
              <View
                key={ach.id}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: theme.spacing.md,
                  borderRadius: theme.radii.md,
                  backgroundColor: ach.isUnlocked ? colors.surfaceSubtle : colors.surface,
                  borderColor: ach.isUnlocked ? colors.primary : colors.borderSubtle,
                  borderWidth: 1,
                  opacity: ach.isUnlocked ? 1 : 0.65,
                }}
              >
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: ach.isUnlocked ? colors.primary : colors.surfaceSubtle,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 12,
                  }}
                >
                  <Ionicons
                    name={ach.icon as any}
                    size={20}
                    color={ach.isUnlocked ? colors.primaryForeground : colors.foregroundSubtle}
                  />
                </View>

                <View style={{ flex: 1, marginRight: 8 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Typography variant="label" weight="700" color="foreground">
                      {ach.koreanTitle}
                    </Typography>
                    <Typography variant="caption" color="foregroundMuted">
                      ({ach.title})
                    </Typography>
                  </View>
                  <Typography variant="caption" color="foregroundSubtle" style={{ marginTop: 2 }}>
                    {ach.description}
                  </Typography>
                </View>

                <Badge
                  label={ach.isUnlocked ? 'Completed' : ach.progressText}
                  variant={ach.isUnlocked ? 'vocab' : 'default'}
                />
              </View>
            ))}
          </View>
        </Card>
      )}

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

        {/* Daily Study Reminder */}
        <View>
          <View style={styles.rowBetween}>
            <View style={styles.settingTextContainer}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Ionicons name="notifications-outline" size={18} color={colors.primary} />
                <Typography variant="body" weight="600">
                  Daily Study Reminder
                </Typography>
              </View>
              <Typography variant="caption" color="foregroundMuted" style={{ marginTop: 2 }}>
                {settings?.reminder.enabled
                  ? `Scheduled daily at ${String(settings.reminder.hour).padStart(2, '0')}:${String(settings.reminder.minute).padStart(2, '0')} with today's Korean sentence & streak alert`
                  : 'Receive a daily prompt with today\'s Korean sentence & review reminder'}
              </Typography>
            </View>
            <Switch
              value={settings?.reminder.enabled ?? false}
              onValueChange={handleToggleReminder}
              trackColor={{ false: colors.surfaceSubtle, true: colors.primary }}
            />
          </View>

          {/* Time Presets Row */}
          <View style={{ marginTop: theme.spacing.md }}>
            <Typography variant="caption" color="foregroundSubtle" style={{ marginBottom: theme.spacing.xs }}>
              Preferred Daily Study Time:
            </Typography>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: theme.spacing.xs, paddingVertical: 2 }}
            >
              {REMINDER_PRESETS.map((preset) => {
                const isSelected =
                  settings?.reminder.enabled &&
                  settings?.reminder.hour === preset.hour &&
                  settings?.reminder.minute === preset.minute;

                return (
                  <TouchableOpacity
                    key={preset.id}
                    onPress={() => handleSelectReminderPreset(preset)}
                    style={[
                      styles.reminderPill,
                      {
                        backgroundColor: isSelected ? colors.primary : colors.surfaceSubtle,
                        borderColor: isSelected ? colors.primary : colors.borderSubtle,
                        borderRadius: theme.radii.md,
                        paddingHorizontal: theme.spacing.md,
                        paddingVertical: theme.spacing.sm,
                      },
                    ]}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                      <Ionicons
                        name={preset.icon as any}
                        size={14}
                        color={isSelected ? colors.primaryForeground : colors.foregroundMuted}
                      />
                      <Typography
                        variant="caption"
                        weight="600"
                        color={isSelected ? 'primaryForeground' : 'foreground'}
                      >
                        {preset.label}
                      </Typography>
                    </View>
                    <Typography
                      variant="caption"
                      color={isSelected ? 'primaryForeground' : 'foregroundMuted'}
                      style={{ fontSize: 10, marginTop: 1 }}
                    >
                      {preset.sublabel}
                    </Typography>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Today's Notification Preview & Test Button */}
          <View
            style={[
              styles.notificationTestBox,
              {
                backgroundColor: colors.surfaceSubtle,
                borderColor: colors.borderSubtle,
                borderRadius: theme.radii.md,
                padding: theme.spacing.md,
                marginTop: theme.spacing.md,
              },
            ]}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <Typography variant="caption" weight="600" color="foreground">
                  Today's Sentence Notification
                </Typography>
                <Typography variant="caption" color="foregroundMuted" numberOfLines={2} style={{ marginTop: 2 }}>
                  "{todaySentence?.korean}" — {todaySentence?.translation}
                </Typography>
              </View>
              <Button
                variant="outline"
                size="sm"
                title={isTestingNotification ? 'Sending...' : 'Test Alert'}
                onPress={handleSendTestNotification}
                disabled={isTestingNotification}
              />
            </View>
          </View>
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

      {/* AI Conversation & Tutor Settings */}
      <Typography variant="title" style={{ marginTop: theme.spacing.sm, marginBottom: theme.spacing.md }}>
        AI Conversation & Tutor
      </Typography>

      <Card style={{ padding: theme.spacing.lg, marginBottom: theme.spacing.lg }}>
        <Typography variant="body" weight="600">
          Conversation Provider
        </Typography>
        <Typography variant="caption" color="foregroundMuted" style={{ marginTop: theme.spacing.xs, marginBottom: theme.spacing.md }}>
          Klearn is 100% offline by default. You can optionally connect Google Gemini or DeepSeek for open-ended conversational replies.
        </Typography>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: theme.spacing.md }}>
          {(
            [
              { id: 'offline', label: 'Offline (Default)' },
              { id: 'groq', label: 'Groq (Free & Fast)' },
              { id: 'openrouter', label: 'OpenRouter (Free)' },
              { id: 'gemini', label: 'Gemini' },
              { id: 'deepseek', label: 'DeepSeek' },
            ] as const
          ).map((item) => {
            const isSelected = selectedAIProvider === item.id;
            return (
              <TouchableOpacity
                key={item.id}
                onPress={() => setSelectedAIProvider(item.id)}
                style={{
                  paddingHorizontal: theme.spacing.md,
                  paddingVertical: theme.spacing.xs + 2,
                  borderRadius: theme.radii.md,
                  borderWidth: 1.5,
                  backgroundColor: isSelected ? colors.primary : colors.surfaceSubtle,
                  borderColor: isSelected ? colors.primary : colors.borderSubtle,
                }}
              >
                <Typography
                  variant="caption"
                  weight="700"
                  color={isSelected ? 'primaryForeground' : 'foreground'}
                >
                  {item.label}
                </Typography>
              </TouchableOpacity>
            );
          })}
        </View>

        {selectedAIProvider !== 'offline' && (
          <View style={{ marginTop: 4 }}>
            <Typography variant="caption" weight="600" color="foreground" style={{ marginBottom: 4 }}>
              {selectedAIProvider === 'groq'
                ? 'Groq Cloud API Key (Free, No Card Required):'
                : selectedAIProvider === 'openrouter'
                ? 'OpenRouter API Key (Free, No Card Required):'
                : selectedAIProvider === 'gemini'
                ? 'Google AI Studio API Key:'
                : 'DeepSeek API Key:'}
            </Typography>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TextInput
                value={aiApiKeyInput}
                onChangeText={setAiApiKeyInput}
                placeholder={
                  selectedAIProvider === 'groq'
                    ? 'gsk_...'
                    : selectedAIProvider === 'openrouter'
                    ? 'sk-or-v1-...'
                    : selectedAIProvider === 'gemini'
                    ? 'AIzaSy...'
                    : 'sk-...'
                }
                placeholderTextColor={colors.foregroundSubtle}
                secureTextEntry={!showApiKey}
                autoCapitalize="none"
                autoCorrect={false}
                style={{
                  flex: 1,
                  height: 42,
                  backgroundColor: colors.surfaceSubtle,
                  borderColor: colors.borderSubtle,
                  borderWidth: 1,
                  borderRadius: theme.radii.md,
                  paddingHorizontal: theme.spacing.md,
                  color: colors.foreground,
                  fontSize: 13,
                }}
              />
              <TouchableOpacity
                onPress={() => setShowApiKey(!showApiKey)}
                style={{
                  padding: 10,
                  marginLeft: 6,
                  backgroundColor: colors.surfaceSubtle,
                  borderColor: colors.borderSubtle,
                  borderWidth: 1,
                  borderRadius: theme.radii.md,
                }}
              >
                <Ionicons
                  name={showApiKey ? 'eye-off-outline' : 'eye-outline'}
                  size={18}
                  color={colors.foreground}
                />
              </TouchableOpacity>
            </View>

            <Typography variant="caption" color="foregroundMuted" style={{ fontSize: 11, marginTop: 4 }}>
              {selectedAIProvider === 'groq'
                ? 'Get your 100% free key from console.groq.com/keys. High-speed Llama 3.3 70B Korean, no card needed.'
                : selectedAIProvider === 'openrouter'
                ? 'Get your 100% free key from openrouter.ai/keys. Free access to top models globally.'
                : selectedAIProvider === 'gemini'
                ? 'Get a key from aistudio.google.com/app/apikey. Stored locally on device.'
                : 'Get your key from platform.deepseek.com. Stored locally on device.'}
            </Typography>
          </View>
        )}

        <Button
          title={isAiSaved ? 'Saved!' : 'Save Conversation Settings'}
          onPress={handleSaveAISettings}
          style={{ marginTop: theme.spacing.md }}
        />
      </Card>

      {/* Data Management Section */}
      <Typography variant="title" style={{ marginTop: theme.spacing.sm, marginBottom: theme.spacing.md }}>
        Data & Storage
      </Typography>

      <Card style={{ padding: theme.spacing.lg }}>
        <Typography variant="body" weight="600">
          Data Export & Backup
        </Typography>
        <Typography variant="caption" color="foregroundMuted" style={{ marginTop: theme.spacing.xs, marginBottom: theme.spacing.md }}>
          Generate your complete learning history, spaced repetition schedules, and streak as a JSON text backup.
        </Typography>

        <Button
          title={exportJson ? 'Refresh Export JSON' : 'Export Learning Data'}
          variant="outline"
          onPress={handleExport}
        />

        {exportJson && (
          <View style={[styles.exportBox, { backgroundColor: colors.surfaceSubtle, padding: theme.spacing.md, borderRadius: theme.radii.md, marginTop: theme.spacing.md }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <Typography variant="caption" color="primary" weight="700">
                Backup Data Ready:
              </Typography>
              <Badge label={`${Math.round(exportJson.length / 1024 * 10) / 10} KB`} variant="vocab" />
            </View>

            <ScrollView
              style={{ maxHeight: 140, backgroundColor: colors.surface, borderRadius: theme.radii.sm, padding: theme.spacing.sm }}
              nestedScrollEnabled
            >
              <Typography variant="caption" color="foregroundSubtle" selectable style={{ fontFamily: 'monospace', fontSize: 11 }}>
                {exportJson}
              </Typography>
            </ScrollView>

            <TouchableOpacity
              activeOpacity={0.8}
              style={[
                styles.copyButton,
                {
                  backgroundColor: copied ? colors.success : colors.primary,
                  borderRadius: theme.radii.md,
                  marginTop: theme.spacing.md,
                  paddingVertical: theme.spacing.sm,
                  paddingHorizontal: theme.spacing.md,
                },
              ]}
              onPress={handleCopyJson}
            >
              <Ionicons
                name={copied ? 'checkmark-circle' : 'copy-outline'}
                size={16}
                color={colors.primaryForeground}
                style={{ marginRight: 6 }}
              />
              <Typography variant="label" weight="700" color="primaryForeground">
                {copied ? 'Copied to Clipboard!' : 'Copy Full Backup JSON'}
              </Typography>
            </TouchableOpacity>
          </View>
        )}

        <Divider style={{ marginVertical: theme.spacing.lg }} />

        <Typography variant="body" weight="600">
          Restore / Import Progress
        </Typography>
        <Typography variant="caption" color="foregroundMuted" style={{ marginTop: theme.spacing.xs, marginBottom: theme.spacing.md }}>
          Import and validate an existing Klearn backup file to restore your stats.
        </Typography>

        {!showImportBox ? (
          <Button
            title="Import Learning Data"
            variant="outline"
            onPress={() => setShowImportBox(true)}
          />
        ) : (
          <View>
            <TextInput
              multiline
              numberOfLines={4}
              value={importJsonInput}
              onChangeText={setImportJsonInput}
              placeholder="Paste JSON backup payload here..."
              placeholderTextColor={colors.foregroundSubtle}
              style={[
                styles.importInput,
                {
                  backgroundColor: colors.surfaceSubtle,
                  borderColor: colors.borderSubtle,
                  color: colors.foreground,
                  borderRadius: theme.radii.md,
                  padding: theme.spacing.md,
                },
              ]}
            />
            <View style={{ flexDirection: 'row', gap: 10, marginTop: theme.spacing.md }}>
              <Button
                title="Restore Backup"
                onPress={handleImport}
                style={{ flex: 1 }}
              />
              <Button
                title="Cancel"
                variant="outline"
                onPress={() => {
                  setShowImportBox(false);
                  setImportJsonInput('');
                }}
              />
            </View>
          </View>
        )}

        <Divider style={{ marginVertical: theme.spacing.lg }} />

        <Button
          title="Reset All Progress"
          variant="destructive"
          onPress={handleReset}
        />
      </Card>

      {/* Support the Developer & Buy Me a Coffee */}
      <Typography variant="title" style={{ marginTop: theme.spacing.lg, marginBottom: theme.spacing.md }}>
        Support Klearn
      </Typography>

      <Card elevated style={{ padding: theme.spacing.lg, marginBottom: theme.spacing.lg }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing.xs }}>
          <Ionicons name="cafe" size={24} color={colors.accent} />
          <Typography variant="heading" color="accent" weight="700" style={{ marginLeft: theme.spacing.sm }}>
            Buy Me a Coffee
          </Typography>
        </View>
        <Typography variant="body" color="foreground" style={{ marginTop: theme.spacing.xs }}>
          Klearn is 100% free, offline, and ad-free. If this app helps your Korean learning journey, you can support future development, dictionary banks, and new lessons with a warm cup of coffee!
        </Typography>

        <TouchableOpacity
          activeOpacity={0.8}
          style={[
            styles.coffeeButton,
            {
              backgroundColor: colors.accent,
              borderRadius: theme.radii.md,
              marginTop: theme.spacing.md,
              paddingVertical: theme.spacing.md,
              paddingHorizontal: theme.spacing.lg,
            },
          ]}
          onPress={() => Linking.openURL('https://buymeacoffee.com/zrodayrit')}
        >
          <Ionicons name="heart" size={18} color={colors.primaryForeground} style={{ marginRight: 8 }} />
          <Typography variant="label" weight="700" color="primaryForeground">
            Support on Buy Me a Coffee
          </Typography>
          <Ionicons name="open-outline" size={16} color={colors.primaryForeground} style={{ marginLeft: 6 }} />
        </TouchableOpacity>
      </Card>

      {/* App Info / About */}
      <View style={{ alignItems: 'center', marginTop: theme.spacing.sm, marginBottom: theme.spacing.lg }}>
        <Typography variant="caption" color="foregroundMuted">
          Klearn v1.0.0 • Free Korean Learning
        </Typography>
        <Typography variant="caption" color="foregroundSubtle" style={{ marginTop: 2 }}>
          Made with ❤️
        </Typography>
      </View>
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
  reminderPill: {
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 78,
  },
  notificationTestBox: {
    borderWidth: 1,
  },
  exportBox: {},
  importInput: {
    borderWidth: 1,
    minHeight: 100,
    fontSize: 13,
    textAlignVertical: 'top',
  },
  coffeeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
