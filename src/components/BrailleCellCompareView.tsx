// src/components/BrailleCellCompareView.tsx
import React from "react";
import type {BrailleCell, BrailleCellComparison} from "../types/braille";
import {BrailleCell as BrailleCellView} from "./BrailleCell";

export const BrailleCellCompareView: React.FC<{
    value: BrailleCell;
    comps?: BrailleCellComparison;
    noBorder?: boolean;
}> = ({value, comps, noBorder}) => (
    <BrailleCellView
        mode="compare"
        value={value}
        comps={comps}
        noBorder={noBorder}
        animateFlip
    />
);
