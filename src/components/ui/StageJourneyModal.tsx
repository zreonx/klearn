import React from 'react';
import {
  Modal,
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Typography } from './Typography';
import { Badge } from './Badge';
import { Button } from './Button';
import { useTheme } from '@/app/providers/ThemeProvider';
import { Stage } from '@/domain/curriculum/types';

export interface StageJourneyModalProps {
  visible: boolean;
  stages: Stage[];
  onClose: () => void;
  isFirstTime?: boolean;
}

export function StageJourneyModal({
  visible,
  stages,
  onClose,
  isFirstTime = false,
}: StageJourneyModalProps) {
  const { colors, theme } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={[styles.overlay, { backgroundColor: 'rgba(0,0,0,0.6)' }]}>
        <Pressable style={styles.backdropPressable} onPress={onClose} />
        <View
          style={[
            styles.modalContainer,
            {
              backgroundColor: colors.surfaceElevated,
              borderColor: colors.borderSubtle,
              paddingTop: theme.spacing.lg,
              paddingBottom: Math.max(insets.bottom, theme.spacing.lg),
            },
          ]}
        >
          {/* Header */}
          <View
            style={[
              styles.header,
              {
                paddingHorizontal: theme.spacing.lg,
                paddingBottom: theme.spacing.md,
                borderBottomWidth: StyleSheet.hairlineWidth,
                borderBottomColor: colors.borderSubtle,
              },
            ]}
          >
            <View style={{ flex: 1, paddingRight: theme.spacing.sm }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <Typography variant="title" weight="700">
                  Proficiency Journey
                </Typography>
                <Badge label="5 Stages" variant="vocab" />
              </View>
              <Typography variant="caption" color="foregroundMuted">
                TOPIK-aligned roadmap from first syllable to fluency
              </Typography>
            </View>

            <TouchableOpacity
              onPress={onClose}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              style={[
                styles.closeButton,
                { backgroundColor: colors.surfaceSubtle },
              ]}
              accessibilityLabel="Close modal"
              accessibilityRole="button"
            >
              <Ionicons name="close" size={20} color={colors.foreground} />
            </TouchableOpacity>
          </View>

          {/* Scrollable Stage Cards */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              styles.scrollContent,
              {
                paddingHorizontal: theme.spacing.lg,
                paddingTop: theme.spacing.md,
                paddingBottom: theme.spacing.lg,
                gap: theme.spacing.md,
              },
            ]}
          >
            {stages.map((stg, index) => {
              const isLast = index === stages.length - 1;

              return (
                <View
                  key={stg.id}
                  style={[
                    styles.stageCard,
                    {
                      backgroundColor: colors.surface,
                      borderColor: colors.borderSubtle,
                      borderRadius: theme.radii.lg,
                      padding: theme.spacing.lg,
                    },
                  ]}
                >
                  {/* Top row: Stage number badge & TOPIK benchmark badge */}
                  <View style={styles.stageCardTop}>
                    <View
                      style={[
                        styles.stageNumberBadge,
                        {
                          backgroundColor: theme.isDark
                            ? 'rgba(120, 185, 155, 0.18)'
                            : 'rgba(23, 107, 85, 0.12)',
                        },
                      ]}
                    >
                      <Typography
                        variant="caption"
                        weight="700"
                        color="primary"
                        style={{ fontSize: 11 }}
                      >
                        STAGE {stg.order}
                      </Typography>
                    </View>

                    <Badge label={stg.topikBenchmark} variant="default" />
                  </View>

                  {/* Title & Subtitle */}
                  <Typography
                    variant="title"
                    weight="700"
                    style={{ marginTop: theme.spacing.xs, marginBottom: 2 }}
                  >
                    {stg.title.replace(/^Stage \d+ — /, '')}
                  </Typography>

                  {stg.subtitle ? (
                    <Typography
                      variant="caption"
                      color="foregroundMuted"
                      style={{ marginBottom: theme.spacing.sm, lineHeight: 18 }}
                    >
                      {stg.subtitle}
                    </Typography>
                  ) : null}

                  {/* Outcome Box */}
                  <View
                    style={[
                      styles.outcomeContainer,
                      {
                        backgroundColor: colors.surfaceSubtle,
                        borderColor: colors.borderSubtle,
                        borderRadius: theme.radii.md,
                        padding: theme.spacing.sm,
                      },
                    ]}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 6 }}>
                      <Ionicons
                        name="checkmark-circle-outline"
                        size={16}
                        color={colors.primary}
                        style={{ marginTop: 2 }}
                      />
                      <View style={{ flex: 1 }}>
                        <Typography
                          variant="caption"
                          weight="600"
                          color="primary"
                          style={{ marginBottom: 2 }}
                        >
                          What You Can Do
                        </Typography>
                        <Typography
                          variant="caption"
                          color="foreground"
                          style={{ lineHeight: 18 }}
                        >
                          {stg.practicalOutcome}
                        </Typography>
                      </View>
                    </View>
                  </View>
                </View>
              );
            })}
          </ScrollView>

          {/* Bottom Action Footer */}
          <View
            style={[
              styles.footer,
              {
                paddingHorizontal: theme.spacing.lg,
                paddingTop: theme.spacing.md,
                borderTopWidth: StyleSheet.hairlineWidth,
                borderTopColor: colors.borderSubtle,
              },
            ]}
          >
            <Button
              title={isFirstTime ? 'Got It, Let’s Begin!' : 'Close Roadmap'}
              onPress={onClose}
              fullWidth
              size="lg"
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdropPressable: {
    flex: 1,
  },
  modalContainer: {
    maxHeight: '88%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {},
  stageCard: {
    borderWidth: 1,
  },
  stageCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  stageNumberBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  outcomeContainer: {
    borderWidth: 1,
    marginTop: 4,
  },
  footer: {},
});
