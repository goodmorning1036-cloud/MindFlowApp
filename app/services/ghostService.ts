const STORAGE_KEY = 'mindflow_data';

export interface LevelInfo {
    level: number;
    title: string;
    currentXp: number;
    xpForNext: number | null;
    progress: number; // 0-1
    totalXp: number;
}

export const LEVELS = [
    { level: 1, title: 'Novice', xpRequired: 0 },
    { level: 2, title: 'Initiate', xpRequired: 200 },
    { level: 3, title: 'Focused', xpRequired: 500 },
    { level: 4, title: 'Driven', xpRequired: 1000 },
    { level: 5, title: 'Relentless', xpRequired: 2000 },
    { level: 6, title: 'Phantom', xpRequired: 3500 },
    { level: 7, title: 'Ascended', xpRequired: 5500 },
    { level: 8, title: 'Transcendent', xpRequired: 8000 },
    { level: 9, title: 'Mythic', xpRequired: 12000 },
    { level: 10, title: 'Eternal', xpRequired: 18000 },
    { level: 11, title: 'Zen Master', xpRequired: 26000 },
    { level: 12, title: 'Flow State Entity', xpRequired: 36000 },
    { level: 13, title: 'Time Lord', xpRequired: 50000 },
    { level: 14, title: 'Omniscient', xpRequired: 70000 },
    { level: 15, title: 'MindFlow Deity', xpRequired: 100000 },
];

export const getLevelInfo = (totalXp: number): LevelInfo => {
    let currentLevel = LEVELS[0];
    for (let i = LEVELS.length - 1; i >= 0; i--) {
        if (totalXp >= LEVELS[i].xpRequired) {
            currentLevel = LEVELS[i];
            break;
        }
    }

    const nextLevel = LEVELS.find(l => l.level === currentLevel.level + 1);
    const xpIntoLevel = totalXp - currentLevel.xpRequired;
    const xpForNext = nextLevel ? nextLevel.xpRequired - currentLevel.xpRequired : null;
    const progress = xpForNext ? Math.min(xpIntoLevel / xpForNext, 1) : 1;

    return {
        level: currentLevel.level,
        title: currentLevel.title,
        currentXp: xpIntoLevel,
        xpForNext,
        progress,
        totalXp,
    };
};

export interface SessionEntry {
    at: number;       // Unix timestamp (ms) when the session was completed
    duration: number; // ms
    subtask?: string; // what was worked on within this subject (optional context)
}

export interface TaskRecord {
    id: string;
    name: string;        // subtask label e.g. "Finish chapter 5"
    parent?: string;     // subject group e.g. "Biology" (display casing preserved)
    bestTime: number;    // in milliseconds
    history: number[];   // stored as milliseconds (legacy)
    sessions: SessionEntry[]; // timestamped sessions
    lastRunAt: number;   // timestamp
}

export interface TodoItem {
    id: string;
    text: string;
    completed: boolean;
    createdAt: number;
    timeMinutes?: number;
}

export interface CustomizationState {
    carColor: string;
    ghostType: string;
    trackTheme: string;
    safeList: string[];   // List of "allowed" app/website names
    gracePeriod: number;  // Seconds allowed away before penalty
}

export interface CalendarEntry {
    id: string;
    date: string;      // 'YYYY-MM-DD'
    taskName: string;
    duration: number;  // ms
    note?: string;
    createdAt: number;
}

export interface ExamSubtask {
    id: string;
    text: string;
    completed: boolean;
    date: string; // The date this specific subtask is planned for
}

export interface ExamEntry {
    id: string;
    date: string;      // 'YYYY-MM-DD'
    title: string;
    completed: boolean;
    subtasks: ExamSubtask[];
    createdAt: number;
}

interface StorageSchema {
    tasks: Record<string, TaskRecord>;
    todos: TodoItem[];
    fuel: number;
    totalXpEarned: number;
    unlocks: string[];
    customization: CustomizationState;
    calendarEntries: CalendarEntry[];
    exams: ExamEntry[];
}

const DEFAULT_STORAGE: StorageSchema = {
    tasks: {},
    todos: [],
    fuel: 0,
    totalXpEarned: 0,
    unlocks: ['default_cyan', 'default_ghost', 'track_cyber'],
    customization: {
        carColor: '#00E5FF',
        ghostType: 'default',
        trackTheme: 'cyber',
        safeList: ['Google Docs', 'Notion', 'Wikipedia'],
        gracePeriod: 30
    },
    calendarEntries: [],
    exams: [],
};

const getStorage = (): StorageSchema => {
    if (typeof window === 'undefined') return DEFAULT_STORAGE;

    try {
        const data = localStorage.getItem(STORAGE_KEY);
        if (!data) return DEFAULT_STORAGE;

        const parsed = JSON.parse(data);
        // Retro-compatibility / Initialization
        return {
            ...DEFAULT_STORAGE,
            ...parsed,
            tasks: parsed.tasks || {},
            todos: parsed.todos || [],
            unlocks: parsed.unlocks || DEFAULT_STORAGE.unlocks,
            calendarEntries: parsed.calendarEntries || [],
            exams: parsed.exams || [],
            customization: {
                ...DEFAULT_STORAGE.customization,
                ...(parsed.customization || {}),
            }
        };
    } catch (e) {
        console.error("Failed to read from localStorage", e);
        return DEFAULT_STORAGE;
    }
};

const saveStorage = (data: StorageSchema) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const GhostService = {
    // Storage key = subject (parent) if provided, else the task name itself
    taskKey: (name: string, parent?: string): string => {
        return (parent?.trim() || name.trim()).toLowerCase();
    },

    getTask: (taskName: string, parent?: string): TaskRecord | null => {
        const key = GhostService.taskKey(taskName, parent);
        const data = getStorage();
        return data.tasks[key] || null;
    },

    saveRun: (taskName: string, duration: number, parent?: string): { record: TaskRecord, fuelGained: number } => {
        // Key and record name are based on SUBJECT (parent) if given, else task name
        const key = GhostService.taskKey(taskName, parent);
        const recordName = parent?.trim() ? parent.trim() : taskName.trim();
        // subtask is the specific thing done inside the subject session
        const subtask = parent?.trim() ? taskName.trim() : undefined;
        const data = getStorage();

        // Calculate Fuel: 10 XP per minute (duration is in ms)
        const fuelGained = Math.floor((duration / 1000) / 60 * 10);
        data.fuel = (data.fuel || 0) + fuelGained;
        data.totalXpEarned = (data.totalXpEarned || 0) + fuelGained;

        const existing = data.tasks[key];

        const now = Date.now();
        const sessionEntry: SessionEntry = { at: now, duration, subtask };

        if (existing) {
            existing.history.push(duration);
            existing.sessions = [...(existing.sessions || []), sessionEntry];
            existing.lastRunAt = now;
            if (duration > existing.bestTime) {
                existing.bestTime = duration;
            }
            data.tasks[key] = existing;
        } else {
            data.tasks[key] = {
                id: crypto.randomUUID(),
                name: recordName,          // Subject name (e.g. "Biology")
                parent: undefined,         // subjects are top-level
                bestTime: duration,
                history: [duration],
                sessions: [sessionEntry],
                lastRunAt: now
            };
        }

        saveStorage(data);
        return { record: data.tasks[key], fuelGained };
    },

    getFuel: (): number => getStorage().fuel,

    getTotalXpEarned: (): number => getStorage().totalXpEarned || 0,

    getLevelInfo: (): LevelInfo => getLevelInfo(getStorage().totalXpEarned || 0),

    getUnlocks: (): string[] => getStorage().unlocks,

    getCustomization: (): CustomizationState => getStorage().customization,

    updateCustomization: (updates: Partial<CustomizationState>): void => {
        const data = getStorage();
        data.customization = { ...data.customization, ...updates };
        saveStorage(data);
    },

    unlockItem: (id: string, cost: number): boolean => {
        const data = getStorage();
        if (data.fuel >= cost && !data.unlocks.includes(id)) {
            data.fuel -= cost;
            data.unlocks.push(id);
            saveStorage(data);
            return true;
        }
        return false;
    },

    getAllTasks: (): TaskRecord[] => {
        const data = getStorage();
        return Object.values(data.tasks).sort((a, b) => b.lastRunAt - a.lastRunAt);
    },

    // Returns tasks grouped by parent subject. Tasks without a parent use '' as the key.
    getTaskTree: (): Record<string, TaskRecord[]> => {
        const data = getStorage();
        const tree: Record<string, TaskRecord[]> = {};
        Object.values(data.tasks)
            .sort((a, b) => b.lastRunAt - a.lastRunAt)
            .forEach(task => {
                const group = task.parent || '';
                if (!tree[group]) tree[group] = [];
                tree[group].push(task);
            });
        return tree;
    },

    deleteTask: (taskId: string): void => {
        const data = getStorage();
        // Bulletproof delete: find the exact key by matching the unique id
        const keyToDelete = Object.keys(data.tasks).find(
            key => data.tasks[key].id === taskId
        );
        if (keyToDelete) {
            delete data.tasks[keyToDelete];
            saveStorage(data);
        }
    },

    // Returns a map of dateKey ('YYYY-MM-DD') -> array of sessions across all tasks
    getSessionsByDate: (): Record<string, { taskName: string; duration: number; at: number; isManual?: boolean; id?: string; note?: string; taskId?: string }[]> => {
        const data = getStorage();
        const map: Record<string, { taskName: string; duration: number; at: number; isManual?: boolean; id?: string; note?: string; taskId?: string }[]> = {};

        // Race sessions from task history
        Object.keys(data.tasks).forEach(taskId => {
            const task = data.tasks[taskId];
            const sessions = task.sessions || [];
            sessions.forEach(s => {
                const d = new Date(s.at);
                const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
                if (!map[key]) map[key] = [];
                map[key].push({ taskName: s.subtask ? `${task.name} › ${s.subtask}` : task.name, duration: s.duration, at: s.at, taskId });
            });
            if (!task.sessions && task.lastRunAt) {
                const d = new Date(task.lastRunAt);
                const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
                if (!map[key]) map[key] = [];
                map[key].push({ taskName: task.name, duration: task.bestTime, at: task.lastRunAt, taskId });
            }
        });

        // Manual calendar entries
        (data.calendarEntries || []).forEach(entry => {
            if (!map[entry.date]) map[entry.date] = [];
            map[entry.date].push({
                taskName: entry.taskName,
                duration: entry.duration,
                at: entry.createdAt,
                isManual: true,
                id: entry.id,
                note: entry.note,
            });
        });

        return map;
    },

    // Calendar Manual Entry Methods
    addCalendarEntry: (date: string, taskName: string, durationMs: number, note?: string): CalendarEntry => {
        const data = getStorage();
        const entry: CalendarEntry = {
            id: crypto.randomUUID(),
            date,
            taskName: taskName.trim(),
            duration: durationMs,
            note: note?.trim(),
            createdAt: Date.now(),
        };
        data.calendarEntries = [...(data.calendarEntries || []), entry];
        saveStorage(data);
        return entry;
    },

    deleteCalendarEntry: (id: string): void => {
        const data = getStorage();
        data.calendarEntries = (data.calendarEntries || []).filter(e => e.id !== id);
        saveStorage(data);
    },

    deleteAppSession: (taskId: string, at: number): void => {
        const data = getStorage();
        if (data.tasks[taskId]) {
            data.tasks[taskId].sessions = (data.tasks[taskId].sessions || []).filter(s => s.at !== at);
            if (data.tasks[taskId].lastRunAt === at) {
                data.tasks[taskId].lastRunAt = 0;
            }
            saveStorage(data);
        }
    },

    getCalendarEntries: (): CalendarEntry[] => {
        return getStorage().calendarEntries || [];
    },

    // Todo Methods
    getTodos: (): TodoItem[] => {
        const data = getStorage();
        return data.todos || [];
    },

    addTodo: (text: string): TodoItem => {
        const data = getStorage();
        const newTodo: TodoItem = {
            id: crypto.randomUUID(),
            text: text.trim(),
            completed: false,
            createdAt: Date.now()
        };
        data.todos.push(newTodo);
        saveStorage(data);
        return newTodo;
    },

    toggleTodo: (id: string): void => {
        const data = getStorage();
        const todo = data.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            saveStorage(data);
        }
    },

    deleteTodo: (id: string): void => {
        const data = getStorage();
        data.todos = data.todos.filter(t => t.id !== id);
        saveStorage(data);
    },

    updateTodoTime: (id: string, timeMinutes: number | undefined): void => {
        const data = getStorage();
        const todo = data.todos.find(t => t.id === id);
        if (todo) {
            todo.timeMinutes = timeMinutes;
            saveStorage(data);
        }
    },

    // Exam / Quiz Methods
    getExams: (): ExamEntry[] => {
        const data = getStorage();
        return data.exams || [];
    },

    addExam: (title: string, date: string): ExamEntry => {
        const data = getStorage();
        const newExam: ExamEntry = {
            id: crypto.randomUUID(),
            title: title.trim(),
            date,
            completed: false,
            subtasks: [],
            createdAt: Date.now(),
        };
        data.exams = [...(data.exams || []), newExam];
        saveStorage(data);
        return newExam;
    },

    deleteExam: (id: string): void => {
        const data = getStorage();
        data.exams = (data.exams || []).filter(e => e.id !== id);
        saveStorage(data);
    },

    toggleExam: (id: string): void => {
        const data = getStorage();
        const exam = (data.exams || []).find(e => e.id === id);
        if (exam) {
            exam.completed = !exam.completed;
            saveStorage(data);
        }
    },

    addExamSubtask: (examId: string, text: string, date: string): ExamSubtask | null => {
        const data = getStorage();
        const exam = (data.exams || []).find(e => e.id === examId);
        if (exam) {
            const subtask: ExamSubtask = {
                id: crypto.randomUUID(),
                text: text.trim(),
                completed: false,
                date,
            };
            exam.subtasks = [...(exam.subtasks || []), subtask];
            saveStorage(data);
            return subtask;
        }
        return null;
    },

    toggleExamSubtask: (examId: string, subtaskId: string): void => {
        const data = getStorage();
        const exam = (data.exams || []).find(e => e.id === examId);
        if (exam && exam.subtasks) {
            const subtask = exam.subtasks.find(s => s.id === subtaskId);
            if (subtask) {
                subtask.completed = !subtask.completed;
                saveStorage(data);
            }
        }
    },

    deleteExamSubtask: (examId: string, subtaskId: string): void => {
        const data = getStorage();
        const exam = (data.exams || []).find(e => e.id === examId);
        if (exam && exam.subtasks) {
            exam.subtasks = exam.subtasks.filter(s => s.id !== subtaskId);
            saveStorage(data);
        }
    }
};
