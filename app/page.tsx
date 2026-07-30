'use client'
import { useEffect, useRef, useState } from "react"
import { ICard, MultiplicationCard } from "./flash_cards/card"

const TICK_MARK = "✓";
const CROSS_MARK = "✗";
const DEL_SYMBOL = "⌫";
const REFRESH_SYMBOL = "↻";
const SETTINGS_STORAGE_KEY = "daddy-gonzo-math-settings";
const SESSION_STORAGE_KEY = "daddy-gonzo-math-session";
const FACTOR_OPTIONS = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

interface IFlashcardStack {
  name: string;
  textColor: string;
}

interface SessionSettings {
  selectedFactors: number[];
  order: "in-order" | "random";
}

type SavedSettings = Record<string, SessionSettings>;

interface PersistedSessionState {
  stackName: string;
  score: number;
  avgTime: number;
  index: number;
  userInput: string;
  sessionStarted: boolean;
  sessionFinished: boolean;
  flashcards: Array<{ term1: number; term2: number; status: string }>;
}

const stacks: { [key: string]: IFlashcardStack } = {
  indy: {
    name: "indy",
    textColor: "text-yellow-500",
  },
  bailey: {
    name: "bailey",
    textColor: "text-indigo-500",
  },
};

const getDefaultSettings = (stackName: string): SessionSettings => ({
  selectedFactors: stackName === "indy" ? [2, 3, 4] : [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  order: "random",
});

const buildFlashcards = (settings: SessionSettings): ICard[] => {
  const cards: ICard[] = [];

  settings.selectedFactors.forEach((factor) => {
    for (let secondTerm = 2; secondTerm <= 12; secondTerm += 1) {
      cards.push(new MultiplicationCard(factor, secondTerm));
    }
  });

  if (settings.order === "random") {
    for (let index = cards.length - 1; index > 0; index -= 1) {
      const j = Math.floor(Math.random() * (index + 1));
      [cards[index], cards[j]] = [cards[j], cards[index]];
    }
  }

  return cards;
};

const loadSavedSettings = (): SavedSettings => {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const saved = window.localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!saved) {
      return {};
    }

    return JSON.parse(saved) as SavedSettings;
  } catch {
    return {};
  }
};

const loadPersistedSession = (): PersistedSessionState | null => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const saved = window.localStorage.getItem(SESSION_STORAGE_KEY);
    if (!saved) {
      return null;
    }

    return JSON.parse(saved) as PersistedSessionState;
  } catch {
    return null;
  }
};

const restoreFlashcards = (savedCards: PersistedSessionState["flashcards"]): ICard[] => {
  const cards = savedCards.map((card) => {
    const restoredCard = new MultiplicationCard(card.term1, card.term2);
    restoredCard.status = card.status;
    return restoredCard;
  });

  return cards;
};

export default function Home() {
  const initialSavedSettings = loadSavedSettings();
  const initialSavedSession = loadPersistedSession();
  const initialStackName = initialSavedSession?.stackName ?? "indy";

  const [score, setScore] = useState(initialSavedSession?.score ?? 0);
  const [avgTime, setAvgTime] = useState(initialSavedSession?.avgTime ?? 0);
  const [stackName, setStackName] = useState(initialStackName);
  const [userInput, setUserInput] = useState(initialSavedSession?.userInput ?? "");
  const [index, setIndex] = useState(initialSavedSession?.index ?? 0);
  const [flashcards, setFlashCards] = useState<ICard[]>(() => {
    if (initialSavedSession && initialSavedSession.stackName === initialStackName) {
      return restoreFlashcards(initialSavedSession.flashcards);
    }

    return buildFlashcards(getDefaultSettings(initialStackName));
  });
  const [card, setCard] = useState<ICard>(() => {
    const restoredCards = flashcards;
    return restoredCards[initialSavedSession?.index ?? 0] ?? restoredCards[0];
  });
  const [sessionStarted, setSessionStarted] = useState(initialSavedSession?.sessionStarted ?? false);
  const [sessionFinished, setSessionFinished] = useState(initialSavedSession?.sessionFinished ?? false);
  const [stackSettings, setStackSettings] = useState<SavedSettings>(() => ({
    indy: initialSavedSettings.indy ?? getDefaultSettings("indy"),
    bailey: initialSavedSettings.bailey ?? getDefaultSettings("bailey"),
  }));

  const startTime = useRef<number>(0);
  const totalTime = useRef<number>(0);
  const count = useRef<number>(0);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(stackSettings));
  }, [stackSettings]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const saved = loadSavedSettings();
    const nextSettings: SavedSettings = {
      indy: saved.indy ?? getDefaultSettings("indy"),
      bailey: saved.bailey ?? getDefaultSettings("bailey"),
    };

    setStackSettings(nextSettings);

    const savedSession = loadPersistedSession();
    if (savedSession && savedSession.stackName === stackName) {
      const restoredCards = restoreFlashcards(savedSession.flashcards);
      const restoredCard = restoredCards[savedSession.index] ?? restoredCards[0];
      setFlashCards(restoredCards);
      setCard(restoredCard);
      setIndex(savedSession.index);
      setScore(savedSession.score);
      setAvgTime(savedSession.avgTime);
      setUserInput(savedSession.userInput);
      setSessionStarted(savedSession.sessionStarted);
      setSessionFinished(savedSession.sessionFinished);
      return;
    }

    const activeSettings = nextSettings[stackName] ?? getDefaultSettings(stackName);
    const initialDeck = buildFlashcards(activeSettings);
    initialDeck[0].status = "pending";
    setFlashCards(initialDeck);
    setCard(initialDeck[0]);
    setIndex(0);
    setScore(0);
    setAvgTime(0);
    setUserInput("");
    setSessionStarted(false);
    setSessionFinished(false);
  }, [stackName]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (sessionStarted || sessionFinished || flashcards.some((card) => card.status !== "")) {
      const persistedSession: PersistedSessionState = {
        stackName,
        score,
        avgTime,
        index,
        userInput,
        sessionStarted,
        sessionFinished,
        flashcards: flashcards.map((card) => ({
          term1: (card as MultiplicationCard).term1 ?? 0,
          term2: (card as MultiplicationCard).term2 ?? 0,
          status: card.status,
        })),
      };

      window.localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(persistedSession));
      return;
    }

    window.localStorage.removeItem(SESSION_STORAGE_KEY);
  }, [avgTime, flashcards, index, score, sessionFinished, sessionStarted, stackName, userInput]);

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

  const isSessionComplete = (cards: ICard[]) => cards.every((c) => c.status === "pass" || c.status === "fail");

  const applyDeck = (name: string, settings: SessionSettings) => {
    const nextCards = buildFlashcards(settings);
    nextCards[0].status = "pending";
    setFlashCards(nextCards);
    setIndex(0);
    setCard(nextCards[0]);
    setStackName(name);
  };

  const resetSettingsForCurrentStack = () => {
    const defaults = getDefaultSettings(stackName);
    setStackSettings((prev) => ({
      ...prev,
      [stackName]: defaults,
    }));
    applyDeck(stackName, defaults);
  };

  const startSession = () => {
    resetSessionState();

    const activeSettings = stackSettings[stackName] ?? getDefaultSettings(stackName);
    const nextCards = buildFlashcards(activeSettings);
    nextCards[0].status = "pending";
    setFlashCards(nextCards);
    setCard(nextCards[0]);
    setIndex(0);

    setSessionStarted(true);
    setSessionFinished(false);
    startTime.current = Date.now();
    count.current = 0;
    totalTime.current = 0;
    setScore(0);
    setAvgTime(0);
    setUserInput("");
  };

  const handleButtonClick = async (value: string) => {
    if (value === REFRESH_SYMBOL) {
      resetSessionState();

      const activeSettings = stackSettings[stackName] ?? getDefaultSettings(stackName);
      const nextCards = buildFlashcards(activeSettings);
      nextCards[0].status = "pending";
      setFlashCards(nextCards);
      setIndex(0);
      setCard(nextCards[0]);
      return;
    }

    if (!sessionStarted || sessionFinished) {
      return;
    }

    if (value === DEL_SYMBOL) {
      setUserInput((prevInput) => prevInput.slice(0, -1));
      return;
    }

    if (userInput === TICK_MARK || userInput === CROSS_MARK) {
      return;
    }

    const userAnswer = userInput + value;
    setUserInput(userAnswer);

    const answer = card.answer();
    if (userAnswer.length !== answer.length) {
      return;
    }

    await new Promise((f) => setTimeout(f, 300));

    const elapsedTime = Date.now() - startTime.current - 300;

    if (userAnswer === answer) {
      card.status = "pass";
      setUserInput(TICK_MARK);
      setScore((prev) => prev + 1);
      totalTime.current += elapsedTime;
      count.current += 1;
      setAvgTime(Math.round(totalTime.current / count.current));
    } else {
      card.status = "fail";
      setUserInput(CROSS_MARK);
      setScore((prev) => prev - 1);
      count.current += 1;
    }

    await new Promise((f) => setTimeout(f, 300));

    if (isSessionComplete(flashcards)) {
      setSessionStarted(false);
      setSessionFinished(true);
      setUserInput("");
      return;
    }

    let nextIndex = index === flashcards.length - 1 ? 0 : index + 1;
    while (flashcards[nextIndex].status && nextIndex !== index) {
      nextIndex = nextIndex === flashcards.length - 1 ? 0 : nextIndex + 1;
    }

    if (!flashcards[nextIndex].status) {
      flashcards[nextIndex].status = "pending";
    }

    setFlashCards([...flashcards]);
    setIndex(nextIndex);
    setCard(flashcards[nextIndex]);
    setUserInput("");
    startTime.current = Date.now();
  };

  const handleStackButtonClick = (name: string) => {
    resetSessionState();
    const defaultSettings = stackSettings[name] ?? getDefaultSettings(name);
    applyDeck(name, defaultSettings);
  };

  const toggleFactor = (factor: number) => {
    const currentSettings = stackSettings[stackName] ?? getDefaultSettings(stackName);
    const currentFactors = currentSettings.selectedFactors;

    if (currentFactors.includes(factor)) {
      if (currentFactors.length === 1) {
        return;
      }

      setStackSettings((prev) => ({
        ...prev,
        [stackName]: {
          ...currentSettings,
          selectedFactors: currentFactors.filter((item) => item !== factor),
        },
      }));
    } else {
      setStackSettings((prev) => ({
        ...prev,
        [stackName]: {
          ...currentSettings,
          selectedFactors: [...currentFactors, factor].sort((a, b) => a - b),
        },
      }));
    }
  };

  const handleOrderChange = (order: SessionSettings["order"]) => {
    const currentSettings = stackSettings[stackName] ?? getDefaultSettings(stackName);
    setStackSettings((prev) => ({
      ...prev,
      [stackName]: {
        ...currentSettings,
        order,
      },
    }));
  };

  const handleCardButtonClick = (cardIndex: number) => {
    if (!sessionStarted) {
      for (const c of flashcards) {
        c.clearStatus();
      }
      flashcards[cardIndex].status = "pending";
      setFlashCards([...flashcards]);
      setIndex(cardIndex);
      setCard(flashcards[cardIndex]);
      setUserInput("");
      return;
    }

    if (sessionFinished) {
      return;
    }

    if (card.status === "pending") {
      card.status = "";
    }

    flashcards[cardIndex].status = "pending";
    setFlashCards([...flashcards]);
    setUserInput("");
    setIndex(cardIndex);
    setCard(flashcards[cardIndex]);
    startTime.current = Date.now();
  };

  const buttons = [
    "7", "8", "9",
    "4", "5", "6",
    "1", "2", "3",
    "-", "0", DEL_SYMBOL,
  ];

  const statusIcon = (status: string): string => {
    switch (status) {
      case "pass":
        return TICK_MARK;
      case "fail":
        return CROSS_MARK;
      default:
        return "-";
    }
  };

  const activeSettings = stackSettings[stackName] ?? getDefaultSettings(stackName);

  return (
    <main className="flex min-h-screen flex-col items-center py-4 px-4 sm:p-6 md:py-10 md:px-8">
      <h1 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-4 sm:mb-6 md:mb-8 lg:mb-10 font-bold font-mono">DADDY GONZO MATH</h1>
      <div id="app" className="p-6 sm:p-12 md:px-24 lg:px-36 mx-2 sm:mx-20 md:mx-24 lg:mx-30 shadow-lg">
        <div className="grid grid-cols-2 gap-2">
          <p className="text-center text-white bg-pink-400">Score: {score}</p>
          <p className="text-center text-white bg-pink-600">Avg Time: {avgTime / 1000}s</p>
        </div>
        <div className="grid col-start-2 grid-cols-3 gap-2 my-2">
          <button
            key="indy-button"
            onClick={() => handleStackButtonClick("indy")}
            className="text-2xl text-sky-500 bg-sky-500/25 hover:bg-sky-200/25 rounded-lg"
          >Indy</button>
          <button
            key="bailey-button"
            onClick={() => handleStackButtonClick("bailey")}
            className="text-2xl text-sky-500 bg-sky-500/25 hover:bg-sky-200/25 rounded-lg"
          >Bailey</button>
          <button
            key="refresh-button"
            onClick={() => handleButtonClick(REFRESH_SYMBOL)}
            className="text-2xl text-sky-500 bg-sky-500/25 hover:bg-sky-200/25 rounded-lg"
          >{REFRESH_SYMBOL}</button>
        </div>
        <div className="grid grid-cols-12 mt-6">
          {flashcards.map((c, index) => (
            <button
              key={index}
              onClick={() => handleCardButtonClick(index)}
              className={c.className()}
            >{statusIcon(c.status)}</button>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-2 my-2">
          <input
            type="text"
            className={`${stacks[stackName].textColor} text-4xl text-center col-span-2 rounded-lg focus:outline-none`}
            value={card.expression()}
            readOnly
          />
          <input
            type="text"
            className={`${stacks[stackName].textColor} text-4xl text-center rounded-lg focus:outline-none`}
            value={userInput}
            readOnly
          />
        </div>

        {!sessionStarted && !sessionFinished && (
          <div className="mt-4 rounded-xl border border-sky-200 bg-sky-50 p-4 text-sky-800">
            <h2 className="text-xl font-bold">Practice setup</h2>
            <p className="mt-2 text-sm">Pick the tables to practice and whether they should come in order or shuffled.</p>

            <div className="mt-4">
              <p className="mb-2 font-semibold">Tables</p>
              <div className="flex flex-wrap gap-2">
                {FACTOR_OPTIONS.map((factor) => {
                  const isSelected = activeSettings.selectedFactors.includes(factor);

                  return (
                    <button
                      key={factor}
                      onClick={() => toggleFactor(factor)}
                      className={`rounded-full px-3 py-2 text-sm font-semibold ${
                        isSelected
                          ? "bg-sky-600 text-white"
                          : "bg-white text-sky-700 ring-1 ring-sky-300"
                      }`}
                    >
                      {factor}x
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-4">
              <p className="mb-2 font-semibold">Order</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleOrderChange("in-order")}
                  className={`rounded-full px-3 py-2 text-sm font-semibold ${
                    activeSettings.order === "in-order"
                      ? "bg-emerald-600 text-white"
                      : "bg-white text-emerald-700 ring-1 ring-emerald-300"
                  }`}
                >
                  In order
                </button>
                <button
                  onClick={() => handleOrderChange("random")}
                  className={`rounded-full px-3 py-2 text-sm font-semibold ${
                    activeSettings.order === "random"
                      ? "bg-emerald-600 text-white"
                      : "bg-white text-emerald-700 ring-1 ring-emerald-300"
                  }`}
                >
                  Random
                </button>
              </div>
            </div>

            <div className="mt-4 flex justify-center">
              <button
                onClick={startSession}
                className="px-8 py-6 text-5xl font-bold text-white bg-emerald-500 hover:bg-emerald-600 rounded-xl"
              >START</button>
            </div>
          </div>
        )}

        {sessionFinished && (
          <div className="p-4 mt-4 bg-sky-100 rounded-lg text-center">
            <h2 className="text-3xl font-bold text-sky-700">Session Complete!</h2>
            <p className="text-xl mt-2">Final score: {score}</p>
            <p className="text-xl mt-1">Avg time: {Math.round(avgTime / 100) / 10}s</p>
            <button
              onClick={startSession}
              className="mt-4 px-6 py-3 text-2xl text-white bg-blue-500 hover:bg-blue-600 rounded-lg"
            >Restart</button>
          </div>
        )}

        {sessionStarted && !sessionFinished && (
          <div className="grid grid-cols-3 gap-2">
            {buttons.map((btn) => (
              <button
                key={btn}
                onClick={() => handleButtonClick(btn)}
                className="text-4xl text-sky-600 bg-sky-200 hover:bg-sky-300 rounded-lg"
              >{btn}</button>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
