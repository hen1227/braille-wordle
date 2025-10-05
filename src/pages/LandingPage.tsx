import React from "react";
import { Link } from "react-router-dom";
import {BrailleCell} from "../components/BrailleCell.tsx";
import {BRAILLE_PATTERNS} from "../services/brailleTranslationService.ts";
import {useGameContext} from "../contexts/useGameContext.tsx";

const LandingPage: React.FC = () => {
    const { setGameMode } = useGameContext();

    return (
        <div className="landing-wrapper">

            <div className="landing-container">
                {/* Hero Section */}
                <div className="hero">
                    <h1>Braille Wordle</h1>

                    {/* Animated Braille Display */}
                    <div className="braille-display">
                        {['W', 'O', 'R', 'D', 'L', 'E'].map((letter, idx) => (
                            <BrailleCell key={idx} value={BRAILLE_PATTERNS[letter.toLowerCase()]} mode={"display"} />
                        ))}
                    </div>
                </div>

                {/* Game Modes */}
                <div className="modes-section">
                    {/* Primary Mode - Easy */}
                    <div className="primary-mode">
                        <Link to="/play" className="primary-card" onClick={() => setGameMode('by-dot')}>
                            <h3>Easy Mode</h3>
                            <p>
                                The perfect starting point for learning Braille. Get feedback on individual dots
                                across your entire guess, making it easier to understand the patterns.
                            </p>
                        </Link>
                    </div>

                    {/* Secondary Modes */}
                    <div className="secondary-modes">
                        <Link to="/play" className="secondary-card" onClick={() => setGameMode('by-cell')}>
                            <h3>Hard Mode</h3>
                            <p>
                                Challenge yourself with cell-by-cell feedback. You'll need to identify
                                complete Braille characters to succeed.
                            </p>
                            <div className="difficulty-indicator">
                                <div className="difficulty-dot filled" />
                                <div className="difficulty-dot filled" />
                                <div className="difficulty-dot filled" />
                            </div>
                        </Link>

                        <Link to="/play" className="secondary-card" onClick={() => setGameMode('wordle')}>
                            <h3>Classic Wordle</h3>
                            <p>
                                The traditional Wordle experience with Braille letters. Green for correct
                                position, yellow for wrong position.
                            </p>
                            <div className="difficulty-indicator">
                                <div className="difficulty-dot filled" />
                                <div className="difficulty-dot filled" />
                                <div className="difficulty-dot" />
                            </div>
                        </Link>
                    </div>
                </div>
            </div>


        </div>
    );
};

export default LandingPage;
