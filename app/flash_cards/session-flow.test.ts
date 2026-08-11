import test from 'node:test';
import assert from 'node:assert/strict';
import { shouldAdvanceAfterAnswer, getDefaultSessionMode, getHintMessage, isObviousAnswerMistake } from './session-flow';

test('wrong answers do not auto-advance in either mode', () => {
  assert.equal(shouldAdvanceAfterAnswer('practice', false), false);
  assert.equal(shouldAdvanceAfterAnswer('mastery', false), false);
});

test('pre-algebra defaults to mastery mode for conceptual work', () => {
  assert.equal(getDefaultSessionMode('pre-algebra-readiness'), 'mastery');
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
