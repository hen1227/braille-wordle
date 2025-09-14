
// Small helpers
export const startOfYear = (d: Date) => new Date(d.getFullYear(), 0, 1);
export const ONE_DAY = 24 * 60 * 60 * 1000;
export const dayOfYear = (d: Date) => Math.floor((d.getTime() - startOfYear(d).getTime()) / ONE_DAY);


// A tiny seeded RNG (Mulberry32) for stable per-day shuffles
export function mulberry32(seed: number) {
    return function() {
        let t = seed += 0x6D2B79F5;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}
