export interface ICard {
    operatorName: string;
    status: string;
    answer: () => string;
    className: () => string;
    clearStatus: () => void;
    expression: () => string;
}

export class MultiplicationCard implements ICard {
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
