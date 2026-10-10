import { APP_CONFIG } from './index';

describe('APP_CONFIG', () => {
  it('should have standard default values', () => {
    expect(APP_CONFIG.appName).toBe('Klearn');
    expect(APP_CONFIG.storage.currentVersion).toBe(1);
    expect(APP_CONFIG.srs.defaultEaseFactor).toBe(2.5);
    expect(APP_CONFIG.dailyGoal.defaultTarget).toBe(10);
  });
});
