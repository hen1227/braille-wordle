// LettersContext.tsx
import React, {type ReactNode, useEffect, useMemo, useRef, useState} from 'react';
import {
    type BrailleCell,
    type BrailleCellComparison,
    Comparison,
    type TypedWord,
    type TypedWordComparison
} from "../types/braille.ts";
import {emptyTypedWord} from "../utils/DefaultValues.ts";
import {translateCellsToWord, wordToCells} from "../utils/BrailleTranslation.ts";
import {toast} from "react-toastify";
import {POSSIBLE_ANSWERS, VALID_WORDS} from "../utils/WordleAnswers.ts";
import {dayOfYear, mulberry32, ONE_DAY, startOfYear} from "../utils/Date.ts";
import {LettersContext} from "./LettersContext.tsx";
import {keyFor, safeParse} from "../utils/Storage.ts";

export const LettersContextProvider: React.FC<{ children: ReactNode }> = ({children}) => {
    const [wordToSpell, setWordToSpell] = useState<string>("loading");
    const [userInput, setUserInput] = useState<TypedWord>(emptyTypedWord);
    const [pastInputs, setPastInputs] = useState<TypedWord[]>([]);

    // hydration guard to avoid saving while we're loading from storage
    const hydratingRef = useRef(false);

    // date state
    const today = useMemo(() => {
        const t = new Date();
        return new Date(t.getFullYear(), t.getMonth(), t.getDate());
    }, []);
    const [selectedDate, setSelectedDate] = useState<Date>(today);

    const minDate = useMemo(() => startOfYear(today), [today]);
    const canGoPrev = selectedDate.getTime() > minDate.getTime();
    const canGoNext = selectedDate.getTime() < today.getTime();

    const stepPrev = () => { if (canGoPrev) setSelectedDate(d => new Date(d.getTime() - ONE_DAY)); };
    const stepNext = () => { if (canGoNext) setSelectedDate(d => new Date(d.getTime() + ONE_DAY)); };

    const userInputTranslation = useMemo(
        () => translateCellsToWord(userInput),
        [userInput]
    );

    const target = useMemo(() => wordToCells(wordToSpell), [wordToSpell]);

    // Pick deterministic word for the selected date (or use saved override if present)
    useEffect(() => {
        const doy = dayOfYear(selectedDate); // 0-based
        const seed = (selectedDate.getFullYear() * 1000 + doy) | 0;
        const rng = mulberry32(seed);
        const randomIndex = Math.floor(rng() * POSSIBLE_ANSWERS.length);
        const computedWord = POSSIBLE_ANSWERS[randomIndex];

        // Try to load an explicitly saved word (not strictly necessary, but future-proof)
        const savedWord = safeParse<string | null>(
            localStorage.getItem(keyFor(selectedDate, "word")),
            null
        );

        setWordToSpell(savedWord ?? computedWord);
    }, [selectedDate]);

    // Load saved inputs for this day whenever the date changes
    useEffect(() => {
        hydratingRef.current = true;

        const savedUserInput = safeParse<TypedWord>(
            localStorage.getItem(keyFor(selectedDate, "userInput")),
            emptyTypedWord
        );
        const savedPastInputs = safeParse<TypedWord[]>(
            localStorage.getItem(keyFor(selectedDate, "pastInputs")),
            []
        );

        setUserInput(savedUserInput);
        setPastInputs(savedPastInputs);

        // Allow state to settle before enabling saves
        // (microtask tick to avoid immediately firing the saver effect)
        Promise.resolve().then(() => { hydratingRef.current = false; });
    }, [selectedDate]);

    // Save on changes (skip while hydrating)
    useEffect(() => {
        if (hydratingRef.current) return;
        localStorage.setItem(keyFor(selectedDate, "userInput"), JSON.stringify(userInput));
    }, [selectedDate, userInput]);

    useEffect(() => {
        if (hydratingRef.current) return;
        localStorage.setItem(keyFor(selectedDate, "pastInputs"), JSON.stringify(pastInputs));
    }, [selectedDate, pastInputs]);

    useEffect(() => {
        if (hydratingRef.current) return;
        localStorage.setItem(keyFor(selectedDate, "word"), JSON.stringify(wordToSpell));
    }, [selectedDate, wordToSpell]);

    const compareValue = (expected: boolean, actual: boolean): Comparison =>
        expected && actual ? Comparison.FULL_MATCH
            : (actual ? Comparison.NO_MATCH : Comparison.PARTIAL_MATCH);

    const compareCell = (expected: BrailleCell, actual: BrailleCell): BrailleCellComparison => (
        Array.from({ length: 6 }, (_, i) => compareValue(expected[i], actual[i])) as BrailleCellComparison
    );

    const getComparisonFor = React.useCallback((guess: TypedWord): TypedWordComparison => (
        Array.from({ length: 5 }, (_, i) => compareCell(target[i], guess[i])) as TypedWordComparison
    ), [target]);

    const handleWordSubmit = () => {
        if (userInputTranslation.length !== 5 || /[^a-z]/.test(userInputTranslation)) {
            toast.error("Please enter a valid 5-letter word.");
            return;
        }
        if (!VALID_WORDS.includes(userInputTranslation)) {
            toast.error("Word not in the list of possible answers.");
            return;
        }
        if (userInputTranslation === wordToSpell) {
            toast.success("Congratulations! You've spelled the word correctly!");
        }

        setPastInputs(prev => [...prev, userInput]);
        setUserInput(emptyTypedWord);
        // Saving to localStorage is handled by the effects above
    };

    const wordBrailleTranslation = useMemo(
        () => `translated word ${wordToSpell}`,
        [wordToSpell]
    );

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
            getComparisonFor,

            selectedDate,
            setSelectedDate,
            canGoPrev,
            canGoNext,
            stepPrev,
            stepNext,
        }}>
            {children}
        </LettersContext.Provider>
    );
};
