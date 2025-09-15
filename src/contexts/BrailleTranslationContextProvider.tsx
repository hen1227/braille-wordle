// BrailleTranslationContextProvider.tsx
import React, {type ReactNode, useEffect} from 'react';
import {BrailleTranslationContext} from "./BrailleTranslationContext.tsx";
import {brailleAsciiToBrailleDots, brailleDotsListToAscii} from "../utils/BrailleUnicode.ts";
import type {BrailleCell, TypedWord} from "../types/braille.ts";

import {
    lou_backTranslateString,
    lou_initialize,
    lou_isInitialized,
    lou_translateString
} from '../braille/liblouisWrapper.ts';
import {TABLES} from "../utils/BrailleTranslation.ts";

export const BrailleTranslationContextProvider: React.FC<{ children: ReactNode }> = ({children}) => {

    const [isInitialized, setIsInitialized] = React.useState(lou_isInitialized());

    // const liblouis =
    const translateCellsToAscii = (cells: BrailleCell[]) => {
        return brailleDotsListToAscii(cells);
    }

    const translateAsciiToCells = (word: string) => {
        return brailleAsciiToBrailleDots(word) as TypedWord;
    }

    const translateAsciiToWords = (text: string) => {
        if (!isInitialized) {
            return "Liblouis not initialized";
        }

        const rawWords = lou_backTranslateString(text, TABLES);

        // Not perfect, but a good start for now.
        return rawWords
            // Remove all instances of \\numbers\/ which are placeholders.
            .replace(/\\[0-9]+\//g, '?')
            // Remove any non letter characters (punctuation, etc)
            .replace(/[^a-zA-Z?]/g, '?')
    }

    const translateWordsToAscii = (words: string) => {
        if (!isInitialized) {
            return "Liblouis not initialized";
        }

        return lou_translateString(words, TABLES);
    }

    const translateCellsToWords = (cells: BrailleCell[]) => {
        const ascii = translateCellsToAscii(cells);
        return translateAsciiToWords(ascii);
    }

    const translateWordsToCells = (words: string) => {
        const ascii = translateWordsToAscii(words);
        return translateAsciiToCells(ascii);
    }

    useEffect(() => {
        if (!lou_isInitialized()) {
            lou_initialize().then(() => {
                setIsInitialized(lou_isInitialized());
                console.log("Lou initialized")
            });
        } else {
            setIsInitialized(true);
        }
    }, []);

    return (
        <BrailleTranslationContext.Provider value={{
            isInitialized,
            translateCellsToAscii,
            translateAsciiToCells,
            translateAsciiToWords,
            translateWordsToAscii,
            translateCellsToWords,
            translateWordsToCells

        }}>
            {children}
        </BrailleTranslationContext.Provider>
    );
};
