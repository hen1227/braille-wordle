import {type BrailleCell, type BrailleCellComparison} from "../types/braille.ts";
import React from "react";
import {getMatchString} from "../services/comparisonsService.ts";

export const BrailleCellCompareView: React.FC<{
    value: BrailleCell;
    comps?: BrailleCellComparison;
}> = ({ value, comps }) => (
    <div className={`braille-cell ${getMatchString(comps?.fullCellComparison)}`}>
        {value.map((isActive, index) => {

            return (
                <span
                    key={index}
                    className={[
                        "braille-dot",
                        isActive ? "active" : "",
                        getMatchString(comps?.comparisons[index])
                    ].join(" ")}
                    aria-hidden
                    data-dot={index}
                />
            );
        })}
    </div>
);
