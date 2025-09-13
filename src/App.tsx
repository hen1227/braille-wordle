import "./App.css";
import React from "react";
import {LettersContextProvider, useLettersContext} from "./contexts/LettersContext";
import type {BrailleCell} from "./types/braille.ts";
import {BrailleCellInput} from "./componets/BrailleCellInput.tsx";
import {ToastContainer} from "react-toastify";
import {PastGuessRow} from "./componets/PastGuessRow.tsx";

function App() {
    return (
        <LettersContextProvider>
            <ToastContainer />
            <WrappedApp/>
        </LettersContextProvider>
    );
}

const WrappedApp: React.FC = () => {
    const {userInputTranslation, setWordToSpell, userInput, setUserInput, handleWordSubmit, pastInputs, getComparisonFor} = useLettersContext();
    const [draft, setDraft] = React.useState("abcde");

    const setCell = (idx: number, next: BrailleCell) => {
        setUserInput(prev => {
            const copy = prev.map(c => c.slice()) as typeof prev;
            copy[idx] = next;
            return copy;
        });
    };

    const clearAll = () =>
        setUserInput(prev => prev.map(() => [false, false, false, false, false, false]) as typeof prev);

    const applyWord = () => setWordToSpell(draft.trim().toLowerCase());

    return (
        <div className="game-container">
            <h1>Braille Wordle</h1>
            <p>Toggle the dots to match the hidden 5-letter word.</p>

            <div className="controls toolbar">
                <input
                    className="text-input"
                    value={draft}
                    onChange={e => setDraft(e.target.value)}
                    maxLength={5}
                    placeholder="Enter 5 letters"
                />
                <button onClick={applyWord} className="btn btn-primary">Set Target</button>
                <button onClick={clearAll} className="btn clear-btn">Clear</button>
            </div>


            <section className="past-inputs">
                {pastInputs.length === 0 ? (
                    <p className="muted">No guesses yet.</p>
                ) : (
                    pastInputs.map((guess, i) => (
                        <PastGuessRow key={i} guess={guess} compareTo={getComparisonFor} />
                    ))
                )}
            </section>

            <section className="game-grid">
                <h1 className={'word-to-spell-header'}>{userInputTranslation.toUpperCase()}</h1>
                <div className="game-row">
                    {userInput.map((cell, i) => (
                        <BrailleCellInput
                            key={i}
                            value={cell}
                            onChange={next => setCell(i, next)}
                        />
                    ))}
                </div>

                <button className="btn submit-btn" onClick={() => handleWordSubmit()}>
                    Submit
                </button>
            </section>

            <div className="info-panel">
                <h3>Tip</h3>
                <div className="stats">
                    <div className="stat-item">
                        <div className="stat-value">6</div>
                        <div className="stat-label">Dots per cell</div>
                    </div>
                    <div className="stat-item">
                        <div className="stat-value">5</div>
                        <div className="stat-label">Cells</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default App;
