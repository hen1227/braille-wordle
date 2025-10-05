// src/pages/GamePage.tsx
import {useGameContext} from "../contexts/useGameContext.tsx";
import type {BrailleCell} from "../types/braille.ts";
import {PastGuessRow} from "../components/PastGuessRow.tsx";
import {BrailleCellInput} from "../components/BrailleCellInput.tsx";
import {InfoPanel} from "../components/InfoPanel.tsx";
import React from "react";
import Header from "../components/Header.tsx";
import {StatsView} from "../components/StatsView.tsx";
import StatsModal from "../components/StatsModal.tsx";
import GameModeTabs from "../components/GameModeTabs.tsx";
import {MAX_GUESSES} from "../utils/Game.ts";

const GamePage: React.FC = () => {
    const {
        userInputTranslation, userInput, setUserInput, handleWordSubmit,
        pastInputs, gameOver, statsOpen, setStatsOpen, gameMode
    } = useGameContext();

    const setCell = (idx: number, next: BrailleCell) => {
        setUserInput(prev => {
            const copy = prev.map(c => c.slice()) as typeof prev;
            copy[idx] = next;
            return copy;
        });
    };

    const currentGuessNumber = pastInputs.length + 1;

    return (
        <>
            <Header/>
            <div className="game-container container">
                <GameModeTabs />

                <h1>Braille Wordle</h1>
                <p>Toggle the dots to match the hidden 5-letter word.</p>

                <section className="past-inputs">
                    {pastInputs.map((guess, i) => <PastGuessRow key={i} guess={guess}/>)}
                </section>

                <StatsModal open={statsOpen} onClose={() => setStatsOpen(false)} />

                {gameOver ? (
                    <section className="stats-view">
                        <StatsView gameMode={gameMode} />
                    </section>
                ) : (
                    <section className="input-grid">
                        <p className="guess-progress">
                            Guess {currentGuessNumber} of {MAX_GUESSES}
                        </p>

                        <h1 className="word-to-spell-header">{userInputTranslation.toUpperCase()}</h1>
                        <div className="input-row">
                            {userInput.map((cell, i) => (
                                <BrailleCellInput key={i} value={cell} onChange={next => setCell(i, next)}/>
                            ))}
                        </div>

                        <button className="btn submit-btn" onClick={handleWordSubmit}>Submit</button>
                    </section>
                )}

                <InfoPanel/>
            </div>
        </>
    );
};

export default GamePage;
