import {useContext} from "react";
import {LettersContext} from "./LettersContext.tsx";

export const useLettersContext = () => {
    const ctx = useContext(LettersContext);
    if (!ctx) throw new Error("useLetters must be used inside LettersContextProvider");
    return ctx;
};
