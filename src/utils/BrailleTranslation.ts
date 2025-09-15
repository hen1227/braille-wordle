import type {BrailleCell} from "../types/braille.ts";

export const TABLES = "unicode.dis,en-ueb-g2.ctb"; // UEB Grade 2 + unicode display
// export const TABLES = "unicode.dis,en-ueb-g1.ctb"; // UEB Grade 1 + unicode display

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
