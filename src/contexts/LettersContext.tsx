import React from "react";
import type {TypedWord, TypedWordComparison} from "../types/braille.ts";

export interface LettersContextType {
    wordToSpell: string;
    setWordToSpell: React.Dispatch<React.SetStateAction<string>>;
    target: TypedWord;
    wordBrailleTranslation: string;
    userInput: TypedWord;
    setUserInput: React.Dispatch<React.SetStateAction<TypedWord>>;

    userInputTranslation: string;
    handleWordSubmit: () => void;

    pastInputs: TypedWord[];
    setPastInputs: React.Dispatch<React.SetStateAction<TypedWord[]>>;
    getComparisonFor: (guess: TypedWord) => TypedWordComparison;

    selectedDate: Date;
    setSelectedDate: React.Dispatch<React.SetStateAction<Date>>;
    canGoPrev: boolean;
    canGoNext: boolean;
    stepPrev: () => void;
    stepNext: () => void;
}

export const LettersContext = React.createContext<LettersContextType | null>(null);
