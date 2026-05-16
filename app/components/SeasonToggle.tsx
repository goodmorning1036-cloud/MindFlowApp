"use client";

import { useState, useEffect } from "react";
import styles from "./SeasonToggle.module.css";

export type Season = "winter" | "spring" | "summer" | "autumn";

export function SeasonToggle() {
    const [season, setSeason] = useState<Season>("winter");

    useEffect(() => {
        const saved = localStorage.getItem("mindflow-season") as Season | null;
        if (saved) {
            setSeason(saved);
        }
    }, []);

    const cycleSeason = () => {
        const seasons: Season[] = ["winter", "spring", "summer", "autumn"];
        const nextIndex = (seasons.indexOf(season) + 1) % seasons.length;
        const next = seasons[nextIndex];

        setSeason(next);
        localStorage.setItem("mindflow-season", next);
        window.dispatchEvent(new CustomEvent('season-changed', { detail: next }));
    };

    return (
        <button
            className={styles.toggleButton}
            onClick={cycleSeason}
            aria-label={`Current season: ${season}`}
            title={`Current season: ${season}. Click to cycle.`}
        >
            <div className={styles.iconWrapper}>
                <span className={`${styles.icon} ${season === "winter" ? styles.active : styles.hidden}`}>❄️</span>
                <span className={`${styles.icon} ${season === "spring" ? styles.active : styles.hidden}`}>🌸</span>
                <span className={`${styles.icon} ${season === "summer" ? styles.active : styles.hidden}`}>☀️</span>
                <span className={`${styles.icon} ${season === "autumn" ? styles.active : styles.hidden}`}>🍂</span>
            </div>
        </button>
    );
}
