import { getOfflineTutorAnswer } from './offlineTutor';

describe('offlineTutor', () => {
  it('returns comprehensive answer for particle questions (은/는 vs 이/가)', () => {
    const result = getOfflineTutorAnswer('What is the difference between 은/는 and 이/가?');
    expect(result.answer).toContain('Topic (은/는) vs. Subject (이/가)');
    expect(result.koreanSnippet).toBeDefined();
  });

  it('answers ㅂ irregular questions', () => {
    const result = getOfflineTutorAnswer('How to conjugate 춥다 and 덥다 irregular?');
    expect(result.answer).toContain('ㅂ-Irregular');
    expect(result.koreanSnippet).toContain('추워요');
  });

  it('answers location particle questions (에 vs 에서)', () => {
    const result = getOfflineTutorAnswer('When to use 에 vs 에서?');
    expect(result.answer).toContain('Location: 에 vs. 에서');
  });

  it('answers number questions (Sino vs Native)', () => {
    const result = getOfflineTutorAnswer('Can you explain Sino and Native numbers?');
    expect(result.answer).toContain('Sino-Korean vs. Native Korean Numbers');
  });

  it('answers cafe ordering questions', () => {
    const result = getOfflineTutorAnswer('How to order at a cafe in Seoul?');
    expect(result.answer).toContain('Ordering Drinks at a Seoul Cafe');
    expect(result.koreanSnippet).toContain('아메리카노');
  });

  it('provides helpful pedagogical guide when query is generic or unmatched', () => {
    const result = getOfflineTutorAnswer('Can you help me learn Korean?');
    expect(result.answer).toContain('Korean Learning Assistance');
    expect(result.koreanSnippet).toBe('한국어 공부 화이팅!');
  });
});
