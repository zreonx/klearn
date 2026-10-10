import { LearningItem } from '@/domain/learning/types';
import { Curriculum, Lesson, Unit } from '@/domain/curriculum/types';
import { HANGUL_ITEMS } from './hangul/items';
import { VOCABULARY_ITEMS } from './vocabulary/items';
import { DICTIONARY_ENTRIES } from './dictionary/dictionaryData';
import { CURRICULUM_DATA } from './curriculum/curriculumData';
import { format } from 'date-fns';

const ALL_ITEMS: LearningItem[] = [...HANGUL_ITEMS, ...VOCABULARY_ITEMS, ...DICTIONARY_ENTRIES];
const ITEM_MAP = new Map<string, LearningItem>(ALL_ITEMS.map((item) => [item.id, item]));

export class ContentCatalog {
  getAllItems(): LearningItem[] {
    return ALL_ITEMS;
  }

  getItemById(id: string): LearningItem | undefined {
    return ITEM_MAP.get(id);
  }

  getCurriculum(): Curriculum {
    return CURRICULUM_DATA;
  }

  getLessonById(lessonId: string): Lesson | undefined {
    for (const level of CURRICULUM_DATA.levels) {
      for (const unit of level.units) {
        for (const lesson of unit.lessons) {
          if (lesson.id === lessonId) return lesson;
        }
      }
    }
    return undefined;
  }

  /**
   * Returns all curated Korean dictionary entries.
   */
  getDictionaryEntries() {
    return DICTIONARY_ENTRIES;
  }

  /**
   * Deterministically returns the Daily Word for a specific date.
   * Draws from the rich curated Korean dictionary bank first,
   * falling back to the lesson vocabulary pool.
   */
  getDailyWord(date: Date = new Date()): LearningItem {
    const dictionaryPool = DICTIONARY_ENTRIES.filter((item) => item.type === 'vocabulary');
    const pool = dictionaryPool.length > 0 ? dictionaryPool : VOCABULARY_ITEMS;

    const dateKey = `word-${format(date, 'yyyy-MM-dd')}`;
    let hash = 0;
    for (let i = 0; i < dateKey.length; i++) {
      hash = (hash << 5) - hash + dateKey.charCodeAt(i);
      hash |= 0;
    }

    const index = Math.abs(hash) % pool.length;
    return pool[index];
  }

  /**
   * Deterministically returns the Daily Phrase for a specific date.
   * Filters specifically for conversational phrases and expressions.
   */
  getDailyPhrase(date: Date = new Date()): LearningItem {
    const phraseList = VOCABULARY_ITEMS.filter((item) => item.type === 'phrase');
    const pool = phraseList.length > 0 ? phraseList : VOCABULARY_ITEMS;

    const dateKey = `phrase-${format(date, 'yyyy-MM-dd')}`;
    let hash = 0;
    for (let i = 0; i < dateKey.length; i++) {
      hash = (hash << 5) - hash + dateKey.charCodeAt(i);
      hash |= 0;
    }

    const index = Math.abs(hash) % pool.length;
    return pool[index];
  }

  /**
   * Deterministically returns the Daily Practical Sentence for a specific date.
   * Prioritizes communicative full sentences and authentic expressions.
   */
  getDailySentence(date: Date = new Date()): LearningItem {
    const sentenceList = VOCABULARY_ITEMS.filter(
      (item) => item.tags?.includes('sentence') || (item.type === 'phrase' && item.korean.length >= 6)
    );
    const pool = sentenceList.length > 0 ? sentenceList : VOCABULARY_ITEMS;

    const dateKey = `sentence-${format(date, 'yyyy-MM-dd')}`;
    let hash = 0;
    for (let i = 0; i < dateKey.length; i++) {
      hash = (hash << 5) - hash + dateKey.charCodeAt(i);
      hash |= 0;
    }

    const index = Math.abs(hash) % pool.length;
    return pool[index];
  }
}

export const contentCatalog = new ContentCatalog();
