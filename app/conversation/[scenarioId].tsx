import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Typography,
  Card,
  Badge,
  Button,
  useTheme,
} from '@/components/ui';
import { useConversation } from '@/features/conversation/useConversation';
import { hapticService } from '@/infrastructure/haptics/hapticService';

export default function ConversationScreen() {
  const { scenarioId } = useLocalSearchParams<{ scenarioId: string }>();
  const router = useRouter();
  const { colors, theme } = useTheme();
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef<ScrollView>(null);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  // Monitor keyboard display to keep input bar snug and messages scrolled into view
  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, () => {
      setIsKeyboardVisible(true);
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 50);
    });

    const hideSub = Keyboard.addListener(hideEvent, () => {
      setIsKeyboardVisible(false);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const {
    scenario,
    messages,
    suggestedReplies,
    inputText,
    setInputText,
    isPlayingId,
    showRomanization,
    setShowRomanization,
    showTranslations,
    setShowTranslations,
    isCompleted,
    isGenerating,
    aiProvider,
    isListening,
    interimTranscript,
    voiceError,
    startVoiceInput,
    stopVoiceInput,
    playAudio,
    sendReply,
    restart,
  } = useConversation(scenarioId || 'cafe-order');

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
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
            <Typography variant="heading" weight="700" numberOfLines={1}>
              {scenario.koreanTitle}
            </Typography>
            <Typography variant="caption" color="foregroundMuted" numberOfLines={1}>
              {scenario.title} • {aiProvider === 'offline' ? 'Offline' : `${aiProvider.toUpperCase()} AI`}
            </Typography>
          </View>

          <TouchableOpacity
            onPress={restart}
            style={[
              styles.restartBtn,
              {
                backgroundColor: colors.background,
                borderColor: colors.borderSubtle,
                borderRadius: theme.radii.full,
              },
            ]}
            accessibilityLabel="Restart scenario"
          >
            <Ionicons name="refresh" size={18} color={colors.foreground} />
          </TouchableOpacity>
        </View>

        {/* Toggles Bar */}
        <View style={styles.togglesRow}>
          <TouchableOpacity
            onPress={() => setShowRomanization(!showRomanization)}
            style={[
              styles.togglePill,
              {
                backgroundColor: showRomanization ? colors.primary : colors.background,
                borderColor: showRomanization ? colors.primary : colors.borderSubtle,
                borderRadius: theme.radii.full,
                paddingHorizontal: theme.spacing.sm + 2,
                paddingVertical: 3,
                marginRight: 6,
              },
            ]}
          >
            <Typography
              variant="caption"
              weight="600"
              color={showRomanization ? 'primaryForeground' : 'foreground'}
            >
              Romanization: {showRomanization ? 'ON' : 'OFF'}
            </Typography>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setShowTranslations(!showTranslations)}
            style={[
              styles.togglePill,
              {
                backgroundColor: showTranslations ? colors.primary : colors.background,
                borderColor: showTranslations ? colors.primary : colors.borderSubtle,
                borderRadius: theme.radii.full,
                paddingHorizontal: theme.spacing.sm + 2,
                paddingVertical: 3,
              },
            ]}
          >
            <Typography
              variant="caption"
              weight="600"
              color={showTranslations ? 'primaryForeground' : 'foreground'}
            >
              Translation: {showTranslations ? 'ON' : 'OFF'}
            </Typography>
          </TouchableOpacity>
        </View>
      </View>

      {/* Messages Scroll Area */}
      <ScrollView
        ref={scrollViewRef}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        contentContainerStyle={[
          styles.messagesList,
          {
            paddingHorizontal: theme.spacing.lg,
            paddingTop: theme.spacing.md,
            paddingBottom: theme.spacing.lg,
          },
        ]}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
      >
        {messages.map((msg) => {
          const isPartner = msg.role === 'assistant';
          const isPlaying = isPlayingId === msg.id;

          return (
            <View
              key={msg.id}
              style={[
                styles.messageContainer,
                isPartner ? styles.partnerMsgContainer : styles.userMsgContainer,
              ]}
            >
              {isPartner && (
                <View
                  style={[
                    styles.avatar,
                    {
                      backgroundColor: colors.surfaceSubtle,
                      borderColor: colors.borderSubtle,
                      borderRadius: theme.radii.full,
                    },
                  ]}
                >
                  <Ionicons name="chatbubble-ellipses-outline" size={16} color={colors.primary} />
                </View>
              )}

              <View style={{ flex: 1, maxWidth: '85%' }}>
                <View
                  style={[
                    styles.bubble,
                    {
                      backgroundColor: isPartner ? colors.surface : colors.primary,
                      borderColor: isPartner ? colors.borderSubtle : colors.primary,
                      borderRadius: theme.radii.lg,
                      borderTopLeftRadius: isPartner ? 2 : theme.radii.lg,
                      borderTopRightRadius: isPartner ? theme.radii.lg : 2,
                      padding: theme.spacing.md,
                    },
                  ]}
                >
                  <Typography
                    variant="title"
                    weight="700"
                    color={isPartner ? 'foreground' : 'primaryForeground'}
                    style={{ fontSize: 17, lineHeight: 24 }}
                  >
                    {msg.korean}
                  </Typography>

                  {showRomanization && msg.romanization ? (
                    <Typography
                      variant="caption"
                      color={isPartner ? 'foregroundMuted' : 'primaryForeground'}
                      style={{ marginTop: 2, opacity: 0.85 }}
                    >
                      [{msg.romanization}]
                    </Typography>
                  ) : null}

                  {showTranslations && msg.translation ? (
                    <Typography
                      variant="caption"
                      color={isPartner ? 'foreground' : 'primaryForeground'}
                      style={{ marginTop: 4, fontWeight: '500' }}
                    >
                      {msg.translation}
                    </Typography>
                  ) : null}

                  {/* Audio Listen Buttons for partner prompt */}
                  {isPartner && (
                    <View style={styles.bubbleActionsRow}>
                      <TouchableOpacity
                        onPress={() => playAudio(msg.id, msg.audioText, false)}
                        style={[
                          styles.soundBtn,
                          {
                            backgroundColor: colors.surfaceSubtle,
                            borderColor: colors.borderSubtle,
                            borderRadius: theme.radii.full,
                          },
                        ]}
                      >
                        <Ionicons
                          name={isPlaying ? 'volume-high' : 'volume-medium-outline'}
                          size={14}
                          color={colors.primary}
                        />
                        <Typography variant="caption" color="primary" weight="600" style={{ marginLeft: 4, fontSize: 11 }}>
                          Listen
                        </Typography>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => playAudio(msg.id, msg.audioText, true)}
                        style={[
                          styles.soundBtn,
                          {
                            backgroundColor: colors.surfaceSubtle,
                            borderColor: colors.borderSubtle,
                            borderRadius: theme.radii.full,
                            marginLeft: 6,
                          },
                        ]}
                      >
                        <Ionicons name="speedometer-outline" size={13} color={colors.accent} />
                        <Typography variant="caption" color="accent" weight="600" style={{ marginLeft: 4, fontSize: 11 }}>
                          Slow
                        </Typography>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>

                {/* Formality Coaching Feedback Box */}
                {!isPartner && msg.feedback && (
                  <View
                    style={[
                      styles.feedbackBox,
                      {
                        backgroundColor: msg.feedback.isCorrectRegister
                          ? colors.surfaceSubtle
                          : colors.surface,
                        borderColor: msg.feedback.isCorrectRegister
                          ? colors.borderSubtle
                          : colors.accent,
                        borderRadius: theme.radii.md,
                      },
                    ]}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
                      <Ionicons
                        name={
                          msg.feedback.isCorrectRegister
                            ? 'checkmark-circle-outline'
                            : 'bulb-outline'
                        }
                        size={14}
                        color={msg.feedback.isCorrectRegister ? colors.success : colors.accent}
                      />
                      <Typography
                        variant="caption"
                        weight="700"
                        color={msg.feedback.isCorrectRegister ? 'success' : 'accent'}
                        style={{ marginLeft: 4, fontSize: 11 }}
                      >
                        {msg.feedback.isCorrectRegister ? 'Polite Formality Matched' : 'Formality Tip'}
                      </Typography>
                    </View>
                    {msg.feedback.tip ? (
                      <Typography variant="caption" color="foregroundMuted" style={{ fontSize: 11 }}>
                        {msg.feedback.tip}
                      </Typography>
                    ) : null}
                  </View>
                )}
              </View>
            </View>
          );
        })}

        {isGenerating && (
          <View style={[styles.messageContainer, styles.partnerMsgContainer]}>
            <View
              style={[
                styles.bubble,
                {
                  backgroundColor: colors.surfaceSubtle,
                  borderColor: colors.borderSubtle,
                  borderRadius: theme.radii.lg,
                  paddingHorizontal: theme.spacing.md,
                  paddingVertical: theme.spacing.sm,
                },
              ]}
            >
              <Typography variant="caption" color="foregroundMuted">
                Typing Korean response...
              </Typography>
            </View>
          </View>
        )}

        {/* Completion Card */}
        {isCompleted && (
          <Card elevated style={{ marginTop: theme.spacing.md, padding: theme.spacing.lg }}>
            <View style={{ alignItems: 'center' }}>
              <Ionicons name="trophy" size={36} color={colors.accent} />
              <Typography variant="heading" weight="700" style={{ marginTop: 6 }}>
                Dialogue Completed!
              </Typography>
              <Typography variant="body" color="foregroundMuted" align="center" style={{ marginTop: 4 }}>
                You successfully navigated this conversation in polite Korean. Great speaking and listening practice!
              </Typography>
              <Button
                title="Practice Again"
                variant="outline"
                onPress={restart}
                style={{ marginTop: theme.spacing.md, minWidth: 160 }}
              />
            </View>
          </Card>
        )}
      </ScrollView>

      {/* Pinned Bottom Interactive Reply Bar */}
      <View
        style={[
          styles.bottomBar,
          {
            backgroundColor: colors.surface,
            borderTopWidth: 1,
            borderTopColor: colors.borderSubtle,
            paddingHorizontal: theme.spacing.md,
            paddingTop: theme.spacing.sm,
            paddingBottom: isKeyboardVisible
              ? theme.spacing.sm
              : Math.max(insets.bottom, theme.spacing.md),
          },
        ]}
      >
        {/* Suggested Response Chips */}
        {!isCompleted && suggestedReplies.length > 0 && (
          <View style={{ marginBottom: theme.spacing.sm }}>
            <Typography variant="caption" color="foregroundMuted" weight="600" style={{ marginBottom: 4 }}>
              Suggested Replies:
            </Typography>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
              {suggestedReplies.map((reply) => (
                <TouchableOpacity
                  key={reply.id}
                  onPress={() => sendReply(reply.korean, reply)}
                  style={[
                    styles.replyChip,
                    {
                      backgroundColor: colors.surfaceSubtle,
                      borderColor: colors.borderSubtle,
                      borderRadius: theme.radii.md,
                      paddingHorizontal: theme.spacing.md,
                      paddingVertical: 8,
                    },
                  ]}
                >
                  <Typography variant="body" weight="700" color="foreground" style={{ fontSize: 14 }}>
                    {reply.korean}
                  </Typography>
                  <Typography variant="caption" color="foregroundMuted" style={{ fontSize: 11 }}>
                    {reply.translation}
                  </Typography>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Listening Status Banner */}
        {isListening && (
          <View
            style={[
              styles.listeningBox,
              {
                backgroundColor: colors.surfaceSubtle,
                borderColor: colors.accent,
                borderRadius: theme.radii.md,
                padding: theme.spacing.sm,
                marginBottom: theme.spacing.xs,
              },
            ]}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Ionicons name="mic" size={16} color={colors.accent} />
              <Typography variant="caption" weight="700" color="accent">
                Listening... Speak in Korean now
              </Typography>
            </View>
            <Typography variant="body" weight="600" color="foreground" style={{ marginTop: 2 }}>
              {interimTranscript || 'e.g. 네, 아이스 아메리카노 한 잔 주세요'}
            </Typography>
          </View>
        )}

        {voiceError ? (
          <Typography variant="caption" color="destructive" style={{ marginBottom: 4, textAlign: 'center' }}>
            {voiceError}
          </Typography>
        ) : null}

        {/* Free-form Input */}
        {!isCompleted && (
          <View style={styles.inputRow}>
            {/* Voice Input Microphone Button */}
            <TouchableOpacity
              onPress={async () => {
                hapticService.lightTick();
                if (isListening) {
                  await stopVoiceInput();
                } else {
                  await startVoiceInput();
                }
              }}
              style={[
                styles.voiceBtn,
                {
                  backgroundColor: isListening ? colors.accent : colors.surfaceSubtle,
                  borderRadius: theme.radii.full,
                  borderWidth: 1,
                  borderColor: isListening ? colors.accent : colors.borderSubtle,
                },
              ]}
              accessibilityLabel={isListening ? 'Stop listening' : 'Speak Korean'}
            >
              <Ionicons
                name={isListening ? 'stop' : 'mic'}
                size={20}
                color={isListening ? colors.primaryForeground : colors.primary}
              />
            </TouchableOpacity>

            <TextInput
              value={inputText}
              onChangeText={setInputText}
              onFocus={() => {
                setTimeout(() => {
                  scrollViewRef.current?.scrollToEnd({ animated: true });
                }, 100);
              }}
              placeholder={isListening ? 'Listening to voice...' : 'Type or tap mic to speak Korean...'}
              placeholderTextColor={colors.foregroundSubtle}
              style={[
                styles.textInput,
                {
                  backgroundColor: colors.surfaceSubtle,
                  borderColor: isListening ? colors.accent : colors.borderSubtle,
                  color: colors.foreground,
                  borderRadius: theme.radii.full,
                  paddingHorizontal: theme.spacing.md,
                },
              ]}
            />
            <TouchableOpacity
              onPress={() => sendReply(inputText)}
              disabled={!inputText.trim() || isGenerating}
              style={[
                styles.sendBtn,
                {
                  backgroundColor: inputText.trim() ? colors.primary : colors.surfaceSubtle,
                  borderRadius: theme.radii.full,
                },
              ]}
              accessibilityLabel="Send message"
            >
              <Ionicons
                name="arrow-up"
                size={20}
                color={inputText.trim() ? colors.primaryForeground : colors.foregroundSubtle}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
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
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    marginRight: 10,
  },
  restartBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    marginLeft: 8,
  },
  togglesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  togglePill: {
    borderWidth: 1,
  },
  messagesList: {},
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 14,
  },
  partnerMsgContainer: {
    justifyContent: 'flex-start',
  },
  userMsgContainer: {
    justifyContent: 'flex-end',
  },
  avatar: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    marginRight: 8,
    marginTop: 4,
  },
  bubble: {
    borderWidth: 1,
  },
  bubbleActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  soundBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
  },
  feedbackBox: {
    marginTop: 4,
    padding: 8,
    borderWidth: 1,
  },
  bottomBar: {},
  replyChip: {
    borderWidth: 1,
    maxWidth: 260,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  textInput: {
    flex: 1,
    height: 42,
    borderWidth: 1,
    fontSize: 14,
  },
  voiceBtn: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listeningBox: {
    borderWidth: 1,
  },
  sendBtn: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
