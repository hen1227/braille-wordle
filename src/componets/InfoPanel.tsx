import React from "react";
import {BRAILLE_PATTERNS} from "../utils/BrailleTranslation"; // adjust path
import {BrailleCellCompareView} from "./BrailleCellCompareView";

const lettersSorted = Object.keys(BRAILLE_PATTERNS).sort();

export const InfoPanel: React.FC = () => {
    return (
        <div className="info-panel">
            <h3>Braille Characters</h3>
            <p className={'caption'}>(Uncontracted UEB)</p>
            <div className="legend-grid">
                {lettersSorted.map(letter => {
                    const cell = BRAILLE_PATTERNS[letter];
                    return (
                        <div key={letter} className="legend-item">
                            <span className="legend-letter">{letter.toUpperCase()}</span>
                            <BrailleCellCompareView value={cell} />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
