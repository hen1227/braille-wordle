export type BrailleCell = boolean[];
export type TypedWord = BrailleCell[];

export enum Comparison {
    NO_MATCH = "NO_MATCH",
    PARTIAL_MATCH = "PARTIAL_MATCH",
    NO_INFO = "NO_INFO",
    FULL_MATCH = "FULL_MATCH",
}

export type BrailleCellComparison = {
    comparisons: Comparison[],
    fullCellComparison: Comparison
};
export type TypedWordComparison = BrailleCellComparison[];

export type CellInfoType = "cell" | "dot" | "no-info";
export type FullWordInfoType = "wordle" | "no-info";

export type BrailleComparisonFunctionType = (guess: TypedWord, target: TypedWord) => TypedWordComparison;
