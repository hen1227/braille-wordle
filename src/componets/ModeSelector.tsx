import React from "react";
import { useLettersContext } from "../contexts/useLettersContext.tsx";
import type { CellInfoType, FullWordInfoType } from "../types/braille.ts";

type Preset = {
    id: "cells" | "dots" | "wordle";
    label: string;
    cell: CellInfoType;
    word: FullWordInfoType;
    help: string;
};

const PRESETS: Preset[] = [
    { id: "cells",  label: "Cells",  cell: "cell",     word: "no-info", help: "Show correct values within a cell." },
    { id: "dots",   label: "Dots",   cell: "dot",      word: "no-info", help: "Show correct values across the word." },
    { id: "wordle", label: "Wordle", cell: "no-info",  word: "wordle",  help: "Show if guessed letter is in the word." },
];

// TODO: This needs to be reworked. It looks horrible.
export const ModeSelector: React.FC = () => {
    const {
        infoByCell, setInfoByCell,
        infoByWord, setInfoByWord,
    } = useLettersContext();

    // figure out which preset is currently active
    const activeId: Preset["id"] | undefined = PRESETS.find(
        p => p.cell === infoByCell && p.word === infoByWord
    )?.id;

    const applyPreset = (p: Preset) => {
        setInfoByCell(p.cell);
        setInfoByWord(p.word);
    };

    return (
        <div className="mode-selector" role="group" aria-label="Mode">
            {PRESETS.map(p => {
                const isActive = p.id === activeId;
                console.log(activeId)
                return (
                    <button
                        key={p.id}
                        type="button"
                        className={`btn mode-btn ${isActive ? "active" : ""}`}
                        aria-pressed={isActive}
                        title={p.help}
                        onClick={() => applyPreset(p)}
                    >
                        {p.label}
                    </button>
                );
            })}
        </div>
    );
};
