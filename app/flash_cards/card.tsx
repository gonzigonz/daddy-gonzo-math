export interface ICard {
    operatorName: string;
    status: string;
    answer: () => string;
    className: () => string;
    clearStatus: () => void;
    expression: () => string;
}
