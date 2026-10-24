import { generateQuizQuestions, generateQuestionForItem, generateAcousticQuestion } from './generator';
import { LearningItem } from '../learning/types';

describe('Quiz Generator', () => {
  const sampleItems: LearningItem[] = [
    {
      id: 'item-1',
      type: 'vocabulary',
      korean: '안녕하세요',
      romanization: 'annyeonghaseyo',
      translation: 'Hello',
    },
    {
      id: 'item-2',
      type: 'vocabulary',
      korean: '감사합니다',
      romanization: 'gamsahamnida',
      translation: 'Thank you',
    },
    {
      id: 'item-3',
      type: 'vocabulary',
      korean: '물',
      romanization: 'mul',
      translation: 'Water',
    },
    {
      id: 'item-4',
      type: 'vocabulary',
      korean: '밥',
      romanization: 'bap',
      translation: 'Rice / Meal',
    },
  ];

  it('handles empty target items safely', () => {
    const questions = generateQuizQuestions([], sampleItems);
    expect(questions).toEqual([]);
  });

  it('generates question with valid correct answer and unique options', () => {
    const target = sampleItems[0];
    const question = generateQuestionForItem(target, sampleItems, 'korean_to_english');

    expect(question).not.toBeNull();
    if (!question) return;

    expect(question.prompt).toBe('안녕하세요');
    expect(question.options.length).toBeGreaterThanOrEqual(2);

    // Verify correct option exists
    const correctOpt = question.options.find((o) => o.id === question.correctAnswerId);
    expect(correctOpt).toBeDefined();
    expect(correctOpt?.isCorrect).toBe(true);
    expect(correctOpt?.label).toBe('Hello');

    // Verify option uniqueness
    const labels = question.options.map((o) => o.label);
    const uniqueLabels = new Set(labels);
    expect(uniqueLabels.size).toBe(labels.length);
  });

  it('generates english to korean question correctly', () => {
    const target = sampleItems[1];
    const question = generateQuestionForItem(target, sampleItems, 'english_to_korean');

    expect(question).not.toBeNull();
    if (!question) return;

    expect(question.prompt).toBe('Thank you');
    const correctOpt = question.options.find((o) => o.id === question.correctAnswerId);
    expect(correctOpt?.label).toBe('감사합니다');
  });

  it('generates a full quiz batch within requested question count', () => {
    const questions = generateQuizQuestions(sampleItems, sampleItems, {
      questionCount: 3,
    });
    expect(questions.length).toBe(3);
    for (const q of questions) {
      expect(q.options.some((o) => o.isCorrect)).toBe(true);
    }
  });

  it('generates particle_fill and sentence_assembly questions', () => {
    const grammarItem: LearningItem = {
      id: 'gram-part-1',
      type: 'grammar',
      korean: '은 / 는',
      translation: 'Topic Particle',
      examples: [
        {
          korean: '저는 학생이에요.',
          translation: 'I am a student.',
        },
      ],
    };

    const pool = [...sampleItems, grammarItem];

    const particleQ = generateQuestionForItem(grammarItem, pool, 'particle_fill');
    expect(particleQ).not.toBeNull();
    expect(particleQ?.correctAnswerId).toBeDefined();
    expect(particleQ?.options.some((o) => o.label === '은 / 는' && o.isCorrect)).toBe(true);

    const sentenceQ = generateQuestionForItem(grammarItem, pool, 'sentence_assembly');
    expect(sentenceQ).not.toBeNull();
    expect(sentenceQ?.options.some((o) => o.label === '저는 학생이에요.' && o.isCorrect)).toBe(true);
    expect(sentenceQ?.tiles).toBeDefined();
    expect(sentenceQ?.tiles?.length).toBeGreaterThanOrEqual(2);
    expect(sentenceQ?.tiles).toContain('저는');
    expect(sentenceQ?.correctAnswerText).toBe('저는 학생이에요.');
  });

  it('generates acoustic discrimination question with minimal pair options', () => {
    const acousticQ = generateAcousticQuestion();
    expect(acousticQ).toBeDefined();
    expect(acousticQ.type).toBe('acoustic_discrimination');
    expect(acousticQ.speakText).toBeTruthy();
    expect(acousticQ.options.length).toBeGreaterThanOrEqual(2);
    expect(acousticQ.options.some((o) => o.isCorrect)).toBe(true);
    expect(acousticQ.explanation).toBeTruthy();
  });
});
