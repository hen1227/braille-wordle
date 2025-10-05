// src/components/GameModeTabs.tsx
import React from "react";
import {useGameContext} from "../contexts/useGameContext.tsx";
import type {GameMode} from "../types/game.ts";

const MODES: { key: GameMode; label: string }[] = [
    {key: "by-dot", label: "Easy"},
    {key: "by-cell", label: "Medium"},
    {key: "wordle", label: "Classic"},
];

const GameModeTabs: React.FC = () => {
    const {gameMode, setGameMode} = useGameContext();

    return (
        <nav
            aria-label="Game mode"
            role="tablist"
            className="game-mode-tabs"
        >
            {MODES.map(({key, label}) => {
                const active = gameMode === key;
                return (
                    <button
                        key={key}
                        role="tab"
                        aria-selected={active}
                        onClick={() => setGameMode(key)}
                        className="game-mode-tab"
                    >
                        {label}
                    </button>
                );
            })}
        </nav>
    );
};

export default GameModeTabs;
