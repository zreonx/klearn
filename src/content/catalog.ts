import { LearningItem } from '@/domain/learning/types';
import { Curriculum, Lesson, Unit } from '@/domain/curriculum/types';
import { HANGUL_ITEMS } from './hangul/items';
import { VOCABULARY_ITEMS } from './vocabulary/items';
import { CURRICULUM_DATA } from './curriculum/curriculumData';
import { format } from 'date-fns';

const ALL_ITEMS: LearningItem[] = [...HANGUL_ITEMS, ...VOCABULARY_ITEMS];
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
   * Deterministically returns the Daily Word for a specific date (Section 14).
   * Generates a stable integer hash of the date string to index into vocabulary items.
   */
  getDailyWord(date: Date = new Date()): LearningItem {
    const vocabList = VOCABULARY_ITEMS;
    if (vocabList.length === 0) return ALL_ITEMS[0];

    const dateKey = format(date, 'yyyy-MM-dd');
    let hash = 0;
    for (let i = 0; i < dateKey.length; i++) {
      hash = (hash << 5) - hash + dateKey.charCodeAt(i);
      hash |= 0;
    }

    const index = Math.abs(hash) % vocabList.length;
    return vocabList[index];
  }
}

export const contentCatalog = new ContentCatalog();
