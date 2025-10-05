export type GuessDistribution = Record<string | number, number>;

export type Stats = {
    gamesPlayed: number;
    wins: number;
    currentStreak: number;
    maxStreak: number;
    guessDist: GuessDistribution;
    lastPlayedKey?: string;
};
