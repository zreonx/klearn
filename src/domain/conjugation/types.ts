/**
 * Domain types for Korean Verb & Adjective Conjugation.
 */

export type WordType = 'verb' | 'adjective';

export type IrregularType =
  | 'regular'
  | 'ㄷ-irregular'
  | 'ㅂ-irregular'
  | 'ㅅ-irregular'
  | 'ㅡ-irregular'
  | '르-irregular'
  | 'ㅎ-irregular'
  | 'ㄹ-irregular';

export interface ConjugationResult {
  root: string;
  meaning: string;
  wordType: WordType;
  irregularType: IrregularType;
  stem: string;
  presentPolite: string;      // -아요/어요
  formalPolite: string;       // -습니다/습니까
  pastPolite: string;         // -았어요/었어요
  futurePolite: string;       // -(으)ㄹ 거예요
  politeRequest?: string;     // -(으)세요 (verbs only)
  negationShort: string;      // 안 ~
  negationLong: string;       // ~지 않아요
  ruleExplanation: string;
}

export interface CuratedPredicate {
  root: string;
  meaning: string;
  wordType: WordType;
  irregularType: IrregularType;
  level: number;
}
