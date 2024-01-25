'use client'
import { useState } from "react"
// import Image from "next/image";

// const config = require('../next.config')
// const vercel_svg_path = `${config.basePath}/vercel.svg`
// const next_svg_path = `${config.basePath}/next.svg`

const TICK_MARK = "\u2713";
const CROSS_MARK = "\u2717";
const DEL_SYMBOL = "\u232b";
const ROTATE_SYMBOL = "\u21bb";

class Card {
  readonly term1: number
  readonly term2: number
  operator: string = ""
  status: string = ""

  constructor(first_term: number, second_term: number, op: string) {
    this.term1 = first_term;
    this.term2 = second_term;
    this.reinitialize(op);
  }

  reinitialize(op: string) {
    this.operator = op;
    this.status = "";
  }

  expression(): string {
    return `${this.term1} ${this.operator === "+" ? "+" : "x"} ${this.term2} =`;
  }

  correctAnswer(): string {
    let ans: number;
    switch (this.operator) {
      case "*":
        ans = this.term1 * this.term2;
        break;
      case "+":
        ans = this.term1 + this.term2;
        break;
      default:
        ans = NaN;
    }
    return ans.toString();
  }

  className(): string {
    switch (this.status) {
      case "pass":
        return "text-green-500 bg-green-500/25";
      case "fail":
        return "text-red-500 bg-red-500/25";
      default:
        return "text-sky-500/50";
    }
  }

  icon(): string {
    switch (this.status) {
      case "pass":
        return TICK_MARK;
      case "fail":
        return CROSS_MARK;
      default:
        return "-";
    }
  }
}

let countOfFactors = 0;
const cards: Card[] = [];
const factors = [2, 3, 4, 5, 6, 8];
for (let f of factors) {
  for (let i = 1; i < 13; i++) {
    cards[countOfFactors] = new Card(f, i, "+");
    countOfFactors++;
  }
}
countOfFactors;

export default function Home() {
  const [operation, setOperation] = useState('+');
  const [userInput, setUserInput] = useState('');
  const [counter, setCounter] = useState(0)
  const [card, setCard] = useState(cards[0]);

  const handleButtonClick = async (value: string) => {
    if (value === ROTATE_SYMBOL) {
      for (var c of cards) {
        c.reinitialize(c.operator)
      }
      setUserInput('');
      setCounter(0);
      setCard(cards[0]);
    } else if (value == DEL_SYMBOL) {
      setUserInput((prevInput) => prevInput.slice(0, -1));
    } else {
      if (userInput === TICK_MARK || userInput === CROSS_MARK) {
        return;
      }

      const newValue = userInput + value;
      setUserInput(newValue);
      await new Promise(f => setTimeout(f, 300));

      if (newValue.length === card.correctAnswer().length) {
        try {
          if (newValue === card.correctAnswer()) {
            card.status = "pass";
            setUserInput(TICK_MARK);
          } else {
            card.status = "fail";
            setUserInput(CROSS_MARK);
          }
          await new Promise(f => setTimeout(f, 500));

          setUserInput('');
          let nextIndex = counter === countOfFactors - 1 ? 0 : counter + 1;
          setCounter(nextIndex)
          setCard(cards[nextIndex]);
        } catch (error) {
          setUserInput("Error");
        }
      }
    }
  }

  const handleOperationButtonClick = (op: string) => {
    let newOperator = op === "+" ? "*" : "+";
    for (var c of cards) {
      c.reinitialize(newOperator);
    }
    setOperation(op === "+" ? "x" : "+");
    setUserInput('');
    setCounter(0);
    setCard(cards[0]);
  }

  const inputClassName = (colSpan:string ):string => {
    let testColor = operation === "+" ? "text-yellow-500": "text-teal-500";
    return `${testColor} text-4xl text-center ${colSpan} rounded-lg focus:outline-none`
  }

  const buttons = [
    '7', '8', '9',
    '4', '5', '6',
    '1', '2', '3',
    ROTATE_SYMBOL, '0', DEL_SYMBOL
  ]

  return (
    <main className="flex min-h-screen flex-col items-center py-4 px-4 sm:p-6 md:py-10 md:px-8">
      <h1 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-4 sm:mb-6 md:mb-8 lg:mb-10 font-bold font-mono">DADDY GONZO MATH</h1>
      <div id="app" className="p-6 sm:p-12 md:px-24 lg:px-36 mx-2 sm:mx-20 md:mx-24 lg:mx-30 shadow-lg">
        <div className="grid grid-cols-12">
          {cards.map((c, index) => (
            <button
              key={index}
              className={c.className()}
            >{c.icon()}</button>
          ))}
        </div>
        <div className="grid grid-cols-6 gap-2 my-2">
          <input
            type="text"
            className={inputClassName("col-span-3")}
            value={card.expression()}
            readOnly
          />
          <input
            type="text"
            className={inputClassName("col-span-2")}
            value={userInput}
            readOnly
          />
          <button
            key="opButton"
            onClick={() => handleOperationButtonClick(operation)}
            className="text-sky-500 bg-sky-500/25 hover:bg-sky-200/25 rounded-lg"
          >+ \ x</button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {buttons.map((btn) => (
            <button
              key={btn}
              onClick={() => handleButtonClick(btn)}
              className="text-3xl text-sky-600 bg-sky-200 hover:bg-sky-300 rounded-lg"
            >{btn}</button>
          ))}
        </div>
      </div>
    </main>
  );
}
