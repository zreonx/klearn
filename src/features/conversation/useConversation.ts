import { useState, useEffect, useCallback, useRef } from 'react';
import {
  ConversationMessage,
  ConversationScenario,
  SuggestedReply,
} from '@/domain/conversation/types';
import { CONVERSATION_SCENARIOS } from '@/domain/conversation/scenarios';
import { evaluateFormality } from '@/domain/conversation/evaluator';
import { services } from '@/application/services';
import { AITutorSettings } from '@/domain/settings/types';
import { calculateUpdatedStreak } from '@/domain/streak/streakCalculator';

export function useConversation(scenarioId: string) {
  const scenario: ConversationScenario =
    CONVERSATION_SCENARIOS.find((s) => s.id === scenarioId) ?? CONVERSATION_SCENARIOS[0];

  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [turnIndex, setTurnIndex] = useState<number>(0);
  const [suggestedReplies, setSuggestedReplies] = useState<SuggestedReply[]>([]);
  const [inputText, setInputText] = useState<string>('');
  const [isPlayingId, setIsPlayingId] = useState<string | null>(null);
  const [showRomanization, setShowRomanization] = useState<boolean>(true);
  const [showTranslations, setShowTranslations] = useState<boolean>(true);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [aiSettings, setAiSettings] = useState<AITutorSettings | undefined>(undefined);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [interimTranscript, setInterimTranscript] = useState<string>('');
  const [voiceError, setVoiceError] = useState<string | null>(null);

  const mountedRef = useRef(true);

  // Load AI Tutor settings
  useEffect(() => {
    mountedRef.current = true;
    async function loadSettings() {
      try {
        const userSettings = await services.settingsRepo.getUserSettings();
        if (mountedRef.current) {
          setAiSettings(userSettings.aiTutor);
        }
      } catch {
        // Silently default to offline
      }
    }
    loadSettings();
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Initialize conversation with the first partner prompt
  const initConversation = useCallback(() => {
    const firstTurn = scenario.turns[0];
    if (!firstTurn) return;

    const initialPartnerMsg: ConversationMessage = {
      id: `partner-init-${Date.now()}`,
      role: 'assistant',
      korean: firstTurn.partnerPrompt.korean,
      romanization: firstTurn.partnerPrompt.romanization,
      translation: firstTurn.partnerPrompt.translation,
      formality: firstTurn.partnerPrompt.formality,
      audioText: firstTurn.partnerPrompt.audioText,
      timestamp: new Date().toISOString(),
    };

    setMessages([initialPartnerMsg]);
    setTurnIndex(0);
    setSuggestedReplies(firstTurn.suggestedReplies);
    setIsCompleted(false);

    // Speak initial welcome
    services.speech.speak(firstTurn.partnerPrompt.audioText, { rate: 0.85 });
  }, [scenario]);

  useEffect(() => {
    initConversation();
  }, [initConversation]);

  // Audio pronunciation helper (standard or slow speech)
  const playAudio = useCallback(async (msgId: string, text: string, slow = false) => {
    setIsPlayingId(msgId);
    await services.speech.speak(text, { rate: slow ? 0.65 : 0.85 });
    setTimeout(() => {
      setIsPlayingId(null);
    }, 700);
  }, []);

  // Send reply (either from clicking suggested chip or free typing)
  const sendReply = useCallback(
    async (replyText: string, suggestedItem?: SuggestedReply) => {
      const trimmed = replyText.trim();
      if (!trimmed || isGenerating || isCompleted) return;

      const feedback = evaluateFormality(trimmed, scenario.targetFormality);

      const userMsg: ConversationMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        korean: trimmed,
        romanization: suggestedItem?.romanization || '',
        translation: suggestedItem?.translation || '',
        formality: suggestedItem?.formality || scenario.targetFormality,
        audioText: trimmed,
        feedback,
        timestamp: new Date().toISOString(),
      };

      const nextMessages = [...messages, userMsg];
      setMessages(nextMessages);
      setInputText('');
      setSuggestedReplies([]);
      setIsGenerating(true);

      const nextTurnIdx = turnIndex + 1;

      // 1. Check if AI Tutor is active
      if (aiSettings && aiSettings.provider !== 'offline' && aiSettings.apiKey) {
        const history = nextMessages.map((m) => ({
          role: m.role,
          content: m.korean,
        }));

        const aiResponse = await services.aiTutor.generateReply(
          history,
          `${scenario.title} (${scenario.koreanTitle}): ${scenario.description}`,
          aiSettings
        );

        if (aiResponse) {
          const aiMsg: ConversationMessage = {
            id: `ai-${Date.now()}`,
            role: 'assistant',
            korean: aiResponse.korean,
            romanization: aiResponse.romanization,
            translation: aiResponse.translation,
            formality: scenario.targetFormality,
            audioText: aiResponse.korean,
            timestamp: new Date().toISOString(),
          };

          setMessages((prev) => [...prev, aiMsg]);
          setSuggestedReplies(aiResponse.suggestedReplies);
          setIsGenerating(false);
          await services.speech.speak(aiResponse.korean, { rate: 0.85 });
          return;
        }
      }

      // 2. Offline Built-In Engine Progression
      setTimeout(async () => {
        if (nextTurnIdx < scenario.turns.length) {
          const nextTurn = scenario.turns[nextTurnIdx];
          const partnerMsg: ConversationMessage = {
            id: `partner-${Date.now()}`,
            role: 'assistant',
            korean: nextTurn.partnerPrompt.korean,
            romanization: nextTurn.partnerPrompt.romanization,
            translation: nextTurn.partnerPrompt.translation,
            formality: nextTurn.partnerPrompt.formality,
            audioText: nextTurn.partnerPrompt.audioText,
            timestamp: new Date().toISOString(),
          };

          setMessages((prev) => [...prev, partnerMsg]);
          setTurnIndex(nextTurnIdx);
          setSuggestedReplies(nextTurn.suggestedReplies);
          setIsGenerating(false);

          await services.speech.speak(nextTurn.partnerPrompt.audioText, { rate: 0.85 });
        } else {
          // Completed conversation scenario!
          setIsCompleted(true);
          setIsGenerating(false);

          // Record streak activity for completing conversation
          try {
            const now = new Date();
            const activity = await services.progressRepo.getDailyActivity(now);
            activity.reviewsCompletedCount += 1;
            await services.progressRepo.saveDailyActivity(activity);

            const streak = await services.progressRepo.getStreakData();
            const updatedStreak = calculateUpdatedStreak(streak, now);
            await services.progressRepo.saveStreakData(updatedStreak);
          } catch {
            // Ignore
          }
        }
      }, 600);
    },
    [messages, turnIndex, scenario, aiSettings, isGenerating, isCompleted]
  );

  const startVoiceInput = useCallback(async () => {
    setVoiceError(null);
    setInterimTranscript('');
    try {
      const started = await services.voiceRecognition.startListening({
        onInterim: (text) => {
          if (mountedRef.current) {
            setInterimTranscript(text);
          }
        },
        apiKey: aiSettings?.apiKey,
      });
      if (started) {
        setIsListening(true);
      } else {
        setVoiceError('Microphone access unavailable. Check permissions.');
      }
    } catch {
      setVoiceError('Failed to start voice recognition.');
    }
  }, [aiSettings]);

  const stopVoiceInput = useCallback(
    async (autoSend = false) => {
      setIsListening(false);
      try {
        const text = await services.voiceRecognition.stopListening(aiSettings?.apiKey);
        const finalText = text || interimTranscript;
        setInterimTranscript('');
        if (finalText.trim()) {
          setInputText(finalText.trim());
          if (autoSend) {
            sendReply(finalText.trim());
          }
        }
        return finalText.trim();
      } catch {
        setInterimTranscript('');
        return '';
      }
    },
    [aiSettings, interimTranscript, sendReply]
  );

  const cancelVoiceInput = useCallback(async () => {
    setIsListening(false);
    setInterimTranscript('');
    await services.voiceRecognition.cancelListening();
  }, []);

  return {
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
    aiProvider: aiSettings?.provider || 'offline',
    isListening,
    interimTranscript,
    voiceError,
    startVoiceInput,
    stopVoiceInput,
    cancelVoiceInput,
    playAudio,
    sendReply,
    restart: initConversation,
  };
}
