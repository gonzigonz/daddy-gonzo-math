import {
    AdditionCard,
    DecimalAdditionCard,
    DivisionCard,
    ICard,
    MultiplicationCard,
    SubtractionCard,
} from "./card";

export type Order = "in-order" | "random";
export const MAX_FLASHCARDS_PER_SESSION = 10;
export const FACTOR_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

export interface MultiplicationSettings {
    kind: "multiplication";
    selectedFactors: number[];
    mode: "multiplication" | "division" | "both";
    order: Order;
}

export interface IntegerSettings {
    kind: "integer";
    selectedFactors: number[];
    mode: "addition" | "subtraction" | "both";
    order: Order;
}

export interface DecimalSettings {
    kind: "decimal";
    carry: "no-carry" | "carry";
    precision: "simple" | "advanced";
    order: "random";
}

export type ConceptSettings = MultiplicationSettings | IntegerSettings | DecimalSettings;

export interface Concept {
    id: string;
    label: string;
    textColor: string;
    getDefaultSettings(): ConceptSettings;
    buildFlashcards(settings: ConceptSettings): ICard[];
}

const shuffle = (cards: ICard[], order: Order): ICard[] => {
    if (order !== "random") {
        return cards;
    }

    for (let index = cards.length - 1; index > 0; index -= 1) {
        const j = Math.floor(Math.random() * (index + 1));
        [cards[index], cards[j]] = [cards[j], cards[index]];
    }

    return cards;
};

const limitDeck = (cards: ICard[]): ICard[] => cards.slice(0, MAX_FLASHCARDS_PER_SESSION);

const buildIntegerCards = (settings: IntegerSettings): ICard[] => {
    const cards: ICard[] = [];

    settings.selectedFactors.forEach((factor) => {
        for (let secondTerm = 1; secondTerm <= 12; secondTerm += 1) {
            if (settings.mode === "addition" || settings.mode === "both") {
                cards.push(new AdditionCard(factor, secondTerm));
            }

            if (settings.mode === "subtraction" || settings.mode === "both") {
                const firstTerm = Math.max(factor, secondTerm);
                const secondValue = Math.min(factor, secondTerm);
                cards.push(new SubtractionCard(firstTerm, secondValue));
            }
        }
    });

    return limitDeck(shuffle(cards, settings.order));
};

const buildMultiplicationCards = (settings: MultiplicationSettings): ICard[] => {
    const cards: ICard[] = [];

    settings.selectedFactors.forEach((factor) => {
        for (let secondTerm = 1; secondTerm <= 12; secondTerm += 1) {
            if (settings.mode === "multiplication" || settings.mode === "both") {
                cards.push(new MultiplicationCard(factor, secondTerm));
            }

            if (settings.mode === "division" || settings.mode === "both") {
                const product = factor * secondTerm;
                cards.push(new DivisionCard(product, factor));
            }
        }
    });

    return limitDeck(shuffle(cards, settings.order));
};

const hasDecimalCarry = (decimalA: number, decimalB: number, precision: "simple" | "advanced") => {
    if (precision === "simple") {
        return decimalA + decimalB >= 10;
    }

    const aHundredths = decimalA % 10;
    const bHundredths = decimalB % 10;
    const aTenths = Math.floor(decimalA / 10);
    const bTenths = Math.floor(decimalB / 10);

    return aHundredths + bHundredths >= 10 || aTenths + bTenths >= 10;
};

const buildDecimalCards = (settings: DecimalSettings): ICard[] => {
    const cards: ICard[] = [];
    const maxWhole = 12;
    const maxDecimal = settings.precision === "simple" ? 9 : 99;
    const precision = settings.precision === "simple" ? 1 : 2;

    for (let wholeA = 0; wholeA <= maxWhole; wholeA += 1) {
        for (let decimalA = 0; decimalA <= maxDecimal; decimalA += 1) {
            const scaledA = wholeA * 10 ** precision + decimalA;

            for (let wholeB = 0; wholeB <= maxWhole; wholeB += 1) {
                for (let decimalB = 0; decimalB <= maxDecimal; decimalB += 1) {
                    const scaledB = wholeB * 10 ** precision + decimalB;
                    const hasCarry = hasDecimalCarry(decimalA, decimalB, settings.precision);

                    if (hasCarry === (settings.carry === "carry")) {
                        cards.push(new DecimalAdditionCard(scaledA, scaledB, precision));
                    }
                }
            }
        }
    }

    return limitDeck(shuffle(cards, "random"));
};

export const concepts: Concept[] = [
    {
        id: "addition-subtraction",
        label: "Add & Subtract",
        textColor: "text-yellow-500",
        getDefaultSettings: () => ({
            kind: "integer",
            selectedFactors: [...FACTOR_OPTIONS],
            mode: "both",
            order: "random",
        }),
        buildFlashcards: (settings) => buildIntegerCards(settings as IntegerSettings),
    },
    {
        id: "multiplication-division",
        label: "Multiply & Divide",
        textColor: "text-indigo-500",
        getDefaultSettings: () => ({
            kind: "multiplication",
            selectedFactors: [...FACTOR_OPTIONS],
            mode: "both",
            order: "random",
        }),
        buildFlashcards: (settings) => buildMultiplicationCards(settings as MultiplicationSettings),
    },
    {
        id: "decimals",
        label: "Decimals",
        textColor: "text-emerald-500",
        getDefaultSettings: () => ({
            kind: "decimal",
            carry: "no-carry",
            precision: "simple",
            order: "random",
        }),
        buildFlashcards: (settings) => buildDecimalCards(settings as DecimalSettings),
    },
];

export const getConcept = (id: string): Concept => concepts.find((concept) => concept.id === id) ?? concepts[0];
