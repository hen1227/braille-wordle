import {
    type BrailleCell, type BrailleCellComparison,
    type BrailleComparisonFunctionType, type CellInfoType,
    Comparison, type FullWordInfoType,
    type TypedWord,
} from "../types/braille.ts";

const compareValue = (expected: boolean, actual: boolean): Comparison =>
    expected && actual ? Comparison.FULL_MATCH
        : (actual ? Comparison.NO_MATCH : Comparison.NO_INFO);

/**
 * Compares two TypedWords cell by cell.
 * Checks and colors the dots based on what's in the cell. Just checks if a dot is on or off and if it should be.
 * If it is but shouldn't be, it's a NO_MATCH. If it is and should be, FULL_MATCH. Else, NO_INFO.
 *
 * @param expected the expected word
 * @param actual the actual word
 *
 * @returns TypedWordComparison indicating the comparison results for each dot in each cell
 */
const compareCell = (expected: BrailleCell, actual: BrailleCell): Comparison[] => (
    Array.from({length: 6}, (_, i) => compareValue(expected[i], actual[i]))
);


/**
 * Returns a comparison for the entire cell based on the traditional Wordle rules. Colors entire words
 * at a time based on if the entire character is correct, partially correct, or incorrect.
 *
 */
const getFullCellComparison = (index: number, target: TypedWord, guess: TypedWord): Comparison => {
    const keyOf = (cell: BrailleCell) => cell.map(b => (b ? "1" : "0")).join("");
    const eq = (a: BrailleCell, b: BrailleCell) => a.every((v, i) => v === b[i]);

    // Count occurrences of each target cell pattern
    const counts = new Map<string, number>();
    for (let i = 0; i < 5; i++) {
        const k = keyOf(target[i]);
        counts.set(k, (counts.get(k) ?? 0) + 1);
    }

    // First pass: exact matches
    const marks: Comparison[] = Array(5).fill(Comparison.NO_INFO);
    for (let i = 0; i < 5; i++) {
        if (eq(target[i], guess[i])) {
            marks[i] = Comparison.FULL_MATCH;
            const k = keyOf(target[i]);
            counts.set(k, (counts.get(k) ?? 0) - 1);
        }
    }

    // Second pass: partials and misses
    for (let i = 0; i < 5; i++) {
        if (marks[i] !== Comparison.NO_INFO) continue;
        const gKey = keyOf(guess[i]);
        const remaining = counts.get(gKey) ?? 0;
        if (remaining > 0) {
            marks[i] = Comparison.PARTIAL_MATCH;
            counts.set(gKey, remaining - 1);
        } else {
            marks[i] = Comparison.NO_MATCH;
        }
    }

    return marks[index]!;
};

const getNoInfoFullCellComparison = (): Comparison => Comparison.NO_INFO;

export const getMatchString = (cmp?: Comparison): string => {
    if (!cmp) return "no-info";
    switch (cmp) {
        case Comparison.FULL_MATCH:
            return "match";
        case Comparison.PARTIAL_MATCH:
            return "partial";
        case Comparison.NO_MATCH:
            return "miss";
        case Comparison.NO_INFO:
        default:
            return "no-info";
    }
}


/**
 * Compares two TypedWords dot by dot.
 * Checks and colors the dots based on if each dot is present in the word.
 * If a dot is present in the guess and in the correct character, it's a FULL_MATCH.
 * If a dot is present in the guess but not in the correct character, it's a PARTIAL_MATCH.
 * If a dot is in the target but not present in the guess, it's NO_MATCH.
 * Else, NO_INFO.
 *
 * @param target
 * @param guess
 */
const dotByDotComparison = (target: TypedWord, guess: TypedWord): Comparison[][] => {
    // result initialized to NO_INFO
    const res: Comparison[][] = Array.from({length: 5}, () =>
        Array.from({length: 6}, () => Comparison.NO_INFO)
    );

    const numberOfEachDotInTarget: number[] = Array.from({length: 6}, () => 0);
    const numberOfEachDotSoFarInGuess: number[] = Array.from({length: 6}, () => 0);

    // count how many of each dot there are in the target
    target.forEach(cell => {
        cell.forEach((dot, i) => {
            if (dot) numberOfEachDotInTarget[i]++;
        });
    });

    // first pass: check for FULL_MATCH
    guess.forEach((cell, cellIdx) => {
        cell.forEach((dot, dotIdx) => {
            if (dot && target[cellIdx][dotIdx]) {
                res[cellIdx][dotIdx] = Comparison.FULL_MATCH;
                numberOfEachDotSoFarInGuess[dotIdx]++;
            }
        });
    });

    // second pass: check for PARTIAL_MATCH and NO_MATCH
    guess.forEach((cell, cellIdx) => {
        cell.forEach((dot, dotIdx) => {
            if (dot && res[cellIdx][dotIdx] !== Comparison.FULL_MATCH) {
                if (numberOfEachDotSoFarInGuess[dotIdx] < numberOfEachDotInTarget[dotIdx]) {
                    res[cellIdx][dotIdx] = Comparison.PARTIAL_MATCH;
                    numberOfEachDotSoFarInGuess[dotIdx]++;
                } else {
                    res[cellIdx][dotIdx] = Comparison.NO_MATCH;
                }
            } else if (!dot && target[cellIdx][dotIdx]) {
                res[cellIdx][dotIdx] = Comparison.NO_INFO;
            }
        });
    });

    return res;
};


/**
 * Constructs a BrailleComparisonFunctionType based on the provided dotMethod and fullWordMethod.
 * Returns a function that gives the comparison logic. This functions allows for flexible comparison strategies.
 *
 * @param dotMethod
 * @param fullWordMethod
 */
export const comparisonConstructor = (
    dotMethod: CellInfoType,
    fullWordMethod: FullWordInfoType
): BrailleComparisonFunctionType => {
    return (target: TypedWord, guess: TypedWord): BrailleCellComparison[] => {
        return Array.from({ length: 5 }, (_, i) => {
            let comparisons: Comparison[];
            if (dotMethod === "cell") {
                comparisons = compareCell(target[i], guess[i]);
            } else if (dotMethod === "dot") {
                comparisons = dotByDotComparison(target, guess)[i]!;
            } else {
                comparisons = Array.from({ length: 6 }, () => Comparison.NO_INFO);
            }

            let fullCellComparison: Comparison;
            if (fullWordMethod === "wordle") {
                fullCellComparison = getFullCellComparison(i, target, guess);
            } else {
                fullCellComparison = getNoInfoFullCellComparison();
            }

            return { comparisons, fullCellComparison };
        });
    };
};
