import React, { useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Typography,
  Card,
  Badge,
  useTheme,
} from '@/components/ui';
import { useAIChat } from '@/features/aiChat/useAIChat';
import { SUGGESTED_QUESTION_PROMPTS } from '@/domain/aiChat/types';
import { hapticService } from '@/infrastructure/haptics/hapticService';

export default function AITutorChatScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, theme } = useTheme();
  const scrollViewRef = useRef<ScrollView>(null);

  const {
    messages,
    inputText,
    setInputText,
    isAsking,
    isListening,
    interimTranscript,
    activeProviderName,
    sendMessage,
    startVoiceInput,
    stopVoiceInput,
    clearChat,
    speakSnippet,
  } = useAIChat();

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 150);
  }, [messages, isAsking]);

  const handleCopy = async (text: string) => {
    hapticService.lightTick();
    await Clipboard.setStringAsync(text);
  };

  const handleConfirmClear = () => {
    if (Platform.OS === 'web') {
      if (window.confirm('Clear your AI tutor chat history?')) {
        clearChat();
      }
    } else {
      Alert.alert(
        'Clear Chat History',
        'Are you sure you want to clear all conversation history with the AI tutor?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Clear', style: 'destructive', onPress: clearChat },
        ]
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
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
              styles.headerBtn,
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

          <View style={{ flex: 1, marginLeft: 8 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Typography variant="title" weight="700">
                AI Korean Tutor
              </Typography>
              <Badge label={activeProviderName} variant="vocab" style={{ transform: [{ scale: 0.85 }] }} />
            </View>
            <Typography variant="caption" color="foregroundMuted" numberOfLines={1}>
              Ask anything • Grammar, vocab, translations & culture
            </Typography>
          </View>

          <TouchableOpacity
            onPress={handleConfirmClear}
            style={[
              styles.headerBtn,
              {
                backgroundColor: colors.background,
                borderColor: colors.borderSubtle,
                borderRadius: theme.radii.full,
                marginLeft: 8,
              },
            ]}
            accessibilityLabel="Clear chat history"
          >
            <Ionicons name="trash-outline" size={18} color={colors.foregroundMuted} />
          </TouchableOpacity>
        </View>

        {/* Quick Suggested Prompts Horizontal Carousel */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8, paddingTop: 10, paddingBottom: 2 }}
        >
          {SUGGESTED_QUESTION_PROMPTS.map((prompt) => (
            <TouchableOpacity
              key={prompt.id}
              activeOpacity={0.8}
              onPress={() => sendMessage(prompt.prompt)}
              style={[
                styles.promptPill,
                {
                  backgroundColor: colors.background,
                  borderColor: colors.borderSubtle,
                  borderRadius: theme.radii.full,
                },
              ]}
            >
              <Typography variant="caption" weight="600" color="primary">
                💬 {prompt.title}
              </Typography>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Messages Scroll Area */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesList}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingHorizontal: theme.spacing.lg,
            paddingTop: theme.spacing.md,
            paddingBottom: theme.spacing.xl,
          },
        ]}
      >
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <View
              key={msg.id}
              style={[
                styles.messageContainer,
                isUser ? styles.userMsgContainer : styles.tutorMsgContainer,
              ]}
            >
              {!isUser && (
                <View
                  style={[
                    styles.tutorAvatar,
                    {
                      backgroundColor: colors.surfaceSubtle,
                      borderColor: colors.borderSubtle,
                      borderRadius: theme.radii.full,
                    },
                  ]}
                >
                  <Ionicons name="sparkles" size={16} color={colors.primary} />
                </View>
              )}

              <View style={{ maxWidth: '85%' }}>
                <Card
                  elevated={isUser}
                  subtle={!isUser}
                  style={[
                    styles.bubble,
                    isUser
                      ? {
                          backgroundColor: colors.primary,
                          borderColor: colors.primary,
                          borderRadius: theme.radii.lg,
                          borderBottomRightRadius: 2,
                        }
                      : {
                          backgroundColor: colors.surface,
                          borderColor: colors.borderSubtle,
                          borderRadius: theme.radii.lg,
                          borderBottomLeftRadius: 2,
                        },
                    { padding: theme.spacing.md },
                  ]}
                >
                  <Typography
                    variant="body"
                    color={isUser ? 'primaryForeground' : 'foreground'}
                    style={{ lineHeight: 22 }}
                  >
                    {msg.content}
                  </Typography>

                  {/* Actions Row for Assistant Bubbles */}
                  {!isUser && (
                    <View
                      style={[
                        styles.bubbleActionsRow,
                        {
                          borderTopWidth: 1,
                          borderTopColor: colors.borderSubtle,
                          marginTop: theme.spacing.md,
                          paddingTop: theme.spacing.xs,
                        },
                      ]}
                    >
                      {msg.koreanSnippet ? (
                        <TouchableOpacity
                          onPress={() => speakSnippet(msg.koreanSnippet!)}
                          style={[
                            styles.snippetBtn,
                            {
                              backgroundColor: colors.surfaceSubtle,
                              borderRadius: theme.radii.sm,
                            },
                          ]}
                        >
                          <Ionicons name="volume-high" size={16} color={colors.primary} />
                          <Typography variant="caption" weight="600" color="primary" style={{ marginLeft: 4 }}>
                            Listen Korean
                          </Typography>
                        </TouchableOpacity>
                      ) : null}

                      <TouchableOpacity
                        onPress={() => handleCopy(msg.content)}
                        style={[
                          styles.copyBtn,
                          {
                            backgroundColor: colors.surfaceSubtle,
                            borderRadius: theme.radii.sm,
                          },
                        ]}
                      >
                        <Ionicons name="copy-outline" size={14} color={colors.foregroundMuted} />
                        <Typography variant="caption" color="foregroundMuted" style={{ marginLeft: 4 }}>
                          Copy
                        </Typography>
                      </TouchableOpacity>
                    </View>
                  )}
                </Card>
              </View>
            </View>
          );
        })}

        {/* Thinking Indicator */}
        {isAsking && (
          <View style={[styles.messageContainer, styles.tutorMsgContainer]}>
            <View
              style={[
                styles.tutorAvatar,
                {
                  backgroundColor: colors.surfaceSubtle,
                  borderColor: colors.borderSubtle,
                  borderRadius: theme.radii.full,
                },
              ]}
            >
              <Ionicons name="sparkles" size={16} color={colors.primary} />
            </View>
            <Card
              subtle
              style={{
                backgroundColor: colors.surface,
                borderColor: colors.borderSubtle,
                paddingHorizontal: theme.spacing.md,
                paddingVertical: theme.spacing.sm,
                borderRadius: theme.radii.lg,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Ionicons name="ellipsis-horizontal" size={20} color={colors.primary} />
                <Typography variant="caption" color="foregroundMuted">
                  Korean Tutor is thinking...
                </Typography>
              </View>
            </Card>
          </View>
        )}
      </ScrollView>

      {/* Pinned Bottom Interactive Input Bar */}
      <View
        style={[
          styles.bottomBar,
          {
            backgroundColor: colors.surface,
            borderTopWidth: 1,
            borderTopColor: colors.borderSubtle,
            paddingHorizontal: theme.spacing.md,
            paddingTop: theme.spacing.sm,
            paddingBottom: Math.max(insets.bottom, theme.spacing.md),
          },
        ]}
      >
        {/* Listening Indicator Banner */}
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
                Listening... Speak your question now
              </Typography>
            </View>
            <Typography variant="body" weight="600" color="foreground" style={{ marginTop: 2 }}>
              {interimTranscript || 'e.g. What is the difference between 은/는 and 이/가?'}
            </Typography>
          </View>
        )}

        <View style={styles.inputRow}>
          {/* Microphone Voice Button */}
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
              styles.micBtn,
              {
                backgroundColor: isListening ? colors.accent : colors.surfaceSubtle,
                borderRadius: theme.radii.full,
                borderWidth: 1,
                borderColor: isListening ? colors.accent : colors.borderSubtle,
              },
            ]}
            accessibilityLabel={isListening ? 'Stop listening' : 'Ask with voice'}
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
            placeholder={isListening ? 'Listening to voice...' : 'Ask about Korean grammar, vocab, translate...'}
            placeholderTextColor={colors.foregroundSubtle}
            multiline
            style={[
              styles.textInput,
              {
                backgroundColor: colors.surfaceSubtle,
                borderColor: isListening ? colors.accent : colors.borderSubtle,
                color: colors.foreground,
                borderRadius: theme.radii.lg,
                paddingHorizontal: theme.spacing.md,
              },
            ]}
          />

          <TouchableOpacity
            onPress={() => sendMessage()}
            disabled={!inputText.trim() || isAsking}
            style={[
              styles.sendBtn,
              {
                backgroundColor: inputText.trim() ? colors.primary : colors.surfaceSubtle,
                borderRadius: theme.radii.full,
              },
            ]}
            accessibilityLabel="Send question"
          >
            <Ionicons
              name="arrow-up"
              size={20}
              color={inputText.trim() ? colors.primaryForeground : colors.foregroundSubtle}
            />
          </TouchableOpacity>
        </View>
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
  headerBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  promptPill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderWidth: 1,
  },
  messagesList: {
    flex: 1,
  },
  scrollContent: {},
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 14,
  },
  tutorMsgContainer: {
    justifyContent: 'flex-start',
  },
  userMsgContainer: {
    justifyContent: 'flex-end',
  },
  tutorAvatar: {
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
    gap: 8,
  },
  snippetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  bottomBar: {},
  listeningBox: {
    borderWidth: 1,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  micBtn: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    flex: 1,
    minHeight: 42,
    maxHeight: 100,
    borderWidth: 1,
    fontSize: 14,
    paddingTop: 10,
    paddingBottom: 10,
  },
  sendBtn: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
