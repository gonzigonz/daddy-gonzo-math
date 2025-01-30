import { ICard, MultiplicationCard } from "./card";

export const baileysCards: ICard[] = [];
let factors: number[] = [2, 3, 4, 8, 9];
let secondTerms: number[] = [2, 3, 4, 5, 6, 7, 8, 9, 11, 12]
let idx: number = 0;
for (let f of factors) {
  for (let s of secondTerms) {
    baileysCards[idx] = new MultiplicationCard(f, s);
    idx++;
  }
}

// shuffle
for (let index = baileysCards.length - 1; index > 0; index--) {
  const j = Math.floor(Math.random() * (index + 1));
  [baileysCards[index], baileysCards[j]] = [baileysCards[j], baileysCards[index]]
}
