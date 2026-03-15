import { describe, it, expect } from 'vitest';

// Matches the actual weight logic used in server.js
// UI (20%), Technical (30%), Innovation (30%), Performance (10%), Accessibility (10%)
function calculateFinalScore(scores) {
  const weights = {
    ui: 0.20,
    technical: 0.30,
    innovation: 0.30,
    performance: 0.10,
    accessibility: 0.10
  };

  return Math.round(
    Object.keys(weights).reduce((total, key) => {
      return total + (scores[key] || 0) * weights[key];
    }, 0)
  );
}

describe('AI Evaluation Engine Logic', () => {
  it('should calculate the weighted score correctly', () => {
    const scores = {
      ui: 85,
      technical: 90,
      innovation: 80,
      performance: 75,
      accessibility: 70
    };

    // (85 * 0.20) + (90 * 0.30) + (80 * 0.30) + (75 * 0.10) + (70 * 0.10)
    // 17 + 27 + 24 + 7.5 + 7 = 82.5 => round to 83
    const score = calculateFinalScore(scores);
    expect(score).toBe(83);
  });

  it('should handle missing scores by defaulting to 0', () => {
    const scores = {
      innovation: 100
    };
    // 100 * 0.30 = 30
    const score = calculateFinalScore(scores);
    expect(score).toBe(30);
  });

  it('should handle perfect scores', () => {
    const scores = {
      ui: 100,
      technical: 100,
      innovation: 100,
      performance: 100,
      accessibility: 100
    };
    const score = calculateFinalScore(scores);
    expect(score).toBe(100);
  });

  it('should handle zero scores', () => {
    const scores = {
      ui: 0,
      technical: 0,
      innovation: 0,
      performance: 0,
      accessibility: 0
    };
    const score = calculateFinalScore(scores);
    expect(score).toBe(0);
  });

  it('should handle empty input', () => {
    const scores = {};
    const score = calculateFinalScore(scores);
    expect(score).toBe(0);
  });

  it('should weight technical and innovation highest', () => {
    // If only technical is high, it contributes 30%
    const techFocused = calculateFinalScore({ technical: 100 });
    // If only ui is high, it contributes 20%
    const uiFocused = calculateFinalScore({ ui: 100 });
    // If only performance is high, it contributes 10%
    const perfFocused = calculateFinalScore({ performance: 100 });

    expect(techFocused).toBeGreaterThan(uiFocused);
    expect(uiFocused).toBeGreaterThan(perfFocused);
  });
});
