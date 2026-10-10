import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  Typography,
  Card,
  Button,
  Badge,
  useTheme,
} from '@/components/ui';
import { QuizQuestionType } from '@/domain/quiz/types';

export default function QuizTabScreen() {
  const router = useRouter();
  const { colors, theme } = useTheme();
  const [selectedType, setSelectedType] = useState<QuizQuestionType | 'all'>('all');

  const modes: Array<{ id: QuizQuestionType | 'all'; title: string; desc: string }> = [
    {
      id: 'all',
      title: 'Balanced Practice',
      desc: 'Mix of Korean to English, English to Korean, and Listening',
    },
    {
      id: 'korean_to_english',
      title: 'Korean → English',
      desc: 'Recognize Korean words and select their English meaning',
    },
    {
      id: 'english_to_korean',
      title: 'English → Korean',
      desc: 'Recall and produce the right Korean Hangul representation',
    },
    {
      id: 'listening_recognition',
      title: 'Listening Practice',
      desc: 'Listen to spoken audio and identify the meaning',
    },
  ];

  const handleStart = () => {
    router.push('/quiz/session');
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={[styles.content, { padding: theme.spacing.lg, paddingBottom: theme.spacing['5xl'] }]}
    >
      <View style={{ marginBottom: theme.spacing.xl }}>
        <Typography variant="display" weight="700">
          Quiz
        </Typography>
        <Typography variant="caption" color="foregroundMuted">
          Test your retention and sharpen active Korean recall
        </Typography>
      </View>

      <Card elevated style={{ marginBottom: theme.spacing.xl }}>
        <View style={{ marginBottom: theme.spacing.sm }}>
          <Badge label="Quiz Engine" variant="vocab" />
        </View>
        <Typography variant="heading" style={{ marginBottom: theme.spacing.xs }}>
          Ready to test your Korean?
        </Typography>
        <Typography variant="body" color="foregroundMuted" style={{ marginBottom: theme.spacing.lg }}>
          Questions are dynamically generated based on the items you've encountered in your lessons.
        </Typography>
        <Button title="Start Practice Quiz" fullWidth onPress={handleStart} />
      </Card>

      <Typography variant="title" style={{ marginBottom: theme.spacing.md }}>
        Quiz Modes
      </Typography>

      {modes.map((mode) => {
        const isSelected = selectedType === mode.id;
        return (
          <Card
            key={mode.id}
            subtle={!isSelected}
            elevated={isSelected}
            style={[
              { marginBottom: theme.spacing.md },
              isSelected && { borderColor: colors.primary, borderWidth: 1.5 },
            ]}
            onPress={() => setSelectedType(mode.id)}
          >
            <View style={styles.modeRow}>
              <View style={[styles.modeInfo, { marginRight: theme.spacing.md }]}>
                <Typography variant="title" color={isSelected ? 'primary' : 'foreground'}>
                  {mode.title}
                </Typography>
                <Typography variant="caption" color="foregroundMuted" style={{ marginTop: theme.spacing.xs }}>
                  {mode.desc}
                </Typography>
              </View>
              {isSelected ? (
                <Ionicons name="checkmark-circle" size={22} color={colors.primary} />
              ) : (
                <Ionicons name="ellipse-outline" size={22} color={colors.foregroundSubtle} />
              )}
            </View>
          </Card>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {},
  modeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modeInfo: {
    flex: 1,
  },
});
