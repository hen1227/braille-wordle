// src/utils/Date.ts
/**
 * Returns the first day of the given year.
 * @param {Date} d - Date reference.
 * @returns {Date} January 1st of that year.
 */
export const startOfYear = (d: Date): Date => new Date(d.getFullYear(), 0, 1);

/** Number of milliseconds in one day. */
export const ONE_DAY = 24 * 60 * 60 * 1000;

/**
 * Calculates the day number within the year (1–365/366).
 * @param {Date} d - Date to evaluate.
 * @returns {number} Day of the year (0-based).
 */
export const dayOfYear = (d: Date): number =>
    Math.floor((d.getTime() - startOfYear(d).getTime()) / ONE_DAY);

/**
 * Creates a deterministic pseudo-random generator using the Mulberry32 algorithm.
 * @param {number} seed - Seed for the generator.
 * @returns {() => number} Function returning a random float in [0, 1).
 * @example
 * const rand = mulberry32(123);
 * console.log(rand()); // → 0.6731...
 */
export function mulberry32(seed: number): () => number {
    return function() {
        let t = seed += 0x6D2B79F5;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}
