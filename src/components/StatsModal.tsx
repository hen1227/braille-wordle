// src/components/StatsModal.tsx
import React from "react";
import StatsView from "./StatsView.tsx";
import GameModeTabs from "./GameModeTabs.tsx";
import {useGameContext} from "../contexts/useGameContext.tsx";

const StatsModal: React.FC<{ open: boolean; onClose: () => void }> = ({open, onClose}) => {
    const {gameMode} = useGameContext();

    if (!open) return null;

    return (
        <div
            onClick={onClose}
            className="stats-modal-overlay"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="stats-modal-content"
            >
                <header className="stats-modal-header">
                    <button
                        onClick={onClose}
                        className="stats-modal-close"
                        aria-label="Close statistics"
                    >
                        &times;
                    </button>

                    <GameModeTabs/>
                </header>

                {/* Pass the *viewed* mode down */}
                <StatsView gameMode={gameMode}/>
            </div>
        </div>
    );
};

export default StatsModal;
