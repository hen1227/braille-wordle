import {useContext} from "react";
import {GameContext} from "./GameContext.tsx";

export const useGameContext = () => {
    const ctx = useContext(GameContext);
    if (!ctx) throw new Error("useLetters must be used inside GameContextProvider");
    return ctx;
};
