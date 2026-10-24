import { LearningItem } from '../learning/types';
import { QuizQuestion, QuizOption, QuizQuestionType, QuizGenerationConfig } from './types';
import { MINIMAL_PAIR_SETS } from '@/content/hangul/minimalPairs';

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

    case 'particle_fill':
      // If item has an example sentence with a particle or is grammar
      if (targetItem.examples && targetItem.examples.length > 0) {
        const ex = targetItem.examples[0];
        prompt = ex.translation;
        subPrompt = `Complete the Korean sentence with the correct particle / word`;
        correctLabel = targetItem.korean;
        speakText = ex.korean;
      } else {
        prompt = targetItem.translation;
        subPrompt = 'Select the correct Korean particle / word';
        correctLabel = targetItem.korean;
        speakText = targetItem.korean;
      }
      break;

    case 'sentence_assembly': {
      if (targetItem.examples && targetItem.examples.length > 0) {
        const ex = targetItem.examples[0];
        prompt = ex.translation;
        subPrompt = 'Assemble the Korean sentence in correct word order';
        correctLabel = ex.korean;
        speakText = ex.korean;
      } else {
        prompt = targetItem.translation;
        subPrompt = 'Assemble the Korean phrase in correct word order';
        correctLabel = targetItem.korean;
        speakText = targetItem.korean;
      }
      break;
    }

    case 'acoustic_discrimination':
      return generateAcousticQuestion(rng);
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
      case 'particle_fill':
        return item.korean;
      case 'hangul_to_romanization':
        return item.romanization || item.translation;
      case 'sentence_assembly':
        return item.examples && item.examples.length > 0 ? item.examples[0].korean : item.korean;
      default:
        return item.korean;
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

  // Generate word tiles if sentence assembly
  let tiles: string[] | undefined;
  if (type === 'sentence_assembly') {
    const rawTokens = correctLabel.split(/\s+/).filter(Boolean);
    const cleanTokens = rawTokens.map((t) => t.replace(/[.,?!~]/g, ''));
    const distractorTileCandidates = candidatePool
      .filter((it) => it.id !== targetItem.id && it.korean.length <= 6)
      .map((it) => it.korean);
    const extraTile =
      distractorTileCandidates.length > 0 && cleanTokens.length <= 4
        ? distractorTileCandidates[Math.floor(rng() * distractorTileCandidates.length)]
        : undefined;

    const tilePool = extraTile ? [...cleanTokens, extraTile] : cleanTokens;
    tiles = shuffleArray(tilePool, rng);
  }

  return {
    id: `q-${targetItem.id}-${type}`,
    itemId: targetItem.id,
    type,
    prompt,
    subPrompt,
    speakText,
    options: shuffledOptions,
    correctAnswerId: `opt-correct-${targetItem.id}`,
    correctAnswerText: correctLabel,
    tiles,
    explanation: targetItem.explanation,
  };
}

/**
 * Generates an acoustic discrimination question testing plain vs. aspirated vs. tense sounds.
 */
export function generateAcousticQuestion(rng = Math.random): QuizQuestion {
  const chosenSet = MINIMAL_PAIR_SETS[Math.floor(rng() * MINIMAL_PAIR_SETS.length)];
  const target = chosenSet.items[Math.floor(rng() * chosenSet.items.length)];

  const options: QuizOption[] = chosenSet.items.map((it) => ({
    id: `opt-${it.id}`,
    label: `${it.korean} [${it.romanization}] — ${it.translation}`,
    isCorrect: it.id === target.id,
  }));

  return {
    id: `q-acoustic-${target.id}-${Math.floor(rng() * 10000)}`,
    itemId: target.id,
    type: 'acoustic_discrimination',
    prompt: 'Listen closely. Which sound did you hear?',
    subPrompt: `${chosenSet.title} • Plain vs. Aspirated vs. Tense`,
    speakText: target.korean,
    options: shuffleArray(options, rng),
    correctAnswerId: `opt-${target.id}`,
    correctAnswerText: target.korean,
    explanation: `${target.korean} [${target.romanization}] starts with '${target.consonantLetter}' (${target.consonantType} consonant).`,
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
    'particle_fill',
    'sentence_assembly',
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
