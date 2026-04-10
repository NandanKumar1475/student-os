// client/src/pages/Tasks.jsx

import { useState, useEffect } from 'react';
import { Filter, Plus, CheckSquare, Sparkles } from 'lucide-react';
import { taskService } from '../services/taskService'; // ✅ FIXED
import TaskCard from '../components/tasks/TaskCard';
import AddTaskModal from '../components/tasks/AddTaskModal';
import toast from 'react-hot-toast';

const TABS = ['Today', 'Upcoming', 'Completed'];

const StatCard = ({ label, value }) => (
    <div className="rounded-[28px] border border-white/10 bg-white/6 p-5 backdrop-blur-xl">
        <p className="text-slate-400 text-sm mb-2">{label}</p>
        <p className="text-white text-3xl font-black">{value}</p>
    </div>
);

export default function Tasks() {
    const [activeTab, setActiveTab] = useState('Today');
    const [allTasks, setAllTasks] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editTask, setEditTask] = useState(null);

    // ✅ FIXED: No useCallback, clean useEffect
    useEffect(() => {
        const loadTasks = async () => {
            try {
                const allRes = await taskService.getAll();
                setAllTasks(allRes.data);

                let res;
                switch (activeTab) {
                    case 'Upcoming':
                        res = await taskService.getUpcoming();
                        break;
                    case 'Completed':
                        res = await taskService.getCompleted();
                        break;
                    default:
                        res = await taskService.getToday();
                }

                setTasks(res.data);

            } catch {
                toast.error('Failed to load tasks');
            }
        };

        loadTasks();
    }, [activeTab]);

    // ✅ Safe handlers
    const handleToggle = async (id) => {
        try {
            await taskService.toggle(id);
            refresh();
        } catch {
            toast.error("Update failed");
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this task?')) return;

        try {
            await taskService.delete(id);
            toast.success('Task deleted');
            refresh();
        } catch {
            toast.error("Delete failed");
        }
    };

    const handleEdit = (task) => {
        setEditTask(task);
        setShowModal(true);
    };

    // ✅ Helper to reload tasks
    const refresh = () => {
        setActiveTab(prev => prev); // triggers useEffect
    };

    // ✅ FIXED date logic
    const today = new Date();

    const upcomingCount = allTasks.filter(t => {
        if (t.completed || !t.dueDate) return false;
        return new Date(t.dueDate) > today;
    }).length;

    const completedCount = allTasks.filter(t => t.completed).length;
    const todayTotal = allTasks.length;

    const completionRate =
        todayTotal > 0 ? Math.round((completedCount / todayTotal) * 100) : 0;

    return (
        <div className="mx-auto max-w-6xl space-y-6">
            <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
                <div className="rounded-[32px] border border-white/10 bg-[linear-gradient(135deg,rgba(121,224,255,0.14),rgba(255,190,125,0.08),rgba(255,255,255,0.04))] p-8 backdrop-blur-xl">
                    <p className="text-xs uppercase tracking-[0.35em] text-cyan-100/55">Task flow</p>
                    <h1 className="mt-2 text-4xl font-black tracking-tight text-white">Work that feels organized instantly.</h1>
                    <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
                        The design is more premium now, but still built to stay easy to scan and easy to understand.
                    </p>
                </div>

                <div className="rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(8,20,34,0.92),rgba(7,17,29,0.76))] p-6 backdrop-blur-xl">
                    <div className="flex items-center gap-2 text-cyan-200">
                        <Sparkles size={18} />
                        <span className="text-sm font-medium">Task clarity</span>
                    </div>
                    <div className="mt-5 grid grid-cols-2 gap-3">
                        <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
                            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Due soon</p>
                            <p className="mt-2 text-2xl font-bold text-white">{upcomingCount}</p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
                            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Completion</p>
                            <p className="mt-2 text-2xl font-bold text-white">{completionRate}%</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                        Tasks <CheckSquare size={28} className="text-emerald-300" />
                    </h1>
                    <p className="text-slate-400 mt-1">
                        Manage your daily tasks and to-dos
                    </p>
                </div>

                <div className="flex flex-wrap gap-3">
                    <button className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-slate-300 transition hover:bg-white/10 hover:text-white">
                        <Filter size={16} /> Filter
                    </button>

                    <button
                        onClick={() => {
                            setEditTask(null);
                            setShowModal(true);
                        }}
                        className="flex items-center gap-2 rounded-2xl bg-[linear-gradient(90deg,#79e0ff,#ffbf7d)] px-5 py-3 text-slate-950 font-semibold transition hover:brightness-105">
                        <Plus size={18} /> Add Task
                    </button>
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard label="Today's Tasks" value={tasks.length} />
                <StatCard label="Upcoming" value={upcomingCount} />
                <StatCard label="Completed" value={completedCount} />
                <StatCard label="Completion Rate" value={`${completionRate}%`} />
            </div>

            <div className="flex flex-wrap gap-2">
                {TABS.map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-5 py-2.5 rounded-2xl text-sm font-medium transition
                        ${activeTab === tab
                                ? 'border border-cyan-200/20 bg-cyan-300/15 text-white'
                                : 'border border-white/10 bg-white/6 text-slate-400 hover:bg-white/10 hover:text-white'}`}>
                        {tab}
                    </button>
                ))}
            </div>

            <div className="space-y-3">
                {tasks.length === 0 ? (
                    <div className="rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(8,20,34,0.88),rgba(7,17,29,0.72))] py-16 text-center text-slate-500 backdrop-blur-xl">
                        <CheckSquare size={48} className="mx-auto mb-3 opacity-30" />
                        <p>No tasks here. Add one!</p>
                    </div>
                ) : (
                    tasks.map(task => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            onToggle={handleToggle}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    ))
                )}
            </div>

            {showModal && (
                <AddTaskModal
                    editTask={editTask}
                    onClose={() => {
                        setShowModal(false);
                        setEditTask(null);
                    }}
                    onTaskAdded={refresh}
                />
            )}
        </div>
    );
}
