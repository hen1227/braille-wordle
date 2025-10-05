// src/utils/Storage.ts
import type {GameMode} from "../types/game.ts";

/**
 * Pads a number with a leading zero if it's less than 10.
 * @param {number} n - Number to pad.
 * @returns {string} Two-digit string.
 */
export const pad2 = (n: number): string => (n < 10 ? `0${n}` : `${n}`);

/**
 * Formats a Date object as a local YYYY-MM-DD string.
 * @param {Date} d - Date to format.
 * @returns {string} Formatted date string.
 */
export const fmtLocalYMD = (d: Date): string =>
    `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;

/** Prefix used for all localStorage keys. */
export const STORAGE_PREFIX = "brailleWordle";

/**
 * Builds a consistent localStorage key for game data.
 * @param {Date} d - The date of the game.
 * @param {GameMode} gameMode - Current game mode.
 * @param {"userInput" | "pastInputs" | "word"} field - Specific data field.
 * @returns {string} The generated key.
 */
export const keyFor = (d: Date, gameMode: GameMode, field: "userInput" | "pastInputs" | "word"): string =>
    `${STORAGE_PREFIX}:${fmtLocalYMD(d)}:${gameMode}:${field}`;

/**
 * Safely parses a JSON string, returning a fallback on failure.
 * @template T
 * @param {string | null} raw - JSON string to parse.
 * @param {T} fallback - Default value if parsing fails.
 * @returns {T} Parsed value or fallback.
 */
export const safeParse = <T,>(raw: string | null, fallback: T): T => {
    if (!raw) return fallback;
    try {
        return JSON.parse(raw) as T;
    } catch {
        return fallback;
    }
};
