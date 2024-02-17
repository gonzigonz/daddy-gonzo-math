'use client'
import { useState } from "react"
import { ICard } from "./flash_cards/card"
import { additionCards } from "./flash_cards/addition_cards";
import { subtractionCards } from "./flash_cards/subtraction_cards";
import { multiplicationCards } from "./flash_cards/multiplication_cards";

// import Image from "next/image";
// const config = require('../next.config')
// const vercel_svg_path = `${config.basePath}/vercel.svg`
// const next_svg_path = `${config.basePath}/next.svg`

const TICK_MARK = "\u2713";
const CROSS_MARK = "\u2717";
const DEL_SYMBOL = "\u232b";
const REFRESH_SYMBOL = "\u21bb";

interface IOperation {
  name: string;
  textColor: string;
}

class AddOperation implements IOperation {
  readonly name: string;
  readonly textColor: string;
  constructor() {
    this.name = "+";
    this.textColor = "text-yellow-500";
  }
}

class MinusOperation implements IOperation {
  readonly name: string;
  readonly textColor: string;
  constructor() {
    this.name = "-";
    this.textColor = "text-indigo-500";
  }
}

class TimesOperation implements IOperation {
  readonly name: string;
  readonly textColor: string;
  constructor() {
    this.name = "x";
    this.textColor = "text-indigo-500";
  }
}

const operations: { [key: string]:IOperation } = {
  '+': new AddOperation(),
  '-': new MinusOperation(),
  'x': new TimesOperation(),
}

const allFlashcardsMap: { [key: string]:ICard[]} = {
  '+': additionCards,
  '-': subtractionCards,
  'x': multiplicationCards, 
}

additionCards[0].status = "pending";


export default function Home() {
  const [operationName, setOperationName] = useState('+');
  const [userInput, setUserInput] = useState('');
  const [counter, setCounter] = useState(0)
  const [flashcards, setFlashCards] = useState(allFlashcardsMap['+'])
  const [card, setCard] = useState(allFlashcardsMap['+'][0]);

  const handleButtonClick = async (value: string) => {
    if (value === REFRESH_SYMBOL) {
      setUserInput("refreshing...");
      await new Promise(f => setTimeout(f, 300));

      for (var c of flashcards) {
        c.clearStatus();
      }
      flashcards[0].status = "pending";
      setUserInput('');
      setCounter(0);
      setCard(flashcards[0]);
    } else if (value == DEL_SYMBOL) {
      setUserInput((prevInput) => prevInput.slice(0, -1));
    } else {
      if (userInput === TICK_MARK || userInput === CROSS_MARK) {
        return;
      }

      const userAnswer = userInput + value;
      setUserInput(userAnswer);
      await new Promise(f => setTimeout(f, 300));

      let answer = card.answer()
      if (userAnswer.length === answer.length) {
        try {
          if (userAnswer === answer) {
            card.status = "pass";
            setUserInput(TICK_MARK);
          } else {
            card.status = "fail";
            setUserInput(CROSS_MARK);
          }
          await new Promise(f => setTimeout(f, 500));

          setUserInput('');
          let nextIndex = counter === flashcards.length - 1 ? 0 : counter + 1;
          flashcards[nextIndex].status = "pending";
          setCounter(nextIndex)
          setCard(flashcards[nextIndex]);
        } catch (error) {
          setUserInput("Error");
        }
      }
    }
  }

  const handleOperationButtonClick = (op: string) => {
    card.status = "";
    allFlashcardsMap[op][counter].status = "pending";
    setOperationName(op);
    setUserInput('');
    setFlashCards(allFlashcardsMap[op]);
    setCard(allFlashcardsMap[op][counter]);
  }

  const handleCardButtonClick = (cardIndex: number) => {
    card.status = "";
    flashcards[cardIndex].status = "pending";
    setUserInput('');
    setCounter(cardIndex);
    setCard(flashcards[cardIndex]);
  }

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
        <div className="grid grid-cols-4 gap-2 my-2">
          <button
            key="plus-button"
            onClick={() => handleOperationButtonClick("+")}
            className="text-2xl text-sky-500 bg-sky-500/25 hover:bg-sky-200/25 rounded-lg"
          >+</button>
          <button
            key="minus-button"
            onClick={() => handleOperationButtonClick("-")}
            className="text-2xl text-sky-500 bg-sky-500/25 hover:bg-sky-200/25 rounded-lg"
          >-</button>
          <button
            key="times-button"
            onClick={() => handleOperationButtonClick("x")}
            className="text-xl text-sky-500 bg-sky-500/25 hover:bg-sky-200/25 rounded-lg"
          >x</button>
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
            >{ statusIcon(c.status) }</button>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-2 my-2">
          <input
            type="text"
            className={`${operations[operationName].textColor} text-4xl text-center col-span-2 rounded-lg focus:outline-none`}
            value={ card.expression() }
            readOnly
          />
          <input
            type="text"
            className={`${operations[operationName].textColor} text-4xl text-center rounded-lg focus:outline-none`}
            value={userInput}
            readOnly
          />
        </div>
        <div className="grid grid-cols-3 gap-2">
          {buttons.map((btn) => (
            <button
              key={btn}
              onClick={() => handleButtonClick(btn)}
              className="text-4xl text-sky-600 bg-sky-200 hover:bg-sky-300 rounded-lg"
            >{btn}</button>
          ))}
        </div>
      </div>
    </main>
  );
}

// Useful for debugging 
{/* <div>
  <ul>
    {flashcards.map((c, index) => (
      <li
        key={"item-" + index}
      >{`${c.expression()} ${c.status}`}</li>
    ))}
  </ul>
</div> */}
