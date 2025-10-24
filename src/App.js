import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
    const [tasks, setTasks] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [filter, setFilter] = useState("all");
    const [editingId, setEditingId] = useState(null);
    const [editingText, setEditingText] = useState("");

    // Load tasks from localStorage on component mount
    useEffect(() => {
        const savedTasks = localStorage.getItem("todoTasks");
        if (savedTasks) {
            setTasks(JSON.parse(savedTasks));
        }
    }, []);

    // Save tasks to localStorage whenever tasks change
    useEffect(() => {
        localStorage.setItem("todoTasks", JSON.stringify(tasks));
    }, [tasks]);

    // Add new task
    const addTask = () => {
        if (inputValue.trim() !== "") {
            const newTask = {
                id: Date.now(),
                text: inputValue.trim(),
                completed: false,
                createdAt: new Date().toLocaleString(),
            };
            setTasks([...tasks, newTask]);
            setInputValue("");
        }
    };

    // Delete task
    const deleteTask = (id) => {
        setTasks(tasks.filter((task) => task.id !== id));
    };

    // Toggle task completion
    const toggleTask = (id) => {
        setTasks(
            tasks.map((task) =>
                task.id === id ? { ...task, completed: !task.completed } : task
            )
        );
    };

    // Start editing task
    const startEditing = (id, text) => {
        setEditingId(id);
        setEditingText(text);
    };

    // Save edited task
    const saveEdit = (id) => {
        if (editingText.trim() !== "") {
            setTasks(
                tasks.map((task) =>
                    task.id === id
                        ? { ...task, text: editingText.trim() }
                        : task
                )
            );
        }
        setEditingId(null);
        setEditingText("");
    };

    // Cancel editing
    const cancelEdit = () => {
        setEditingId(null);
        setEditingText("");
    };

    // Reset input field
    const resetInput = () => {
        setInputValue("");
    };

    // Filter tasks based on selected filter
    const filteredTasks = tasks.filter((task) => {
        if (filter === "active") return !task.completed;
        if (filter === "completed") return task.completed;
        return true; // 'all' filter
    });

    // Calculate task statistics
    const totalTasks = tasks.length;
    const activeTasks = tasks.filter((task) => !task.completed).length;
    const completedTasks = tasks.filter((task) => task.completed).length;

    return (
        <div className="App">
            <div className="todo-container">
                <header className="todo-header">
                    <h1>📝 My To-Do List</h1>
                    <p>Stay organized and get things done!</p>
                </header>

                {/* Task Statistics */}
                <div className="task-stats">
                    <div className="stat-item">
                        <span className="stat-number">{totalTasks}</span>
                        <span className="stat-label">Total</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-number">{activeTasks}</span>
                        <span className="stat-label">Active</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-number">{completedTasks}</span>
                        <span className="stat-label">Completed</span>
                    </div>
                </div>

                {/* Task Input Form */}
                <div className="input-section">
                    <div className="input-group">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Enter your task here..."
                            className="task-input"
                            onKeyPress={(e) => e.key === "Enter" && addTask()}
                        />
                        <div className="input-buttons">
                            <button
                                onClick={addTask}
                                className="btn btn-add"
                                disabled={!inputValue.trim()}
                            >
                                ➕ Add
                            </button>
                            <button
                                onClick={resetInput}
                                className="btn btn-reset"
                            >
                                🔄 Reset
                            </button>
                        </div>
                    </div>
                </div>

                {/* Filter Buttons */}
                <div className="filter-section">
                    <button
                        onClick={() => setFilter("all")}
                        className={`filter-btn ${
                            filter === "all" ? "active" : ""
                        }`}
                    >
                        📋 All Lists ({totalTasks})
                    </button>
                    <button
                        onClick={() => setFilter("active")}
                        className={`filter-btn ${
                            filter === "active" ? "active" : ""
                        }`}
                    >
                        ⏳ Active Needs ({activeTasks})
                    </button>
                    <button
                        onClick={() => setFilter("completed")}
                        className={`filter-btn ${
                            filter === "completed" ? "active" : ""
                        }`}
                    >
                        ✅ Completed Needs ({completedTasks})
                    </button>
                </div>

                {/* Task List */}
                <div className="tasks-section">
                    {filteredTasks.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">📭</div>
                            <h3>No tasks found</h3>
                            <p>
                                {filter === "all" &&
                                    "Add your first task to get started!"}
                                {filter === "active" &&
                                    "All tasks are completed! Great job! 🎉"}
                                {filter === "completed" &&
                                    "No completed tasks yet. Start working on your goals!"}
                            </p>
                        </div>
                    ) : (
                        <ul className="task-list">
                            {filteredTasks.map((task) => (
                                <li
                                    key={task.id}
                                    className={`task-item ${
                                        task.completed ? "completed" : ""
                                    }`}
                                >
                                    <div className="task-content">
                                        <input
                                            type="checkbox"
                                            checked={task.completed}
                                            onChange={() => toggleTask(task.id)}
                                            className="task-checkbox"
                                        />
                                        {editingId === task.id ? (
                                            <div className="editing-section">
                                                <input
                                                    type="text"
                                                    value={editingText}
                                                    onChange={(e) =>
                                                        setEditingText(
                                                            e.target.value
                                                        )
                                                    }
                                                    className="edit-input"
                                                    onKeyPress={(e) => {
                                                        if (e.key === "Enter")
                                                            saveEdit(task.id);
                                                        if (e.key === "Escape")
                                                            cancelEdit();
                                                    }}
                                                    autoFocus
                                                />
                                                <div className="edit-buttons">
                                                    <button
                                                        onClick={() =>
                                                            saveEdit(task.id)
                                                        }
                                                        className="btn btn-save"
                                                    >
                                                        💾 Save
                                                    </button>
                                                    <button
                                                        onClick={cancelEdit}
                                                        className="btn btn-cancel"
                                                    >
                                                        ❌ Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="task-info">
                                                <span className="task-text">
                                                    {task.text}
                                                </span>
                                                <span className="task-date">
                                                    {task.createdAt}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    {editingId !== task.id && (
                                        <div className="task-actions">
                                            <button
                                                onClick={() =>
                                                    startEditing(
                                                        task.id,
                                                        task.text
                                                    )
                                                }
                                                className="btn btn-edit"
                                                title="Edit task"
                                            >
                                                ✏️ Edit
                                            </button>
                                            <button
                                                onClick={() =>
                                                    deleteTask(task.id)
                                                }
                                                className="btn btn-delete"
                                                title="Delete task"
                                            >
                                                🗑️ Delete
                                            </button>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}

export default App;
