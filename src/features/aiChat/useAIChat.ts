import { useState, useEffect, useCallback, useRef } from 'react';
import { ChatMessage } from '@/domain/aiChat/types';
import { services } from '@/application/services';
import { AITutorSettings } from '@/domain/settings/types';
import { APP_CONFIG } from '@/config';
import { hapticService } from '@/infrastructure/haptics/hapticService';

const WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome-tutor-msg',
  role: 'assistant',
  content: `안녕하세요! (Hello!) I am your **Klearn Korean AI Tutor**.

Feel free to ask me anything anytime:
- **Grammar & Particles**: *은/는 vs. 이/가*, *에 vs. 에서*, *을/를*
- **Verb Conjugations**: *How to conjugate past, future, or irregulars*
- **Vocabulary & Nuances**: *Differences between words, counters, idioms*
- **Translations & Daily Phrases**: *How to say something naturally in Korean*

Tap one of the question prompts below, type a question, or tap the **microphone** to speak!`,
  koreanSnippet: '안녕하세요! 한국어 공부를 도와드릴게요.',
  timestamp: new Date().toISOString(),
};

export function useAIChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [inputText, setInputText] = useState<string>('');
  const [isAsking, setIsAsking] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [interimTranscript, setInterimTranscript] = useState<string>('');
  const [aiSettings, setAiSettings] = useState<AITutorSettings | undefined>(undefined);
  const [activeProviderName, setActiveProviderName] = useState<string>('Offline Knowledge Base');

  const mountedRef = useRef(true);

  // Load chat history & AI settings on mount
  useEffect(() => {
    mountedRef.current = true;
    async function loadData() {
      try {
        const [savedHistory, userSettings] = await Promise.all([
          services.aiChatRepo.getMessages(),
          services.settingsRepo.getUserSettings(),
        ]);

        if (mountedRef.current) {
          if (savedHistory && savedHistory.length > 0) {
            setMessages(savedHistory);
          }
          setAiSettings(userSettings.aiTutor);

          if (userSettings.aiTutor?.provider && userSettings.aiTutor.provider !== 'offline') {
            setActiveProviderName(`${userSettings.aiTutor.provider.toUpperCase()} AI`);
          } else if (process.env.EXPO_PUBLIC_GROQ_API_KEY || APP_CONFIG.ai.defaultGroqKey) {
            setActiveProviderName('Groq AI (Fast LPU)');
          } else {
            setActiveProviderName('Offline Knowledge Base');
          }
        }
      } catch {
        // Fallback gracefully
      }
    }
    loadData();
    return () => {
      mountedRef.current = false;
      services.voiceRecognition.cancelListening();
    };
  }, []);

  const sendMessage = useCallback(
    async (customPrompt?: string) => {
      const promptToSend = (customPrompt || inputText).trim();
      if (!promptToSend || isAsking) return;

      hapticService.lightTick();
      setInputText('');
      setInterimTranscript('');

      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: promptToSend,
        timestamp: new Date().toISOString(),
      };

      const nextMessages = [...messages, userMsg];
      setMessages(nextMessages);
      setIsAsking(true);

      try {
        const response = await services.aiChat.askTutor(nextMessages, promptToSend, aiSettings);

        const tutorMsg: ChatMessage = {
          id: `tutor-${Date.now()}`,
          role: 'assistant',
          content: response.content,
          koreanSnippet: response.koreanSnippet,
          timestamp: new Date().toISOString(),
        };

        const updatedHistory = [...nextMessages, tutorMsg];
        if (mountedRef.current) {
          setMessages(updatedHistory);
          setIsAsking(false);
          setActiveProviderName(response.provider);
        }

        // Persist to local storage
        await services.aiChatRepo.saveMessages(updatedHistory);
      } catch {
        if (mountedRef.current) {
          setIsAsking(false);
        }
      }
    },
    [inputText, isAsking, messages, aiSettings]
  );

  const startVoiceInput = useCallback(async () => {
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
      }
    } catch {
      // Ignore
    }
  }, [aiSettings]);

  const stopVoiceInput = useCallback(async () => {
    setIsListening(false);
    try {
      const text = await services.voiceRecognition.stopListening(aiSettings?.apiKey);
      const finalText = text || interimTranscript;
      setInterimTranscript('');
      if (finalText.trim()) {
        setInputText(finalText.trim());
      }
      return finalText.trim();
    } catch {
      setInterimTranscript('');
      return '';
    }
  }, [aiSettings, interimTranscript]);

  const clearChat = useCallback(async () => {
    hapticService.lightTick();
    setMessages([WELCOME_MESSAGE]);
    await services.aiChatRepo.clearMessages();
  }, []);

  const speakSnippet = useCallback((text: string) => {
    hapticService.lightTick();
    services.speech.speak(text, { rate: 0.85 });
  }, []);

  return {
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
  };
}
