import {type BrailleCell, Comparison} from "../types/braille.ts";
import React from "react";

export const BrailleCellCompareView: React.FC<{
    value: BrailleCell;
    comps?: Comparison[];
}> = ({ value, comps }) => (
    <div className="braille-cell">
        {value.map((isActive, index) => {
            const matchString = comps ? (comps[index] === Comparison.FULL_MATCH ? "match" : (comps[index] === Comparison.NO_MATCH ? "miss" : "partial")) : "";
            return (
                <span
                    key={index}
                    className={[
                        "braille-dot",
                        isActive ? "active" : "",
                        matchString
                    ].join(" ")}
                    aria-hidden
                    data-dot={index}
                />
            );
        })}
    </div>
);
