# Pre-Algebra Readiness UAT

This checklist is for manually validating the Pre-Algebra Readiness concept in the flashcard app.

## Setup
- Open the app locally with `npm run dev`
- Confirm the page loads without a crash
- Confirm the main concept tabs render
- Confirm the `Pre-Algebra Readiness` tab is visible and selectable

## Basic tab behavior
- [ ] Select `Pre-Algebra Readiness`
- [ ] Confirm the concept shows the expected 5 levels
- [ ] Confirm the level labels are clear and in order
- [ ] Confirm the default selected level is sensible for first-time use
- [ ] Confirm switching between levels updates the deck appropriately

## Deck generation
- [ ] Start a session from the first level
- [ ] Confirm a deck is generated immediately
- [ ] Confirm the deck contains no more than 10 cards
- [ ] Confirm each card is a single prompt-based question rather than a standard arithmetic problem
- [ ] Confirm no expression includes division by zero
- [ ] Confirm answer values are integers for the generated prompts

## Level validation
Check each level in turn:

### Level 1: Signed Number Sense
- [ ] Questions involve signed numbers and absolute value
- [ ] Answers are correct and consistent with integer arithmetic
- [ ] Expressions are readable and not ambiguous

### Level 2: Algebra Language
- [ ] Questions evaluate expressions with substitution
- [ ] The variable `x` is used consistently
- [ ] Answers reflect correct substitution and order of operations

### Level 3: Arithmetic Relationships
- [ ] Questions use missing-number equations such as `? + 7 = 12`
- [ ] Answers are integer values
- [ ] The prompt is easy to interpret without extra explanation

### Level 4: Equivalent Expressions
- [ ] Questions test simplifying or evaluating expressions
- [ ] Answers are correct for the given value(s)
- [ ] Prompts remain readable and not overly wordy

### Level 5: Readiness Mix
- [ ] Mixed prompts from all earlier categories appear
- [ ] The deck remains manageable and still capped at 10 cards
- [ ] The random order variation behaves as expected

## Interaction and flow
- [ ] Enter answers using the keypad or input flow
- [ ] Confirm correct answers register as correct
- [ ] Confirm incorrect answers register as incorrect
- [ ] Confirm the app continues through the deck without breaking
- [ ] Confirm the session ends cleanly after the final card
- [ ] Confirm no state leaks between concept tabs or sessions

## Regression / quality checks
- [ ] Switching concepts does not break the app
- [ ] The original arithmetic concepts still work normally
- [ ] The app still responds correctly after repeated session restarts
- [ ] The deck order is either in-order or random according to the selected setting
- [ ] The UI remains visually clear and easy to use

## Sign-off
- [ ] UAT passed
- [ ] Issues found: ___________________________________________________
- [ ] Tester name: _________________________________________________
- [ ] Date: ______________________________________________________
