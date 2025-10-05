// src/components/BrailleCell.tsx
import React, { useEffect, useMemo, useRef } from "react";
import type { BrailleCell as BrailleBits } from "../types/braille";
import type { BrailleCellComparison } from "../types/braille";
import { getMatchString } from "../services/comparisonsService";

type Mode = "input" | "compare" | "display";

type Props = {
    mode: Mode;
    value: BrailleBits;
    onChange?: (next: BrailleBits) => void;              // required if mode="input"
    comps?: BrailleCellComparison;                       // used if mode="compare"
    noBorder?: boolean;
    showNumbers?: boolean;

    /** Animation controls (compare mode) */
    animateFlip?: boolean;   // default true
    flipDurationMs?: number; // whole-card duration, default 520
    flipStaggerMs?: number;  // per-dot delay, default 40
};

export const BrailleCell: React.FC<Props> = ({
                                                 mode,
                                                 value,
                                                 onChange,
                                                 comps,
                                                 noBorder,
                                                 showNumbers,
                                                 animateFlip = true,
                                                 flipDurationMs = 520,
                                                 flipStaggerMs = 40,
                                             }) => {
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Card color based on full-cell outcome (compare)
    const cellOutcomeClass = useMemo(
        () => (mode === "compare" ? getMatchString(comps?.fullCellComparison) : ""),
        [mode, comps]
    );

    // Check if this cell has meaningful comparison data (not "no-info")
    const hasComparisonData = useMemo(() => {
        if (mode !== "compare" || !comps) return false;

        // Check if any dot has a non-empty comparison result
        // Assuming "no-info" returns empty string or undefined from getMatchString
        return comps.comparisons?.some(comp => {
            const result = getMatchString(comp);
            return result && result !== "" && result !== "no-info";
        }) || false;
    }, [mode, comps]);

    // Trigger first-render flip (compare mode with actual data)
    useEffect(() => {
        if (mode !== "compare" || !animateFlip || !hasComparisonData) return;

        const el = wrapperRef.current;
        if (!el) return;

        // Set CSS variables FIRST, before any classes
        el.style.setProperty("--flip-duration", `${flipDurationMs}ms`);
        el.style.setProperty("--flip-stagger", `${flipStaggerMs}ms`);

        // Start pre-flip (blank look), then kick animation next frame
        el.classList.add("flip-pre");

        requestAnimationFrame(() => {
            // Force paint so the class removal animates reliably
            void el.getBoundingClientRect();
            el.classList.remove("flip-pre");
            el.classList.add("flip-run");

            // Remove the run class after animation completes
            // Use the actual duration for the timeout
            const totalDuration = flipDurationMs + (flipStaggerMs * 5);
            setTimeout(() => {
                el.classList.remove("flip-run");
            }, totalDuration + 100); // Add buffer
        });
    }, [mode, animateFlip, flipDurationMs, flipStaggerMs, hasComparisonData]);

    const handleToggle = (idx: number) => {
        if (mode !== "input" || !onChange) return;
        const next = [...value] as BrailleBits;
        next[idx] = !next[idx];
        onChange(next);
    };

    // Determine dot state based on mode
    const getDotState = (index: number, isActive: boolean) => {
        if (mode === "compare") {
            const compResult = getMatchString(comps?.comparisons[index]);
            // If no comparison info but dot is active, show it as active (filled but not colored)
            if ((!compResult || compResult === "" || compResult === "no-info") && isActive) {
                return "active";
            }
            return compResult;
        } else if (mode === "display") {
            // In display mode, just show active/inactive
            return isActive ? "active" : "";
        } else if (mode === "input") {
            return isActive ? "active" : "";
        }
        return "";
    };

    return (
        <div
            ref={wrapperRef}
            className={[
                "braille-cell",
                noBorder ? "no-border" : "",
                showNumbers ? "show-numbers" : "",
                cellOutcomeClass,
                // Only add flip-possible class if we have comparison data
                mode === "compare" && animateFlip && hasComparisonData ? "flip-possible" : "",
            ].filter(Boolean).join(" ")}
            role={mode === "input" ? "group" : undefined}
        >
            {value.map((isActive, i) => {
                const dotState = getDotState(i, isActive);
                const common = {
                    "data-dot": i,
                    "data-dot-number": i + 1,
                    className: ["braille-dot", dotState, mode === "input" ? "editable" : ""]
                        .filter(Boolean)
                        .join(" "),
                };

                return mode === "input" ? (
                    <button
                        key={i}
                        {...common}
                        onClick={() => handleToggle(i)}
                        aria-label={`Dot ${i + 1} - ${isActive ? "active" : "inactive"}`}
                        title={`Dot ${i + 1}`}
                        type="button"
                        // Subtle tap animation cue
                        onPointerDown={e => (e.currentTarget as HTMLElement).classList.add("tap")}
                        onPointerUp={e => (e.currentTarget as HTMLElement).classList.remove("tap")}
                        onPointerLeave={e => (e.currentTarget as HTMLElement).classList.remove("tap")}
                    />
                ) : (
                    <span key={i} {...common} aria-hidden />
                );
            })}
        </div>
    );
};
