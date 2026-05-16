import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatTime } from '../utils/time';
import styles from './RaceView.module.css';
import { CarIcon, GhostIcon } from './Assets';
import { CustomizationState } from '../services/ghostService';

interface RaceViewProps {
    elapsed: number;
    ghostTime: number | null;
    customization: CustomizationState;
    onComplete: (save: boolean) => void;
    isDrifting?: boolean;
    isSafeMode: boolean;
    setIsSafeMode: (val: boolean) => void;
    isRunning: boolean;
    onPause: () => void;
    onResume: () => void;
    pomodoroConfig: {
        breakTime: number,
        laps: number,
        currentLap: number,
        mode: 'RACE' | 'BREAK'
    };
    ghostMode: 'RIVAL' | 'PACER';
    cargo?: string;
    tireHealth: number;
}

export const RaceView = ({
    elapsed,
    ghostTime,
    customization,
    onComplete,
    isDrifting = false,
    isSafeMode,
    setIsSafeMode,
    isRunning,
    onPause,
    onResume,
    ghostMode,
    cargo,
    tireHealth
}: RaceViewProps) => {
    const [scaleMax, setScaleMax] = useState(ghostTime ? ghostTime * 1.2 : 60000);
    const [showReturnWarning, setShowReturnWarning] = useState(false);
    const wasDrifting = useRef(false);
    const [activeBgAudio, setActiveBgAudio] = useState('none'); // none, music, rain, whiteNoise

    useEffect(() => {
        if (!isDrifting && wasDrifting.current) {
            setShowReturnWarning(true);
            const timer = setTimeout(() => setShowReturnWarning(false), 2000);
            return () => clearTimeout(timer);
        }
        if (isDrifting) {
            setShowReturnWarning(false);
        }
        wasDrifting.current = isDrifting;
    }, [isDrifting]);

    useEffect(() => {
        if (ghostTime) {
            if (elapsed > ghostTime * 1.1) {
                setScaleMax(elapsed * 1.2);
            }
        } else {
            if (elapsed > scaleMax * 0.8) {
                setScaleMax(scaleMax * 2);
            }
        }
    }, [elapsed, ghostTime, scaleMax]);

    // --- High-Velocity Launch Physics ---
    const totalGoalTime = (customization as any).duration || 1500000;
    
    // We use an aggressive square-root curve (0.25) so the cars shoot forward.
    // 1% of time = 31% visual progress! This guarantees they accelerate through the road.
    const getLaunchProgress = (currentTime: number, targetTime: number) => {
        const linear = Math.min(currentTime / targetTime, 1);
        return Math.pow(linear, 0.25) * 100; // Extremely aggressive launch
    };

    const playerProgress = getLaunchProgress(elapsed, totalGoalTime);
    const ghostTarget = ghostTime || (totalGoalTime * 0.9);
    const baseGhostProgress = getLaunchProgress(elapsed, ghostTarget);

    // Dynamic Chase Mechanic: Ghost gets a 15% visual head start that shrinks as the player catches up
    const ghostProgress = baseGhostProgress + (15 * (1 - (Math.min(playerProgress, 100) / 100)));

    const isOvertime = ghostTime ? elapsed > ghostTime : false;
    const timeDiff = ghostTime ? ghostTime - elapsed : 0;
    
    // Road-Anchored Mapping (Mapping 0-100% to 0-31% visual range)
    const getGroundedBottom = (progressPercent: number) => {
        return progressPercent * 0.31; 
    };

    const getLockedLaneX = (progress: number, laneSide: 'left' | 'right') => {
        const baseOffset = laneSide === 'right' ? 26 : -26; 
        const taper = 1 - (Math.min(progress, 100) / 100) * 0.85; 
        return 50 + baseOffset * taper;
    };

    const bossLeft = isOvertime ? 50 : getLockedLaneX(playerProgress, 'right');
    const bossBottom = isOvertime ? 30.5 : getGroundedBottom(playerProgress); 
    const bossScale = isOvertime ? 1.6 : 1.3 - (Math.min(playerProgress, 100) / 100) * 0.6;

    return (
        <div className={`${styles.container} ${isRunning ? styles.roadRunning : ''} ${tireHealth < 20 ? styles.redlineShake : tireHealth < 50 ? styles.vibrateEffect : ''}`}>
            {/* --- 3D Environment --- */}
            <div className={styles.envWrapper}>
                <div className={styles.horizonGlow} />
                
                <div className={styles.roadGroup}>
                    <div className={styles.roadFloor}>
                        {/* High-Speed Perspective Dashes */}
                        {isRunning && (
                            <div className={styles.dashContainer}>
                                <div className={styles.perspectiveDash} style={{ animationDelay: '0s' }} />
                                <div className={styles.perspectiveDash} style={{ animationDelay: '0.4s' }} />
                                <div className={styles.perspectiveDash} style={{ animationDelay: '0.8s' }} />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* --- Vehicles (High-Velocity & Stable Overlay) --- */}
            <div className={styles.vehicleOverlay}>
                {/* User Car (Final Boss) */}
                <div
                    className={`${styles.roadVehicle} ${isOvertime ? styles.bossGlow : ''}`}
                    style={{ 
                        left: `${bossLeft}%`,
                        bottom: `${bossBottom}%`,
                        transform: `translateX(-50%) scale(${bossScale})`,
                        transition: isOvertime 
                            ? 'left 1.2s cubic-bezier(0.4, 0, 0.2, 1), bottom 1.2s cubic-bezier(0.4, 0, 0.2, 1), transform 1.2s cubic-bezier(0.4, 0, 0.2, 1)'
                            : 'none',
                        zIndex: 30,
                        position: 'absolute'
                    }}
                >
                    <div className={`${styles.carSuspension} ${isOvertime ? styles.bossSuspension : ''}`}>
                        <div className={`${styles.carUnderglow} ${styles.userUnderglow}`} />
                        <div className={styles.groundShadow} />
                        {isRunning && <div className={styles.speedTrail} />}
                        <div className={styles.reflection}>
                            <CarIcon color={customization.carColor} width={240} height={150} />
                        </div>
                        <div className={`${styles.carGlow} ${isDrifting ? styles.carSpinning : ''}`}>
                            <CarIcon color={customization.carColor} width={240} height={150} />
                        </div>
                    </div>
                </div>

                {/* Ghost Hologram (Cinematic Exit) */}
                <div
                    className={styles.roadVehicle}
                    style={{ 
                        left: `${getLockedLaneX(ghostProgress, 'left')}%`,
                        bottom: `${isOvertime ? -20 : getGroundedBottom(ghostProgress)}%`, 
                        opacity: isOvertime ? 0 : 0.8,
                        transform: `translateX(-50%) scale(${1.3 - (Math.min(ghostProgress, 100) / 100) * 0.6})`,
                        transition: isOvertime
                            ? 'opacity 1.5s ease-out, bottom 1.5s cubic-bezier(0.4, 0, 0.2, 1), left 0.8s ease-in-out, transform 0.8s ease-in-out'
                            : 'none',
                        zIndex: 20,
                        position: 'absolute',
                        filter: 'drop-shadow(0 0 20px rgba(0, 229, 255, 0.6))',
                        pointerEvents: 'none'
                    }}
                >
                    <div className={styles.carSuspension}>
                        <div className={`${styles.carUnderglow} ${styles.ghostUnderglow}`} />
                        <div className={styles.groundShadowGhost} />
                        <div className={styles.hologramCar}>
                            <CarIcon color="rgba(0, 229, 255, 0.9)" width={240} height={150} />
                        </div>
                    </div>
                </div>
            </div>



            {/* --- Top Center Dashboard Panel --- */}
            <div className={styles.dashboardPanel}>
                <div className={styles.telemetryRow}>
                    <div className={styles.telemetryItem}>
                        <span className={styles.telemetryLabel}>MODE</span>
                        <span className={styles.telemetryValue}>{ghostMode}</span>
                    </div>
                    {cargo && (
                        <div className={styles.telemetryItem} style={{ flex: 2 }}>
                            <span className={styles.telemetryLabel}>CARGO DELIVERING</span>
                            <span className={styles.telemetryValue}>{cargo.toUpperCase()}</span>
                        </div>
                    )}
                    <div className={styles.telemetryItem} style={{ width: '120px' }}>
                        <span className={styles.telemetryLabel}>FOCUS STABILITY</span>
                        <div className={styles.tireHealthBar}>
                            <div 
                                className={styles.tireHealthFill} 
                                style={{ 
                                    width: `${tireHealth}%`,
                                    background: tireHealth < 20 ? '#ff3e3e' : tireHealth < 50 ? '#ffae00' : '#00E5FF'
                                }} 
                            />
                        </div>
                    </div>
                </div>

                {ghostTime !== null && (
                    <div className={styles.leadIndicator}>
                        <span className={styles.telemetryLabel} style={{ display: 'block', marginBottom: '2px' }}>
                            {ghostMode === 'RIVAL' ? 'RIVAL LEAD' : 'PACE DIFF'}
                        </span>
                        <span className={isOvertime ? styles.leadPositive : styles.leadNegative}>
                            <span className={styles.leadSign}>{isOvertime ? '+' : '-'}</span>
                            {formatTime(Math.abs(timeDiff))}
                        </span>
                    </div>
                )}

                <button onClick={() => onComplete(true)} className={styles.completeBtn}>
                    COMPLETE STINT
                </button>

                <div className={styles.secondaryActions}>
                    <button onClick={() => setIsSafeMode(!isSafeMode)} className={isSafeMode ? styles.safeModeActive : ''}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg> 
                        SHIELD {isSafeMode ? 'ON' : 'OFF'}
                    </button>
                    <button onClick={isRunning ? onPause : onResume}>
                        {isRunning ? 'PAUSE' : 'RESUME'}
                    </button>
                    <button onClick={() => confirm("Cancel session?") && onComplete(false)}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        CANCEL
                    </button>
                </div>
            </div>



            <AnimatePresence>
                {(isDrifting || showReturnWarning) && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={styles.driftOverlay}
                    >
                        <div className={styles.driftText}>
                            {isDrifting ? 'STAY FOCUSED' : 'GET BACK IN THE LANE'}
                            <span className={styles.driftSubtext}>
                                {isDrifting ? 'DANGER: DRIFTING DETECTED' : 'TIRE PRESSURE LOW • RECOVERING'}
                            </span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {isSafeMode && (
                <div className={styles.safeModeOverlay}>
                    <div className={`${styles.safeModeLabel} ${styles.safeModePulse}`}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        </svg>
                        SHIELD ACTIVE (NO PENALTIES)
                    </div>
                </div>
            )}
        </div>
    );
};
