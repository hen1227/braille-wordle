import "./App.css";
import React from "react";
import type {BrailleCell} from "./types/braille.ts";
import {BrailleCellInput} from "./componets/BrailleCellInput.tsx";
import {ToastContainer} from "react-toastify";
import {PastGuessRow} from "./componets/PastGuessRow.tsx";
import {InfoPanel} from "./componets/InfoPanel.tsx";
import "./styles/buttons.css";
import "./styles/braille.css";
import {useLettersContext} from "./contexts/useLettersContext.tsx";
import {LettersContextProvider} from "./contexts/LettersContextProvider.tsx";
import {BrailleTranslationContextProvider} from "./contexts/BrailleTranslationContextProvider.tsx";

function App() {
    return (
        <BrailleTranslationContextProvider>
            <LettersContextProvider>
                <ToastContainer />
                <WrappedApp/>
            </LettersContextProvider>
        </BrailleTranslationContextProvider>
    );
}

const WrappedApp: React.FC = () => {
    const {
        userInputTranslation, userInput, setUserInput, handleWordSubmit, pastInputs,
        selectedDate, stepPrev, stepNext, canGoPrev, canGoNext
    } = useLettersContext();

    const setCell = (idx: number, next: BrailleCell) => {
        setUserInput(prev => {
            const copy = prev.map(c => c.slice()) as typeof prev;
            copy[idx] = next;
            return copy;
        });
    };

    return (
        <div className="game-container">
            <div className="date-nav">
                <button className="btn icon" onClick={stepPrev} disabled={!canGoPrev} aria-label="Previous day">←</button>
                <time className="date-label">
                    {selectedDate.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                </time>
                <button className="btn icon" onClick={stepNext} disabled={!canGoNext} aria-label="Next day">→</button>
            </div>

            <h1>Braille Wordle</h1>
            <p>Toggle the dots to match the hidden 5-letter word.</p>

            <section className="past-inputs">
                {pastInputs.map((guess, i) => <PastGuessRow key={i} guess={guess} />)}
            </section>

            <section className="input-grid">
                <h1 className="word-to-spell-header">{userInputTranslation}</h1>
                <div className="input-row">
                    {userInput.map((cell, i) => (
                        <BrailleCellInput key={i} value={cell} onChange={next => setCell(i, next)} />
                    ))}
                </div>

                <button className="btn submit-btn" onClick={handleWordSubmit}>Submit</button>
            </section>

            <div className="info-panel-wrap">
                <InfoPanel />
            </div>
        </div>
    );
};

export default App;
