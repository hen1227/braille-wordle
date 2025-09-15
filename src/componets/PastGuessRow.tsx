import type {TypedWord} from "../types/braille.ts";
import {BrailleCellCompareView} from "./BrailleCellCompareView.tsx";
import React, {useMemo} from "react";
import {useLettersContext} from "../contexts/useLettersContext.tsx";
import {useBrailleTranslationContext} from "../contexts/useBrailleTranslationContext.tsx";

export const PastGuessRow: React.FC<{
    guess: TypedWord;
}> = ({ guess }) => {

    const {translateCellsToWords, isInitialized} = useBrailleTranslationContext();
    const {getComparisonFor} = useLettersContext();
    const comps = getComparisonFor(guess);

    const guessWord = useMemo(()=> {
        return translateCellsToWords(guess)
    }, [guess, isInitialized]);

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
