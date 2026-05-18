import { useState } from 'react';
import { Calendar, Target, Trash2, CheckCircle2, PauseCircle, TrendingUp } from 'lucide-react';
import { toggleFocus, deleteTarget } from '../../api/targetApi';
import ConfirmDialog from '../ui/ConfirmDialog';
import toast from 'react-hot-toast';

const typeConfig = {
  EXAM:   { emoji: '📝', label: 'Exam',   color: 'bg-blue-500/15 text-blue-300 border border-blue-500/20' },
  JOB:    { emoji: '💼', label: 'Job',    color: 'bg-purple-500/15 text-purple-300 border border-purple-500/20' },
  SKILL:  { emoji: '🚀', label: 'Skill',  color: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/20' },
  CUSTOM: { emoji: '🎯', label: 'Custom', color: 'bg-orange-500/15 text-orange-300 border border-orange-500/20' },
};

const statusConfig = {
  ACTIVE:    { label: 'Active',    Icon: TrendingUp,    color: 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/20' },
  COMPLETED: { label: 'Completed', Icon: CheckCircle2,  color: 'bg-green-500/15 text-green-300 border border-green-500/20' },
  PAUSED:    { label: 'Paused',    Icon: PauseCircle,   color: 'bg-slate-500/15 text-slate-400 border border-slate-500/20' },
};

const progressGradient = (pct) =>
  pct >= 80 ? 'from-emerald-400 to-green-300' :
  pct >= 50 ? 'from-cyan-400 to-blue-400' :
  pct >= 25 ? 'from-yellow-400 to-orange-400' :
              'from-blue-500 to-cyan-500';

const TargetCard = ({ target, onRefresh }) => {
  const type   = typeConfig[target.type]     || typeConfig.CUSTOM;
  const status = statusConfig[target.status] || statusConfig.ACTIVE;
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [focusLoading, setFocusLoading] = useState(false);

  const daysLeft = target.deadline
    ? Math.ceil((new Date(target.deadline) - new Date()) / (1000 * 60 * 60 * 24))
    : null;

  const deadlineColor =
    daysLeft === null    ? 'text-slate-500' :
    daysLeft <= 0        ? 'text-red-400' :
    daysLeft <= 3        ? 'text-red-300' :
    daysLeft <= 7        ? 'text-orange-300' :
                           'text-slate-400';

  const deadlineLabel =
    daysLeft === null ? 'No deadline' :
    daysLeft  > 0    ? `${daysLeft}d left` :
    daysLeft === 0   ? 'Due today' :
                       `${Math.abs(daysLeft)}d overdue`;

  const handleFocus = async () => {
    setFocusLoading(true);
    try {
      await toggleFocus(target.id);
      toast.success(target.isFocused ? 'Focus removed' : 'Target focused!');
      onRefresh();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to toggle focus');
    } finally {
      setFocusLoading(false);
    }
  };

  const confirmDelete = async () => {
    setShowDeleteConfirm(false);
    try {
      await deleteTarget(target.id);
      toast.success('Target deleted');
      onRefresh();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const pct = target.progressPercentage || 0;

  return (
    <div className={`group relative rounded-[28px] border p-5 flex flex-col gap-4
                     transition-all duration-300 backdrop-blur-xl
                     hover:-translate-y-1 hover:shadow-xl
      ${target.isFocused
        ? 'border-cyan-300/30 bg-[linear-gradient(160deg,rgba(121,224,255,0.13),rgba(255,191,125,0.06))] shadow-[0_8px_32px_rgba(123,226,255,0.12)]'
        : 'border-white/10 bg-[linear-gradient(160deg,rgba(255,255,255,0.07),rgba(255,255,255,0.03))] hover:border-white/20'}`}
    >

      {/* ── Top row: badges ── */}
      <div className="flex items-center justify-between">
        <span className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-xl ${type.color}`}>
          <span>{type.emoji}</span>
          {type.label}
        </span>

        <span className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-xl ${status.color}`}>
          <status.Icon size={11} />
          {status.label}
        </span>
      </div>

      {/* ── Title + description ── */}
      <div>
        <h3 className="text-white text-base font-bold leading-snug">{target.title}</h3>
        {target.description && (
          <p className="mt-1 text-slate-400 text-sm line-clamp-2 leading-relaxed">
            {target.description}
          </p>
        )}
      </div>

      {/* ── Progress ── */}
      <div>
        <div className="flex justify-between items-center text-xs mb-2">
          <span className="text-slate-500 uppercase tracking-wider font-medium">Progress</span>
          <span className={`font-bold tabular-nums ${
            pct >= 80 ? 'text-emerald-300' :
            pct >= 50 ? 'text-cyan-300' :
            pct >= 25 ? 'text-yellow-300' : 'text-slate-300'
          }`}>{pct}%</span>
        </div>

        {/* Track */}
        <div className="relative w-full h-2 rounded-full bg-white/8 overflow-hidden">
          <div
            className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${progressGradient(pct)}
                        transition-all duration-700`}
            style={{ width: `${pct}%` }}
          />
          {/* Shimmer on the bar */}
          {pct > 0 && (
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent
                         animate-pulse"
              style={{ width: `${pct}%` }}
            />
          )}
        </div>
      </div>

      {/* ── Deadline ── */}
      <div className={`flex items-center gap-2 text-sm ${deadlineColor}`}>
        <Calendar size={13} className="shrink-0 opacity-70" />
        <span className="font-medium">
          {target.deadline
            ? new Date(target.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
            : 'No deadline'}
        </span>
        {daysLeft !== null && (
          <span className={`ml-auto text-xs font-semibold px-2 py-0.5 rounded-full
            ${daysLeft <= 0  ? 'bg-red-500/15 text-red-300' :
              daysLeft <= 7  ? 'bg-orange-500/15 text-orange-300' :
                               'bg-white/8 text-slate-400'}`}>
            {deadlineLabel}
          </span>
        )}
      </div>

      {/* ── Actions ── */}
      <div className="flex items-center gap-2 pt-1">

        {/* Focus button — only for ACTIVE targets */}
        {target.status === 'ACTIVE' && (
          <button
            onClick={handleFocus}
            disabled={focusLoading}
            className={`flex flex-1 items-center justify-center gap-2 py-2.5 text-sm font-semibold
                        rounded-2xl transition-all duration-200 disabled:opacity-60
              ${target.isFocused
                ? 'bg-[linear-gradient(90deg,#79e0ff,#a8edff)] text-slate-900 shadow-[0_0_16px_rgba(123,226,255,0.35)] hover:brightness-105'
                : 'bg-white/8 text-slate-300 border border-white/10 hover:bg-white/14 hover:text-white hover:border-white/20'}`}
          >
            <Target size={14} className={target.isFocused ? 'text-slate-800' : 'text-cyan-300/80'} />
            {target.isFocused ? 'Focused' : 'Set Focus'}
          </button>
        )}

        {/* Spacer when no focus button (completed/paused) */}
        {target.status !== 'ACTIVE' && <div className="flex-1" />}

        {/* Delete button */}
        <button
          onClick={() => setShowDeleteConfirm(true)}
          title="Delete target"
          className="flex items-center justify-center w-10 h-10 rounded-2xl border border-white/10
                     bg-white/6 text-slate-500
                     hover:bg-red-500/15 hover:border-red-500/30 hover:text-red-400
                     transition-all duration-200 group/del"
        >
          <Trash2 size={15} className="transition-transform duration-200 group-hover/del:scale-110" />
        </button>
      </div>

      {/* ── Delete confirm dialog ── */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete Target"
        message="This target and all its progress will be permanently removed."
        confirmLabel="Delete Target"
        cancelLabel="Keep it"
        variant="danger"
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </div>
  );
};

export default TargetCard;
