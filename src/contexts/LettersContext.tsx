import React from "react";
import type {CellInfoType, FullWordInfoType, TypedWord, TypedWordComparison} from "../types/braille.ts";

export interface LettersContextType {
    wordToSpell: string;
    setWordToSpell: React.Dispatch<React.SetStateAction<string>>;
    target: TypedWord;
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

    infoByCell: CellInfoType;
    setInfoByCell: React.Dispatch<React.SetStateAction<CellInfoType>>;
    infoByWord: FullWordInfoType
    setInfoByWord: React.Dispatch<React.SetStateAction<FullWordInfoType>>;
}

export const LettersContext = React.createContext<LettersContextType | null>(null);
