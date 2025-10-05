// src/components/Header.tsx
import React from "react";
import {Link} from "react-router-dom";
import {useGameContext} from "../contexts/useGameContext.tsx";
import {HomeIcon, ArrowLeftIcon, ArrowRightIcon, StatsIcon, MoonIcon, SunIcon} from "./Icons.tsx";

const Header: React.FC = () => {
    const {
        selectedDate, stepPrev, stepNext, canGoPrev, canGoNext,
        setStatsOpen, darkMode, setDarkMode
    } = useGameContext();

    return (
        <header className="header container" role="banner">
            <div className="left">
                <Link to="/" className="btn icon" aria-label="Home">
                    <HomeIcon/>
                </Link>
            </div>

            <nav className="date-nav" aria-label="Date navigation">
                <button className="btn icon" onClick={stepPrev} disabled={!canGoPrev} aria-label="Previous day">
                    <ArrowLeftIcon/>
                </button>
                <time className="date-label full-date" aria-live="polite">
                    {selectedDate.toLocaleDateString(undefined, {year: "numeric", month: "short", day: "numeric"})}
                </time>
                <time className="date-label no-year" aria-live="polite">
                    {selectedDate.toLocaleDateString(undefined, {month: "short", day: "numeric"})}
                </time>
                <button className="btn icon" onClick={stepNext} disabled={!canGoNext} aria-label="Next day">
                    <ArrowRightIcon/>
                </button>
            </nav>


            <div className="right">
                <button className="btn icon" aria-label="Stats" onClick={() => setStatsOpen(true)}>
                    <StatsIcon/>
                </button>
                <button className="btn icon" aria-label="Toggle theme" onClick={() => setDarkMode((prev) => !prev)}>
                    {darkMode ? <MoonIcon/> : <SunIcon/>}
                </button>
            </div>
        </header>
    );
};

export default Header;
