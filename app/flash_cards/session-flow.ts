export type SessionMode = 'practice' | 'mastery';

export interface SkillStats {
  attempts: number;
  correct: number;
  incorrect: number;
  hintUsage: number;
  showMeHowUsage: number;
}

export const getDefaultSessionMode = (_conceptId: string): SessionMode => {
  return 'practice';
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

export const getRepeatedDifficultyMessage = (stats?: Partial<SkillStats>, skill?: string): string | null => {
  if (!stats) {
    return null;
  }

  const incorrect = stats.incorrect ?? 0;
  const hintUsage = stats.hintUsage ?? 0;
  const showMeHowUsage = stats.showMeHowUsage ?? 0;

  if (incorrect >= 2 && (hintUsage > 0 || showMeHowUsage > 0) && skill) {
    return `This idea needs a little teaching. Check your class notes or ask a teacher or parent to help with ${skill.replace(/-/g, ' ')}.`;
  }

  return null;
};

export const getHintMessage = (
  mode: SessionMode,
  skill?: string,
  hint?: string,
  explanation?: string,
  stats?: Partial<SkillStats>,
): string => {
  const repeatedDifficultyMessage = getRepeatedDifficultyMessage(stats, skill);
  if (repeatedDifficultyMessage) {
    return repeatedDifficultyMessage;
  }

  if (mode === 'practice') {
    return hint ?? explanation ?? 'Try simplifying the expression one step at a time.';
  }

  if (skill) {
    return hint ?? `This idea needs a little teaching. Check your class notes or ask a teacher or parent to help with ${skill.replace(/-/g, ' ')}.`;
  }

  return hint ?? 'Focus on the idea behind the problem and check your notes or ask for help.';
};

export const getSkillSummary = (stats: Partial<SkillStats>): string => {
  const attempts = stats.attempts ?? 0;
  const correct = stats.correct ?? 0;
  const incorrect = stats.incorrect ?? 0;
  const hintUsage = stats.hintUsage ?? 0;
  const showMeHowUsage = stats.showMeHowUsage ?? 0;

  if (attempts === 0) {
    return 'Not attempted yet';
  }

  if (correct >= attempts - 1 && incorrect <= 1 && hintUsage === 0 && showMeHowUsage === 0) {
    return 'Strong';
  }

  return 'Practice again';
};
