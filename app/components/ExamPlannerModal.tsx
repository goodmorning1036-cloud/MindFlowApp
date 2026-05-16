"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GhostService, ExamEntry } from "../services/ghostService";
import styles from "./ExamPlannerModal.module.css";

interface ExamPlannerModalProps {
    onClose: () => void;
    onSwitchMode?: () => void;
}

type CalendarView = "month" | "week";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

function toDateKey(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function friendlyDate(dateKey: string): string {
    return new Date(dateKey + 'T12:00:00').toLocaleDateString('en', {
        weekday: 'long', month: 'long', day: 'numeric'
    });
}

export const ExamPlannerModal = ({ onClose, onSwitchMode }: ExamPlannerModalProps) => {
    const [view, setView] = useState<CalendarView>("month");
    const [cursor, setCursor] = useState(new Date());
    const [selectedDay, setSelectedDay] = useState<string | null>(null);
    const [selectedExamId, setSelectedExamId] = useState<string | null>(null);

    // Exams State
    const [exams, setExams] = useState<ExamEntry[]>(() => GhostService.getExams());

    // Input States
    const [newExamTitle, setNewExamTitle] = useState("");
    const [newSubtaskText, setNewSubtaskText] = useState("");
    const [selectedExamForSubtask, setSelectedExamForSubtask] = useState<string>("");

    const refresh = useCallback(() => {
        setExams(GhostService.getExams());
    }, []);

    // ── CALENDAR LOGIC ─────────────────────────────────────────────
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

    const startOfWeek = new Date(cursor);
    startOfWeek.setDate(cursor.getDate() - cursor.getDay());
    const weekDays = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(startOfWeek);
        d.setDate(startOfWeek.getDate() + i);
        return { key: toDateKey(d), date: d };
    });

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

    const headerLabel = view === "month"
        ? `${MONTHS[monthYear.month]} ${monthYear.year}`
        : `${weekDays[0].date.toLocaleDateString('en', { month: 'short', day: 'numeric' })} – ${weekDays[6].date.toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })}`;

    // ── DATA HELPERS ────────────────────────────────────────────────
    const getExamsOnDay = (date: string) => exams.filter(e => e.date === date);

    // Subtasks on a day (grouped by Exam)
    const getSubtasksOnDay = (date: string) => {
        const tasks: { examTitle: string, examId: string, subtaskId: string, text: string, completed: boolean }[] = [];
        exams.forEach(exam => {
            (exam.subtasks || []).forEach(st => {
                if (st.date === date) {
                    tasks.push({
                        examTitle: exam.title,
                        examId: exam.id,
                        subtaskId: st.id,
                        text: st.text,
                        completed: st.completed
                    });
                }
            });
        });
        return tasks;
    };

    const dayHasActivity = (date: string) => {
        return getExamsOnDay(date).length > 0 || getSubtasksOnDay(date).length > 0;
    };

    // ── HANDLERS ──────────────────────────────────────────────────
    const handleAddExam = () => {
        if (!newExamTitle.trim() || !selectedDay) return;
        GhostService.addExam(newExamTitle, selectedDay);
        setNewExamTitle("");
        refresh();
    };

    const handleAddSubtask = () => {
        if (!newSubtaskText.trim() || !selectedExamForSubtask || !selectedDay) return;
        GhostService.addExamSubtask(selectedExamForSubtask, newSubtaskText, selectedDay);
        setNewSubtaskText("");
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
                        <button className={styles.headerTab} onClick={onSwitchMode}>
                            HISTORY
                        </button>
                        <button className={`${styles.headerTab} ${styles.headerTabActive}`}>
                            PLANNER
                        </button>
                    </div>
                    <button className={styles.closeBtn} onClick={onClose}>×</button>
                </div>

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

                            const isToday = key === todayKey;
                            const isSelected = key === selectedDay;
                            const examsCount = getExamsOnDay(key).length;
                            const tasksCount = getSubtasksOnDay(key).length;

                            const dayNum = parseInt(key.split('-')[2]);
                            return (
                                <motion.div key={key} whileHover={{ scale: 1.1 }}
                                    className={`${styles.dayCell} ${isToday ? styles.today : ""} ${isSelected ? styles.selectedDay : ""}`}
                                    onClick={() => {
                                        setSelectedDay(isSelected ? null : key);
                                        setSelectedExamId(null);
                                    }}
                                >
                                    <span className={styles.dayNum}>{dayNum}</span>
                                    {examsCount > 0 && <span className={styles.examDot} title={`${examsCount} Exam(s)`} />}
                                    {tasksCount > 0 && <span className={styles.taskDot} title={`${tasksCount} Study Task(s)`} />}
                                </motion.div>
                            );
                        })}
                    </div>
                )}

                {/* ── WEEK VIEW ── */}
                {view === "week" && (
                    <div className={styles.weekGrid}>
                        {weekDays.map(({ key, date }) => {
                            const isToday = key === todayKey;
                            const isSelected = key === selectedDay;
                            const examsCount = getExamsOnDay(key).length;
                            const tasksCount = getSubtasksOnDay(key).length;

                            return (
                                <motion.div key={key} whileHover={{ scale: 1.02 }}
                                    className={`${styles.weekDay} ${isToday ? styles.today : ""} ${isSelected ? styles.selectedDay : ""}`}
                                    onClick={() => {
                                        setSelectedDay(isSelected ? null : key);
                                        setSelectedExamId(null);
                                    }}
                                >
                                    <div className={styles.weekDayHeader}>
                                        <span className={styles.weekDayName}>{DAYS[date.getDay()]}</span>
                                        <span className={`${styles.weekDayNum} ${isToday ? styles.todayNum : ""}`}>{date.getDate()}</span>
                                    </div>

                                    <div className={styles.weekIndicators}>
                                        {examsCount > 0 && <div className={styles.examBadge}>{examsCount} Exam{examsCount > 1 ? 's' : ''}</div>}
                                        {tasksCount > 0 && <div className={styles.taskBadge}>{tasksCount} Study Task{tasksCount > 1 ? 's' : ''}</div>}
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
                                <span className={styles.detailDate}>
                                    {selectedExamId ? 'Exam Details' : friendlyDate(selectedDay)}
                                </span>
                                {selectedExamId && (
                                    <button
                                        className={styles.backBtn}
                                        onClick={() => setSelectedExamId(null)}
                                    >
                                        ← Back
                                    </button>
                                )}
                            </div>

                            {selectedExamId ? (
                                (() => {
                                    const exam = exams.find(e => e.id === selectedExamId);
                                    if (!exam) return <p className={styles.noData}>Exam not found.</p>;
                                    return (
                                        <div className={styles.examDetailsView}>
                                            <h3 className={styles.examDetailsTitle}>{exam.title}</h3>
                                            <p className={styles.examDetailsDate}>Scheduled for: {friendlyDate(exam.date)}</p>

                                            <div className={styles.examProgressSection}>
                                                <div className={styles.sectionLabel}>OVERALL PROGRESS</div>
                                                <label className={styles.checkboxContainer}>
                                                    <input
                                                        type="checkbox"
                                                        checked={exam.completed}
                                                        onChange={() => { GhostService.toggleExam(exam.id); refresh(); }}
                                                        className={styles.examCheckbox}
                                                    />
                                                    <span className={exam.completed ? styles.completedText : ''}>
                                                        Mark Exam as Completed
                                                    </span>
                                                </label>
                                            </div>

                                            <div className={styles.sectionLabel} style={{ marginTop: '1.5rem' }}>ALL STUDY TASKS</div>
                                            {exam.subtasks && exam.subtasks.length > 0 ? (
                                                <div className={styles.list}>
                                                    {exam.subtasks.map(task => (
                                                        <div key={task.id} className={styles.taskCard}>
                                                            <div className={styles.taskLeft}>
                                                                <label className={styles.checkboxContainer}>
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={task.completed}
                                                                        onChange={() => { GhostService.toggleExamSubtask(exam.id, task.id); refresh(); }}
                                                                        className={styles.taskCheckbox}
                                                                    />
                                                                    <span className={task.completed ? styles.completedText : ''}>
                                                                        {task.text}
                                                                    </span>
                                                                </label>
                                                                <span className={styles.taskParentBadge}>
                                                                    {new Date(task.date + 'T12:00:00').toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                                                                </span>
                                                            </div>
                                                            <button
                                                                className={styles.deleteBtn}
                                                                onClick={() => { GhostService.deleteExamSubtask(exam.id, task.id); refresh(); }}
                                                            >×</button>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className={styles.noData}>No study tasks scheduled yet.</p>
                                            )}
                                        </div>
                                    );
                                })()
                            ) : (
                                <>
                                    {!dayHasActivity(selectedDay) && (
                                        <p className={styles.noData}>Nothing planned for this date.</p>
                                    )}

                                    {/* ── EXAMS ON THIS DAY ── */}
                                    {getExamsOnDay(selectedDay).length > 0 && (
                                        <>
                                            <div className={styles.sectionLabel}>📝 EXAMS / TESTS</div>
                                            <div className={styles.list}>
                                                {getExamsOnDay(selectedDay).map(exam => (
                                                    <div key={exam.id} className={styles.examCard}>
                                                        <label className={styles.checkboxContainer}>
                                                            <input
                                                                type="checkbox"
                                                                checked={exam.completed}
                                                                onChange={() => { GhostService.toggleExam(exam.id); refresh(); }}
                                                                className={styles.examCheckbox}
                                                            />
                                                            <span
                                                                className={`${exam.completed ? styles.completedText : ''} ${styles.examClickableTitle}`}
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    setSelectedExamId(exam.id);
                                                                }}
                                                            >
                                                                {exam.title}
                                                                <span className={styles.viewMoreHint}> (View {exam.subtasks?.length || 0} tasks)</span>
                                                            </span>
                                                        </label>
                                                        <button
                                                            className={styles.deleteBtn}
                                                            onClick={() => { GhostService.deleteExam(exam.id); refresh(); }}
                                                        >×</button>
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    )}

                                    {/* ── STUDY SUBTASKS ON THIS DAY ── */}
                                    {getSubtasksOnDay(selectedDay).length > 0 && (
                                        <>
                                            <div className={styles.sectionLabel} style={{ marginTop: '1rem' }}>📚 STUDY PLAN</div>
                                            <div className={styles.list}>
                                                {getSubtasksOnDay(selectedDay).map(task => (
                                                    <div key={task.subtaskId} className={styles.taskCard}>
                                                        <div className={styles.taskLeft}>
                                                            <label className={styles.checkboxContainer}>
                                                                <input
                                                                    type="checkbox"
                                                                    checked={task.completed}
                                                                    onChange={() => { GhostService.toggleExamSubtask(task.examId, task.subtaskId); refresh(); }}
                                                                    className={styles.taskCheckbox}
                                                                />
                                                                <span className={task.completed ? styles.completedText : ''}>
                                                                    {task.text}
                                                                </span>
                                                            </label>
                                                            <span className={styles.taskParentBadge}>{task.examTitle}</span>
                                                        </div>
                                                        <button
                                                            className={styles.deleteBtn}
                                                            onClick={() => { GhostService.deleteExamSubtask(task.examId, task.subtaskId); refresh(); }}
                                                        >×</button>
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    )}

                                    {/* ── ADD NEW ITEMS ── */}
                                    <div className={styles.addSection}>
                                        <div className={styles.inputGroup}>
                                            <input
                                                type="text"
                                                className={styles.input}
                                                placeholder="+ Schedule an Exam/Test on this day..."
                                                value={newExamTitle}
                                                onChange={e => setNewExamTitle(e.target.value)}
                                                onKeyDown={e => e.key === 'Enter' && handleAddExam()}
                                            />
                                            {newExamTitle.trim() && (
                                                <button className={styles.submitBtn} onClick={handleAddExam}>Add Exam</button>
                                            )}
                                        </div>

                                        {/* Only show subtask form if there are exams to associate with */}
                                        {exams.length > 0 && (
                                            <div className={styles.subtaskForm}>
                                                <div className={styles.subtaskInputWrapper}>
                                                    <select
                                                        className={styles.examSelect}
                                                        value={selectedExamForSubtask}
                                                        onChange={e => setSelectedExamForSubtask(e.target.value)}
                                                    >
                                                        <option value="" disabled>Select related exam...</option>
                                                        {exams.map(e => (
                                                            <option key={e.id} value={e.id}>{e.title}</option>
                                                        ))}
                                                    </select>
                                                    <input
                                                        type="text"
                                                        className={styles.input}
                                                        placeholder="+ Add a study task for this day..."
                                                        value={newSubtaskText}
                                                        onChange={e => setNewSubtaskText(e.target.value)}
                                                        onKeyDown={e => e.key === 'Enter' && handleAddSubtask()}
                                                    />
                                                </div>
                                                {(newSubtaskText.trim() && selectedExamForSubtask) && (
                                                    <button className={styles.submitBtn} onClick={handleAddSubtask}>Plan Task</button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </motion.div>
    );
};
