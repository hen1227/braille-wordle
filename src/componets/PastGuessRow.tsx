import type {TypedWord} from "../types/braille.ts";
import {BrailleCellCompareView} from "./BrailleCellCompareView.tsx";
import React from "react";
import {translateCellsToWord} from "../utils/BrailleTranslation.ts";
import {useLettersContext} from "../contexts/useLettersContext.tsx";

export const PastGuessRow: React.FC<{
    guess: TypedWord;
}> = ({ guess }) => {

    const {getComparisonFor} = useLettersContext();
    const comps = getComparisonFor(guess);
    const guessWord = translateCellsToWord(guess);

    return (
        <div className="past-guess-wrapper">
            <div className="guess-word-label">{guessWord.toUpperCase()}</div>
            <div className="input-row past-row">
                {guess.map((cell, i) => (
                    <BrailleCellCompareView key={i} value={cell} comps={comps[i]} />
                ))}
            </div>
        </div>
    );
};
