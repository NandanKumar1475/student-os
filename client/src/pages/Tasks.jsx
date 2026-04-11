import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Plus, CheckSquare } from 'lucide-react';
import { taskService } from '../services/taskService';
import { gamificationService } from '../services/gamificationService';
import TaskCard from '../components/tasks/TaskCard';
import AddTaskModal from '../components/tasks/AddTaskModal';
import toast from 'react-hot-toast';

const TABS = ['Today', 'Upcoming', 'Completed'];

const StatCard = ({ label, value }) => (
    <div className="rounded-xl bg-gray-800 p-4">
        <p className="text-gray-400 text-sm">{label}</p>
        <p className="text-white text-2xl font-bold">{value}</p>
    </div>
);

export default function Tasks() {
    const [activeTab, setActiveTab] = useState('Today');
    const [allTasks, setAllTasks] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editTask, setEditTask] = useState(null);

    // ✅ USE AFTER DECLARATION
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

    // 🔥 TOGGLE (REAL-TIME)
    const handleToggle = async (id) => {
        try {
            await taskService.toggle(id);
            gamificationService.recordTask();

            setTasks(prev =>
                prev.map(t =>
                    t.id === id ? { ...t, completed: !t.completed } : t
                )
            );

            setAllTasks(prev =>
                prev.map(t =>
                    t.id === id ? { ...t, completed: !t.completed } : t
                )
            );

        } catch {
            toast.error("Update failed");
        }
    };

    // 🔥 DELETE (REAL-TIME)
    const handleDelete = async (id) => {
        if (!confirm('Delete this task?')) return;

        try {
            await taskService.delete(id);

            setTasks(prev => prev.filter(t => t.id !== id));
            setAllTasks(prev => prev.filter(t => t.id !== id));

            toast.success('Task deleted');

        } catch {
            toast.error("Delete failed");
        }
    };

    // 🔥 ADD + EDIT HANDLER
    const handleTaskAdded = (task, isEdit = false) => {
        if (isEdit) {
            // UPDATE EXISTING
            setAllTasks(prev =>
                prev.map(t => (t.id === task.id ? task : t))
            );

            setTasks(prev =>
                prev.map(t => (t.id === task.id ? task : t))
            );
        } else {
            // ADD NEW
            setAllTasks(prev => [task, ...prev]);

            if (activeTab === 'Today') {
                setTasks(prev => [task, ...prev]);
            }
        }
    };

    const handleEdit = (task) => {
        setEditTask(task);
        setShowModal(true);
    };

    // 📊 STATS (AUTO UPDATE)
    const today = new Date();

    const upcomingCount = allTasks.filter(t => {
        if (t.completed || !t.dueDate) return false;
        return new Date(t.dueDate) > today;
    }).length;

    const completedCount = allTasks.filter(t => t.completed).length;

    const completionRate =
        allTasks.length > 0
            ? Math.round((completedCount / allTasks.length) * 100)
            : 0;

    return (
        <div className="p-6 space-y-6">

            {/* HEADER */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-white flex gap-2">
                    Tasks <CheckSquare />
                </h1>

                <button
                    onClick={() => {
                        setEditTask(null);
                        setShowModal(true);
                    }}
                    className="bg-cyan-400 text-black px-4 py-2 rounded-lg flex gap-2 items-center"
                >
                    <Plus size={16} /> Add Task
                </button>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-4 gap-4">
                <StatCard label="Today's Tasks" value={tasks.length} />
                <StatCard label="Upcoming" value={upcomingCount} />
                <StatCard label="Completed" value={completedCount} />
                <StatCard label="Completion %" value={`${completionRate}%`} />
            </div>

            {/* TABS */}
            <div className="flex gap-2">
                {TABS.map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 rounded-lg ${
                            activeTab === tab
                                ? 'bg-cyan-400 text-black'
                                : 'bg-gray-700 text-white'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* TASK LIST */}
            <div className="space-y-2">
                {tasks.length === 0 ? (
                    <p className="text-gray-400">No tasks</p>
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

            {/* MODAL */}
            <AnimatePresence>
                {showModal && (
                    <AddTaskModal
                        editTask={editTask}
                        onClose={() => {
                            setShowModal(false);
                            setEditTask(null);
                        }}
                        onTaskAdded={handleTaskAdded}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}