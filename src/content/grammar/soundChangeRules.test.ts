import { SOUND_CHANGE_RULES } from './soundChangeRules';

describe('Sound Change Rules Catalog', () => {
  it('contains the 5 fundamental Korean sound change categories', () => {
    const ids = SOUND_CHANGE_RULES.map((r) => r.id);
    expect(ids).toContain('liaison');
    expect(ids).toContain('nasalization');
    expect(ids).toContain('tensification');
    expect(ids).toContain('aspiration');
    expect(ids).toContain('palatalization');
  });

  it('provides written vs spoken comparison and explanation for every example', () => {
    SOUND_CHANGE_RULES.forEach((rule) => {
      expect(rule.titleKorean).toBeTruthy();
      expect(rule.titleEnglish).toBeTruthy();
      expect(rule.ruleFormula).toBeTruthy();
      expect(rule.examples.length).toBeGreaterThanOrEqual(3);

      rule.examples.forEach((ex) => {
        expect(ex.written).toBeTruthy();
        expect(ex.spoken).toBeTruthy();
        expect(ex.explanation).toBeTruthy();
        expect(ex.translation).toBeTruthy();
      });
    });
  });
});
