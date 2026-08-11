export interface ICard {
    status: string;
    answer(): string;
    className(): string;
    clearStatus(): void;
    clone(): ICard;
    expression(): string;
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

    expression(): string { return `${this.term1} x ${this.term2}`; }
    clone(): ICard {
        const card = new MultiplicationCard(this.term1, this.term2);
        card.status = this.status;
        return card;
    }
}

abstract class ArithmeticCard implements ICard {
    status: string = "";

    abstract answer(): string;
    abstract clone(): ICard;
    abstract expression(): string;

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

    clearStatus(): void {
        this.status = "";
    }
}

export class AdditionCard extends ArithmeticCard {
    constructor(readonly term1: number, readonly term2: number) {
        super();
    }

    answer(): string { return (this.term1 + this.term2).toString(); }
    clone(): ICard {
        const card = new AdditionCard(this.term1, this.term2);
        card.status = this.status;
        return card;
    }
    expression(): string { return `${this.term1} + ${this.term2}`; }
}

export class SubtractionCard extends ArithmeticCard {
    constructor(readonly term1: number, readonly term2: number) {
        super();
    }

    answer(): string { return (this.term1 - this.term2).toString(); }
    clone(): ICard {
        const card = new SubtractionCard(this.term1, this.term2);
        card.status = this.status;
        return card;
    }
    expression(): string { return `${this.term1} - ${this.term2}`; }
}

export class DivisionCard extends ArithmeticCard {
    constructor(readonly dividend: number, readonly divisor: number) {
        super();
    }

    answer(): string { return (this.dividend / this.divisor).toString(); }
    clone(): ICard {
        const card = new DivisionCard(this.dividend, this.divisor);
        card.status = this.status;
        return card;
    }
    expression(): string { return `${this.dividend} / ${this.divisor}`; }
}

export class DecimalAdditionCard extends ArithmeticCard {
    constructor(
        readonly term1: number,
        readonly term2: number,
        readonly precision: number = 1,
    ) {
        super();
    }

    answer(): string {
        return ((this.term1 + this.term2) / 10 ** this.precision).toFixed(this.precision);
    }
    clone(): ICard {
        const card = new DecimalAdditionCard(this.term1, this.term2, this.precision);
        card.status = this.status;
        return card;
    }
    expression(): string {
        return `${(this.term1 / 10 ** this.precision).toFixed(this.precision)} + ${(this.term2 / 10 ** this.precision).toFixed(this.precision)}`;
    }
}
