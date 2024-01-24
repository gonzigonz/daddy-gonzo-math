'use client'
import { useState } from "react"
// import Image from "next/image";

// const config = require('../next.config')
// const vercel_svg_path = `${config.basePath}/vercel.svg`
// const next_svg_path = `${config.basePath}/next.svg`

let countOfFactors = 0;
const cards: string[] = [];
const factors = [1, 2, 3, 4, 5, 6, 10];
for (let f of factors) {
  for (let i = 0; i < 13; i++) {
    cards[countOfFactors] = `${f}*${i}`;
    // console.log(cards[countOfFactors]);
    countOfFactors++;
  }
}
countOfFactors;

export default function Home() {
  const [answer, setAnswer] = useState('');
  const [counter, setCounter] = useState(0)
  const [expression, setExpression] = useState(cards[0]);
  // console.log(`counter: '${counter}', expression: '${expression}', answer: '${answer}'`);

  const handleButtonClick = async (value: string) => {
    if (value === 'GO') {
      try {
        const result = eval(expression).toString()
        if (answer === result) {
          setAnswer("correct");
        } else {
          setAnswer("wrong");
        }

        await new Promise(f => setTimeout(f, 1000));

        setAnswer('');
        let nextIndex = counter === countOfFactors ? 0 : counter + 1;
        setCounter(nextIndex)
        setExpression(cards[nextIndex]);
      } catch (error) {
        setAnswer("Error");
      }
    } else if (value === 'C') {
      setAnswer('');
      setCounter(0);
      setExpression(cards[0]);
    } else {
      setAnswer((prevAnswer) => prevAnswer + value )
    }
  }

  const buttons = [
    '7', '8', '9',
    '4', '5', '6',
    '1', '2', '3',
    'C', '0', 'GO'
  ]

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1 className="text-4xl mb-10 font-bold">DADDY GONZO MATH</h1>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <input
          type="text"
          className="w-full mb-2 text-3xl border-b-2 border-gray-400 focus:outline-none"
          value={expression}
          readOnly
        />
        <input
          type="text"
          className="w-full mb-4 text-4xl font-bold focus-outline"
          value={answer}
          readOnly
        />
        <div className="grid grid-cols-3 gap-2">
          {buttons.map((btn) => (
            <button
              key={btn}
              onClick={() => handleButtonClick(btn)}
              className="text-4xl bg-gray-300 hover:bg-gray-400 p-2 rounded-lg"
            >
              {btn}
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
