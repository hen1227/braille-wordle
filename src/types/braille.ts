export type BrailleCell = [boolean, boolean, boolean, boolean, boolean, boolean];

export type TypedWord = [BrailleCell, BrailleCell, BrailleCell, BrailleCell, BrailleCell];

export interface LetterValidation {
    letter: string;
    expectedBraille: BrailleCell;
    userBraille: BrailleCell | null;
    isCorrect: boolean;
}

export enum Comparison {
    NO_MATCH = "NO_MATCH",
    PARTIAL_MATCH = "PARTIAL_MATCH",
    FULL_MATCH = "FULL_MATCH",
}

export type BrailleCellComparison = [Comparison, Comparison, Comparison, Comparison, Comparison, Comparison];
export type TypedWordComparison = [
    BrailleCellComparison,
    BrailleCellComparison,
    BrailleCellComparison,
    BrailleCellComparison,
    BrailleCellComparison
];
