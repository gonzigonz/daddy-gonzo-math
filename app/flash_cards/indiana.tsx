import { ICard, MultiplicationCard } from "./card";

export const indianasCards: ICard[] = [];
const factors: number[] = [1, 2, 10, 11];
const secondTerms: number[] = [2, 3, 4, 5, 6, 7, 8, 9, 10]

let idx: number = 0;
for (let f of factors) {
    for (let s of secondTerms) {
        indianasCards[idx] = new MultiplicationCard(f, s);
        idx++;
    }
}
