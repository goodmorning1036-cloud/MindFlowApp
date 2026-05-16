"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { GhostService, LevelInfo } from "../services/ghostService";
import styles from "./LevelBadge.module.css";

interface LevelBadgeProps {
    levelInfo?: LevelInfo;
    onClick?: () => void;
}

export const LevelBadge = ({ levelInfo: externalLevelInfo, onClick }: LevelBadgeProps) => {
    const [info, setInfo] = useState<LevelInfo | null>(externalLevelInfo || null);

    useEffect(() => {
        if (!externalLevelInfo) {
            setInfo(GhostService.getLevelInfo());
        }
    }, [externalLevelInfo]);

    useEffect(() => {
        if (externalLevelInfo) {
            setInfo(externalLevelInfo);
        }
    }, [externalLevelInfo]);

    if (!info) return null;

    return (
        <div
            className={`${styles.badge} ${onClick ? styles.clickable : ""}`}
            onClick={onClick}
        >
            <div className={styles.levelCircle}>
                <span className={styles.levelNumber}>{info.level}</span>
            </div>
            <div className={styles.details}>
                <div className={styles.titleRow}>
                    <span className={styles.levelLabel}>LVL {info.level}</span>
                    <span className={styles.dot}>·</span>
                    <span className={styles.levelTitle}>{info.title.toUpperCase()}</span>
                </div>
                <div className={styles.progressBar}>
                    <motion.div
                        className={styles.progressFill}
                        initial={{ width: 0 }}
                        animate={{ width: `${info.progress * 100}%` }}
                        transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                    />
                </div>
                <div className={styles.xpText}>
                    {info.xpForNext
                        ? `${info.currentXp} / ${info.xpForNext} XP`
                        : "MAX LEVEL"}
                </div>
            </div>
        </div>
    );
};
