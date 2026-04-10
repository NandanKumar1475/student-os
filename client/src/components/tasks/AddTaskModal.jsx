// client/src/components/tasks/AddTaskModal.jsx

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { taskService } from '../../services/taskService';
import { targetService } from '../../services/targetService';
import toast from 'react-hot-toast';

export default function AddTaskModal({ onClose, onTaskAdded, editTask }) {

    const [targets, setTargets] = useState([]);

    // ✅ Initial form
    const initialForm = {
        title: '',
        description: '',
        priority: 'MEDIUM',
        dueDate: '',
        dueTime: '',
        targetId: '',
    };

    // ✅ Initialize form WITHOUT useEffect (fix ESLint issue)
    const [form, setForm] = useState(() =>
        editTask
            ? {
                title: editTask.title || '',
                description: editTask.description || '',
                priority: editTask.priority || 'MEDIUM',
                dueDate: editTask.dueDate || '',
                dueTime: editTask.dueTime || '',
                targetId: editTask.targetId || '',
            }
            : initialForm
    );

    // ✅ Fetch targets (API side-effect → valid)
    useEffect(() => {
        const fetchTargets = async () => {
            try {
                const res = await targetService.getAll();
                setTargets(res.data);
            } catch {
                toast.error("Failed to load targets");
            }
        };

        fetchTargets();
    }, []);

    // ❌ NO setForm inside useEffect → ESLint issue solved

    const handleChange = (field, value) => {
        setForm(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async () => {
        if (!form.title.trim()) {
            return toast.error('Title is required');
        }

        try {
            const payload = {
                ...form,
                targetId: form.targetId ? Number(form.targetId) : null,
                dueTime: form.dueTime || null,
            };

            if (editTask) {
                await taskService.update(editTask.id, payload);
                toast.success('Task updated!');
            } else {
                await taskService.create(payload);
                toast.success('Task created!');
            }

            onTaskAdded();
            onClose();

        } catch {
            toast.error('Something went wrong');
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">

            <div className="bg-[#1a1f2e] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl">

                {/* Header */}
                <div className="flex justify-between items-center mb-5">
                    <h2 className="text-white font-bold text-xl">
                        {editTask ? 'Edit Task' : 'Add New Task'}
                    </h2>

                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <X size={20} />
                    </button>
                </div>

                <div className="space-y-4">

                    {/* Title */}
                    <div>
                        <label className="text-gray-400 text-sm mb-1 block">Title *</label>
                        <input
                            type="text"
                            placeholder="e.g. Complete DSA Assignment"
                            className="w-full bg-[#0f1117] border border-white/10 rounded-lg px-3 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500"
                            value={form.title}
                            onChange={e => handleChange('title', e.target.value)}
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="text-gray-400 text-sm mb-1 block">Description</label>
                        <textarea
                            rows={2}
                            placeholder="Optional details..."
                            className="w-full bg-[#0f1117] border border-white/10 rounded-lg px-3 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-purple-500 resize-none"
                            value={form.description}
                            onChange={e => handleChange('description', e.target.value)}
                        />
                    </div>

                    {/* Priority + Target */}
                    <div className="grid grid-cols-2 gap-3">

                        <div>
                            <label className="text-gray-400 text-sm mb-1 block">Priority</label>
                            <select
                                className="w-full bg-[#0f1117] border border-white/10 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-purple-500"
                                value={form.priority}
                                onChange={e => handleChange('priority', e.target.value)}
                            >
                                <option value="HIGH">High</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="LOW">Low</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-gray-400 text-sm mb-1 block">Link to Target</label>
                            <select
                                className="w-full bg-[#0f1117] border border-white/10 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-purple-500"
                                value={form.targetId}
                                onChange={e => handleChange('targetId', e.target.value)}
                            >
                                <option value="">None</option>
                                {targets.map(t => (
                                    <option key={t.id} value={t.id}>
                                        {t.title}
                                    </option>
                                ))}
                            </select>
                        </div>

                    </div>

                    {/* Due Date + Time */}
                    <div className="grid grid-cols-2 gap-3">

                        <div>
                            <label className="text-gray-400 text-sm mb-1 block">Due Date</label>
                            <input
                                type="date"
                                className="w-full bg-[#0f1117] border border-white/10 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-purple-500"
                                value={form.dueDate}
                                onChange={e => handleChange('dueDate', e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="text-gray-400 text-sm mb-1 block">Due Time</label>
                            <input
                                type="time"
                                className="w-full bg-[#0f1117] border border-white/10 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-purple-500"
                                value={form.dueTime}
                                onChange={e => handleChange('dueTime', e.target.value)}
                            />
                        </div>

                    </div>

                </div>

                {/* Buttons */}
                <div className="flex gap-3 mt-6">

                    <button
                        onClick={onClose}
                        className="flex-1 py-2.5 rounded-lg border border-white/10 text-gray-400 hover:text-white hover:border-white/30 transition">
                        Cancel
                    </button>

                    <button
                        onClick={handleSubmit}
                        className="flex-1 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold transition">
                        {editTask ? 'Update Task' : 'Create Task'}
                    </button>

                </div>

            </div>
        </div>
    );
}