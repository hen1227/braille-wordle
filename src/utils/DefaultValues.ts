import {type BrailleCell, type TypedWord} from "../types/braille.ts";
import type {GuessDistribution} from "../types/stats.ts";
import {MAX_GUESSES} from "./Game.ts";

export const emptyBrailleCell: BrailleCell = [false, false, false, false, false, false]

export const emptyTypedWord: TypedWord =
    [emptyBrailleCell, emptyBrailleCell,
        emptyBrailleCell, emptyBrailleCell,
        emptyBrailleCell]

/**
 * Creates an empty guess distribution with keys 1–MAX_GUESSES.
 * @returns {GuessDistribution} Initialized distribution with all zeros.
 */
const emptyGuessDistribution = (): GuessDistribution => {
    const d: GuessDistribution = {};
    for (let i = 1; i <= MAX_GUESSES; i++) {
        d[String(i)] = 0;
    }
    return d;
};

export const emptyStats = {
    gamesPlayed: 0,
    wins: 0,
    currentStreak: 0,
    maxStreak: 0,
    guessDist: emptyGuessDistribution(),
    lastPlayedKey: undefined,
};
