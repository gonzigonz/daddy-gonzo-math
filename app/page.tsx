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
        return "text-grey-600 bg-grey-100";
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
      setUserInput('Resetting...');
      await new Promise(f => setTimeout(f, 1000));

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
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1 className="text-4xl mb-10 font-bold">DADDY GONZO MATH</h1>
      <div className="bg-white p-6 rounded-lg shadow-lg">
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
          className="w-full mb-2 text-3xl border-b-2 border-gray-400 focus:outline-none"
          value={card.expression}
          readOnly
        />
        <input
          type="text"
          className="w-full mb-4 text-4xl font-bold focus-outline"
          value={userInput}
          readOnly
        />
        <div className="grid grid-cols-3 gap-2">
          {buttons.map((btn) => (
            <button
              key={btn}
              onClick={() => handleButtonClick(btn)}
              className="text-4xl bg-gray-300 hover:bg-gray-400 p-2 rounded-lg"
            >{btn}</button>
          ))}
        </div>
      </div>
    </main>
  );
}
