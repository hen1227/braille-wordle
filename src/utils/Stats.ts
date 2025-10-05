// src/utils/Stats.ts
import type {GameMode} from "../types/game.ts";
import {STORAGE_PREFIX} from "./Storage.ts";
import type {GuessDistribution, Stats} from "../types/stats.ts";
import {emptyStats} from "./DefaultValues.ts";

/**
 * Generates the localStorage key for a specific game mode’s stats.
 * @param {GameMode} mode - The current game mode.
 * @returns {string} A unique storage key for stats.
 */
const keyForStats = (mode: GameMode): string => `${STORAGE_PREFIX}:stats:v2:${mode}`;

/**
 * Loads stats for a given game mode from localStorage.
 * @param {GameMode} gameMode - The mode to load stats for.
 * @returns {Stats} The parsed and normalized stats object.
 */
export function loadStats(gameMode: GameMode): Stats {
    const raw = localStorage.getItem(keyForStats(gameMode));
    if (!raw) {
        // No stats exist — return defaults instead of throwing
        return emptyStats;
    }

    try {
        const parsed = JSON.parse(raw) as Stats;

        const normalizedDist: GuessDistribution = {};
        for (let i = 1; i <= 8; i++) {
            const key = String(i);
            normalizedDist[key] = 0;
        }

        if (parsed.guessDist) {
            Object.entries(parsed.guessDist).forEach(([k, v]) => {
                normalizedDist[String(k)] = v || 0;
            });
        }

        return {
            gamesPlayed: parsed.gamesPlayed ?? 0,
            wins: parsed.wins ?? 0,
            currentStreak: parsed.currentStreak ?? 0,
            maxStreak: parsed.maxStreak ?? 0,
            guessDist: normalizedDist,
            lastPlayedKey: parsed.lastPlayedKey,
        };
    } catch {
        // Handle malformed JSON or parse error
        return emptyStats;
    }
}


/**
 * Saves a given stats object to localStorage for a game mode.
 * @param {GameMode} gameMode - The current game mode.
 * @param {Stats} next - The stats to save.
 */
export function saveStats(gameMode: GameMode, next: Stats) {
    const key = keyForStats(gameMode);
    const json = JSON.stringify(next);
    localStorage.setItem(key, json);
}

/**
 * Creates a unique key for the current day and game mode.
 * @param {Date} date - The date to use.
 * @param {GameMode} gameMode - The current game mode.
 * @returns {string} A formatted day key like "YYYY-MM-DD|mode".
 */
export function dayKey(date: Date, gameMode: GameMode) {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}|${gameMode}`;
}

/**
 * Records a win in the stats and updates guess distribution.
 * @param {Stats} stats - The current stats.
 * @param {number} guessesUsed - The number of guesses used to win.
 * @param {string} key - The current day’s key.
 * @returns {Stats} Updated stats with win recorded.
 */
export function recordWin(stats: Stats, guessesUsed: number, key: string): Stats {
    const capped = Math.max(1, Math.min(8, guessesUsed));
    const cappedKey = String(capped);

    return {
        ...stats,
        gamesPlayed: stats.gamesPlayed + 1,
        wins: stats.wins + 1,
        currentStreak: stats.currentStreak + 1,
        maxStreak: Math.max(stats.maxStreak, stats.currentStreak + 1),
        guessDist: {
            ...stats.guessDist,
            [cappedKey]: (stats.guessDist[cappedKey] || 0) + 1
        },
        lastPlayedKey: key,
    };
}

/**
 * Records a loss in the stats and resets the current streak.
 * @param {Stats} stats - The current stats.
 * @param {string} key - The current day’s key.
 * @returns {Stats} Updated stats with loss recorded.
 */
export function recordLoss(stats: Stats, key: string): Stats {
    return {
        ...stats,
        gamesPlayed: stats.gamesPlayed + 1,
        currentStreak: 0,
        lastPlayedKey: key,
    };
}
