// src/components/BrailleCellInput.tsx
import React from "react";
import type {BrailleCell} from "../types/braille";
import {BrailleCell as BrailleCellView} from "./BrailleCell";

interface Props {
    value: BrailleCell;
    onChange: (value: BrailleCell) => void;
}

export const BrailleCellInput: React.FC<Props> = ({value, onChange}) => (
    <BrailleCellView
        mode="input"
        value={value}
        onChange={onChange}
        showNumbers
    />
);
