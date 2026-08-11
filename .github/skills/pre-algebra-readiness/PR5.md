# Daddy Gonzo Math --- PR 5 Requirements

## Pre-Algebra Readiness Card

**Goal:** Add a compact, permanent foundation card containing only the
prerequisite fluency most useful for success in Algebra 1. This is
supplementary rapid practice, not a replacement for instruction or a
full pre-algebra curriculum.

## Product principles

-   Default to 10-question rapid sessions.
-   Practice little and often.
-   Increase difficulty in small, predictable steps.
-   Reuse the app's existing UI, scoring, feedback, and In Order /
    Random behavior.
-   Keep arithmetic mentally manageable; no calculator dependency.
-   Do not modify existing Addition/Subtraction,
    Multiplication/Division, Decimal, or other cards except where shared
    code must be reused safely.

## New card

**Name:** Pre-Algebra Readiness\
**Type:** Permanent foundation card

## Levels

### Level 1 --- Signed Number Sense

Question families: - positive / negative / zero; - compare and order
small integers; - absolute value; - simple signed addition/subtraction.

Examples: `Which is greater: -3 or -8?`, `|-7| = ?`, `-4 + 9 = ?`

Constraints: small integers; no fractions/decimals.

### Level 2 --- Algebra Language

Question families: - identify variable, coefficient, constant; -
interpret implicit multiplication; - evaluate a simple expression after
substituting one integer value.

Examples: `In 5x + 3, what is the coefficient?`,
`If x = 3, what is 2x + 1?`

Constraints: one variable; integer coefficients; no exponent rules.

### Level 3 --- Arithmetic Relationships

Use unknown-value questions to connect existing math facts to algebraic
thinking.

Examples: `? + 7 = 12`, `6 × ? = 42`, `? ÷ 4 = 5`, `18 - ? = 11`

Do not require formal x-solving yet.

### Level 4 --- Equivalent Expressions

Question families: - simple distributive property; - combine obvious
like terms; - recognize equivalent expressions; - basic
commutative/associative recognition.

Examples: `3(x + 2) = 3x + ?`, `2x + 3x = ?x`, `4 + x` vs `x + 4`.

Keep this recognition-focused. No variables on both sides or substantial
factoring.

### Level 5 --- Readiness Mix

Balanced cumulative sampling from Levels 1--4. Interleaving creates the
difficulty; do not introduce new concepts.

## Order modes

**In Order:** predictable instructional sequence within the selected
level.\
**Random:** shuffle question families within the selected level.

Reuse the app's existing wording/components if they differ.

## Generator requirements

-   Compute answers programmatically.
-   Never divide by zero.
-   Guarantee integer answers where the level requires them.
-   Avoid duplicate questions in a 10-question session when practical.
-   Keep values age-appropriate.
-   Multiple-choice distractors must be plausible, unique, and
    unambiguously wrong.
-   Preserve existing answer-entry and feedback behavior.

## Help, feedback, and remediation

Pre-Algebra introduces concepts where a wrong answer may indicate a
misunderstanding rather than a missing memorized fact. Add a lightweight,
reusable help flow without turning the app into a lesson platform.

### Attempt flow

1.  **First attempt --- no help**
    -   Present the question normally.
    -   Correct answer: continue immediately using the existing app
        flow.
    -   Incorrect answer: do not reveal the answer immediately. Offer a
        **Hint**.
2.  **Hint**
    -   Give one short conceptual cue that helps the learner decide what
        to do next.
    -   Do not reveal the final answer.
    -   Allow another attempt.
3.  **Show Me How**
    -   If the learner is still stuck, offer **Show Me How**.
    -   Display a compact worked solution using only the steps needed
        for that question.
    -   Explanations should be brief and readable without leaving the app.
4.  **Try Similar**
    -   After **Show Me How**, schedule another question from the same
        skill / questionFamily soon in the session when practical.

### Repeated difficulty

Track repeated difficulty at the skill level within the session. A learner
needing help on one question is normal and should not trigger escalation.
If the learner repeatedly requires help, display a calm message such as:

> This one might need some teaching first. Check your class notes or ask
> your teacher or a parent about **[skill name]**. You can come back and
> practice afterward.

### Question data model

Where compatible with the existing architecture, questions on concept-oriented
cards should support metadata such as:

-   `answer`
-   `skill`
-   `questionFamily`
-   `hint`
-   `explanation`

### End-of-session skill summary

For concept-oriented cards, augment the normal score with a compact skill
summary.

Example:

-   `8 / 10 correct`
-   `✓ Signed numbers — strong`
-   `△ Algebra vocabulary — practice again`

## Explicitly out of scope

Do not add formal number-system hierarchy drills, rational/irrational
classification, inequalities, formal two-step equations, variables on
both sides, slope/graphing, systems, exponents, polynomials, quadratics,
geometry, a diagnostic engine, or spaced repetition.

Those belong in PR 2 or later course cards.

## Acceptance criteria

-   Card appears alongside existing cards.
-   Levels 1--5 each complete a 10-question session.
-   In Order and Random work consistently with the current app.
-   Generated mathematics is correct and respects constraints.
-   Level 5 uses only skills introduced in Levels 1--4.
-   Existing cards remain regression-free.
-   Mobile layout remains usable.

## Tests

Cover each generator, answer correctness, ranges/constraints, no
division by zero, integer-answer guarantees, mixed-level selection, and
session length. Run existing build/lint/test commands.

## Copilot instruction

Before coding, inspect the repository and reuse established
card/question-generator patterns. Summarize files/components to change,
implement only PR 1, run existing checks, and report
assumptions/deviations. Keep the PR small and reviewable.

## Rationale / sources

The supplied 2026--2027 Algebra & Geometry I syllabus begins with Unit
1: Solving Equations and Inequalities / Foundations of Geometry. PR 1
intentionally prepares prerequisites before implementing that
course-specific unit.

Grade 7--8 Common Core expectations were used only as a readiness
sanity-check, especially rational-number operations, expressions,
variables, and equations---not as a requirement to cover an entire
standards year.

Reference: https://corestandards.org/mathematics-standards/

## PR #5 Review — Changes Requested

The overall architecture is heading in the right direction, but please address the following before merge.

### 1. Implement the specified remediation flow

The current Pre-Algebra mastery behavior escalates to "check your notes / ask a teacher or parent" too early.

Required flow for concept cards:

1. First incorrect attempt:
   - show the card's specific `hint`
   - do not reveal the answer
   - allow another attempt

2. If still incorrect:
   - expose a **Show Me How** action

3. Show Me How:
   - display the card's `explanation`
   - keep the explanation concise
   - then allow the session to continue

4. After Show Me How:
   - schedule or prioritize another question with the same
     `skill` / `questionFamily` when practical

Do not send the learner directly to the teacher/parent guidance after the first mistake.

### 2. Repeated-difficulty escalation

Teacher / parent / class-note guidance should happen only after repeated difficulty with the same skill.

Please introduce a small configurable threshold rather than tying escalation to a single incorrect answer.

### 3. Fix the skill summary

The current summary effectively marks every encountered skill as Strong because it only counts how many questions belong to that skill.

Track useful session information per skill, such as:
- attempts
- correct answers
- incorrect answers
- hint usage
- Show Me How usage

Then classify the skill using that information.

A simple first version is enough, for example:
- Strong: independently correct with little/no help
- Practice again: repeated mistakes or explanation usage

Do not build a large analytics system.

### 4. Complete Level 1 coverage

Signed Number Sense should include all requested families:
- positive / negative / zero recognition
- compare integers
- order small sets of integers
- absolute value
- simple signed addition/subtraction

The current deck mostly covers arithmetic and absolute value.

Because the existing answer UI is numeric, please choose a clean implementation pattern for recognition questions rather than silently omitting them. Reuseable multiple-choice support is acceptable if it fits the architecture.

### 5. Complete Level 2 coverage

Algebra Language should include:
- identify the variable
- identify the coefficient
- identify the constant
- interpret implicit multiplication
- evaluate a simple expression after substitution

The current implementation is primarily substitution/evaluation.

Please add the missing vocabulary question families.

### 6. Refine Level 4

Equivalent Expressions should emphasize:
- distributive-property equivalence
- combining like terms
- recognizing equivalent forms
- simple commutative / associative relationships

Avoid turning most of this level into another substitution/evaluation deck.

### 7. Practice vs Mastery behavior

Please review `shouldAdvanceAfterAnswer`.

The UI currently says:

Practice:
"Keep moving and revisit missed questions later."

Mastery:
"Stay on the question until it makes sense."

But the current helper advances only when the answer is correct in both modes.

Make the implementation and UI semantics consistent.

### 8. UAT coverage

Update UAT.md to explicitly test:

- first miss shows Hint
- hint does not reveal answer
- second-stage Show Me How is available
- worked explanation is correct
- similar-skill retry occurs when practical
- repeated same-skill difficulty triggers notes/teacher/parent guidance
- a single miss does NOT trigger escalation
- skill summary reflects actual performance/help usage
- Practice and Mastery behave according to their descriptions
- existing arithmetic cards remain unchanged

### 9. Tests

Add automated tests where practical for:
- remediation state progression
- escalation threshold
- skill summary calculation
- Practice vs Mastery advancement
- question-family coverage for Levels 1, 2 and 4
- same-skill retry selection

Please keep the current architecture where possible. This should be a correction/completion pass, not a rewrite.

After changes, run:
- npm run typecheck
- npm run lint
- npm run build
- applicable tests

Then summarize what changed and any deliberate deviations from the PR requirements.
