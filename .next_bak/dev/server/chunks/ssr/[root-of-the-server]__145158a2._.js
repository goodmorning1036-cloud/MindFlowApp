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
    }
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
    getTask: (taskName)=>{
        const normalized = taskName.trim().toLowerCase();
        const data = getStorage();
        return data.tasks[normalized] || null;
    },
    saveRun: (taskName, duration)=>{
        const normalized = taskName.trim().toLowerCase();
        const data = getStorage();
        // Calculate Fuel: 10 XP per minute (duration is in ms)
        const fuelGained = Math.floor(duration / 1000 / 60 * 10);
        data.fuel = (data.fuel || 0) + fuelGained;
        data.totalXpEarned = (data.totalXpEarned || 0) + fuelGained;
        const existing = data.tasks[normalized];
        if (existing) {
            existing.history.push(duration);
            existing.lastRunAt = Date.now();
            if (duration > existing.bestTime) {
                existing.bestTime = duration;
            }
            data.tasks[normalized] = existing;
        } else {
            data.tasks[normalized] = {
                id: crypto.randomUUID(),
                name: taskName.trim(),
                bestTime: duration,
                history: [
                    duration
                ],
                lastRunAt: Date.now()
            };
        }
        saveStorage(data);
        return {
            record: data.tasks[normalized],
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
    deleteTask: (taskName)=>{
        const normalized = taskName.trim().toLowerCase();
        const data = getStorage();
        if (data.tasks[normalized]) {
            delete data.tasks[normalized];
            saveStorage(data);
        }
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
    const [task, setTask] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [targetTimeStr, setTargetTimeStr] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [recentTasks, setRecentTasks] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        // Load recent tasks on mount
        const all = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$ghostService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GhostService"].getAllTasks();
        setRecentTasks(all.slice(0, 5)); // Show top 5 recent
    }, []);
    const parseTimeInput = (input)=>{
        if (!input.trim()) return null;
        // Handle HH:MM format
        if (input.includes(':')) {
            const parts = input.split(':');
            if (parts.length === 2) {
                const hours = parseInt(parts[0], 10);
                const minutes = parseInt(parts[1], 10);
                if (!isNaN(hours) && !isNaN(minutes)) {
                    return hours * 60 + minutes;
                }
            }
        }
        // Handle plain minutes
        const minutes = parseFloat(input);
        return isNaN(minutes) ? null : minutes;
    };
    const handleSubmit = (e)=>{
        e?.preventDefault();
        if (task.trim()) {
            const parsedMinutes = parseTimeInput(targetTimeStr);
            if (parsedMinutes !== null && parsedMinutes > 0) {
                // Pass parsed ms to start handler instead of saving to service
                onStart(task, parsedMinutes * 60 * 1000);
            } else {
                onStart(task);
            }
        }
    };
    const handleRecentClick = (name)=>{
        setTask(name);
        const record = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$ghostService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GhostService"].getTask(name);
        if (record && record.bestTime) {
            // Convert ms to minutes for display, rounded
            setTargetTimeStr(Math.round(record.bestTime / 60000).toString());
        } else {
            setTargetTimeStr('');
        }
    };
    const handleDeleteTask = (e, name)=>{
        e.stopPropagation();
        __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$ghostService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GhostService"].deleteTask(name);
        setRecentTasks((prev)=>prev.filter((t)=>t.name !== name));
    };
    const formatDuration = (ms)=>{
        const minutes = Math.floor(ms / 60000);
        if (minutes < 60) {
            return `${minutes}m`;
        }
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
                                value: task,
                                onChange: (e)=>setTask(e.target.value),
                                placeholder: "What are you focusing on?",
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$TaskInput$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].input,
                                autoFocus: true
                            }, void 0, false, {
                                fileName: "[project]/app/components/TaskInput.tsx",
                                lineNumber: 85,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$TaskInput$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].timeInputWrapper,
                                initial: {
                                    opacity: 0
                                },
                                animate: {
                                    opacity: task.trim() ? 1 : 0.5
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$TaskInput$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].timeLabel,
                                        children: "Ghost Target:"
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/TaskInput.tsx",
                                        lineNumber: 100,
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
                                        lineNumber: 101,
                                        columnNumber: 25
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/TaskInput.tsx",
                                lineNumber: 95,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/TaskInput.tsx",
                        lineNumber: 84,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].button, {
                        type: "submit",
                        disabled: !task.trim(),
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$TaskInput$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].submitBtn,
                        animate: {
                            scale: task.trim() ? [
                                1,
                                1.05,
                                1
                            ] : 1,
                            boxShadow: task.trim() ? [
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
                        lineNumber: 111,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/TaskInput.tsx",
                lineNumber: 83,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                children: recentTasks.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
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
                            lineNumber: 143,
                            columnNumber: 25
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$TaskInput$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].taskList,
                            children: recentTasks.map((t)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$TaskInput$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].taskChip,
                                    onClick: ()=>handleRecentClick(t.name),
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
                                            lineNumber: 153,
                                            columnNumber: 37
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        t.bestTime > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$TaskInput$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].taskTime,
                                            children: formatDuration(t.bestTime)
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/TaskInput.tsx",
                                            lineNumber: 155,
                                            columnNumber: 41
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$TaskInput$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].deleteTaskBtn,
                                            onClick: (e)=>handleDeleteTask(e, t.name),
                                            title: "Delete task",
                                            children: "✕"
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/TaskInput.tsx",
                                            lineNumber: 159,
                                            columnNumber: 37
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, t.id, true, {
                                    fileName: "[project]/app/components/TaskInput.tsx",
                                    lineNumber: 146,
                                    columnNumber: 33
                                }, ("TURBOPACK compile-time value", void 0)))
                        }, void 0, false, {
                            fileName: "[project]/app/components/TaskInput.tsx",
                            lineNumber: 144,
                            columnNumber: 25
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/TaskInput.tsx",
                    lineNumber: 137,
                    columnNumber: 21
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/app/components/TaskInput.tsx",
                lineNumber: 135,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/TaskInput.tsx",
        lineNumber: 82,
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
  "carGlow": "RaceView-module__Oh4i1a__carGlow",
  "carGroundShadow": "RaceView-module__Oh4i1a__carGroundShadow",
  "carSpinOut": "RaceView-module__Oh4i1a__carSpinOut",
  "carSpinning": "RaceView-module__Oh4i1a__carSpinning",
  "completeBtn": "RaceView-module__Oh4i1a__completeBtn",
  "container": "RaceView-module__Oh4i1a__container",
  "dashboardPanel": "RaceView-module__Oh4i1a__dashboardPanel",
  "driftOverlay": "RaceView-module__Oh4i1a__driftOverlay",
  "driftSubtext": "RaceView-module__Oh4i1a__driftSubtext",
  "driftText": "RaceView-module__Oh4i1a__driftText",
  "envWrapper": "RaceView-module__Oh4i1a__envWrapper",
  "finishLine": "RaceView-module__Oh4i1a__finishLine",
  "flicker": "RaceView-module__Oh4i1a__flicker",
  "ghostGlow": "RaceView-module__Oh4i1a__ghostGlow",
  "ghostImg": "RaceView-module__Oh4i1a__ghostImg",
  "guardrailLeft": "RaceView-module__Oh4i1a__guardrailLeft",
  "guardrailRight": "RaceView-module__Oh4i1a__guardrailRight",
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
  "neonFlicker": "RaceView-module__Oh4i1a__neonFlicker",
  "neonGate": "RaceView-module__Oh4i1a__neonGate",
  "neonGateBar": "RaceView-module__Oh4i1a__neonGateBar",
  "neonGatePost": "RaceView-module__Oh4i1a__neonGatePost",
  "reflection": "RaceView-module__Oh4i1a__reflection",
  "roadCenterLine": "RaceView-module__Oh4i1a__roadCenterLine",
  "roadFloor": "RaceView-module__Oh4i1a__roadFloor",
  "roadGroup": "RaceView-module__Oh4i1a__roadGroup",
  "roadUnderGlow": "RaceView-module__Oh4i1a__roadUnderGlow",
  "roadVehicle": "RaceView-module__Oh4i1a__roadVehicle",
  "spark": "RaceView-module__Oh4i1a__spark",
  "speedLine": "RaceView-module__Oh4i1a__speedLine",
  "speedLinesOverlay": "RaceView-module__Oh4i1a__speedLinesOverlay",
  "starsDrift": "RaceView-module__Oh4i1a__starsDrift",
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
        viewBox: "0 0 60 40",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("defs", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("linearGradient", {
                        id: "bodyGradient",
                        x1: "30",
                        y1: "0",
                        x2: "30",
                        y2: "40",
                        gradientUnits: "userSpaceOnUse",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                stopColor: color,
                                stopOpacity: "0.8"
                            }, void 0, false, {
                                fileName: "[project]/app/components/Assets.tsx",
                                lineNumber: 7,
                                columnNumber: 17
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                offset: "1",
                                stopColor: "#000",
                                stopOpacity: "0.9"
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
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("linearGradient", {
                        id: "glassGradient",
                        x1: "30",
                        y1: "5",
                        x2: "30",
                        y2: "20",
                        gradientUnits: "userSpaceOnUse",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                stopColor: "#00E5FF",
                                stopOpacity: "0.4"
                            }, void 0, false, {
                                fileName: "[project]/app/components/Assets.tsx",
                                lineNumber: 11,
                                columnNumber: 17
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                offset: "1",
                                stopColor: "#000",
                                stopOpacity: "0.8"
                            }, void 0, false, {
                                fileName: "[project]/app/components/Assets.tsx",
                                lineNumber: 12,
                                columnNumber: 17
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/Assets.tsx",
                        lineNumber: 10,
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
                                stdDeviation: "2",
                                result: "coloredBlur"
                            }, void 0, false, {
                                fileName: "[project]/app/components/Assets.tsx",
                                lineNumber: 15,
                                columnNumber: 17
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("feMerge", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("feMergeNode", {
                                        in: "coloredBlur"
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/Assets.tsx",
                                        lineNumber: 17,
                                        columnNumber: 21
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("feMergeNode", {
                                        in: "SourceGraphic"
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/Assets.tsx",
                                        lineNumber: 18,
                                        columnNumber: 21
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/Assets.tsx",
                                lineNumber: 16,
                                columnNumber: 17
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/Assets.tsx",
                        lineNumber: 14,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/Assets.tsx",
                lineNumber: 5,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M2 22H10V36C10 38 8 40 6 40H4C2 40 2 38 2 36V22Z",
                fill: "#111",
                stroke: "#333",
                strokeWidth: "1"
            }, void 0, false, {
                fileName: "[project]/app/components/Assets.tsx",
                lineNumber: 24,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M50 22H58V36C58 38 56 40 54 40H52C50 40 50 38 50 36V22Z",
                fill: "#111",
                stroke: "#333",
                strokeWidth: "1"
            }, void 0, false, {
                fileName: "[project]/app/components/Assets.tsx",
                lineNumber: 25,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M10 25L15 15H45L50 25V35H10V25Z",
                fill: "url(#bodyGradient)",
                stroke: color,
                strokeWidth: "1"
            }, void 0, false, {
                fileName: "[project]/app/components/Assets.tsx",
                lineNumber: 28,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M18 15L22 5H38L42 15H18Z",
                fill: "url(#glassGradient)",
                stroke: color,
                strokeWidth: "0.5",
                opacity: "0.8"
            }, void 0, false, {
                fileName: "[project]/app/components/Assets.tsx",
                lineNumber: 31,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M15 35H45L40 40H20L15 35Z",
                fill: "#000",
                stroke: "#333",
                strokeWidth: "1"
            }, void 0, false, {
                fileName: "[project]/app/components/Assets.tsx",
                lineNumber: 34,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                x: "12",
                y: "26",
                width: "12",
                height: "3",
                fill: "#FF0040",
                filter: "url(#neonGlow)"
            }, void 0, false, {
                fileName: "[project]/app/components/Assets.tsx",
                lineNumber: 37,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                x: "36",
                y: "26",
                width: "12",
                height: "3",
                fill: "#FF0040",
                filter: "url(#neonGlow)"
            }, void 0, false, {
                fileName: "[project]/app/components/Assets.tsx",
                lineNumber: 38,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                x: "26",
                y: "26",
                width: "8",
                height: "2",
                fill: color,
                opacity: "0.6"
            }, void 0, false, {
                fileName: "[project]/app/components/Assets.tsx",
                lineNumber: 39,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "24",
                cy: "34",
                r: "2",
                fill: "#00E5FF",
                filter: "url(#neonGlow)",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("animate", {
                    attributeName: "opacity",
                    values: "0.5;1;0.5",
                    dur: "0.2s",
                    repeatCount: "indefinite"
                }, void 0, false, {
                    fileName: "[project]/app/components/Assets.tsx",
                    lineNumber: 43,
                    columnNumber: 13
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/app/components/Assets.tsx",
                lineNumber: 42,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "36",
                cy: "34",
                r: "2",
                fill: "#00E5FF",
                filter: "url(#neonGlow)",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("animate", {
                    attributeName: "opacity",
                    values: "0.5;1;0.5",
                    dur: "0.2s",
                    repeatCount: "indefinite",
                    begin: "0.1s"
                }, void 0, false, {
                    fileName: "[project]/app/components/Assets.tsx",
                    lineNumber: 46,
                    columnNumber: 13
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/app/components/Assets.tsx",
                lineNumber: 45,
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
                                    lineNumber: 69,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                    offset: "1",
                                    stopColor: c.primary,
                                    stopOpacity: "0"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/Assets.tsx",
                                    lineNumber: 70,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/Assets.tsx",
                            lineNumber: 68,
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
                                    lineNumber: 73,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("feComposite", {
                                    in: "SourceGraphic",
                                    in2: "blur",
                                    operator: "over"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/Assets.tsx",
                                    lineNumber: 74,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/Assets.tsx",
                            lineNumber: 72,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/Assets.tsx",
                    lineNumber: 67,
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
                    lineNumber: 78,
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
                    lineNumber: 81,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M17 22L22 25L17 28Z",
                    fill: c.primary,
                    opacity: "0.9"
                }, void 0, false, {
                    fileName: "[project]/app/components/Assets.tsx",
                    lineNumber: 83,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M33 22L28 25L33 28Z",
                    fill: c.primary,
                    opacity: "0.9"
                }, void 0, false, {
                    fileName: "[project]/app/components/Assets.tsx",
                    lineNumber: 84,
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
                        lineNumber: 86,
                        columnNumber: 21
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/app/components/Assets.tsx",
                    lineNumber: 85,
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
                        lineNumber: 89,
                        columnNumber: 21
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/app/components/Assets.tsx",
                    lineNumber: 88,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/app/components/Assets.tsx",
            lineNumber: 66,
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
                                    lineNumber: 100,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                    offset: "1",
                                    stopColor: c.secondary,
                                    stopOpacity: "0"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/Assets.tsx",
                                    lineNumber: 101,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/Assets.tsx",
                            lineNumber: 99,
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
                                    lineNumber: 104,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("feComposite", {
                                    in: "SourceGraphic",
                                    in2: "blur",
                                    operator: "over"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/Assets.tsx",
                                    lineNumber: 105,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/Assets.tsx",
                            lineNumber: 103,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/Assets.tsx",
                    lineNumber: 98,
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
                    lineNumber: 109,
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
                    lineNumber: 112,
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
                    lineNumber: 113,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                    cx: "20",
                    cy: "22",
                    r: "1.5",
                    fill: "white"
                }, void 0, false, {
                    fileName: "[project]/app/components/Assets.tsx",
                    lineNumber: 114,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                    cx: "30",
                    cy: "22",
                    r: "1.5",
                    fill: "white"
                }, void 0, false, {
                    fileName: "[project]/app/components/Assets.tsx",
                    lineNumber: 115,
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
                            lineNumber: 118,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("animate", {
                            attributeName: "opacity",
                            values: "0.4;0",
                            dur: "1.5s",
                            repeatCount: "indefinite"
                        }, void 0, false, {
                            fileName: "[project]/app/components/Assets.tsx",
                            lineNumber: 119,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/Assets.tsx",
                    lineNumber: 117,
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
                            lineNumber: 122,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("animate", {
                            attributeName: "opacity",
                            values: "0.3;0",
                            dur: "1.8s",
                            repeatCount: "indefinite"
                        }, void 0, false, {
                            fileName: "[project]/app/components/Assets.tsx",
                            lineNumber: 123,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/Assets.tsx",
                    lineNumber: 121,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/app/components/Assets.tsx",
            lineNumber: 97,
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
                                    lineNumber: 134,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                    offset: "1",
                                    stopColor: c.secondary,
                                    stopOpacity: "0"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/Assets.tsx",
                                    lineNumber: 135,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/Assets.tsx",
                            lineNumber: 133,
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
                                    lineNumber: 138,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("feComposite", {
                                    in: "SourceGraphic",
                                    in2: "blur",
                                    operator: "over"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/Assets.tsx",
                                    lineNumber: 139,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/Assets.tsx",
                            lineNumber: 137,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/Assets.tsx",
                    lineNumber: 132,
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
                    lineNumber: 143,
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
                    lineNumber: 144,
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
                        lineNumber: 147,
                        columnNumber: 21
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/app/components/Assets.tsx",
                    lineNumber: 146,
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
                        lineNumber: 151,
                        columnNumber: 21
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/app/components/Assets.tsx",
                    lineNumber: 150,
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
                    lineNumber: 153,
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
                            lineNumber: 156,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("animate", {
                            attributeName: "opacity",
                            values: "0.4;0",
                            dur: "1s",
                            repeatCount: "indefinite"
                        }, void 0, false, {
                            fileName: "[project]/app/components/Assets.tsx",
                            lineNumber: 157,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/Assets.tsx",
                    lineNumber: 155,
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
                            lineNumber: 160,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("animate", {
                            attributeName: "opacity",
                            values: "0.3;0",
                            dur: "1.2s",
                            repeatCount: "indefinite"
                        }, void 0, false, {
                            fileName: "[project]/app/components/Assets.tsx",
                            lineNumber: 161,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/Assets.tsx",
                    lineNumber: 159,
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
                            lineNumber: 164,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("animate", {
                            attributeName: "opacity",
                            values: "0.5;0",
                            dur: "0.8s",
                            repeatCount: "indefinite"
                        }, void 0, false, {
                            fileName: "[project]/app/components/Assets.tsx",
                            lineNumber: 165,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/Assets.tsx",
                    lineNumber: 163,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/app/components/Assets.tsx",
            lineNumber: 131,
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
                                    lineNumber: 176,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                    offset: "1",
                                    stopColor: c.secondary,
                                    stopOpacity: "0.1"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/Assets.tsx",
                                    lineNumber: 177,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/Assets.tsx",
                            lineNumber: 175,
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
                                    lineNumber: 180,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("feComposite", {
                                    in: "SourceGraphic",
                                    in2: "blur",
                                    operator: "over"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/Assets.tsx",
                                    lineNumber: 181,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/Assets.tsx",
                            lineNumber: 179,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/Assets.tsx",
                    lineNumber: 174,
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
                    lineNumber: 185,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    d: "M25 5L12 45M25 5L38 45M10 20H40M20 55L25 30L30 55",
                    stroke: c.primary,
                    strokeWidth: "0.5",
                    opacity: "0.3"
                }, void 0, false, {
                    fileName: "[project]/app/components/Assets.tsx",
                    lineNumber: 188,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                    cx: "25",
                    cy: "5",
                    r: "1.5",
                    fill: c.primary
                }, void 0, false, {
                    fileName: "[project]/app/components/Assets.tsx",
                    lineNumber: 190,
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
                    lineNumber: 191,
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
                    lineNumber: 192,
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
                            lineNumber: 195,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("animate", {
                            attributeName: "opacity",
                            values: "0.6;1;0.6",
                            dur: "1.5s",
                            repeatCount: "indefinite"
                        }, void 0, false, {
                            fileName: "[project]/app/components/Assets.tsx",
                            lineNumber: 196,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/Assets.tsx",
                    lineNumber: 194,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/app/components/Assets.tsx",
            lineNumber: 173,
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
                                    lineNumber: 207,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                    offset: "1",
                                    stopColor: c.secondary,
                                    stopOpacity: "0"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/Assets.tsx",
                                    lineNumber: 208,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/Assets.tsx",
                            lineNumber: 206,
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
                                    lineNumber: 211,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("feComposite", {
                                    in: "SourceGraphic",
                                    in2: "blur",
                                    operator: "over"
                                }, void 0, false, {
                                    fileName: "[project]/app/components/Assets.tsx",
                                    lineNumber: 212,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/Assets.tsx",
                            lineNumber: 210,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/Assets.tsx",
                    lineNumber: 205,
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
                        lineNumber: 217,
                        columnNumber: 21
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/app/components/Assets.tsx",
                    lineNumber: 216,
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
                        lineNumber: 221,
                        columnNumber: 21
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/app/components/Assets.tsx",
                    lineNumber: 220,
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
                    lineNumber: 224,
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
                    lineNumber: 226,
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
                        lineNumber: 228,
                        columnNumber: 21
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/app/components/Assets.tsx",
                    lineNumber: 227,
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
                        lineNumber: 232,
                        columnNumber: 21
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/app/components/Assets.tsx",
                    lineNumber: 231,
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
                        lineNumber: 235,
                        columnNumber: 21
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/app/components/Assets.tsx",
                    lineNumber: 234,
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
                        lineNumber: 238,
                        columnNumber: 21
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/app/components/Assets.tsx",
                    lineNumber: 237,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/app/components/Assets.tsx",
            lineNumber: 204,
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
                                lineNumber: 249,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                offset: "1",
                                stopColor: c.primary,
                                stopOpacity: "0"
                            }, void 0, false, {
                                fileName: "[project]/app/components/Assets.tsx",
                                lineNumber: 250,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/Assets.tsx",
                        lineNumber: 248,
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
                                lineNumber: 253,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("feComposite", {
                                in: "SourceGraphic",
                                in2: "blur",
                                operator: "over"
                            }, void 0, false, {
                                fileName: "[project]/app/components/Assets.tsx",
                                lineNumber: 254,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/Assets.tsx",
                        lineNumber: 252,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/Assets.tsx",
                lineNumber: 247,
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
                lineNumber: 257,
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
                lineNumber: 258,
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
                        lineNumber: 260,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("animate", {
                        attributeName: "opacity",
                        values: "0.8;1;0.8",
                        dur: "1.5s",
                        repeatCount: "indefinite"
                    }, void 0, false, {
                        fileName: "[project]/app/components/Assets.tsx",
                        lineNumber: 261,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/Assets.tsx",
                lineNumber: 259,
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
                        lineNumber: 264,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("animate", {
                        attributeName: "opacity",
                        values: "0.5;0",
                        dur: "1s",
                        repeatCount: "indefinite"
                    }, void 0, false, {
                        fileName: "[project]/app/components/Assets.tsx",
                        lineNumber: 265,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/Assets.tsx",
                lineNumber: 263,
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
                        lineNumber: 268,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("animate", {
                        attributeName: "opacity",
                        values: "0.5;0",
                        dur: "1.2s",
                        repeatCount: "indefinite"
                    }, void 0, false, {
                        fileName: "[project]/app/components/Assets.tsx",
                        lineNumber: 269,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/Assets.tsx",
                lineNumber: 267,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/Assets.tsx",
        lineNumber: 246,
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
                lineNumber: 277,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M20 22L38 48H2L20 22Z",
                stroke: "#00E5FF",
                strokeWidth: "1.5",
                vectorEffect: "non-scaling-stroke"
            }, void 0, false, {
                fileName: "[project]/app/components/Assets.tsx",
                lineNumber: 278,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M18 48H22V58H18V48Z",
                stroke: "#00E5FF",
                strokeWidth: "1.5"
            }, void 0, false, {
                fileName: "[project]/app/components/Assets.tsx",
                lineNumber: 279,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "20",
                cy: "15",
                r: "2",
                fill: "#00E5FF"
            }, void 0, false, {
                fileName: "[project]/app/components/Assets.tsx",
                lineNumber: 280,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "20",
                cy: "35",
                r: "2",
                fill: "#00E5FF"
            }, void 0, false, {
                fileName: "[project]/app/components/Assets.tsx",
                lineNumber: 281,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/Assets.tsx",
        lineNumber: 276,
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
            lineNumber: 287,
            columnNumber: 9
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/app/components/Assets.tsx",
        lineNumber: 286,
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
                                lineNumber: 296,
                                columnNumber: 17
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                offset: "1",
                                stopColor: "#00E5FF",
                                stopOpacity: "0.2"
                            }, void 0, false, {
                                fileName: "[project]/app/components/Assets.tsx",
                                lineNumber: 297,
                                columnNumber: 17
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/Assets.tsx",
                        lineNumber: 295,
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
                                lineNumber: 300,
                                columnNumber: 17
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("feComposite", {
                                in: "SourceGraphic",
                                in2: "blur",
                                operator: "over"
                            }, void 0, false, {
                                fileName: "[project]/app/components/Assets.tsx",
                                lineNumber: 301,
                                columnNumber: 17
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/Assets.tsx",
                        lineNumber: 299,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/Assets.tsx",
                lineNumber: 294,
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
                                lineNumber: 307,
                                columnNumber: 17
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("animate", {
                                attributeName: "opacity",
                                values: "0.4;0.9;0.4",
                                dur: "2s",
                                repeatCount: "indefinite"
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
                        lineNumber: 310,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "M40 90V55",
                        stroke: "url(#treeGradient)",
                        strokeWidth: "3",
                        strokeLinecap: "round"
                    }, void 0, false, {
                        fileName: "[project]/app/components/Assets.tsx",
                        lineNumber: 313,
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
                        lineNumber: 317,
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
                        lineNumber: 318,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "M40 10V35M20 35H60M40 35L60 35M40 35L20 35M40 60V35",
                        stroke: "white",
                        strokeWidth: "0.5",
                        opacity: "0.3"
                    }, void 0, false, {
                        fileName: "[project]/app/components/Assets.tsx",
                        lineNumber: 321,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "M40 10L20 35L40 60M40 10L60 35L40 60",
                        stroke: "#00E5FF",
                        strokeWidth: "1",
                        opacity: "0.5"
                    }, void 0, false, {
                        fileName: "[project]/app/components/Assets.tsx",
                        lineNumber: 322,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: "40",
                        cy: "10",
                        r: "1.5",
                        fill: "white"
                    }, void 0, false, {
                        fileName: "[project]/app/components/Assets.tsx",
                        lineNumber: 325,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: "60",
                        cy: "35",
                        r: "1",
                        fill: "white"
                    }, void 0, false, {
                        fileName: "[project]/app/components/Assets.tsx",
                        lineNumber: 326,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: "20",
                        cy: "35",
                        r: "1",
                        fill: "white"
                    }, void 0, false, {
                        fileName: "[project]/app/components/Assets.tsx",
                        lineNumber: 327,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: "40",
                        cy: "60",
                        r: "1",
                        fill: "white"
                    }, void 0, false, {
                        fileName: "[project]/app/components/Assets.tsx",
                        lineNumber: 328,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/Assets.tsx",
                lineNumber: 304,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/Assets.tsx",
        lineNumber: 293,
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
                lineNumber: 359,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: label
            }, void 0, false, {
                fileName: "[project]/app/components/Assets.tsx",
                lineNumber: 360,
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
                lineNumber: 363,
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
                lineNumber: 364,
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
                lineNumber: 367,
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
                lineNumber: 378,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/Assets.tsx",
        lineNumber: 335,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
}),
"[project]/app/components/TransparentImage.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TransparentImage",
    ()=>TransparentImage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
'use client';
;
;
const TransparentImage = ({ src, alt, className, width = 140, height, threshold = 40 })=>{
    const canvasRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [loaded, setLoaded] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = ()=>{
            const canvas = canvasRef.current;
            if (!canvas) return;
            const w = img.naturalWidth;
            const h = img.naturalHeight;
            canvas.width = w;
            canvas.height = h;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;
            ctx.drawImage(img, 0, 0);
            const imageData = ctx.getImageData(0, 0, w, h);
            const data = imageData.data;
            // Sample background color from the four corners
            const corners = [
                0,
                (w - 1) * 4,
                (h - 1) * w * 4,
                ((h - 1) * w + (w - 1)) * 4 // bottom-right
            ];
            let bgR = 0, bgG = 0, bgB = 0;
            for (const i of corners){
                bgR += data[i];
                bgG += data[i + 1];
                bgB += data[i + 2];
            }
            bgR = Math.round(bgR / 4);
            bgG = Math.round(bgG / 4);
            bgB = Math.round(bgB / 4);
            // Remove pixels similar to the background color
            for(let i = 0; i < data.length; i += 4){
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];
                const diff = Math.abs(r - bgR) + Math.abs(g - bgG) + Math.abs(b - bgB);
                if (diff < threshold) {
                    // Make fully transparent
                    data[i + 3] = 0;
                } else if (diff < threshold * 2) {
                    // Partial transparency for anti-aliased edges
                    const alpha = Math.min(255, (diff - threshold) / threshold * 255);
                    data[i + 3] = Math.round(alpha);
                }
            }
            ctx.putImageData(imageData, 0, 0);
            setLoaded(true);
        };
        img.src = src;
    }, [
        src,
        threshold
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("canvas", {
        ref: canvasRef,
        className: className,
        style: {
            width: width,
            height: height || 'auto',
            display: 'block',
            opacity: loaded ? 1 : 0,
            transition: 'opacity 0.3s ease'
        },
        "aria-label": alt
    }, void 0, false, {
        fileName: "[project]/app/components/TransparentImage.tsx",
        lineNumber: 90,
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
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$TransparentImage$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/components/TransparentImage.tsx [app-ssr] (ecmascript)");
;
;
;
;
;
;
;
const RaceView = ({ elapsed, ghostTime, customization, onComplete, isDrifting = false })=>{
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
    // Finish Line Progress
    // We want the finish line to reach the bottom (100%) when elapsed == ghostTime (Target Time).
    // If ghostTime is null (no target), we default to 60s for the visual.
    const targetDuration = ghostTime || 60000;
    const finishLineProgress = elapsed / targetDuration * 100;
    // Mile Markers - every 5 minutes
    const markerInterval = 5 * 60 * 1000;
    const markers = [];
    if (targetDuration > markerInterval) {
        for(let t = markerInterval; t < targetDuration; t += markerInterval){
            markers.push(t);
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$RaceView$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].container,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$RaceView$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].envWrapper,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$RaceView$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].starsLayerSlow
                    }, void 0, false, {
                        fileName: "[project]/app/components/RaceView.tsx",
                        lineNumber: 123,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$RaceView$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].starsLayerFast
                    }, void 0, false, {
                        fileName: "[project]/app/components/RaceView.tsx",
                        lineNumber: 124,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$RaceView$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].roadUnderGlow
                    }, void 0, false, {
                        fileName: "[project]/app/components/RaceView.tsx",
                        lineNumber: 127,
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
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$RaceView$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].driftText,
                                children: "DRIFT DETECTED"
                            }, void 0, false, {
                                fileName: "[project]/app/components/RaceView.tsx",
                                lineNumber: 137,
                                columnNumber: 25
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$RaceView$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].driftSubtext,
                                children: isDrifting ? "ATTENTION COMPROMISED..." : "REGAINING FOCUS..."
                            }, void 0, false, {
                                fileName: "[project]/app/components/RaceView.tsx",
                                lineNumber: 138,
                                columnNumber: 25
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/RaceView.tsx",
                        lineNumber: 131,
                        columnNumber: 21
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$RaceView$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].speedLinesOverlay,
                        children: [
                            ...Array(10)
                        ].map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$RaceView$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].speedLine,
                                initial: {
                                    opacity: 0,
                                    scaleX: 0
                                },
                                animate: {
                                    opacity: [
                                        0,
                                        0.4,
                                        0
                                    ],
                                    scaleX: [
                                        0.5,
                                        2,
                                        4
                                    ],
                                    x: i < 5 ? -800 : 800,
                                    y: 400
                                },
                                transition: {
                                    duration: 0.8 / (i % 3 + 1),
                                    repeat: Infinity,
                                    ease: "easeIn",
                                    delay: i * 0.1
                                },
                                style: {
                                    top: '44%',
                                    left: '50%',
                                    transformOrigin: i < 5 ? 'right center' : 'left center',
                                    rotate: i < 5 ? `${180 + i * 15}deg` : `${-i * 15}deg`
                                }
                            }, `speed-line-${i}`, false, {
                                fileName: "[project]/app/components/RaceView.tsx",
                                lineNumber: 147,
                                columnNumber: 25
                            }, ("TURBOPACK compile-time value", void 0)))
                    }, void 0, false, {
                        fileName: "[project]/app/components/RaceView.tsx",
                        lineNumber: 145,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$RaceView$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].roadGroup,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$RaceView$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].roadFloor,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$RaceView$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].roadCenterLine
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/RaceView.tsx",
                                        lineNumber: 176,
                                        columnNumber: 25
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$RaceView$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].guardrailLeft
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/RaceView.tsx",
                                        lineNumber: 178,
                                        columnNumber: 25
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$RaceView$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].guardrailRight
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/RaceView.tsx",
                                        lineNumber: 179,
                                        columnNumber: 25
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$RaceView$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].finishLine,
                                        style: {
                                            top: `${finishLineProgress}%`
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/RaceView.tsx",
                                        lineNumber: 181,
                                        columnNumber: 25
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/RaceView.tsx",
                                lineNumber: 175,
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
                                            lineNumber: 198,
                                            columnNumber: 64
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/RaceView.tsx",
                                        lineNumber: 198,
                                        columnNumber: 29
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, `tree-l-${i}`, false, {
                                    fileName: "[project]/app/components/RaceView.tsx",
                                    lineNumber: 189,
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
                                            lineNumber: 213,
                                            columnNumber: 64
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/RaceView.tsx",
                                        lineNumber: 213,
                                        columnNumber: 29
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, `tree-r-${i}`, false, {
                                    fileName: "[project]/app/components/RaceView.tsx",
                                    lineNumber: 204,
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
                                            lineNumber: 237,
                                            columnNumber: 29
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$RaceView$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].neonGatePost
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/RaceView.tsx",
                                            lineNumber: 238,
                                            columnNumber: 29
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, `gate-l-${i}`, true, {
                                    fileName: "[project]/app/components/RaceView.tsx",
                                    lineNumber: 219,
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
                                            lineNumber: 262,
                                            columnNumber: 29
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$RaceView$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].neonGatePost
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/RaceView.tsx",
                                            lineNumber: 263,
                                            columnNumber: 29
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, `gate-r-${i}`, true, {
                                    fileName: "[project]/app/components/RaceView.tsx",
                                    lineNumber: 244,
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
                                    lineNumber: 269,
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
                                    lineNumber: 291,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0)))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/RaceView.tsx",
                        lineNumber: 174,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$RaceView$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].vehicleOverlay,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$RaceView$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].roadVehicle,
                                style: {
                                    bottom: `${2 + userProgress / 100 * 28}%`,
                                    left: '25%',
                                    transform: `translate(-50%, 0) scale(${getScale(userProgress)})`
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
                                            lineNumber: 331,
                                            columnNumber: 29
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/RaceView.tsx",
                                        lineNumber: 330,
                                        columnNumber: 25
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$RaceView$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].carGroundShadow
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/RaceView.tsx",
                                        lineNumber: 335,
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
                                            lineNumber: 339,
                                            columnNumber: 29
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/RaceView.tsx",
                                        lineNumber: 338,
                                        columnNumber: 25
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            position: 'absolute',
                                            top: '-28px',
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                            fontSize: '11px',
                                            fontWeight: '800',
                                            color: customization.carColor,
                                            textShadow: `0 0 10px ${customization.carColor}`,
                                            letterSpacing: '0.15em',
                                            background: 'rgba(0,0,0,0.7)',
                                            padding: '3px 10px',
                                            borderRadius: '4px',
                                            border: `1px solid ${customization.carColor}80`,
                                            whiteSpace: 'nowrap',
                                            boxShadow: `0 0 15px ${customization.carColor}4D`
                                        },
                                        children: "YOU"
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/RaceView.tsx",
                                        lineNumber: 343,
                                        columnNumber: 25
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/RaceView.tsx",
                                lineNumber: 315,
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
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$TransparentImage$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TransparentImage"], {
                                            src: "/ghost.png",
                                            alt: "",
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$RaceView$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].ghostImg,
                                            width: 100
                                        }, void 0, false, {
                                            fileName: "[project]/app/components/RaceView.tsx",
                                            lineNumber: 380,
                                            columnNumber: 33
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/RaceView.tsx",
                                        lineNumber: 379,
                                        columnNumber: 29
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$TransparentImage$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TransparentImage"], {
                                        src: "/ghost.png",
                                        alt: "Ghost",
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$RaceView$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].ghostImg,
                                        width: 100
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/RaceView.tsx",
                                        lineNumber: 384,
                                        columnNumber: 29
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            position: 'absolute',
                                            top: '-28px',
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                            fontSize: '11px',
                                            fontWeight: '800',
                                            color: 'rgba(255,255,255,0.8)',
                                            textShadow: '0 0 10px white',
                                            letterSpacing: '0.15em',
                                            background: 'rgba(0,0,0,0.7)',
                                            padding: '3px 10px',
                                            borderRadius: '4px',
                                            border: '1px solid rgba(255,255,255,0.3)',
                                            whiteSpace: 'nowrap'
                                        },
                                        children: "GHOST"
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/RaceView.tsx",
                                        lineNumber: 392,
                                        columnNumber: 29
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/components/RaceView.tsx",
                                lineNumber: 364,
                                columnNumber: 25
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/components/RaceView.tsx",
                        lineNumber: 313,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/RaceView.tsx",
                lineNumber: 121,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$RaceView$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].timer} ${ghostTime ? isOvertime ? __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$RaceView$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].timerWinning : __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$RaceView$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].timerLosing : ''} ${isDrifting ? __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$RaceView$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].timerDrifting : ''}`,
                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$time$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatTime"])(elapsed)
            }, void 0, false, {
                fileName: "[project]/app/components/RaceView.tsx",
                lineNumber: 415,
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
                                    lineNumber: 426,
                                    columnNumber: 29
                                }, ("TURBOPACK compile-time value", void 0)),
                                (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$time$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatTime"])(Math.abs(timeDiff))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/RaceView.tsx",
                            lineNumber: 425,
                            columnNumber: 25
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/app/components/RaceView.tsx",
                        lineNumber: 424,
                        columnNumber: 21
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: onComplete,
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$RaceView$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].completeBtn,
                        children: "Complete Task"
                    }, void 0, false, {
                        fileName: "[project]/app/components/RaceView.tsx",
                        lineNumber: 431,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/app/components/RaceView.tsx",
                lineNumber: 421,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/app/components/RaceView.tsx",
        lineNumber: 118,
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
const ResultModal = ({ duration, ghostTime, fuelGained, onClose, totalXpEarned })=>{
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
                        lineNumber: 30,
                        columnNumber: 21
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/app/components/ResultModal.tsx",
                    lineNumber: 29,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ResultModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].title,
                    children: isWin ? 'New Personal Best!' : 'Ghost Won'
                }, void 0, false, {
                    fileName: "[project]/app/components/ResultModal.tsx",
                    lineNumber: 35,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ResultModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].subtitle,
                    children: isWin && ghostTime ? `You flowed for ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$time$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatTime"])(diff)} longer!` : !ghostTime ? "First flow session recorded." : "Try to flow longer next time."
                }, void 0, false, {
                    fileName: "[project]/app/components/ResultModal.tsx",
                    lineNumber: 39,
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
                                    lineNumber: 49,
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
                                    lineNumber: 50,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/ResultModal.tsx",
                            lineNumber: 48,
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
                                    lineNumber: 53,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ResultModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].statValue,
                                    children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$utils$2f$time$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatTime"])(duration)
                                }, void 0, false, {
                                    fileName: "[project]/app/components/ResultModal.tsx",
                                    lineNumber: 54,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/ResultModal.tsx",
                            lineNumber: 52,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/ResultModal.tsx",
                    lineNumber: 47,
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
                            lineNumber: 61,
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
                                    lineNumber: 71,
                                    columnNumber: 29
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ResultModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].levelTitle,
                                    children: currentLevelInfo.title.toUpperCase()
                                }, void 0, false, {
                                    fileName: "[project]/app/components/ResultModal.tsx",
                                    lineNumber: 72,
                                    columnNumber: 29
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/ResultModal.tsx",
                            lineNumber: 70,
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
                                lineNumber: 75,
                                columnNumber: 29
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/app/components/ResultModal.tsx",
                            lineNumber: 74,
                            columnNumber: 25
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ResultModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].levelXpText,
                            children: currentLevelInfo.xpForNext ? `${currentLevelInfo.currentXp} / ${currentLevelInfo.xpForNext} XP to next level` : 'MAX LEVEL REACHED'
                        }, void 0, false, {
                            fileName: "[project]/app/components/ResultModal.tsx",
                            lineNumber: 82,
                            columnNumber: 25
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/ResultModal.tsx",
                    lineNumber: 59,
                    columnNumber: 21
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: onClose,
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ResultModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].continueBtn,
                    children: "Continue"
                }, void 0, false, {
                    fileName: "[project]/app/components/ResultModal.tsx",
                    lineNumber: 90,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/app/components/ResultModal.tsx",
            lineNumber: 24,
            columnNumber: 13
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/app/components/ResultModal.tsx",
        lineNumber: 23,
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
        skyGradient: "radial-gradient(ellipse 80% 14% at 50% 44%, rgba(255,160,40,0.28) 0%, rgba(255,210,80,0.10) 60%, transparent 100%), radial-gradient(circle at 50% 0%, #0a1220 0%, #030508 100%)",
        glowColor: "rgba(0,229,255,0.22)",
        lineColor: "rgba(0,229,255,0.1)"
    },
    desert: {
        label: "Neon Desert",
        roadColor: "#1a0e00",
        roadBorder: "#FF8C00",
        skyGradient: "radial-gradient(ellipse 90% 20% at 50% 50%, rgba(255,120,20,0.4) 0%, rgba(255,60,0,0.15) 60%, transparent 100%), radial-gradient(circle at 50% 0%, #1a0800 0%, #0a0400 100%)",
        glowColor: "rgba(255,140,0,0.25)",
        lineColor: "rgba(255,140,0,0.12)"
    },
    storm: {
        label: "Storm Circuit",
        roadColor: "#050510",
        roadBorder: "#7B61FF",
        skyGradient: "radial-gradient(ellipse 70% 25% at 50% 45%, rgba(120,80,255,0.3) 0%, rgba(60,20,200,0.1) 60%, transparent 100%), radial-gradient(circle at 50% 0%, #080515 0%, #020208 100%)",
        glowColor: "rgba(123,97,255,0.25)",
        lineColor: "rgba(123,97,255,0.12)"
    },
    forest: {
        label: "Ghost Forest",
        roadColor: "#020a04",
        roadBorder: "#00FF87",
        skyGradient: "radial-gradient(ellipse 80% 16% at 50% 42%, rgba(0,200,80,0.25) 0%, rgba(0,100,40,0.1) 60%, transparent 100%), radial-gradient(circle at 50% 0%, #020a04 0%, #010502 100%)",
        glowColor: "rgba(0,255,135,0.2)",
        lineColor: "rgba(0,255,135,0.1)"
    },
    space: {
        label: "Orbital",
        roadColor: "#020010",
        roadBorder: "#C0C0FF",
        skyGradient: "radial-gradient(ellipse 60% 20% at 50% 40%, rgba(150,100,255,0.2) 0%, rgba(80,50,200,0.08) 60%, transparent 100%), radial-gradient(circle at 50% 0%, #020010 0%, #010008 100%)",
        glowColor: "rgba(192,192,255,0.2)",
        lineColor: "rgba(192,192,255,0.1)"
    },
    volcano: {
        label: "Magma Run",
        roadColor: "#150500",
        roadBorder: "#FF4400",
        skyGradient: "radial-gradient(ellipse 90% 30% at 50% 55%, rgba(255,80,0,0.5) 0%, rgba(200,20,0,0.2) 60%, transparent 100%), radial-gradient(circle at 50% 0%, #150200 0%, #080100 100%)",
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
                                    lineNumber: 157,
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
                                            lineNumber: 159,
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
                                            lineNumber: 160,
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
                                            lineNumber: 161,
                                            columnNumber: 29
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/components/CustomizationModal.tsx",
                                    lineNumber: 158,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/components/CustomizationModal.tsx",
                            lineNumber: 156,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onClose,
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CustomizationModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].closeButton,
                            children: "×"
                        }, void 0, false, {
                            fileName: "[project]/app/components/CustomizationModal.tsx",
                            lineNumber: 166,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/components/CustomizationModal.tsx",
                    lineNumber: 155,
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
                                    lineNumber: 177,
                                    columnNumber: 29
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: tab.label
                                }, void 0, false, {
                                    fileName: "[project]/app/components/CustomizationModal.tsx",
                                    lineNumber: 178,
                                    columnNumber: 29
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, tab.key, true, {
                            fileName: "[project]/app/components/CustomizationModal.tsx",
                            lineNumber: 172,
                            columnNumber: 25
                        }, ("TURBOPACK compile-time value", void 0)))
                }, void 0, false, {
                    fileName: "[project]/app/components/CustomizationModal.tsx",
                    lineNumber: 170,
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
                                            lineNumber: 197,
                                            columnNumber: 45
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/CustomizationModal.tsx",
                                        lineNumber: 196,
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
                                                lineNumber: 200,
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
                                                lineNumber: 201,
                                                columnNumber: 61
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            isActive && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CustomizationModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].statusLabel,
                                                children: "ACTIVE"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/CustomizationModal.tsx",
                                                lineNumber: 202,
                                                columnNumber: 58
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/CustomizationModal.tsx",
                                        lineNumber: 199,
                                        columnNumber: 41
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, item.id, true, {
                                fileName: "[project]/app/components/CustomizationModal.tsx",
                                lineNumber: 191,
                                columnNumber: 37
                            }, ("TURBOPACK compile-time value", void 0));
                        })
                    }, void 0, false, {
                        fileName: "[project]/app/components/CustomizationModal.tsx",
                        lineNumber: 186,
                        columnNumber: 25
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/app/components/CustomizationModal.tsx",
                    lineNumber: 185,
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
                                            lineNumber: 225,
                                            columnNumber: 45
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/app/components/CustomizationModal.tsx",
                                        lineNumber: 224,
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
                                                lineNumber: 228,
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
                                                lineNumber: 229,
                                                columnNumber: 61
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            isActive && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CustomizationModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].statusLabel,
                                                children: "ACTIVE"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/CustomizationModal.tsx",
                                                lineNumber: 230,
                                                columnNumber: 58
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/CustomizationModal.tsx",
                                        lineNumber: 227,
                                        columnNumber: 41
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, item.id, true, {
                                fileName: "[project]/app/components/CustomizationModal.tsx",
                                lineNumber: 219,
                                columnNumber: 37
                            }, ("TURBOPACK compile-time value", void 0));
                        })
                    }, void 0, false, {
                        fileName: "[project]/app/components/CustomizationModal.tsx",
                        lineNumber: 214,
                        columnNumber: 25
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/app/components/CustomizationModal.tsx",
                    lineNumber: 213,
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
                                            background: theme.skyGradient
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
                                                    lineNumber: 266,
                                                    columnNumber: 49
                                                }, ("TURBOPACK compile-time value", void 0))
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/CustomizationModal.tsx",
                                                lineNumber: 261,
                                                columnNumber: 45
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CustomizationModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].trackEmoji,
                                                children: item.emoji
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/CustomizationModal.tsx",
                                                lineNumber: 268,
                                                columnNumber: 45
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/CustomizationModal.tsx",
                                        lineNumber: 255,
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
                                                lineNumber: 272,
                                                columnNumber: 45
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CustomizationModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].trackDesc,
                                                children: item.description
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/CustomizationModal.tsx",
                                                lineNumber: 273,
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
                                                lineNumber: 274,
                                                columnNumber: 61
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            isActive && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$CustomizationModal$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].statusLabel,
                                                children: "ACTIVE"
                                            }, void 0, false, {
                                                fileName: "[project]/app/components/CustomizationModal.tsx",
                                                lineNumber: 275,
                                                columnNumber: 58
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/components/CustomizationModal.tsx",
                                        lineNumber: 271,
                                        columnNumber: 41
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, item.id, true, {
                                fileName: "[project]/app/components/CustomizationModal.tsx",
                                lineNumber: 248,
                                columnNumber: 37
                            }, ("TURBOPACK compile-time value", void 0));
                        })
                    }, void 0, false, {
                        fileName: "[project]/app/components/CustomizationModal.tsx",
                        lineNumber: 242,
                        columnNumber: 25
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/app/components/CustomizationModal.tsx",
                    lineNumber: 241,
                    columnNumber: 21
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/app/components/CustomizationModal.tsx",
            lineNumber: 153,
            columnNumber: 13
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/app/components/CustomizationModal.tsx",
        lineNumber: 147,
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
  "floatIn": "page-module__E0kJGG__floatIn",
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
                lineNumber: 21,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M25 100Q37.5 90 50 100Q62.5 110 75 100V45C75 31.1929 63.8071 20 50 20C36.1929 20 25 31.1929 25 45V100Z",
                fill: color,
                fillOpacity: "0.1"
            }, void 0, false, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 22,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "40",
                cy: "50",
                r: "3",
                fill: color
            }, void 0, false, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 23,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "60",
                cy: "50",
                r: "3",
                fill: color
            }, void 0, false, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 24,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/app/page.tsx",
        lineNumber: 20,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
function Home() {
    const [mode, setMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('HOME');
    const [isRacing, setIsRacing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isDrifting, setIsDrifting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [taskName, setTaskName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [raceTargetTime, setRaceTargetTime] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    // Customization & Progression State
    const [customization, setCustomization] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$ghostService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GhostService"].getCustomization());
    const [lastFuelGained, setLastFuelGained] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [showCustomization, setShowCustomization] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showLevelModal, setShowLevelModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const { elapsed, setSpeedMultiplier, start, stop, reset } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$hooks$2f$useTimer$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useTimer"])();
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
    const handleStart = (task, customDuration)=>{
        setIsRacing(true);
        const record = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$ghostService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GhostService"].getTask(task);
        setTaskName(task);
        const raceTarget = customDuration || (record ? record.bestTime : null);
        setRaceTargetTime(raceTarget);
        setTimeout(()=>{
            setMode('RACE');
            start();
            setIsRacing(false);
        }, 1200);
    };
    const handleComplete = ()=>{
        stop();
        const prevTotalXp = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$ghostService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GhostService"].getTotalXpEarned();
        const { fuelGained } = __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$ghostService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GhostService"].saveRun(taskName, elapsed);
        setLastFuelGained(fuelGained);
        setMode('RESULT');
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
                lineNumber: 93,
                columnNumber: 33
            }, this),
            mode === 'HOME' && !isRacing && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ThemeToggle$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ThemeToggle"], {}, void 0, false, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 94,
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
                                        lineNumber: 107,
                                        columnNumber: 33
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/page.tsx",
                                    lineNumber: 101,
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
                                        lineNumber: 116,
                                        columnNumber: 33
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/page.tsx",
                                    lineNumber: 110,
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
                                        lineNumber: 125,
                                        columnNumber: 33
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/app/page.tsx",
                                    lineNumber: 119,
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
                                            lineNumber: 135,
                                            columnNumber: 33
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$TaskInput$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TaskInput"], {
                                            onStart: handleStart
                                        }, void 0, false, {
                                            fileName: "[project]/app/page.tsx",
                                            lineNumber: 136,
                                            columnNumber: 33
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$TodoList$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TodoList"], {
                                            onStartRace: handleStart
                                        }, void 0, false, {
                                            fileName: "[project]/app/page.tsx",
                                            lineNumber: 137,
                                            columnNumber: 33
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].garageButton,
                                            onClick: ()=>setShowCustomization(true),
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$page$2e$module$2e$css__$5b$app$2d$ssr$5d$__$28$css__module$29$__["default"].garageIcon,
                                                    children: "🏎️"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/page.tsx",
                                                    lineNumber: 143,
                                                    columnNumber: 37
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: "GARAGE"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/page.tsx",
                                                    lineNumber: 144,
                                                    columnNumber: 37
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/app/page.tsx",
                                            lineNumber: 139,
                                            columnNumber: 33
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/page.tsx",
                                    lineNumber: 129,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, void 0, true)
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 97,
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
                            lineNumber: 153,
                            columnNumber: 25
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 151,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                        children: showLevelModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$LevelModal$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["LevelModal"], {
                            onClose: ()=>setShowLevelModal(false)
                        }, void 0, false, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 164,
                            columnNumber: 25
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 162,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$NoiseMixer$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["NoiseMixer"], {
                        isRacing: mode === 'RACE'
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 170,
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
                            isDrifting: isDrifting
                        }, void 0, false, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 178,
                            columnNumber: 25
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 173,
                        columnNumber: 21
                    }, this),
                    mode === 'RESULT' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$components$2f$ResultModal$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ResultModal"], {
                        duration: elapsed,
                        ghostTime: raceTargetTime,
                        fuelGained: lastFuelGained,
                        onClose: handleCloseResult,
                        totalXpEarned: __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$services$2f$ghostService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["GhostService"].getTotalXpEarned()
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 189,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 96,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/page.tsx",
        lineNumber: 92,
        columnNumber: 9
    }, this);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__145158a2._.js.map