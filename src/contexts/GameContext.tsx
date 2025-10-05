import React from "react";
import type {TypedWord, TypedWordComparison} from "../types/braille.ts";
import type {GameMode} from "../types/game.ts";

/**
 * Context interface for managing the Braille Wordle game state and logic.
 * Provides centralized state management for game mechanics, user input,
 * navigation, and UI controls across the application.
 */
export interface GameContextType {
    /**
     * The target 5-letter word that the player needs to guess.
     * This word is deterministically selected based on the selected date and game mode.
     * @example "house", "brain", "light"
     */
    wordToSpell: string;

    /**
     * Setter function to update the target word.
     * Typically used internally when the date or game mode changes.
     */
    setWordToSpell: React.Dispatch<React.SetStateAction<string>>;

    /**
     * The target word converted to Braille cell representation.
     * Each letter is represented as a 2x3 grid of dots (TypedWord format).
     * Used for comparing user input against the correct answer.
     */
    target: TypedWord;

    /**
     * The current user's input as Braille cells.
     * Represents the word being constructed before submission.
     * Reset to empty after each submission.
     */
    userInput: TypedWord;

    /**
     * Setter function to update the current user input.
     * Used when toggling individual Braille dots in the input cells.
     */
    setUserInput: React.Dispatch<React.SetStateAction<TypedWord>>;

    /**
     * The user's current Braille input translated back to readable text.
     * Displays the word formed by the current Braille pattern configuration.
     * Updates in real-time as the user toggles dots.
     */
    userInputTranslation: string;

    /**
     * Submits the current user input as a guess.
     * Validates the input (5 letters, valid word from dictionary),
     * adds to past inputs, checks for win condition, and updates stats.
     * Shows appropriate toast notifications for invalid inputs or success.
     */
    handleWordSubmit: () => void;

    /**
     * Array of all previous guess attempts for the current puzzle.
     * Maximum of 6 guesses allowed per game.
     * Persisted to localStorage for the current date and game mode.
     */
    pastInputs: TypedWord[];

    /**
     * Setter function to update the past inputs array.
     * Generally used internally when adding new guesses or loading saved state.
     */
    setPastInputs: React.Dispatch<React.SetStateAction<TypedWord[]>>;

    /**
     * Returns comparison results for a given guess against the target.
     * Used to determine which dots/cells are correct, misplaced, or wrong.
     * Comparison logic varies based on the current game mode.
     * @param guess - The TypedWord to compare against the target
     * @returns Comparison results indicating correctness of each element
     */
    getComparisonFor: (guess: TypedWord) => TypedWordComparison;

    /**
     * The currently selected date for the puzzle.
     * Each date has a unique puzzle for each game mode.
     * Defaults to today's date, can be changed to play past puzzles.
     */
    selectedDate: Date;

    /**
     * Setter function to update the selected date.
     * Triggers loading of the corresponding puzzle and saved progress.
     */
    setSelectedDate: React.Dispatch<React.SetStateAction<Date>>;

    /**
     * Indicates whether the user can navigate to the previous day's puzzle.
     * False when at the minimum date (start of current year).
     */
    canGoPrev: boolean;

    /**
     * Indicates whether the user can navigate to the next day's puzzle.
     * False when at today's date (cannot play future puzzles).
     */
    canGoNext: boolean;

    /**
     * Navigates to the previous day's puzzle if available.
     * Respects the minimum date boundary (start of current year).
     */
    stepPrev: () => void;

    /**
     * Navigates to the next day's puzzle if available.
     * Respects the maximum date boundary (today's date).
     */
    stepNext: () => void;

    /**
     * Controls the visibility of the statistics modal.
     * Automatically opens when game ends (win or loss).
     * Can be manually toggled by the user.
     */
    statsOpen: boolean;

    /**
     * Setter function to show/hide the statistics modal.
     * Used for manual control and automatic display on game completion.
     */
    setStatsOpen: React.Dispatch<React.SetStateAction<boolean>>;

    /**
     * Indicates whether the current game has ended.
     * True when the player has won or used all 6 guesses.
     * When true, prevents further input and shows statistics.
     */
    gameOver: boolean;

    /**
     * Indicates whether the player has successfully guessed the word.
     * True when any past input matches the target word exactly.
     * Used to trigger win animations and update statistics.
     */
    isWin: boolean;

    /**
     * The current game difficulty mode.
     * - "wordle": Classic mode with letter-based feedback
     * - "by-dot": Easy mode with individual dot feedback
     * - "by-cell": Hard mode with whole Braille cell feedback
     * Persisted to localStorage and affects comparison logic.
     */
    gameMode: GameMode;

    /**
     * Setter function to change the game mode.
     * Triggers loading of new puzzle and saved state for that mode.
     * Each mode has independent progress and statistics.
     */
    setGameMode: React.Dispatch<React.SetStateAction<GameMode>>;

    /**
     * Controls the application's color theme.
     * True for dark mode (default), false for light mode.
     * Persisted to localStorage and applies appropriate CSS class to body.
     */
    darkMode: boolean;

    /**
     * Setter function to toggle between dark and light themes.
     * Updates localStorage and applies theme class to document body.
     */
    setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * React Context for the GameContextType.
 * Provides game state and controls throughout the component tree.
 * Must be used within GameContextProvider to access values.
 */
export const GameContext = React.createContext<GameContextType | null>(null);
