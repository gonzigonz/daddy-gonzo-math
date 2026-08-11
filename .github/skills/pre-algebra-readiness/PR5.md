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
