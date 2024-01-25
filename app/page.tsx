'use client'
import { useState } from "react"
// import Image from "next/image";

// const config = require('../next.config')
// const vercel_svg_path = `${config.basePath}/vercel.svg`
// const next_svg_path = `${config.basePath}/next.svg`

class Card {
  status: string
  expression: string
  constructor(expression: string) {
    this.status = "";
    this.expression = expression;
  }
  className() {
    switch (this.status) {
      case "pass":
        return "text-green-600 bg-green-100";
      case "fail":
        return "text-red-600 bg-red-100";
      default:
        return "text-sky-500 bg-sky-50";
    }
  }
  icon() {
    switch (this.status) {
      case "pass":
        return "\u2713";
      case "fail":
        return "\u2717";
      default:
        return "-";
    }
  }
}

let countOfFactors = 0;
const cards: Card[] = [];
const factors = [0, 2, 3, 4, 5, 6, 8];
for (let f of factors) {
  for (let i = 1; i < 13; i++) {
    cards[countOfFactors] = new Card(`${f}*${i}`);
    countOfFactors++;
  }
}
countOfFactors;

export default function Home() {
  const [userInput, setUserInput] = useState('');
  const [counter, setCounter] = useState(0)
  const [card, setCard] = useState(cards[0]);
  // console.log(`counter: '${counter}', expression: '${card.expression}', input: '${userInput}'`);

  const handleButtonClick = async (value: string) => {
    if (value === 'AC') {
      setUserInput('clearing...');
      await new Promise(f => setTimeout(f, 500));

      for (var c of cards) {
        c.status = "";
      }
      setUserInput('');
      setCounter(0);
      setCard(cards[0]);
    } else {
      if (userInput === "correct" || userInput === "wrong") {
        return;
      }

      const newValue = userInput + value;
      setUserInput(newValue);

      const correctAnswer = eval(card.expression).toString();
      if (newValue.length === correctAnswer.length) {
        try {
          if (newValue === correctAnswer) {
            card.status = "pass";
            setUserInput("correct");
          } else {
            card.status = "fail";
            setUserInput("wrong");
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

  const buttons = [
    '7', '8', '9',
    '4', '5', '6',
    '1', '2', '3',
    'AC', '0'
  ]

  return (
    <main className="flex min-h-screen flex-col items-center py-4 px-4 sm:p-6 md:py-10 md:px-8">
      <h1 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-4 sm:mb-6 md:mb-8 lg:mb-10 font-bold font-mono">DADDY GONZO MATH</h1>
      <div id="app" className="p-6 sm:p-12 md:px-24 lg:px-36 mx-2 sm:mx-20 md:mx-24 lg:mx-30 rounded-lg shadow-lg">
        <div className="grid grid-cols-12">
          {cards.map((card, index) => (
            <button
              key={index}
              className={card.className()}
            >{card.icon()}</button>
          ))}
        </div>
        <input
          type="text"
          className="w-full text-sky-500 text-3xl text-center my-2 border-2 border-sky-400 rounded-lg focus:outline-none"
          value={card.expression}
          readOnly
        />
         <input
          type="text"
          className="w-full text-sky-500 text-3xl text-center my-2 border-2 border-sky-400 rounded-lg focus:outline-none"
          value={userInput}
          readOnly
        />
        <div className="grid grid-cols-3 gap-2">
          {buttons.map((btn) => (
            <button
              key={btn}
              onClick={() => handleButtonClick(btn)}
              className="text-sky-600 text-3xl bg-sky-200 hover:bg-sky-300 p-2 rounded-lg"
            >{btn}</button>
          ))}
        </div>
      </div>
    </main>
  );
}
