"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GhostService } from "../services/ghostService";
import styles from "./CalendarModal.module.css";

interface CalendarModalProps {
    onClose: () => void;
    onSwitchMode?: () => void;
}

type CalendarView = "month" | "week";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

function formatDuration(ms: number): string {
    const totalSec = Math.floor(ms / 1000);
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    if (h > 0) return `${h}h ${m}m`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
}

function toDateKey(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function friendlyDate(dateKey: string): string {
    return new Date(dateKey + 'T12:00:00').toLocaleDateString('en', {
        weekday: 'long', month: 'long', day: 'numeric'
    });
}

export const CalendarModal = ({ onClose, onSwitchMode }: CalendarModalProps) => {
    const [view, setView] = useState<CalendarView>("month");
    const [cursor, setCursor] = useState(new Date());
    const [selectedDay, setSelectedDay] = useState<string | null>(null);

    // Add-entry form state
    const [showAddForm, setShowAddForm] = useState(false);
    const [formTask, setFormTask] = useState("");
    const [formHours, setFormHours] = useState("0");
    const [formMinutes, setFormMinutes] = useState("30");
    const [formNote, setFormNote] = useState("");
    const [formDate, setFormDate] = useState(toDateKey(new Date()));

    // Local sessions state so adds/deletes re-render instantly
    const [sessionsByDate, setSessionsByDate] = useState(() => GhostService.getSessionsByDate());

    const refresh = useCallback(() => {
        setSessionsByDate(GhostService.getSessionsByDate());
    }, []);

    // ── MONTH helpers ─────────────────────────────────────────────
    const monthYear = { year: cursor.getFullYear(), month: cursor.getMonth() };
    const firstOfMonth = new Date(monthYear.year, monthYear.month, 1);
    const startOffset = firstOfMonth.getDay();
    const daysInMonth = new Date(monthYear.year, monthYear.month + 1, 0).getDate();

    const monthGrid: (string | null)[] = [
        ...Array(startOffset).fill(null),
        ...Array.from({ length: daysInMonth }, (_, i) =>
            toDateKey(new Date(monthYear.year, monthYear.month, i + 1))
        ),
    ];

    // ── WEEK helpers ──────────────────────────────────────────────
    const startOfWeek = new Date(cursor);
    startOfWeek.setDate(cursor.getDate() - cursor.getDay());
    const weekDays = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(startOfWeek);
        d.setDate(startOfWeek.getDate() + i);
        return { key: toDateKey(d), date: d };
    });

    // ── Navigation ────────────────────────────────────────────────
    const goBack = () => {
        const d = new Date(cursor);
        view === "month" ? d.setMonth(d.getMonth() - 1) : d.setDate(d.getDate() - 7);
        setCursor(d);
    };
    const goForward = () => {
        const d = new Date(cursor);
        view === "month" ? d.setMonth(d.getMonth() + 1) : d.setDate(d.getDate() + 7);
        setCursor(d);
    };

    const todayKey = toDateKey(new Date());

    // ── Split sessions from goals ──────────────────────────────────
    const getReal = (key: string) => (sessionsByDate[key] || []).filter(s => !s.isManual);
    const getGoals = (key: string) => (sessionsByDate[key] || []).filter(s => s.isManual);

    // ── Intensity based on REAL sessions only ─────────────────────
    const getIntensity = (key: string) => {
        const real = getReal(key);
        if (real.length === 0) return 0;
        const totalMs = real.reduce((a, s) => a + s.duration, 0);
        const mins = totalMs / 60000;
        if (mins >= 60) return 4;
        if (mins >= 30) return 3;
        if (mins >= 10) return 2;
        return 1;
    };

    // ── Header label ──────────────────────────────────────────────
    const headerLabel = view === "month"
        ? `${MONTHS[monthYear.month]} ${monthYear.year}`
        : `${weekDays[0].date.toLocaleDateString('en', { month: 'short', day: 'numeric' })} – ${weekDays[6].date.toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })}`;

    const selectedReal = selectedDay ? getReal(selectedDay) : [];
    const selectedGoals = selectedDay ? getGoals(selectedDay) : [];

    // ── Add Entry ─────────────────────────────────────────────────
    const handleAddEntry = () => {
        const h = parseInt(formHours) || 0;
        const m = parseInt(formMinutes) || 0;
        const totalMs = (h * 60 + m) * 60 * 1000;
        if (!formTask.trim() || totalMs === 0) return;

        GhostService.addCalendarEntry(formDate, formTask, totalMs, formNote || undefined);
        refresh();

        // Reset form
        setFormTask("");
        setFormHours("0");
        setFormMinutes("30");
        setFormNote("");
        setShowAddForm(false);

        // Select the day that was just added to
        setSelectedDay(formDate);
    };

    const handleDeleteGoal = (id: string | undefined) => {
        if (!id) return;
        GhostService.deleteCalendarEntry(id);
        refresh();
    };

    const handleDeleteRealSession = (taskId: string | undefined, at: number | undefined) => {
        if (!taskId || !at) return;
        GhostService.deleteAppSession(taskId, at);
        refresh();
    };

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
                initial={{ scale: 0.92, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.92, opacity: 0, y: 20 }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className={styles.header}>
                    <div className={styles.headerTabs}>
                        <button className={`${styles.headerTab} ${styles.headerTabActive}`}>
                            HISTORY
                        </button>
                        <button className={styles.headerTab} onClick={onSwitchMode}>
                            PLANNER
                        </button>
                    </div>
                    <div className={styles.headerActions}>
                        <button
                            className={styles.addEntryBtn}
                            onClick={() => { setShowAddForm(v => !v); setFormDate(selectedDay || toDateKey(new Date())); }}
                        >
                            {showAddForm ? "✕ Cancel" : "+ Add Entry"}
                        </button>
                        <button className={styles.closeBtn} onClick={onClose}>×</button>
                    </div>
                </div>

                {/* ── Add Entry Form ── */}
                <AnimatePresence>
                    {showAddForm && (
                        <motion.div
                            className={styles.addForm}
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.2 }}
                        >
                            <div className={styles.formRow}>
                                <div className={styles.formField}>
                                    <label className={styles.formLabel}>Date</label>
                                    <input
                                        type="date"
                                        className={styles.formInput}
                                        value={formDate}
                                        onChange={e => setFormDate(e.target.value)}
                                    />
                                </div>
                                <div className={styles.formField} style={{ flex: 2 }}>
                                    <label className={styles.formLabel}>Task Name</label>
                                    <input
                                        type="text"
                                        className={styles.formInput}
                                        placeholder="e.g. Read chapter 3"
                                        value={formTask}
                                        onChange={e => setFormTask(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && handleAddEntry()}
                                    />
                                </div>
                            </div>
                            <div className={styles.formRow}>
                                <div className={styles.formField}>
                                    <label className={styles.formLabel}>Hours</label>
                                    <input
                                        type="number"
                                        className={styles.formInput}
                                        min="0" max="23"
                                        value={formHours}
                                        onChange={e => setFormHours(e.target.value)}
                                    />
                                </div>
                                <div className={styles.formField}>
                                    <label className={styles.formLabel}>Minutes</label>
                                    <input
                                        type="number"
                                        className={styles.formInput}
                                        min="0" max="59"
                                        value={formMinutes}
                                        onChange={e => setFormMinutes(e.target.value)}
                                    />
                                </div>
                                <div className={styles.formField} style={{ flex: 2 }}>
                                    <label className={styles.formLabel}>Note (optional)</label>
                                    <input
                                        type="text"
                                        className={styles.formInput}
                                        placeholder="Any details..."
                                        value={formNote}
                                        onChange={e => setFormNote(e.target.value)}
                                    />
                                </div>
                            </div>
                            <button className={styles.submitBtn} onClick={handleAddEntry}>
                                Save Entry
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* View Toggle */}
                <div className={styles.viewToggle}>
                    <button className={`${styles.toggleBtn} ${view === "month" ? styles.toggleActive : ""}`} onClick={() => setView("month")}>Monthly</button>
                    <button className={`${styles.toggleBtn} ${view === "week" ? styles.toggleActive : ""}`} onClick={() => setView("week")}>Weekly</button>
                </div>

                {/* Navigation */}
                <div className={styles.nav}>
                    <button className={styles.navBtn} onClick={goBack}>◀</button>
                    <span className={styles.navLabel}>{headerLabel}</span>
                    <button className={styles.navBtn} onClick={goForward}>▶</button>
                </div>

                {/* ── MONTH VIEW ── */}
                {view === "month" && (
                    <div className={styles.monthGrid}>
                        {DAYS.map(d => <div key={d} className={styles.dayName}>{d}</div>)}
                        {monthGrid.map((key, i) => {
                            if (!key) return <div key={`empty-${i}`} className={styles.emptyCell} />;
                            const intensity = getIntensity(key);
                            const isToday = key === todayKey;
                            const isSelected = key === selectedDay;
                            const dayNum = parseInt(key.split('-')[2]);
                            return (
                                <motion.div key={key} whileHover={{ scale: 1.1 }}
                                    className={`${styles.dayCell} ${styles[`intensity${intensity}`]} ${isToday ? styles.today : ""} ${isSelected ? styles.selectedDay : ""}`}
                                    onClick={() => setSelectedDay(isSelected ? null : key)}
                                >
                                    <span className={styles.dayNum}>{dayNum}</span>
                                    {intensity > 0 && <span className={styles.sessionDot} />}
                                </motion.div>
                            );
                        })}
                    </div>
                )}

                {/* ── WEEK VIEW ── */}
                {view === "week" && (
                    <div className={styles.weekGrid}>
                        {weekDays.map(({ key, date }) => {
                            const intensity = getIntensity(key);
                            const isToday = key === todayKey;
                            const isSelected = key === selectedDay;
                            const realSessions = getReal(key);
                            const goals = getGoals(key);
                            const realMs = realSessions.reduce((a, s) => a + s.duration, 0);
                            return (
                                <motion.div key={key} whileHover={{ scale: 1.02 }}
                                    className={`${styles.weekDay} ${styles[`intensity${intensity}`]} ${isToday ? styles.today : ""} ${isSelected ? styles.selectedDay : ""}`}
                                    onClick={() => setSelectedDay(isSelected ? null : key)}
                                >
                                    <div className={styles.weekDayHeader}>
                                        <span className={styles.weekDayName}>{DAYS[date.getDay()]}</span>
                                        <span className={`${styles.weekDayNum} ${isToday ? styles.todayNum : ""}`}>{date.getDate()}</span>
                                    </div>
                                    {realSessions.length > 0 ? (
                                        <div className={styles.weekStats}>
                                            <span className={styles.weekSessions}>{realSessions.length} session{realSessions.length > 1 ? "s" : ""}</span>
                                            <span className={styles.weekTime}>{formatDuration(realMs)}</span>
                                        </div>
                                    ) : goals.length > 0 ? (
                                        <div className={styles.weekGoalHint}>{goals.length} goal{goals.length > 1 ? "s" : ""}</div>
                                    ) : (
                                        <div className={styles.noSession}>No flow</div>
                                    )}
                                    <div className={styles.weekBar}>
                                        <div className={styles.weekBarFill} style={{ height: `${Math.min((realMs / 3600000) * 100, 100)}%` }} />
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}

                {/* ── Day Detail Panel ── */}
                <AnimatePresence>
                    {selectedDay && (
                        <motion.div
                            className={styles.detailPanel}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                        >
                            <div className={styles.detailHeader}>
                                <span className={styles.detailDate}>{friendlyDate(selectedDay)}</span>
                                <div className={styles.detailHeaderRight}>
                                    {selectedReal.length > 0 && (
                                        <span className={styles.detailTotal}>
                                            {formatDuration(selectedReal.reduce((a, s) => a + s.duration, 0))} total
                                        </span>
                                    )}
                                    <button
                                        className={styles.addDayBtn}
                                        onClick={() => {
                                            setFormDate(selectedDay);
                                            setShowAddForm(true);
                                        }}
                                    >
                                        + Add
                                    </button>
                                </div>
                            </div>

                            {/* Real sessions */}
                            {selectedReal.length === 0 && selectedGoals.length === 0 ? (
                                <p className={styles.noData}>No sessions on this day. Click "+ Add" to set a goal.</p>
                            ) : (
                                <>
                                    {/* Achieved sessions */}
                                    {selectedReal.length > 0 && (
                                        <>
                                            <div className={styles.sectionLabel}>✅ ACHIEVED</div>
                                            <div className={styles.sessionList}>
                                                {selectedReal.map((s, i) => (
                                                    <div key={i} className={styles.sessionItem}>
                                                        <div className={styles.sessionLeft}>
                                                            <div className={styles.sessionTask}>{s.taskName}</div>
                                                        </div>
                                                        <div className={styles.sessionRight}>
                                                            <span className={styles.sessionDuration}>{formatDuration(s.duration)}</span>
                                                            {(s.id || s.taskId) && (
                                                                <button
                                                                    className={styles.deleteBtn}
                                                                    onClick={() => {
                                                                        if (s.isManual) {
                                                                            handleDeleteGoal(s.id);
                                                                        } else if (s.taskId && s.at) {
                                                                            handleDeleteRealSession(s.taskId, s.at);
                                                                        }
                                                                    }}
                                                                    title="Delete session"
                                                                >×</button>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    )}

                                    {/* Goals */}
                                    {selectedGoals.length > 0 && (
                                        <>
                                            <div className={styles.sectionLabel}>🎯 GOALS</div>
                                            <div className={styles.sessionList}>
                                                {selectedGoals.map((s, i) => (
                                                    <div key={i} className={`${styles.sessionItem} ${styles.goalEntry}`}>
                                                        <div className={styles.sessionLeft}>
                                                            <div>
                                                                <div className={styles.sessionTask}>{s.taskName}</div>
                                                                {s.note && <div className={styles.sessionNote}>{s.note}</div>}
                                                            </div>
                                                        </div>
                                                        <div className={styles.sessionRight}>
                                                            <span className={styles.goalDuration}>{formatDuration(s.duration)}</span>
                                                            {s.id && (
                                                                <button
                                                                    className={styles.deleteBtn}
                                                                    onClick={() => handleDeleteGoal(s.id)}
                                                                    title="Delete goal"
                                                                >×</button>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Legend */}
                <div className={styles.legend}>
                    <span className={styles.legendLabel}>Focus intensity:</span>
                    {[0, 1, 2, 3, 4].map(i => (
                        <div key={i} className={`${styles.legendDot} ${styles[`intensity${i}`]}`} />
                    ))}
                    <span className={styles.legendLabel}>High</span>
                </div>
            </motion.div>
        </motion.div>
    );
};
