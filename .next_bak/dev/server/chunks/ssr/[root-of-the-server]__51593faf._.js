module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/app/services/ghostService.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GhostService",
    ()=>GhostService,
    "LEVELS",
    ()=>LEVELS,
    "getLevelInfo",
    ()=>getLevelInfo
]);
const STORAGE_KEY = 'mindflow_data';
const LEVELS = [
    {
        level: 1,
        title: 'Novice',
        xpRequired: 0
    },
    {
        level: 2,
        title: 'Initiate',
        xpRequired: 200
    },
    {
        level: 3,
        title: 'Focused',
        xpRequired: 500
    },
    {
        level: 4,
        title: 'Driven',
        xpRequired: 1000
    },
    {
        level: 5,
        title: 'Relentless',
        xpRequired: 2000
    },
    {
        level: 6,
        title: 'Phantom',
        xpRequired: 3500
    },
    {
        level: 7,
        title: 'Ascended',
        xpRequired: 5500
    },
    {
        level: 8,
        title: 'Transcendent',
        xpRequired: 8000
    },
    {
        level: 9,
        title: 'Mythic',
        xpRequired: 12000
    },
    {
        level: 10,
        title: 'Eternal',
        xpRequired: 18000
    },
    {
        level: 11,
        title: 'Zen Master',
        xpRequired: 26000
    },
    {
        level: 12,
        title: 'Flow State Entity',
        xpRequired: 36000
    },
    {
        level: 13,
        title: 'Time Lord',
        xpRequired: 50000
    },
    {
        level: 14,
        title: 'Omniscient',
        xpRequired: 70000
    },
    {
        level: 15,
        title: 'MindFlow Deity',
        xpRequired: 100000
    }
];
const getLevelInfo = (totalXp)=>{
    let currentLevel = LEVELS[0];
    for(let i = LEVELS.length - 1; i >= 0; i--){
        if (totalXp >= LEVELS[i].xpRequired) {
            currentLevel = LEVELS[i];
            break;
        }
    }
    const nextLevel = LEVELS.find((l)=>l.level === currentLevel.level + 1);
    const xpIntoLevel = totalXp - currentLevel.xpRequired;
    const xpForNext = nextLevel ? nextLevel.xpRequired - currentLevel.xpRequired : null;
    const progress = xpForNext ? Math.min(xpIntoLevel / xpForNext, 1) : 1;
    return {
        level: currentLevel.level,
        title: currentLevel.title,
        currentXp: xpIntoLevel,
        xpForNext,
        progress,
        totalXp
    };
};
const DEFAULT_STORAGE = {
    tasks: {},
    todos: [],
    fuel: 0,
    totalXpEarned: 0,
    unlocks: [
        'default_cyan',
        'default_ghost',
        'track_cyber'
    ],
    customization: {
        carColor: '#00E5FF',
        ghostType: 'default',
        trackTheme: 'cyber'
    },
    calendarEntries: [],
    exams: []
};
const getStorage = ()=>{
    if ("TURBOPACK compile-time truthy", 1) return DEFAULT_STORAGE;
    //TURBOPACK unreachable
    ;
};
const saveStorage = (data)=>{
    if ("TURBOPACK compile-time truthy", 1) return;
    //TURBOPACK unreachable
    ;
};
const GhostService = {
    // Storage key = subject (parent) if provided, else the task name itself
    taskKey: (name, parent)=>{
        return (parent?.trim() || name.trim()).toLowerCase();
    },
    getTask: (taskName, parent)=>{
        const key = GhostService.taskKey(taskName, parent);
        const data = getStorage();
        return data.tasks[key] || null;
    },
    saveRun: (taskName, duration, parent)=>{
        // Key and record name are based on SUBJECT (parent) if given, else task name
        const key = GhostService.taskKey(taskName, parent);
        const recordName = parent?.trim() ? parent.trim() : taskName.trim();
        // subtask is the specific thing done inside the subject session
        const subtask = parent?.trim() ? taskName.trim() : undefined;
        const data = getStorage();
        // Calculate Fuel: 10 XP per minute (duration is in ms)
        const fuelGained = Math.floor(duration / 1000 / 60 * 10);
        data.fuel = (data.fuel || 0) + fuelGained;
        data.totalXpEarned = (data.totalXpEarned || 0) + fuelGained;
        const existing = data.tasks[key];
        const now = Date.now();
        const sessionEntry = {
            at: now,
            duration,
            subtask
        };
        if (existing) {
            existing.history.push(duration);
            existing.sessions = [
                ...existing.sessions || [],
                sessionEntry
            ];
            existing.lastRunAt = now;
            if (duration > existing.bestTime) {
                existing.bestTime = duration;
            }
            data.tasks[key] = existing;
        } else {
            data.tasks[key] = {
                id: crypto.randomUUID(),
                name: recordName,
                parent: undefined,
                bestTime: duration,
                history: [
                    duration
                ],
                sessions: [
                    sessionEntry
                ],
                lastRunAt: now
            };
        }
        saveStorage(data);
        return {
            record: data.tasks[key],
            fuelGained
        };
    },
    getFuel: ()=>getStorage().fuel,
    getTotalXpEarned: ()=>getStorage().totalXpEarned || 0,
    getLevelInfo: ()=>getLevelInfo(getStorage().totalXpEarned || 0),
    getUnlocks: ()=>getStorage().unlocks,
    getCustomization: ()=>getStorage().customization,
    updateCustomization: (updates)=>{
        const data = getStorage();
        data.customization = {
            ...data.customization,
            ...updates
        };
        saveStorage(data);
    },
    unlockItem: (id, cost)=>{
        const data = getStorage();
        if (data.fuel >= cost && !data.unlocks.includes(id)) {
            data.fuel -= cost;
            data.unlocks.push(id);
            saveStorage(data);
            return true;
        }
        return false;
    },
    getAllTasks: ()=>{
        const data = getStorage();
        return Object.values(data.tasks).sort((a, b)=>b.lastRunAt - a.lastRunAt);
    },
    // Returns tasks grouped by parent subject. Tasks without a parent use '' as the key.
    getTaskTree: ()=>{
        const data = getStorage();
        const tree = {};
        Object.values(data.tasks).sort((a, b)=>b.lastRunAt - a.lastRunAt).forEach((task)=>{
            const group = task.parent || '';
            if (!tree[group]) tree[group] = [];
            tree[group].push(task);
        });
        return tree;
    },
    deleteTask: (taskId)=>{
        const data = getStorage();
        // Bulletproof delete: find the exact key by matching the unique id
        const keyToDelete = Object.keys(data.tasks).find((key)=>data.tasks[key].id === taskId);
        if (keyToDelete) {
            delete data.tasks[keyToDelete];
            saveStorage(data);
        }
    },
    // Returns a map of dateKey ('YYYY-MM-DD') -> array of sessions across all tasks
    getSessionsByDate: ()=>{
        const data = getStorage();
        const map = {};
        // Race sessions from task history
        Object.keys(data.tasks).forEach((taskId)=>{
            const task = data.tasks[taskId];
            const sessions = task.sessions || [];
            sessions.forEach((s)=>{
                const d = new Date(s.at);
                const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
                if (!map[key]) map[key] = [];
                map[key].push({
                    taskName: s.subtask ? `${task.name} › ${s.subtask}` : task.name,
                    duration: s.duration,
                    at: s.at,
                    taskId
                });
            });
            if (!task.sessions && task.lastRunAt) {
                const d = new Date(task.lastRunAt);
                const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
                if (!map[key]) map[key] = [];
                map[key].push({
                    taskName: task.name,
                    duration: task.bestTime,
                    at: task.lastRunAt,
                    taskId
                });
            }
        });
        // Manual calendar entries
        (data.calendarEntries || []).forEach((entry)=>{
            if (!map[entry.date]) map[entry.date] = [];
            map[entry.date].push({
                taskName: entry.taskName,
                duration: entry.duration,
                at: entry.createdAt,
                isManual: true,
                id: entry.id,
                note: entry.note
            });
        });
        return map;
    },
    // Calendar Manual Entry Methods
    addCalendarEntry: (date, taskName, durationMs, note)=>{
        const data = getStorage();
        const entry = {
            id: crypto.randomUUID(),
            date,
            taskName: taskName.trim(),
            duration: durationMs,
            note: note?.trim(),
            createdAt: Date.now()
        };
        data.calendarEntries = [
            ...data.calendarEntries || [],
            entry
        ];
        saveStorage(data);
        return entry;
    },
    deleteCalendarEntry: (id)=>{
        const data = getStorage();
        data.calendarEntries = (data.calendarEntries || []).filter((e)=>e.id !== id);
        saveStorage(data);
    },
    deleteAppSession: (taskId, at)=>{
        const data = getStorage();
        if (data.tasks[taskId]) {
            data.tasks[taskId].sessions = (data.tasks[taskId].sessions || []).filter((s)=>s.at !== at);
            if (data.tasks[taskId].lastRunAt === at) {
                data.tasks[taskId].lastRunAt = 0;
            }
            saveStorage(data);
        }
    },
    getCalendarEntries: ()=>{
        return getStorage().calendarEntries || [];
    },
    // Todo Methods
    getTodos: ()=>{
        const data = getStorage();
        return data.todos || [];
    },
    addTodo: (text)=>{
        const data = getStorage();
        const newTodo = {
            id: crypto.randomUUID(),
            text: text.trim(),
            completed: false,
            createdAt: Date.now()
        };
        data.todos.push(newTodo);
        saveStorage(data);
        return newTodo;
    },
    toggleTodo: (id)=>{
        const data = getStorage();
        const todo = data.todos.find((t)=>t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            saveStorage(data);
        }
    },
    deleteTodo: (id)=>{
        const data = getStorage();
        data.todos = data.todos.filter((t)=>t.id !== id);
        saveStorage(data);
    },
    updateTodoTime: (id, timeMinutes)=>{
        const data = getStorage();
        const todo = data.todos.find((t)=>t.id === id);
        if (todo) {
            todo.timeMinutes = timeMinutes;
            saveStorage(data);
        }
    },
    // Exam / Quiz Methods
    getExams: ()=>{
        const data = getStorage();
        return data.exams || [];
    },
    addExam: (title, date)=>{
        const data = getStorage();
        const newExam = {
            id: crypto.randomUUID(),
            title: title.trim(),
            date,
            completed: false,
            subtasks: [],
            createdAt: Date.now()
        };
        data.exams = [
            ...data.exams || [],
            newExam
        ];
        saveStorage(data);
        return newExam;
    },
    deleteExam: (id)=>{
        const data = getStorage();
        data.exams = (data.exams || []).filter((e)=>e.id !== id);
        saveStorage(data);
    },
    toggleExam: (id)=>{
        const data = getStorage();
        const exam = (data.exams || []).find((e)=>e.id === id);
        if (exam) {
            exam.completed = !exam.completed;
            saveStorage(data);
        }
    },
    addExamSubtask: (examId, text, date)=>{
        const data = getStorage();
        const exam = (data.exams || []).find((e)=>e.id === examId);
        if (exam) {
            const subtask = {
                id: crypto.randomUUID(),
                text: text.trim(),
                completed: false,
                date
            };
            exam.subtasks = [
                ...exam.subtasks || [],
                subtask
            ];
            saveStorage(data);
            return subtask;
        }
        return null;
    },
    toggleExamSubtask: (examId, subtaskId)=>{
        const data = getStorage();
        const exam = (data.exams || []).find((e)=>e.id === examId);
        if (exam && exam.subtasks) {
            const subtask = exam.subtasks.find((s)=>s.id === subtaskId);
            if (subtask) {
                subtask.completed = !subtask.completed;
                saveStorage(data);
            }
        }
    },
    deleteExamSubtask: (examId, subtaskId)=>{
        const data = getStorage();
        const exam = (data.exams || []).find((e)=>e.id === examId);
        if (exam && exam.subtasks) {
            exam.subtasks = exam.subtasks.filter((s)=>s.id !== subtaskId);
            saveStorage(data);
        }
    }
};
}),
"[project]/app/components/TaskInput.module.css [app-ssr] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "container": "TaskInput-module__BPxeiW__container",
  "deleteTaskBtn": "TaskInput-module__BPxeiW__deleteTaskBtn",
  "fadeIn": "TaskInput-module__BPxeiW__fadeIn",
  "form": "TaskInput-module__BPxeiW__form",
  "input": "TaskInput-module__BPxeiW__input",
  "inputGroup": "TaskInput-module__BPxeiW__inputGroup",
  "recentSection": "TaskInput-module__BPxeiW__recentSection",
  "recentTitle": "TaskInput-module__BPxeiW__recentTitle",
  "submitBtn": "TaskInput-module__BPxeiW__submitBtn",
  "subtaskArrow": "TaskInput-module__BPxeiW__subtaskArrow",
  "subtaskInput": "TaskInput-module__BPxeiW__subtaskInput",
  "subtaskRow": "TaskInput-module__BPxeiW__subtaskRow",
  "taskChip": "TaskInput-module__BPxeiW__taskChip",
  "taskList": "TaskInput-module__BPxeiW__taskList",
  "taskTime": "TaskInput-module__BPxeiW__taskTime",
  "timeInput": "TaskInput-module__BPxeiW__timeInput",
  "timeInputWrapper": "TaskInput-module__BPxeiW__timeInputWrapper",
  "timeLabel": "TaskInput-module__BPxeiW__timeLabel",
});
}),
"[project]/app/components/TaskInput.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TaskInput",
    ()=>TaskInput
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$ghostService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/services/ghostService.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$TaskInput$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/app/components/TaskInput.module.css [app-ssr] (css module)");
;
;
;
;
;
const TaskInput = ({ onStart })=>{
    const [subject, setSubject] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(''); // PRIMARY — e.g. "Biology" (ghost time saved here)
    const [subtask, setSubtask] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(''); // CONTEXT — e.g. "Finish chapter 5" (logged per session)
    const [targetTimeStr, setTargetTimeStr] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [allTasks, setAllTasks] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const canStart = subject.trim().length > 0;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        setAllTasks(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$ghostService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GhostService"].getAllTasks());
    }, []);
    const parseTimeInput = (input)=>{
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
    const handleSubmit = (e)=>{
        e?.preventDefault();
        if (!canStart) return;
        const parsedMinutes = parseTimeInput(targetTimeStr);
        // parent = undefined because subject IS the top-level identifier
        // subtask is passed as taskName, subject as parent — but for ghost lookup, use subject key
        const subtaskVal = subtask.trim() || undefined;
        if (parsedMinutes !== null && parsedMinutes > 0) {
            onStart(subtaskVal || subject.trim(), parsedMinutes * 60 * 1000, subject.trim());
        } else {
            // Auto-load ghost time from subject record
            const record = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$ghostService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GhostService"].getTask(subject.trim());
            const ghost = record?.bestTime || undefined;
            onStart(subtaskVal || subject.trim(), ghost, subject.trim());
        }
    };
    // Click a recent chip — fill in the subject and load its ghost time
    const handleRecentClick = (record)=>{
        setSubject(record.name);
        setSubtask('');
        if (record.bestTime) {
            setTargetTimeStr(Math.round(record.bestTime / 60000).toString());
        } else {
            setTargetTimeStr('');
        }
    };
    const handleDeleteTask = (e, record)=>{
        e.stopPropagation();
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$ghostService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GhostService"].deleteTask(record.id);
        setAllTasks(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$ghostService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GhostService"].getAllTasks());
    };
    const formatDuration = (ms)=>{
        const minutes = Math.floor(ms / 60000);
        if (minutes < 60) return `${minutes}m`;
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        return m > 0 ? `${h}h ${m}m` : `${h}h`;
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$TaskInput$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].container,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                onSubmit: handleSubmit,
                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$TaskInput$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].form,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$TaskInput$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].inputGroup,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "text",
                                value: subject,
                                onChange: (e)=>{
                                    setSubject(e.target.value);
                                    // Auto-load ghost time from matching record
                                    const rec = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$ghostService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GhostService"].getTask(e.target.value.trim());
                                    if (rec?.bestTime) {
                                        setTargetTimeStr(Math.round(rec.bestTime / 60000).toString());
                                    } else if (!targetTimeStr || rec === null) {
                                        setTargetTimeStr('');
                                    }
                                },
                                placeholder: "What are you focusing on?",
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$TaskInput$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].input,
                                autoFocus: true,
                                list: "subject-suggestions"
                            }, void 0, false, {
                                fileName: "[project]/app/components/TaskInput.tsx",
                                lineNumber: 84,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("datalist", {
                                id: "subject-suggestions",
                                children: allTasks.map((t)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                        value: t.name
                                    }, t.id, false, {
                                        fileName: "[project]/app/components/TaskInput.tsx",
                                        lineNumber: 104,
                                        columnNumber: 29
                                    }, ("TURBOPACK compile-time value", void 0)))
                            }, void 0, false, {
                                fileName: "[project]/app/components/TaskInput.tsx",
                                lineNumber: 102,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                                children: canStart && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$TaskInput$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].subtaskRow,
                                    initial: {
                                        opacity: 0,
                                        height: 0
                                    },
                                    animate: {
                                        opacity: 1,
                                        height: 'auto'
                                    },
                                    exit: {
                                        opacity: 0,
                                        height: 0
                                    },
                                    transition: {
                                        duration: 0.25
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$TaskInput$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].subtaskArrow,
                                            children: "›"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/TaskInput.tsx",
                                            lineNumber: 118,
                                            columnNumber: 33
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "text",
                                            value: subtask,
                                            onChange: (e)=>setSubtask(e.target.value),
                                            placeholder: "Subtask (optional, e.g. Finish chapter 5)",
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$TaskInput$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].subtaskInput
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/TaskInput.tsx",
                                            lineNumber: 119,
                                            columnNumber: 33
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/TaskInput.tsx",
                                    lineNumber: 111,
                                    columnNumber: 29
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/app/components/TaskInput.tsx",
                                lineNumber: 109,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$TaskInput$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].timeInputWrapper,
                                initial: {
                                    opacity: 0
                                },
                                animate: {
                                    opacity: canStart ? 1 : 0.4
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$TaskInput$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].timeLabel,
                                        children: "Ghost Target:"
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/TaskInput.tsx",
                                        lineNumber: 136,
                                        columnNumber: 25
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "text",
                                        value: targetTimeStr,
                                        onChange: (e)=>setTargetTimeStr(e.target.value),
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$TaskInput$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].timeInput,
                                        placeholder: "∞"
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/TaskInput.tsx",
                                        lineNumber: 137,
                                        columnNumber: 25
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/TaskInput.tsx",
                                lineNumber: 131,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/TaskInput.tsx",
                        lineNumber: 81,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].button, {
                        type: "submit",
                        disabled: !canStart,
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$TaskInput$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].submitBtn,
                        animate: {
                            scale: canStart ? [
                                1,
                                1.05,
                                1
                            ] : 1,
                            boxShadow: canStart ? [
                                "0 0 20px rgba(0, 229, 255, 0.4), 0 0 50px rgba(0, 229, 255, 0.2), inset 0 0 20px rgba(0, 229, 255, 0.1)",
                                "0 0 40px rgba(0, 229, 255, 0.6), 0 0 80px rgba(0, 229, 255, 0.3), inset 0 0 30px rgba(0, 229, 255, 0.2)",
                                "0 0 20px rgba(0, 229, 255, 0.4), 0 0 50px rgba(0, 229, 255, 0.2), inset 0 0 20px rgba(0, 229, 255, 0.1)"
                            ] : "none"
                        },
                        transition: {
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut"
                        },
                        whileHover: {
                            scale: 1.1
                        },
                        whileTap: {
                            scale: 0.95
                        },
                        children: "GO"
                    }, void 0, false, {
                        fileName: "[project]/app/components/TaskInput.tsx",
                        lineNumber: 147,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/TaskInput.tsx",
                lineNumber: 80,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                children: allTasks.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$TaskInput$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].recentSection,
                    initial: {
                        opacity: 0,
                        y: 10
                    },
                    animate: {
                        opacity: 1,
                        y: 0
                    },
                    exit: {
                        opacity: 0,
                        y: -10
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$TaskInput$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].recentTitle,
                            children: "Resume Flow"
                        }, void 0, false, {
                            fileName: "[project]/app/components/TaskInput.tsx",
                            lineNumber: 176,
                            columnNumber: 25
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$TaskInput$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].taskList,
                            children: allTasks.slice(0, 6).map((t)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$TaskInput$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].taskChip,
                                    onClick: ()=>handleRecentClick(t),
                                    whileHover: {
                                        scale: 1.05
                                    },
                                    whileTap: {
                                        scale: 0.98
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: t.name
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/TaskInput.tsx",
                                            lineNumber: 186,
                                            columnNumber: 37
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        t.bestTime > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$TaskInput$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].taskTime,
                                            children: formatDuration(t.bestTime)
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/TaskInput.tsx",
                                            lineNumber: 188,
                                            columnNumber: 41
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$TaskInput$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].deleteTaskBtn,
                                            onClick: (e)=>handleDeleteTask(e, t),
                                            title: "Delete",
                                            children: "✕"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/TaskInput.tsx",
                                            lineNumber: 192,
                                            columnNumber: 37
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, t.id, true, {
                                    fileName: "[project]/app/components/TaskInput.tsx",
                                    lineNumber: 179,
                                    columnNumber: 33
                                }, ("TURBOPACK compile-time value", void 0)))
                        }, void 0, false, {
                            fileName: "[project]/app/components/TaskInput.tsx",
                            lineNumber: 177,
                            columnNumber: 25
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/TaskInput.tsx",
                    lineNumber: 170,
                    columnNumber: 21
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/app/components/TaskInput.tsx",
                lineNumber: 168,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/TaskInput.tsx",
        lineNumber: 79,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
}),
"[project]/app/components/TodoList.module.css [app-ssr] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "actions": "TodoList-module__miUY6G__actions",
  "addButton": "TodoList-module__miUY6G__addButton",
  "check": "TodoList-module__miUY6G__check",
  "checkbox": "TodoList-module__miUY6G__checkbox",
  "completed": "TodoList-module__miUY6G__completed",
  "deleteButton": "TodoList-module__miUY6G__deleteButton",
  "iconButton": "TodoList-module__miUY6G__iconButton",
  "input": "TodoList-module__miUY6G__input",
  "inputGroup": "TodoList-module__miUY6G__inputGroup",
  "raceButton": "TodoList-module__miUY6G__raceButton",
  "text": "TodoList-module__miUY6G__text",
  "timeBadge": "TodoList-module__miUY6G__timeBadge",
  "timeButton": "TodoList-module__miUY6G__timeButton",
  "timeEditor": "TodoList-module__miUY6G__timeEditor",
  "timeEditorInput": "TodoList-module__miUY6G__timeEditorInput",
  "timeEditorLabel": "TodoList-module__miUY6G__timeEditorLabel",
  "todoContainer": "TodoList-module__miUY6G__todoContainer",
  "todoItem": "TodoList-module__miUY6G__todoItem",
  "todoList": "TodoList-module__miUY6G__todoList",
});
}),
"[project]/app/components/TodoList.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TodoList",
    ()=>TodoList
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$ghostService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/services/ghostService.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$TodoList$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/app/components/TodoList.module.css [app-ssr] (css module)");
"use client";
;
;
;
;
;
const TodoList = ({ onStartRace })=>{
    const [todos, setTodos] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [inputValue, setInputValue] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [editingTimeId, setEditingTimeId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [timeInputValue, setTimeInputValue] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const inputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const timeInputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        setTodos(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$ghostService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GhostService"].getTodos());
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (editingTimeId && timeInputRef.current) {
            timeInputRef.current.focus();
        }
    }, [
        editingTimeId
    ]);
    const handleAddTodo = (e)=>{
        if (e) e.preventDefault();
        if (!inputValue.trim()) return;
        const newTodo = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$ghostService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GhostService"].addTodo(inputValue);
        setTodos([
            ...todos,
            newTodo
        ]);
        setInputValue("");
    };
    const handleToggleTodo = (id)=>{
        if (editingTimeId === id) return; // Don't toggle while editing time
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$ghostService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GhostService"].toggleTodo(id);
        setTodos(todos.map((t)=>t.id === id ? {
                ...t,
                completed: !t.completed
            } : t));
    };
    const handleDeleteTodo = (id, e)=>{
        e.stopPropagation();
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$ghostService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GhostService"].deleteTodo(id);
        setTodos(todos.filter((t)=>t.id !== id));
    };
    const handleStartFromTodo = (todo, e)=>{
        e.stopPropagation();
        const durationMs = todo.timeMinutes ? todo.timeMinutes * 60 * 1000 : undefined;
        onStartRace(todo.text, durationMs);
    };
    const handleOpenTimeEdit = (todo, e)=>{
        e.stopPropagation();
        setEditingTimeId(todo.id);
        setTimeInputValue(todo.timeMinutes ? String(todo.timeMinutes) : "");
    };
    const handleSaveTime = (id)=>{
        const minutes = parseInt(timeInputValue, 10);
        const validMinutes = !isNaN(minutes) && minutes > 0 ? minutes : undefined;
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$ghostService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GhostService"].updateTodoTime(id, validMinutes);
        setTodos(todos.map((t)=>t.id === id ? {
                ...t,
                timeMinutes: validMinutes
            } : t));
        setEditingTimeId(null);
        setTimeInputValue("");
    };
    const handleTimeKeyDown = (id, e)=>{
        if (e.key === "Enter") {
            e.preventDefault();
            handleSaveTime(id);
        } else if (e.key === "Escape") {
            setEditingTimeId(null);
            setTimeInputValue("");
        }
    };
    const formatMinutes = (min)=>{
        if (min < 60) return `${min}m`;
        const h = Math.floor(min / 60);
        const m = min % 60;
        return m > 0 ? `${h}h ${m}m` : `${h}h`;
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$TodoList$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].todoContainer,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$TodoList$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].inputGroup,
                onSubmit: handleAddTodo,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        ref: inputRef,
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$TodoList$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].input,
                        placeholder: "Add a quick task...",
                        value: inputValue,
                        onChange: (e)=>setInputValue(e.target.value)
                    }, void 0, false, {
                        fileName: "[project]/app/components/TodoList.tsx",
                        lineNumber: 92,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "submit",
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$TodoList$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].addButton,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            width: "20",
                            height: "20",
                            viewBox: "0 0 24 24",
                            fill: "none",
                            stroke: "currentColor",
                            strokeWidth: "2.5",
                            strokeLinecap: "round",
                            strokeLinejoin: "round",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                    x1: "12",
                                    y1: "5",
                                    x2: "12",
                                    y2: "19"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/TodoList.tsx",
                                    lineNumber: 101,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                    x1: "5",
                                    y1: "12",
                                    x2: "19",
                                    y2: "12"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/TodoList.tsx",
                                    lineNumber: 102,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/TodoList.tsx",
                            lineNumber: 100,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/app/components/TodoList.tsx",
                        lineNumber: 99,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/TodoList.tsx",
                lineNumber: 91,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$TodoList$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].todoList,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                    initial: false,
                    children: todos.map((todo)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                            layout: true,
                            initial: {
                                opacity: 0,
                                scale: 0.9,
                                y: 10
                            },
                            animate: {
                                opacity: 1,
                                scale: 1,
                                y: 0
                            },
                            exit: {
                                opacity: 0,
                                scale: 0.8,
                                x: -20
                            },
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$TodoList$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].todoItem,
                            onClick: ()=>handleToggleTodo(todo.id),
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: `${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$TodoList$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].checkbox} ${todo.completed ? __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$TodoList$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].completed : ""}`,
                                    children: todo.completed && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$TodoList$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].check
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/TodoList.tsx",
                                        lineNumber: 120,
                                        columnNumber: 52
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/app/components/TodoList.tsx",
                                    lineNumber: 119,
                                    columnNumber: 29
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: `${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$TodoList$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].text} ${todo.completed ? __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$TodoList$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].completed : ""}`,
                                    children: todo.text
                                }, void 0, false, {
                                    fileName: "[project]/app/components/TodoList.tsx",
                                    lineNumber: 122,
                                    columnNumber: 29
                                }, ("TURBOPACK compile-time value", void 0)),
                                editingTimeId === todo.id ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$TodoList$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].timeEditor,
                                    onClick: (e)=>e.stopPropagation(),
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            ref: timeInputRef,
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$TodoList$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].timeEditorInput,
                                            type: "number",
                                            min: "1",
                                            placeholder: "min",
                                            value: timeInputValue,
                                            onChange: (e)=>setTimeInputValue(e.target.value),
                                            onKeyDown: (e)=>handleTimeKeyDown(todo.id, e),
                                            onBlur: ()=>handleSaveTime(todo.id)
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/TodoList.tsx",
                                            lineNumber: 129,
                                            columnNumber: 37
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$TodoList$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].timeEditorLabel,
                                            children: "min"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/TodoList.tsx",
                                            lineNumber: 140,
                                            columnNumber: 37
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/TodoList.tsx",
                                    lineNumber: 128,
                                    columnNumber: 33
                                }, ("TURBOPACK compile-time value", void 0)) : todo.timeMinutes ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$TodoList$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].timeBadge,
                                    onClick: (e)=>handleOpenTimeEdit(todo, e),
                                    title: "Click to edit time",
                                    children: formatMinutes(todo.timeMinutes)
                                }, void 0, false, {
                                    fileName: "[project]/app/components/TodoList.tsx",
                                    lineNumber: 143,
                                    columnNumber: 33
                                }, ("TURBOPACK compile-time value", void 0)) : null,
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$TodoList$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].actions,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            className: `${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$TodoList$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].iconButton} ${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$TodoList$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].timeButton}`,
                                            onClick: (e)=>handleOpenTimeEdit(todo, e),
                                            title: "Set time",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                width: "14",
                                                height: "14",
                                                viewBox: "0 0 24 24",
                                                fill: "none",
                                                stroke: "currentColor",
                                                strokeWidth: "2.5",
                                                strokeLinecap: "round",
                                                strokeLinejoin: "round",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                                        cx: "12",
                                                        cy: "12",
                                                        r: "10"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/TodoList.tsx",
                                                        lineNumber: 160,
                                                        columnNumber: 41
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                                                        points: "12 6 12 12 16 14"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/TodoList.tsx",
                                                        lineNumber: 161,
                                                        columnNumber: 41
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/components/TodoList.tsx",
                                                lineNumber: 159,
                                                columnNumber: 37
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/TodoList.tsx",
                                            lineNumber: 154,
                                            columnNumber: 33
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            className: `${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$TodoList$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].iconButton} ${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$TodoList$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].raceButton}`,
                                            onClick: (e)=>handleStartFromTodo(todo, e),
                                            title: "Start Race",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                width: "14",
                                                height: "14",
                                                viewBox: "0 0 24 24",
                                                fill: "none",
                                                stroke: "currentColor",
                                                strokeWidth: "2.5",
                                                strokeLinecap: "round",
                                                strokeLinejoin: "round",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("polygon", {
                                                    points: "5 3 19 12 5 21 5 3"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/TodoList.tsx",
                                                    lineNumber: 170,
                                                    columnNumber: 41
                                                }, ("TURBOPACK compile-time value", void 0))
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/TodoList.tsx",
                                                lineNumber: 169,
                                                columnNumber: 37
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/TodoList.tsx",
                                            lineNumber: 164,
                                            columnNumber: 33
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            className: `${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$TodoList$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].iconButton} ${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$TodoList$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].deleteButton}`,
                                            onClick: (e)=>handleDeleteTodo(todo.id, e),
                                            title: "Delete",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                width: "14",
                                                height: "14",
                                                viewBox: "0 0 24 24",
                                                fill: "none",
                                                stroke: "currentColor",
                                                strokeWidth: "2.5",
                                                strokeLinecap: "round",
                                                strokeLinejoin: "round",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                                                        points: "3 6 5 6 21 6"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/TodoList.tsx",
                                                        lineNumber: 179,
                                                        columnNumber: 41
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                        d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/TodoList.tsx",
                                                        lineNumber: 180,
                                                        columnNumber: 41
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/components/TodoList.tsx",
                                                lineNumber: 178,
                                                columnNumber: 37
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/TodoList.tsx",
                                            lineNumber: 173,
                                            columnNumber: 33
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/TodoList.tsx",
                                    lineNumber: 152,
                                    columnNumber: 29
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, todo.id, true, {
                            fileName: "[project]/app/components/TodoList.tsx",
                            lineNumber: 110,
                            columnNumber: 25
                        }, ("TURBOPACK compile-time value", void 0)))
                }, void 0, false, {
                    fileName: "[project]/app/components/TodoList.tsx",
                    lineNumber: 108,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/app/components/TodoList.tsx",
                lineNumber: 107,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/TodoList.tsx",
        lineNumber: 90,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
}),
"[project]/app/components/NoiseMixer.module.css [app-ssr] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "active": "NoiseMixer-module__54vQjG__active",
  "container": "NoiseMixer-module__54vQjG__container",
  "header": "NoiseMixer-module__54vQjG__header",
  "icon": "NoiseMixer-module__54vQjG__icon",
  "label": "NoiseMixer-module__54vQjG__label",
  "optionButton": "NoiseMixer-module__54vQjG__optionButton",
  "optionsGrid": "NoiseMixer-module__54vQjG__optionsGrid",
  "range": "NoiseMixer-module__54vQjG__range",
  "title": "NoiseMixer-module__54vQjG__title",
  "volumeControl": "NoiseMixer-module__54vQjG__volumeControl",
});
}),
"[project]/app/components/NoiseMixer.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "NoiseMixer",
    ()=>NoiseMixer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$NoiseMixer$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/app/components/NoiseMixer.module.css [app-ssr] (css module)");
"use client";
;
;
;
const NoiseMixer = ({ isRacing })=>{
    const [activeNoise, setActiveNoise] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("none");
    const [volume, setVolume] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0.3);
    const audioContextRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const sourceNodeRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const gainNodeRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const noiseTypes = [
        {
            id: "none",
            label: "Silent",
            icon: "🔇"
        },
        {
            id: "white",
            label: "White",
            icon: "🔲"
        },
        {
            id: "pink",
            label: "Pink",
            icon: "🌸"
        },
        {
            id: "brown",
            label: "Brown",
            icon: "🪵"
        },
        {
            id: "rain",
            label: "Rain",
            icon: "🌧️"
        }
    ];
    const createNoiseBuffer = (type)=>{
        if (!audioContextRef.current) return null;
        const bufferSize = 2 * audioContextRef.current.sampleRate;
        const buffer = audioContextRef.current.createBuffer(1, bufferSize, audioContextRef.current.sampleRate);
        const output = buffer.getChannelData(0);
        if (type === "white") {
            for(let i = 0; i < bufferSize; i++){
                output[i] = Math.random() * 2 - 1;
            }
        } else if (type === "pink") {
            let b0, b1, b2, b3, b4, b5, b6;
            b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0.0;
            for(let i = 0; i < bufferSize; i++){
                const white = Math.random() * 2 - 1;
                b0 = 0.99886 * b0 + white * 0.0555179;
                b1 = 0.99332 * b1 + white * 0.0750759;
                b2 = 0.96900 * b2 + white * 0.1538520;
                b3 = 0.86650 * b3 + white * 0.3104856;
                b4 = 0.55000 * b4 + white * 0.5329522;
                b5 = -0.7616 * b5 - white * 0.0168980;
                output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
                output[i] *= 0.11; // (roughly) compensate for gain
                b6 = white * 0.115926;
            }
        } else if (type === "brown") {
            let lastOut = 0.0;
            for(let i = 0; i < bufferSize; i++){
                const white = Math.random() * 2 - 1;
                output[i] = (lastOut + 0.02 * white) / 1.02;
                lastOut = output[i];
                output[i] *= 3.5; // (roughly) compensate for gain
            }
        } else if (type === "rain") {
            // Pseudo-rain: filtered pink noise with "droplets"
            let b0, b1, b2, b3, b4, b5, b6;
            b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0.0;
            for(let i = 0; i < bufferSize; i++){
                const white = Math.random() * 2 - 1;
                b0 = 0.99886 * b0 + white * 0.0555179;
                b1 = 0.99332 * b1 + white * 0.0750759;
                b2 = 0.96900 * b2 + white * 0.1538520;
                b3 = 0.86650 * b3 + white * 0.3104856;
                b4 = 0.55000 * b4 + white * 0.5329522;
                b5 = -0.7616 * b5 - white * 0.0168980;
                let val = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
                val *= 0.11;
                b6 = white * 0.115926;
                // Add some random "droplets"
                if (Math.random() > 0.999) {
                    val += Math.random() * 0.5;
                }
                output[i] = val;
            }
        }
        return buffer;
    };
    const stopNoise = ()=>{
        if (sourceNodeRef.current) {
            sourceNodeRef.current.stop();
            sourceNodeRef.current.disconnect();
            sourceNodeRef.current = null;
        }
    };
    const playNoise = (type)=>{
        stopNoise();
        if (type === "none") return;
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioContextRef.current.state === "suspended") {
            audioContextRef.current.resume();
        }
        const buffer = createNoiseBuffer(type);
        if (!buffer) return;
        const source = audioContextRef.current.createBufferSource();
        source.buffer = buffer;
        source.loop = true;
        if (!gainNodeRef.current) {
            gainNodeRef.current = audioContextRef.current.createGain();
            gainNodeRef.current.connect(audioContextRef.current.destination);
        }
        gainNodeRef.current.gain.setValueAtTime(volume, audioContextRef.current.currentTime);
        source.connect(gainNodeRef.current);
        source.start();
        sourceNodeRef.current = source;
    };
    const handleNoiseSelect = (type)=>{
        setActiveNoise(type);
        playNoise(type);
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (gainNodeRef.current && audioContextRef.current) {
            gainNodeRef.current.gain.setTargetAtTime(volume, audioContextRef.current.currentTime, 0.1);
        }
    }, [
        volume
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$NoiseMixer$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].container,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$NoiseMixer$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].header,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$NoiseMixer$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].title,
                        children: "BACKGROUND FOCUS"
                    }, void 0, false, {
                        fileName: "[project]/app/components/NoiseMixer.tsx",
                        lineNumber: 140,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$NoiseMixer$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].volumeControl,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            type: "range",
                            min: "0",
                            max: "1",
                            step: "0.01",
                            value: volume,
                            onChange: (e)=>setVolume(parseFloat(e.target.value)),
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$NoiseMixer$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].range
                        }, void 0, false, {
                            fileName: "[project]/app/components/NoiseMixer.tsx",
                            lineNumber: 142,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/app/components/NoiseMixer.tsx",
                        lineNumber: 141,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/NoiseMixer.tsx",
                lineNumber: 139,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$NoiseMixer$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].optionsGrid,
                children: noiseTypes.map((type)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>handleNoiseSelect(type.id),
                        className: `${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$NoiseMixer$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].optionButton} ${activeNoise === type.id ? __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$NoiseMixer$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].active : ""}`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$NoiseMixer$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].icon,
                                children: type.icon
                            }, void 0, false, {
                                fileName: "[project]/app/components/NoiseMixer.tsx",
                                lineNumber: 160,
                                columnNumber: 25
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$NoiseMixer$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].label,
                                children: type.label
                            }, void 0, false, {
                                fileName: "[project]/app/components/NoiseMixer.tsx",
                                lineNumber: 161,
                                columnNumber: 25
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, type.id, true, {
                        fileName: "[project]/app/components/NoiseMixer.tsx",
                        lineNumber: 155,
                        columnNumber: 21
                    }, ("TURBOPACK compile-time value", void 0)))
            }, void 0, false, {
                fileName: "[project]/app/components/NoiseMixer.tsx",
                lineNumber: 153,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/NoiseMixer.tsx",
        lineNumber: 138,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
}),
"[project]/app/utils/time.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "formatTime",
    ()=>formatTime
]);
const formatTime = (ms)=>{
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor(ms % 60000 / 1000);
    const centiseconds = Math.floor(ms % 1000 / 10);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
};
}),
"[project]/app/components/RaceView.module.css [app-ssr] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "cancelAction": "RaceView-module__Oh4i1a__cancelAction",
  "carGlow": "RaceView-module__Oh4i1a__carGlow",
  "carGroundShadow": "RaceView-module__Oh4i1a__carGroundShadow",
  "carSpinOut": "RaceView-module__Oh4i1a__carSpinOut",
  "carSpinning": "RaceView-module__Oh4i1a__carSpinning",
  "completeBtn": "RaceView-module__Oh4i1a__completeBtn",
  "container": "RaceView-module__Oh4i1a__container",
  "dashboardPanel": "RaceView-module__Oh4i1a__dashboardPanel",
  "driftOverlay": "RaceView-module__Oh4i1a__driftOverlay",
  "driftText": "RaceView-module__Oh4i1a__driftText",
  "envWrapper": "RaceView-module__Oh4i1a__envWrapper",
  "finishFlash": "RaceView-module__Oh4i1a__finishFlash",
  "finishLine": "RaceView-module__Oh4i1a__finishLine",
  "finishLineCrossed": "RaceView-module__Oh4i1a__finishLineCrossed",
  "finishLineLabel": "RaceView-module__Oh4i1a__finishLineLabel",
  "finishLineRoad": "RaceView-module__Oh4i1a__finishLineRoad",
  "flicker": "RaceView-module__Oh4i1a__flicker",
  "ghostGlow": "RaceView-module__Oh4i1a__ghostGlow",
  "ghostImg": "RaceView-module__Oh4i1a__ghostImg",
  "guardrailLeft": "RaceView-module__Oh4i1a__guardrailLeft",
  "guardrailRight": "RaceView-module__Oh4i1a__guardrailRight",
  "hazardFlash": "RaceView-module__Oh4i1a__hazardFlash",
  "hazardTextBounce": "RaceView-module__Oh4i1a__hazardTextBounce",
  "horizonGlow": "RaceView-module__Oh4i1a__horizonGlow",
  "horizonMilestone": "RaceView-module__Oh4i1a__horizonMilestone",
  "horizonPulse": "RaceView-module__Oh4i1a__horizonPulse",
  "iconDrifting": "RaceView-module__Oh4i1a__iconDrifting",
  "label": "RaceView-module__Oh4i1a__label",
  "leadIndicator": "RaceView-module__Oh4i1a__leadIndicator",
  "leadNegative": "RaceView-module__Oh4i1a__leadNegative",
  "leadPositive": "RaceView-module__Oh4i1a__leadPositive",
  "leadSign": "RaceView-module__Oh4i1a__leadSign",
  "lightPole": "RaceView-module__Oh4i1a__lightPole",
  "markerItem": "RaceView-module__Oh4i1a__markerItem",
  "markerItemLeft": "RaceView-module__Oh4i1a__markerItemLeft",
  "moveRoadLine": "RaceView-module__Oh4i1a__moveRoadLine",
  "neonGate": "RaceView-module__Oh4i1a__neonGate",
  "neonGateBar": "RaceView-module__Oh4i1a__neonGateBar",
  "neonGatePost": "RaceView-module__Oh4i1a__neonGatePost",
  "pauseBtn": "RaceView-module__Oh4i1a__pauseBtn",
  "reflection": "RaceView-module__Oh4i1a__reflection",
  "roadCenterLine": "RaceView-module__Oh4i1a__roadCenterLine",
  "roadFloor": "RaceView-module__Oh4i1a__roadFloor",
  "roadGroup": "RaceView-module__Oh4i1a__roadGroup",
  "roadUnderGlow": "RaceView-module__Oh4i1a__roadUnderGlow",
  "roadVehicle": "RaceView-module__Oh4i1a__roadVehicle",
  "secondaryActions": "RaceView-module__Oh4i1a__secondaryActions",
  "spark": "RaceView-module__Oh4i1a__spark",
  "speedLine": "RaceView-module__Oh4i1a__speedLine",
  "speedLinesOverlay": "RaceView-module__Oh4i1a__speedLinesOverlay",
  "starsDriftFast": "RaceView-module__Oh4i1a__starsDriftFast",
  "starsDriftSlow": "RaceView-module__Oh4i1a__starsDriftSlow",
  "starsLayerFast": "RaceView-module__Oh4i1a__starsLayerFast",
  "starsLayerSlow": "RaceView-module__Oh4i1a__starsLayerSlow",
  "timer": "RaceView-module__Oh4i1a__timer",
  "timerDrifting": "RaceView-module__Oh4i1a__timerDrifting",
  "timerLosing": "RaceView-module__Oh4i1a__timerLosing",
  "timerWinning": "RaceView-module__Oh4i1a__timerWinning",
  "treeItem": "RaceView-module__Oh4i1a__treeItem",
  "treeVisual": "RaceView-module__Oh4i1a__treeVisual",
  "vehicleImg": "RaceView-module__Oh4i1a__vehicleImg",
  "vehicleOverlay": "RaceView-module__Oh4i1a__vehicleOverlay",
});
}),
"[project]/app/components/Assets.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CarIcon",
    ()=>CarIcon,
    "GhostIcon",
    ()=>GhostIcon,
    "GhostlyTreeIcon",
    ()=>GhostlyTreeIcon,
    "MileMarkerAsset",
    ()=>MileMarkerAsset,
    "SparkIcon",
    ()=>SparkIcon,
    "TreeIcon",
    ()=>TreeIcon
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
;
const CarIcon = ({ color = "#00E5FF", width = 60, height = 40 })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        width: width,
        height: height,
        viewBox: "0 0 120 80",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("defs", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("linearGradient", {
                        id: "bodyGradient",
                        x1: "60",
                        y1: "15",
                        x2: "60",
                        y2: "72",
                        gradientUnits: "userSpaceOnUse",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                stopColor: color,
                                stopOpacity: "0.85"
                            }, void 0, false, {
                                fileName: "[project]/app/components/Assets.tsx",
                                lineNumber: 7,
                                columnNumber: 17
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                offset: "1",
                                stopColor: "#05060A",
                                stopOpacity: "0.95"
                            }, void 0, false, {
                                fileName: "[project]/app/components/Assets.tsx",
                                lineNumber: 8,
                                columnNumber: 17
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/Assets.tsx",
                        lineNumber: 6,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("filter", {
                        id: "neonGlow",
                        x: "-50%",
                        y: "-50%",
                        width: "200%",
                        height: "200%",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("feGaussianBlur", {
                                stdDeviation: "3",
                                result: "coloredBlur"
                            }, void 0, false, {
                                fileName: "[project]/app/components/Assets.tsx",
                                lineNumber: 11,
                                columnNumber: 17
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("feMerge", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("feMergeNode", {
                                        in: "coloredBlur"
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/Assets.tsx",
                                        lineNumber: 13,
                                        columnNumber: 21
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("feMergeNode", {
                                        in: "SourceGraphic"
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/Assets.tsx",
                                        lineNumber: 14,
                                        columnNumber: 21
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/Assets.tsx",
                                lineNumber: 12,
                                columnNumber: 17
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/Assets.tsx",
                        lineNumber: 10,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/Assets.tsx",
                lineNumber: 5,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                x: "15",
                y: "45",
                width: "22",
                height: "32",
                rx: "4",
                fill: "#050505"
            }, void 0, false, {
                fileName: "[project]/app/components/Assets.tsx",
                lineNumber: 20,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                x: "83",
                y: "45",
                width: "22",
                height: "32",
                rx: "4",
                fill: "#050505"
            }, void 0, false, {
                fileName: "[project]/app/components/Assets.tsx",
                lineNumber: 21,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M8 55 C8 40, 20 34, 30 33 C35 18, 48 14, 60 14 C72 14, 85 18, 90 33 C100 34, 112 40, 112 55 L112 65 C112 70, 107 72, 100 72 L20 72 C13 72, 8 70, 8 65 Z",
                fill: "url(#bodyGradient)",
                stroke: color,
                strokeWidth: "1"
            }, void 0, false, {
                fileName: "[project]/app/components/Assets.tsx",
                lineNumber: 24,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M34 34 C42 19, 52 17, 60 17 C68 17, 78 19, 86 34 Z",
                fill: "#0A0C10",
                stroke: "#1A202C",
                strokeWidth: "1",
                opacity: "0.9"
            }, void 0, false, {
                fileName: "[project]/app/components/Assets.tsx",
                lineNumber: 32,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M30 72 L38 58 H82 L90 72 Z",
                fill: "#030303",
                stroke: "#111",
                strokeWidth: "1"
            }, void 0, false, {
                fileName: "[project]/app/components/Assets.tsx",
                lineNumber: 35,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M16 48 H46",
                stroke: "#FF0040",
                strokeWidth: "3",
                strokeLinecap: "round",
                filter: "url(#neonGlow)"
            }, void 0, false, {
                fileName: "[project]/app/components/Assets.tsx",
                lineNumber: 38,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M74 48 H104",
                stroke: "#FF0040",
                strokeWidth: "3",
                strokeLinecap: "round",
                filter: "url(#neonGlow)"
            }, void 0, false, {
                fileName: "[project]/app/components/Assets.tsx",
                lineNumber: 39,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                x1: "56",
                y1: "48",
                x2: "64",
                y2: "48",
                stroke: color,
                strokeWidth: "2",
                strokeLinecap: "round",
                opacity: "0.8",
                filter: "url(#neonGlow)"
            }, void 0, false, {
                fileName: "[project]/app/components/Assets.tsx",
                lineNumber: 42,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "45",
                cy: "65",
                r: "4.5",
                fill: "#111",
                stroke: "#333",
                strokeWidth: "1.5"
            }, void 0, false, {
                fileName: "[project]/app/components/Assets.tsx",
                lineNumber: 45,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "75",
                cy: "65",
                r: "4.5",
                fill: "#111",
                stroke: "#333",
                strokeWidth: "1.5"
            }, void 0, false, {
                fileName: "[project]/app/components/Assets.tsx",
                lineNumber: 46,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "45",
                cy: "65",
                r: "2",
                fill: "#00E5FF",
                filter: "url(#neonGlow)",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("animate", {
                    attributeName: "opacity",
                    values: "0.2;1;0.2",
                    dur: "0.12s",
                    repeatCount: "indefinite"
                }, void 0, false, {
                    fileName: "[project]/app/components/Assets.tsx",
                    lineNumber: 50,
                    columnNumber: 13
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/app/components/Assets.tsx",
                lineNumber: 49,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "75",
                cy: "65",
                r: "2",
                fill: "#00E5FF",
                filter: "url(#neonGlow)",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("animate", {
                    attributeName: "opacity",
                    values: "0.2;1;0.2",
                    dur: "0.14s",
                    repeatCount: "indefinite",
                    begin: "0.05s"
                }, void 0, false, {
                    fileName: "[project]/app/components/Assets.tsx",
                    lineNumber: 53,
                    columnNumber: 13
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/app/components/Assets.tsx",
                lineNumber: 52,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/Assets.tsx",
        lineNumber: 4,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
const GhostIcon = ({ type = "default", color = "white", opacity = 0.9 })=>{
    const ghostColors = {
        default: {
            primary: "white",
            secondary: "#00E5FF"
        },
        phantom: {
            primary: "#8BE9FD",
            secondary: "#6272A4"
        },
        reaper: {
            primary: "#FF5555",
            secondary: "#FF2A6D"
        },
        wraith: {
            primary: "#BD93F9",
            secondary: "#8B5CF6"
        },
        spectre: {
            primary: "#00FF87",
            secondary: "#00E5FF"
        },
        eternal: {
            primary: "#FFD700",
            secondary: "#FFA500"
        }
    };
    const c = ghostColors[type] || ghostColors.default;
    const uid = `ghost_${type}_${Math.random().toString(36).slice(2, 8)}`;
    if (type === "reaper") {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            width: "50",
            height: "60",
            viewBox: "0 0 50 60",
            fill: "none",
            xmlns: "http://www.w3.org/2000/svg",
            style: {
                opacity
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("defs", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("radialGradient", {
                            id: `${uid}_core`,
                            cx: "0.5",
                            cy: "0.4",
                            r: "0.5",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                    stopColor: c.primary,
                                    stopOpacity: "0.6"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/Assets.tsx",
                                    lineNumber: 76,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                    offset: "1",
                                    stopColor: c.primary,
                                    stopOpacity: "0"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/Assets.tsx",
                                    lineNumber: 77,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/Assets.tsx",
                            lineNumber: 75,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("filter", {
                            id: `${uid}_glow`,
                            x: "-30%",
                            y: "-30%",
                            width: "160%",
                            height: "160%",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("feGaussianBlur", {
                                    stdDeviation: "3",
                                    result: "blur"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/Assets.tsx",
                                    lineNumber: 80,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("feComposite", {
                                    in: "SourceGraphic",
                                    in2: "blur",
                                    operator: "over"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/Assets.tsx",
                                    lineNumber: 81,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/Assets.tsx",
                            lineNumber: 79,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/Assets.tsx",
                    lineNumber: 74,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M25 2L42 20L40 55L35 50L30 55L25 50L20 55L15 50L10 55L8 20L25 2Z",
                    fill: `url(#${uid}_core)`,
                    stroke: c.primary,
                    strokeWidth: "1.5",
                    filter: `url(#${uid}_glow)`
                }, void 0, false, {
                    fileName: "[project]/app/components/Assets.tsx",
                    lineNumber: 85,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M5 15Q15 8 25 18Q35 28 45 20",
                    stroke: c.secondary,
                    strokeWidth: "1",
                    opacity: "0.6",
                    fill: "none"
                }, void 0, false, {
                    fileName: "[project]/app/components/Assets.tsx",
                    lineNumber: 88,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M17 22L22 25L17 28Z",
                    fill: c.primary,
                    opacity: "0.9"
                }, void 0, false, {
                    fileName: "[project]/app/components/Assets.tsx",
                    lineNumber: 90,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M33 22L28 25L33 28Z",
                    fill: c.primary,
                    opacity: "0.9"
                }, void 0, false, {
                    fileName: "[project]/app/components/Assets.tsx",
                    lineNumber: 91,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                    cx: "19",
                    cy: "25",
                    r: "1",
                    fill: "white",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("animate", {
                        attributeName: "opacity",
                        values: "1;0.3;1",
                        dur: "2s",
                        repeatCount: "indefinite"
                    }, void 0, false, {
                        fileName: "[project]/app/components/Assets.tsx",
                        lineNumber: 93,
                        columnNumber: 21
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/app/components/Assets.tsx",
                    lineNumber: 92,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                    cx: "31",
                    cy: "25",
                    r: "1",
                    fill: "white",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("animate", {
                        attributeName: "opacity",
                        values: "1;0.3;1",
                        dur: "2s",
                        repeatCount: "indefinite"
                    }, void 0, false, {
                        fileName: "[project]/app/components/Assets.tsx",
                        lineNumber: 96,
                        columnNumber: 21
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/app/components/Assets.tsx",
                    lineNumber: 95,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/app/components/Assets.tsx",
            lineNumber: 73,
            columnNumber: 13
        }, ("TURBOPACK compile-time value", void 0));
    }
    if (type === "phantom") {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            width: "50",
            height: "60",
            viewBox: "0 0 50 60",
            fill: "none",
            xmlns: "http://www.w3.org/2000/svg",
            style: {
                opacity
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("defs", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("radialGradient", {
                            id: `${uid}_core`,
                            cx: "0.5",
                            cy: "0.4",
                            r: "0.6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                    stopColor: c.primary,
                                    stopOpacity: "0.5"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/Assets.tsx",
                                    lineNumber: 107,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                    offset: "1",
                                    stopColor: c.secondary,
                                    stopOpacity: "0"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/Assets.tsx",
                                    lineNumber: 108,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/Assets.tsx",
                            lineNumber: 106,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("filter", {
                            id: `${uid}_glow`,
                            x: "-20%",
                            y: "-20%",
                            width: "140%",
                            height: "140%",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("feGaussianBlur", {
                                    stdDeviation: "2.5",
                                    result: "blur"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/Assets.tsx",
                                    lineNumber: 111,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("feComposite", {
                                    in: "SourceGraphic",
                                    in2: "blur",
                                    operator: "over"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/Assets.tsx",
                                    lineNumber: 112,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/Assets.tsx",
                            lineNumber: 110,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/Assets.tsx",
                    lineNumber: 105,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M15 55C15 55 10 40 13 22C16 4 34 4 37 22C40 40 35 55 35 55Q30 48 25 55Q20 48 15 55Z",
                    fill: `url(#${uid}_core)`,
                    stroke: c.primary,
                    strokeWidth: "1.5",
                    filter: `url(#${uid}_glow)`
                }, void 0, false, {
                    fileName: "[project]/app/components/Assets.tsx",
                    lineNumber: 116,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ellipse", {
                    cx: "20",
                    cy: "22",
                    rx: "3",
                    ry: "4",
                    fill: c.primary,
                    opacity: "0.8"
                }, void 0, false, {
                    fileName: "[project]/app/components/Assets.tsx",
                    lineNumber: 119,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ellipse", {
                    cx: "30",
                    cy: "22",
                    rx: "3",
                    ry: "4",
                    fill: c.primary,
                    opacity: "0.8"
                }, void 0, false, {
                    fileName: "[project]/app/components/Assets.tsx",
                    lineNumber: 120,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                    cx: "20",
                    cy: "22",
                    r: "1.5",
                    fill: "white"
                }, void 0, false, {
                    fileName: "[project]/app/components/Assets.tsx",
                    lineNumber: 121,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                    cx: "30",
                    cy: "22",
                    r: "1.5",
                    fill: "white"
                }, void 0, false, {
                    fileName: "[project]/app/components/Assets.tsx",
                    lineNumber: 122,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                    cx: "18",
                    cy: "42",
                    r: "1",
                    fill: c.secondary,
                    opacity: "0.4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("animate", {
                            attributeName: "cy",
                            values: "42;52",
                            dur: "1.5s",
                            repeatCount: "indefinite"
                        }, void 0, false, {
                            fileName: "[project]/app/components/Assets.tsx",
                            lineNumber: 125,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("animate", {
                            attributeName: "opacity",
                            values: "0.4;0",
                            dur: "1.5s",
                            repeatCount: "indefinite"
                        }, void 0, false, {
                            fileName: "[project]/app/components/Assets.tsx",
                            lineNumber: 126,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/Assets.tsx",
                    lineNumber: 124,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                    cx: "32",
                    cy: "45",
                    r: "0.8",
                    fill: c.secondary,
                    opacity: "0.3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("animate", {
                            attributeName: "cy",
                            values: "45;55",
                            dur: "1.8s",
                            repeatCount: "indefinite"
                        }, void 0, false, {
                            fileName: "[project]/app/components/Assets.tsx",
                            lineNumber: 129,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("animate", {
                            attributeName: "opacity",
                            values: "0.3;0",
                            dur: "1.8s",
                            repeatCount: "indefinite"
                        }, void 0, false, {
                            fileName: "[project]/app/components/Assets.tsx",
                            lineNumber: 130,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/Assets.tsx",
                    lineNumber: 128,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/app/components/Assets.tsx",
            lineNumber: 104,
            columnNumber: 13
        }, ("TURBOPACK compile-time value", void 0));
    }
    if (type === "wraith") {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            width: "50",
            height: "60",
            viewBox: "0 0 50 60",
            fill: "none",
            xmlns: "http://www.w3.org/2000/svg",
            style: {
                opacity
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("defs", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("radialGradient", {
                            id: `${uid}_core`,
                            cx: "0.5",
                            cy: "0.35",
                            r: "0.5",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                    stopColor: c.primary,
                                    stopOpacity: "0.7"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/Assets.tsx",
                                    lineNumber: 141,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                    offset: "1",
                                    stopColor: c.secondary,
                                    stopOpacity: "0"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/Assets.tsx",
                                    lineNumber: 142,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/Assets.tsx",
                            lineNumber: 140,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("filter", {
                            id: `${uid}_glow`,
                            x: "-30%",
                            y: "-30%",
                            width: "160%",
                            height: "160%",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("feGaussianBlur", {
                                    stdDeviation: "4",
                                    result: "blur"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/Assets.tsx",
                                    lineNumber: 145,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("feComposite", {
                                    in: "SourceGraphic",
                                    in2: "blur",
                                    operator: "over"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/Assets.tsx",
                                    lineNumber: 146,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/Assets.tsx",
                            lineNumber: 144,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/Assets.tsx",
                    lineNumber: 139,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M8 50C8 50 3 35 10 18C17 1 33 1 40 18C47 35 42 50 42 50",
                    stroke: c.primary,
                    strokeWidth: "0.8",
                    opacity: "0.3",
                    fill: "none"
                }, void 0, false, {
                    fileName: "[project]/app/components/Assets.tsx",
                    lineNumber: 150,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M12 52C12 52 7 38 12 22C17 6 33 6 38 22C43 38 38 52 38 52",
                    stroke: c.primary,
                    strokeWidth: "1.5",
                    fill: `url(#${uid}_core)`,
                    filter: `url(#${uid}_glow)`
                }, void 0, false, {
                    fileName: "[project]/app/components/Assets.tsx",
                    lineNumber: 151,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M25 10Q35 20 25 30Q15 40 25 50",
                    stroke: c.secondary,
                    strokeWidth: "1",
                    opacity: "0.5",
                    fill: "none",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("animate", {
                        attributeName: "opacity",
                        values: "0.3;0.7;0.3",
                        dur: "2s",
                        repeatCount: "indefinite"
                    }, void 0, false, {
                        fileName: "[project]/app/components/Assets.tsx",
                        lineNumber: 154,
                        columnNumber: 21
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/app/components/Assets.tsx",
                    lineNumber: 153,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                    cx: "25",
                    cy: "22",
                    r: "5",
                    stroke: c.primary,
                    strokeWidth: "1",
                    fill: "none",
                    opacity: "0.6",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("animate", {
                        attributeName: "r",
                        values: "4;6;4",
                        dur: "2s",
                        repeatCount: "indefinite"
                    }, void 0, false, {
                        fileName: "[project]/app/components/Assets.tsx",
                        lineNumber: 158,
                        columnNumber: 21
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/app/components/Assets.tsx",
                    lineNumber: 157,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                    cx: "25",
                    cy: "22",
                    r: "2",
                    fill: "white",
                    opacity: "0.9"
                }, void 0, false, {
                    fileName: "[project]/app/components/Assets.tsx",
                    lineNumber: 160,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                    cx: "15",
                    cy: "40",
                    r: "1.2",
                    fill: c.primary,
                    opacity: "0.4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("animate", {
                            attributeName: "cy",
                            values: "40;50",
                            dur: "1s",
                            repeatCount: "indefinite"
                        }, void 0, false, {
                            fileName: "[project]/app/components/Assets.tsx",
                            lineNumber: 163,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("animate", {
                            attributeName: "opacity",
                            values: "0.4;0",
                            dur: "1s",
                            repeatCount: "indefinite"
                        }, void 0, false, {
                            fileName: "[project]/app/components/Assets.tsx",
                            lineNumber: 164,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/Assets.tsx",
                    lineNumber: 162,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                    cx: "35",
                    cy: "42",
                    r: "1",
                    fill: c.secondary,
                    opacity: "0.3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("animate", {
                            attributeName: "cy",
                            values: "42;52",
                            dur: "1.2s",
                            repeatCount: "indefinite"
                        }, void 0, false, {
                            fileName: "[project]/app/components/Assets.tsx",
                            lineNumber: 167,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("animate", {
                            attributeName: "opacity",
                            values: "0.3;0",
                            dur: "1.2s",
                            repeatCount: "indefinite"
                        }, void 0, false, {
                            fileName: "[project]/app/components/Assets.tsx",
                            lineNumber: 168,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/Assets.tsx",
                    lineNumber: 166,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                    cx: "25",
                    cy: "46",
                    r: "0.8",
                    fill: c.primary,
                    opacity: "0.5",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("animate", {
                            attributeName: "cy",
                            values: "46;56",
                            dur: "0.8s",
                            repeatCount: "indefinite"
                        }, void 0, false, {
                            fileName: "[project]/app/components/Assets.tsx",
                            lineNumber: 171,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("animate", {
                            attributeName: "opacity",
                            values: "0.5;0",
                            dur: "0.8s",
                            repeatCount: "indefinite"
                        }, void 0, false, {
                            fileName: "[project]/app/components/Assets.tsx",
                            lineNumber: 172,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/Assets.tsx",
                    lineNumber: 170,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/app/components/Assets.tsx",
            lineNumber: 138,
            columnNumber: 13
        }, ("TURBOPACK compile-time value", void 0));
    }
    if (type === "spectre") {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            width: "50",
            height: "60",
            viewBox: "0 0 50 60",
            fill: "none",
            xmlns: "http://www.w3.org/2000/svg",
            style: {
                opacity
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("defs", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("linearGradient", {
                            id: `${uid}_grad`,
                            x1: "25",
                            y1: "5",
                            x2: "25",
                            y2: "55",
                            gradientUnits: "userSpaceOnUse",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                    stopColor: c.primary,
                                    stopOpacity: "0.8"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/Assets.tsx",
                                    lineNumber: 183,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                    offset: "1",
                                    stopColor: c.secondary,
                                    stopOpacity: "0.1"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/Assets.tsx",
                                    lineNumber: 184,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/Assets.tsx",
                            lineNumber: 182,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("filter", {
                            id: `${uid}_glow`,
                            x: "-30%",
                            y: "-30%",
                            width: "160%",
                            height: "160%",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("feGaussianBlur", {
                                    stdDeviation: "3",
                                    result: "blur"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/Assets.tsx",
                                    lineNumber: 187,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("feComposite", {
                                    in: "SourceGraphic",
                                    in2: "blur",
                                    operator: "over"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/Assets.tsx",
                                    lineNumber: 188,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/Assets.tsx",
                            lineNumber: 186,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/Assets.tsx",
                    lineNumber: 181,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M25 5L40 20L38 45L30 55L20 55L12 45L10 20L25 5Z",
                    fill: `url(#${uid}_grad)`,
                    stroke: c.primary,
                    strokeWidth: "1",
                    filter: `url(#${uid}_glow)`,
                    opacity: "0.6"
                }, void 0, false, {
                    fileName: "[project]/app/components/Assets.tsx",
                    lineNumber: 192,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M25 5L12 45M25 5L38 45M10 20H40M20 55L25 30L30 55",
                    stroke: c.primary,
                    strokeWidth: "0.5",
                    opacity: "0.3"
                }, void 0, false, {
                    fileName: "[project]/app/components/Assets.tsx",
                    lineNumber: 195,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                    cx: "25",
                    cy: "5",
                    r: "1.5",
                    fill: c.primary
                }, void 0, false, {
                    fileName: "[project]/app/components/Assets.tsx",
                    lineNumber: 197,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                    cx: "40",
                    cy: "20",
                    r: "1",
                    fill: c.primary,
                    opacity: "0.7"
                }, void 0, false, {
                    fileName: "[project]/app/components/Assets.tsx",
                    lineNumber: 198,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                    cx: "10",
                    cy: "20",
                    r: "1",
                    fill: c.primary,
                    opacity: "0.7"
                }, void 0, false, {
                    fileName: "[project]/app/components/Assets.tsx",
                    lineNumber: 199,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                    cx: "25",
                    cy: "25",
                    r: "4",
                    fill: "white",
                    opacity: "0.8",
                    filter: `url(#${uid}_glow)`,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("animate", {
                            attributeName: "r",
                            values: "3;5;3",
                            dur: "1.5s",
                            repeatCount: "indefinite"
                        }, void 0, false, {
                            fileName: "[project]/app/components/Assets.tsx",
                            lineNumber: 202,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("animate", {
                            attributeName: "opacity",
                            values: "0.6;1;0.6",
                            dur: "1.5s",
                            repeatCount: "indefinite"
                        }, void 0, false, {
                            fileName: "[project]/app/components/Assets.tsx",
                            lineNumber: 203,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/Assets.tsx",
                    lineNumber: 201,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/app/components/Assets.tsx",
            lineNumber: 180,
            columnNumber: 13
        }, ("TURBOPACK compile-time value", void 0));
    }
    if (type === "eternal") {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
            width: "50",
            height: "60",
            viewBox: "0 0 50 60",
            fill: "none",
            xmlns: "http://www.w3.org/2000/svg",
            style: {
                opacity
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("defs", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("radialGradient", {
                            id: `${uid}_core`,
                            cx: "0.5",
                            cy: "0.4",
                            r: "0.5",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                    stopColor: c.primary,
                                    stopOpacity: "0.9"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/Assets.tsx",
                                    lineNumber: 214,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                    offset: "1",
                                    stopColor: c.secondary,
                                    stopOpacity: "0"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/Assets.tsx",
                                    lineNumber: 215,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/Assets.tsx",
                            lineNumber: 213,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("filter", {
                            id: `${uid}_glow`,
                            x: "-40%",
                            y: "-40%",
                            width: "180%",
                            height: "180%",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("feGaussianBlur", {
                                    stdDeviation: "5",
                                    result: "blur"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/Assets.tsx",
                                    lineNumber: 218,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("feComposite", {
                                    in: "SourceGraphic",
                                    in2: "blur",
                                    operator: "over"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/Assets.tsx",
                                    lineNumber: 219,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/Assets.tsx",
                            lineNumber: 217,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/Assets.tsx",
                    lineNumber: 212,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                    cx: "25",
                    cy: "25",
                    r: "18",
                    fill: `url(#${uid}_core)`,
                    filter: `url(#${uid}_glow)`,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("animate", {
                        attributeName: "r",
                        values: "16;20;16",
                        dur: "3s",
                        repeatCount: "indefinite"
                    }, void 0, false, {
                        fileName: "[project]/app/components/Assets.tsx",
                        lineNumber: 224,
                        columnNumber: 21
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/app/components/Assets.tsx",
                    lineNumber: 223,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ellipse", {
                    cx: "25",
                    cy: "12",
                    rx: "14",
                    ry: "4",
                    stroke: c.primary,
                    strokeWidth: "1.5",
                    fill: "none",
                    opacity: "0.7",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("animate", {
                        attributeName: "ry",
                        values: "3;5;3",
                        dur: "2s",
                        repeatCount: "indefinite"
                    }, void 0, false, {
                        fileName: "[project]/app/components/Assets.tsx",
                        lineNumber: 228,
                        columnNumber: 21
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/app/components/Assets.tsx",
                    lineNumber: 227,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M15 12L18 5L21 10L25 3L29 10L32 5L35 12",
                    stroke: c.primary,
                    strokeWidth: "1",
                    fill: "none",
                    opacity: "0.6"
                }, void 0, false, {
                    fileName: "[project]/app/components/Assets.tsx",
                    lineNumber: 231,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                    cx: "25",
                    cy: "22",
                    r: "6",
                    fill: c.primary,
                    opacity: "0.3"
                }, void 0, false, {
                    fileName: "[project]/app/components/Assets.tsx",
                    lineNumber: 233,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                    cx: "25",
                    cy: "22",
                    r: "3",
                    fill: "white",
                    opacity: "0.95",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("animate", {
                        attributeName: "opacity",
                        values: "0.8;1;0.8",
                        dur: "1s",
                        repeatCount: "indefinite"
                    }, void 0, false, {
                        fileName: "[project]/app/components/Assets.tsx",
                        lineNumber: 235,
                        columnNumber: 21
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/app/components/Assets.tsx",
                    lineNumber: 234,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M25 35V55",
                    stroke: c.primary,
                    strokeWidth: "2",
                    opacity: "0.4",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("animate", {
                        attributeName: "opacity",
                        values: "0.2;0.6;0.2",
                        dur: "1.5s",
                        repeatCount: "indefinite"
                    }, void 0, false, {
                        fileName: "[project]/app/components/Assets.tsx",
                        lineNumber: 239,
                        columnNumber: 21
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/app/components/Assets.tsx",
                    lineNumber: 238,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M18 32L12 52",
                    stroke: c.secondary,
                    strokeWidth: "1",
                    opacity: "0.3",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("animate", {
                        attributeName: "opacity",
                        values: "0.1;0.4;0.1",
                        dur: "1.8s",
                        repeatCount: "indefinite"
                    }, void 0, false, {
                        fileName: "[project]/app/components/Assets.tsx",
                        lineNumber: 242,
                        columnNumber: 21
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/app/components/Assets.tsx",
                    lineNumber: 241,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M32 32L38 52",
                    stroke: c.secondary,
                    strokeWidth: "1",
                    opacity: "0.3",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("animate", {
                        attributeName: "opacity",
                        values: "0.1;0.4;0.1",
                        dur: "1.8s",
                        repeatCount: "indefinite"
                    }, void 0, false, {
                        fileName: "[project]/app/components/Assets.tsx",
                        lineNumber: 245,
                        columnNumber: 21
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/app/components/Assets.tsx",
                    lineNumber: 244,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/app/components/Assets.tsx",
            lineNumber: 211,
            columnNumber: 13
        }, ("TURBOPACK compile-time value", void 0));
    }
    // Default: Wisp
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        width: "50",
        height: "60",
        viewBox: "0 0 50 60",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg",
        style: {
            opacity
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("defs", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("radialGradient", {
                        id: `${uid}_core`,
                        cx: "0",
                        cy: "0",
                        r: "1",
                        gradientUnits: "userSpaceOnUse",
                        gradientTransform: "translate(25 30) rotate(90) scale(25 20)",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                stopColor: c.primary,
                                stopOpacity: "0.9"
                            }, void 0, false, {
                                fileName: "[project]/app/components/Assets.tsx",
                                lineNumber: 256,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                offset: "1",
                                stopColor: c.primary,
                                stopOpacity: "0"
                            }, void 0, false, {
                                fileName: "[project]/app/components/Assets.tsx",
                                lineNumber: 257,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/Assets.tsx",
                        lineNumber: 255,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("filter", {
                        id: `${uid}_blur`,
                        x: "-20%",
                        y: "-20%",
                        width: "140%",
                        height: "140%",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("feGaussianBlur", {
                                stdDeviation: "3",
                                result: "blur"
                            }, void 0, false, {
                                fileName: "[project]/app/components/Assets.tsx",
                                lineNumber: 260,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("feComposite", {
                                in: "SourceGraphic",
                                in2: "blur",
                                operator: "over"
                            }, void 0, false, {
                                fileName: "[project]/app/components/Assets.tsx",
                                lineNumber: 261,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/Assets.tsx",
                        lineNumber: 259,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/Assets.tsx",
                lineNumber: 254,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M10 50C10 50 5 40 10 20C15 -5 35 -5 40 20C45 40 40 50 40 50",
                stroke: c.primary,
                strokeWidth: "1",
                strokeOpacity: "0.3",
                fill: "none"
            }, void 0, false, {
                fileName: "[project]/app/components/Assets.tsx",
                lineNumber: 264,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M15 55C15 55 12 45 15 25C18 5 32 5 35 25C38 45 35 55 35 55",
                stroke: c.primary,
                strokeWidth: "2",
                strokeOpacity: "0.6",
                fill: `url(#${uid}_core)`,
                filter: `url(#${uid}_blur)`
            }, void 0, false, {
                fileName: "[project]/app/components/Assets.tsx",
                lineNumber: 265,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "25",
                cy: "20",
                r: "6",
                fill: "white",
                fillOpacity: "0.9",
                filter: `url(#${uid}_blur)`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("animate", {
                        attributeName: "r",
                        values: "5;7;5",
                        dur: "1.5s",
                        repeatCount: "indefinite"
                    }, void 0, false, {
                        fileName: "[project]/app/components/Assets.tsx",
                        lineNumber: 267,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("animate", {
                        attributeName: "opacity",
                        values: "0.8;1;0.8",
                        dur: "1.5s",
                        repeatCount: "indefinite"
                    }, void 0, false, {
                        fileName: "[project]/app/components/Assets.tsx",
                        lineNumber: 268,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/Assets.tsx",
                lineNumber: 266,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "20",
                cy: "45",
                r: "1",
                fill: c.primary,
                opacity: "0.5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("animate", {
                        attributeName: "cy",
                        values: "45;55",
                        dur: "1s",
                        repeatCount: "indefinite"
                    }, void 0, false, {
                        fileName: "[project]/app/components/Assets.tsx",
                        lineNumber: 271,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("animate", {
                        attributeName: "opacity",
                        values: "0.5;0",
                        dur: "1s",
                        repeatCount: "indefinite"
                    }, void 0, false, {
                        fileName: "[project]/app/components/Assets.tsx",
                        lineNumber: 272,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/Assets.tsx",
                lineNumber: 270,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "30",
                cy: "48",
                r: "1.5",
                fill: c.primary,
                opacity: "0.5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("animate", {
                        attributeName: "cy",
                        values: "48;58",
                        dur: "1.2s",
                        repeatCount: "indefinite"
                    }, void 0, false, {
                        fileName: "[project]/app/components/Assets.tsx",
                        lineNumber: 275,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("animate", {
                        attributeName: "opacity",
                        values: "0.5;0",
                        dur: "1.2s",
                        repeatCount: "indefinite"
                    }, void 0, false, {
                        fileName: "[project]/app/components/Assets.tsx",
                        lineNumber: 276,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/Assets.tsx",
                lineNumber: 274,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/Assets.tsx",
        lineNumber: 253,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
const TreeIcon = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        width: "40",
        height: "60",
        viewBox: "0 0 40 60",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M20 2L38 28H2L20 2Z",
                stroke: "#00E5FF",
                strokeWidth: "1.5",
                vectorEffect: "non-scaling-stroke"
            }, void 0, false, {
                fileName: "[project]/app/components/Assets.tsx",
                lineNumber: 284,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M20 22L38 48H2L20 22Z",
                stroke: "#00E5FF",
                strokeWidth: "1.5",
                vectorEffect: "non-scaling-stroke"
            }, void 0, false, {
                fileName: "[project]/app/components/Assets.tsx",
                lineNumber: 285,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M18 48H22V58H18V48Z",
                stroke: "#00E5FF",
                strokeWidth: "1.5"
            }, void 0, false, {
                fileName: "[project]/app/components/Assets.tsx",
                lineNumber: 286,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "20",
                cy: "15",
                r: "2",
                fill: "#00E5FF"
            }, void 0, false, {
                fileName: "[project]/app/components/Assets.tsx",
                lineNumber: 287,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "20",
                cy: "35",
                r: "2",
                fill: "#00E5FF"
            }, void 0, false, {
                fileName: "[project]/app/components/Assets.tsx",
                lineNumber: 288,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/Assets.tsx",
        lineNumber: 283,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
const SparkIcon = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        width: "24",
        height: "24",
        viewBox: "0 0 24 24",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: "M12 0L14 10L24 12L14 14L12 24L10 14L0 12L10 10L12 0Z",
            fill: "white"
        }, void 0, false, {
            fileName: "[project]/app/components/Assets.tsx",
            lineNumber: 294,
            columnNumber: 9
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/app/components/Assets.tsx",
        lineNumber: 293,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
const GhostlyTreeIcon = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        width: "80",
        height: "100",
        viewBox: "0 0 80 100",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("defs", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("linearGradient", {
                        id: "treeGradient",
                        x1: "40",
                        y1: "10",
                        x2: "40",
                        y2: "60",
                        gradientUnits: "userSpaceOnUse",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                stopColor: "white",
                                stopOpacity: "0.8"
                            }, void 0, false, {
                                fileName: "[project]/app/components/Assets.tsx",
                                lineNumber: 303,
                                columnNumber: 17
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                offset: "1",
                                stopColor: "#00E5FF",
                                stopOpacity: "0.2"
                            }, void 0, false, {
                                fileName: "[project]/app/components/Assets.tsx",
                                lineNumber: 304,
                                columnNumber: 17
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/Assets.tsx",
                        lineNumber: 302,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("filter", {
                        id: "ultraGlow",
                        x: "-50%",
                        y: "-50%",
                        width: "200%",
                        height: "200%",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("feGaussianBlur", {
                                stdDeviation: "4",
                                result: "blur"
                            }, void 0, false, {
                                fileName: "[project]/app/components/Assets.tsx",
                                lineNumber: 307,
                                columnNumber: 17
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("feComposite", {
                                in: "SourceGraphic",
                                in2: "blur",
                                operator: "over"
                            }, void 0, false, {
                                fileName: "[project]/app/components/Assets.tsx",
                                lineNumber: 308,
                                columnNumber: 17
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/Assets.tsx",
                        lineNumber: 306,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/Assets.tsx",
                lineNumber: 301,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                filter: "url(#ultraGlow)",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ellipse", {
                        cx: "40",
                        cy: "90",
                        rx: "20",
                        ry: "6",
                        stroke: "#00E5FF",
                        strokeWidth: "2",
                        opacity: "0.8",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("animate", {
                                attributeName: "rx",
                                values: "18;22;18",
                                dur: "2s",
                                repeatCount: "indefinite"
                            }, void 0, false, {
                                fileName: "[project]/app/components/Assets.tsx",
                                lineNumber: 314,
                                columnNumber: 17
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("animate", {
                                attributeName: "opacity",
                                values: "0.4;0.9;0.4",
                                dur: "2s",
                                repeatCount: "indefinite"
                            }, void 0, false, {
                                fileName: "[project]/app/components/Assets.tsx",
                                lineNumber: 315,
                                columnNumber: 17
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/Assets.tsx",
                        lineNumber: 313,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ellipse", {
                        cx: "40",
                        cy: "90",
                        rx: "12",
                        ry: "4",
                        stroke: "white",
                        strokeWidth: "1",
                        opacity: "0.4"
                    }, void 0, false, {
                        fileName: "[project]/app/components/Assets.tsx",
                        lineNumber: 317,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "M40 90V55",
                        stroke: "url(#treeGradient)",
                        strokeWidth: "3",
                        strokeLinecap: "round"
                    }, void 0, false, {
                        fileName: "[project]/app/components/Assets.tsx",
                        lineNumber: 320,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "M40 10L60 35L40 60L20 35L40 10Z",
                        fill: "rgba(255, 255, 255, 0.1)",
                        stroke: "white",
                        strokeWidth: "1.5",
                        strokeLinejoin: "round"
                    }, void 0, false, {
                        fileName: "[project]/app/components/Assets.tsx",
                        lineNumber: 324,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "M40 10L75 40L40 60L5 40L40 10Z",
                        stroke: "white",
                        strokeWidth: "0.8",
                        strokeLinejoin: "round",
                        opacity: "0.4"
                    }, void 0, false, {
                        fileName: "[project]/app/components/Assets.tsx",
                        lineNumber: 325,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "M40 10V35M20 35H60M40 35L60 35M40 35L20 35M40 60V35",
                        stroke: "white",
                        strokeWidth: "0.5",
                        opacity: "0.3"
                    }, void 0, false, {
                        fileName: "[project]/app/components/Assets.tsx",
                        lineNumber: 328,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "M40 10L20 35L40 60M40 10L60 35L40 60",
                        stroke: "#00E5FF",
                        strokeWidth: "1",
                        opacity: "0.5"
                    }, void 0, false, {
                        fileName: "[project]/app/components/Assets.tsx",
                        lineNumber: 329,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: "40",
                        cy: "10",
                        r: "1.5",
                        fill: "white"
                    }, void 0, false, {
                        fileName: "[project]/app/components/Assets.tsx",
                        lineNumber: 332,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: "60",
                        cy: "35",
                        r: "1",
                        fill: "white"
                    }, void 0, false, {
                        fileName: "[project]/app/components/Assets.tsx",
                        lineNumber: 333,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: "20",
                        cy: "35",
                        r: "1",
                        fill: "white"
                    }, void 0, false, {
                        fileName: "[project]/app/components/Assets.tsx",
                        lineNumber: 334,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: "40",
                        cy: "60",
                        r: "1",
                        fill: "white"
                    }, void 0, false, {
                        fileName: "[project]/app/components/Assets.tsx",
                        lineNumber: 335,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/Assets.tsx",
                lineNumber: 311,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/Assets.tsx",
        lineNumber: 300,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
const MileMarkerAsset = ({ label })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '80px',
            height: '50px',
            background: 'rgba(0, 229, 255, 0.05)',
            backdropFilter: 'blur(4px)',
            border: '2px solid #00E5FF',
            borderRadius: '8px',
            color: '#00E5FF',
            fontFamily: "'Inter', var(--font-mono)",
            fontSize: '14px',
            fontWeight: '800',
            letterSpacing: '0.05em',
            textShadow: '0 0 10px rgba(0, 229, 255, 0.8)',
            boxShadow: '0 0 20px rgba(0, 229, 255, 0.3), inset 0 0 10px rgba(0, 229, 255, 0.2)',
            padding: '6px',
            textAlign: 'center',
            position: 'relative',
            transform: 'rotateX(-80deg)',
            animation: 'markerGlow 2s infinite alternate'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    fontSize: '9px',
                    opacity: 0.6,
                    fontWeight: '400',
                    letterSpacing: '0.2em'
                },
                children: "MILESTONE"
            }, void 0, false, {
                fileName: "[project]/app/components/Assets.tsx",
                lineNumber: 366,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: label
            }, void 0, false, {
                fileName: "[project]/app/components/Assets.tsx",
                lineNumber: 367,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    position: 'absolute',
                    left: '-2px',
                    top: '10px',
                    bottom: '10px',
                    width: '2px',
                    background: 'white',
                    boxShadow: '0 0 10px white'
                }
            }, void 0, false, {
                fileName: "[project]/app/components/Assets.tsx",
                lineNumber: 370,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    position: 'absolute',
                    right: '-2px',
                    top: '10px',
                    bottom: '10px',
                    width: '2px',
                    background: 'white',
                    boxShadow: '0 0 10px white'
                }
            }, void 0, false, {
                fileName: "[project]/app/components/Assets.tsx",
                lineNumber: 371,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    position: 'absolute',
                    bottom: '-30px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '4px',
                    height: '30px',
                    background: 'linear-gradient(to bottom, #00E5FF, transparent)',
                    boxShadow: '0 0 10px rgba(0, 229, 255, 0.5)'
                }
            }, void 0, false, {
                fileName: "[project]/app/components/Assets.tsx",
                lineNumber: 374,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("style", {
                dangerouslySetInnerHTML: {
                    __html: `
            @keyframes markerGlow {
                from { box-shadow: 0 0 20px rgba(0, 229, 255, 0.3); border-color: #00E5FF; }
                to { box-shadow: 0 0 40px rgba(0, 229, 255, 0.6); border-color: #70FFFF; }
            }
        `
                }
            }, void 0, false, {
                fileName: "[project]/app/components/Assets.tsx",
                lineNumber: 385,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/Assets.tsx",
        lineNumber: 342,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
}),
"[project]/app/components/CustomizationModal.module.css [app-ssr] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "active": "CustomizationModal-module__FLmmuG__active",
  "card": "CustomizationModal-module__FLmmuG__card",
  "closeButton": "CustomizationModal-module__FLmmuG__closeButton",
  "container": "CustomizationModal-module__FLmmuG__container",
  "cost": "CustomizationModal-module__FLmmuG__cost",
  "fuelCount": "CustomizationModal-module__FLmmuG__fuelCount",
  "fuelLabel": "CustomizationModal-module__FLmmuG__fuelLabel",
  "fuelValue": "CustomizationModal-module__FLmmuG__fuelValue",
  "grid": "CustomizationModal-module__FLmmuG__grid",
  "header": "CustomizationModal-module__FLmmuG__header",
  "info": "CustomizationModal-module__FLmmuG__info",
  "itemName": "CustomizationModal-module__FLmmuG__itemName",
  "levelLabel": "CustomizationModal-module__FLmmuG__levelLabel",
  "locked": "CustomizationModal-module__FLmmuG__locked",
  "overlay": "CustomizationModal-module__FLmmuG__overlay",
  "preview": "CustomizationModal-module__FLmmuG__preview",
  "section": "CustomizationModal-module__FLmmuG__section",
  "sectionTitle": "CustomizationModal-module__FLmmuG__sectionTitle",
  "statusLabel": "CustomizationModal-module__FLmmuG__statusLabel",
  "tab": "CustomizationModal-module__FLmmuG__tab",
  "tabActive": "CustomizationModal-module__FLmmuG__tabActive",
  "tabs": "CustomizationModal-module__FLmmuG__tabs",
  "title": "CustomizationModal-module__FLmmuG__title",
  "trackCard": "CustomizationModal-module__FLmmuG__trackCard",
  "trackDesc": "CustomizationModal-module__FLmmuG__trackDesc",
  "trackEmoji": "CustomizationModal-module__FLmmuG__trackEmoji",
  "trackGrid": "CustomizationModal-module__FLmmuG__trackGrid",
  "trackInfo": "CustomizationModal-module__FLmmuG__trackInfo",
  "trackLinePreview": "CustomizationModal-module__FLmmuG__trackLinePreview",
  "trackPreview": "CustomizationModal-module__FLmmuG__trackPreview",
  "trackRoadPreview": "CustomizationModal-module__FLmmuG__trackRoadPreview",
});
}),
"[project]/app/components/CustomizationModal.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CustomizationModal",
    ()=>CustomizationModal,
    "TRACK_THEMES",
    ()=>TRACK_THEMES
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$ghostService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/services/ghostService.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$Assets$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/Assets.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CustomizationModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/app/components/CustomizationModal.module.css [app-ssr] (css module)");
"use client";
;
;
;
;
;
;
const UNLOCKABLES = [
    // Car Colors — escalating rarity
    {
        id: "default_cyan",
        name: "Cyan Neon",
        cost: 0,
        type: "color",
        value: "#00E5FF"
    },
    {
        id: "volt_yellow",
        name: "Volt Yellow",
        cost: 50,
        type: "color",
        value: "#CCFF00"
    },
    {
        id: "crimson_pulse",
        name: "Crimson Pulse",
        cost: 100,
        type: "color",
        value: "#FF2A6D"
    },
    {
        id: "obsidian",
        name: "Obsidian",
        cost: 200,
        type: "color",
        value: "#222222"
    },
    {
        id: "phantom_violet",
        name: "Phantom Violet",
        cost: 350,
        type: "color",
        value: "#8B5CF6"
    },
    {
        id: "solar_orange",
        name: "Solar Flare",
        cost: 500,
        type: "color",
        value: "#FF6B00"
    },
    {
        id: "arctic_white",
        name: "Arctic White",
        cost: 750,
        type: "color",
        value: "#E8F0FE"
    },
    {
        id: "emerald_rush",
        name: "Emerald Rush",
        cost: 1000,
        type: "color",
        value: "#00FF87"
    },
    {
        id: "rose_gold",
        name: "Rose Gold",
        cost: 1500,
        type: "color",
        value: "#E8A0BF"
    },
    {
        id: "holographic",
        name: "Holographic",
        cost: 3000,
        type: "color",
        value: "#C0C0FF"
    },
    // Ghost Entities — escalating rarity
    {
        id: "default_ghost",
        name: "Wisp",
        cost: 0,
        type: "ghost",
        value: "default"
    },
    {
        id: "phantom_ghost",
        name: "Phantom",
        cost: 150,
        type: "ghost",
        value: "phantom"
    },
    {
        id: "reaper_ghost",
        name: "Reaper",
        cost: 500,
        type: "ghost",
        value: "reaper"
    },
    {
        id: "wraith_ghost",
        name: "Wraith",
        cost: 1200,
        type: "ghost",
        value: "wraith"
    },
    {
        id: "spectre_ghost",
        name: "Spectre",
        cost: 2500,
        type: "ghost",
        value: "spectre"
    },
    {
        id: "eternal_ghost",
        name: "Eternal",
        cost: 5000,
        type: "ghost",
        value: "eternal"
    },
    // Track Environments
    {
        id: "track_cyber",
        name: "Cyberpunk",
        cost: 0,
        type: "track",
        value: "cyber",
        emoji: "🌆",
        description: "Neon city at midnight"
    },
    {
        id: "track_desert",
        name: "Neon Desert",
        cost: 300,
        type: "track",
        value: "desert",
        emoji: "🌵",
        description: "Scorched dunes at dusk"
    },
    {
        id: "track_storm",
        name: "Storm Circuit",
        cost: 600,
        type: "track",
        value: "storm",
        emoji: "⚡",
        description: "Race through the lightning"
    },
    {
        id: "track_forest",
        name: "Ghost Forest",
        cost: 1000,
        type: "track",
        value: "forest",
        emoji: "🌲",
        description: "Ancient glowing woods"
    },
    {
        id: "track_space",
        name: "Orbital",
        cost: 2000,
        type: "track",
        value: "space",
        emoji: "🌌",
        description: "Deep space superhighway"
    },
    {
        id: "track_volcano",
        name: "Magma Run",
        cost: 4000,
        type: "track",
        value: "volcano",
        emoji: "🌋",
        description: "Race above molten rock"
    }
];
const TRACK_THEMES = {
    cyber: {
        label: "Cyberpunk",
        roadColor: "#06080d",
        roadBorder: "#00E5FF",
        skyBackground: "radial-gradient(circle at 50% 0%, #0a1220 0%, #030508 100%)",
        horizonGlow: "radial-gradient(ellipse 80% 14% at 50% 44%, rgba(255,160,40,0.28) 0%, rgba(255,210,80,0.10) 60%, transparent 100%)",
        glowColor: "rgba(0,229,255,0.22)",
        lineColor: "rgba(0,229,255,0.1)"
    },
    desert: {
        label: "Neon Desert",
        roadColor: "#1a0e00",
        roadBorder: "#FF8C00",
        skyBackground: "radial-gradient(circle at 50% 0%, #1a0800 0%, #0a0400 100%)",
        horizonGlow: "radial-gradient(ellipse 90% 20% at 50% 50%, rgba(255,120,20,0.4) 0%, rgba(255,60,0,0.15) 60%, transparent 100%)",
        glowColor: "rgba(255,140,0,0.25)",
        lineColor: "rgba(255,140,0,0.12)"
    },
    storm: {
        label: "Storm Circuit",
        roadColor: "#050510",
        roadBorder: "#7B61FF",
        skyBackground: "radial-gradient(circle at 50% 0%, #080515 0%, #020208 100%)",
        horizonGlow: "radial-gradient(ellipse 70% 25% at 50% 45%, rgba(120,80,255,0.3) 0%, rgba(60,20,200,0.1) 60%, transparent 100%)",
        glowColor: "rgba(123,97,255,0.25)",
        lineColor: "rgba(123,97,255,0.12)"
    },
    forest: {
        label: "Ghost Forest",
        roadColor: "#020a04",
        roadBorder: "#00FF87",
        skyBackground: "radial-gradient(circle at 50% 0%, #020a04 0%, #010502 100%)",
        horizonGlow: "radial-gradient(ellipse 80% 16% at 50% 42%, rgba(0,200,80,0.25) 0%, rgba(0,100,40,0.1) 60%, transparent 100%)",
        glowColor: "rgba(0,255,135,0.2)",
        lineColor: "rgba(0,255,135,0.1)"
    },
    space: {
        label: "Orbital",
        roadColor: "#020010",
        roadBorder: "#C0C0FF",
        skyBackground: "radial-gradient(circle at 50% 0%, #020010 0%, #010008 100%)",
        horizonGlow: "radial-gradient(ellipse 60% 20% at 50% 40%, rgba(150,100,255,0.2) 0%, rgba(80,50,200,0.08) 60%, transparent 100%)",
        glowColor: "rgba(192,192,255,0.2)",
        lineColor: "rgba(192,192,255,0.1)"
    },
    volcano: {
        label: "Magma Run",
        roadColor: "#150500",
        roadBorder: "#FF4400",
        skyBackground: "radial-gradient(circle at 50% 0%, #150200 0%, #080100 100%)",
        horizonGlow: "radial-gradient(ellipse 90% 30% at 50% 55%, rgba(255,80,0,0.5) 0%, rgba(200,20,0,0.2) 60%, transparent 100%)",
        glowColor: "rgba(255,80,0,0.3)",
        lineColor: "rgba(255,80,0,0.15)"
    }
};
const CustomizationModal = ({ onClose })=>{
    const [fuel, setFuel] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [unlocks, setUnlocks] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [customization, setCustomization] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        carColor: "#00E5FF",
        ghostType: "default",
        trackTheme: "cyber"
    });
    const [activeTab, setActiveTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("color");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        setFuel(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$ghostService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GhostService"].getFuel());
        setUnlocks(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$ghostService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GhostService"].getUnlocks());
        setCustomization(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$ghostService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GhostService"].getCustomization());
    }, []);
    const handleUnlock = (item)=>{
        if (__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$ghostService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GhostService"].unlockItem(item.id, item.cost)) {
            setFuel(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$ghostService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GhostService"].getFuel());
            setUnlocks(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$ghostService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GhostService"].getUnlocks());
        }
    };
    const handleSelect = (item)=>{
        if (!unlocks.includes(item.id)) return;
        let updates = {};
        if (item.type === "color") updates = {
            carColor: item.value
        };
        else if (item.type === "ghost") updates = {
            ghostType: item.value
        };
        else if (item.type === "track") updates = {
            trackTheme: item.value
        };
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$ghostService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GhostService"].updateCustomization(updates);
        setCustomization({
            ...customization,
            ...updates
        });
    };
    const tabs = [
        {
            key: "color",
            label: "CHASSIS",
            emoji: "🚗"
        },
        {
            key: "ghost",
            label: "GHOST",
            emoji: "👻"
        },
        {
            key: "track",
            label: "TRACK",
            emoji: "🛣️"
        }
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
        initial: {
            opacity: 0,
            scale: 0.95
        },
        animate: {
            opacity: 1,
            scale: 1
        },
        exit: {
            opacity: 0,
            scale: 0.95
        },
        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CustomizationModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].overlay,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CustomizationModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].container,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CustomizationModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].header,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CustomizationModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].title,
                                    children: "MY GARAGE"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/CustomizationModal.tsx",
                                    lineNumber: 163,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CustomizationModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].fuelCount,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CustomizationModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].fuelLabel,
                                            children: "FUEL RESERVE"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/CustomizationModal.tsx",
                                            lineNumber: 165,
                                            columnNumber: 29
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CustomizationModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].fuelValue,
                                            children: [
                                                fuel,
                                                " XP"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/components/CustomizationModal.tsx",
                                            lineNumber: 166,
                                            columnNumber: 29
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CustomizationModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].levelLabel,
                                            style: {
                                                marginTop: '0.25rem',
                                                color: '#00E5FF',
                                                fontSize: '0.6rem',
                                                fontWeight: 700,
                                                letterSpacing: '0.15em'
                                            },
                                            children: [
                                                "LVL ",
                                                (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$ghostService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getLevelInfo"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$ghostService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GhostService"].getTotalXpEarned()).level,
                                                " · ",
                                                (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$ghostService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getLevelInfo"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$ghostService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GhostService"].getTotalXpEarned()).title.toUpperCase()
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/components/CustomizationModal.tsx",
                                            lineNumber: 167,
                                            columnNumber: 29
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/CustomizationModal.tsx",
                                    lineNumber: 164,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/CustomizationModal.tsx",
                            lineNumber: 162,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onClose,
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CustomizationModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].closeButton,
                            children: "×"
                        }, void 0, false, {
                            fileName: "[project]/app/components/CustomizationModal.tsx",
                            lineNumber: 172,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/CustomizationModal.tsx",
                    lineNumber: 161,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CustomizationModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].tabs,
                    children: tabs.map((tab)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: `${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CustomizationModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].tab} ${activeTab === tab.key ? __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CustomizationModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].tabActive : ""}`,
                            onClick: ()=>setActiveTab(tab.key),
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: tab.emoji
                                }, void 0, false, {
                                    fileName: "[project]/app/components/CustomizationModal.tsx",
                                    lineNumber: 183,
                                    columnNumber: 29
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: tab.label
                                }, void 0, false, {
                                    fileName: "[project]/app/components/CustomizationModal.tsx",
                                    lineNumber: 184,
                                    columnNumber: 29
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, tab.key, true, {
                            fileName: "[project]/app/components/CustomizationModal.tsx",
                            lineNumber: 178,
                            columnNumber: 25
                        }, ("TURBOPACK compile-time value", void 0)))
                }, void 0, false, {
                    fileName: "[project]/app/components/CustomizationModal.tsx",
                    lineNumber: 176,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                activeTab === "color" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CustomizationModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].section,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CustomizationModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].grid,
                        children: UNLOCKABLES.filter((u)=>u.type === "color").map((item)=>{
                            const isUnlocked = unlocks.includes(item.id);
                            const isActive = customization.carColor === item.value;
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CustomizationModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].card} ${isActive ? __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CustomizationModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].active : ""} ${!isUnlocked ? __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CustomizationModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].locked : ""}`,
                                onClick: ()=>isUnlocked ? handleSelect(item) : handleUnlock(item),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CustomizationModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].preview,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$Assets$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CarIcon"], {
                                            color: item.value
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/CustomizationModal.tsx",
                                            lineNumber: 203,
                                            columnNumber: 45
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/CustomizationModal.tsx",
                                        lineNumber: 202,
                                        columnNumber: 41
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CustomizationModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].info,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CustomizationModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].itemName,
                                                children: item.name
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/CustomizationModal.tsx",
                                                lineNumber: 206,
                                                columnNumber: 45
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            !isUnlocked && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CustomizationModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].cost,
                                                children: [
                                                    item.cost,
                                                    " XP"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/components/CustomizationModal.tsx",
                                                lineNumber: 207,
                                                columnNumber: 61
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            isActive && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CustomizationModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].statusLabel,
                                                children: "ACTIVE"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/CustomizationModal.tsx",
                                                lineNumber: 208,
                                                columnNumber: 58
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/CustomizationModal.tsx",
                                        lineNumber: 205,
                                        columnNumber: 41
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, item.id, true, {
                                fileName: "[project]/app/components/CustomizationModal.tsx",
                                lineNumber: 197,
                                columnNumber: 37
                            }, ("TURBOPACK compile-time value", void 0));
                        })
                    }, void 0, false, {
                        fileName: "[project]/app/components/CustomizationModal.tsx",
                        lineNumber: 192,
                        columnNumber: 25
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/app/components/CustomizationModal.tsx",
                    lineNumber: 191,
                    columnNumber: 21
                }, ("TURBOPACK compile-time value", void 0)),
                activeTab === "ghost" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CustomizationModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].section,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CustomizationModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].grid,
                        children: UNLOCKABLES.filter((u)=>u.type === "ghost").map((item)=>{
                            const isUnlocked = unlocks.includes(item.id);
                            const isActive = customization.ghostType === item.value;
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CustomizationModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].card} ${isActive ? __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CustomizationModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].active : ""} ${!isUnlocked ? __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CustomizationModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].locked : ""}`,
                                onClick: ()=>isUnlocked ? handleSelect(item) : handleUnlock(item),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CustomizationModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].preview,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$Assets$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GhostIcon"], {
                                            type: item.value
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/CustomizationModal.tsx",
                                            lineNumber: 231,
                                            columnNumber: 45
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/CustomizationModal.tsx",
                                        lineNumber: 230,
                                        columnNumber: 41
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CustomizationModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].info,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CustomizationModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].itemName,
                                                children: item.name
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/CustomizationModal.tsx",
                                                lineNumber: 234,
                                                columnNumber: 45
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            !isUnlocked && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CustomizationModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].cost,
                                                children: [
                                                    item.cost,
                                                    " XP"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/components/CustomizationModal.tsx",
                                                lineNumber: 235,
                                                columnNumber: 61
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            isActive && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CustomizationModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].statusLabel,
                                                children: "ACTIVE"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/CustomizationModal.tsx",
                                                lineNumber: 236,
                                                columnNumber: 58
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/CustomizationModal.tsx",
                                        lineNumber: 233,
                                        columnNumber: 41
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, item.id, true, {
                                fileName: "[project]/app/components/CustomizationModal.tsx",
                                lineNumber: 225,
                                columnNumber: 37
                            }, ("TURBOPACK compile-time value", void 0));
                        })
                    }, void 0, false, {
                        fileName: "[project]/app/components/CustomizationModal.tsx",
                        lineNumber: 220,
                        columnNumber: 25
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/app/components/CustomizationModal.tsx",
                    lineNumber: 219,
                    columnNumber: 21
                }, ("TURBOPACK compile-time value", void 0)),
                activeTab === "track" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CustomizationModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].section,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CustomizationModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].trackGrid,
                        children: UNLOCKABLES.filter((u)=>u.type === "track").map((item)=>{
                            const isUnlocked = unlocks.includes(item.id);
                            const isActive = customization.trackTheme === item.value;
                            const theme = TRACK_THEMES[item.value];
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CustomizationModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].trackCard} ${isActive ? __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CustomizationModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].active : ""} ${!isUnlocked ? __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CustomizationModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].locked : ""}`,
                                onClick: ()=>isUnlocked ? handleSelect(item) : handleUnlock(item),
                                style: isUnlocked ? {
                                    borderColor: theme.roadBorder + "55"
                                } : {},
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CustomizationModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].trackPreview,
                                        style: {
                                            background: `${theme.horizonGlow}, ${theme.skyBackground}`
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CustomizationModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].trackRoadPreview,
                                                style: {
                                                    borderColor: theme.roadBorder,
                                                    background: theme.roadColor,
                                                    boxShadow: `0 0 12px ${theme.roadBorder}66`
                                                },
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CustomizationModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].trackLinePreview,
                                                    style: {
                                                        background: theme.roadBorder + "44"
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/CustomizationModal.tsx",
                                                    lineNumber: 271,
                                                    columnNumber: 49
                                                }, ("TURBOPACK compile-time value", void 0))
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/CustomizationModal.tsx",
                                                lineNumber: 266,
                                                columnNumber: 45
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CustomizationModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].trackEmoji,
                                                children: item.emoji
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/CustomizationModal.tsx",
                                                lineNumber: 273,
                                                columnNumber: 45
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/CustomizationModal.tsx",
                                        lineNumber: 260,
                                        columnNumber: 41
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CustomizationModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].trackInfo,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CustomizationModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].itemName,
                                                children: item.name
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/CustomizationModal.tsx",
                                                lineNumber: 277,
                                                columnNumber: 45
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CustomizationModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].trackDesc,
                                                children: item.description
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/CustomizationModal.tsx",
                                                lineNumber: 278,
                                                columnNumber: 45
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            !isUnlocked && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CustomizationModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].cost,
                                                children: [
                                                    item.cost,
                                                    " XP"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/components/CustomizationModal.tsx",
                                                lineNumber: 279,
                                                columnNumber: 61
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            isActive && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CustomizationModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].statusLabel,
                                                children: "ACTIVE"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/CustomizationModal.tsx",
                                                lineNumber: 280,
                                                columnNumber: 58
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/CustomizationModal.tsx",
                                        lineNumber: 276,
                                        columnNumber: 41
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, item.id, true, {
                                fileName: "[project]/app/components/CustomizationModal.tsx",
                                lineNumber: 254,
                                columnNumber: 37
                            }, ("TURBOPACK compile-time value", void 0));
                        })
                    }, void 0, false, {
                        fileName: "[project]/app/components/CustomizationModal.tsx",
                        lineNumber: 248,
                        columnNumber: 25
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/app/components/CustomizationModal.tsx",
                    lineNumber: 247,
                    columnNumber: 21
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/app/components/CustomizationModal.tsx",
            lineNumber: 159,
            columnNumber: 13
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/app/components/CustomizationModal.tsx",
        lineNumber: 153,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
}),
"[project]/app/components/RaceView.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "RaceView",
    ()=>RaceView
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$time$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/utils/time.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$RaceView$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/app/components/RaceView.module.css [app-ssr] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$Assets$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/Assets.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CustomizationModal$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/CustomizationModal.tsx [app-ssr] (ecmascript)");
;
;
;
;
;
;
;
const RaceView = ({ elapsed, ghostTime, customization, onComplete, isDrifting = false, isRunning, onPause, onResume })=>{
    const [scaleMax, setScaleMax] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(ghostTime ? ghostTime * 1.2 : 60000);
    const [showReturnWarning, setShowReturnWarning] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    // Track when user returns from drifting
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!isDrifting) {
        // Check if we were just drifting (you could use a ref for this or just check previous prop if using a class)
        // But since isDrifting is passed down, we'll trigger it when it becomes false
        // To avoid triggering on mount, we can use a small delay or a ref
        }
    }, [
        isDrifting
    ]);
    // Better way: use a ref to track previous drifting state
    const [wasDrifting, setWasDrifting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (wasDrifting && !isDrifting) {
            setShowReturnWarning(true);
            const timer = setTimeout(()=>setShowReturnWarning(false), 3000);
            return ()=>clearTimeout(timer);
        }
        setWasDrifting(isDrifting);
    }, [
        isDrifting,
        wasDrifting
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (ghostTime) {
            if (elapsed > ghostTime * 1.1) {
                setScaleMax(elapsed * 1.2);
            }
        } else {
            if (elapsed > scaleMax * 0.8) {
                setScaleMax(scaleMax * 2);
            }
        }
    }, [
        elapsed,
        ghostTime,
        scaleMax
    ]);
    const userProgress = Math.min(elapsed / scaleMax * 100, 100);
    const ghostCurrentTime = ghostTime ? Math.min(elapsed, ghostTime) : 0;
    const ghostProgress = ghostTime ? ghostCurrentTime / scaleMax * 100 : 0;
    const timeDiff = ghostTime ? ghostTime - elapsed : 0;
    const isOvertime = timeDiff < 0;
    // perspective scaling function
    // 0% progress (horizon) -> scale 0.5 (visible)
    // 100% progress (near) -> scale 1.5
    const getScale = (progress)=>0.5 + progress / 100 * 2.0;
    // Always full opacity, use fog for distance effect instead
    const getOpacity = (progress)=>1;
    // Visual position mapping: Start at 10% (visible) to 95% (near camera)
    const getVisualTop = (progress)=>10 + progress / 100 * 85;
    // Tree Animation Logic
    // Trees spawn at center (50% 50%) and move OUT outwards and DOWN.
    // X goes from 50% to -20% (Left) or 120% (Right).
    // Y goes from 50% to 120%.
    // Scale goes from 0.1 to 1.5.
    // Blur goes from 0 to 5px (Motion blur).
    const treeVariantsLeft = {
        initial: {
            x: 0,
            y: 0,
            scale: 0.2,
            opacity: 0
        },
        animate: {
            x: -80,
            y: 800,
            scale: 4,
            opacity: [
                0,
                1,
                1,
                0
            ],
            transition: {
                duration: 2.5,
                repeat: Infinity,
                ease: "linear"
            }
        }
    };
    const treeVariantsRight = {
        initial: {
            x: 0,
            y: 0,
            scale: 0.2,
            opacity: 0
        },
        animate: {
            x: 80,
            y: 800,
            scale: 4,
            opacity: [
                0,
                1,
                1,
                0
            ],
            transition: {
                duration: 2.5,
                repeat: Infinity,
                ease: "linear"
            }
        }
    };
    // Mile Markers - every 5 minutes
    const targetDuration = ghostTime || 60000;
    const markerInterval = 5 * 60 * 1000;
    const markers = [];
    if (targetDuration > markerInterval) {
        for(let t = markerInterval; t < targetDuration; t += markerInterval){
            markers.push(t);
        }
    }
    const theme = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CustomizationModal$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TRACK_THEMES"][customization.trackTheme ?? 'cyber'] ?? __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CustomizationModal$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TRACK_THEMES"]['cyber'];
    // Focus milestone at 25 minutes
    const isMilestoneReached = elapsed >= 25 * 60 * 1000;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$RaceView$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].container,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$RaceView$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].envWrapper,
                style: {
                    background: theme.skyBackground
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: `${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$RaceView$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].horizonGlow} ${isMilestoneReached ? __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$RaceView$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].horizonMilestone : ''}`,
                        style: {
                            background: isMilestoneReached ? undefined : theme.horizonGlow
                        }
                    }, void 0, false, {
                        fileName: "[project]/app/components/RaceView.tsx",
                        lineNumber: 126,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$RaceView$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].starsLayerSlow,
                        style: {
                            animationPlayState: isRunning ? 'running' : 'paused'
                        }
                    }, void 0, false, {
                        fileName: "[project]/app/components/RaceView.tsx",
                        lineNumber: 132,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$RaceView$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].starsLayerFast,
                        style: {
                            animationPlayState: isRunning ? 'running' : 'paused'
                        }
                    }, void 0, false, {
                        fileName: "[project]/app/components/RaceView.tsx",
                        lineNumber: 133,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$RaceView$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].roadUnderGlow
                    }, void 0, false, {
                        fileName: "[project]/app/components/RaceView.tsx",
                        lineNumber: 136,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0)),
                    (isDrifting || showReturnWarning) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$RaceView$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].driftOverlay,
                        initial: {
                            opacity: 0
                        },
                        animate: {
                            opacity: 1
                        },
                        exit: {
                            opacity: 0
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$RaceView$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].driftText,
                            children: "STAY ON TRACK"
                        }, void 0, false, {
                            fileName: "[project]/app/components/RaceView.tsx",
                            lineNumber: 146,
                            columnNumber: 25
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/app/components/RaceView.tsx",
                        lineNumber: 140,
                        columnNumber: 21
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$RaceView$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].roadGroup,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$RaceView$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].roadFloor,
                                style: {
                                    borderLeftColor: theme.roadBorder,
                                    borderRightColor: theme.roadBorder,
                                    backgroundColor: theme.roadColor,
                                    boxShadow: `0 0 50px ${theme.glowColor}, inset 0 0 50px rgba(0,0,0,0.5)`,
                                    background: `linear-gradient(to bottom, ${theme.roadColor} 0%, ${theme.roadColor} 100%)`
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$RaceView$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].roadCenterLine,
                                        style: {
                                            animationPlayState: isRunning ? 'running' : 'paused'
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/RaceView.tsx",
                                        lineNumber: 162,
                                        columnNumber: 25
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$RaceView$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].guardrailLeft
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/RaceView.tsx",
                                        lineNumber: 164,
                                        columnNumber: 25
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$RaceView$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].guardrailRight
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/RaceView.tsx",
                                        lineNumber: 165,
                                        columnNumber: 25
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/RaceView.tsx",
                                lineNumber: 154,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0)),
                            [
                                0,
                                1,
                                2,
                                3,
                                4,
                                5
                            ].map((i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$RaceView$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].treeItem,
                                    style: {
                                        left: 'calc(50% - 450px)'
                                    },
                                    variants: treeVariantsLeft,
                                    initial: "initial",
                                    animate: "animate",
                                    transition: {
                                        duration: 2.5,
                                        repeat: Infinity,
                                        ease: "linear",
                                        delay: i * 0.4
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$RaceView$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].treeVisual,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$Assets$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GhostlyTreeIcon"], {}, void 0, false, {
                                            fileName: "[project]/app/components/RaceView.tsx",
                                            lineNumber: 179,
                                            columnNumber: 64
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/RaceView.tsx",
                                        lineNumber: 179,
                                        columnNumber: 29
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, `tree-l-${i}`, false, {
                                    fileName: "[project]/app/components/RaceView.tsx",
                                    lineNumber: 170,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0))),
                            [
                                0,
                                1,
                                2,
                                3,
                                4,
                                5
                            ].map((i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$RaceView$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].treeItem,
                                    style: {
                                        left: 'calc(50% + 450px)'
                                    },
                                    variants: treeVariantsRight,
                                    initial: "initial",
                                    animate: "animate",
                                    transition: {
                                        duration: 2.5,
                                        repeat: Infinity,
                                        ease: "linear",
                                        delay: i * 0.4 + 0.2
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$RaceView$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].treeVisual,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$Assets$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GhostlyTreeIcon"], {}, void 0, false, {
                                            fileName: "[project]/app/components/RaceView.tsx",
                                            lineNumber: 194,
                                            columnNumber: 64
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/RaceView.tsx",
                                        lineNumber: 194,
                                        columnNumber: 29
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, `tree-r-${i}`, false, {
                                    fileName: "[project]/app/components/RaceView.tsx",
                                    lineNumber: 185,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0))),
                            [
                                0,
                                1,
                                2,
                                3,
                                4,
                                5
                            ].map((i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$RaceView$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].neonGate,
                                    style: {
                                        top: '50%',
                                        left: 'calc(50% - 300px)'
                                    },
                                    variants: {
                                        initial: {
                                            x: 0,
                                            y: 0,
                                            scale: 0.12,
                                            opacity: 0
                                        },
                                        animate: {
                                            x: -320,
                                            y: 750,
                                            scale: 4,
                                            opacity: [
                                                0,
                                                1,
                                                1,
                                                0
                                            ],
                                            transition: {
                                                duration: 2.5,
                                                repeat: Infinity,
                                                ease: 'linear',
                                                delay: i * 0.4
                                            }
                                        }
                                    },
                                    initial: "initial",
                                    animate: "animate",
                                    transition: {
                                        duration: 2.5,
                                        repeat: Infinity,
                                        ease: 'linear',
                                        delay: i * 0.4
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$RaceView$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].neonGateBar
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/RaceView.tsx",
                                            lineNumber: 218,
                                            columnNumber: 29
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$RaceView$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].neonGatePost
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/RaceView.tsx",
                                            lineNumber: 219,
                                            columnNumber: 29
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, `gate-l-${i}`, true, {
                                    fileName: "[project]/app/components/RaceView.tsx",
                                    lineNumber: 200,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0))),
                            [
                                0,
                                1,
                                2,
                                3,
                                4,
                                5
                            ].map((i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$RaceView$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].neonGate,
                                    style: {
                                        top: '50%',
                                        left: 'calc(50% + 300px)'
                                    },
                                    variants: {
                                        initial: {
                                            x: 0,
                                            y: 0,
                                            scale: 0.12,
                                            opacity: 0
                                        },
                                        animate: {
                                            x: 320,
                                            y: 750,
                                            scale: 4,
                                            opacity: [
                                                0,
                                                1,
                                                1,
                                                0
                                            ],
                                            transition: {
                                                duration: 2.5,
                                                repeat: Infinity,
                                                ease: 'linear',
                                                delay: i * 0.4 + 0.2
                                            }
                                        }
                                    },
                                    initial: "initial",
                                    animate: "animate",
                                    transition: {
                                        duration: 2.5,
                                        repeat: Infinity,
                                        ease: 'linear',
                                        delay: i * 0.4 + 0.2
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$RaceView$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].neonGateBar
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/RaceView.tsx",
                                            lineNumber: 243,
                                            columnNumber: 29
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$RaceView$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].neonGatePost
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/RaceView.tsx",
                                            lineNumber: 244,
                                            columnNumber: 29
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, `gate-r-${i}`, true, {
                                    fileName: "[project]/app/components/RaceView.tsx",
                                    lineNumber: 225,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0))),
                            [
                                0,
                                1,
                                2,
                                3,
                                4,
                                5,
                                6
                            ].map((i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$RaceView$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].lightPole,
                                    style: {
                                        top: '50%',
                                        left: 'calc(50% - 300px)'
                                    },
                                    variants: {
                                        initial: {
                                            x: 0,
                                            y: 0,
                                            scale: 0.08,
                                            opacity: 0
                                        },
                                        animate: {
                                            x: -420,
                                            y: 900,
                                            scale: 5,
                                            opacity: [
                                                0,
                                                0.9,
                                                0.9,
                                                0
                                            ],
                                            transition: {
                                                duration: 2.2,
                                                repeat: Infinity,
                                                ease: 'linear',
                                                delay: i * 0.31
                                            }
                                        }
                                    },
                                    initial: "initial",
                                    animate: "animate",
                                    transition: {
                                        duration: 2.2,
                                        repeat: Infinity,
                                        ease: 'linear',
                                        delay: i * 0.31
                                    }
                                }, `pole-l-${i}`, false, {
                                    fileName: "[project]/app/components/RaceView.tsx",
                                    lineNumber: 250,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0))),
                            [
                                0,
                                1,
                                2,
                                3,
                                4,
                                5,
                                6
                            ].map((i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$RaceView$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].lightPole,
                                    style: {
                                        top: '50%',
                                        left: 'calc(50% + 300px)'
                                    },
                                    variants: {
                                        initial: {
                                            x: 0,
                                            y: 0,
                                            scale: 0.08,
                                            opacity: 0
                                        },
                                        animate: {
                                            x: 420,
                                            y: 900,
                                            scale: 5,
                                            opacity: [
                                                0,
                                                0.9,
                                                0.9,
                                                0
                                            ],
                                            transition: {
                                                duration: 2.2,
                                                repeat: Infinity,
                                                ease: 'linear',
                                                delay: i * 0.31 + 0.15
                                            }
                                        }
                                    },
                                    initial: "initial",
                                    animate: "animate",
                                    transition: {
                                        duration: 2.2,
                                        repeat: Infinity,
                                        ease: 'linear',
                                        delay: i * 0.31 + 0.15
                                    }
                                }, `pole-r-${i}`, false, {
                                    fileName: "[project]/app/components/RaceView.tsx",
                                    lineNumber: 272,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0)))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/RaceView.tsx",
                        lineNumber: 153,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$RaceView$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].vehicleOverlay,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$RaceView$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].roadVehicle,
                                style: {
                                    bottom: `${2 + userProgress / 100 * 28}%`,
                                    left: isDrifting ? '10%' : '25%',
                                    transform: `translate(-50%, 0) scale(${getScale(userProgress)})`,
                                    transition: 'left 2s ease-out, bottom 0.15s linear'
                                },
                                animate: {
                                    y: [
                                        0,
                                        -6,
                                        0
                                    ]
                                },
                                transition: {
                                    y: {
                                        duration: 2.5,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$RaceView$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].reflection,
                                        style: {
                                            opacity: 0.3,
                                            transform: 'scaleY(-0.4)',
                                            filter: 'blur(2px)'
                                        },
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$Assets$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CarIcon"], {
                                            color: customization.carColor,
                                            width: 140,
                                            height: 93
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/RaceView.tsx",
                                            lineNumber: 315,
                                            columnNumber: 29
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/RaceView.tsx",
                                        lineNumber: 314,
                                        columnNumber: 25
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$RaceView$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].carGroundShadow
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/RaceView.tsx",
                                        lineNumber: 319,
                                        columnNumber: 25
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: isDrifting ? __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$RaceView$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].carSpinning : '',
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$Assets$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CarIcon"], {
                                            color: customization.carColor,
                                            width: 140,
                                            height: 93
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/RaceView.tsx",
                                            lineNumber: 323,
                                            columnNumber: 29
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/RaceView.tsx",
                                        lineNumber: 322,
                                        columnNumber: 25
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/RaceView.tsx",
                                lineNumber: 298,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0)),
                            ghostTime && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$RaceView$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].roadVehicle,
                                style: {
                                    bottom: `${2 + ghostProgress / 100 * 28}%`,
                                    left: '62%',
                                    transform: `translate(-50%, 0) scale(${getScale(ghostProgress)})`
                                },
                                animate: {
                                    y: [
                                        0,
                                        -8,
                                        0
                                    ]
                                },
                                transition: {
                                    y: {
                                        duration: 3.5,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$RaceView$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].reflection,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$Assets$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GhostIcon"], {
                                            type: customization.ghostType,
                                            opacity: 0.3
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/RaceView.tsx",
                                            lineNumber: 345,
                                            columnNumber: 33
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/RaceView.tsx",
                                        lineNumber: 344,
                                        columnNumber: 29
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$RaceView$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].ghostGlow,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$Assets$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GhostIcon"], {
                                            type: customization.ghostType,
                                            opacity: 0.9
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/RaceView.tsx",
                                            lineNumber: 350,
                                            columnNumber: 33
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/RaceView.tsx",
                                        lineNumber: 349,
                                        columnNumber: 29
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/RaceView.tsx",
                                lineNumber: 329,
                                columnNumber: 25
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/RaceView.tsx",
                        lineNumber: 294,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/RaceView.tsx",
                lineNumber: 124,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$RaceView$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].timer} ${ghostTime ? isOvertime ? __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$RaceView$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].timerWinning : __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$RaceView$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].timerLosing : ''} ${isDrifting || showReturnWarning ? __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$RaceView$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].timerDrifting : ''}`,
                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$time$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatTime"])(elapsed)
            }, void 0, false, {
                fileName: "[project]/app/components/RaceView.tsx",
                lineNumber: 359,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$RaceView$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].dashboardPanel,
                children: [
                    ghostTime !== null && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$RaceView$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].leadIndicator,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: isOvertime ? __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$RaceView$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].leadPositive : __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$RaceView$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].leadNegative,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$RaceView$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].leadSign,
                                    children: isOvertime ? '+' : '-'
                                }, void 0, false, {
                                    fileName: "[project]/app/components/RaceView.tsx",
                                    lineNumber: 370,
                                    columnNumber: 29
                                }, ("TURBOPACK compile-time value", void 0)),
                                (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$time$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatTime"])(Math.abs(timeDiff))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/RaceView.tsx",
                            lineNumber: 369,
                            columnNumber: 25
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/app/components/RaceView.tsx",
                        lineNumber: 368,
                        columnNumber: 21
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>onComplete(true),
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$RaceView$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].completeBtn,
                        children: "Complete Task"
                    }, void 0, false, {
                        fileName: "[project]/app/components/RaceView.tsx",
                        lineNumber: 375,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$RaceView$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].secondaryActions,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: isRunning ? onPause : onResume,
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$RaceView$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].pauseBtn,
                                children: isRunning ? 'PAUSE' : 'RESUME'
                            }, void 0, false, {
                                fileName: "[project]/app/components/RaceView.tsx",
                                lineNumber: 383,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>{
                                    if (confirm("Are you sure you want to cancel? This session's time will not be saved.")) {
                                        onComplete(false);
                                    }
                                },
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$RaceView$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].cancelAction,
                                children: "✕ Cancel"
                            }, void 0, false, {
                                fileName: "[project]/app/components/RaceView.tsx",
                                lineNumber: 390,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/RaceView.tsx",
                        lineNumber: 382,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/RaceView.tsx",
                lineNumber: 365,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/RaceView.tsx",
        lineNumber: 121,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
}),
"[project]/app/components/ResultModal.module.css [app-ssr] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "continueBtn": "ResultModal-module__VnVcmG__continueBtn",
  "fadeIn": "ResultModal-module__VnVcmG__fadeIn",
  "iconCircle": "ResultModal-module__VnVcmG__iconCircle",
  "iconContainer": "ResultModal-module__VnVcmG__iconContainer",
  "levelProgressBar": "ResultModal-module__VnVcmG__levelProgressBar",
  "levelProgressFill": "ResultModal-module__VnVcmG__levelProgressFill",
  "levelRow": "ResultModal-module__VnVcmG__levelRow",
  "levelSection": "ResultModal-module__VnVcmG__levelSection",
  "levelTag": "ResultModal-module__VnVcmG__levelTag",
  "levelTitle": "ResultModal-module__VnVcmG__levelTitle",
  "levelUpLabel": "ResultModal-module__VnVcmG__levelUpLabel",
  "levelXpText": "ResultModal-module__VnVcmG__levelXpText",
  "loseIcon": "ResultModal-module__VnVcmG__loseIcon",
  "modal": "ResultModal-module__VnVcmG__modal",
  "modalWin": "ResultModal-module__VnVcmG__modalWin",
  "overlay": "ResultModal-module__VnVcmG__overlay",
  "statCard": "ResultModal-module__VnVcmG__statCard",
  "statLabel": "ResultModal-module__VnVcmG__statLabel",
  "statValue": "ResultModal-module__VnVcmG__statValue",
  "statsGrid": "ResultModal-module__VnVcmG__statsGrid",
  "subtitle": "ResultModal-module__VnVcmG__subtitle",
  "title": "ResultModal-module__VnVcmG__title",
  "winIcon": "ResultModal-module__VnVcmG__winIcon",
});
}),
"[project]/app/components/ResultModal.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ResultModal",
    ()=>ResultModal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$time$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/utils/time.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$ghostService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/services/ghostService.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ResultModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/app/components/ResultModal.module.css [app-ssr] (css module)");
;
;
;
;
;
const ResultModal = ({ duration, ghostTime, fuelGained, onClose, totalXpEarned, taskLabel })=>{
    const isWin = ghostTime ? duration > ghostTime : true;
    const diff = ghostTime ? Math.abs(duration - ghostTime) : 0;
    const currentLevelInfo = totalXpEarned != null ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$ghostService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getLevelInfo"])(totalXpEarned) : null;
    const prevLevelInfo = totalXpEarned != null ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$ghostService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getLevelInfo"])(totalXpEarned - fuelGained) : null;
    const didLevelUp = currentLevelInfo && prevLevelInfo && currentLevelInfo.level > prevLevelInfo.level;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ResultModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].overlay,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
            initial: {
                scale: 0.9,
                opacity: 0
            },
            animate: {
                scale: 1,
                opacity: 1
            },
            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ResultModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].modal,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ResultModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].iconContainer,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: `${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ResultModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].iconCircle} ${isWin ? __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ResultModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].winIcon : __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ResultModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].loseIcon}`,
                        children: isWin ? '🏆' : '👻'
                    }, void 0, false, {
                        fileName: "[project]/app/components/ResultModal.tsx",
                        lineNumber: 31,
                        columnNumber: 21
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/app/components/ResultModal.tsx",
                    lineNumber: 30,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ResultModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].title,
                    children: isWin ? 'New Personal Best!' : 'Ghost Won'
                }, void 0, false, {
                    fileName: "[project]/app/components/ResultModal.tsx",
                    lineNumber: 36,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                taskLabel && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    style: {
                        fontSize: '0.7rem',
                        color: 'rgba(255,255,255,0.35)',
                        letterSpacing: '0.12em',
                        marginTop: '-0.25rem',
                        marginBottom: '0.25rem'
                    },
                    children: taskLabel
                }, void 0, false, {
                    fileName: "[project]/app/components/ResultModal.tsx",
                    lineNumber: 41,
                    columnNumber: 21
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ResultModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].subtitle,
                    children: isWin && ghostTime ? `You flowed for ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$time$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatTime"])(diff)} longer!` : !ghostTime ? "First flow session recorded." : "Try to flow longer next time."
                }, void 0, false, {
                    fileName: "[project]/app/components/ResultModal.tsx",
                    lineNumber: 46,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ResultModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].statsGrid,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ResultModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].statCard,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ResultModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].statLabel,
                                    children: "Fuel Earned"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/ResultModal.tsx",
                                    lineNumber: 56,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ResultModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].statValue,
                                    style: {
                                        color: '#00E5FF'
                                    },
                                    children: [
                                        "+",
                                        fuelGained,
                                        " XP"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/ResultModal.tsx",
                                    lineNumber: 57,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/ResultModal.tsx",
                            lineNumber: 55,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ResultModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].statCard,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ResultModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].statLabel,
                                    children: "Your Time"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/ResultModal.tsx",
                                    lineNumber: 60,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ResultModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].statValue,
                                    children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$time$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatTime"])(duration)
                                }, void 0, false, {
                                    fileName: "[project]/app/components/ResultModal.tsx",
                                    lineNumber: 61,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/ResultModal.tsx",
                            lineNumber: 59,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/ResultModal.tsx",
                    lineNumber: 54,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                currentLevelInfo && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ResultModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].levelSection,
                    children: [
                        didLevelUp && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ResultModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].levelUpLabel,
                            initial: {
                                opacity: 0,
                                scale: 0.5
                            },
                            animate: {
                                opacity: 1,
                                scale: 1
                            },
                            transition: {
                                duration: 0.5,
                                type: 'spring',
                                stiffness: 200
                            },
                            children: "⚡ LEVEL UP!"
                        }, void 0, false, {
                            fileName: "[project]/app/components/ResultModal.tsx",
                            lineNumber: 68,
                            columnNumber: 29
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ResultModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].levelRow,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ResultModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].levelTag,
                                    children: [
                                        "LVL ",
                                        currentLevelInfo.level
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/ResultModal.tsx",
                                    lineNumber: 78,
                                    columnNumber: 29
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ResultModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].levelTitle,
                                    children: currentLevelInfo.title.toUpperCase()
                                }, void 0, false, {
                                    fileName: "[project]/app/components/ResultModal.tsx",
                                    lineNumber: 79,
                                    columnNumber: 29
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/ResultModal.tsx",
                            lineNumber: 77,
                            columnNumber: 25
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ResultModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].levelProgressBar,
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ResultModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].levelProgressFill,
                                initial: {
                                    width: 0
                                },
                                animate: {
                                    width: `${currentLevelInfo.progress * 100}%`
                                },
                                transition: {
                                    duration: 1.2,
                                    ease: 'easeOut',
                                    delay: 0.5
                                }
                            }, void 0, false, {
                                fileName: "[project]/app/components/ResultModal.tsx",
                                lineNumber: 82,
                                columnNumber: 29
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/app/components/ResultModal.tsx",
                            lineNumber: 81,
                            columnNumber: 25
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ResultModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].levelXpText,
                            children: currentLevelInfo.xpForNext ? `${currentLevelInfo.currentXp} / ${currentLevelInfo.xpForNext} XP to next level` : 'MAX LEVEL REACHED'
                        }, void 0, false, {
                            fileName: "[project]/app/components/ResultModal.tsx",
                            lineNumber: 89,
                            columnNumber: 25
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/ResultModal.tsx",
                    lineNumber: 66,
                    columnNumber: 21
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: onClose,
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ResultModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].continueBtn,
                    children: "Continue"
                }, void 0, false, {
                    fileName: "[project]/app/components/ResultModal.tsx",
                    lineNumber: 97,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/app/components/ResultModal.tsx",
            lineNumber: 25,
            columnNumber: 13
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/app/components/ResultModal.tsx",
        lineNumber: 24,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
}),
"[project]/app/components/Background3D.module.css [app-ssr] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "blurred": "Background3D-module__-ZvwOa__blurred",
  "dashSpeedLineBg": "Background3D-module__-ZvwOa__dashSpeedLineBg",
  "envWrapper": "Background3D-module__-ZvwOa__envWrapper",
  "lightPole": "Background3D-module__-ZvwOa__lightPole",
  "moveRoadLine": "Background3D-module__-ZvwOa__moveRoadLine",
  "neonGate": "Background3D-module__-ZvwOa__neonGate",
  "neonGateBar": "Background3D-module__-ZvwOa__neonGateBar",
  "neonGatePost": "Background3D-module__-ZvwOa__neonGatePost",
  "roadCenterLine": "Background3D-module__-ZvwOa__roadCenterLine",
  "roadFloor": "Background3D-module__-ZvwOa__roadFloor",
  "roadGroup": "Background3D-module__-ZvwOa__roadGroup",
  "speedLine": "Background3D-module__-ZvwOa__speedLine",
  "speedLinesOverlay": "Background3D-module__-ZvwOa__speedLinesOverlay",
  "treeItem": "Background3D-module__-ZvwOa__treeItem",
  "treeVisual": "Background3D-module__-ZvwOa__treeVisual",
});
}),
"[project]/app/components/Background3D.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Background3D",
    ()=>Background3D
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$Background3D$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/app/components/Background3D.module.css [app-ssr] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$Assets$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/Assets.tsx [app-ssr] (ecmascript)");
;
;
;
;
const Background3D = ({ blur = false })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$Background3D$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].envWrapper} ${blur ? __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$Background3D$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].blurred : ''}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$Background3D$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].speedLinesOverlay,
                children: [
                    Array.from({
                        length: 13
                    }, (_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$Background3D$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].speedLine,
                            style: {
                                '--angle': `${100 + i * 6}deg`,
                                '--delay': `${-(i * 0.13)}s`,
                                '--dur': `${1.0 + i * 0.04}s`,
                                '--len': `${150 + i * 20}px`
                            }
                        }, `sl-l-${i}`, false, {
                            fileName: "[project]/app/components/Background3D.tsx",
                            lineNumber: 16,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0))),
                    Array.from({
                        length: 13
                    }, (_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$Background3D$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].speedLine,
                            style: {
                                '--angle': `${80 - i * 6}deg`,
                                '--delay': `${-(i * 0.13 + 0.06)}s`,
                                '--dur': `${1.0 + i * 0.04}s`,
                                '--len': `${150 + i * 20}px`
                            }
                        }, `sl-r-${i}`, false, {
                            fileName: "[project]/app/components/Background3D.tsx",
                            lineNumber: 29,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0)))
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/Background3D.tsx",
                lineNumber: 13,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$Background3D$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].roadGroup,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$Background3D$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].roadFloor,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$Background3D$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].roadCenterLine
                        }, void 0, false, {
                            fileName: "[project]/app/components/Background3D.tsx",
                            lineNumber: 44,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/app/components/Background3D.tsx",
                        lineNumber: 43,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0)),
                    [
                        0,
                        1,
                        2,
                        3
                    ].map((i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$Background3D$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].treeItem,
                            style: {
                                left: 'calc(50% - 220px)'
                            },
                            variants: {
                                initial: {
                                    x: 0,
                                    y: 0,
                                    scale: 0.5,
                                    opacity: 0
                                },
                                animate: {
                                    x: -50,
                                    y: 800,
                                    scale: 3,
                                    opacity: [
                                        0,
                                        1,
                                        1,
                                        0
                                    ],
                                    transition: {
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: "linear",
                                        delay: i * 0.5
                                    }
                                }
                            },
                            initial: "initial",
                            animate: "animate",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$Background3D$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].treeVisual,
                                style: {
                                    opacity: 1
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$Assets$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GhostlyTreeIcon"], {}, void 0, false, {
                                    fileName: "[project]/app/components/Background3D.tsx",
                                    lineNumber: 66,
                                    columnNumber: 83
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/app/components/Background3D.tsx",
                                lineNumber: 66,
                                columnNumber: 25
                            }, ("TURBOPACK compile-time value", void 0))
                        }, `tree-l-${i}`, false, {
                            fileName: "[project]/app/components/Background3D.tsx",
                            lineNumber: 49,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0))),
                    [
                        0,
                        1,
                        2,
                        3
                    ].map((i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$Background3D$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].treeItem,
                            style: {
                                left: 'calc(50% + 220px)'
                            },
                            variants: {
                                initial: {
                                    x: 0,
                                    y: 0,
                                    scale: 0.5,
                                    opacity: 0
                                },
                                animate: {
                                    x: 50,
                                    y: 800,
                                    scale: 3,
                                    opacity: [
                                        0,
                                        1,
                                        1,
                                        0
                                    ],
                                    transition: {
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: "linear",
                                        delay: i * 0.5 + 0.25
                                    }
                                }
                            },
                            initial: "initial",
                            animate: "animate",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$Background3D$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].treeVisual,
                                style: {
                                    opacity: 1
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$Assets$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GhostlyTreeIcon"], {}, void 0, false, {
                                    fileName: "[project]/app/components/Background3D.tsx",
                                    lineNumber: 89,
                                    columnNumber: 83
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/app/components/Background3D.tsx",
                                lineNumber: 89,
                                columnNumber: 25
                            }, ("TURBOPACK compile-time value", void 0))
                        }, `tree-r-${i}`, false, {
                            fileName: "[project]/app/components/Background3D.tsx",
                            lineNumber: 72,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0))),
                    [
                        0,
                        1,
                        2,
                        3
                    ].map((i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$Background3D$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].neonGate,
                            style: {
                                top: '50%',
                                left: 'calc(50% - 170px)'
                            },
                            variants: {
                                initial: {
                                    x: 0,
                                    y: 0,
                                    scale: 0.12,
                                    opacity: 0
                                },
                                animate: {
                                    x: -200,
                                    y: 750,
                                    scale: 4,
                                    opacity: [
                                        0,
                                        1,
                                        1,
                                        0
                                    ],
                                    transition: {
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: 'linear',
                                        delay: i * 0.5
                                    }
                                }
                            },
                            initial: "initial",
                            animate: "animate",
                            transition: {
                                duration: 2,
                                repeat: Infinity,
                                ease: 'linear',
                                delay: i * 0.5
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$Background3D$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].neonGateBar
                                }, void 0, false, {
                                    fileName: "[project]/app/components/Background3D.tsx",
                                    lineNumber: 113,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$Background3D$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].neonGatePost
                                }, void 0, false, {
                                    fileName: "[project]/app/components/Background3D.tsx",
                                    lineNumber: 114,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, `gate-l-${i}`, true, {
                            fileName: "[project]/app/components/Background3D.tsx",
                            lineNumber: 95,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0))),
                    [
                        0,
                        1,
                        2,
                        3
                    ].map((i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$Background3D$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].neonGate,
                            style: {
                                top: '50%',
                                left: 'calc(50% + 170px)'
                            },
                            variants: {
                                initial: {
                                    x: 0,
                                    y: 0,
                                    scale: 0.12,
                                    opacity: 0
                                },
                                animate: {
                                    x: 200,
                                    y: 750,
                                    scale: 4,
                                    opacity: [
                                        0,
                                        1,
                                        1,
                                        0
                                    ],
                                    transition: {
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: 'linear',
                                        delay: i * 0.5 + 0.25
                                    }
                                }
                            },
                            initial: "initial",
                            animate: "animate",
                            transition: {
                                duration: 2,
                                repeat: Infinity,
                                ease: 'linear',
                                delay: i * 0.5 + 0.25
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$Background3D$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].neonGateBar
                                }, void 0, false, {
                                    fileName: "[project]/app/components/Background3D.tsx",
                                    lineNumber: 138,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$Background3D$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].neonGatePost
                                }, void 0, false, {
                                    fileName: "[project]/app/components/Background3D.tsx",
                                    lineNumber: 139,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, `gate-r-${i}`, true, {
                            fileName: "[project]/app/components/Background3D.tsx",
                            lineNumber: 120,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0))),
                    [
                        0,
                        1,
                        2,
                        3,
                        4,
                        5
                    ].map((i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$Background3D$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].lightPole,
                            style: {
                                top: '50%',
                                left: 'calc(50% - 220px)'
                            },
                            variants: {
                                initial: {
                                    x: 0,
                                    y: 0,
                                    scale: 0.08,
                                    opacity: 0
                                },
                                animate: {
                                    x: -320,
                                    y: 800,
                                    scale: 5,
                                    opacity: [
                                        0,
                                        0.9,
                                        0.9,
                                        0
                                    ],
                                    transition: {
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: 'linear',
                                        delay: i * 0.33
                                    }
                                }
                            },
                            initial: "initial",
                            animate: "animate",
                            transition: {
                                duration: 2,
                                repeat: Infinity,
                                ease: 'linear',
                                delay: i * 0.33
                            }
                        }, `pole-l-${i}`, false, {
                            fileName: "[project]/app/components/Background3D.tsx",
                            lineNumber: 145,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0))),
                    [
                        0,
                        1,
                        2,
                        3,
                        4,
                        5
                    ].map((i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$Background3D$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].lightPole,
                            style: {
                                top: '50%',
                                left: 'calc(50% + 220px)'
                            },
                            variants: {
                                initial: {
                                    x: 0,
                                    y: 0,
                                    scale: 0.08,
                                    opacity: 0
                                },
                                animate: {
                                    x: 320,
                                    y: 800,
                                    scale: 5,
                                    opacity: [
                                        0,
                                        0.9,
                                        0.9,
                                        0
                                    ],
                                    transition: {
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: 'linear',
                                        delay: i * 0.33 + 0.16
                                    }
                                }
                            },
                            initial: "initial",
                            animate: "animate",
                            transition: {
                                duration: 2,
                                repeat: Infinity,
                                ease: 'linear',
                                delay: i * 0.33 + 0.16
                            }
                        }, `pole-r-${i}`, false, {
                            fileName: "[project]/app/components/Background3D.tsx",
                            lineNumber: 167,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0)))
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/Background3D.tsx",
                lineNumber: 42,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/Background3D.tsx",
        lineNumber: 11,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
}),
"[project]/app/components/ThemeToggle.module.css [app-ssr] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "active": "ThemeToggle-module__b1g1DG__active",
  "hidden": "ThemeToggle-module__b1g1DG__hidden",
  "icon": "ThemeToggle-module__b1g1DG__icon",
  "iconWrapper": "ThemeToggle-module__b1g1DG__iconWrapper",
  "toggleButton": "ThemeToggle-module__b1g1DG__toggleButton",
});
}),
"[project]/app/components/ThemeToggle.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThemeToggle",
    ()=>ThemeToggle
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ThemeToggle$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/app/components/ThemeToggle.module.css [app-ssr] (css module)");
"use client";
;
;
;
function ThemeToggle() {
    const [theme, setTheme] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("dark");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const saved = localStorage.getItem("mindflow-theme");
        if (saved) {
            setTheme(saved);
            document.documentElement.setAttribute("data-theme", saved);
        }
    }, []);
    const toggle = ()=>{
        const next = theme === "dark" ? "light" : "dark";
        setTheme(next);
        document.documentElement.setAttribute("data-theme", next);
        localStorage.setItem("mindflow-theme", next);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ThemeToggle$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].toggleButton,
        onClick: toggle,
        "aria-label": `Switch to ${theme === "dark" ? "light" : "dark"} mode`,
        title: `Switch to ${theme === "dark" ? "light" : "dark"} mode`,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ThemeToggle$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].iconWrapper,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                    className: `${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ThemeToggle$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].icon} ${theme === "light" ? __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ThemeToggle$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].active : __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ThemeToggle$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].hidden}`,
                    viewBox: "0 0 24 24",
                    fill: "none",
                    stroke: "currentColor",
                    strokeWidth: "2",
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    style: {
                        color: theme === "light" ? "#D97706" : "var(--text-primary)"
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                            cx: "12",
                            cy: "12",
                            r: "5"
                        }, void 0, false, {
                            fileName: "[project]/app/components/ThemeToggle.tsx",
                            lineNumber: 43,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                            x1: "12",
                            y1: "1",
                            x2: "12",
                            y2: "3"
                        }, void 0, false, {
                            fileName: "[project]/app/components/ThemeToggle.tsx",
                            lineNumber: 44,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                            x1: "12",
                            y1: "21",
                            x2: "12",
                            y2: "23"
                        }, void 0, false, {
                            fileName: "[project]/app/components/ThemeToggle.tsx",
                            lineNumber: 45,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                            x1: "4.22",
                            y1: "4.22",
                            x2: "5.64",
                            y2: "5.64"
                        }, void 0, false, {
                            fileName: "[project]/app/components/ThemeToggle.tsx",
                            lineNumber: 46,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                            x1: "18.36",
                            y1: "18.36",
                            x2: "19.78",
                            y2: "19.78"
                        }, void 0, false, {
                            fileName: "[project]/app/components/ThemeToggle.tsx",
                            lineNumber: 47,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                            x1: "1",
                            y1: "12",
                            x2: "3",
                            y2: "12"
                        }, void 0, false, {
                            fileName: "[project]/app/components/ThemeToggle.tsx",
                            lineNumber: 48,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                            x1: "21",
                            y1: "12",
                            x2: "23",
                            y2: "12"
                        }, void 0, false, {
                            fileName: "[project]/app/components/ThemeToggle.tsx",
                            lineNumber: 49,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                            x1: "4.22",
                            y1: "19.78",
                            x2: "5.64",
                            y2: "18.36"
                        }, void 0, false, {
                            fileName: "[project]/app/components/ThemeToggle.tsx",
                            lineNumber: 50,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                            x1: "18.36",
                            y1: "5.64",
                            x2: "19.78",
                            y2: "4.22"
                        }, void 0, false, {
                            fileName: "[project]/app/components/ThemeToggle.tsx",
                            lineNumber: 51,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/ThemeToggle.tsx",
                    lineNumber: 33,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                    className: `${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ThemeToggle$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].icon} ${theme === "dark" ? __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ThemeToggle$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].active : __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ThemeToggle$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].hidden}`,
                    viewBox: "0 0 24 24",
                    fill: "none",
                    stroke: "currentColor",
                    strokeWidth: "2",
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    style: {
                        color: theme === "dark" ? "#00E5FF" : "var(--text-primary)"
                    },
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
                    }, void 0, false, {
                        fileName: "[project]/app/components/ThemeToggle.tsx",
                        lineNumber: 64,
                        columnNumber: 21
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/components/ThemeToggle.tsx",
                    lineNumber: 54,
                    columnNumber: 17
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/components/ThemeToggle.tsx",
            lineNumber: 31,
            columnNumber: 13
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/components/ThemeToggle.tsx",
        lineNumber: 25,
        columnNumber: 9
    }, this);
}
}),
"[project]/app/components/LevelBadge.module.css [app-ssr] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "badge": "LevelBadge-module__4NNTRq__badge",
  "clickable": "LevelBadge-module__4NNTRq__clickable",
  "details": "LevelBadge-module__4NNTRq__details",
  "dot": "LevelBadge-module__4NNTRq__dot",
  "levelCircle": "LevelBadge-module__4NNTRq__levelCircle",
  "levelLabel": "LevelBadge-module__4NNTRq__levelLabel",
  "levelNumber": "LevelBadge-module__4NNTRq__levelNumber",
  "levelTitle": "LevelBadge-module__4NNTRq__levelTitle",
  "progressBar": "LevelBadge-module__4NNTRq__progressBar",
  "progressFill": "LevelBadge-module__4NNTRq__progressFill",
  "titleRow": "LevelBadge-module__4NNTRq__titleRow",
  "xpText": "LevelBadge-module__4NNTRq__xpText",
});
}),
"[project]/app/components/LevelBadge.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LevelBadge",
    ()=>LevelBadge
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$ghostService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/services/ghostService.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$LevelBadge$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/app/components/LevelBadge.module.css [app-ssr] (css module)");
"use client";
;
;
;
;
;
const LevelBadge = ({ levelInfo: externalLevelInfo, onClick })=>{
    const [info, setInfo] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(externalLevelInfo || null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!externalLevelInfo) {
            setInfo(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$ghostService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GhostService"].getLevelInfo());
        }
    }, [
        externalLevelInfo
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (externalLevelInfo) {
            setInfo(externalLevelInfo);
        }
    }, [
        externalLevelInfo
    ]);
    if (!info) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$LevelBadge$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].badge} ${onClick ? __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$LevelBadge$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].clickable : ""}`,
        onClick: onClick,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$LevelBadge$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].levelCircle,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$LevelBadge$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].levelNumber,
                    children: info.level
                }, void 0, false, {
                    fileName: "[project]/app/components/LevelBadge.tsx",
                    lineNumber: 36,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/app/components/LevelBadge.tsx",
                lineNumber: 35,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$LevelBadge$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].details,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$LevelBadge$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].titleRow,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$LevelBadge$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].levelLabel,
                                children: [
                                    "LVL ",
                                    info.level
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/LevelBadge.tsx",
                                lineNumber: 40,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$LevelBadge$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].dot,
                                children: "·"
                            }, void 0, false, {
                                fileName: "[project]/app/components/LevelBadge.tsx",
                                lineNumber: 41,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$LevelBadge$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].levelTitle,
                                children: info.title.toUpperCase()
                            }, void 0, false, {
                                fileName: "[project]/app/components/LevelBadge.tsx",
                                lineNumber: 42,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/LevelBadge.tsx",
                        lineNumber: 39,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$LevelBadge$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].progressBar,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$LevelBadge$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].progressFill,
                            initial: {
                                width: 0
                            },
                            animate: {
                                width: `${info.progress * 100}%`
                            },
                            transition: {
                                duration: 1,
                                ease: "easeOut",
                                delay: 0.3
                            }
                        }, void 0, false, {
                            fileName: "[project]/app/components/LevelBadge.tsx",
                            lineNumber: 45,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/app/components/LevelBadge.tsx",
                        lineNumber: 44,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$LevelBadge$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].xpText,
                        children: info.xpForNext ? `${info.currentXp} / ${info.xpForNext} XP` : "MAX LEVEL"
                    }, void 0, false, {
                        fileName: "[project]/app/components/LevelBadge.tsx",
                        lineNumber: 52,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/LevelBadge.tsx",
                lineNumber: 38,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/LevelBadge.tsx",
        lineNumber: 31,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
}),
"[project]/app/components/LevelModal.module.css [app-ssr] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "activeTag": "LevelModal-module__cMrEIW__activeTag",
  "closeBtn": "LevelModal-module__cMrEIW__closeBtn",
  "current": "LevelModal-module__cMrEIW__current",
  "currentStats": "LevelModal-module__cMrEIW__currentStats",
  "header": "LevelModal-module__cMrEIW__header",
  "levelHeader": "LevelModal-module__cMrEIW__levelHeader",
  "levelHex": "LevelModal-module__cMrEIW__levelHex",
  "levelInfo": "LevelModal-module__cMrEIW__levelInfo",
  "levelItem": "LevelModal-module__cMrEIW__levelItem",
  "levelLine": "LevelModal-module__cMrEIW__levelLine",
  "levelList": "LevelModal-module__cMrEIW__levelList",
  "levelNumberContainer": "LevelModal-module__cMrEIW__levelNumberContainer",
  "levelTitle": "LevelModal-module__cMrEIW__levelTitle",
  "lockedIcon": "LevelModal-module__cMrEIW__lockedIcon",
  "modal": "LevelModal-module__cMrEIW__modal",
  "overlay": "LevelModal-module__cMrEIW__overlay",
  "progressBar": "LevelModal-module__cMrEIW__progressBar",
  "progressFill": "LevelModal-module__cMrEIW__progressFill",
  "reached": "LevelModal-module__cMrEIW__reached",
  "statBox": "LevelModal-module__cMrEIW__statBox",
  "statLabel": "LevelModal-module__cMrEIW__statLabel",
  "statValue": "LevelModal-module__cMrEIW__statValue",
  "xpRequirement": "LevelModal-module__cMrEIW__xpRequirement",
});
}),
"[project]/app/components/LevelModal.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LevelModal",
    ()=>LevelModal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$ghostService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/services/ghostService.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$LevelModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/app/components/LevelModal.module.css [app-ssr] (css module)");
"use client";
;
;
;
;
const LevelModal = ({ onClose })=>{
    const currentInfo = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$ghostService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GhostService"].getLevelInfo();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$LevelModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].overlay,
        initial: {
            opacity: 0
        },
        animate: {
            opacity: 1
        },
        exit: {
            opacity: 0
        },
        onClick: onClose,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$LevelModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].modal,
            initial: {
                scale: 0.9,
                opacity: 0,
                y: 20
            },
            animate: {
                scale: 1,
                opacity: 1,
                y: 0
            },
            exit: {
                scale: 0.9,
                opacity: 0,
                y: 20
            },
            onClick: (e)=>e.stopPropagation(),
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$LevelModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].header,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            children: "EVOLUTION PATH"
                        }, void 0, false, {
                            fileName: "[project]/app/components/LevelModal.tsx",
                            lineNumber: 30,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$LevelModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].closeBtn,
                            onClick: onClose,
                            children: "×"
                        }, void 0, false, {
                            fileName: "[project]/app/components/LevelModal.tsx",
                            lineNumber: 31,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/LevelModal.tsx",
                    lineNumber: 29,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$LevelModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].currentStats,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$LevelModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].statBox,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$LevelModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].statLabel,
                                    children: "CURRENT LEVEL"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/LevelModal.tsx",
                                    lineNumber: 36,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$LevelModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].statValue,
                                    children: currentInfo.level
                                }, void 0, false, {
                                    fileName: "[project]/app/components/LevelModal.tsx",
                                    lineNumber: 37,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/LevelModal.tsx",
                            lineNumber: 35,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$LevelModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].statBox,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$LevelModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].statLabel,
                                    children: "TOTAL XP"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/LevelModal.tsx",
                                    lineNumber: 40,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$LevelModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].statValue,
                                    children: currentInfo.totalXp
                                }, void 0, false, {
                                    fileName: "[project]/app/components/LevelModal.tsx",
                                    lineNumber: 41,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/LevelModal.tsx",
                            lineNumber: 39,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/LevelModal.tsx",
                    lineNumber: 34,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$LevelModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].levelList,
                    children: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$ghostService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LEVELS"].map((lvl)=>{
                        const isReached = currentInfo.totalXp >= lvl.xpRequired;
                        const isCurrent = currentInfo.level === lvl.level;
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: `${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$LevelModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].levelItem} ${isReached ? __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$LevelModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].reached : ""} ${isCurrent ? __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$LevelModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].current : ""}`,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$LevelModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].levelNumberContainer,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$LevelModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].levelLine
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/LevelModal.tsx",
                                            lineNumber: 56,
                                            columnNumber: 37
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$LevelModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].levelHex,
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: lvl.level
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/LevelModal.tsx",
                                                lineNumber: 58,
                                                columnNumber: 41
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/LevelModal.tsx",
                                            lineNumber: 57,
                                            columnNumber: 37
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/LevelModal.tsx",
                                    lineNumber: 55,
                                    columnNumber: 33
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$LevelModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].levelInfo,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$LevelModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].levelHeader,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$LevelModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].levelTitle,
                                                    children: lvl.title
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/LevelModal.tsx",
                                                    lineNumber: 63,
                                                    columnNumber: 41
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$LevelModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].xpRequirement,
                                                    children: [
                                                        lvl.xpRequired.toLocaleString(),
                                                        " XP"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/components/LevelModal.tsx",
                                                    lineNumber: 64,
                                                    columnNumber: 41
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/components/LevelModal.tsx",
                                            lineNumber: 62,
                                            columnNumber: 37
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        isCurrent && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$LevelModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].progressBar,
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$LevelModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].progressFill,
                                                style: {
                                                    width: `${currentInfo.progress * 100}%`
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/LevelModal.tsx",
                                                lineNumber: 70,
                                                columnNumber: 45
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/LevelModal.tsx",
                                            lineNumber: 69,
                                            columnNumber: 41
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/LevelModal.tsx",
                                    lineNumber: 61,
                                    columnNumber: 33
                                }, ("TURBOPACK compile-time value", void 0)),
                                isCurrent && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$LevelModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].activeTag,
                                    children: "ACTIVE"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/LevelModal.tsx",
                                    lineNumber: 77,
                                    columnNumber: 47
                                }, ("TURBOPACK compile-time value", void 0)),
                                !isReached && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$LevelModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].lockedIcon,
                                    children: "🔒"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/LevelModal.tsx",
                                    lineNumber: 78,
                                    columnNumber: 48
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, lvl.level, true, {
                            fileName: "[project]/app/components/LevelModal.tsx",
                            lineNumber: 51,
                            columnNumber: 29
                        }, ("TURBOPACK compile-time value", void 0));
                    })
                }, void 0, false, {
                    fileName: "[project]/app/components/LevelModal.tsx",
                    lineNumber: 45,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/app/components/LevelModal.tsx",
            lineNumber: 22,
            columnNumber: 13
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/app/components/LevelModal.tsx",
        lineNumber: 15,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
}),
"[project]/app/components/CalendarModal.module.css [app-ssr] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "addDayBtn": "CalendarModal-module__jOrN-q__addDayBtn",
  "addEntryBtn": "CalendarModal-module__jOrN-q__addEntryBtn",
  "addExamInput": "CalendarModal-module__jOrN-q__addExamInput",
  "addExamRow": "CalendarModal-module__jOrN-q__addExamRow",
  "addForm": "CalendarModal-module__jOrN-q__addForm",
  "addSubtaskInput": "CalendarModal-module__jOrN-q__addSubtaskInput",
  "addSubtaskRow": "CalendarModal-module__jOrN-q__addSubtaskRow",
  "closeBtn": "CalendarModal-module__jOrN-q__closeBtn",
  "dayCell": "CalendarModal-module__jOrN-q__dayCell",
  "dayName": "CalendarModal-module__jOrN-q__dayName",
  "dayNum": "CalendarModal-module__jOrN-q__dayNum",
  "deleteBtn": "CalendarModal-module__jOrN-q__deleteBtn",
  "deleteExamBtn": "CalendarModal-module__jOrN-q__deleteExamBtn",
  "deleteSubtaskBtn": "CalendarModal-module__jOrN-q__deleteSubtaskBtn",
  "detailDate": "CalendarModal-module__jOrN-q__detailDate",
  "detailHeader": "CalendarModal-module__jOrN-q__detailHeader",
  "detailHeaderRight": "CalendarModal-module__jOrN-q__detailHeaderRight",
  "detailPanel": "CalendarModal-module__jOrN-q__detailPanel",
  "detailTotal": "CalendarModal-module__jOrN-q__detailTotal",
  "emptyCell": "CalendarModal-module__jOrN-q__emptyCell",
  "examBadge": "CalendarModal-module__jOrN-q__examBadge",
  "examCard": "CalendarModal-module__jOrN-q__examCard",
  "examCheckboxContainer": "CalendarModal-module__jOrN-q__examCheckboxContainer",
  "examCheckboxRow": "CalendarModal-module__jOrN-q__examCheckboxRow",
  "examCompleted": "CalendarModal-module__jOrN-q__examCompleted",
  "examDot": "CalendarModal-module__jOrN-q__examDot",
  "examHeader": "CalendarModal-module__jOrN-q__examHeader",
  "examList": "CalendarModal-module__jOrN-q__examList",
  "examTitle": "CalendarModal-module__jOrN-q__examTitle",
  "formField": "CalendarModal-module__jOrN-q__formField",
  "formInput": "CalendarModal-module__jOrN-q__formInput",
  "formLabel": "CalendarModal-module__jOrN-q__formLabel",
  "formRow": "CalendarModal-module__jOrN-q__formRow",
  "goalDuration": "CalendarModal-module__jOrN-q__goalDuration",
  "goalEntry": "CalendarModal-module__jOrN-q__goalEntry",
  "header": "CalendarModal-module__jOrN-q__header",
  "headerActions": "CalendarModal-module__jOrN-q__headerActions",
  "headerTab": "CalendarModal-module__jOrN-q__headerTab",
  "headerTabActive": "CalendarModal-module__jOrN-q__headerTabActive",
  "headerTabs": "CalendarModal-module__jOrN-q__headerTabs",
  "intensity0": "CalendarModal-module__jOrN-q__intensity0",
  "intensity1": "CalendarModal-module__jOrN-q__intensity1",
  "intensity2": "CalendarModal-module__jOrN-q__intensity2",
  "intensity3": "CalendarModal-module__jOrN-q__intensity3",
  "intensity4": "CalendarModal-module__jOrN-q__intensity4",
  "legend": "CalendarModal-module__jOrN-q__legend",
  "legendDot": "CalendarModal-module__jOrN-q__legendDot",
  "legendLabel": "CalendarModal-module__jOrN-q__legendLabel",
  "manualBadge": "CalendarModal-module__jOrN-q__manualBadge",
  "manualEntry": "CalendarModal-module__jOrN-q__manualEntry",
  "modal": "CalendarModal-module__jOrN-q__modal",
  "monthGrid": "CalendarModal-module__jOrN-q__monthGrid",
  "nav": "CalendarModal-module__jOrN-q__nav",
  "navBtn": "CalendarModal-module__jOrN-q__navBtn",
  "navLabel": "CalendarModal-module__jOrN-q__navLabel",
  "noData": "CalendarModal-module__jOrN-q__noData",
  "noSession": "CalendarModal-module__jOrN-q__noSession",
  "overlay": "CalendarModal-module__jOrN-q__overlay",
  "saveExamBtn": "CalendarModal-module__jOrN-q__saveExamBtn",
  "sectionLabel": "CalendarModal-module__jOrN-q__sectionLabel",
  "selectedDay": "CalendarModal-module__jOrN-q__selectedDay",
  "sessionDot": "CalendarModal-module__jOrN-q__sessionDot",
  "sessionDuration": "CalendarModal-module__jOrN-q__sessionDuration",
  "sessionItem": "CalendarModal-module__jOrN-q__sessionItem",
  "sessionLeft": "CalendarModal-module__jOrN-q__sessionLeft",
  "sessionList": "CalendarModal-module__jOrN-q__sessionList",
  "sessionNote": "CalendarModal-module__jOrN-q__sessionNote",
  "sessionRight": "CalendarModal-module__jOrN-q__sessionRight",
  "sessionTask": "CalendarModal-module__jOrN-q__sessionTask",
  "submitBtn": "CalendarModal-module__jOrN-q__submitBtn",
  "subtaskCheckboxContainer": "CalendarModal-module__jOrN-q__subtaskCheckboxContainer",
  "subtaskCompleted": "CalendarModal-module__jOrN-q__subtaskCompleted",
  "subtaskItem": "CalendarModal-module__jOrN-q__subtaskItem",
  "subtaskList": "CalendarModal-module__jOrN-q__subtaskList",
  "today": "CalendarModal-module__jOrN-q__today",
  "todayNum": "CalendarModal-module__jOrN-q__todayNum",
  "toggleActive": "CalendarModal-module__jOrN-q__toggleActive",
  "toggleBtn": "CalendarModal-module__jOrN-q__toggleBtn",
  "viewToggle": "CalendarModal-module__jOrN-q__viewToggle",
  "weekBar": "CalendarModal-module__jOrN-q__weekBar",
  "weekBarFill": "CalendarModal-module__jOrN-q__weekBarFill",
  "weekDay": "CalendarModal-module__jOrN-q__weekDay",
  "weekDayHeader": "CalendarModal-module__jOrN-q__weekDayHeader",
  "weekDayName": "CalendarModal-module__jOrN-q__weekDayName",
  "weekDayNum": "CalendarModal-module__jOrN-q__weekDayNum",
  "weekGoalHint": "CalendarModal-module__jOrN-q__weekGoalHint",
  "weekGrid": "CalendarModal-module__jOrN-q__weekGrid",
  "weekSessions": "CalendarModal-module__jOrN-q__weekSessions",
  "weekStats": "CalendarModal-module__jOrN-q__weekStats",
  "weekTime": "CalendarModal-module__jOrN-q__weekTime",
});
}),
"[project]/app/components/CalendarModal.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "CalendarModal",
    ()=>CalendarModal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$ghostService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/services/ghostService.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CalendarModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/app/components/CalendarModal.module.css [app-ssr] (css module)");
"use client";
;
;
;
;
;
const DAYS = [
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat"
];
const MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];
function formatDuration(ms) {
    const totalSec = Math.floor(ms / 1000);
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor(totalSec % 3600 / 60);
    const s = totalSec % 60;
    if (h > 0) return `${h}h ${m}m`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
}
function toDateKey(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
function friendlyDate(dateKey) {
    return new Date(dateKey + 'T12:00:00').toLocaleDateString('en', {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
    });
}
const CalendarModal = ({ onClose, onSwitchMode })=>{
    const [view, setView] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("month");
    const [cursor, setCursor] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(new Date());
    const [selectedDay, setSelectedDay] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    // Add-entry form state
    const [showAddForm, setShowAddForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [formTask, setFormTask] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [formHours, setFormHours] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("0");
    const [formMinutes, setFormMinutes] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("30");
    const [formNote, setFormNote] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [formDate, setFormDate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(toDateKey(new Date()));
    // Local sessions state so adds/deletes re-render instantly
    const [sessionsByDate, setSessionsByDate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$ghostService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GhostService"].getSessionsByDate());
    const refresh = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        setSessionsByDate(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$ghostService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GhostService"].getSessionsByDate());
    }, []);
    // ── MONTH helpers ─────────────────────────────────────────────
    const monthYear = {
        year: cursor.getFullYear(),
        month: cursor.getMonth()
    };
    const firstOfMonth = new Date(monthYear.year, monthYear.month, 1);
    const startOffset = firstOfMonth.getDay();
    const daysInMonth = new Date(monthYear.year, monthYear.month + 1, 0).getDate();
    const monthGrid = [
        ...Array(startOffset).fill(null),
        ...Array.from({
            length: daysInMonth
        }, (_, i)=>toDateKey(new Date(monthYear.year, monthYear.month, i + 1)))
    ];
    // ── WEEK helpers ──────────────────────────────────────────────
    const startOfWeek = new Date(cursor);
    startOfWeek.setDate(cursor.getDate() - cursor.getDay());
    const weekDays = Array.from({
        length: 7
    }, (_, i)=>{
        const d = new Date(startOfWeek);
        d.setDate(startOfWeek.getDate() + i);
        return {
            key: toDateKey(d),
            date: d
        };
    });
    // ── Navigation ────────────────────────────────────────────────
    const goBack = ()=>{
        const d = new Date(cursor);
        view === "month" ? d.setMonth(d.getMonth() - 1) : d.setDate(d.getDate() - 7);
        setCursor(d);
    };
    const goForward = ()=>{
        const d = new Date(cursor);
        view === "month" ? d.setMonth(d.getMonth() + 1) : d.setDate(d.getDate() + 7);
        setCursor(d);
    };
    const todayKey = toDateKey(new Date());
    // ── Split sessions from goals ──────────────────────────────────
    const getReal = (key)=>(sessionsByDate[key] || []).filter((s)=>!s.isManual);
    const getGoals = (key)=>(sessionsByDate[key] || []).filter((s)=>s.isManual);
    // ── Intensity based on REAL sessions only ─────────────────────
    const getIntensity = (key)=>{
        const real = getReal(key);
        if (real.length === 0) return 0;
        const totalMs = real.reduce((a, s)=>a + s.duration, 0);
        const mins = totalMs / 60000;
        if (mins >= 60) return 4;
        if (mins >= 30) return 3;
        if (mins >= 10) return 2;
        return 1;
    };
    // ── Header label ──────────────────────────────────────────────
    const headerLabel = view === "month" ? `${MONTHS[monthYear.month]} ${monthYear.year}` : `${weekDays[0].date.toLocaleDateString('en', {
        month: 'short',
        day: 'numeric'
    })} – ${weekDays[6].date.toLocaleDateString('en', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    })}`;
    const selectedReal = selectedDay ? getReal(selectedDay) : [];
    const selectedGoals = selectedDay ? getGoals(selectedDay) : [];
    // ── Add Entry ─────────────────────────────────────────────────
    const handleAddEntry = ()=>{
        const h = parseInt(formHours) || 0;
        const m = parseInt(formMinutes) || 0;
        const totalMs = (h * 60 + m) * 60 * 1000;
        if (!formTask.trim() || totalMs === 0) return;
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$ghostService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GhostService"].addCalendarEntry(formDate, formTask, totalMs, formNote || undefined);
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
    const handleDeleteGoal = (id)=>{
        if (!id) return;
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$ghostService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GhostService"].deleteCalendarEntry(id);
        refresh();
    };
    const handleDeleteRealSession = (taskId, at)=>{
        if (!taskId || !at) return;
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$ghostService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GhostService"].deleteAppSession(taskId, at);
        refresh();
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CalendarModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].overlay,
        initial: {
            opacity: 0
        },
        animate: {
            opacity: 1
        },
        exit: {
            opacity: 0
        },
        onClick: onClose,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CalendarModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].modal,
            initial: {
                scale: 0.92,
                opacity: 0,
                y: 20
            },
            animate: {
                scale: 1,
                opacity: 1,
                y: 0
            },
            exit: {
                scale: 0.92,
                opacity: 0,
                y: 20
            },
            onClick: (e)=>e.stopPropagation(),
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CalendarModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].header,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CalendarModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].headerTabs,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: `${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CalendarModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].headerTab} ${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CalendarModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].headerTabActive}`,
                                    children: "HISTORY"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/CalendarModal.tsx",
                                    lineNumber: 170,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CalendarModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].headerTab,
                                    onClick: onSwitchMode,
                                    children: "PLANNER"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/CalendarModal.tsx",
                                    lineNumber: 173,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/CalendarModal.tsx",
                            lineNumber: 169,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CalendarModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].headerActions,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CalendarModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].addEntryBtn,
                                    onClick: ()=>{
                                        setShowAddForm((v)=>!v);
                                        setFormDate(selectedDay || toDateKey(new Date()));
                                    },
                                    children: showAddForm ? "✕ Cancel" : "+ Add Entry"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/CalendarModal.tsx",
                                    lineNumber: 178,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CalendarModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].closeBtn,
                                    onClick: onClose,
                                    children: "×"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/CalendarModal.tsx",
                                    lineNumber: 184,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/CalendarModal.tsx",
                            lineNumber: 177,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/CalendarModal.tsx",
                    lineNumber: 168,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                    children: showAddForm && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CalendarModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].addForm,
                        initial: {
                            opacity: 0,
                            y: -8
                        },
                        animate: {
                            opacity: 1,
                            y: 0
                        },
                        exit: {
                            opacity: 0,
                            y: -8
                        },
                        transition: {
                            duration: 0.2
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CalendarModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].formRow,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CalendarModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].formField,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CalendarModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].formLabel,
                                                children: "Date"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/CalendarModal.tsx",
                                                lineNumber: 200,
                                                columnNumber: 37
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "date",
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CalendarModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].formInput,
                                                value: formDate,
                                                onChange: (e)=>setFormDate(e.target.value)
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/CalendarModal.tsx",
                                                lineNumber: 201,
                                                columnNumber: 37
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/CalendarModal.tsx",
                                        lineNumber: 199,
                                        columnNumber: 33
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CalendarModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].formField,
                                        style: {
                                            flex: 2
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CalendarModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].formLabel,
                                                children: "Task Name"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/CalendarModal.tsx",
                                                lineNumber: 209,
                                                columnNumber: 37
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "text",
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CalendarModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].formInput,
                                                placeholder: "e.g. Read chapter 3",
                                                value: formTask,
                                                onChange: (e)=>setFormTask(e.target.value),
                                                onKeyDown: (e)=>e.key === 'Enter' && handleAddEntry()
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/CalendarModal.tsx",
                                                lineNumber: 210,
                                                columnNumber: 37
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/CalendarModal.tsx",
                                        lineNumber: 208,
                                        columnNumber: 33
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/CalendarModal.tsx",
                                lineNumber: 198,
                                columnNumber: 29
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CalendarModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].formRow,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CalendarModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].formField,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CalendarModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].formLabel,
                                                children: "Hours"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/CalendarModal.tsx",
                                                lineNumber: 222,
                                                columnNumber: 37
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "number",
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CalendarModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].formInput,
                                                min: "0",
                                                max: "23",
                                                value: formHours,
                                                onChange: (e)=>setFormHours(e.target.value)
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/CalendarModal.tsx",
                                                lineNumber: 223,
                                                columnNumber: 37
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/CalendarModal.tsx",
                                        lineNumber: 221,
                                        columnNumber: 33
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CalendarModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].formField,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CalendarModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].formLabel,
                                                children: "Minutes"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/CalendarModal.tsx",
                                                lineNumber: 232,
                                                columnNumber: 37
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "number",
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CalendarModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].formInput,
                                                min: "0",
                                                max: "59",
                                                value: formMinutes,
                                                onChange: (e)=>setFormMinutes(e.target.value)
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/CalendarModal.tsx",
                                                lineNumber: 233,
                                                columnNumber: 37
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/CalendarModal.tsx",
                                        lineNumber: 231,
                                        columnNumber: 33
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CalendarModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].formField,
                                        style: {
                                            flex: 2
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CalendarModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].formLabel,
                                                children: "Note (optional)"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/CalendarModal.tsx",
                                                lineNumber: 242,
                                                columnNumber: 37
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "text",
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CalendarModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].formInput,
                                                placeholder: "Any details...",
                                                value: formNote,
                                                onChange: (e)=>setFormNote(e.target.value)
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/CalendarModal.tsx",
                                                lineNumber: 243,
                                                columnNumber: 37
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/CalendarModal.tsx",
                                        lineNumber: 241,
                                        columnNumber: 33
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/CalendarModal.tsx",
                                lineNumber: 220,
                                columnNumber: 29
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CalendarModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].submitBtn,
                                onClick: handleAddEntry,
                                children: "Save Entry"
                            }, void 0, false, {
                                fileName: "[project]/app/components/CalendarModal.tsx",
                                lineNumber: 252,
                                columnNumber: 29
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/CalendarModal.tsx",
                        lineNumber: 191,
                        columnNumber: 25
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/app/components/CalendarModal.tsx",
                    lineNumber: 189,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CalendarModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].viewToggle,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: `${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CalendarModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].toggleBtn} ${view === "month" ? __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CalendarModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].toggleActive : ""}`,
                            onClick: ()=>setView("month"),
                            children: "Monthly"
                        }, void 0, false, {
                            fileName: "[project]/app/components/CalendarModal.tsx",
                            lineNumber: 261,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: `${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CalendarModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].toggleBtn} ${view === "week" ? __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CalendarModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].toggleActive : ""}`,
                            onClick: ()=>setView("week"),
                            children: "Weekly"
                        }, void 0, false, {
                            fileName: "[project]/app/components/CalendarModal.tsx",
                            lineNumber: 262,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/CalendarModal.tsx",
                    lineNumber: 260,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CalendarModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].nav,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CalendarModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].navBtn,
                            onClick: goBack,
                            children: "◀"
                        }, void 0, false, {
                            fileName: "[project]/app/components/CalendarModal.tsx",
                            lineNumber: 267,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CalendarModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].navLabel,
                            children: headerLabel
                        }, void 0, false, {
                            fileName: "[project]/app/components/CalendarModal.tsx",
                            lineNumber: 268,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CalendarModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].navBtn,
                            onClick: goForward,
                            children: "▶"
                        }, void 0, false, {
                            fileName: "[project]/app/components/CalendarModal.tsx",
                            lineNumber: 269,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/CalendarModal.tsx",
                    lineNumber: 266,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                view === "month" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CalendarModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].monthGrid,
                    children: [
                        DAYS.map((d)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CalendarModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].dayName,
                                children: d
                            }, d, false, {
                                fileName: "[project]/app/components/CalendarModal.tsx",
                                lineNumber: 275,
                                columnNumber: 40
                            }, ("TURBOPACK compile-time value", void 0))),
                        monthGrid.map((key, i)=>{
                            if (!key) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CalendarModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].emptyCell
                            }, `empty-${i}`, false, {
                                fileName: "[project]/app/components/CalendarModal.tsx",
                                lineNumber: 277,
                                columnNumber: 46
                            }, ("TURBOPACK compile-time value", void 0));
                            const intensity = getIntensity(key);
                            const isToday = key === todayKey;
                            const isSelected = key === selectedDay;
                            const dayNum = parseInt(key.split('-')[2]);
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                                whileHover: {
                                    scale: 1.1
                                },
                                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CalendarModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].dayCell} ${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CalendarModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"][`intensity${intensity}`]} ${isToday ? __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CalendarModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].today : ""} ${isSelected ? __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CalendarModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].selectedDay : ""}`,
                                onClick: ()=>setSelectedDay(isSelected ? null : key),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CalendarModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].dayNum,
                                        children: dayNum
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/CalendarModal.tsx",
                                        lineNumber: 287,
                                        columnNumber: 37
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    intensity > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CalendarModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].sessionDot
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/CalendarModal.tsx",
                                        lineNumber: 288,
                                        columnNumber: 55
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, key, true, {
                                fileName: "[project]/app/components/CalendarModal.tsx",
                                lineNumber: 283,
                                columnNumber: 33
                            }, ("TURBOPACK compile-time value", void 0));
                        })
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/CalendarModal.tsx",
                    lineNumber: 274,
                    columnNumber: 21
                }, ("TURBOPACK compile-time value", void 0)),
                view === "week" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CalendarModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].weekGrid,
                    children: weekDays.map(({ key, date })=>{
                        const intensity = getIntensity(key);
                        const isToday = key === todayKey;
                        const isSelected = key === selectedDay;
                        const realSessions = getReal(key);
                        const goals = getGoals(key);
                        const realMs = realSessions.reduce((a, s)=>a + s.duration, 0);
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                            whileHover: {
                                scale: 1.02
                            },
                            className: `${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CalendarModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].weekDay} ${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CalendarModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"][`intensity${intensity}`]} ${isToday ? __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CalendarModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].today : ""} ${isSelected ? __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CalendarModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].selectedDay : ""}`,
                            onClick: ()=>setSelectedDay(isSelected ? null : key),
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CalendarModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].weekDayHeader,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CalendarModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].weekDayName,
                                            children: DAYS[date.getDay()]
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/CalendarModal.tsx",
                                            lineNumber: 311,
                                            columnNumber: 41
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: `${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CalendarModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].weekDayNum} ${isToday ? __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CalendarModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].todayNum : ""}`,
                                            children: date.getDate()
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/CalendarModal.tsx",
                                            lineNumber: 312,
                                            columnNumber: 41
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/CalendarModal.tsx",
                                    lineNumber: 310,
                                    columnNumber: 37
                                }, ("TURBOPACK compile-time value", void 0)),
                                realSessions.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CalendarModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].weekStats,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CalendarModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].weekSessions,
                                            children: [
                                                realSessions.length,
                                                " session",
                                                realSessions.length > 1 ? "s" : ""
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/components/CalendarModal.tsx",
                                            lineNumber: 316,
                                            columnNumber: 45
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CalendarModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].weekTime,
                                            children: formatDuration(realMs)
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/CalendarModal.tsx",
                                            lineNumber: 317,
                                            columnNumber: 45
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/CalendarModal.tsx",
                                    lineNumber: 315,
                                    columnNumber: 41
                                }, ("TURBOPACK compile-time value", void 0)) : goals.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CalendarModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].weekGoalHint,
                                    children: [
                                        goals.length,
                                        " goal",
                                        goals.length > 1 ? "s" : ""
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/CalendarModal.tsx",
                                    lineNumber: 320,
                                    columnNumber: 41
                                }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CalendarModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].noSession,
                                    children: "No flow"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/CalendarModal.tsx",
                                    lineNumber: 322,
                                    columnNumber: 41
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CalendarModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].weekBar,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CalendarModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].weekBarFill,
                                        style: {
                                            height: `${Math.min(realMs / 3600000 * 100, 100)}%`
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/CalendarModal.tsx",
                                        lineNumber: 325,
                                        columnNumber: 41
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/app/components/CalendarModal.tsx",
                                    lineNumber: 324,
                                    columnNumber: 37
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, key, true, {
                            fileName: "[project]/app/components/CalendarModal.tsx",
                            lineNumber: 306,
                            columnNumber: 33
                        }, ("TURBOPACK compile-time value", void 0));
                    })
                }, void 0, false, {
                    fileName: "[project]/app/components/CalendarModal.tsx",
                    lineNumber: 297,
                    columnNumber: 21
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                    children: selectedDay && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CalendarModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].detailPanel,
                        initial: {
                            opacity: 0,
                            y: 10
                        },
                        animate: {
                            opacity: 1,
                            y: 0
                        },
                        exit: {
                            opacity: 0,
                            y: 10
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CalendarModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].detailHeader,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CalendarModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].detailDate,
                                        children: friendlyDate(selectedDay)
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/CalendarModal.tsx",
                                        lineNumber: 343,
                                        columnNumber: 33
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CalendarModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].detailHeaderRight,
                                        children: [
                                            selectedReal.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CalendarModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].detailTotal,
                                                children: [
                                                    formatDuration(selectedReal.reduce((a, s)=>a + s.duration, 0)),
                                                    " total"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/components/CalendarModal.tsx",
                                                lineNumber: 346,
                                                columnNumber: 41
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CalendarModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].addDayBtn,
                                                onClick: ()=>{
                                                    setFormDate(selectedDay);
                                                    setShowAddForm(true);
                                                },
                                                children: "+ Add"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/CalendarModal.tsx",
                                                lineNumber: 350,
                                                columnNumber: 37
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/CalendarModal.tsx",
                                        lineNumber: 344,
                                        columnNumber: 33
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/CalendarModal.tsx",
                                lineNumber: 342,
                                columnNumber: 29
                            }, ("TURBOPACK compile-time value", void 0)),
                            selectedReal.length === 0 && selectedGoals.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CalendarModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].noData,
                                children: 'No sessions on this day. Click "+ Add" to set a goal.'
                            }, void 0, false, {
                                fileName: "[project]/app/components/CalendarModal.tsx",
                                lineNumber: 364,
                                columnNumber: 33
                            }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    selectedReal.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CalendarModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].sectionLabel,
                                                children: "✅ ACHIEVED"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/CalendarModal.tsx",
                                                lineNumber: 370,
                                                columnNumber: 45
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CalendarModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].sessionList,
                                                children: selectedReal.map((s, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CalendarModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].sessionItem,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CalendarModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].sessionLeft,
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CalendarModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].sessionTask,
                                                                    children: s.taskName
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/components/CalendarModal.tsx",
                                                                    lineNumber: 375,
                                                                    columnNumber: 61
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/components/CalendarModal.tsx",
                                                                lineNumber: 374,
                                                                columnNumber: 57
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CalendarModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].sessionRight,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CalendarModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].sessionDuration,
                                                                        children: formatDuration(s.duration)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/components/CalendarModal.tsx",
                                                                        lineNumber: 378,
                                                                        columnNumber: 61
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    (s.id || s.taskId) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CalendarModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].deleteBtn,
                                                                        onClick: ()=>{
                                                                            if (s.isManual) {
                                                                                handleDeleteGoal(s.id);
                                                                            } else if (s.taskId && s.at) {
                                                                                handleDeleteRealSession(s.taskId, s.at);
                                                                            }
                                                                        },
                                                                        title: "Delete session",
                                                                        children: "×"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/components/CalendarModal.tsx",
                                                                        lineNumber: 380,
                                                                        columnNumber: 65
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/components/CalendarModal.tsx",
                                                                lineNumber: 377,
                                                                columnNumber: 57
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, i, true, {
                                                        fileName: "[project]/app/components/CalendarModal.tsx",
                                                        lineNumber: 373,
                                                        columnNumber: 53
                                                    }, ("TURBOPACK compile-time value", void 0)))
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/CalendarModal.tsx",
                                                lineNumber: 371,
                                                columnNumber: 45
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true),
                                    selectedGoals.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CalendarModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].sectionLabel,
                                                children: "🎯 GOALS"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/CalendarModal.tsx",
                                                lineNumber: 402,
                                                columnNumber: 45
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CalendarModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].sessionList,
                                                children: selectedGoals.map((s, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: `${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CalendarModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].sessionItem} ${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CalendarModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].goalEntry}`,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CalendarModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].sessionLeft,
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CalendarModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].sessionTask,
                                                                            children: s.taskName
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/components/CalendarModal.tsx",
                                                                            lineNumber: 408,
                                                                            columnNumber: 65
                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                        s.note && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CalendarModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].sessionNote,
                                                                            children: s.note
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/components/CalendarModal.tsx",
                                                                            lineNumber: 409,
                                                                            columnNumber: 76
                                                                        }, ("TURBOPACK compile-time value", void 0))
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/components/CalendarModal.tsx",
                                                                    lineNumber: 407,
                                                                    columnNumber: 61
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/components/CalendarModal.tsx",
                                                                lineNumber: 406,
                                                                columnNumber: 57
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CalendarModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].sessionRight,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CalendarModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].goalDuration,
                                                                        children: formatDuration(s.duration)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/components/CalendarModal.tsx",
                                                                        lineNumber: 413,
                                                                        columnNumber: 61
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    s.id && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CalendarModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].deleteBtn,
                                                                        onClick: ()=>handleDeleteGoal(s.id),
                                                                        title: "Delete goal",
                                                                        children: "×"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/components/CalendarModal.tsx",
                                                                        lineNumber: 415,
                                                                        columnNumber: 65
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/components/CalendarModal.tsx",
                                                                lineNumber: 412,
                                                                columnNumber: 57
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, i, true, {
                                                        fileName: "[project]/app/components/CalendarModal.tsx",
                                                        lineNumber: 405,
                                                        columnNumber: 53
                                                    }, ("TURBOPACK compile-time value", void 0)))
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/CalendarModal.tsx",
                                                lineNumber: 403,
                                                columnNumber: 45
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true)
                                ]
                            }, void 0, true)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/CalendarModal.tsx",
                        lineNumber: 336,
                        columnNumber: 25
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/app/components/CalendarModal.tsx",
                    lineNumber: 334,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CalendarModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].legend,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CalendarModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].legendLabel,
                            children: "Focus intensity:"
                        }, void 0, false, {
                            fileName: "[project]/app/components/CalendarModal.tsx",
                            lineNumber: 435,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0)),
                        [
                            0,
                            1,
                            2,
                            3,
                            4
                        ].map((i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CalendarModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].legendDot} ${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CalendarModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"][`intensity${i}`]}`
                            }, i, false, {
                                fileName: "[project]/app/components/CalendarModal.tsx",
                                lineNumber: 437,
                                columnNumber: 25
                            }, ("TURBOPACK compile-time value", void 0))),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CalendarModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].legendLabel,
                            children: "High"
                        }, void 0, false, {
                            fileName: "[project]/app/components/CalendarModal.tsx",
                            lineNumber: 439,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/CalendarModal.tsx",
                    lineNumber: 434,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/app/components/CalendarModal.tsx",
            lineNumber: 160,
            columnNumber: 13
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/app/components/CalendarModal.tsx",
        lineNumber: 153,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
}),
"[project]/app/components/ExamPlannerModal.module.css [app-ssr] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "addSection": "ExamPlannerModal-module____UPDW__addSection",
  "backBtn": "ExamPlannerModal-module____UPDW__backBtn",
  "checkboxContainer": "ExamPlannerModal-module____UPDW__checkboxContainer",
  "closeBtn": "ExamPlannerModal-module____UPDW__closeBtn",
  "completedText": "ExamPlannerModal-module____UPDW__completedText",
  "dayCell": "ExamPlannerModal-module____UPDW__dayCell",
  "dayName": "ExamPlannerModal-module____UPDW__dayName",
  "dayNum": "ExamPlannerModal-module____UPDW__dayNum",
  "deleteBtn": "ExamPlannerModal-module____UPDW__deleteBtn",
  "detailDate": "ExamPlannerModal-module____UPDW__detailDate",
  "detailHeader": "ExamPlannerModal-module____UPDW__detailHeader",
  "detailPanel": "ExamPlannerModal-module____UPDW__detailPanel",
  "emptyCell": "ExamPlannerModal-module____UPDW__emptyCell",
  "examBadge": "ExamPlannerModal-module____UPDW__examBadge",
  "examCard": "ExamPlannerModal-module____UPDW__examCard",
  "examCheckbox": "ExamPlannerModal-module____UPDW__examCheckbox",
  "examClickableTitle": "ExamPlannerModal-module____UPDW__examClickableTitle",
  "examDetailsDate": "ExamPlannerModal-module____UPDW__examDetailsDate",
  "examDetailsTitle": "ExamPlannerModal-module____UPDW__examDetailsTitle",
  "examDetailsView": "ExamPlannerModal-module____UPDW__examDetailsView",
  "examDot": "ExamPlannerModal-module____UPDW__examDot",
  "examProgressSection": "ExamPlannerModal-module____UPDW__examProgressSection",
  "examSelect": "ExamPlannerModal-module____UPDW__examSelect",
  "header": "ExamPlannerModal-module____UPDW__header",
  "headerTab": "ExamPlannerModal-module____UPDW__headerTab",
  "headerTabActive": "ExamPlannerModal-module____UPDW__headerTabActive",
  "headerTabs": "ExamPlannerModal-module____UPDW__headerTabs",
  "input": "ExamPlannerModal-module____UPDW__input",
  "inputGroup": "ExamPlannerModal-module____UPDW__inputGroup",
  "list": "ExamPlannerModal-module____UPDW__list",
  "modal": "ExamPlannerModal-module____UPDW__modal",
  "monthGrid": "ExamPlannerModal-module____UPDW__monthGrid",
  "nav": "ExamPlannerModal-module____UPDW__nav",
  "navBtn": "ExamPlannerModal-module____UPDW__navBtn",
  "navLabel": "ExamPlannerModal-module____UPDW__navLabel",
  "noData": "ExamPlannerModal-module____UPDW__noData",
  "overlay": "ExamPlannerModal-module____UPDW__overlay",
  "sectionLabel": "ExamPlannerModal-module____UPDW__sectionLabel",
  "selectedDay": "ExamPlannerModal-module____UPDW__selectedDay",
  "submitBtn": "ExamPlannerModal-module____UPDW__submitBtn",
  "subtaskForm": "ExamPlannerModal-module____UPDW__subtaskForm",
  "subtaskInputWrapper": "ExamPlannerModal-module____UPDW__subtaskInputWrapper",
  "taskBadge": "ExamPlannerModal-module____UPDW__taskBadge",
  "taskCard": "ExamPlannerModal-module____UPDW__taskCard",
  "taskCheckbox": "ExamPlannerModal-module____UPDW__taskCheckbox",
  "taskDot": "ExamPlannerModal-module____UPDW__taskDot",
  "taskLeft": "ExamPlannerModal-module____UPDW__taskLeft",
  "taskParentBadge": "ExamPlannerModal-module____UPDW__taskParentBadge",
  "today": "ExamPlannerModal-module____UPDW__today",
  "todayNum": "ExamPlannerModal-module____UPDW__todayNum",
  "toggleActive": "ExamPlannerModal-module____UPDW__toggleActive",
  "toggleBtn": "ExamPlannerModal-module____UPDW__toggleBtn",
  "viewMoreHint": "ExamPlannerModal-module____UPDW__viewMoreHint",
  "viewToggle": "ExamPlannerModal-module____UPDW__viewToggle",
  "weekDay": "ExamPlannerModal-module____UPDW__weekDay",
  "weekDayHeader": "ExamPlannerModal-module____UPDW__weekDayHeader",
  "weekDayName": "ExamPlannerModal-module____UPDW__weekDayName",
  "weekDayNum": "ExamPlannerModal-module____UPDW__weekDayNum",
  "weekGrid": "ExamPlannerModal-module____UPDW__weekGrid",
  "weekIndicators": "ExamPlannerModal-module____UPDW__weekIndicators",
});
}),
"[project]/app/components/ExamPlannerModal.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ExamPlannerModal",
    ()=>ExamPlannerModal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$ghostService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/services/ghostService.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ExamPlannerModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/app/components/ExamPlannerModal.module.css [app-ssr] (css module)");
"use client";
;
;
;
;
;
const DAYS = [
    "Sun",
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat"
];
const MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];
function toDateKey(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
function friendlyDate(dateKey) {
    return new Date(dateKey + 'T12:00:00').toLocaleDateString('en', {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
    });
}
const ExamPlannerModal = ({ onClose, onSwitchMode })=>{
    const [view, setView] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("month");
    const [cursor, setCursor] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(new Date());
    const [selectedDay, setSelectedDay] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [selectedExamId, setSelectedExamId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    // Exams State
    const [exams, setExams] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$ghostService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GhostService"].getExams());
    // Input States
    const [newExamTitle, setNewExamTitle] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [newSubtaskText, setNewSubtaskText] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [selectedExamForSubtask, setSelectedExamForSubtask] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const refresh = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        setExams(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$ghostService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GhostService"].getExams());
    }, []);
    // ── CALENDAR LOGIC ─────────────────────────────────────────────
    const monthYear = {
        year: cursor.getFullYear(),
        month: cursor.getMonth()
    };
    const firstOfMonth = new Date(monthYear.year, monthYear.month, 1);
    const startOffset = firstOfMonth.getDay();
    const daysInMonth = new Date(monthYear.year, monthYear.month + 1, 0).getDate();
    const monthGrid = [
        ...Array(startOffset).fill(null),
        ...Array.from({
            length: daysInMonth
        }, (_, i)=>toDateKey(new Date(monthYear.year, monthYear.month, i + 1)))
    ];
    const startOfWeek = new Date(cursor);
    startOfWeek.setDate(cursor.getDate() - cursor.getDay());
    const weekDays = Array.from({
        length: 7
    }, (_, i)=>{
        const d = new Date(startOfWeek);
        d.setDate(startOfWeek.getDate() + i);
        return {
            key: toDateKey(d),
            date: d
        };
    });
    const goBack = ()=>{
        const d = new Date(cursor);
        view === "month" ? d.setMonth(d.getMonth() - 1) : d.setDate(d.getDate() - 7);
        setCursor(d);
    };
    const goForward = ()=>{
        const d = new Date(cursor);
        view === "month" ? d.setMonth(d.getMonth() + 1) : d.setDate(d.getDate() + 7);
        setCursor(d);
    };
    const todayKey = toDateKey(new Date());
    const headerLabel = view === "month" ? `${MONTHS[monthYear.month]} ${monthYear.year}` : `${weekDays[0].date.toLocaleDateString('en', {
        month: 'short',
        day: 'numeric'
    })} – ${weekDays[6].date.toLocaleDateString('en', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    })}`;
    // ── DATA HELPERS ────────────────────────────────────────────────
    const getExamsOnDay = (date)=>exams.filter((e)=>e.date === date);
    // Subtasks on a day (grouped by Exam)
    const getSubtasksOnDay = (date)=>{
        const tasks = [];
        exams.forEach((exam)=>{
            (exam.subtasks || []).forEach((st)=>{
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
    const dayHasActivity = (date)=>{
        return getExamsOnDay(date).length > 0 || getSubtasksOnDay(date).length > 0;
    };
    // ── HANDLERS ──────────────────────────────────────────────────
    const handleAddExam = ()=>{
        if (!newExamTitle.trim() || !selectedDay) return;
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$ghostService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GhostService"].addExam(newExamTitle, selectedDay);
        setNewExamTitle("");
        refresh();
    };
    const handleAddSubtask = ()=>{
        if (!newSubtaskText.trim() || !selectedExamForSubtask || !selectedDay) return;
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$ghostService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GhostService"].addExamSubtask(selectedExamForSubtask, newSubtaskText, selectedDay);
        setNewSubtaskText("");
        refresh();
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ExamPlannerModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].overlay,
        initial: {
            opacity: 0
        },
        animate: {
            opacity: 1
        },
        exit: {
            opacity: 0
        },
        onClick: onClose,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ExamPlannerModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].modal,
            initial: {
                scale: 0.92,
                opacity: 0,
                y: 20
            },
            animate: {
                scale: 1,
                opacity: 1,
                y: 0
            },
            exit: {
                scale: 0.92,
                opacity: 0,
                y: 20
            },
            onClick: (e)=>e.stopPropagation(),
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ExamPlannerModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].header,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ExamPlannerModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].headerTabs,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ExamPlannerModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].headerTab,
                                    onClick: onSwitchMode,
                                    children: "HISTORY"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/ExamPlannerModal.tsx",
                                    lineNumber: 144,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    className: `${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ExamPlannerModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].headerTab} ${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ExamPlannerModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].headerTabActive}`,
                                    children: "PLANNER"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/ExamPlannerModal.tsx",
                                    lineNumber: 147,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/ExamPlannerModal.tsx",
                            lineNumber: 143,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ExamPlannerModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].closeBtn,
                            onClick: onClose,
                            children: "×"
                        }, void 0, false, {
                            fileName: "[project]/app/components/ExamPlannerModal.tsx",
                            lineNumber: 151,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/ExamPlannerModal.tsx",
                    lineNumber: 142,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ExamPlannerModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].viewToggle,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: `${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ExamPlannerModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].toggleBtn} ${view === "month" ? __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ExamPlannerModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].toggleActive : ""}`,
                            onClick: ()=>setView("month"),
                            children: "Monthly"
                        }, void 0, false, {
                            fileName: "[project]/app/components/ExamPlannerModal.tsx",
                            lineNumber: 156,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: `${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ExamPlannerModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].toggleBtn} ${view === "week" ? __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ExamPlannerModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].toggleActive : ""}`,
                            onClick: ()=>setView("week"),
                            children: "Weekly"
                        }, void 0, false, {
                            fileName: "[project]/app/components/ExamPlannerModal.tsx",
                            lineNumber: 157,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/ExamPlannerModal.tsx",
                    lineNumber: 155,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ExamPlannerModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].nav,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ExamPlannerModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].navBtn,
                            onClick: goBack,
                            children: "◀"
                        }, void 0, false, {
                            fileName: "[project]/app/components/ExamPlannerModal.tsx",
                            lineNumber: 162,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ExamPlannerModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].navLabel,
                            children: headerLabel
                        }, void 0, false, {
                            fileName: "[project]/app/components/ExamPlannerModal.tsx",
                            lineNumber: 163,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ExamPlannerModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].navBtn,
                            onClick: goForward,
                            children: "▶"
                        }, void 0, false, {
                            fileName: "[project]/app/components/ExamPlannerModal.tsx",
                            lineNumber: 164,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/ExamPlannerModal.tsx",
                    lineNumber: 161,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                view === "month" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ExamPlannerModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].monthGrid,
                    children: [
                        DAYS.map((d)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ExamPlannerModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].dayName,
                                children: d
                            }, d, false, {
                                fileName: "[project]/app/components/ExamPlannerModal.tsx",
                                lineNumber: 170,
                                columnNumber: 40
                            }, ("TURBOPACK compile-time value", void 0))),
                        monthGrid.map((key, i)=>{
                            if (!key) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ExamPlannerModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].emptyCell
                            }, `empty-${i}`, false, {
                                fileName: "[project]/app/components/ExamPlannerModal.tsx",
                                lineNumber: 172,
                                columnNumber: 46
                            }, ("TURBOPACK compile-time value", void 0));
                            const isToday = key === todayKey;
                            const isSelected = key === selectedDay;
                            const examsCount = getExamsOnDay(key).length;
                            const tasksCount = getSubtasksOnDay(key).length;
                            const dayNum = parseInt(key.split('-')[2]);
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                                whileHover: {
                                    scale: 1.1
                                },
                                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ExamPlannerModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].dayCell} ${isToday ? __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ExamPlannerModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].today : ""} ${isSelected ? __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ExamPlannerModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].selectedDay : ""}`,
                                onClick: ()=>{
                                    setSelectedDay(isSelected ? null : key);
                                    setSelectedExamId(null);
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ExamPlannerModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].dayNum,
                                        children: dayNum
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/ExamPlannerModal.tsx",
                                        lineNumber: 188,
                                        columnNumber: 37
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    examsCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ExamPlannerModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].examDot,
                                        title: `${examsCount} Exam(s)`
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/ExamPlannerModal.tsx",
                                        lineNumber: 189,
                                        columnNumber: 56
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    tasksCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ExamPlannerModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].taskDot,
                                        title: `${tasksCount} Study Task(s)`
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/ExamPlannerModal.tsx",
                                        lineNumber: 190,
                                        columnNumber: 56
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, key, true, {
                                fileName: "[project]/app/components/ExamPlannerModal.tsx",
                                lineNumber: 181,
                                columnNumber: 33
                            }, ("TURBOPACK compile-time value", void 0));
                        })
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/ExamPlannerModal.tsx",
                    lineNumber: 169,
                    columnNumber: 21
                }, ("TURBOPACK compile-time value", void 0)),
                view === "week" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ExamPlannerModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].weekGrid,
                    children: weekDays.map(({ key, date })=>{
                        const isToday = key === todayKey;
                        const isSelected = key === selectedDay;
                        const examsCount = getExamsOnDay(key).length;
                        const tasksCount = getSubtasksOnDay(key).length;
                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                            whileHover: {
                                scale: 1.02
                            },
                            className: `${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ExamPlannerModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].weekDay} ${isToday ? __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ExamPlannerModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].today : ""} ${isSelected ? __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ExamPlannerModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].selectedDay : ""}`,
                            onClick: ()=>{
                                setSelectedDay(isSelected ? null : key);
                                setSelectedExamId(null);
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ExamPlannerModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].weekDayHeader,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ExamPlannerModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].weekDayName,
                                            children: DAYS[date.getDay()]
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/ExamPlannerModal.tsx",
                                            lineNumber: 215,
                                            columnNumber: 41
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: `${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ExamPlannerModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].weekDayNum} ${isToday ? __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ExamPlannerModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].todayNum : ""}`,
                                            children: date.getDate()
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/ExamPlannerModal.tsx",
                                            lineNumber: 216,
                                            columnNumber: 41
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/ExamPlannerModal.tsx",
                                    lineNumber: 214,
                                    columnNumber: 37
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ExamPlannerModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].weekIndicators,
                                    children: [
                                        examsCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ExamPlannerModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].examBadge,
                                            children: [
                                                examsCount,
                                                " Exam",
                                                examsCount > 1 ? 's' : ''
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/components/ExamPlannerModal.tsx",
                                            lineNumber: 220,
                                            columnNumber: 60
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        tasksCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ExamPlannerModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].taskBadge,
                                            children: [
                                                tasksCount,
                                                " Study Task",
                                                tasksCount > 1 ? 's' : ''
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/components/ExamPlannerModal.tsx",
                                            lineNumber: 221,
                                            columnNumber: 60
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/ExamPlannerModal.tsx",
                                    lineNumber: 219,
                                    columnNumber: 37
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, key, true, {
                            fileName: "[project]/app/components/ExamPlannerModal.tsx",
                            lineNumber: 207,
                            columnNumber: 33
                        }, ("TURBOPACK compile-time value", void 0));
                    })
                }, void 0, false, {
                    fileName: "[project]/app/components/ExamPlannerModal.tsx",
                    lineNumber: 199,
                    columnNumber: 21
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                    children: selectedDay && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ExamPlannerModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].detailPanel,
                        initial: {
                            opacity: 0,
                            y: 10
                        },
                        animate: {
                            opacity: 1,
                            y: 0
                        },
                        exit: {
                            opacity: 0,
                            y: 10
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ExamPlannerModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].detailHeader,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ExamPlannerModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].detailDate,
                                        children: selectedExamId ? 'Exam Details' : friendlyDate(selectedDay)
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/ExamPlannerModal.tsx",
                                        lineNumber: 239,
                                        columnNumber: 33
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    selectedExamId && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ExamPlannerModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].backBtn,
                                        onClick: ()=>setSelectedExamId(null),
                                        children: "← Back"
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/ExamPlannerModal.tsx",
                                        lineNumber: 243,
                                        columnNumber: 37
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/ExamPlannerModal.tsx",
                                lineNumber: 238,
                                columnNumber: 29
                            }, ("TURBOPACK compile-time value", void 0)),
                            selectedExamId ? (()=>{
                                const exam = exams.find((e)=>e.id === selectedExamId);
                                if (!exam) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ExamPlannerModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].noData,
                                    children: "Exam not found."
                                }, void 0, false, {
                                    fileName: "[project]/app/components/ExamPlannerModal.tsx",
                                    lineNumber: 255,
                                    columnNumber: 55
                                }, ("TURBOPACK compile-time value", void 0));
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ExamPlannerModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].examDetailsView,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ExamPlannerModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].examDetailsTitle,
                                            children: exam.title
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/ExamPlannerModal.tsx",
                                            lineNumber: 258,
                                            columnNumber: 45
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ExamPlannerModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].examDetailsDate,
                                            children: [
                                                "Scheduled for: ",
                                                friendlyDate(exam.date)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/components/ExamPlannerModal.tsx",
                                            lineNumber: 259,
                                            columnNumber: 45
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ExamPlannerModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].examProgressSection,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ExamPlannerModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].sectionLabel,
                                                    children: "OVERALL PROGRESS"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/components/ExamPlannerModal.tsx",
                                                    lineNumber: 262,
                                                    columnNumber: 49
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ExamPlannerModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].checkboxContainer,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                            type: "checkbox",
                                                            checked: exam.completed,
                                                            onChange: ()=>{
                                                                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$ghostService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GhostService"].toggleExam(exam.id);
                                                                refresh();
                                                            },
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ExamPlannerModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].examCheckbox
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/components/ExamPlannerModal.tsx",
                                                            lineNumber: 264,
                                                            columnNumber: 53
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: exam.completed ? __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ExamPlannerModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].completedText : '',
                                                            children: "Mark Exam as Completed"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/components/ExamPlannerModal.tsx",
                                                            lineNumber: 270,
                                                            columnNumber: 53
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/components/ExamPlannerModal.tsx",
                                                    lineNumber: 263,
                                                    columnNumber: 49
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/components/ExamPlannerModal.tsx",
                                            lineNumber: 261,
                                            columnNumber: 45
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ExamPlannerModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].sectionLabel,
                                            style: {
                                                marginTop: '1.5rem'
                                            },
                                            children: "ALL STUDY TASKS"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/ExamPlannerModal.tsx",
                                            lineNumber: 276,
                                            columnNumber: 45
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        exam.subtasks && exam.subtasks.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ExamPlannerModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].list,
                                            children: exam.subtasks.map((task)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ExamPlannerModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].taskCard,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ExamPlannerModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].taskLeft,
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ExamPlannerModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].checkboxContainer,
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                            type: "checkbox",
                                                                            checked: task.completed,
                                                                            onChange: ()=>{
                                                                                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$ghostService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GhostService"].toggleExamSubtask(exam.id, task.id);
                                                                                refresh();
                                                                            },
                                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ExamPlannerModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].taskCheckbox
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/components/ExamPlannerModal.tsx",
                                                                            lineNumber: 283,
                                                                            columnNumber: 69
                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            className: task.completed ? __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ExamPlannerModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].completedText : '',
                                                                            children: task.text
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/app/components/ExamPlannerModal.tsx",
                                                                            lineNumber: 289,
                                                                            columnNumber: 69
                                                                        }, ("TURBOPACK compile-time value", void 0))
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/app/components/ExamPlannerModal.tsx",
                                                                    lineNumber: 282,
                                                                    columnNumber: 65
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ExamPlannerModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].taskParentBadge,
                                                                    children: new Date(task.date + 'T12:00:00').toLocaleDateString('en', {
                                                                        month: 'short',
                                                                        day: 'numeric'
                                                                    })
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/components/ExamPlannerModal.tsx",
                                                                    lineNumber: 293,
                                                                    columnNumber: 65
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/components/ExamPlannerModal.tsx",
                                                            lineNumber: 281,
                                                            columnNumber: 61
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ExamPlannerModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].deleteBtn,
                                                            onClick: ()=>{
                                                                __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$ghostService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GhostService"].deleteExamSubtask(exam.id, task.id);
                                                                refresh();
                                                            },
                                                            children: "×"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/components/ExamPlannerModal.tsx",
                                                            lineNumber: 297,
                                                            columnNumber: 61
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, task.id, true, {
                                                    fileName: "[project]/app/components/ExamPlannerModal.tsx",
                                                    lineNumber: 280,
                                                    columnNumber: 57
                                                }, ("TURBOPACK compile-time value", void 0)))
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/ExamPlannerModal.tsx",
                                            lineNumber: 278,
                                            columnNumber: 49
                                        }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ExamPlannerModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].noData,
                                            children: "No study tasks scheduled yet."
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/ExamPlannerModal.tsx",
                                            lineNumber: 305,
                                            columnNumber: 49
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/ExamPlannerModal.tsx",
                                    lineNumber: 257,
                                    columnNumber: 41
                                }, ("TURBOPACK compile-time value", void 0));
                            })() : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    !dayHasActivity(selectedDay) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ExamPlannerModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].noData,
                                        children: "Nothing planned for this date."
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/ExamPlannerModal.tsx",
                                        lineNumber: 313,
                                        columnNumber: 41
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    getExamsOnDay(selectedDay).length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ExamPlannerModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].sectionLabel,
                                                children: "📝 EXAMS / TESTS"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/ExamPlannerModal.tsx",
                                                lineNumber: 319,
                                                columnNumber: 45
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ExamPlannerModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].list,
                                                children: getExamsOnDay(selectedDay).map((exam)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ExamPlannerModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].examCard,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ExamPlannerModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].checkboxContainer,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        type: "checkbox",
                                                                        checked: exam.completed,
                                                                        onChange: ()=>{
                                                                            __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$ghostService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GhostService"].toggleExam(exam.id);
                                                                            refresh();
                                                                        },
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ExamPlannerModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].examCheckbox
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/components/ExamPlannerModal.tsx",
                                                                        lineNumber: 324,
                                                                        columnNumber: 61
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: `${exam.completed ? __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ExamPlannerModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].completedText : ''} ${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ExamPlannerModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].examClickableTitle}`,
                                                                        onClick: (e)=>{
                                                                            e.preventDefault();
                                                                            setSelectedExamId(exam.id);
                                                                        },
                                                                        children: [
                                                                            exam.title,
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ExamPlannerModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].viewMoreHint,
                                                                                children: [
                                                                                    " (View ",
                                                                                    exam.subtasks?.length || 0,
                                                                                    " tasks)"
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/app/components/ExamPlannerModal.tsx",
                                                                                lineNumber: 338,
                                                                                columnNumber: 65
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/app/components/ExamPlannerModal.tsx",
                                                                        lineNumber: 330,
                                                                        columnNumber: 61
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/components/ExamPlannerModal.tsx",
                                                                lineNumber: 323,
                                                                columnNumber: 57
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ExamPlannerModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].deleteBtn,
                                                                onClick: ()=>{
                                                                    __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$ghostService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GhostService"].deleteExam(exam.id);
                                                                    refresh();
                                                                },
                                                                children: "×"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/components/ExamPlannerModal.tsx",
                                                                lineNumber: 341,
                                                                columnNumber: 57
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, exam.id, true, {
                                                        fileName: "[project]/app/components/ExamPlannerModal.tsx",
                                                        lineNumber: 322,
                                                        columnNumber: 53
                                                    }, ("TURBOPACK compile-time value", void 0)))
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/ExamPlannerModal.tsx",
                                                lineNumber: 320,
                                                columnNumber: 45
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true),
                                    getSubtasksOnDay(selectedDay).length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ExamPlannerModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].sectionLabel,
                                                style: {
                                                    marginTop: '1rem'
                                                },
                                                children: "📚 STUDY PLAN"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/ExamPlannerModal.tsx",
                                                lineNumber: 354,
                                                columnNumber: 45
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ExamPlannerModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].list,
                                                children: getSubtasksOnDay(selectedDay).map((task)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ExamPlannerModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].taskCard,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ExamPlannerModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].taskLeft,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ExamPlannerModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].checkboxContainer,
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                                type: "checkbox",
                                                                                checked: task.completed,
                                                                                onChange: ()=>{
                                                                                    __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$ghostService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GhostService"].toggleExamSubtask(task.examId, task.subtaskId);
                                                                                    refresh();
                                                                                },
                                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ExamPlannerModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].taskCheckbox
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/components/ExamPlannerModal.tsx",
                                                                                lineNumber: 360,
                                                                                columnNumber: 65
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: task.completed ? __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ExamPlannerModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].completedText : '',
                                                                                children: task.text
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/app/components/ExamPlannerModal.tsx",
                                                                                lineNumber: 366,
                                                                                columnNumber: 65
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/app/components/ExamPlannerModal.tsx",
                                                                        lineNumber: 359,
                                                                        columnNumber: 61
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ExamPlannerModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].taskParentBadge,
                                                                        children: task.examTitle
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/components/ExamPlannerModal.tsx",
                                                                        lineNumber: 370,
                                                                        columnNumber: 61
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/components/ExamPlannerModal.tsx",
                                                                lineNumber: 358,
                                                                columnNumber: 57
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ExamPlannerModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].deleteBtn,
                                                                onClick: ()=>{
                                                                    __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$ghostService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GhostService"].deleteExamSubtask(task.examId, task.subtaskId);
                                                                    refresh();
                                                                },
                                                                children: "×"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/components/ExamPlannerModal.tsx",
                                                                lineNumber: 372,
                                                                columnNumber: 57
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, task.subtaskId, true, {
                                                        fileName: "[project]/app/components/ExamPlannerModal.tsx",
                                                        lineNumber: 357,
                                                        columnNumber: 53
                                                    }, ("TURBOPACK compile-time value", void 0)))
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/ExamPlannerModal.tsx",
                                                lineNumber: 355,
                                                columnNumber: 45
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ExamPlannerModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].addSection,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ExamPlannerModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].inputGroup,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "text",
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ExamPlannerModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].input,
                                                        placeholder: "+ Schedule an Exam/Test on this day...",
                                                        value: newExamTitle,
                                                        onChange: (e)=>setNewExamTitle(e.target.value),
                                                        onKeyDown: (e)=>e.key === 'Enter' && handleAddExam()
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/ExamPlannerModal.tsx",
                                                        lineNumber: 385,
                                                        columnNumber: 45
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    newExamTitle.trim() && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ExamPlannerModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].submitBtn,
                                                        onClick: handleAddExam,
                                                        children: "Add Exam"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/ExamPlannerModal.tsx",
                                                        lineNumber: 394,
                                                        columnNumber: 49
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/components/ExamPlannerModal.tsx",
                                                lineNumber: 384,
                                                columnNumber: 41
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            exams.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ExamPlannerModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].subtaskForm,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ExamPlannerModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].subtaskInputWrapper,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ExamPlannerModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].examSelect,
                                                                value: selectedExamForSubtask,
                                                                onChange: (e)=>setSelectedExamForSubtask(e.target.value),
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                        value: "",
                                                                        disabled: true,
                                                                        children: "Select related exam..."
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/components/ExamPlannerModal.tsx",
                                                                        lineNumber: 407,
                                                                        columnNumber: 57
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    exams.map((e)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                            value: e.id,
                                                                            children: e.title
                                                                        }, e.id, false, {
                                                                            fileName: "[project]/app/components/ExamPlannerModal.tsx",
                                                                            lineNumber: 409,
                                                                            columnNumber: 61
                                                                        }, ("TURBOPACK compile-time value", void 0)))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/components/ExamPlannerModal.tsx",
                                                                lineNumber: 402,
                                                                columnNumber: 53
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "text",
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ExamPlannerModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].input,
                                                                placeholder: "+ Add a study task for this day...",
                                                                value: newSubtaskText,
                                                                onChange: (e)=>setNewSubtaskText(e.target.value),
                                                                onKeyDown: (e)=>e.key === 'Enter' && handleAddSubtask()
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/components/ExamPlannerModal.tsx",
                                                                lineNumber: 412,
                                                                columnNumber: 53
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/components/ExamPlannerModal.tsx",
                                                        lineNumber: 401,
                                                        columnNumber: 49
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    newSubtaskText.trim() && selectedExamForSubtask && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ExamPlannerModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].submitBtn,
                                                        onClick: handleAddSubtask,
                                                        children: "Plan Task"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/components/ExamPlannerModal.tsx",
                                                        lineNumber: 422,
                                                        columnNumber: 53
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/components/ExamPlannerModal.tsx",
                                                lineNumber: 400,
                                                columnNumber: 45
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/ExamPlannerModal.tsx",
                                        lineNumber: 383,
                                        columnNumber: 37
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/ExamPlannerModal.tsx",
                        lineNumber: 232,
                        columnNumber: 25
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/app/components/ExamPlannerModal.tsx",
                    lineNumber: 230,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/app/components/ExamPlannerModal.tsx",
            lineNumber: 134,
            columnNumber: 13
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/app/components/ExamPlannerModal.tsx",
        lineNumber: 127,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
}),
"[project]/app/hooks/useTimer.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useTimer",
    ()=>useTimer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
;
const useTimer = ()=>{
    const [elapsed, setElapsed] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [isRunning, setIsRunning] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [speedMultiplier, setSpeedMultiplier] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(1);
    const lastTimeRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const requestIdRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const speedRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(1);
    // Update ref when state changes so the loop can see it
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        speedRef.current = speedMultiplier;
    }, [
        speedMultiplier
    ]);
    const update = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        const now = Date.now();
        if (lastTimeRef.current !== null) {
            const deltaTime = now - lastTimeRef.current;
            setElapsed((prev)=>prev + deltaTime * speedRef.current);
            lastTimeRef.current = now;
            requestIdRef.current = requestAnimationFrame(update);
        }
    }, []);
    const start = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        if (!isRunning) {
            setIsRunning(true);
            lastTimeRef.current = Date.now();
            requestIdRef.current = requestAnimationFrame(update);
        }
    }, [
        isRunning,
        update
    ]);
    const stop = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        setIsRunning(false);
        if (requestIdRef.current) {
            cancelAnimationFrame(requestIdRef.current);
            requestIdRef.current = null;
        }
        lastTimeRef.current = null;
    }, []);
    const reset = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        stop();
        setElapsed(0);
    }, [
        stop
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        return ()=>{
            if (requestIdRef.current) {
                cancelAnimationFrame(requestIdRef.current);
            }
        };
    }, []);
    return {
        elapsed,
        isRunning,
        speedMultiplier,
        setSpeedMultiplier,
        start,
        stop,
        reset
    };
};
}),
"[project]/app/page.module.css [app-ssr] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "bottomButtons": "page-module__E0kJGG__bottomButtons",
  "floatIn": "page-module__E0kJGG__floatIn",
  "garageButton": "page-module__E0kJGG__garageButton",
  "garageIcon": "page-module__E0kJGG__garageIcon",
  "ghostCyan": "page-module__E0kJGG__ghostCyan",
  "ghostFloat": "page-module__E0kJGG__ghostFloat",
  "ghostSilver": "page-module__E0kJGG__ghostSilver",
  "glassCard": "page-module__E0kJGG__glassCard",
  "levelBadgeContainer": "page-module__E0kJGG__levelBadgeContainer",
  "logo": "page-module__E0kJGG__logo",
  "mainContent": "page-module__E0kJGG__mainContent",
  "pageContainer": "page-module__E0kJGG__pageContainer",
  "racingBackground": "page-module__E0kJGG__racingBackground",
});
}),
"[project]/app/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Home
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$TaskInput$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/TaskInput.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$TodoList$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/TodoList.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$NoiseMixer$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/NoiseMixer.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$RaceView$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/RaceView.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ResultModal$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/ResultModal.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$Background3D$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/Background3D.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CustomizationModal$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/CustomizationModal.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ThemeToggle$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/ThemeToggle.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$LevelBadge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/LevelBadge.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$LevelModal$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/LevelModal.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CalendarModal$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/CalendarModal.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ExamPlannerModal$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/ExamPlannerModal.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$hooks$2f$useTimer$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/hooks/useTimer.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$ghostService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/services/ghostService.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/app/page.module.css [app-ssr] (css module)");
"use client";
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
;
const MinimalistGhost = ({ color, opacity, width = 80 })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        width: width,
        height: width,
        viewBox: "0 0 100 100",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg",
        style: {
            opacity
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M25 100V45C25 31.1929 36.1929 20 50 20C63.8071 20 75 31.1929 75 45V100",
                stroke: color,
                strokeWidth: "3",
                fill: "transparent"
            }, void 0, false, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 23,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M25 100Q37.5 90 50 100Q62.5 110 75 100V45C75 31.1929 63.8071 20 50 20C36.1929 20 25 31.1929 25 45V100Z",
                fill: color,
                fillOpacity: "0.1"
            }, void 0, false, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 24,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "40",
                cy: "50",
                r: "3",
                fill: color
            }, void 0, false, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 25,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "60",
                cy: "50",
                r: "3",
                fill: color
            }, void 0, false, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 26,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/app/page.tsx",
        lineNumber: 22,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
function Home() {
    const [mode, setMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('HOME');
    const [isRacing, setIsRacing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isDrifting, setIsDrifting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [taskName, setTaskName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [taskParent, setTaskParent] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(undefined);
    const [raceTargetTime, setRaceTargetTime] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    // Customization & Progression State
    const [customization, setCustomization] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$ghostService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GhostService"].getCustomization());
    const [lastFuelGained, setLastFuelGained] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [showCustomization, setShowCustomization] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showLevelModal, setShowLevelModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showCalendar, setShowCalendar] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [calendarMode, setCalendarMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('history');
    const { elapsed, isRunning, setSpeedMultiplier, start, stop, reset } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$hooks$2f$useTimer$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useTimer"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const handleVisibilityChange = ()=>{
            const drifting = document.visibilityState === 'hidden';
            if (mode === 'RACE') {
                setIsDrifting(drifting);
                setSpeedMultiplier(drifting ? 0.1 : 1.0);
            } else {
                setIsDrifting(false);
                setSpeedMultiplier(1.0);
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);
        return ()=>document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, [
        mode,
        setSpeedMultiplier
    ]);
    const handleStart = (task, customDuration, parent)=>{
        setIsRacing(true);
        const record = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$ghostService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GhostService"].getTask(task, parent);
        setTaskName(task);
        setTaskParent(parent);
        const raceTarget = customDuration || (record ? record.bestTime : null);
        setRaceTargetTime(raceTarget);
        setTimeout(()=>{
            setMode('RACE');
            start();
            setIsRacing(false);
        }, 1200);
    };
    const handleComplete = (save = true)=>{
        stop();
        if (save) {
            const { fuelGained } = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$ghostService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GhostService"].saveRun(taskName, elapsed, taskParent);
            setLastFuelGained(fuelGained);
            setMode('RESULT');
        } else {
            setMode('HOME');
            setTaskName('');
            setTaskParent(undefined);
            setLastFuelGained(0);
            reset();
        }
    };
    const handleCloseResult = ()=>{
        setMode('HOME');
        setTaskName('');
        setLastFuelGained(0);
        setCustomization(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$ghostService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GhostService"].getCustomization());
        reset();
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].pageContainer} ${isRacing || mode === 'RACE' ? __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].racingBackground : ''}`,
        children: [
            mode !== 'RACE' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$Background3D$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Background3D"], {
                blur: true
            }, void 0, false, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 106,
                columnNumber: 33
            }, this),
            mode === 'HOME' && !isRacing && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ThemeToggle$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ThemeToggle"], {}, void 0, false, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 107,
                columnNumber: 46
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].mainContent,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                        children: mode === 'HOME' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].levelBadgeContainer,
                                    initial: {
                                        opacity: 0,
                                        y: -10
                                    },
                                    animate: isRacing ? {
                                        opacity: 0,
                                        y: -20
                                    } : {
                                        opacity: 1,
                                        y: 0
                                    },
                                    transition: {
                                        duration: 0.5
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$LevelBadge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LevelBadge"], {
                                        onClick: ()=>setShowLevelModal(true)
                                    }, void 0, false, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 120,
                                        columnNumber: 33
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/page.tsx",
                                    lineNumber: 114,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].ghostSilver,
                                    initial: {
                                        top: '2.5rem',
                                        left: '2.5rem'
                                    },
                                    animate: isRacing ? {
                                        top: '-10rem',
                                        left: '-10rem',
                                        opacity: 0
                                    } : {
                                        y: [
                                            0,
                                            -15,
                                            0
                                        ]
                                    },
                                    transition: isRacing ? {
                                        duration: 0.8,
                                        ease: "backIn"
                                    } : {
                                        duration: 4,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(MinimalistGhost, {
                                        color: "#E9ECEF",
                                        opacity: 0.4,
                                        width: 80
                                    }, void 0, false, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 129,
                                        columnNumber: 33
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/page.tsx",
                                    lineNumber: 123,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].ghostCyan,
                                    initial: {
                                        bottom: '2.5rem',
                                        right: '2.5rem'
                                    },
                                    animate: isRacing ? {
                                        bottom: '40vh',
                                        right: '85vw',
                                        scale: 1.2
                                    } : {
                                        y: [
                                            0,
                                            -15,
                                            0
                                        ]
                                    },
                                    transition: isRacing ? {
                                        duration: 1,
                                        ease: "circOut"
                                    } : {
                                        duration: 5,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    },
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(MinimalistGhost, {
                                        color: "#00E5FF",
                                        opacity: 1.0,
                                        width: 96
                                    }, void 0, false, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 138,
                                        columnNumber: 33
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/page.tsx",
                                    lineNumber: 132,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].glassCard,
                                    animate: isRacing ? {
                                        opacity: 0,
                                        scale: 0.9,
                                        y: 10
                                    } : {
                                        opacity: 1,
                                        scale: 1,
                                        y: 0
                                    },
                                    exit: {
                                        opacity: 0
                                    },
                                    transition: {
                                        duration: 0.5
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mb-4 text-white/50 text-xs tracking-[0.3em] font-light",
                                            style: {
                                                color: 'var(--text-muted)'
                                            },
                                            children: "MINDFLOW"
                                        }, void 0, false, {
                                            fileName: "[project]/app/page.tsx",
                                            lineNumber: 148,
                                            columnNumber: 33
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$TaskInput$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TaskInput"], {
                                            onStart: handleStart
                                        }, void 0, false, {
                                            fileName: "[project]/app/page.tsx",
                                            lineNumber: 149,
                                            columnNumber: 33
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$TodoList$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TodoList"], {
                                            onStartRace: handleStart
                                        }, void 0, false, {
                                            fileName: "[project]/app/page.tsx",
                                            lineNumber: 150,
                                            columnNumber: 33
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].bottomButtons,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].garageButton,
                                                    onClick: ()=>setShowCustomization(true),
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].garageIcon,
                                                            children: "🏎️"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/page.tsx",
                                                            lineNumber: 157,
                                                            columnNumber: 41
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: "GARAGE"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/page.tsx",
                                                            lineNumber: 158,
                                                            columnNumber: 41
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/page.tsx",
                                                    lineNumber: 153,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].garageButton,
                                                    onClick: ()=>setShowCalendar(true),
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].garageIcon,
                                                            children: "📅"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/page.tsx",
                                                            lineNumber: 164,
                                                            columnNumber: 41
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: "CALENDAR"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/page.tsx",
                                                            lineNumber: 165,
                                                            columnNumber: 41
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/page.tsx",
                                                    lineNumber: 160,
                                                    columnNumber: 37
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/page.tsx",
                                            lineNumber: 152,
                                            columnNumber: 33
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/page.tsx",
                                    lineNumber: 142,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true)
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 110,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                        children: showCustomization && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CustomizationModal$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CustomizationModal"], {
                            onClose: ()=>{
                                setShowCustomization(false);
                                setCustomization(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$ghostService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GhostService"].getCustomization());
                            }
                        }, void 0, false, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 175,
                            columnNumber: 25
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 173,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                        children: showCalendar && calendarMode === 'history' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CalendarModal$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CalendarModal"], {
                            onClose: ()=>setShowCalendar(false),
                            onSwitchMode: ()=>setCalendarMode('planner')
                        }, void 0, false, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 186,
                            columnNumber: 25
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 184,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                        children: showCalendar && calendarMode === 'planner' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ExamPlannerModal$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ExamPlannerModal"], {
                            onClose: ()=>setShowCalendar(false),
                            onSwitchMode: ()=>setCalendarMode('history')
                        }, void 0, false, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 195,
                            columnNumber: 25
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 193,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                        children: showLevelModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$LevelModal$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LevelModal"], {
                            onClose: ()=>setShowLevelModal(false)
                        }, void 0, false, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 204,
                            columnNumber: 25
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 202,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$NoiseMixer$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["NoiseMixer"], {
                        isRacing: mode === 'RACE'
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 210,
                        columnNumber: 17
                    }, this),
                    mode === 'RACE' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                        initial: {
                            opacity: 0
                        },
                        animate: {
                            opacity: 1
                        },
                        className: "w-full h-full",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$RaceView$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["RaceView"], {
                            elapsed: elapsed,
                            ghostTime: raceTargetTime,
                            customization: customization,
                            onComplete: handleComplete,
                            isDrifting: isDrifting,
                            isRunning: isRunning,
                            onPause: stop,
                            onResume: start
                        }, void 0, false, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 218,
                            columnNumber: 25
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 213,
                        columnNumber: 21
                    }, this),
                    mode === 'RESULT' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ResultModal$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ResultModal"], {
                        duration: elapsed,
                        ghostTime: raceTargetTime,
                        fuelGained: lastFuelGained,
                        onClose: handleCloseResult,
                        totalXpEarned: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$ghostService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GhostService"].getTotalXpEarned(),
                        taskLabel: taskParent ? `${taskParent} › ${taskName}` : taskName
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 232,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 109,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/page.tsx",
        lineNumber: 105,
        columnNumber: 9
    }, this);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__51593faf._.js.map