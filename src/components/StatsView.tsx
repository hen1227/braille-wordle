// src/components/StatsView.tsx
import React, {useMemo} from "react";
import "../styles/stats.css";
import {loadStats} from "../utils/Stats.ts";
import {useGameContext} from "../contexts/useGameContext.tsx";
import type {GameMode} from "../types/game.ts";
import {MAX_GUESSES} from "../utils/Game.ts";

type StatsViewProps = { gameMode: GameMode };

export const StatsView: React.FC<StatsViewProps> = ({gameMode}) => {
    const stats = loadStats(gameMode);
    const {gameOver, isWin} = useGameContext();


    const maxBar = useMemo(
        () => Math.max(1, ...Object.values(stats.guessDist)),
        [stats.guessDist]
    );

    return (
        <>
            <div className="stats-panel">
                {gameOver ? (
                    isWin ? (
                        <div>
                            <h2 className="info-panel-header">Congratulations!</h2>
                            <p className="info-panel-subheader">
                                You solved the word!
                            </p>
                        </div>
                    ) : (
                        <div>
                            <h2 className="info-panel-header">Out of guesses!</h2>
                            <p className="info-panel-subheader">You’ve used all your guesses for the day.</p>
                        </div>
                    )
                ) : (
                    <div>
                        <h2 className="info-panel-header">Unsolved</h2>
                        <p className="info-panel-subheader">
                            You have not solved the word yet!
                        </p>
                    </div>
                )}

                <h3 className="guess-distribution-title">History</h3>

                <div className="stats-grid">
                    <StatTile label="Games Played" value={stats.gamesPlayed}/>
                    <StatTile
                        label="Avg. Guesses"
                        value={
                            stats.wins === 0
                                ? 0
                                : Math.round(
                                    Object.entries(stats.guessDist).reduce(
                                        (sum, [k, v]) => sum + parseInt(k) * v,
                                        0
                                    ) / stats.wins
                                )
                        }
                    />
                    <StatTile label="Current Streak" value={stats.currentStreak}/>
                </div>

                <div className="guess-distribution-grid">
                    {Object.entries(stats.guessDist).slice(0, MAX_GUESSES).map(([k, v]) => {
                        const widthPct = Math.max(1, Math.round((v / maxBar) * 100));
                        return (
                            <div key={k} className="distribution-row">
                                <div className="distribution-number">{k}</div>
                                <div
                                    className="distribution-bar"
                                    style={{width: `${widthPct}%`}}
                                    title={`${v} win${v === 1 ? "" : "s"} in ${k} guess${k === "1" ? "" : "es"}`}
                                />
                                <div className="distribution-count">{v}</div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
};

const StatTile = ({label, value}: { label: string; value: number }) => (
    <div className="stat-tile">
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
    </div>
);

export default StatsView;
