export type ChatRole = 'user' | 'assistant';

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  koreanSnippet?: string;
  timestamp: string;
}

export interface SuggestedQuestionPrompt {
  id: string;
  category: 'grammar' | 'vocab' | 'culture' | 'translation';
  title: string;
  prompt: string;
}

export const SUGGESTED_QUESTION_PROMPTS: SuggestedQuestionPrompt[] = [
  {
    id: 'p-1',
    category: 'grammar',
    title: '은/는 vs. 이/가',
    prompt: 'What is the difference between topic particle 은/는 and subject particle 이/가? Can you provide simple examples?',
  },
  {
    id: 'p-2',
    category: 'grammar',
    title: 'ㅂ Irregular Verbs',
    prompt: 'How does ㅂ irregular verb conjugation work (like 덥다 or 춥다 becoming 더워요 / 추워요)?',
  },
  {
    id: 'p-3',
    category: 'grammar',
    title: '에 vs. 에서 (Locations)',
    prompt: 'When do I use destination particle 에 versus action location particle 에서?',
  },
  {
    id: 'p-4',
    category: 'vocab',
    title: 'Sino vs. Native Numbers',
    prompt: 'When should I use Sino-Korean numbers (일, 이, 삼) versus Native Korean numbers (하나, 둘, 셋)?',
  },
  {
    id: 'p-5',
    category: 'grammar',
    title: '-아요/어요 vs. -습니다',
    prompt: 'How do I choose between informal polite (-아요/어요) and formal deferential (-습니다)?',
  },
  {
    id: 'p-6',
    category: 'vocab',
    title: 'Ordering Coffee in Seoul',
    prompt: 'What are the most common phrases used when ordering drinks at a Korean cafe?',
  },
  {
    id: 'p-7',
    category: 'culture',
    title: 'Korean Honorifics (존댓말)',
    prompt: 'Why is age and formality so important in Korean society and language?',
  },
  {
    id: 'p-8',
    category: 'vocab',
    title: 'Slang & Texting (ㅋㅋ, ㅠㅠ)',
    prompt: 'What are popular Korean texting abbreviations and daily slang words among young Koreans?',
  },
];
