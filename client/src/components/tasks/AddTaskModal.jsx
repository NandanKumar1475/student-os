import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';
import { taskService } from '../../services/taskService';
import { targetService } from '../../services/targetService';
import toast from 'react-hot-toast';

export default function AddTaskModal({ onClose, onTaskAdded, editTask }) {
    const MotionDiv = motion.div;
    const [targets, setTargets] = useState([]);

    // ✅ FORM INITIAL STATE
    const initialForm = {
        title: '',
        description: '',
        priority: 'MEDIUM',
        dueDate: '',
        dueTime: '',
        targetId: '',
    };

    // ✅ HANDLE EDIT / CREATE MODE
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

    // ✅ FETCH TARGETS
    useEffect(() => {
        const fetchTargets = async () => {
            try {
                const res = await targetService.getAll();
                setTargets(res.data);
            } catch {
                toast.error('Failed to load targets');
            }
        };

        fetchTargets();
    }, []);

    // ✅ INPUT HANDLER
    const handleChange = (field, value) => {
        setForm(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    // ✅ FINAL SUBMIT (CREATE + EDIT FIXED)
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

            // 🔥 EDIT TASK
            if (editTask) {
                const res = await taskService.update(editTask.id, payload);

                toast.success('Task updated!');

                // send updated task to parent
                onTaskAdded(res.data, true);
            }

            // 🔥 CREATE TASK
            else {
                const res = await taskService.create(payload);

                toast.success('Task created!');

                // send new task to parent
                onTaskAdded(res.data, false);
            }

            onClose();

        } catch (err) {
            console.error(err);
            toast.error('Something went wrong');
        }
    };

    const modalContent = (
        <MotionDiv
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={onClose}
        >
            <MotionDiv
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20 }}
                className="w-full max-w-md mx-4 rounded-2xl bg-gray-900 p-6 shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* HEADER */}
                <div className="flex justify-between items-center mb-5">
                    <h2 className="text-white text-xl font-bold">
                        {editTask ? 'Edit Task' : 'Add Task'}
                    </h2>

                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <X size={20} />
                    </button>
                </div>

                <div className="space-y-4">

                    {/* TITLE */}
                    <input
                        type="text"
                        placeholder="Task title..."
                        value={form.title}
                        onChange={e => handleChange('title', e.target.value)}
                        className="w-full p-2 rounded-lg bg-gray-800 text-white"
                    />

                    {/* DESCRIPTION */}
                    <textarea
                        placeholder="Description..."
                        value={form.description}
                        onChange={e => handleChange('description', e.target.value)}
                        className="w-full p-2 rounded-lg bg-gray-800 text-white"
                    />

                    {/* PRIORITY */}
                    <select
                        value={form.priority}
                        onChange={e => handleChange('priority', e.target.value)}
                        className="w-full p-2 rounded-lg bg-gray-800 text-white"
                    >
                        <option value="HIGH">High</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="LOW">Low</option>
                    </select>

                    {/* TARGET */}
                    <select
                        value={form.targetId}
                        onChange={e => handleChange('targetId', e.target.value)}
                        className="w-full p-2 rounded-lg bg-gray-800 text-white"
                    >
                        <option value="">No Target</option>
                        {targets.map(t => (
                            <option key={t.id} value={t.id}>
                                {t.title}
                            </option>
                        ))}
                    </select>

                    {/* DATE + TIME */}
                    <div className="flex gap-2">
                        <input
                            type="date"
                            value={form.dueDate}
                            onChange={e => handleChange('dueDate', e.target.value)}
                            className="w-1/2 p-2 rounded-lg bg-gray-800 text-white"
                        />

                        <input
                            type="time"
                            value={form.dueTime}
                            onChange={e => handleChange('dueTime', e.target.value)}
                            className="w-1/2 p-2 rounded-lg bg-gray-800 text-white"
                        />
                    </div>
                </div>

                {/* ACTIONS */}
                <div className="flex gap-3 mt-6">
                    <button
                        onClick={onClose}
                        className="flex-1 bg-gray-700 text-white py-2 rounded-lg"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleSubmit}
                        className="flex-1 bg-cyan-400 text-black py-2 rounded-lg font-semibold"
                    >
                        {editTask ? 'Update' : 'Create'}
                    </button>
                </div>
            </MotionDiv>
        </MotionDiv>
    );

    return createPortal(modalContent, document.body);
}
