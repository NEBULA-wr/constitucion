import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculatePoints,
  determineRank,
  createInitialGameState,
  checkNewBadges,
  ALL_BADGES,
  CASOS_CIUDADANOS,
  CONSTITUTIONAL_RIDDLES
} from './engine';

test('calculatePoints adds streak bonus and speed bonus correctly', () => {
  // Base 100 with 0 streak and no speed
  assert.equal(calculatePoints(100, 0), 100);

  // Streak 2 gives 50 streak bonus
  assert.equal(calculatePoints(100, 2), 150);

  // Speed < 4s gives 100 bonus
  assert.equal(calculatePoints(100, 2, 3), 250);

  // Streak bonus caps at 200
  assert.equal(calculatePoints(100, 10, 8), 100 + 200 + 25);
});

test('determineRank scales with score thresholds', () => {
  assert.equal(determineRank(50), 'Novicio Constituyente');
  assert.equal(determineRank(250), 'Estudioso de las Leyes');
  assert.equal(determineRank(600), 'Defensor de los Derechos');
  assert.equal(determineRank(1000), 'Tribuno de la República');
  assert.equal(determineRank(1500), 'Magistrado del Tribunal Constitucional');
  assert.equal(determineRank(2200), 'Padre de la Carta Magna');
});

test('checkNewBadges unlocks Primer Constituyente on first correct answer', () => {
  const state = createInitialGameState();
  assert.equal(state.unlockedBadgeIds.length, 0);

  state.totalCorrect = 1;
  const newBadges = checkNewBadges(state);
  assert.ok(newBadges.some(b => b.id === 'badge-first-step'));
  assert.ok(state.unlockedBadgeIds.includes('badge-first-step'));
});

test('checkNewBadges unlocks Escudo de Oro on 5 streak', () => {
  const state = createInitialGameState();
  state.streak = 5;
  const newBadges = checkNewBadges(state);
  assert.ok(newBadges.some(b => b.id === 'badge-streak-master'));
});

test('checkNewBadges unlocks Magistrado Supremo when 3 seals unlocked', () => {
  const state = createInitialGameState();
  state.unlockedSeals = ['sello-1', 'sello-2', 'sello-3'];
  const newBadges = checkNewBadges(state);
  assert.ok(newBadges.some(b => b.id === 'badge-magistrate'));
});

test('CASOS_CIUDADANOS and RIDDLES have at least one correct option each', () => {
  for (const c of CASOS_CIUDADANOS) {
    const hasCorrect = c.options.some(o => o.isCorrect);
    assert.equal(hasCorrect, true, `Case ${c.id} must have a correct option`);
  }

  for (const r of CONSTITUTIONAL_RIDDLES) {
    const hasCorrect = r.options.some(o => o.isCorrect);
    assert.equal(hasCorrect, true, `Riddle ${r.id} must have a correct option`);
  }
});
