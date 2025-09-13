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
        <div className="braille-cell">
            {value.map((isActive, index) => (
                <button
                    key={index}
                    className={`braille-dot ${isActive ? 'active' : ''}`}
                    data-dot={index}
                    onClick={() => toggleDot(index)}
                    aria-label={`Dot ${index + 1}`}
                />
            ))}
        </div>
    );
};
