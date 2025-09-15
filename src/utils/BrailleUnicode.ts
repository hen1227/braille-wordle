import type {BrailleCell} from "../types/braille.ts";

export const brailleDotsListToAscii = (dotsList: BrailleCell[]) => {
    return dotsList.map(brailleDotsToAscii).join('');
}
export const brailleDotsToAscii = (dots: BrailleCell) => {
    const dotsNumbers = dots.map((v) => v ? 1 : 0);
    const code =
        1*dotsNumbers[0] +
        2*dotsNumbers[1] +
        4*dotsNumbers[2] +
        8*dotsNumbers[3] +
        16*dotsNumbers[4] +
        32*dotsNumbers[5];

    return String.fromCharCode(0x2800 + code)
}


export const brailleAsciiToBrailleDots = (text: string): BrailleCell[] => {
    const cells: BrailleCell[] = [];
    for (const char of text) {
        const code = char.charCodeAt(0);
        if (code >= 0x2800 && code <= 0x28FF) {
            const dots: BrailleCell = [
                (code & 1) !== 0,
                (code & 2) !== 0,
                (code & 4) !== 0,
                (code & 8) !== 0,
                (code & 16) !== 0,
                (code & 32) !== 0,
            ];
            cells.push(dots);
        } else {
            // Not a braille character, push an empty cell or handle as needed
            cells.push([false, false, false, false, false, false]);
        }
    }
    return cells;
}
