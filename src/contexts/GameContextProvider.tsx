// src/contexts/GameContext.tsx
import React, {type ReactNode, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
    type BrailleComparisonFunctionType,
    type TypedWord,
    type TypedWordComparison
} from "../types/braille.ts";
import {emptyTypedWord} from "../utils/DefaultValues.ts";
import {translateCellsToWord, wordToCells} from "../services/brailleTranslationService.ts";
import {toast} from "react-toastify";
import {POSSIBLE_ANSWERS, VALID_WORDS} from "../utils/WordleAnswers.ts";
import {dayOfYear, mulberry32, ONE_DAY, startOfYear} from "../utils/Date.ts";
import {keyFor, safeParse, STORAGE_PREFIX} from "../utils/Storage.ts";
import {comparisonConstructor} from "../services/comparisonsService.ts";
import {GameContext} from "./GameContext.tsx";
import {
    type GameMode,
    getGameModeIndex,
    getInfoTypes
} from "../types/game.ts";
import {dayKey, loadStats, recordLoss, recordWin, saveStats} from "../utils/Stats.ts";
import {MAX_GUESSES} from "../utils/Game.ts";

/**
 * Provides the context for the main game logic and state
 */
export const GameContextProvider: React.FC<{ children: ReactNode }> = ({children}) => {
    const [wordToSpell, setWordToSpell] = useState<string>("loading");
    const [userInput, setUserInput] = useState<TypedWord>(emptyTypedWord);
    const [pastInputs, setPastInputs] = useState<TypedWord[]>([]);

    const [gameMode, setGameMode] = useState<GameMode>(() => {
        const saved = localStorage.getItem(`${STORAGE_PREFIX}gameMode`);
        return (saved === "wordle" || saved === "by-dot" || saved === "by-cell")
            ? (saved as GameMode)
            : "wordle";
    });
    const [darkMode, setDarkMode] = useState<boolean>(() => {
        const savedDark = localStorage.getItem(`${STORAGE_PREFIX}darkMode`);
        return savedDark !== "false"; // default true
    });

    const [statsOpen, setStatsOpen] = useState(false);

    const isWin = useMemo(() =>
            pastInputs.some(input => translateCellsToWord(input) === wordToSpell),
        [pastInputs, wordToSpell]);

    const gameOver = useMemo(() =>
            pastInputs.length >= MAX_GUESSES || isWin,
        [pastInputs, isWin]);

    useEffect(() => {
        localStorage.setItem(`${STORAGE_PREFIX}gameMode`, gameMode);
    }, [gameMode]);

    useEffect(() => {
        localStorage.setItem(`${STORAGE_PREFIX}darkMode`, darkMode ? "true" : "false");
        if (darkMode) document.body.classList.remove("light");
        else document.body.classList.add("light");
    }, [darkMode]);

    const comparisonFunction = useMemo<BrailleComparisonFunctionType>(() => {
        const infoTypes = getInfoTypes(gameMode);
        return comparisonConstructor(infoTypes.cellInfo, infoTypes.wordInfo);
    }, [gameMode]);

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

    const stepPrev = () => {
        if (canGoPrev) setSelectedDate(d => new Date(d.getTime() - ONE_DAY));
    };
    const stepNext = () => {
        if (canGoNext) setSelectedDate(d => new Date(d.getTime() + ONE_DAY));
    };

    const userInputTranslation = useMemo(
        () => translateCellsToWord(userInput),
        [userInput]
    );

    const target = useMemo(() => wordToCells(wordToSpell), [wordToSpell]);

    // Pick deterministic word for the selected date (or use saved override if present)
    useEffect(() => {
        const doy = dayOfYear(selectedDate); // 0-based
        const gameModeTypeOffset = getGameModeIndex(gameMode); // 0, 1, or 2
        const seed = ((selectedDate.getFullYear() * 1000 + doy) | 0) + gameModeTypeOffset * 10000;
        const rng = mulberry32(seed);
        const randomIndex = Math.floor(rng() * POSSIBLE_ANSWERS.length);
        const computedWord = POSSIBLE_ANSWERS[randomIndex];
        setWordToSpell(computedWord);
    }, [selectedDate, gameMode]);

    // Load saved inputs for this day whenever the date or mode changes
    useEffect(() => {
        hydratingRef.current = true;

        const savedUserInput = safeParse<TypedWord>(
            localStorage.getItem(keyFor(selectedDate, gameMode, "userInput")),
            emptyTypedWord
        );
        const savedPastInputs = safeParse<TypedWord[]>(
            localStorage.getItem(keyFor(selectedDate, gameMode, "pastInputs")),
            []
        );

        setUserInput(savedUserInput);
        setPastInputs(savedPastInputs);

        Promise.resolve().then(() => {
            hydratingRef.current = false;
        });
    }, [selectedDate, gameMode]);

    // Save on changes (skip while hydrating)
    useEffect(() => {
        if (hydratingRef.current) return;
        localStorage.setItem(keyFor(selectedDate, gameMode, "userInput"), JSON.stringify(userInput));
    }, [selectedDate, gameMode, userInput]);

    useEffect(() => {
        if (hydratingRef.current) return;
        localStorage.setItem(keyFor(selectedDate, gameMode, "pastInputs"), JSON.stringify(pastInputs));
    }, [selectedDate, gameMode, pastInputs]);

    const getComparisonFor = useCallback(
        (guess: TypedWord): TypedWordComparison => comparisonFunction(target, guess),
        [target, comparisonFunction]
    );

    const handleWordSubmit = () => {
        if (userInputTranslation.length !== 5 || /[^a-z]/.test(userInputTranslation)) {
            toast.error("Please enter a valid 5-letter word.");
            return;
        }
        if (!VALID_WORDS.includes(userInputTranslation)) {
            toast.error("Word not in the list of possible answers.");
            return;
        }

        const didWin = userInputTranslation === wordToSpell;
        if (didWin) toast.success("Nice! You solved it!");

        setPastInputs(prev => [...prev, userInput]);
        setUserInput(emptyTypedWord);

        // If win, record stats once for this date+mode
        if (didWin) {
            const key = dayKey(selectedDate, gameMode);
            const stats = loadStats(gameMode);
            if (stats.lastPlayedKey !== key) {
                const guessesUsed = (pastInputs.length + 1);
                saveStats(gameMode, recordWin(stats, guessesUsed, key));
            }
            setStatsOpen(true); // auto-show modal
        }
    };

    useEffect(() => {
        if (!gameOver) return;
        if (isWin) return; // win path is handled in submit
        const key = dayKey(selectedDate, gameMode);
        const stats = loadStats(gameMode);
        if (stats.lastPlayedKey !== key) {
            saveStats(gameMode, recordLoss(stats, key));
        }
        setStatsOpen(true);
    }, [gameOver, isWin, selectedDate, gameMode]);

    return (
        <GameContext.Provider value={{
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

            statsOpen,
            setStatsOpen,
            gameOver,
            isWin,

            gameMode,
            setGameMode,
            darkMode,
            setDarkMode,
        }}>
            {children}
        </GameContext.Provider>
    );
};
