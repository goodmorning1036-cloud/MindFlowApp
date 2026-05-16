import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatTime } from '../utils/time';
import { getLevelInfo } from '../services/ghostService';
import styles from './ResultModal.module.css';

interface ResultModalProps {
    duration: number;
    ghostTime: number | null;
    fuelGained: number;
    onClose: () => void;
    totalXpEarned?: number;
    taskLabel?: string;
    cargo?: string;
}

export const ResultModal = ({ duration, ghostTime, fuelGained, onClose, totalXpEarned, taskLabel, cargo }: ResultModalProps) => {
    const [rating, setRating] = useState(5);
    const [isUploaded, setIsUploaded] = useState(false);
    const isWin = ghostTime ? duration > ghostTime : true;
    const diff = ghostTime ? Math.abs(duration - ghostTime) : 0;

    const currentLevelInfo = totalXpEarned != null ? getLevelInfo(totalXpEarned) : null;
    const prevLevelInfo = totalXpEarned != null ? getLevelInfo(totalXpEarned - fuelGained) : null;
    const didLevelUp = currentLevelInfo && prevLevelInfo && currentLevelInfo.level > prevLevelInfo.level;

    return (
        <div className={styles.overlay}>
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={styles.modal}
            >
                <div className={styles.modalBody}>
                    <div className={styles.iconContainer}>
                        <div className={`${styles.iconCircle} ${isWin ? styles.winIcon : styles.loseIcon}`}>
                            {isWin ? '🏆' : '👻'}
                        </div>
                    </div>

                    <h2 className={styles.title}>
                        {isWin ? 'New Personal Best!' : 'Ghost Won'}
                    </h2>

                    {taskLabel && (
                        <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.05em', marginBottom: '1.5rem' }}>
                            {taskLabel.toUpperCase()}
                        </p>
                    )}

                    <div id="fuel-stats" className={styles.statsGrid}>
                        <div className={styles.statCard}>
                            <div className={styles.statLabel}>Fuel Earned</div>
                            <div className={styles.statValue} style={{ color: '#00E5FF' }}>+{Math.round(fuelGained * (rating / 5))} XP</div>
                        </div>
                        <div className={styles.statCard}>
                            <div className={styles.statLabel}>Your Time</div>
                            <div className={styles.statValue}>{formatTime(duration)}</div>
                        </div>
                    </div>

                    <div className={styles.ratingSection}>
                        <div className={styles.starsRow}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    className={`${styles.starBtn} ${rating >= star ? styles.starActive : ''}`}
                                    onClick={() => setRating(star)}
                                >
                                    ★
                                </button>
                            ))}
                        </div>
                        <p className={styles.ratingHint}>
                            {rating === 5 ? 'Absolute Flow State' : rating === 1 ? 'Mostly Distracted' : 'Solid Performance'}
                        </p>
                    </div>

                    {cargo && (
                        <div className={styles.cargoSection}>
                            <div className={styles.cargoLabel}>MISSION: {cargo.toUpperCase()}</div>
                        </div>
                    )}

                    <div id="evidence-stats" className={styles.evidenceSection}>
                        {duration >= 25 * 60 * 1000 && !isUploaded && (
                            <div className={styles.mandatoryNote}>ACCOUNTABILITY CHECK: EVIDENCE REQUIRED FOR 25M+ STINT</div>
                        )}
                        {!isUploaded ? (
                            <button className={styles.uploadBtn} onClick={() => document.getElementById('evidence-upload')?.click()}>
                                📷 UPLOAD COMPLETION EVIDENCE
                                <input id="evidence-upload" type="file" style={{ display: 'none' }} onChange={() => setIsUploaded(true)} />
                            </button>
                        ) : (
                            <div className={styles.verifiedBadge}>✅ EVIDENCE LOGGED & VERIFIED</div>
                        )}
                    </div>

                    {currentLevelInfo && (
                        <div id="level-stats" className={styles.levelSection}>
                            <div className={styles.levelRow}>
                                <span>LVL {currentLevelInfo.level}</span>
                                <span style={{ opacity: 0.5 }}>{currentLevelInfo.title.toUpperCase()}</span>
                            </div>
                            <div className={styles.levelProgressBar}>
                                <motion.div
                                    className={styles.levelProgressFill}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${currentLevelInfo.progress * 100}%` }}
                                    transition={{ duration: 1.2 }}
                                />
                            </div>
                        </div>
                    )}
                </div>

                <div className={styles.modalFooter}>
                    <button 
                        className={styles.continueBtn} 
                        onClick={onClose}
                        disabled={duration >= 25 * 60 * 1000 && !isUploaded}
                    >
                        {duration >= 25 * 60 * 1000 && !isUploaded ? 'UPLOAD EVIDENCE TO CONTINUE' : 'CONTINUE TO DASHBOARD'}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};
