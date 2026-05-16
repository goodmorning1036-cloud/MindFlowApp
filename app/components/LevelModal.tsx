"use client";

import { motion } from "framer-motion";
import { LEVELS, GhostService } from "../services/ghostService";
import styles from "./LevelModal.module.css";

interface LevelModalProps {
    onClose: () => void;
}

export const LevelModal = ({ onClose }: LevelModalProps) => {
    const currentInfo = GhostService.getLevelInfo();

    return (
        <motion.div
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
        >
            <motion.div
                className={styles.modal}
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className={styles.header}>
                    <h2>EVOLUTION PATH</h2>
                    <button className={styles.closeBtn} onClick={onClose}>&times;</button>
                </div>

                <div className={styles.currentStats}>
                    <div className={styles.statBox}>
                        <span className={styles.statLabel}>CURRENT LEVEL</span>
                        <span className={styles.statValue}>{currentInfo.level}</span>
                    </div>
                    <div className={styles.statBox}>
                        <span className={styles.statLabel}>TOTAL XP</span>
                        <span className={styles.statValue}>{currentInfo.totalXp}</span>
                    </div>
                </div>

                <div className={styles.levelList}>
                    {LEVELS.map((lvl) => {
                        const isReached = currentInfo.totalXp >= lvl.xpRequired;
                        const isCurrent = currentInfo.level === lvl.level;

                        return (
                            <div
                                key={lvl.level}
                                className={`${styles.levelItem} ${isReached ? styles.reached : ""} ${isCurrent ? styles.current : ""}`}
                            >
                                <div className={styles.levelNumberContainer}>
                                    <div className={styles.levelLine}></div>
                                    <div className={styles.levelHex}>
                                        <span>{lvl.level}</span>
                                    </div>
                                </div>
                                <div className={styles.levelInfo}>
                                    <div className={styles.levelHeader}>
                                        <span className={styles.levelTitle}>{lvl.title}</span>
                                        <span className={styles.xpRequirement}>
                                            {lvl.xpRequired.toLocaleString()} XP
                                        </span>
                                    </div>
                                    {isCurrent && (
                                        <div className={styles.progressBar}>
                                            <div
                                                className={styles.progressFill}
                                                style={{ width: `${currentInfo.progress * 100}%` }}
                                            />
                                        </div>
                                    )}
                                </div>
                                {isCurrent && <div className={styles.activeTag}>ACTIVE</div>}
                                {!isReached && <div className={styles.lockedIcon}>🔒</div>}
                            </div>
                        );
                    })}
                </div>
            </motion.div>
        </motion.div>
    );
};
