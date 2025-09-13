import type {BrailleCell, TypedWord} from "../types/braille.ts";

export const emptyBrailleCell: BrailleCell = [false,false,false,false,false,false]

export const emptyTypedWord: TypedWord =
    [emptyBrailleCell, emptyBrailleCell,
    emptyBrailleCell, emptyBrailleCell,
    emptyBrailleCell]
