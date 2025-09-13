import {type BrailleCell, Comparison} from "../types/braille.ts";
import React from "react";

export const BrailleCellCompareView: React.FC<{
    value: BrailleCell;
    comps: readonly number[];
}> = ({ value, comps }) => (
    <div className="braille-cell braille-cell--readonly">
        {value.map((isActive, index) => {
            const match = comps[index] === Comparison.FULL_MATCH;
            return (
                <span
                    key={index}
                    className={[
                        "braille-dot",
                        // "braille-dot--readonly",
                        isActive ? "active" : "",
                        match ? "match" : "miss",
                    ].join(" ")}
                    aria-hidden
                    data-dot={index}
                />
            );
        })}
    </div>
);
