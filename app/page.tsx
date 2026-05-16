"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TaskInput } from "./components/TaskInput";
import { TodoList } from "./components/TodoList";
import { NoiseMixer } from "./components/NoiseMixer";
import { RaceView } from "./components/RaceView";
import { ResultModal } from "./components/ResultModal";
import { Background3D } from "./components/Background3D";
import { CustomizationModal } from "./components/CustomizationModal";
import { LevelBadge } from "./components/LevelBadge";
import { LevelModal } from "./components/LevelModal";
import { CalendarModal } from "./components/CalendarModal";
import { ExamPlannerModal } from "./components/ExamPlannerModal";
import { ThemeToggle } from "./components/ThemeToggle";
import { PitStop } from "./components/PitStop";
import { OnboardingTour } from "./components/OnboardingTour";

import { useTimer } from "./hooks/useTimer";
import { GhostService, TaskRecord, CustomizationState } from "./services/ghostService";
import styles from "./page.module.css";

const MinimalistGhost = ({ color, opacity, width = 80 }: { color: string, opacity: number, width?: number }) => (
    <motion.svg
        width={width}
        height={width * 1.25}
        viewBox="0 0 100 125"
        style={{ opacity }}
    >
        {/* Main Body with Liquid Animated Bottom */}
        <motion.path
            d="M20,100 Q20,20 50,20 Q80,20 80,100 L80,115 Q70,105 60,115 Q50,105 40,115 Q30,105 20,115 Z"
            fill={color}
            animate={{
                d: [
                    "M20,100 Q20,20 50,20 Q80,20 80,100 L80,115 Q70,105 60,115 Q50,105 40,115 Q30,105 20,115 Z",
                    "M20,100 Q20,20 50,20 Q80,20 80,100 L80,110 Q70,115 60,110 Q50,115 40,110 Q30,115 20,110 Z",
                    "M20,100 Q20,20 50,20 Q80,20 80,100 L80,115 Q70,105 60,115 Q50,105 40,115 Q30,105 20,115 Z"
                ]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Soft Eyes */}
        <circle cx="38" cy="50" r="4" fill="currentColor" style={{ opacity: 0.3 }} />
        <circle cx="62" cy="50" r="4" fill="currentColor" style={{ opacity: 0.3 }} />
        {/* Highlight for glass effect */}
        <path d="M40,30 Q50,25 60,30" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.3" />
    </motion.svg>
);

type AppMode = 'HOME' | 'RACE' | 'RESULT';

export default function Home() {
    const [mode, setMode] = useState<AppMode>('HOME');
    const [isRacing, setIsRacing] = useState(false);
    const [isDrifting, setIsDrifting] = useState(false);
    const [isSafeMode, setIsSafeMode] = useState(false);
    const [taskName, setTaskName] = useState('');
    const [taskParent, setTaskParent] = useState<string | undefined>(undefined);
    const [raceTargetTime, setRaceTargetTime] = useState<number | null>(null);
    const [pomodoroConfig, setPomodoroConfig] = useState<{ breakTime: number, laps: number, currentLap: number, mode: 'RACE' | 'BREAK' }>({
        breakTime: 5,
        laps: 1,
        currentLap: 1,
        mode: 'RACE'
    });
    const [countdown, setCountdown] = useState<number | null>(null);
    const [ghostMode, setGhostMode] = useState<'RIVAL' | 'PACER'>('RIVAL');
    const [currentCargo, setCurrentCargo] = useState('');
    const [tireHealth, setTireHealth] = useState(100);

    // Customization & Progression State
    const [customization, setCustomization] = useState<CustomizationState>(GhostService.getCustomization());
    const [lastFuelGained, setLastFuelGained] = useState(0);
    const [showCustomization, setShowCustomization] = useState(false);
    const [showLevelModal, setShowLevelModal] = useState(false);
    const [showCalendar, setShowCalendar] = useState(false);
    const [calendarMode, setCalendarMode] = useState<'history' | 'planner'>('history');

    const { elapsed, isRunning, setSpeedMultiplier, start, stop, reset } = useTimer();

    useEffect(() => {
        const handleVisibilityChange = () => {
            const drifting = document.visibilityState === 'hidden';
            if (mode === 'RACE') {
                if (isSafeMode) {
                    setIsDrifting(false);
                    setSpeedMultiplier(1.0);
                } else {
                    setIsDrifting(drifting);
                    setSpeedMultiplier(drifting ? 0.1 : 1.0);
                    if (drifting) {
                        setTireHealth(prev => Math.max(0, prev - 15)); // Big penalty for drifting
                    }
                }
            } else {
                setIsDrifting(false);
                setSpeedMultiplier(1.0);
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, [mode, setSpeedMultiplier, isSafeMode]);

    // Passive tire wear during race
    useEffect(() => {
        if (mode === 'RACE' && isRunning && pomodoroConfig.mode === 'RACE') {
            const interval = setInterval(() => {
                setTireHealth(prev => Math.max(0, prev - 0.2));
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [mode, isRunning, pomodoroConfig.mode]);

    const handleStart = (task: string, customDuration: number | undefined, parent: string, breakTime: number, laps: number, mode: 'RIVAL' | 'PACER', cargo: string) => {
        setIsRacing(true);
        setCurrentCargo(cargo);
        const record = GhostService.getTask(task, parent);
        setTaskName(task);
        setTaskParent(parent);
        const raceTarget = customDuration || (record ? record.bestTime : null);
        setRaceTargetTime(raceTarget);
        setGhostMode(mode);
        setPomodoroConfig({
            breakTime,
            laps,
            currentLap: 1,
            mode: 'RACE'
        });

        // Launch Sequence
        setCountdown(3);
        const timer = setInterval(() => {
            setCountdown(prev => {
                if (prev === null || prev <= 1) {
                    clearInterval(timer);
                    setMode('RACE');
                    start();
                    setIsRacing(false);
                    return null;
                }
                return prev - 1;
            });
        }, 800);
    };

    const handleComplete = (save: boolean = true) => {
        stop();
        if (save) {
            // If it was a Race, save it
            if (pomodoroConfig.mode === 'RACE') {
                const { fuelGained } = GhostService.saveRun(taskName, elapsed, taskParent);
                setLastFuelGained(fuelGained);
            }

            // Check if we have more laps or need a break
            if (pomodoroConfig.mode === 'RACE' && pomodoroConfig.laps > 1) {
                // Transition to BREAK
                setPomodoroConfig(prev => ({ ...prev, mode: 'BREAK' }));
                setRaceTargetTime(pomodoroConfig.breakTime * 60 * 1000);
                reset();
                start();
            } else if (pomodoroConfig.mode === 'BREAK' && pomodoroConfig.currentLap < pomodoroConfig.laps) {
                // Transition to next RACE lap
                setPomodoroConfig(prev => ({ ...prev, mode: 'RACE', currentLap: prev.currentLap + 1 }));
                // We keep the original race target if it existed
                reset();
                start();
            } else {
                setMode('RESULT');
            }
        } else {
            setMode('HOME');
            setTaskName('');
            setTaskParent(undefined);
            setLastFuelGained(0);
            reset();
        }
    };

    const handleCloseResult = () => {
        setMode('HOME');
        setTaskName('');
        setLastFuelGained(0);
        setCustomization(GhostService.getCustomization());
        reset();
    };

    return (
        <div className={`${styles.pageContainer} ${isRacing || mode === 'RACE' ? styles.racingBackground : ''}`}>
            {mode === 'HOME' && <OnboardingTour />}
            {mode !== 'RACE' && <Background3D blur={true} />}
            <main className={styles.mainContent}>
                <AnimatePresence>
                    {mode === 'HOME' && (
                        <>
                            {/* Top Navigation Bar */}
                            <motion.div
                                className={styles.topNav}
                                initial={{ opacity: 0, y: -20 }}
                                animate={isRacing ? { opacity: 0, y: -50 } : { opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <div className={styles.navLeft}>
                                    <ThemeToggle />

                                </div>
                                <div className={styles.navRight}>
                                    <button id="garage-btn" className={styles.navButton} onClick={() => setShowCustomization(true)}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" /></svg>
                                        GARAGE
                                    </button>
                                    <button id="calendar-btn" className={styles.navButton} onClick={() => setShowCalendar(true)}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                                        CALENDAR
                                    </button>
                                    <div className={styles.navDivider}></div>
                                    <div id="level-badge">
                                        <LevelBadge onClick={() => setShowLevelModal(true)} />
                                    </div>
                                </div>
                            </motion.div>

                            {/* Ghost Icons */}
                            <motion.div
                                className={styles.ghostSilver}
                                initial={{ top: '2.5rem', left: '2.5rem' }}
                                animate={isRacing ? { top: '-10rem', left: '-10rem', opacity: 0 } : { y: [0, -15, 0] }}
                                transition={isRacing ? { duration: 0.8, ease: "backIn" } : { duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <MinimalistGhost color="#E9ECEF" opacity={0.4} width={80} />
                            </motion.div>

                            <motion.div
                                className={styles.ghostCyan}
                                initial={{ bottom: '2.5rem', right: '2.5rem' }}
                                animate={isRacing ? { bottom: '50vh', right: '50vw', scale: 2, x: '50%', y: '50%', opacity: 0 } : { y: [0, -15, 0] }}
                                transition={isRacing ? { duration: 1.2, ease: "anticipate" } : { duration: 5, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <MinimalistGhost color="#00E5FF" opacity={1.0} width={96} />
                            </motion.div>

                            {/* Launch Countdown Overlay */}
                            <AnimatePresence>
                                {countdown !== null && (
                                    <motion.div
                                        className={styles.countdownOverlay}
                                        initial={{ opacity: 0, scale: 2 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.5 }}
                                        transition={{ duration: 0.4 }}
                                        key={countdown}
                                    >
                                        <div className={styles.countdownNumber}>{countdown === 0 ? 'GO' : countdown}</div>
                                        <div className={styles.countdownLabel}>PREPARING FLOW ENGINE</div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Center Glass Card */}
                            <motion.div
                                id="glass-card"
                                className={styles.glassCard}
                                animate={isRacing ? { opacity: 0, scale: 0.9, y: 10 } : { opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <div className="mb-4 text-white/50 text-xs tracking-[0.3em] font-light" style={{ color: 'var(--text-muted)' }}>MINDFLOW</div>
                                <TaskInput onStart={handleStart} />
                                <TodoList onStartRace={(task, duration) => handleStart(task, duration, '', 5, 1, 'RIVAL', '')} />
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {showCustomization && (
                        <CustomizationModal
                            onClose={() => {
                                setShowCustomization(false);
                                setCustomization(GhostService.getCustomization());
                            }}
                        />
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {showCalendar && calendarMode === 'history' && (
                        <CalendarModal
                            onClose={() => setShowCalendar(false)}
                            onSwitchMode={() => setCalendarMode('planner')}
                        />
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {showCalendar && calendarMode === 'planner' && (
                        <ExamPlannerModal
                            onClose={() => setShowCalendar(false)}
                            onSwitchMode={() => setCalendarMode('history')}
                        />
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {showLevelModal && (
                        <LevelModal
                            onClose={() => setShowLevelModal(false)}
                        />
                    )}
                </AnimatePresence>

                <NoiseMixer isRacing={mode === 'RACE'} />

                {
                    mode === 'RACE' && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            style={{ width: '100%', height: '100%' }}
                        >
                            {pomodoroConfig.mode === 'BREAK' ? (
                                <PitStop 
                                    onComplete={() => {
                                        setTireHealth(100);
                                        handleComplete(true);
                                    }}
                                    duration={pomodoroConfig.breakTime}
                                />
                            ) : (
                                <RaceView
                                    elapsed={elapsed}
                                    ghostTime={raceTargetTime}
                                    customization={customization}
                                    onComplete={handleComplete}
                                    isDrifting={isDrifting}
                                    isSafeMode={isSafeMode}
                                    setIsSafeMode={setIsSafeMode}
                                    isRunning={isRunning}
                                    onPause={stop}
                                    onResume={start}
                                    pomodoroConfig={pomodoroConfig}
                                    ghostMode={ghostMode}
                                    cargo={currentCargo}
                                    tireHealth={tireHealth}
                                />
                            )}
                        </motion.div>
                    )
                }

                {
                    mode === 'RESULT' && (
                        <ResultModal
                            duration={elapsed}
                            ghostTime={raceTargetTime}
                            fuelGained={lastFuelGained}
                            onClose={handleCloseResult}
                            totalXpEarned={GhostService.getTotalXpEarned()}
                            taskLabel={taskParent ? `${taskParent} › ${taskName}` : taskName}
                            cargo={currentCargo}
                        />
                    )
                }
            </main >
        </div >
    );
}
