import { SkillType, StageId } from '@/domain/curriculum/types';
import { LearningRecord } from '@/domain/learning/types';

export interface SkillMasterySummary {
  skill: SkillType;
  label: string;
  koreanLabel: string;
  score: number; // 0 to 100
  itemsLearned: number;
  itemsMastered: number;
  accuracyRate: number; // 0 to 1
  isWeakArea: boolean;
}

export interface LearnerProfileSnapshot {
  currentStageId: StageId;
  stageName: string;
  stageOutcome: string;
  overallFluencyScore: number; // 0 to 100
  skills: Record<SkillType, SkillMasterySummary>;
  weakestSkills: SkillType[];
  strongestSkills: SkillType[];
  recommendedFocus: {
    skill: SkillType;
    reason: string;
    actionText: string;
  };
}

export const SKILL_METADATA: Record<
  SkillType,
  { label: string; koreanLabel: string; icon: string; description: string }
> = {
  vocabulary: {
    label: 'Vocabulary',
    koreanLabel: '어휘',
    icon: 'book-outline',
    description: 'Word recall, spelling, nuance, and retention over time',
  },
  grammar: {
    label: 'Grammar',
    koreanLabel: '문법',
    icon: 'git-branch-outline',
    description: 'Particles, verb conjugation, honorifics, and clause linkers',
  },
  listening: {
    label: 'Listening',
    koreanLabel: '듣기',
    icon: 'headset-outline',
    description: 'Connected speech perception, pronunciation, and auditory comprehension',
  },
  speaking: {
    label: 'Speaking & Pronunciation',
    koreanLabel: '말하기',
    icon: 'mic-outline',
    description: 'Hangul articulation, pitch flow, and conversational rhythm',
  },
  reading: {
    label: 'Reading',
    koreanLabel: '읽기',
    icon: 'document-text-outline',
    description: 'Sentence comprehension, graded dialogues, and Hangul block decoding',
  },
  writing: {
    label: 'Writing',
    koreanLabel: '쓰기',
    icon: 'create-outline',
    description: 'SOV word arrangement, particle placement, and spelling accuracy',
  },
};

/**
 * Calculates a 6-dimensional skill profile from user learning records and curriculum metadata.
 */
export function calculateLearnerProfile(
  recordsMap: Map<string, LearningRecord>,
  itemTypeMap: Map<string, string>
): LearnerProfileSnapshot {
  const skillStats: Record<
    SkillType,
    { total: number; mastered: number; correct: number; incorrect: number }
  > = {
    vocabulary: { total: 0, mastered: 0, correct: 0, incorrect: 0 },
    grammar: { total: 0, mastered: 0, correct: 0, incorrect: 0 },
    listening: { total: 0, mastered: 0, correct: 0, incorrect: 0 },
    speaking: { total: 0, mastered: 0, correct: 0, incorrect: 0 },
    reading: { total: 0, mastered: 0, correct: 0, incorrect: 0 },
    writing: { total: 0, mastered: 0, correct: 0, incorrect: 0 },
  };

  recordsMap.forEach((record, itemId) => {
    if (record.status === 'unseen') return;
    const type = itemTypeMap.get(itemId) || 'vocabulary';
    const isMastered = record.status === 'mastered';
    const totalReviews = record.correctCount + record.incorrectCount;

    // Distribute item progress across mapped skill dimensions
    if (type === 'vocabulary') {
      skillStats.vocabulary.total += 1;
      if (isMastered) skillStats.vocabulary.mastered += 1;
      skillStats.vocabulary.correct += record.correctCount;
      skillStats.vocabulary.incorrect += record.incorrectCount;

      // Reading benefit
      skillStats.reading.total += 1;
      if (isMastered) skillStats.reading.mastered += 1;
      skillStats.reading.correct += record.correctCount;
      skillStats.reading.incorrect += record.incorrectCount;
    } else if (type === 'grammar') {
      skillStats.grammar.total += 1;
      if (isMastered) skillStats.grammar.mastered += 1;
      skillStats.grammar.correct += record.correctCount;
      skillStats.grammar.incorrect += record.incorrectCount;

      // Writing benefit
      skillStats.writing.total += 1;
      if (isMastered) skillStats.writing.mastered += 1;
      skillStats.writing.correct += record.correctCount;
      skillStats.writing.incorrect += record.incorrectCount;
    } else if (type.startsWith('hangul')) {
      skillStats.speaking.total += 1;
      skillStats.listening.total += 1;
      skillStats.reading.total += 1;
      if (isMastered) {
        skillStats.speaking.mastered += 1;
        skillStats.listening.mastered += 1;
        skillStats.reading.mastered += 1;
      }
      skillStats.speaking.correct += record.correctCount;
      skillStats.speaking.incorrect += record.incorrectCount;
    } else if (type === 'phrase') {
      skillStats.listening.total += 1;
      skillStats.speaking.total += 1;
      if (isMastered) {
        skillStats.listening.mastered += 1;
        skillStats.speaking.mastered += 1;
      }
      skillStats.listening.correct += record.correctCount;
      skillStats.listening.incorrect += record.incorrectCount;
    }
  });

  const skills = {} as Record<SkillType, SkillMasterySummary>;
  const skillScores: { skill: SkillType; score: number }[] = [];

  (Object.keys(SKILL_METADATA) as SkillType[]).forEach((skillKey) => {
    const stats = skillStats[skillKey];
    const reviews = stats.correct + stats.incorrect;
    const accuracy = reviews > 0 ? stats.correct / reviews : 1.0;

    // Weighted score: 50% from mastery volume (up to 30 items for base mastery) + 50% from review accuracy
    const volumeScore = Math.min(100, (stats.total * 2.5) + (stats.mastered * 5));
    const accuracyScore = reviews > 0 ? accuracy * 100 : Math.min(100, stats.total * 5);
    const score = Math.round((volumeScore * 0.45) + (accuracyScore * 0.55));

    // A weak area is flagged if the user has attempted items but has accuracy below 75%
    const isWeakArea = reviews >= 4 && accuracy < 0.75;

    skills[skillKey] = {
      skill: skillKey,
      label: SKILL_METADATA[skillKey].label,
      koreanLabel: SKILL_METADATA[skillKey].koreanLabel,
      score: Math.min(100, Math.max(0, score)),
      itemsLearned: stats.total,
      itemsMastered: stats.mastered,
      accuracyRate: accuracy,
      isWeakArea,
    };

    skillScores.push({ skill: skillKey, score });
  });

  skillScores.sort((a, b) => a.score - b.score);
  const weakestSkills = skillScores.slice(0, 2).map((s) => s.skill);
  const strongestSkills = skillScores.slice(-2).reverse().map((s) => s.skill);
  // Overall fluency score is based on weighted mastered items and retention accuracy
  const totalSkillScore = skillScores.reduce((acc, curr) => acc + curr.score, 0);
  const overallFluencyScore = Math.round(totalSkillScore / skillScores.length);

  // Compute total unique items learned and mastered across the app
  let totalUniqueLearned = 0;
  let totalUniqueMastered = 0;
  recordsMap.forEach((record) => {
    if (record.status !== 'unseen') {
      totalUniqueLearned += 1;
      if (record.status === 'mastered') {
        totalUniqueMastered += 1;
      }
    }
  });

  // Accurate Stage Determination based on concrete curriculum progression:
  // Stage 1 (Foundations): Starts at Level 1 (Hangul letters, batchim, greetings ~20-30 items)
  // Stage 2 (Everyday Korean): Unlocked once Stage 1 basics are covered (~30+ items)
  // Stage 3 (Independent): 60+ items with high grammar & dialogue mastery
  // Stage 4 (Advanced): 100+ items
  // Stage 5 (Mastery): 150+ items
  let currentStageId: StageId = 'stage-foundations';
  let stageName = 'Stage 1 — Foundations';
  let stageOutcome = 'Read Hangul & Introduce yourself';

  if (totalUniqueLearned >= 120 && overallFluencyScore >= 65) {
    currentStageId = 'stage-advanced';
    stageName = 'Stage 4 — Advanced Proficiency';
    stageOutcome = 'Understand authentic media & express nuanced ideas';
  } else if (totalUniqueLearned >= 70 && overallFluencyScore >= 45) {
    currentStageId = 'stage-independent';
    stageName = 'Stage 3 — Independent Communication';
    stageOutcome = 'Hold connected conversations & read graded stories';
  } else if (totalUniqueLearned >= 25) {
    currentStageId = 'stage-everyday';
    stageName = 'Stage 2 — Everyday Korean';
    stageOutcome = 'Daily routines, numbers, food & polite interactions';
  }

  // Recommended focus based on weak areas
  const weakSkillKey = weakestSkills[0] || 'vocabulary';
  let reason = `Target practice in ${SKILL_METADATA[weakSkillKey].label} will give you the fastest fluency gain.`;
  let actionText = `Practice ${SKILL_METADATA[weakSkillKey].label}`;

  if (skills.vocabulary.itemsLearned > 15 && skills.listening.score < skills.vocabulary.score - 10) {
    reason = 'You recognize many words visually—listening practice will train your ear for natural speech.';
    actionText = 'Train Auditory Recognition';
  }

  return {
    currentStageId,
    stageName,
    stageOutcome,
    overallFluencyScore,
    skills,
    weakestSkills,
    strongestSkills,
    recommendedFocus: {
      skill: weakSkillKey,
      reason,
      actionText,
    },
  };
}
