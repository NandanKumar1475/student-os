import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { getAllTargets } from '../api/targetApi';
import { Clock3, Focus, Goal, Plus, TrendingUp } from 'lucide-react';
import TargetCard from '../components/targets/TargetCard';
import CreateTargetModal from '../components/targets/CreateTargetModal';

const TargetsPage = () => {
  const [targets, setTargets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [showModal, setShowModal] = useState(false);

  const fetchTargets = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (filter !== 'ALL' && ['ACTIVE', 'COMPLETED', 'PAUSED'].includes(filter)) {
        params.status = filter;
      }
      const res = await getAllTargets(params);
      setTargets(res.data);
    } catch {
      console.error('Failed to fetch targets');
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchTargets();
  }, [fetchTargets]);

  const totalCount = targets.length;
  const activeCount = targets.filter((t) => t.status === 'ACTIVE').length;
  const dueThisWeek = targets.filter((t) => {
    if (!t.deadline) return false;
    const days = Math.ceil((new Date(t.deadline) - new Date()) / (1000 * 60 * 60 * 24));
    return days >= 0 && days <= 7;
  }).length;
  const avgProgress = targets.length > 0
    ? Math.round(targets.reduce((sum, t) => sum + (t.progressPercentage || 0), 0) / targets.length)
    : 0;

  const filters = [
    { label: 'All', value: 'ALL' },
    { label: 'Active', value: 'ACTIVE' },
    { label: 'Completed', value: 'COMPLETED' },
    { label: 'Paused', value: 'PAUSED' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-cyan-100/55">Goals workspace</p>
          <h1 className="mt-2 text-4xl font-black tracking-tight text-white">Targets that stay visible.</h1>
          <p className="mt-2 text-sm text-slate-400">A clearer, more premium space for planning what matters next.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-sm text-slate-300">
            <Focus size={16} className="text-cyan-200" />
            Focus mode
            <div className="relative h-6 w-11 rounded-full bg-white/10">
              <div className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-cyan-300 shadow-[0_0_16px_rgba(123,226,255,0.5)]" />
            </div>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 rounded-2xl bg-[linear-gradient(90deg,#79e0ff,#ffbf7d)] px-5 py-3 font-semibold text-slate-950 transition hover:brightness-105"
          >
            <Plus size={18} />
            Create Target
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-[28px] border border-white/10 bg-white/6 p-5 backdrop-blur-xl">
          <div className="flex items-center gap-2 text-emerald-200">
            <Goal size={18} />
            <span className="text-sm">Total targets</span>
          </div>
          <p className="mt-3 text-4xl font-black text-white">{totalCount}</p>
        </div>
        <div className="rounded-[28px] border border-white/10 bg-white/6 p-5 backdrop-blur-xl">
          <div className="flex items-center gap-2 text-cyan-200">
            <TrendingUp size={18} />
            <span className="text-sm">In progress</span>
          </div>
          <p className="mt-3 text-4xl font-black text-white">{activeCount}</p>
        </div>
        <div className="rounded-[28px] border border-white/10 bg-white/6 p-5 backdrop-blur-xl">
          <div className="flex items-center gap-2 text-orange-200">
            <Clock3 size={18} />
            <span className="text-sm">Due this week</span>
          </div>
          <p className="mt-3 text-4xl font-black text-white">{dueThisWeek}</p>
        </div>
        <div className="rounded-[28px] border border-white/10 bg-white/6 p-5 backdrop-blur-xl">
          <div className="flex items-center gap-2 text-yellow-200">
            <TrendingUp size={18} />
            <span className="text-sm">Avg progress</span>
          </div>
          <p className="mt-3 text-4xl font-black text-white">{avgProgress}%</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`rounded-2xl px-4 py-2.5 text-sm font-medium transition
              ${filter === f.value
                ? 'border border-cyan-200/20 bg-cyan-300/15 text-white'
                : 'border border-white/10 bg-white/6 text-slate-400 hover:bg-white/10 hover:text-white'}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-cyan-300"></div>
        </div>
      ) : targets.length === 0 ? (
        <div className="rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(8,20,34,0.88),rgba(7,17,29,0.72))] py-20 text-center backdrop-blur-xl">
          <p className="text-5xl mb-4">🎯</p>
          <h3 className="text-xl font-bold text-slate-100 mb-2">No targets yet</h3>
          <p className="text-slate-500 mb-6">Create your first target and start building visible momentum.</p>
          <button
            onClick={() => setShowModal(true)}
            className="rounded-2xl bg-[linear-gradient(90deg,#79e0ff,#ffbf7d)] px-6 py-3 font-semibold text-slate-950 transition hover:brightness-105"
          >
            Create Target
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {targets.map((target) => (
            <TargetCard key={target.id} target={target} onRefresh={fetchTargets} />
          ))}
        </div>
      )}

      <AnimatePresence mode="wait">
        {showModal && (
          <CreateTargetModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            onCreated={fetchTargets}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default TargetsPage;
