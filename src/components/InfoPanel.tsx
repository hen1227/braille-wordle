// src/components/InfoPanel.tsx
import React from "react";
import { BRAILLE_PATTERNS } from "../services/brailleTranslationService.ts";
import { BrailleCell } from "./BrailleCell";

const lettersSorted = Object.keys(BRAILLE_PATTERNS).sort();

export const InfoPanel: React.FC = () => {
    return (
        <div className="info-panel">
            <div className="info-panel-header">
                <h3>Braille Characters</h3>
                <p className={'caption'}>(Uncontracted UEB)</p>
            </div>

            <div className="legend-grid">
                {lettersSorted.map(letter => {
                    const cell = BRAILLE_PATTERNS[letter];
                    return (
                        <div key={letter} className="legend-item">
                            <span className="legend-letter">{letter.toUpperCase()}</span>
                            <BrailleCell
                                value={cell}
                                mode="display"  // Changed from "compare" to "display"
                                noBorder={false}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
