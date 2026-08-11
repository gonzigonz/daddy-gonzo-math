export type SessionMode = 'practice' | 'mastery';

export const getDefaultSessionMode = (conceptId: string): SessionMode => {
  return conceptId === 'pre-algebra-readiness' ? 'mastery' : 'practice';
};

export const shouldAdvanceAfterAnswer = (_mode: SessionMode, wasCorrect: boolean): boolean => {
  return wasCorrect;
};

export const isObviousAnswerMistake = (expected: string, typed: string): boolean => {
  if (typed.length === 0 || typed === '-') {
    return false;
  }

  const expectedUnsigned = expected.replace(/^-/, '');
  const typedUnsigned = typed.replace(/^-/, '');

  if (typed.startsWith('-') !== expected.startsWith('-')) {
    return true;
  }

  if (typedUnsigned.length > expectedUnsigned.length) {
    return true;
  }

  return false;
};

export const getHintMessage = (mode: SessionMode, skill?: string, hint?: string, explanation?: string): string => {
  if (mode === 'practice') {
    return hint ?? explanation ?? 'Try simplifying the expression one step at a time.';
  }

  if (skill) {
    return `This idea needs a little teaching. Check your class notes or ask a teacher or parent to help with ${skill.replace(/-/g, ' ')}.`;
  }

  return hint ?? 'Focus on the idea behind the problem and check your notes or ask for help.';
};
