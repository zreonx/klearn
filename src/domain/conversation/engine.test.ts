import { evaluateFormality } from './evaluator';
import { CONVERSATION_SCENARIOS } from './scenarios';

describe('Conversation Domain Engine & Scenarios', () => {
  it('has comprehensive built-in scenarios with valid turns and suggested replies', () => {
    expect(CONVERSATION_SCENARIOS.length).toBeGreaterThanOrEqual(4);

    for (const scenario of CONVERSATION_SCENARIOS) {
      expect(scenario.id).toBeTruthy();
      expect(scenario.title).toBeTruthy();
      expect(scenario.turns.length).toBeGreaterThan(0);

      for (const turn of scenario.turns) {
        expect(turn.partnerPrompt.korean).toBeTruthy();
        expect(turn.partnerPrompt.audioText).toBeTruthy();
        expect(turn.partnerPrompt.translation).toBeTruthy();
        expect(turn.suggestedReplies.length).toBeGreaterThan(0);

        for (const reply of turn.suggestedReplies) {
          expect(reply.korean).toBeTruthy();
          expect(reply.translation).toBeTruthy();
        }
      }
    }
  });

  it('correctly evaluates informal polite endings (-요, -세요, -이에요)', () => {
    const feedback1 = evaluateFormality('아이스 아메리카노 한 잔 주세요.', 'informal-polite');
    expect(feedback1.isCorrectRegister).toBe(true);

    const feedback2 = evaluateFormality('저는 미국 사람이에요.', 'informal-polite');
    expect(feedback2.isCorrectRegister).toBe(true);

    // Casual / Banmal lacking polite ending
    const casualFeedback = evaluateFormality('안녕 밥 먹어', 'informal-polite');
    expect(casualFeedback.isCorrectRegister).toBe(false);
    expect(casualFeedback.tip).toContain('-요');
  });

  it('correctly evaluates formal polite business register (-습니다 / -습니까)', () => {
    const feedbackFormal = evaluateFormality('안녕하십니까? 김민수입니다.', 'formal-polite');
    expect(feedbackFormal.isCorrectRegister).toBe(true);
    expect(feedbackFormal.detectedEnding).toContain('Formal');

    const feedbackDemoted = evaluateFormality('안녕하세요? 김민수예요.', 'formal-polite');
    expect(feedbackDemoted.isCorrectRegister).toBe(false);
    expect(feedbackDemoted.tip).toContain('-습니다');
  });
});
