import React from "react";
import type {TypedWord} from "../types/braille.ts";

export interface BrailleTranslationContextType {
    isInitialized: boolean;
    translateCellsToAscii: (cells: TypedWord) => string;
    translateAsciiToCells: (word: string) => TypedWord;
    translateAsciiToWords: (text: string) => string;
    translateWordsToAscii: (words: string) => string;
    translateCellsToWords: (cells: TypedWord) => string;
    translateWordsToCells: (words: string) => TypedWord;
}

export const BrailleTranslationContext = React.createContext<BrailleTranslationContextType | null>(null);
