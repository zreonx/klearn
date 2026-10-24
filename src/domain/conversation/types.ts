export type ConversationRole = 'user' | 'assistant';

export type FormalityRegister = 'informal-polite' | 'formal-polite' | 'casual';

export interface CoachingFeedback {
  isCorrectRegister: boolean;
  tip?: string;
  detectedEnding?: string;
}

export interface ConversationMessage {
  id: string;
  role: ConversationRole;
  korean: string;
  romanization: string;
  translation: string;
  formality: FormalityRegister;
  audioText: string;
  feedback?: CoachingFeedback;
  timestamp: string;
}

export interface SuggestedReply {
  id: string;
  korean: string;
  romanization: string;
  translation: string;
  formality: FormalityRegister;
  tip?: string;
}

export interface ScenarioTurn {
  id: string;
  partnerPrompt: {
    korean: string;
    romanization: string;
    translation: string;
    formality: FormalityRegister;
    audioText: string;
  };
  suggestedReplies: SuggestedReply[];
  expectedKeywords?: string[];
  coachingTip?: string;
}

export interface ConversationScenario {
  id: string;
  title: string;
  koreanTitle: string;
  description: string;
  level: string;
  targetFormality: FormalityRegister;
  icon: string;
  turns: ScenarioTurn[];
}
