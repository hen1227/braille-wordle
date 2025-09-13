import type {TypedWord, TypedWordComparison} from "../types/braille.ts";
import {BrailleCellCompareView} from "./BrailleCellCompareView.tsx";
import React from "react";

export const PastGuessRow: React.FC<{
    guess: TypedWord;
    compareTo: (g: TypedWord) => TypedWordComparison
}> = ({ guess, compareTo }) => {
    const comps = compareTo(guess);
    return (
        <div className="game-row past-row">
            {guess.map((cell, i) => (
                <BrailleCellCompareView key={i} value={cell} comps={comps[i]} />
            ))}
        </div>
    );
};