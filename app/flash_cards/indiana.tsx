import { ICard, MultiplicationCard } from "./card";

export const indianasCards: ICard[] = [];
const factors: number[] = [2];
const secondTerms: number[] = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
let idx: number = 0;
for (let f of factors) {
    for (let s of secondTerms) {
        indianasCards[idx] = new MultiplicationCard(f, s);
        idx++;
    }
}

// shuffle
for (let index = indianasCards.length - 1; index > 0; index--) {
  const j = Math.floor(Math.random() * (index + 1));
  [indianasCards[index], indianasCards[j]] = [indianasCards[j], indianasCards[index]]
}
