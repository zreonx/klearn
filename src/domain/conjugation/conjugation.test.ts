import { conjugatePredicate } from './engine';
import { CURATED_PREDICATES } from './curatedVerbs';

describe('Korean Conjugation Engine', () => {
  describe('Regular Verbs and Adjectives', () => {
    it('conjugates 가다 (To go) correctly', () => {
      const res = conjugatePredicate('가다', 'verb');
      expect(res.presentPolite).toBe('가요');
      expect(res.formalPolite).toBe('갑니다');
      expect(res.pastPolite).toBe('갔어요');
      expect(res.futurePolite).toBe('갈 거예요');
      expect(res.politeRequest).toBe('가세요');
      expect(res.negationLong).toBe('가지 않아요');
    });

    it('conjugates 먹다 (To eat) correctly', () => {
      const res = conjugatePredicate('먹다', 'verb');
      expect(res.presentPolite).toBe('먹어요');
      expect(res.formalPolite).toBe('먹습니다');
      expect(res.pastPolite).toBe('먹었어요');
      expect(res.futurePolite).toBe('먹을 거예요');
      expect(res.politeRequest).toBe('먹으세요');
      expect(res.negationShort).toBe('안 먹어요');
    });

    it('conjugates 보다 (To see/watch) with vowel contraction', () => {
      const res = conjugatePredicate('보다', 'verb');
      expect(res.presentPolite).toBe('봐요');
      expect(res.pastPolite).toBe('봤어요');
      expect(res.futurePolite).toBe('볼 거예요');
      expect(res.formalPolite).toBe('봅니다');
    });

    it('conjugates 마시다 (To drink) with ㅣ contraction', () => {
      const res = conjugatePredicate('마시다', 'verb');
      expect(res.presentPolite).toBe('마셔요');
      expect(res.pastPolite).toBe('마셨어요');
      expect(res.futurePolite).toBe('마실 거예요');
    });

    it('conjugates 공부하다 (To study) with 하다 contraction', () => {
      const res = conjugatePredicate('공부하다', 'verb');
      expect(res.presentPolite).toBe('공부해요');
      expect(res.formalPolite).toBe('공부합니다');
      expect(res.pastPolite).toBe('공부했어요');
      expect(res.futurePolite).toBe('공부할 거예요');
      expect(res.politeRequest).toBe('공부하세요');
    });
  });

  describe('Irregular Verbs and Adjectives', () => {
    it('conjugates 듣다 (ㄷ-irregular: listen -> 들어요)', () => {
      const res = conjugatePredicate('듣다');
      expect(res.irregularType).toBe('ㄷ-irregular');
      expect(res.presentPolite).toBe('들어요');
      expect(res.formalPolite).toBe('듣습니다');
      expect(res.pastPolite).toBe('들었어요');
      expect(res.futurePolite).toBe('들을 거예요');
      expect(res.politeRequest).toBe('들으세요');
    });

    it('conjugates 춥다 (ㅂ-irregular: cold -> 추워요)', () => {
      const res = conjugatePredicate('춥다');
      expect(res.irregularType).toBe('ㅂ-irregular');
      expect(res.presentPolite).toBe('추워요');
      expect(res.formalPolite).toBe('춥습니다');
      expect(res.pastPolite).toBe('추웠어요');
      expect(res.futurePolite).toBe('추울 거예요');
    });

    it('conjugates 바쁘다 (ㅡ-irregular: busy -> 바빠요)', () => {
      const res = conjugatePredicate('바쁘다');
      expect(res.irregularType).toBe('ㅡ-irregular');
      expect(res.presentPolite).toBe('바빠요');
      expect(res.formalPolite).toBe('바쁩니다');
      expect(res.pastPolite).toBe('바빴어요');
      expect(res.futurePolite).toBe('바쁠 거예요');
    });

    it('conjugates 빠르다 (르-irregular: fast -> 빨라요)', () => {
      const res = conjugatePredicate('빠르다');
      expect(res.irregularType).toBe('르-irregular');
      expect(res.presentPolite).toBe('빨라요');
      expect(res.formalPolite).toBe('빠릅니다');
      expect(res.pastPolite).toBe('빨랐어요');
      expect(res.futurePolite).toBe('빠를 거예요');
    });

    it('conjugates 만들기 (ㄹ-irregular: make -> 만듭니다, 만드세요)', () => {
      const res = conjugatePredicate('만들다');
      expect(res.irregularType).toBe('ㄹ-irregular');
      expect(res.presentPolite).toBe('만들어요');
      expect(res.formalPolite).toBe('만듭니다');
      expect(res.politeRequest).toBe('만드세요');
    });

    it('conjugates 낫다 (ㅅ-irregular: recover -> 나아요)', () => {
      const res = conjugatePredicate('낫다');
      expect(res.irregularType).toBe('ㅅ-irregular');
      expect(res.presentPolite).toBe('나아요');
      expect(res.formalPolite).toBe('낫습니다');
      expect(res.pastPolite).toBe('나았어요');
    });

    it('conjugates 그렇다 (ㅎ-irregular: so -> 그래요)', () => {
      const res = conjugatePredicate('그렇다');
      expect(res.irregularType).toBe('ㅎ-irregular');
      expect(res.presentPolite).toBe('그래요');
      expect(res.formalPolite).toBe('그렇습니다');
      expect(res.pastPolite).toBe('그랬어요');
    });
  });

  describe('Curated Predicates Catalog', () => {
    it('contains all curated items and can conjugate each one without error', () => {
      expect(CURATED_PREDICATES.length).toBeGreaterThanOrEqual(25);
      CURATED_PREDICATES.forEach((p) => {
        const res = conjugatePredicate(p.root, p.wordType);
        expect(res.presentPolite).toBeTruthy();
        expect(res.formalPolite).toBeTruthy();
        expect(res.pastPolite).toBeTruthy();
        expect(res.futurePolite).toBeTruthy();
      });
    });
  });
});
