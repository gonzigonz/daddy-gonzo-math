import test from 'node:test';
import assert from 'node:assert/strict';
import { shouldAdvanceAfterAnswer, getDefaultSessionMode, getHintMessage, getShowMeHowMessage, isObviousAnswerMistake } from './session-flow';

test('wrong answers do not auto-advance in either mode', () => {
  assert.equal(shouldAdvanceAfterAnswer('practice', false), false);
  assert.equal(shouldAdvanceAfterAnswer('mastery', false), false);
});

test('pre-algebra opens in practice mode by default', () => {
  assert.equal(getDefaultSessionMode('pre-algebra-readiness'), 'practice');
  assert.equal(getDefaultSessionMode('addition-subtraction'), 'practice');
});

test('obvious answer-shape mistakes are flagged immediately', () => {
  assert.equal(isObviousAnswerMistake('7', '-7'), true);
  assert.equal(isObviousAnswerMistake('7', '77'), true);
  assert.equal(isObviousAnswerMistake('-11', '-111'), true);
  assert.equal(isObviousAnswerMistake('7', '7'), false);
  assert.equal(isObviousAnswerMistake('-3', '-3'), false);
});

test('mastery mode nudges learners toward human help instead of guessing', () => {
  assert.match(getHintMessage('mastery', 'signed-numbers', 'Use the number line.', 'Subtracting a positive means moving further left.'), /teacher|parent|class notes/i);
  assert.match(getHintMessage('practice', 'signed-numbers', 'Use the number line.', 'Subtracting a positive means moving further left.'), /number line/i);
});

test('decimal practice hints include a concrete example', () => {
  const hint = getHintMessage('practice', 'decimal', undefined, undefined, undefined, '3.6 + 12.5 = (3 + 12) + (0.6 + 0.5) = 15 + 1.1 = 16.1.');
  assert.match(hint, /3\.6.*12\.5|\(3 \+ 12\)|16\.1/i);
});

test('show me how keeps the worked example and adult support message', () => {
  const message = getShowMeHowMessage('decimal', 'Try breaking it into parts.', 'Break the decimal into the whole-number and tenths parts.', '3.6 + 12.5 = (3 + 12) + (0.6 + 0.5) = 15 + 1.1 = 16.1.');
  assert.match(message, /3\.6.*12\.5/i);
  assert.match(message, /teacher|parent|adult/i);
});
