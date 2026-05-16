"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GhostService, TodoItem } from "../services/ghostService";
import styles from "./TodoList.module.css";

interface TodoListProps {
    onStartRace: (taskName: string, customDuration?: number) => void;
}

export const TodoList = ({ onStartRace }: TodoListProps) => {
    const [todos, setTodos] = useState<TodoItem[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [editingTimeId, setEditingTimeId] = useState<string | null>(null);
    const [timeInputValue, setTimeInputValue] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);
    const timeInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setTodos(GhostService.getTodos());
    }, []);

    useEffect(() => {
        if (editingTimeId && timeInputRef.current) {
            timeInputRef.current.focus();
        }
    }, [editingTimeId]);

    const handleAddTodo = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!inputValue.trim()) return;

        const newTodo = GhostService.addTodo(inputValue);
        setTodos([...todos, newTodo]);
        setInputValue("");
    };

    const handleToggleTodo = (id: string) => {
        if (editingTimeId === id) return; // Don't toggle while editing time
        GhostService.toggleTodo(id);
        setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    };

    const handleDeleteTodo = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        GhostService.deleteTodo(id);
        setTodos(todos.filter(t => t.id !== id));
    };

    const handleStartFromTodo = (todo: TodoItem, e: React.MouseEvent) => {
        e.stopPropagation();
        const durationMs = todo.timeMinutes ? todo.timeMinutes * 60 * 1000 : undefined;
        onStartRace(todo.text, durationMs);
    };

    const handleOpenTimeEdit = (todo: TodoItem, e: React.MouseEvent) => {
        e.stopPropagation();
        setEditingTimeId(todo.id);
        setTimeInputValue(todo.timeMinutes ? String(todo.timeMinutes) : "");
    };

    const handleSaveTime = (id: string) => {
        const minutes = parseInt(timeInputValue, 10);
        const validMinutes = !isNaN(minutes) && minutes > 0 ? minutes : undefined;
        GhostService.updateTodoTime(id, validMinutes);
        setTodos(todos.map(t => t.id === id ? { ...t, timeMinutes: validMinutes } : t));
        setEditingTimeId(null);
        setTimeInputValue("");
    };

    const handleTimeKeyDown = (id: string, e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSaveTime(id);
        } else if (e.key === "Escape") {
            setEditingTimeId(null);
            setTimeInputValue("");
        }
    };

    const formatMinutes = (min: number): string => {
        if (min < 60) return `${min}m`;
        const h = Math.floor(min / 60);
        const m = min % 60;
        return m > 0 ? `${h}h ${m}m` : `${h}h`;
    };

    return (
        <div id="todo-list" className={styles.todoContainer}>
            <form className={styles.inputGroup} onSubmit={handleAddTodo}>
                <input
                    ref={inputRef}
                    className={styles.input}
                    placeholder="Add a quick task..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                />
                <button type="submit" className={styles.addButton}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                </button>
            </form>

            <div className={styles.todoList}>
                <AnimatePresence initial={false}>
                    {todos.map((todo) => (
                        <motion.div
                            key={todo.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.8, x: -20 }}
                            className={styles.todoItem}
                            onClick={() => handleToggleTodo(todo.id)}
                        >
                            <div className={`${styles.checkbox} ${todo.completed ? styles.completed : ""}`}>
                                {todo.completed && <div className={styles.check} />}
                            </div>
                            <span className={`${styles.text} ${todo.completed ? styles.completed : ""}`}>
                                {todo.text}
                            </span>

                            {/* Inline time badge / editor */}
                            {editingTimeId === todo.id ? (
                                <div className={styles.timeEditor} onClick={(e) => e.stopPropagation()}>
                                    <input
                                        ref={timeInputRef}
                                        className={styles.timeEditorInput}
                                        type="number"
                                        min="1"
                                        placeholder="min"
                                        value={timeInputValue}
                                        onChange={(e) => setTimeInputValue(e.target.value)}
                                        onKeyDown={(e) => handleTimeKeyDown(todo.id, e)}
                                        onBlur={() => handleSaveTime(todo.id)}
                                    />
                                    <span className={styles.timeEditorLabel}>min</span>
                                </div>
                            ) : todo.timeMinutes ? (
                                <span
                                    className={styles.timeBadge}
                                    onClick={(e) => handleOpenTimeEdit(todo, e)}
                                    title="Click to edit time"
                                >
                                    {formatMinutes(todo.timeMinutes)}
                                </span>
                            ) : null}

                            <div className={styles.actions}>
                                {/* Set time button */}
                                <button
                                    className={`${styles.iconButton} ${styles.timeButton}`}
                                    onClick={(e) => handleOpenTimeEdit(todo, e)}
                                    title="Set time"
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <polyline points="12 6 12 12 16 14"></polyline>
                                    </svg>
                                </button>
                                <button
                                    className={`${styles.iconButton} ${styles.raceButton}`}
                                    onClick={(e) => handleStartFromTodo(todo, e)}
                                    title="Start Race"
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                                    </svg>
                                </button>
                                <button
                                    className={`${styles.iconButton} ${styles.deleteButton}`}
                                    onClick={(e) => handleDeleteTodo(todo.id, e)}
                                    title="Delete"
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="3 6 5 6 21 6"></polyline>
                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                    </svg>
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};
