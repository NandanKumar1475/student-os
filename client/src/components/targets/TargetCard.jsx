import { toggleFocus, deleteTarget } from '../../api/targetApi';
import toast from 'react-hot-toast';

const priorityColors = {
  HIGH: 'bg-red-500/20 text-red-400',
  MEDIUM: 'bg-yellow-500/20 text-yellow-400',
  LOW: 'bg-green-500/20 text-green-400',
};

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
    } catch (err) {
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
    <div className={`bg-[#1e1e35] rounded-2xl p-5 border-2 transition-all hover:border-[#3a3a55]
      ${target.isFocused
        ? 'border-blue-500 shadow-lg shadow-blue-500/10'
        : 'border-[#2a2a45]'}`}
    >
      {/* Top Row: Type badge + Status badge */}
      <div className="flex items-center justify-between mb-3">
        <span className={`px-2.5 py-1 text-xs font-bold rounded-lg ${type.color}`}>
          {type.label}
        </span>
        <span className={`px-2.5 py-1 text-xs font-bold rounded-lg ${status.color}`}>
          {status.label}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-white text-lg font-bold mb-1">{target.title}</h3>
      {target.description && (
        <p className="text-gray-500 text-sm mb-4 line-clamp-2">{target.description}</p>
      )}

      {/* Progress */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1.5">
          <span className="text-gray-400">Progress</span>
          <span className="text-white font-semibold">{target.progressPercentage}%</span>
        </div>
        <div className="w-full bg-[#2a2a45] rounded-full h-2">
          <div
            className={`bg-gradient-to-r ${progressColor} h-2 rounded-full transition-all`}
            style={{ width: `${target.progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Deadline */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-gray-500 text-sm">📅</span>
        {target.deadline ? (
          <span className={`text-sm font-medium
            ${daysLeft <= 0 ? 'text-red-400' :
              daysLeft <= 7 ? 'text-orange-400' :
              'text-gray-400'}`}>
            {target.deadline}
            {daysLeft !== null && (
              <span className="ml-2 text-xs">
                ({daysLeft > 0 ? `${daysLeft}d left` : daysLeft === 0 ? 'Due today' : `${Math.abs(daysLeft)}d overdue`})
              </span>
            )}
          </span>
        ) : (
          <span className="text-gray-600 text-sm">No deadline</span>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={handleFocus}
          className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition
            ${target.isFocused
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-[#252545] text-gray-400 hover:text-white hover:bg-[#2a2a55]'}`}
        >
          {target.isFocused ? '🔵 Focused' : '🎯 Focus'}
        </button>
        <button
          onClick={handleDelete}
          className="px-4 py-2.5 text-sm bg-[#252545] text-gray-400 rounded-xl hover:bg-red-500/20 hover:text-red-400 transition"
        >
          🗑️
        </button>
      </div>
    </div>
  );
};

export default TargetCard;