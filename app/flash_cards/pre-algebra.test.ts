import test from 'node:test';
import assert from 'node:assert/strict';
import { concepts } from './concepts.ts';

test('pre-algebra readiness concept exists with five levels', () => {
  const concept = concepts.find((entry) => entry.id === 'pre-algebra-readiness')!;
  assert.ok(concept, 'missing pre-algebra readiness concept');
  assert.equal(concept.levels.length, 5, 'expected five levels');
});

test('pre-algebra decks generate integer ten-question sessions', () => {
  const concept = concepts.find((entry) => entry.id === 'pre-algebra-readiness')!;

  for (const level of concept.levels) {
    const deck = concept.buildFlashcards(level.settings);
    assert.equal(deck.length, 10, `${level.id} should create exactly 10 cards`);
    for (const card of deck) {
      assert.match(card.answer(), /^-?\d+$/, `${level.id} should produce an integer answer`);
      assert.doesNotMatch(card.expression(), /\/\s*0/, `${level.id} should avoid division by zero`);
    }
  }
});

test('equivalent-expression prompt for 5x - 2x with x = 6 resolves to 18', () => {
  const concept = concepts.find((entry) => entry.id === 'pre-algebra-readiness')!;
  const equivalentLevel = concept.levels.find((level) => level.id === 'equivalent-expressions');
  assert.ok(equivalentLevel, 'missing equivalent expressions level');

  const card = concept.buildFlashcards(equivalentLevel.settings).find(
    (entry) => entry.expression() === '5x - 2x = ? when x = 6',
  );

  assert.ok(card, 'missing 5x - 2x deck card');
  assert.equal(card.answer(), '18', '5x - 2x with x = 6 should equal 18');
});
