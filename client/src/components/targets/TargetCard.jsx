import { toggleFocus, deleteTarget } from '../../api/targetApi';
import toast from 'react-hot-toast';

const typeConfig = {
  EXAM: { icon: '📝', label: 'Exam', color: 'bg-blue-500/20 text-blue-400' },
  JOB: { icon: '💼', label: 'Job', color: 'bg-purple-500/20 text-purple-400' },
  SKILL: { icon: '🚀', label: 'Skill', color: 'bg-emerald-500/20 text-emerald-400' },
  CUSTOM: { icon: '🎯', label: 'Custom', color: 'bg-orange-500/20 text-orange-400' },
};

const statusConfig = {
  ACTIVE: { label: 'In Progress', color: 'bg-blue-500/20 text-blue-400' },
  COMPLETED: { label: 'Completed', color: 'bg-green-500/20 text-green-400' },
  PAUSED: { label: 'Paused', color: 'bg-gray-500/20 text-gray-400' },
};

const TargetCard = ({ target, onRefresh }) => {
  const type = typeConfig[target.type] || typeConfig.CUSTOM;
  const status = statusConfig[target.status] || statusConfig.ACTIVE;

  const daysLeft = target.deadline
    ? Math.ceil((new Date(target.deadline) - new Date()) / (1000 * 60 * 60 * 24))
    : null;

  const handleFocus = async () => {
    try {
      await toggleFocus(target.id);
      toast.success(target.isFocused ? 'Focus removed' : 'Target focused!');
      onRefresh();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to toggle focus');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this target?')) return;
    try {
      await deleteTarget(target.id);
      toast.success('Target deleted');
      onRefresh();
    } catch {
      toast.error('Failed to delete');
    }
  };

  // Progress bar color based on percentage
  const progressColor =
    target.progressPercentage >= 80 ? 'from-green-500 to-emerald-400' :
    target.progressPercentage >= 50 ? 'from-blue-500 to-blue-400' :
    target.progressPercentage >= 25 ? 'from-yellow-500 to-orange-400' :
    'from-blue-600 to-blue-500';

  return (
    <div className={`rounded-[28px] border p-5 transition-all backdrop-blur-xl hover:-translate-y-1
      ${target.isFocused
        ? 'border-cyan-200/30 bg-[linear-gradient(180deg,rgba(121,224,255,0.12),rgba(255,255,255,0.05))] shadow-[0_12px_30px_rgba(123,226,255,0.08)]'
        : 'border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.04))]'}`}
    >
      {/* Top Row: Type badge + Status badge */}
      <div className="flex items-center justify-between mb-3">
        <span className={`px-3 py-1 text-xs font-bold rounded-xl ${type.color}`}>
          {type.label}
        </span>
        <span className={`px-3 py-1 text-xs font-bold rounded-xl ${status.color}`}>
          {status.label}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-white text-lg font-bold mb-1">{target.title}</h3>
      {target.description && (
        <p className="text-slate-400 text-sm mb-4 line-clamp-2">{target.description}</p>
      )}

      {/* Progress */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1.5">
          <span className="text-slate-400">Progress</span>
          <span className="text-white font-semibold">{target.progressPercentage}%</span>
        </div>
        <div className="w-full bg-white/8 rounded-full h-2">
          <div
            className={`bg-gradient-to-r ${progressColor} h-2 rounded-full transition-all`}
            style={{ width: `${target.progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Deadline */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-slate-500 text-sm">📅</span>
        {target.deadline ? (
          <span className={`text-sm font-medium
            ${daysLeft <= 0 ? 'text-red-400' :
              daysLeft <= 7 ? 'text-orange-400' :
              'text-slate-400'}`}>
            {target.deadline}
            {daysLeft !== null && (
              <span className="ml-2 text-xs">
                ({daysLeft > 0 ? `${daysLeft}d left` : daysLeft === 0 ? 'Due today' : `${Math.abs(daysLeft)}d overdue`})
              </span>
            )}
          </span>
        ) : (
          <span className="text-slate-500 text-sm">No deadline</span>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={handleFocus}
          className={`flex-1 py-2.5 text-sm font-semibold rounded-2xl transition
            ${target.isFocused
              ? 'bg-cyan-300 text-slate-950 hover:brightness-105'
              : 'bg-white/8 text-slate-300 hover:text-white hover:bg-white/12'}`}
        >
          {target.isFocused ? '🔵 Focused' : '🎯 Focus'}
        </button>
        <button
          onClick={handleDelete}
          className="px-4 py-2.5 text-sm bg-white/8 text-slate-400 rounded-2xl hover:bg-red-500/20 hover:text-red-300 transition"
        >
          🗑️
        </button>
      </div>
    </div>
  );
};

export default TargetCard;
