import { ChatMessage } from '@/domain/aiChat/types';
import { getOfflineTutorAnswer } from '@/domain/aiChat/offlineTutor';
import { AITutorSettings } from '@/domain/settings/types';
import { APP_CONFIG } from '@/config';
import { logger } from '@/lib/logger';

const SYSTEM_PROMPT = `
You are Klearn's Korean Language AI Tutor.
Your mission is to answer any question from learners about Korean grammar, vocabulary, particle distinctions, verb conjugations, pronunciation rules, translations, and Korean culture.

Guidelines:
1. Always provide written Korean Hangul with Revised Romanization and natural English translation.
2. Structure explanations clearly using clean Markdown (headings, bullet points, bold text).
3. If explaining grammar or conjugations, show clear formulas (e.g. Stem + -아요/어요) and side-by-side examples.
4. Keep answers focused, practical, and encouraging. Avoid overwhelming walls of text.
`.trim();

export interface AIChatResponse {
  content: string;
  koreanSnippet?: string;
  provider: string;
}

export class AIChatService {
  async askTutor(
    history: ChatMessage[],
    userQuestion: string,
    settings?: AITutorSettings
  ): Promise<AIChatResponse> {
    const trimmedQuestion = userQuestion.trim();
    if (!trimmedQuestion) {
      return {
        content: 'Please ask a question about Korean grammar, vocabulary, or culture.',
        provider: 'offline',
      };
    }

    const effectiveKey =
      settings?.apiKey?.trim() ||
      process.env.EXPO_PUBLIC_GROQ_API_KEY ||
      APP_CONFIG.ai.defaultGroqKey ||
      '';

    const provider = settings?.provider || (effectiveKey ? 'groq' : 'offline');

    // If online AI is enabled and we have a key
    if (provider !== 'offline' && effectiveKey) {
      try {
        if (provider === 'groq') {
          const aiText = await this.callGroq(history, trimmedQuestion, effectiveKey);
          if (aiText) {
            return {
              content: aiText,
              koreanSnippet: this.extractFirstKoreanSnippet(aiText),
              provider: 'Groq AI (Llama 3.3)',
            };
          }
        } else if (provider === 'gemini') {
          const aiText = await this.callGemini(history, trimmedQuestion, effectiveKey);
          if (aiText) {
            return {
              content: aiText,
              koreanSnippet: this.extractFirstKoreanSnippet(aiText),
              provider: 'Google Gemini',
            };
          }
        } else if (provider === 'openrouter') {
          const aiText = await this.callOpenRouter(history, trimmedQuestion, effectiveKey);
          if (aiText) {
            return {
              content: aiText,
              koreanSnippet: this.extractFirstKoreanSnippet(aiText),
              provider: 'OpenRouter AI',
            };
          }
        } else if (provider === 'deepseek') {
          const aiText = await this.callDeepSeek(history, trimmedQuestion, effectiveKey);
          if (aiText) {
            return {
              content: aiText,
              koreanSnippet: this.extractFirstKoreanSnippet(aiText),
              provider: 'DeepSeek AI',
            };
          }
        }
      } catch (err) {
        logger.warn('AI Tutor call failed, falling back to offline knowledge base:', err);
      }
    }

    // Offline built-in pedagogical knowledge fallback
    const offlineResult = getOfflineTutorAnswer(trimmedQuestion);
    return {
      content: offlineResult.answer,
      koreanSnippet: offlineResult.koreanSnippet,
      provider: 'Klearn Offline Knowledge Base',
    };
  }

  private extractFirstKoreanSnippet(text: string): string | undefined {
    const koreanMatch = text.match(/[가-힣]{2,}(?:\s+[가-힣]{1,})*/);
    return koreanMatch ? koreanMatch[0] : undefined;
  }

  private async callGroq(
    history: ChatMessage[],
    question: string,
    apiKey: string
  ): Promise<string | null> {
    const url = 'https://api.groq.com/openai/v1/chat/completions';

    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...history.slice(-8).map((h) => ({
        role: h.role,
        content: h.content,
      })),
      { role: 'user', content: question },
    ];

    const models = [
      'qwen/qwen3.8-27b',
      'openai/gpt-oss-120b',
      'openai/gpt-oss-20b',
      'llama-3.3-70b-versatile',
      'llama-3.1-8b-instant',
    ];

    for (const model of models) {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model,
            messages,
            temperature: 0.6,
            max_tokens: 1000,
          }),
        });

        if (!response.ok) continue;
        const data = await response.json();
        const text = data?.choices?.[0]?.message?.content;
        if (text) return text.trim();
      } catch {
        continue;
      }
    }

    return null;
  }

  private async callGemini(
    history: ChatMessage[],
    question: string,
    apiKey: string
  ): Promise<string | null> {
    const models = ['gemini-1.5-flash', 'gemini-2.0-flash'];

    for (const model of models) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const conversationText = history
          .slice(-6)
          .map((h) => `${h.role === 'user' ? 'Learner' : 'Tutor'}: ${h.content}`)
          .join('\n');

        const prompt = `${SYSTEM_PROMPT}\n\nChat History:\n${conversationText}\n\nLearner Question:\n${question}`;

        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        });

        if (!response.ok) continue;
        const data = await response.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) return text.trim();
      } catch {
        continue;
      }
    }

    return null;
  }

  private async callOpenRouter(
    history: ChatMessage[],
    question: string,
    apiKey: string
  ): Promise<string | null> {
    const url = 'https://openrouter.ai/api/v1/chat/completions';
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...history.slice(-6).map((h) => ({ role: h.role, content: h.content })),
      { role: 'user', content: question },
    ];

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
          'HTTP-Referer': 'https://github.com/zreonx/klearn',
          'X-Title': 'Klearn Korean AI Tutor',
        },
        body: JSON.stringify({
          model: 'meta-llama/llama-3.3-70b-instruct:free',
          messages,
          temperature: 0.6,
        }),
      });

      if (!response.ok) return null;
      const data = await response.json();
      return data?.choices?.[0]?.message?.content?.trim() || null;
    } catch {
      return null;
    }
  }

  private async callDeepSeek(
    history: ChatMessage[],
    question: string,
    apiKey: string
  ): Promise<string | null> {
    const url = 'https://api.deepseek.com/chat/completions';
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...history.slice(-6).map((h) => ({ role: h.role, content: h.content })),
      { role: 'user', content: question },
    ];

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages,
          temperature: 0.6,
        }),
      });

      if (!response.ok) return null;
      const data = await response.json();
      return data?.choices?.[0]?.message?.content?.trim() || null;
    } catch {
      return null;
    }
  }
}

export const aiChatService = new AIChatService();
