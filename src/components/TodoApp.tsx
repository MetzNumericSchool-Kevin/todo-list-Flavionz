import React, { useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

type Priority = 'Urgent' | 'Normal' | 'Faire dès que possible';

type TodoItem = {
    id: number;
    description: string;
    done: boolean;
    priority: Priority;
};

export function TodoApp() {
    const [tasks, setTasks] = useLocalStorage<TodoItem[]>('tasks', [
        { id: 1, description: "Terminer le dernier niveau de Dark Souls nu", done: false, priority: 'Urgent' },
        { id: 2, description: "Tout au casino", done: false, priority: 'Normal' },
        { id: 3, description: "Emmener ma belle-mère à l’hôpital pour un bilan de santé", done: false, priority: 'Faire dès que possible'}
    ]);

    const [newTask, setNewTask] = useState('');
    const [newPriority, setNewPriority] = useState<Priority>('Normal');

    const addTask = () => {
        if (newTask.trim()) {
            const task: TodoItem = {
                id: Date.now(),
                description: newTask,
                done: false,
                priority: newPriority
            };
            setTasks([...tasks, task]);
            setNewTask('');
        }
    };

    const toggleTask = (id: number) => {
        setTasks(tasks.map(task =>
            task.id === id ? { ...task, done: !task.done } : task
        ));
    };

    const deleteTask = (id: number) => {
        setTasks(tasks.filter(task => task.id !== id));
    };

    const sortedTasks = tasks.sort((a, b) => {
        const priorityOrder = { 'Urgent': 1, 'Normal': 2, 'Faire dès que possible': 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

    const priorityColorMap = {
        'Urgent': 'bg-urgent',
        'Normal': 'bg-normal',
        'Faire dès que possible': 'bg-low',
    };

    return (
        <>
            <div className="flex">
                <label className="input input-bordered flex items-center gap-2">
                    <input
                        type="text"
                        className="grow"
                        placeholder="Ajouter une tâche"
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                    />
                </label>
                <select
                    className="select select-bordered ml-2"
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as Priority)}
                >
                    <option value="Urgent">Urgent</option>
                    <option value="Normal">Normal</option>
                    <option value="Faire dès que possible">Faire dès que possible</option>
                </select>
                <button className="btn btn-primary ml-2" onClick={addTask}>+</button>
            </div>

            <div className="my-5 flex-column gap-5 w-full text-left">
                {sortedTasks.map(task => (
                    <div
                        key={task.id}
                        className={`${priorityColorMap[task.priority]} w-full m-5 rounded-box p-4 flex items-center border border-gray-300`}
                    >
                        <span className="pr-4">
                            <input
                                type="checkbox"
                                checked={task.done}
                                onChange={() => toggleTask(task.id)}
                                className="checkbox checkbox-primary"
                            />
                        </span>
                        <span className={`flex-grow ${task.done ? 'line-through' : ''} text-white`}>
                            {task.description} <span className="text-sm text-gray-200">({task.priority})</span>
                        </span>
                        <div>
                            <button className="btn btn-error btn-outline btn-xs" onClick={() => deleteTask(task.id)}>
                                X
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}