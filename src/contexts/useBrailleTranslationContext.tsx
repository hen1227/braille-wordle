import {useContext} from "react";
import {BrailleTranslationContext} from "./BrailleTranslationContext.tsx";

export const useBrailleTranslationContext = () => {
    const ctx = useContext(BrailleTranslationContext);
    if (!ctx) throw new Error("useLetters must be used inside BrailleTranslationContextProvider");
    return ctx;
};
