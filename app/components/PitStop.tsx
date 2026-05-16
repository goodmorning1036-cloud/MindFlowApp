import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './PitStop.module.css';

interface PitStopProps {
    onComplete: () => void;
    duration: number; // in minutes
}

export const PitStop = ({ onComplete, duration }: PitStopProps) => {
    const [timeLeft, setTimeLeft] = useState(duration * 60);
    const [checks, setChecks] = useState({
        hydrate: false,
        stretch: false,
        eyes: false
    });

    const [isUploaded, setIsUploaded] = useState(false);
    const isMandatory = duration >= 25 * 60; // 25 minutes

    const allChecked = checks.hydrate && checks.stretch && checks.eyes && (!isMandatory || isUploaded);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => Math.max(0, prev - 1));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (s: number) => {
        const m = Math.floor(s / 60);
        const sec = s % 60;
        return `${m}:${sec.toString().padStart(2, '0')}`;
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.pitCrewLabel}>PIT CREW ADVISORY</div>
                    <h1 className={styles.title}>ACTIVE RECOVERY</h1>
                    <div className={styles.timer}>{formatTime(timeLeft)}</div>
                </div>

                <div className={styles.checklist}>
                    <div 
                        className={`${styles.checkItem} ${checks.hydrate ? styles.checked : ''}`}
                        onClick={() => setChecks(prev => ({ ...prev, hydrate: !prev.hydrate }))}
                    >
                        <div className={styles.checkbox}>{checks.hydrate ? '✓' : ''}</div>
                        <div className={styles.itemText}>
                            <span className={styles.itemTitle}>HYDRATE</span>
                            <span className={styles.itemDesc}>Refuel your cognitive engine</span>
                        </div>
                    </div>

                    <div 
                        className={`${styles.checkItem} ${checks.stretch ? styles.checked : ''}`}
                        onClick={() => setChecks(prev => ({ ...prev, stretch: !prev.stretch }))}
                    >
                        <div className={styles.checkbox}>{checks.stretch ? '✓' : ''}</div>
                        <div className={styles.itemText}>
                            <span className={styles.itemTitle}>STRETCH</span>
                            <span className={styles.itemDesc}>Release mechanical tension</span>
                        </div>
                    </div>

                    <div 
                        className={`${styles.checkItem} ${checks.eyes ? styles.checked : ''}`}
                        onClick={() => setChecks(prev => ({ ...prev, eyes: !prev.eyes }))}
                    >
                        <div className={styles.checkbox}>{checks.eyes ? '✓' : ''}</div>
                        <div className={styles.itemText}>
                            <span className={styles.itemTitle}>20-20-20 RULE</span>
                            <span className={styles.itemDesc}>Every 20 minutes, look 20 feet away for 20 seconds to protect your vision.</span>
                        </div>
                    </div>
                </div>

                {isMandatory && (
                    <div className={styles.evidenceSection}>
                        <div className={styles.evidenceHeader}>MANDATORY MISSION DATA</div>
                        {!isUploaded ? (
                            <button className={styles.uploadBtn} onClick={() => document.getElementById('evidence-upload-pit')?.click()}>
                                📷 UPLOAD EVIDENCE OF WORK (25M+ STINT)
                                <input id="evidence-upload-pit" type="file" style={{ display: 'none' }} onChange={() => setIsUploaded(true)} />
                            </button>
                        ) : (
                            <div className={styles.verifiedBadge}>✅ DATA UPLINK VERIFIED</div>
                        )}
                    </div>
                )}

                <motion.button 
                    className={styles.completeBtn}
                    disabled={!allChecked}
                    onClick={onComplete}
                    whileHover={allChecked ? { scale: 1.05 } : {}}
                    whileTap={allChecked ? { scale: 0.95 } : {}}
                >
                    {allChecked ? 'RETURN TO TRACK' : 'COMPLETE VITALS CHECK'}
                </motion.button>

                <p className={styles.hint}>
                    Full vitals check restores 100% Tire Health for the next stint.
                </p>
            </div>
        </div>
    );
};
