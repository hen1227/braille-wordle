import React, {useContext, useState, useMemo, type ReactNode} from 'react';
import {
    type BrailleCell, type BrailleCellComparison,
    Comparison,
    type TypedWord,
    type TypedWordComparison
} from "../types/braille.ts";
import {emptyTypedWord} from "../utils/DefaultValues.ts";
import {translateCellsToWord, wordToCells} from "../utils/BrailleTranslation.ts";
import {toast} from "react-toastify";

interface LettersContextType {
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
}

const LettersContext = React.createContext<LettersContextType | null>(null);

export const LettersContextProvider: React.FC<{ children: ReactNode }> = ({children}) => {

    const [wordToSpell, setWordToSpell] = useState<string>("horse");
    const [userInput, setUserInput] = useState<TypedWord>(emptyTypedWord);

    const [pastInputs, setPastInputs] = useState<TypedWord[]>([]);

    const userInputTranslation = useMemo(() => {
        return translateCellsToWord(userInput);
    }, [userInput])

    const target = useMemo(() => wordToCells(wordToSpell), [wordToSpell]);

    // helpers (optional to place near the provider)
    const compareCell = (expected: BrailleCell, actual: BrailleCell): BrailleCellComparison => {
        return [
            expected[0] === actual[0] ? Comparison.FULL_MATCH : Comparison.NO_MATCH,
            expected[1] === actual[1] ? Comparison.FULL_MATCH : Comparison.NO_MATCH,
            expected[2] === actual[2] ? Comparison.FULL_MATCH : Comparison.NO_MATCH,
            expected[3] === actual[3] ? Comparison.FULL_MATCH : Comparison.NO_MATCH,
            expected[4] === actual[4] ? Comparison.FULL_MATCH : Comparison.NO_MATCH,
            expected[5] === actual[5] ? Comparison.FULL_MATCH : Comparison.NO_MATCH,
        ];
    };

    const getComparisonFor = React.useCallback((guess: TypedWord): TypedWordComparison => {
        return [
            compareCell(target[0], guess[0]),
            compareCell(target[1], guess[1]),
            compareCell(target[2], guess[2]),
            compareCell(target[3], guess[3]),
            compareCell(target[4], guess[4]),
        ];
    }, [target]);



    const handleWordSubmit = () => {
        if (userInputTranslation.length !== 5 || /[^a-z]/.test(userInputTranslation)) {
            toast.error("Please enter a valid 5-letter word.");
            return; // <- important
        }
        if (userInputTranslation === wordToSpell) {
            toast.success("Congratulations! You've spelled the word correctly!");
        }
        setPastInputs(prev => [...prev, userInput]);
        setUserInput(emptyTypedWord);
    };

    const wordBrailleTranslation = useMemo(() => {
        return `translated word ${wordToSpell}`
    }, [wordToSpell])

    return (
        <LettersContext.Provider value={{
            wordToSpell,
            setWordToSpell,
            target,
            wordBrailleTranslation,
            userInput,
            setUserInput,
            userInputTranslation,
            handleWordSubmit,

            pastInputs,
            setPastInputs,
            getComparisonFor
        }}>
            {children}
        </LettersContext.Provider>
    );
}

export const useLettersContext = () => {
    const ctx = useContext(LettersContext);
    if (!ctx) throw new Error("useLetters must be used inside LettersContextProvider");
    return ctx;
};
