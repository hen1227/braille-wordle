// LettersContext.tsx
import React, {type ReactNode, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
    type BrailleComparisonFunctionType,
    type CellInfoType, type FullWordInfoType,
    type TypedWord,
    type TypedWordComparison
} from "../types/braille.ts";
import {emptyTypedWord} from "../utils/DefaultValues.ts";
import {translateCellsToWord, wordToCells} from "../utils/BrailleTranslation.ts";
import {toast} from "react-toastify";
import {POSSIBLE_ANSWERS, VALID_WORDS} from "../utils/WordleAnswers.ts";
import {dayOfYear, mulberry32, ONE_DAY, startOfYear} from "../utils/Date.ts";
import {keyFor, safeParse} from "../utils/Storage.ts";
import {comparisonConstructor} from "../services/comparisonsService.ts";
import { LettersContext } from "./LettersContext.tsx";

export const LettersContextProvider: React.FC<{ children: ReactNode }> = ({children}) => {
    const [wordToSpell, setWordToSpell] = useState<string>("loading");
    const [userInput, setUserInput] = useState<TypedWord>(emptyTypedWord);
    const [pastInputs, setPastInputs] = useState<TypedWord[]>([]);

    const [infoByCell, setInfoByCell] = useState<CellInfoType>("cell");
    const [infoByWord, setInfoByWord] = useState<FullWordInfoType>("wordle");

    const comparisonFunction = useMemo<BrailleComparisonFunctionType>(() => {
        return comparisonConstructor(infoByCell, infoByWord);
    }, [infoByCell, infoByWord]);

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

    const getComparisonFor = useCallback((guess: TypedWord): TypedWordComparison => (
        comparisonFunction(target, guess)
    ), [target, comparisonFunction]);

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
    };

    return (
        <LettersContext.Provider value={{
            wordToSpell,
            setWordToSpell,
            target,
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

            infoByCell,
            setInfoByCell,
            infoByWord,
            setInfoByWord
        }}>
            {children}
        </LettersContext.Provider>
    );
};
