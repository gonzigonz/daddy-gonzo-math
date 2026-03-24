'use client'
import { useState, useRef } from "react"
import { ICard } from "./flash_cards/card"
import { baileysCards } from "./flash_cards/bailey";
import { indianasCards } from "./flash_cards/indiana";

// import Image from "next/image";
// const config = require('../next.config')
// const vercel_svg_path = `${config.basePath}/vercel.svg`
// const next_svg_path = `${config.basePath}/next.svg`

const TICK_MARK = "\u2713";
const CROSS_MARK = "\u2717";
const DEL_SYMBOL = "\u232b";
const REFRESH_SYMBOL = "\u21bb";

interface IFlashcardStack {
  name: string;
  textColor: string;
  flashcards: ICard[];
}

class IndianasFlashcards implements IFlashcardStack {
  readonly name: string;
  readonly textColor: string;
  readonly flashcards: ICard[];
  constructor() {
    this.name = "indy";
    this.textColor = "text-yellow-500";
    this.flashcards = indianasCards;
  }
}

class BaileysFlashcards implements IFlashcardStack {
  readonly name: string;
  readonly textColor: string;
  readonly flashcards: ICard[];
  constructor() {
    this.name = "bailey";
    this.textColor = "text-indigo-500";
    this.flashcards = baileysCards;
  }
}

const stacks: { [key: string]: IFlashcardStack } = {
  'indy': new IndianasFlashcards(),
  'bailey': new BaileysFlashcards(),
}

stacks["indy"].flashcards[0].status = "pending";

export default function Home() {
  const [score, setScore] = useState(0);
  const [avgTime, setAvgTime] = useState(0);
  const [stackName, setStackName] = useState('indy');
  const [userInput, setUserInput] = useState('');
  const [index, setIndex] = useState(0);
  const [flashcards, setFlashCards] = useState(stacks['indy'].flashcards);
  const [card, setCard] = useState(stacks['indy'].flashcards[0]);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [sessionFinished, setSessionFinished] = useState(false);

  const startTime = useRef<number>(0);
  const totalTime = useRef<number>(0);
  const count = useRef<number>(0);

  const resetSessionState = () => {
    setScore(0);
    setAvgTime(0);
    setUserInput('');
    count.current = 0;
    totalTime.current = 0;
    startTime.current = 0;
    setSessionStarted(false);
    setSessionFinished(false);
  };

  const isSessionComplete = (cards: ICard[]) => cards.every(c => c.status === 'pass' || c.status === 'fail');

  const startSession = () => {
    resetSessionState();

    for (const c of flashcards) {
      c.clearStatus();
    }
    flashcards[index].status = "pending";
    setFlashCards([...flashcards]);
    setCard(flashcards[index]);

    setSessionStarted(true);
    setSessionFinished(false);
    startTime.current = Date.now();
    count.current = 0;
    totalTime.current = 0;
    setScore(0);
    setAvgTime(0);
    setUserInput('');
  };

  const handleButtonClick = async (value: string) => {
    if (value === REFRESH_SYMBOL) {
      resetSessionState();

      for (const c of flashcards) {
        c.clearStatus();
      }
      flashcards[0].status = "pending";
      setFlashCards([...flashcards]);
      setIndex(0);
      setCard(flashcards[0]);
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

    await new Promise(f => setTimeout(f, 300));

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

    await new Promise(f => setTimeout(f, 300));

    if (isSessionComplete(flashcards)) {
      setSessionStarted(false);
      setSessionFinished(true);
      setUserInput('');
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
    setUserInput('');
    startTime.current = Date.now();
  };

  const handleStackButtonClick = (name: string) => {
    resetSessionState();

    for (const c of stacks[name].flashcards) {
      c.clearStatus();
    }
    stacks[name].flashcards[0].status = "pending";

    setStackName(name);
    setUserInput('');
    setFlashCards(stacks[name].flashcards);
    setIndex(0);
    setCard(stacks[name].flashcards[0]);
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
      setUserInput('');
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
    setUserInput('');
    setIndex(cardIndex);
    setCard(flashcards[cardIndex]);
    startTime.current = Date.now();
  };

  const buttons = [
    '7', '8', '9',
    '4', '5', '6',
    '1', '2', '3',
    '-', '0', DEL_SYMBOL
  ]

  const statusIcon = (status: string): string => {
    switch (status) {
      case "pass":
        return TICK_MARK;
      case "fail":
        return CROSS_MARK;
      default:
        return "-";
    }
  }

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
          <div className="flex justify-center mt-4">
            <button
              onClick={startSession}
              className="px-8 py-6 text-5xl font-bold text-white bg-emerald-500 hover:bg-emerald-600 rounded-xl"
            >START</button>
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

// Useful for debugging 

      {/* <div>
        <pre>
          {JSON.stringify(flashcards, null, 2)}
        </pre>
      </div> */}
