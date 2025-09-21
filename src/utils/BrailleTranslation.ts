import type {BrailleCell, TypedWord} from "../types/braille.ts";
import {emptyBrailleCell} from "./DefaultValues.ts";

export const BRAILLE_PATTERNS: { [key: string]: BrailleCell } = {
    'a': [true, false, false, false, false, false],
    'b': [true, true, false, false, false, false],
    'c': [true, false, false, true, false, false],
    'd': [true, false, false, true, true, false],
    'e': [true, false, false, false, true, false],
    'f': [true, true, false, true, false, false],
    'g': [true, true, false, true, true, false],
    'h': [true, true, false, false, true, false],
    'i': [false, true, false, true, false, false],
    'j': [false, true, false, true, true, false],
    'k': [true, false, true, false, false, false],
    'l': [true, true, true, false, false, false],
    'm': [true, false, true, true, false, false],
    'n': [true, false, true, true, true, false],
    'o': [true, false, true, false, true, false],
    'p': [true, true, true, true, false, false],
    'q': [true, true, true, true, true, false],
    'r': [true, true, true, false, true, false],
    's': [false, true, true, true, false, false],
    't': [false, true, true, true, true, false],
    'u': [true, false, true, false, false, true],
    'v': [true, true, true, false, false, true],
    'w': [false, true, false, true, true, true],
    'x': [true, false, true, true, false, true],
    'y': [true, false, true, true, true, true],
    'z': [true, false, true, false, true, true]
};


export function wordToCells(word?: string): TypedWord {
    if (!word || word.length !== 5) return to5([]);
    const cells = word
        .toLowerCase()
        .split("")
        .map(ch => BRAILLE_PATTERNS[ch] ?? emptyBrailleCell);
    return to5(cells);
}

export function translateCellsToWord(cells: TypedWord): string {
    return cells.map(cell => {
        const entry = Object.entries(BRAILLE_PATTERNS).find(([, pattern]) =>
            pattern.every((dot, idx) => dot === cell[idx])
        );
        return entry ? entry[0] : '_';
    } ).join('');
}



const to5 = (cells: BrailleCell[]): TypedWord => {
    const pad = [...cells];
    while (pad.length < 5) pad.push(emptyBrailleCell.slice() as BrailleCell);
    return pad.slice(0, 5) as TypedWord;
};
