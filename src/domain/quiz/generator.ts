import { LearningItem } from '../learning/types';
import { QuizQuestion, QuizOption, QuizQuestionType, QuizGenerationConfig } from './types';

/**
 * Pure helper to pseudo-randomly or deterministically shuffle an array.
 */
export function shuffleArray<T>(items: T[], rng = Math.random): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Generates a quiz question for a single target item, using candidate items for distractors.
 */
export function generateQuestionForItem(
  targetItem: LearningItem,
  candidatePool: LearningItem[],
  type: QuizQuestionType,
  rng = Math.random
): QuizQuestion | null {
  // Determine prompt and correct answer based on question type
  let prompt = '';
  let subPrompt: string | undefined;
  let correctLabel = '';
  let speakText: string | undefined;

  switch (type) {
    case 'korean_to_english':
      prompt = targetItem.korean;
      subPrompt = 'What is the English meaning?';
      correctLabel = targetItem.translation;
      speakText = targetItem.korean;
      break;

    case 'english_to_korean':
      prompt = targetItem.translation;
      subPrompt = 'Select the correct Korean word';
      correctLabel = targetItem.korean;
      speakText = undefined;
      break;

    case 'listening_recognition':
      prompt = 'Listen and choose the meaning';
      subPrompt = targetItem.romanization ? `[${targetItem.romanization}]` : undefined;
      correctLabel = targetItem.translation;
      speakText = targetItem.korean;
      break;

    case 'hangul_to_romanization':
      if (!targetItem.romanization) return null;
      prompt = targetItem.korean;
      subPrompt = 'Select the correct pronunciation / romanization';
      correctLabel = targetItem.romanization;
      speakText = targetItem.korean;
      break;
  }

  // Filter distractors to exclude the target item itself
  const validDistractors = candidatePool.filter(
    (item) => item.id !== targetItem.id
  );

  // Pick distractor labels depending on question type
  const getLabelForItem = (item: LearningItem): string => {
    switch (type) {
      case 'korean_to_english':
      case 'listening_recognition':
        return item.translation;
      case 'english_to_korean':
        return item.korean;
      case 'hangul_to_romanization':
        return item.romanization || item.translation;
    }
  };

  const distractorLabels = Array.from(
    new Set(
      validDistractors
        .map(getLabelForItem)
        .filter((label) => label && label !== correctLabel)
    )
  );

  const shuffledDistractorLabels = shuffleArray(distractorLabels, rng).slice(0, 3);

  // Construct options: 1 correct + up to 3 distractors
  const optionList: QuizOption[] = [
    {
      id: `opt-correct-${targetItem.id}`,
      label: correctLabel,
      isCorrect: true,
    },
    ...shuffledDistractorLabels.map((label, idx) => ({
      id: `opt-distractor-${targetItem.id}-${idx}`,
      label,
      isCorrect: false,
    })),
  ];

  const shuffledOptions = shuffleArray(optionList, rng);

  return {
    id: `q-${targetItem.id}-${type}`,
    itemId: targetItem.id,
    type,
    prompt,
    subPrompt,
    speakText,
    options: shuffledOptions,
    correctAnswerId: `opt-correct-${targetItem.id}`,
    explanation: targetItem.explanation,
  };
}

/**
 * Generates an entire quiz session question set from target items and catalog pool.
 */
export function generateQuizQuestions(
  targetItems: LearningItem[],
  catalogPool: LearningItem[],
  config: QuizGenerationConfig = {},
  rng = Math.random
): QuizQuestion[] {
  if (targetItems.length === 0) return [];

  const questionCount = config.questionCount ?? Math.min(targetItems.length, 10);
  const types = config.types ?? [
    'korean_to_english',
    'english_to_korean',
    'listening_recognition',
  ];

  const shuffledTargets = shuffleArray(targetItems, rng).slice(0, questionCount);
  const questions: QuizQuestion[] = [];

  for (let i = 0; i < shuffledTargets.length; i++) {
    const target = shuffledTargets[i];
    const qType = types[i % types.length];
    const question = generateQuestionForItem(target, catalogPool, qType, rng);
    if (question) {
      questions.push(question);
    }
  }

  return questions;
}
