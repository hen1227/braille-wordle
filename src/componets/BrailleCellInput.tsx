import React from 'react';
import type { BrailleCell } from '../types/braille';

interface BrailleCellInputProps {
    value: BrailleCell;
    onChange: (value: BrailleCell) => void;
}

export const BrailleCellInput: React.FC<BrailleCellInputProps> = ({ value, onChange }) => {
    const toggleDot = (index: number) => {
        const newValue = [...value] as BrailleCell;
        newValue[index] = !newValue[index];
        onChange(newValue);
    };

    return (
        <div className="braille-cell editable show-numbers">
            {value.map((isActive, index) => (
                <button
                    key={index}
                    className={`braille-dot editable ${isActive ? 'active' : ''}`}
                    data-dot={index}
                    data-dot-number={index + 1}
                    onClick={() => toggleDot(index)}
                    aria-label={`Dot ${index + 1} - ${isActive ? 'active' : 'inactive'}`}
                    title={`Dot ${index + 1}`}
                />
            ))}
        </div>
    );
};
