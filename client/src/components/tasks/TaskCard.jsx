// client/src/components/tasks/TaskCard.jsx

import { CheckCircle2, Circle, Pencil, Trash2, Calendar, Target } from 'lucide-react';

const priorityConfig = {
    HIGH: { label: 'high', color: 'text-red-400 bg-red-400/10' },
    MEDIUM: { label: 'medium', color: 'text-yellow-400 bg-yellow-400/10' },
    LOW: { label: 'low', color: 'text-green-400 bg-green-400/10' },
};

export default function TaskCard({ task, onToggle, onEdit, onDelete }) {
    const p = priorityConfig[task.priority] || priorityConfig.MEDIUM;

    return (
        <div className={`flex items-start gap-4 p-4 rounded-3xl border transition-all backdrop-blur-xl
            ${task.completed
                ? 'bg-white/4 border-white/6 opacity-60'
                : 'bg-white/6 border-white/10 hover:border-cyan-200/20 hover:bg-white/8'}`}>

            <button onClick={() => onToggle(task.id)} className="mt-0.5 shrink-0">
                {task.completed
                    ? <CheckCircle2 size={20} className="text-cyan-300" />
                    : <Circle size={20} className="text-slate-500 hover:text-cyan-300 transition" />
                }
            </button>

            <div className="flex-1 min-w-0">
                <p className={`font-medium ${task.completed ? 'line-through text-slate-500' : 'text-white'}`}>
                    {task.title}
                </p>
                <div className="flex items-center gap-4 mt-1.5 flex-wrap">
                    {task.dueDate && (
                        <span className="flex items-center gap-1 text-xs text-slate-400">
                            <Calendar size={12} />
                            {task.dueDate}
                            {task.dueTime && `, ${task.dueTime.slice(0, 5)}`}
                        </span>
                    )}
                    {task.targetTitle && (
                        <span className="flex items-center gap-1 text-xs text-slate-400">
                            <Target size={12} />
                            {task.targetTitle}
                        </span>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.color}`}>
                    {p.label}
                </span>
                <button onClick={() => onEdit(task)}
                    className="text-slate-500 hover:text-cyan-300 transition p-1">
                    <Pencil size={14} />
                </button>
                <button onClick={() => onDelete(task.id)}
                    className="text-slate-500 hover:text-red-300 transition p-1">
                    <Trash2 size={14} />
                </button>
            </div>
        </div>
    );
}
