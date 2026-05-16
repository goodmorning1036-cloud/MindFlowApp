import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TodoService, TodoItem } from '../services/todoService';
import styles from './TodoList.module.css';

export const TodoList = () => {
    const [todos, setTodos] = useState<TodoItem[]>([]);
    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
        setTodos(TodoService.getTodos());
    }, []);

    const handleAdd = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (inputValue.trim()) {
            const newItem = TodoService.addTodo(inputValue.trim());
            setTodos([newItem, ...todos]);
            setInputValue('');
        }
    };

    const handleToggle = (id: string) => {
        const updated = TodoService.toggleTodo(id);
        setTodos(updated);
    };

    const handleDelete = (id: string) => {
        const updated = TodoService.deleteTodo(id);
        setTodos(updated);
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <span className={styles.title}>Flow List</span>
            </div>

            <form onSubmit={handleAdd} className={styles.inputArea}>
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Add a task..."
                    className={styles.input}
                />
                <button type="submit" className={styles.addButton} disabled={!inputValue.trim()}>
                    +
                </button>
            </form>

            <div className={styles.list}>
                <AnimatePresence mode="popLayout">
                    {todos.length === 0 ? (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className={styles.emptyState}
                        >
                            Your mind is clear...
                        </motion.div>
                    ) : (
                        todos.map((todo) => (
                            <motion.div
                                key={todo.id}
                                layout
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className={styles.todoItem}
                            >
                                <div
                                    className={`${styles.checkbox} ${todo.completed ? styles.completed : ''}`}
                                    onClick={() => handleToggle(todo.id)}
                                />
                                <span
                                    className={`${styles.todoText} ${todo.completed ? styles.completed : ''}`}
                                    onClick={() => handleToggle(todo.id)}
                                >
                                    {todo.text}
                                </span>
                                <button
                                    className={styles.deleteBtn}
                                    onClick={() => handleDelete(todo.id)}
                                >
                                    ✕
                                </button>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
