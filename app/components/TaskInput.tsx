import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GhostService, TaskRecord } from '../services/ghostService';
import styles from './TaskInput.module.css';

interface TaskInputProps {
    onStart: (taskName: string, ghostTime: number | undefined, subject: string, breakMinutes: number, laps: number, ghostMode: 'RIVAL' | 'PACER', cargo: string) => void;
}

export const TaskInput = ({ onStart }: TaskInputProps) => {
    const [subject, setSubject] = useState('');
    const [cargo, setCargo] = useState('');
    const [targetTimeStr, setTargetTimeStr] = useState('');
    const [strategyEnabled, setStrategyEnabled] = useState(false);
    const [ghostMode, setGhostMode] = useState<'RIVAL' | 'PACER'>('RIVAL');
    const [allTasks, setAllTasks] = useState<TaskRecord[]>([]);

    const canStart = subject.trim().length > 0;

    useEffect(() => {
        setAllTasks(GhostService.getAllTasks());
    }, []);

    const parseTimeInput = (input: string): number | null => {
        if (!input.trim()) return null;
        if (input.includes(':')) {
            const [h, m] = input.split(':');
            const hours = parseInt(h, 10);
            const mins = parseInt(m, 10);
            if (!isNaN(hours) && !isNaN(mins)) return hours * 60 + mins;
        }
        const minutes = parseFloat(input);
        return isNaN(minutes) ? null : minutes;
    };

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!canStart) return;

        const parsedMinutes = parseTimeInput(targetTimeStr);
        const breakMins = strategyEnabled ? parseInt((document.getElementById('break-time') as HTMLInputElement)?.value || '5') : 0;
        const laps = strategyEnabled ? parseInt((document.getElementById('laps-count') as HTMLInputElement)?.value || '1') : 1;

        if (parsedMinutes !== null && parsedMinutes > 0) {
            onStart(subject.trim(), parsedMinutes * 60 * 1000, subject.trim(), breakMins, laps, ghostMode, cargo.trim());
        } else {
            const record = GhostService.getTask(subject.trim());
            const ghost = record?.bestTime || undefined;
            onStart(subject.trim(), ghost, subject.trim(), breakMins, laps, ghostMode, cargo.trim());
        }
    };

    const handleRecentClick = (record: TaskRecord) => {
        setSubject(record.name);
        if (record.bestTime) {
            setTargetTimeStr(Math.round(record.bestTime / 60000).toString());
        } else {
            setTargetTimeStr('');
        }
    };

    const handleDeleteTask = (e: React.MouseEvent, record: TaskRecord) => {
        e.stopPropagation();
        GhostService.deleteTask(record.id);
        setAllTasks(GhostService.getAllTasks());
    };

    const formatDuration = (ms: number) => {
        const minutes = Math.floor(ms / 60000);
        if (minutes < 60) return `${minutes}m`;
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        return m > 0 ? `${h}h ${m}m` : `${h}h`;
    };

    return (
        <div className={styles.container}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.inputGroup}>

                    <input
                        type="text"
                        value={subject}
                        onChange={(e) => {
                            setSubject(e.target.value);
                            const rec = GhostService.getTask(e.target.value.trim());
                            if (rec?.bestTime) {
                                setTargetTimeStr(Math.round(rec.bestTime / 60000).toString());
                            } else if (!targetTimeStr || rec === null) {
                                setTargetTimeStr('');
                            }
                        }}
                        placeholder="What are you focusing on?"
                        className={styles.input}
                        autoFocus
                        list="subject-suggestions"
                    />
                    <datalist id="subject-suggestions">
                        {allTasks.map(t => (
                            <option key={t.id} value={t.name} />
                        ))}
                    </datalist>

                    <AnimatePresence>
                        {canStart && (
                            <motion.div
                                className={styles.subtaskRow}
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.25 }}
                            >
                                <input
                                    type="text"
                                    value={cargo}
                                    onChange={(e) => setCargo(e.target.value)}
                                    placeholder="CARGO: WHAT ARE YOU DELIVERING? (E.G. 5 PROBLEMS)"
                                    className={styles.cargoInput}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className={styles.optionsRow}>
                        <div className={styles.modeSelector}>
                            <button
                                type="button"
                                className={`${styles.modeBtn} ${!strategyEnabled ? styles.modeActive : ''}`}
                                onClick={() => setStrategyEnabled(false)}
                            >
                                QUICK FOCUS
                            </button>
                            <button
                                type="button"
                                className={`${styles.modeBtn} ${strategyEnabled ? styles.modeActive : ''}`}
                                onClick={() => setStrategyEnabled(true)}
                            >
                                SESSION STRATEGY
                            </button>
                        </div>

                        <div className={styles.modeSelector}>
                            <button
                                type="button"
                                className={`${styles.modeBtn} ${ghostMode === 'RIVAL' ? styles.modeActive : ''}`}
                                onClick={() => setGhostMode('RIVAL')}
                                title="Race your best time"
                            >
                                RIVAL
                            </button>
                            <button
                                type="button"
                                className={`${styles.modeBtn} ${ghostMode === 'PACER' ? styles.modeActive : ''}`}
                                onClick={() => setGhostMode('PACER')}
                                title="Follow a steady pace"
                            >
                                PACER
                            </button>
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        {!strategyEnabled ? (
                            <motion.div
                                key="quick-race"
                                className={styles.optionsRow}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                            >
                                <div className={styles.timeInputWrapper}>
                                    <span className={styles.timeLabel}>Target Time:</span>
                                    <input
                                        type="text"
                                        value={targetTimeStr}
                                        onChange={(e) => setTargetTimeStr(e.target.value)}
                                        className={styles.timeInput}
                                        placeholder="MINS (OR EMPTY)"
                                    />
                                </div>
                            </motion.div>
                        ) : (
                            /* Race Strategy Configurator */
                            <motion.div
                                key="strategy-mode"
                                className={styles.strategyContainer}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                            >
                                <div className={styles.strategyHeader}>
                                    <span>PIT CREW SETTINGS</span>
                                </div>
                                <div className={styles.strategyGrid}>
                                    <div className={styles.strategyItem}>
                                        <label>LAP TIME</label>
                                        <input
                                            type="number"
                                            value={targetTimeStr || '25'}
                                            onChange={(e) => setTargetTimeStr(e.target.value)}
                                            className={styles.strategyInput}
                                        />
                                    </div>
                                    <div className={styles.strategyItem}>
                                        <label>PIT STOP</label>
                                        <input
                                            type="number"
                                            defaultValue="5"
                                            className={styles.strategyInput}
                                            id="break-time"
                                        />
                                    </div>
                                    <div className={styles.strategyItem}>
                                        <label>LAPS</label>
                                        <input
                                            type="number"
                                            defaultValue="4"
                                            className={styles.strategyInput}
                                            id="laps-count"
                                        />
                                    </div>
                                </div>
                                <div className={styles.strategyDivider}>
                                    <span className={styles.strategyDiamond}>◆</span>
                                </div>
                                <p className={styles.strategyHint}>
                                    * Sessions will automatically cycle.
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <motion.button
                    type="submit"
                    disabled={!canStart}
                    className={styles.submitBtn}
                    animate={
                        canStart
                            ? {
                                scale: [1, 1.05, 1],
                                boxShadow: [
                                    "0 0 20px var(--go-glow-color-1), 0 0 50px var(--go-glow-color-1), inset 0 0 20px var(--go-glow-color-1)",
                                    "0 0 40px var(--go-glow-color-2), 0 0 80px var(--go-glow-color-2), inset 0 0 30px var(--go-glow-color-2)",
                                    "0 0 20px var(--go-glow-color-1), 0 0 50px var(--go-glow-color-1), inset 0 0 20px var(--go-glow-color-1)"
                                ],
                            }
                            : {
                                scale: 1,
                                boxShadow: "none",
                            }
                    }
                    style={{
                        backgroundColor: "var(--go-btn-bg)",
                        color: "var(--go-btn-text)"
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                >
                    GO
                </motion.button>
            </form>

            {/* Recent subjects */}
            <AnimatePresence>
                {allTasks.length > 0 && (
                    <motion.div
                        className={styles.recentSection}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                    >
                        <span className={styles.recentTitle}>Resume Flow</span>
                        <div className={styles.taskList}>
                            {allTasks.slice(0, 6).map((t) => (
                                <motion.div
                                    key={t.id}
                                    className={styles.taskChip}
                                    onClick={() => handleRecentClick(t)}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <span>{t.name}</span>
                                    {t.bestTime > 0 && (
                                        <span className={styles.taskTime}>
                                            {formatDuration(t.bestTime)}
                                        </span>
                                    )}
                                    <button
                                        className={styles.deleteTaskBtn}
                                        onClick={(e) => handleDeleteTask(e, t)}
                                        title="Delete"
                                    >✕</button>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
