import { AITutorSettings } from '@/domain/settings/types';
import { SuggestedReply } from '@/domain/conversation/types';
import { APP_CONFIG } from '@/config';

export interface AITutorResponse {
  korean: string;
  romanization: string;
  translation: string;
  coachingTip?: string;
  suggestedReplies: SuggestedReply[];
}

const SYSTEM_PROMPT = `
You are a friendly, encouraging native Korean tutor and roleplay conversation partner in Seoul.
Your goal is to help a learner practice conversational Korean.
Respond naturally in Korean appropriate for the conversation topic and the learner's skill level.
CRITICAL: You MUST respond strictly in valid JSON matching this schema:
{
  "korean": "Your Korean response here (e.g. 네, 아이스 아메리카노 준비해 드리겠습니다!)",
  "romanization": "Revised Romanization of your Korean response",
  "translation": "Natural English translation of your response",
  "coachingTip": "Brief grammar, formality, or cultural tip on how the learner can respond (in English)",
  "suggestedReplies": [
    {
      "id": "rep-1",
      "korean": "First suggested response the learner could say back",
      "romanization": "Romanization",
      "translation": "English translation",
      "formality": "informal-polite",
      "tip": "Short explanation of this option"
    },
    {
      "id": "rep-2",
      "korean": "Second alternative suggested response",
      "romanization": "Romanization",
      "translation": "English translation",
      "formality": "informal-polite",
      "tip": "Short explanation of this option"
    }
  ]
}
Do NOT include markdown backticks around the json. Only return raw JSON.
`.trim();

export class AITutorService {
  async generateReply(
    history: Array<{ role: 'user' | 'assistant'; content: string }>,
    scenarioContext: string,
    settings?: AITutorSettings
  ): Promise<AITutorResponse | null> {
    const effectiveKey =
      settings?.apiKey?.trim() ||
      process.env.EXPO_PUBLIC_GROQ_API_KEY ||
      APP_CONFIG.ai.defaultGroqKey ||
      '';

    const provider = settings?.provider || (effectiveKey ? 'groq' : 'offline');

    if (provider === 'offline' || !effectiveKey) {
      return null;
    }

    try {
      if (provider === 'groq') {
        return await this.callGroq(history, scenarioContext, effectiveKey);
      } else if (provider === 'openrouter') {
        return await this.callOpenRouter(history, scenarioContext, effectiveKey);
      } else if (provider === 'gemini') {
        return await this.callGemini(history, scenarioContext, effectiveKey);
      } else if (provider === 'deepseek') {
        return await this.callDeepSeek(history, scenarioContext, effectiveKey);
      }
    } catch (err) {
      // Gracefully fall back to offline engine on any error (network offline, bad key, rate limit)
      return null;
    }

    return null;
  }

  private cleanJsonText(rawText: string): string {
    let cleaned = rawText.trim();
    if (cleaned.startsWith('```json')) {
      cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }
    return cleaned.trim();
  }

  private parseTutorJson(rawText: string): AITutorResponse | null {
    try {
      const parsed = JSON.parse(this.cleanJsonText(rawText));
      return {
        korean: parsed.korean,
        romanization: parsed.romanization || '',
        translation: parsed.translation || '',
        coachingTip: parsed.coachingTip,
        suggestedReplies: (parsed.suggestedReplies || []).map((r: any, idx: number) => ({
          id: r.id || `rep-${idx}`,
          korean: r.korean || '',
          romanization: r.romanization || '',
          translation: r.translation || '',
          formality: r.formality || 'informal-polite',
          tip: r.tip,
        })),
      };
    } catch {
      return null;
    }
  }

  private async callGroq(
    history: Array<{ role: 'user' | 'assistant'; content: string }>,
    scenarioContext: string,
    apiKey: string
  ): Promise<AITutorResponse | null> {
    const url = 'https://api.groq.com/openai/v1/chat/completions';

    const messages = [
      { role: 'system', content: `${SYSTEM_PROMPT}\n\nCurrent Scenario: ${scenarioContext}` },
      ...history.map((h) => ({
        role: h.role,
        content: h.content,
      })),
    ];

    const modelsToTry = [
      'qwen/qwen3.8-27b',
      'openai/gpt-oss-120b',
      'openai/gpt-oss-20b',
      'llama-3.3-70b-versatile',
      'llama-3.1-8b-instant',
    ];

    for (const model of modelsToTry) {
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
            response_format: { type: 'json_object' },
            temperature: 0.7,
          }),
        });

        if (!response.ok) continue;
        const data = await response.json();
        const rawText = data?.choices?.[0]?.message?.content;
        if (!rawText) continue;

        const result = this.parseTutorJson(rawText);
        if (result) return result;
      } catch {
        continue;
      }
    }

    return null;
  }

  private async callOpenRouter(
    history: Array<{ role: 'user' | 'assistant'; content: string }>,
    scenarioContext: string,
    apiKey: string
  ): Promise<AITutorResponse | null> {
    const url = 'https://openrouter.ai/api/v1/chat/completions';

    const messages = [
      { role: 'system', content: `${SYSTEM_PROMPT}\n\nCurrent Scenario: ${scenarioContext}` },
      ...history.map((h) => ({
        role: h.role,
        content: h.content,
      })),
    ];

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://github.com/zreonx/klearn',
        'X-Title': 'Klearn Korean Learning',
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3.3-70b-instruct:free',
        messages,
        response_format: { type: 'json_object' },
        temperature: 0.7,
      }),
    });

    if (!response.ok) return null;
    const data = await response.json();
    const rawText = data?.choices?.[0]?.message?.content;
    if (!rawText) return null;

    return this.parseTutorJson(rawText);
  }

  private async callGemini(
    history: Array<{ role: 'user' | 'assistant'; content: string }>,
    scenarioContext: string,
    apiKey: string
  ): Promise<AITutorResponse | null> {
    // gemini-1.5-flash is the most stable and universally available free tier model
    const models = ['gemini-1.5-flash', 'gemini-2.0-flash'];

    for (const model of models) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

        const contents = [
          {
            role: 'user',
            parts: [
              {
                text: `${SYSTEM_PROMPT}\n\nScenario / Context: ${scenarioContext}\n\nConversation so far:\n${history
                  .map((h) => `${h.role === 'user' ? 'Learner' : 'Tutor'}: ${h.content}`)
                  .join('\n')}`,
              },
            ],
          },
        ];

        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents,
            generationConfig: {
              responseMimeType: 'application/json',
              temperature: 0.7,
            },
          }),
        });

        if (!response.ok) continue;
        const data = await response.json();
        const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!rawText) continue;

        const result = this.parseTutorJson(rawText);
        if (result) return result;
      } catch {
        continue;
      }
    }

    return null;
  }

  private async callDeepSeek(
    history: Array<{ role: 'user' | 'assistant'; content: string }>,
    scenarioContext: string,
    apiKey: string
  ): Promise<AITutorResponse | null> {
    const url = 'https://api.deepseek.com/chat/completions';

    const messages = [
      { role: 'system', content: `${SYSTEM_PROMPT}\n\nCurrent Scenario: ${scenarioContext}` },
      ...history.map((h) => ({
        role: h.role,
        content: h.content,
      })),
    ];

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages,
        response_format: { type: 'json_object' },
        temperature: 0.7,
      }),
    });

    if (!response.ok) return null;
    const data = await response.json();
    const rawText = data?.choices?.[0]?.message?.content;
    if (!rawText) return null;

    const parsed = JSON.parse(rawText);
    return {
      korean: parsed.korean,
      romanization: parsed.romanization || '',
      translation: parsed.translation || '',
      coachingTip: parsed.coachingTip,
      suggestedReplies: (parsed.suggestedReplies || []).map((r: any, idx: number) => ({
        id: r.id || `rep-${idx}`,
        korean: r.korean || '',
        romanization: r.romanization || '',
        translation: r.translation || '',
        formality: r.formality || 'informal-polite',
        tip: r.tip,
      })),
    };
  }
}

export const aiTutorService = new AITutorService();
