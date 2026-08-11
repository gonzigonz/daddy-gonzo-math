'use client'
import { useRef, useState } from "react"
import { ICard } from "./flash_cards/card"
import {
  ConceptSettings,
  concepts,
  FACTOR_OPTIONS,
  getConcept,
  IntegerSettings,
  MultiplicationSettings,
  DecimalSettings,
  Order,
  PreAlgebraSettings,
} from "./flash_cards/concepts"

const TICK_MARK = "✓";
const CROSS_MARK = "✗";
const DEL_SYMBOL = "⌫";
const REFRESH_SYMBOL = "↻";

type SettingsByConcept = Record<string, ConceptSettings>;

const getInitialSettings = (): SettingsByConcept => concepts.reduce((settings, concept) => ({
  ...settings,
  [concept.id]: concept.getDefaultSettings(),
}), {});

const buildDeck = (conceptId: string, settings: SettingsByConcept): ICard[] => {
  const concept = getConcept(conceptId);
  const cards = concept.buildFlashcards(settings[conceptId] ?? concept.getDefaultSettings());
  cards[0].status = "pending";
  return cards;
};

export default function Home() {
  const defaultConceptId = concepts[0].id;
  const initialSettings = getInitialSettings();
  const initialDeck = getConcept(defaultConceptId).buildFlashcards(initialSettings[defaultConceptId]);
  initialDeck[0].status = "pending";

  const [score, setScore] = useState(0);
  const [avgTime, setAvgTime] = useState(0);
  const [conceptId, setConceptId] = useState(defaultConceptId);
  const [userInput, setUserInput] = useState("");
  const [index, setIndex] = useState(0);
  const [flashcards, setFlashCards] = useState<ICard[]>(initialDeck);
  const [card, setCard] = useState<ICard>(initialDeck[0]);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [sessionFinished, setSessionFinished] = useState(false);
  const [conceptSettings, setConceptSettings] = useState<SettingsByConcept>(initialSettings);

  const startTime = useRef<number>(0);
  const totalTime = useRef<number>(0);
  const count = useRef<number>(0);

  const activeConcept = getConcept(conceptId);
  const activeSettings = conceptSettings[conceptId] ?? activeConcept.getDefaultSettings();
  const averageSeconds = Math.round(avgTime / 100) / 10;

  const resetSessionState = () => {
    setScore(0);
    setAvgTime(0);
    setUserInput("");
    count.current = 0;
    totalTime.current = 0;
    startTime.current = 0;
    setSessionStarted(false);
    setSessionFinished(false);
  };

  const applyDeck = (nextConceptId: string) => {
    const nextCards = buildDeck(nextConceptId, conceptSettings);
    setFlashCards(nextCards);
    setIndex(0);
    setCard(nextCards[0]);
    setConceptId(nextConceptId);
  };

  const startSession = () => {
    resetSessionState();
    const nextCards = buildDeck(conceptId, conceptSettings);
    setFlashCards(nextCards);
    setCard(nextCards[0]);
    setIndex(0);
    setSessionStarted(true);
    setSessionFinished(false);
    startTime.current = Date.now();
  };

  const refreshSession = () => {
    resetSessionState();
    const nextCards = buildDeck(conceptId, conceptSettings);
    setFlashCards(nextCards);
    setIndex(0);
    setCard(nextCards[0]);
  };

  const handleButtonClick = async (value: string) => {
    if (value === REFRESH_SYMBOL) {
      refreshSession();
      return;
    }

    if (!sessionStarted || sessionFinished) {
      return;
    }

    if (value === "-") {
      if (userInput.includes("-")) {
        return;
      }
      setUserInput((prevInput) => prevInput === "" ? "-" : prevInput);
      return;
    }

    if (value === DEL_SYMBOL) {
      setUserInput((prevInput) => prevInput === "-" ? "" : prevInput.slice(0, -1));
      return;
    }

    if (userInput === TICK_MARK || userInput === CROSS_MARK) {
      return;
    }

    const nextInput = userInput + value;
    setUserInput(nextInput);
    const answer = card.answer();
    if (nextInput.length !== answer.length) {
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 300));
    const elapsedTime = Date.now() - startTime.current - 300;
    const updatedFlashcards = flashcards.map((currentCard) => currentCard.clone());

    if (nextInput === answer) {
      updatedFlashcards[index].status = "pass";
      setUserInput(TICK_MARK);
      setScore((previousScore) => previousScore + 1);
      totalTime.current += elapsedTime;
      count.current += 1;
      setAvgTime(Math.round(totalTime.current / count.current));
    } else {
      updatedFlashcards[index].status = "fail";
      setUserInput(CROSS_MARK);
      setScore((previousScore) => previousScore - 1);
      count.current += 1;
    }

    await new Promise((resolve) => setTimeout(resolve, 300));
    if (updatedFlashcards.every((currentCard) => currentCard.status === "pass" || currentCard.status === "fail")) {
      setSessionStarted(false);
      setSessionFinished(true);
      setUserInput("");
      setFlashCards(updatedFlashcards);
      return;
    }

    let nextIndex = index === updatedFlashcards.length - 1 ? 0 : index + 1;
    while (updatedFlashcards[nextIndex].status && nextIndex !== index) {
      nextIndex = nextIndex === updatedFlashcards.length - 1 ? 0 : nextIndex + 1;
    }

    updatedFlashcards[nextIndex].status = "pending";
    setFlashCards(updatedFlashcards);
    setIndex(nextIndex);
    setCard(updatedFlashcards[nextIndex]);
    setUserInput("");
    startTime.current = Date.now();
  };

  const handleConceptClick = (nextConceptId: string) => {
    resetSessionState();
    applyDeck(nextConceptId);
  };

  const updateSettings = (nextSettings: ConceptSettings) => {
    setConceptSettings((previousSettings) => ({ ...previousSettings, [conceptId]: nextSettings }));
  };

  const isSameSettings = (left: ConceptSettings, right: ConceptSettings): boolean => JSON.stringify(left) === JSON.stringify(right);

  const handleLevelChange = (levelSettings: ConceptSettings) => {
    updateSettings(levelSettings);
  };

  const handleOrderChange = (order: Order) => {
    if (activeSettings.kind === "integer" || activeSettings.kind === "multiplication" || activeSettings.kind === "pre-algebra") {
      updateSettings({ ...activeSettings, order } as ConceptSettings);
    }
  };

  const toggleIntegerFactor = (factor: number) => {
    if (activeSettings.kind !== "integer") {
      return;
    }

    const settings = activeSettings as IntegerSettings;
    const selectedFactors = settings.selectedFactors.includes(factor)
      ? settings.selectedFactors.filter((item) => item !== factor)
      : [...settings.selectedFactors, factor].sort((a, b) => a - b);

    if (selectedFactors.length > 0) {
      updateSettings({ ...settings, selectedFactors });
    }
  };

  const toggleMultiplicationFactor = (factor: number) => {
    if (activeSettings.kind !== "multiplication") {
      return;
    }

    const settings = activeSettings as MultiplicationSettings;
    const selectedFactors = settings.selectedFactors.includes(factor)
      ? settings.selectedFactors.filter((item) => item !== factor)
      : [...settings.selectedFactors, factor].sort((a, b) => a - b);

    if (selectedFactors.length > 0) {
      updateSettings({ ...settings, selectedFactors });
    }
  };

  const handleIntegerModeChange = (mode: IntegerSettings["mode"]) => {
    if (activeSettings.kind === "integer") {
      updateSettings({ ...activeSettings, mode });
    }
  };

  const handleMultiplicationModeChange = (mode: MultiplicationSettings["mode"]) => {
    if (activeSettings.kind === "multiplication") {
      updateSettings({ ...activeSettings, mode });
    }
  };

  const handleDecimalCarryChange = (carry: DecimalSettings["carry"]) => {
    if (activeSettings.kind === "decimal") {
      updateSettings({ ...activeSettings, carry });
    }
  };

  const handleDecimalPrecisionChange = (precision: DecimalSettings["precision"]) => {
    if (activeSettings.kind === "decimal") {
      updateSettings({ ...activeSettings, precision });
    }
  };

  const handleCardButtonClick = (cardIndex: number) => {
    const updatedFlashcards = flashcards.map((currentCard) => currentCard.clone());

    if (!sessionStarted) {
      updatedFlashcards.forEach((currentCard) => currentCard.clearStatus());
      updatedFlashcards[cardIndex].status = "pending";
      setFlashCards(updatedFlashcards);
      setIndex(cardIndex);
      setCard(updatedFlashcards[cardIndex]);
      setUserInput("");
      return;
    }

    if (sessionFinished) {
      return;
    }

    updatedFlashcards.forEach((currentCard) => {
      if (currentCard.status === "pending") {
        currentCard.clearStatus();
      }
    });
    updatedFlashcards[cardIndex].status = "pending";
    setFlashCards(updatedFlashcards);
    setUserInput("");
    setIndex(cardIndex);
    setCard(updatedFlashcards[cardIndex]);
    startTime.current = Date.now();
  };

  const buttons = ["7", "8", "9", "4", "5", "6", "1", "2", "3", "-", "0", ".", DEL_SYMBOL];
  const statusIcon = (status: string): string => status === "pass" ? TICK_MARK : status === "fail" ? CROSS_MARK : "-";
  const integerSettings = activeSettings.kind === "integer" ? activeSettings as IntegerSettings : null;
  const multiplicationSettings = activeSettings.kind === "multiplication" ? activeSettings as MultiplicationSettings : null;
  const decimalSettings = activeSettings.kind === "decimal" ? activeSettings as DecimalSettings : null;
  const preAlgebraSettings = activeSettings.kind === "pre-algebra" ? activeSettings as PreAlgebraSettings : null;

  return (
    <main className="flex min-h-screen flex-col items-center py-4 px-4 sm:p-6 md:py-10 md:px-8">
      <h1 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-4 sm:mb-6 md:mb-8 lg:mb-10 font-bold font-mono">DADDY GONZO MATH</h1>
      <div id="app" className="p-6 sm:p-12 md:px-24 lg:px-36 mx-2 sm:mx-20 md:mx-24 lg:mx-30 shadow-lg">
        <div className="grid grid-cols-2 gap-2">
          <p className="text-center text-white bg-pink-400">Score: {score}</p>
          <p className="text-center text-white bg-pink-600">Avg Time: {averageSeconds}s</p>
        </div>
        <div className="grid grid-cols-2 gap-2 my-2 sm:grid-cols-4">
          {concepts.map((concept) => (
            <button
              key={concept.id}
              onClick={() => handleConceptClick(concept.id)}
              className={`text-lg sm:text-2xl ${concept.textColor} bg-sky-500/25 hover:bg-sky-200/25 rounded-lg`}
            >{concept.label}</button>
          ))}
          <button
            onClick={refreshSession}
            className="text-2xl text-sky-500 bg-sky-500/25 hover:bg-sky-200/25 rounded-lg"
          >{REFRESH_SYMBOL}</button>
        </div>
        <div className="grid grid-cols-12 mt-6">
          {flashcards.map((currentCard, currentIndex) => (
            <button
              key={currentIndex}
              onClick={() => handleCardButtonClick(currentIndex)}
              className={currentCard.className()}
            >{statusIcon(currentCard.status)}</button>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-2 my-2">
          <input type="text" className={`${activeConcept.textColor} text-4xl text-center col-span-2 rounded-lg focus:outline-none`} value={card.expression()} readOnly />
          <input type="text" className={`${activeConcept.textColor} text-4xl text-center rounded-lg focus:outline-none`} value={userInput} readOnly />
        </div>

        {!sessionStarted && !sessionFinished && (
          <div className="mt-4 rounded-xl border border-sky-200 bg-sky-50 p-4 text-sky-800">
            <h2 className="text-xl font-bold">Practice setup</h2>
            <p className="mt-2 text-sm">Keep it short and repeatable: up to 10 questions per round.</p>

            <div className="mt-4">
              <p className="mb-2 font-semibold">Levels</p>
              <div className="space-y-2">
                {activeConcept.levels.map((level, levelIndex) => {
                  const chosen = isSameSettings(level.settings, activeSettings);

                  return (
                    <button
                      key={level.id}
                      onClick={() => handleLevelChange(level.settings)}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm font-semibold ${chosen ? "bg-sky-600 text-white" : "bg-white text-sky-700 ring-1 ring-sky-300"}`}
                    >
                      <span>{level.label}</span>
                      <span className="ml-4 text-xs font-bold">Level {levelIndex + 1}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {integerSettings && (
              <div className="mt-4">
                <p className="mb-2 font-semibold">Numbers</p>
                <div className="flex flex-wrap gap-2">
                  {FACTOR_OPTIONS.map((factor) => (
                    <button key={factor} onClick={() => toggleIntegerFactor(factor)} className={`rounded-full px-3 py-2 text-sm font-semibold ${integerSettings.selectedFactors.includes(factor) ? "bg-sky-600 text-white" : "bg-white text-sky-700 ring-1 ring-sky-300"}`}>
                      {factor}
                    </button>
                  ))}
                </div>
                <div className="mt-4">
                  <p className="mb-2 font-semibold">Operation</p>
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => handleIntegerModeChange("addition")} className={`rounded-full px-3 py-2 text-sm font-semibold ${integerSettings.mode === "addition" ? "bg-violet-600 text-white" : "bg-white text-violet-700 ring-1 ring-violet-300"}`}>Add</button>
                    <button onClick={() => handleIntegerModeChange("subtraction")} className={`rounded-full px-3 py-2 text-sm font-semibold ${integerSettings.mode === "subtraction" ? "bg-violet-600 text-white" : "bg-white text-violet-700 ring-1 ring-violet-300"}`}>Subtract</button>
                    <button onClick={() => handleIntegerModeChange("both")} className={`rounded-full px-3 py-2 text-sm font-semibold ${integerSettings.mode === "both" ? "bg-violet-600 text-white" : "bg-white text-violet-700 ring-1 ring-violet-300"}`}>Both</button>
                  </div>
                </div>
              </div>
            )}

            {multiplicationSettings && (
              <div className="mt-4">
                <p className="mb-2 font-semibold">Tables</p>
                <div className="flex flex-wrap gap-2">
                  {FACTOR_OPTIONS.map((factor) => (
                    <button key={factor} onClick={() => toggleMultiplicationFactor(factor)} className={`rounded-full px-3 py-2 text-sm font-semibold ${multiplicationSettings.selectedFactors.includes(factor) ? "bg-sky-600 text-white" : "bg-white text-sky-700 ring-1 ring-sky-300"}`}>
                      {factor}x
                    </button>
                  ))}
                </div>
                <div className="mt-4">
                  <p className="mb-2 font-semibold">Operation</p>
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => handleMultiplicationModeChange("multiplication")} className={`rounded-full px-3 py-2 text-sm font-semibold ${multiplicationSettings.mode === "multiplication" ? "bg-violet-600 text-white" : "bg-white text-violet-700 ring-1 ring-violet-300"}`}>Multiply</button>
                    <button onClick={() => handleMultiplicationModeChange("division")} className={`rounded-full px-3 py-2 text-sm font-semibold ${multiplicationSettings.mode === "division" ? "bg-violet-600 text-white" : "bg-white text-violet-700 ring-1 ring-violet-300"}`}>Divide</button>
                    <button onClick={() => handleMultiplicationModeChange("both")} className={`rounded-full px-3 py-2 text-sm font-semibold ${multiplicationSettings.mode === "both" ? "bg-violet-600 text-white" : "bg-white text-violet-700 ring-1 ring-violet-300"}`}>Both</button>
                  </div>
                </div>
              </div>
            )}

            {decimalSettings && (
              <div className="mt-4">
                <p className="mb-2 font-semibold">Decimal addition</p>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => handleDecimalPrecisionChange("simple")} className={`rounded-full px-3 py-2 text-sm font-semibold ${decimalSettings.precision === "simple" ? "bg-emerald-600 text-white" : "bg-white text-emerald-700 ring-1 ring-emerald-300"}`}>Simple</button>
                  <button onClick={() => handleDecimalPrecisionChange("advanced")} className={`rounded-full px-3 py-2 text-sm font-semibold ${decimalSettings.precision === "advanced" ? "bg-emerald-600 text-white" : "bg-white text-emerald-700 ring-1 ring-emerald-300"}`}>Advanced</button>
                </div>
                <div className="mt-4">
                  <p className="mb-2 font-semibold">Regrouping</p>
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => handleDecimalCarryChange("no-carry")} className={`rounded-full px-3 py-2 text-sm font-semibold ${decimalSettings.carry === "no-carry" ? "bg-emerald-600 text-white" : "bg-white text-emerald-700 ring-1 ring-emerald-300"}`}>No regrouping</button>
                    <button onClick={() => handleDecimalCarryChange("carry")} className={`rounded-full px-3 py-2 text-sm font-semibold ${decimalSettings.carry === "carry" ? "bg-emerald-600 text-white" : "bg-white text-emerald-700 ring-1 ring-emerald-300"}`}>Regrouping</button>
                  </div>
                </div>
              </div>
            )}

            {(integerSettings || multiplicationSettings || preAlgebraSettings) && (
              <div className="mt-4">
                <p className="mb-2 font-semibold">Order</p>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => handleOrderChange("in-order")} className={`rounded-full px-3 py-2 text-sm font-semibold ${activeSettings.order === "in-order" ? "bg-emerald-600 text-white" : "bg-white text-emerald-700 ring-1 ring-emerald-300"}`}>In order</button>
                  <button onClick={() => handleOrderChange("random")} className={`rounded-full px-3 py-2 text-sm font-semibold ${activeSettings.order === "random" ? "bg-emerald-600 text-white" : "bg-white text-emerald-700 ring-1 ring-emerald-300"}`}>Random</button>
                </div>
              </div>
            )}

            <div className="mt-4 flex justify-center">
              <button onClick={startSession} className="px-8 py-6 text-5xl font-bold text-white bg-emerald-500 hover:bg-emerald-600 rounded-xl">START</button>
            </div>
          </div>
        )}

        {sessionFinished && (
          <div className="p-4 mt-4 bg-sky-100 rounded-lg text-center">
            <h2 className="text-3xl font-bold text-sky-700">Session Complete!</h2>
            <p className="text-xl mt-2">Final score: {score}</p>
            <p className="text-xl mt-1">Avg time: {averageSeconds}s</p>
            <button onClick={startSession} className="mt-4 px-6 py-3 text-2xl text-white bg-blue-500 hover:bg-blue-600 rounded-lg">Restart</button>
          </div>
        )}

        {sessionStarted && !sessionFinished && (
          <div className="grid grid-cols-3 gap-2">
            {buttons.map((button) => (
              <button key={button} onClick={() => handleButtonClick(button)} className="text-4xl text-sky-600 bg-sky-200 hover:bg-sky-300 rounded-lg">{button}</button>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
