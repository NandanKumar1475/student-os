import { useState } from 'react';
import { createTarget } from '../../api/targetApi';
import toast from 'react-hot-toast';

const CreateTargetModal = ({ isOpen, onClose, onCreated }) => {
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

  const inputClass = "w-full bg-[#1e1e35] text-gray-200 px-4 py-3 rounded-xl border border-[#2a2a45] focus:border-blue-500 focus:outline-none transition placeholder-gray-600 text-sm";

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#151525] rounded-2xl w-full max-w-md p-6 mx-4 border border-[#2a2a45] shadow-2xl">
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
              className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50 shadow-lg shadow-blue-600/20">
              {loading ? 'Creating...' : 'Create Target'}
            </button>
            <button type="button" onClick={onClose}
              className="px-6 py-3 bg-[#1e1e35] text-gray-400 rounded-xl font-semibold hover:bg-[#252545] hover:text-white transition border border-[#2a2a45]">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTargetModal;