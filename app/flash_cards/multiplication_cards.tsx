import { ICard } from "./card";

export default class MultiplicationCard implements ICard {
    readonly term1: number;
    readonly term2: number;
    operatorName: string = "x";
    status: string = "";
  
    constructor(firstTerm: number, secondTerm: number) {
      this.term1 = firstTerm;
      this.term2 = secondTerm;
    }

    answer(): string { return (this.term1 * this.term2).toString(); }

    className(): string {
      switch (this.status) {
        case "pass":
          return "text-green-500 bg-green-500/25 hover:bg-sky-200/25";
        case "fail":
          return "text-red-500 bg-red-500/25 hover:bg-sky-200/25";
        case "pending":
          return "text-sky-600/50 bg-sky-400/25 hover:bg-sky-200/25";
        default:
          return "text-sky-500/50 hover:bg-sky-200/25";
      }
    }

    clearStatus(): void { this.status = ""; }

    expression(): string {
        return `${this.term1} ${this.operatorName} ${this.term2}`
    }
  }

export const multiplicationCards: ICard[] = [];
const factors: number[] = [7, 12, 11, 9];
const secondTerms: number[] = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

for (let i = factors.length -1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [factors[i], factors[j]] = [factors[j], factors[i]];
}
for (let i = secondTerms.length -1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [secondTerms[i], secondTerms[j]] = [secondTerms[j], secondTerms[i]];
}

let idx: number = 0;
for (let f of factors) {
  for (let s of secondTerms) {
    multiplicationCards[idx] = new MultiplicationCard(f, s);
    idx++;
  }
}
