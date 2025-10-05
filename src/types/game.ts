export type GameMode = "wordle" | "by-dot" | "by-cell";

export type CellInfoType = "cell" | "dot" | "no-info";
export type FullWordInfoType = "wordle" | "no-info";

export const getInfoTypes = (mode: GameMode): {
    cellInfo: CellInfoType;
    wordInfo: FullWordInfoType;
} => {
    switch (mode) {
        case "by-dot":
            return {
                cellInfo: "dot",
                wordInfo: "no-info"
            }

        case "by-cell":
            return {
                cellInfo: "cell",
                wordInfo: "no-info"
            }

        case "wordle":
            return {
                cellInfo: "no-info",
                wordInfo: "wordle"
            }
    }
};

export const getGameModeIndex = (mode: GameMode): number => {
    switch (mode) {
        case "wordle": return 0;
        case "by-dot": return 1;
        case "by-cell": return 2;
    }
}
