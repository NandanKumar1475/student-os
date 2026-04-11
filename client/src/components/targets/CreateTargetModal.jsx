import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { createTarget } from '../../api/targetApi';
import toast from 'react-hot-toast';

const CreateTargetModal = ({ isOpen, onClose, onCreated }) => {
  const MotionDiv = motion.div;
  const [form, setForm] = useState({
    title: '',
    description: '',
    type: 'SKILL',
    deadline: '',
    priority: 'MEDIUM',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form };
      if (!payload.deadline) delete payload.deadline;
      await createTarget(payload);
      toast.success('Target created!');
      setForm({ title: '', description: '', type: 'SKILL', deadline: '', priority: 'MEDIUM' });
      onCreated();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create target');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const inputClass = "w-full rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-cyan-300/35 focus:bg-white/10";

  const modalContent = (
    <MotionDiv
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <MotionDiv
        initial={{ opacity: 0, y: 28, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 18, scale: 0.98 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        className="mx-4 w-full max-w-md rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(8,20,34,0.96),rgba(8,18,31,0.9))] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.45)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Create New Target</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white text-2xl transition">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Title</label>
            <input type="text" name="title" value={form.title} onChange={handleChange} required
              className={inputClass} placeholder="e.g. Master DSA" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows="2"
              className={`${inputClass} resize-none`} placeholder="What do you want to achieve?" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Type</label>
              <select name="type" value={form.type} onChange={handleChange} className={inputClass}>
                <option value="EXAM">📝 Exam</option>
                <option value="JOB">💼 Job</option>
                <option value="SKILL">🚀 Skill</option>
                <option value="CUSTOM">🎯 Custom</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Priority</label>
              <select name="priority" value={form.priority} onChange={handleChange} className={inputClass}>
                <option value="HIGH">🔴 High</option>
                <option value="MEDIUM">🟡 Medium</option>
                <option value="LOW">🟢 Low</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Deadline</label>
            <input type="date" name="deadline" value={form.deadline} onChange={handleChange}
              className={inputClass} />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading}
              className="flex-1 rounded-2xl bg-[linear-gradient(90deg,#79e0ff,#ffbf7d)] py-3 font-semibold text-slate-950 transition hover:brightness-105 disabled:opacity-50">
              {loading ? 'Creating...' : 'Create Target'}
            </button>
            <button type="button" onClick={onClose}
              className="rounded-2xl border border-white/10 bg-white/6 px-6 py-3 font-semibold text-gray-400 transition hover:bg-white/10 hover:text-white">
              Cancel
            </button>
          </div>
        </form>
      </MotionDiv>
    </MotionDiv>
  );

  return createPortal(modalContent, document.body);
};

export default CreateTargetModal;
