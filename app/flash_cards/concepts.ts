import {
    AdditionCard,
    DecimalAdditionCard,
    DivisionCard,
    ICard,
    MultiplicationCard,
    PreAlgebraCard,
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

export type PreAlgebraLevel =
    | "signed-number-sense"
    | "algebra-language"
    | "arithmetic-relationships"
    | "equivalent-expressions"
    | "readiness-mix";

export interface PreAlgebraSettings {
    kind: "pre-algebra";
    level: PreAlgebraLevel;
    order: Order;
}

export type ConceptSettings = MultiplicationSettings | IntegerSettings | DecimalSettings | PreAlgebraSettings;

export interface PracticeLevel {
    id: string;
    label: string;
    settings: ConceptSettings;
}

export interface Concept {
    id: string;
    label: string;
    textColor: string;
    getDefaultSettings(): ConceptSettings;
    buildFlashcards(settings: ConceptSettings): ICard[];
    levels: PracticeLevel[];
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

const buildPreAlgebraPromptDeck = (
    prompts: Array<{ prompt: string; answer: number }>,
    order: Order,
): ICard[] => {
    const cards = prompts.map(({ prompt, answer }) => new PreAlgebraCard(prompt, answer));
    return limitDeck(shuffle(cards, order));
};

const buildSignedNumberCards = (order: Order): ICard[] => {
    const prompts = [
        { prompt: "|-7|", answer: 7 },
        { prompt: "-4 + 9", answer: 5 },
        { prompt: "-3 - 8", answer: -11 },
        { prompt: "5 + (-2)", answer: 3 },
        { prompt: "-6 + (-4)", answer: -10 },
        { prompt: "9 - (-2)", answer: 11 },
        { prompt: "-7 + 4", answer: -3 },
        { prompt: "|-8| + 2", answer: 10 },
        { prompt: "-5 + 2", answer: -3 },
        { prompt: "-9 + 9", answer: 0 },
        { prompt: "3 + (-8)", answer: -5 },
        { prompt: "-1 - (-6)", answer: 5 },
    ];

    return buildPreAlgebraPromptDeck(prompts, order);
};

const buildAlgebraLanguageCards = (order: Order): ICard[] => {
    const prompts = [
        { prompt: "If x = 3, then 2x + 1", answer: 7 },
        { prompt: "If x = 4, then 5x - 2", answer: 18 },
        { prompt: "If x = -2, then 3x + 5", answer: -1 },
        { prompt: "If x = 6, then x / 2 + 4", answer: 7 },
        { prompt: "If x = 5, then 4x", answer: 20 },
        { prompt: "If x = -3, then 2x + 9", answer: 3 },
        { prompt: "If x = 7, then x + 3", answer: 10 },
        { prompt: "If x = 2, then 6x - 4", answer: 8 },
        { prompt: "If x = 10, then x / 5", answer: 2 },
        { prompt: "If x = -4, then x + 11", answer: 7 },
    ];

    return buildPreAlgebraPromptDeck(prompts, order);
};

const buildArithmeticRelationshipCards = (order: Order): ICard[] => {
    const prompts = [
        { prompt: "? + 7 = 12", answer: 5 },
        { prompt: "6 × ? = 42", answer: 7 },
        { prompt: "? ÷ 4 = 5", answer: 20 },
        { prompt: "18 - ? = 11", answer: 7 },
        { prompt: "? + 9 = 3", answer: -6 },
        { prompt: "? - 5 = 13", answer: 18 },
        { prompt: "9 × ? = 27", answer: 3 },
        { prompt: "? / 3 = 6", answer: 18 },
        { prompt: "? + 11 = 4", answer: -7 },
        { prompt: "7 × ? = 49", answer: 7 },
        { prompt: "? ÷ 2 = 9", answer: 18 },
        { prompt: "15 - ? = 8", answer: 7 },
    ];

    return buildPreAlgebraPromptDeck(prompts, order);
};

const buildEquivalentExpressionCards = (order: Order): ICard[] => {
    const prompts = [
        { prompt: "3(x + 2) = 3x + ?", answer: 6 },
        { prompt: "2x + 3x = ? if x = 1", answer: 5 },
        { prompt: "5(2 + 3) = ?", answer: 25 },
        { prompt: "4 + x + 3 = ? if x = 5", answer: 12 },
        { prompt: "3(x + 1) = ? if x = 2", answer: 9 },
        { prompt: "2(x + 4) = ? if x = 3", answer: 14 },
        { prompt: "7 + (x + 2) = ? if x = 5", answer: 14 },
        { prompt: "5x - 2x = ? if x = 6", answer: 18 },
        { prompt: "x + 4 + 3 = ? if x = 2", answer: 9 },
        { prompt: "2(y + 5) = ? if y = 3", answer: 16 },
        { prompt: "4x + 2x = ? if x = 6", answer: 36 },
        { prompt: "6 + 2 + x = ? if x = 7", answer: 15 },
    ];

    return buildPreAlgebraPromptDeck(prompts, order);
};

const buildReadinessMixCards = (order: Order): ICard[] => {
    const prompts = [
        ...buildSignedNumberCards("in-order").map((card) => ({ prompt: card.expression(), answer: Number(card.answer()) })),
        ...buildAlgebraLanguageCards("in-order").map((card) => ({ prompt: card.expression(), answer: Number(card.answer()) })),
        ...buildArithmeticRelationshipCards("in-order").map((card) => ({ prompt: card.expression(), answer: Number(card.answer()) })),
        ...buildEquivalentExpressionCards("in-order").map((card) => ({ prompt: card.expression(), answer: Number(card.answer()) })),
    ];

    return buildPreAlgebraPromptDeck(prompts, order);
};

const buildPreAlgebraCards = (settings: PreAlgebraSettings): ICard[] => {
    const promptsByLevel: Record<PreAlgebraLevel, ICard[]> = {
        "signed-number-sense": buildSignedNumberCards(settings.order),
        "algebra-language": buildAlgebraLanguageCards(settings.order),
        "arithmetic-relationships": buildArithmeticRelationshipCards(settings.order),
        "equivalent-expressions": buildEquivalentExpressionCards(settings.order),
        "readiness-mix": buildReadinessMixCards(settings.order),
    };

    return promptsByLevel[settings.level];
};

export const concepts: Concept[] = [
    {
        id: "addition-subtraction",
        label: "Add & Subtract",
        textColor: "text-yellow-500",
        getDefaultSettings: () => ({
            kind: "integer",
            selectedFactors: [...FACTOR_OPTIONS],
            mode: "addition",
            order: "in-order",
        }),
        buildFlashcards: (settings) => buildIntegerCards(settings as IntegerSettings),
        levels: [
            {
                id: "add-in-order",
                label: "Level 1 • Add • In order",
                settings: {
                    kind: "integer",
                    selectedFactors: [...FACTOR_OPTIONS],
                    mode: "addition",
                    order: "in-order",
                },
            },
            {
                id: "add-random",
                label: "Level 2 • Add • Random",
                settings: {
                    kind: "integer",
                    selectedFactors: [...FACTOR_OPTIONS],
                    mode: "addition",
                    order: "random",
                },
            },
            {
                id: "add-subtract-in-order",
                label: "Level 3 • Add + Subtract • In order",
                settings: {
                    kind: "integer",
                    selectedFactors: [...FACTOR_OPTIONS],
                    mode: "both",
                    order: "in-order",
                },
            },
            {
                id: "add-subtract-random",
                label: "Level 4 • Add + Subtract • Random",
                settings: {
                    kind: "integer",
                    selectedFactors: [...FACTOR_OPTIONS],
                    mode: "both",
                    order: "random",
                },
            },
        ],
    },
    {
        id: "multiplication-division",
        label: "Multiply & Divide",
        textColor: "text-indigo-500",
        getDefaultSettings: () => ({
            kind: "multiplication",
            selectedFactors: [...FACTOR_OPTIONS],
            mode: "multiplication",
            order: "in-order",
        }),
        buildFlashcards: (settings) => buildMultiplicationCards(settings as MultiplicationSettings),
        levels: [
            {
                id: "multiply-in-order",
                label: "Level 1 • Multiply • In order",
                settings: {
                    kind: "multiplication",
                    selectedFactors: [...FACTOR_OPTIONS],
                    mode: "multiplication",
                    order: "in-order",
                },
            },
            {
                id: "multiply-random",
                label: "Level 2 • Multiply • Random",
                settings: {
                    kind: "multiplication",
                    selectedFactors: [...FACTOR_OPTIONS],
                    mode: "multiplication",
                    order: "random",
                },
            },
            {
                id: "multiply-divide-in-order",
                label: "Level 3 • Multiply + Divide • In order",
                settings: {
                    kind: "multiplication",
                    selectedFactors: [...FACTOR_OPTIONS],
                    mode: "both",
                    order: "in-order",
                },
            },
            {
                id: "multiply-divide-random",
                label: "Level 4 • Multiply + Divide • Random",
                settings: {
                    kind: "multiplication",
                    selectedFactors: [...FACTOR_OPTIONS],
                    mode: "both",
                    order: "random",
                },
            },
        ],
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
        levels: [
            {
                id: "decimal-simple-no-regroup",
                label: "Level 1 • Simple • No regrouping",
                settings: {
                    kind: "decimal",
                    carry: "no-carry",
                    precision: "simple",
                    order: "random",
                },
            },
            {
                id: "decimal-simple-regroup",
                label: "Level 2 • Simple • Regrouping",
                settings: {
                    kind: "decimal",
                    carry: "carry",
                    precision: "simple",
                    order: "random",
                },
            },
            {
                id: "decimal-advanced-no-regroup",
                label: "Level 3 • Advanced • No regrouping",
                settings: {
                    kind: "decimal",
                    carry: "no-carry",
                    precision: "advanced",
                    order: "random",
                },
            },
            {
                id: "decimal-advanced-regroup",
                label: "Level 4 • Advanced • Regrouping",
                settings: {
                    kind: "decimal",
                    carry: "carry",
                    precision: "advanced",
                    order: "random",
                },
            },
        ],
    },
    {
        id: "pre-algebra-readiness",
        label: "Pre-Algebra Readiness",
        textColor: "text-violet-500",
        getDefaultSettings: () => ({
            kind: "pre-algebra",
            level: "signed-number-sense",
            order: "in-order",
        }),
        buildFlashcards: (settings) => buildPreAlgebraCards(settings as PreAlgebraSettings),
        levels: [
            {
                id: "signed-number-sense",
                label: "Level 1 • Signed Number Sense",
                settings: {
                    kind: "pre-algebra",
                    level: "signed-number-sense",
                    order: "in-order",
                },
            },
            {
                id: "algebra-language",
                label: "Level 2 • Algebra Language",
                settings: {
                    kind: "pre-algebra",
                    level: "algebra-language",
                    order: "in-order",
                },
            },
            {
                id: "arithmetic-relationships",
                label: "Level 3 • Arithmetic Relationships",
                settings: {
                    kind: "pre-algebra",
                    level: "arithmetic-relationships",
                    order: "in-order",
                },
            },
            {
                id: "equivalent-expressions",
                label: "Level 4 • Equivalent Expressions",
                settings: {
                    kind: "pre-algebra",
                    level: "equivalent-expressions",
                    order: "in-order",
                },
            },
            {
                id: "readiness-mix",
                label: "Level 5 • Readiness Mix",
                settings: {
                    kind: "pre-algebra",
                    level: "readiness-mix",
                    order: "random",
                },
            },
        ],
    },
];

export const getConcept = (id: string): Concept => concepts.find((concept) => concept.id === id) ?? concepts[0];
