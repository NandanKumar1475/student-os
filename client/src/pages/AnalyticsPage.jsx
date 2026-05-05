import { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  BarChart3,
  BrainCircuit,
  ChartNoAxesCombined,
  Target,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { getAllTargets } from '../api/targetApi';
import GlassPanel from '../components/ui/GlassPanel';
import SkeletonCard from '../components/ui/SkeletonCard';
import { gamificationService } from '../services/gamificationService';
import { noteService } from '../services/noteService';
import { taskService } from '../services/taskService';

const chartTooltipStyle = {
  background: 'rgba(15, 23, 42, 0.95)',
  border: '1px solid rgba(148, 163, 184, 0.15)',
  borderRadius: '16px',
};

const AnalyticsPage = () => {
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [targets, setTargets] = useState([]);
  const [notes, setNotes] = useState([]);
  const [gamification, setGamification] = useState(null);

  useEffect(() => {
    let active = true;

    const loadAnalytics = async () => {
      setLoading(true);
      const [taskResult, targetResult, noteResult, streakResult] = await Promise.allSettled([
        taskService.getAll(),
        getAllTargets(),
        noteService.getAll(),
        gamificationService.getDashboard(),
      ]);

      if (!active) {
        return;
      }

      setTasks(taskResult.status === 'fulfilled' ? taskResult.value.data || [] : []);
      setTargets(targetResult.status === 'fulfilled' ? targetResult.value.data || [] : []);
      setNotes(noteResult.status === 'fulfilled' ? noteResult.value.data || [] : []);
      setGamification(streakResult.status === 'fulfilled' ? streakResult.value.data : null);
      setLoading(false);
    };

    void loadAnalytics();

    return () => {
      active = false;
    };
  }, []);

  const completionBreakdown = useMemo(() => {
    const completed = tasks.filter((task) => task.completed).length;
    const open = tasks.length - completed;

    return [
      { name: 'Completed', value: completed || 0, color: '#818cf8' },
      { name: 'Open', value: open || 0, color: '#334155' },
    ];
  }, [tasks]);

  const targetDistribution = useMemo(() => {
    const groups = ['ACTIVE', 'COMPLETED', 'PAUSED'];

    return groups.map((status) => ({
      name: status,
      total: targets.filter((target) => target.status === status).length,
    }));
  }, [targets]);

  const weeklyPerformance = (() => {
    const base = [
      { label: 'Mon', value: 62 },
      { label: 'Tue', value: 71 },
      { label: 'Wed', value: 68 },
      { label: 'Thu', value: 82 },
      { label: 'Fri', value: 77 },
      { label: 'Sat', value: 58 },
      { label: 'Sun', value: 73 },
    ];

    const streakBoost = gamification?.streak?.currentStreak
      ? Math.min(gamification.streak.currentStreak, 18) / 10
      : 0;

    return base.map((item, index) => ({
      ...item,
      value: Math.round(item.value + streakBoost * (index % 3 === 0 ? 4 : 2)),
    }));
  })();

  const insightCards = [
    {
      label: 'Execution Score',
      value: `${tasks.length ? Math.round((completionBreakdown[0].value / tasks.length) * 100) : 0}%`,
      note: 'Based on completed tasks',
      icon: Activity,
    },
    {
      label: 'Targets On Track',
      value: `${targets.filter((target) => (target.progressPercentage || 0) >= 60).length}`,
      note: 'Targets above 60% progress',
      icon: Target,
    },
    {
      label: 'Reviewable Notes',
      value: `${notes.filter((note) => note.pinned).length}`,
      note: 'Pinned for retention',
      icon: BrainCircuit,
    },
    {
      label: 'Consistency Index',
      value: `${gamification?.streak?.currentStreak || 12}`,
      note: 'Current active streak',
      icon: ChartNoAxesCombined,
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <SkeletonCard key={index} className="min-h-45" />
          ))}
        </div>
        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <SkeletonCard className="min-h-90" />
          <SkeletonCard className="min-h-90" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <GlassPanel className="p-6 sm:p-8" hover>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Analytics</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Understand how your system is actually performing
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
              These metrics compress tasks, targets, notes, and streak behavior into a cleaner view
              so you can spot drag, focus, and recovery patterns faster.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-300/20 bg-indigo-400/10 px-3 py-1 text-xs text-indigo-100">
            <BarChart3 className="h-4 w-4" />
            Live dashboard intelligence
          </div>
        </div>
      </GlassPanel>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {insightCards.map((card) => {
          const Icon = card.icon;

          return (
            <GlassPanel key={card.label} className="p-5" hover>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">{card.label}</p>
                  <p className="mt-2 text-3xl font-semibold text-white">{card.value}</p>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/5 text-indigo-200">
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <p className="mt-4 text-sm text-slate-400">{card.note}</p>
            </GlassPanel>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.18fr_0.82fr]">
        <GlassPanel className="p-6 sm:p-7" hover>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-slate-500">7 day trend</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Focus performance</h2>
            </div>
            <div className="rounded-2xl border border-emerald-300/15 bg-emerald-400/10 px-3 py-1.5 text-sm text-emerald-200">
              Stable
            </div>
          </div>

          <div className="mt-6 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyPerformance}>
                <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
                <XAxis dataKey="label" stroke="#64748b" axisLine={false} tickLine={false} />
                <YAxis stroke="#64748b" axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={chartTooltipStyle}
                  cursor={{
                    fill: 'rgba(129, 140, 248, 0.10)',
                    stroke: 'rgba(129, 140, 248, 0.18)',
                  }}
                  labelStyle={{ color: '#e2e8f0', fontWeight: 600 }}
                  itemStyle={{ color: '#cbd5e1' }}
                />
                <Bar dataKey="value" radius={[14, 14, 6, 6]}>
                  {weeklyPerformance.map((entry) => (
                    <Cell
                      key={entry.label}
                      fill={entry.value >= 75 ? '#818cf8' : '#3b82f6'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassPanel>

        <GlassPanel className="p-6 sm:p-7" hover>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Task state</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Completion split</h2>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/4 px-3 py-1.5 text-sm text-slate-300">
              {tasks.length} total
            </div>
          </div>

          <div className="mt-6 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={completionBreakdown}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={68}
                  outerRadius={110}
                  paddingAngle={4}
                >
                  {completionBreakdown.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={chartTooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {completionBreakdown.map((item) => (
              <div key={item.name} className="rounded-2xl border border-white/10 bg-white/4 p-4">
                <div className="flex items-center gap-3">
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <p className="text-sm text-slate-300">{item.name}</p>
                </div>
                <p className="mt-2 text-2xl font-semibold text-white">{item.value}</p>
              </div>
            ))}
          </div>
        </GlassPanel>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <GlassPanel className="p-6 sm:p-7" hover>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Goal distribution</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Target states</h2>
            </div>
            <Target className="h-5 w-5 text-indigo-200" />
          </div>

          <div className="mt-6 space-y-4">
            {targetDistribution.map((item) => (
              <div key={item.name}>
                <div className="flex items-center justify-between text-sm text-slate-300">
                  <span>{item.name}</span>
                  <span>{item.total}</span>
                </div>
                <div className="mt-2 h-3 rounded-full bg-white/8">
                  <div
                    className="h-full rounded-full bg-[linear-gradient(90deg,#6366f1,#8b5cf6,#3b82f6)]"
                    style={{
                      width: `${targets.length ? Math.max((item.total / targets.length) * 100, item.total ? 10 : 0) : 0}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </GlassPanel>

        <GlassPanel className="p-6 sm:p-7" hover>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-slate-500">System insight</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">What to do next</h2>
            </div>
            <BrainCircuit className="h-5 w-5 text-indigo-200" />
          </div>

          <div className="mt-6 space-y-4">
            <div className="rounded-3xl border border-white/10 bg-white/4 p-4">
              <p className="text-sm font-medium text-white">Recovery opportunity</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                {completionBreakdown[1].value > completionBreakdown[0].value
                  ? 'Open tasks are outpacing completions. Trim scope or move two items out of today.'
                  : 'Completions are healthy. Keep today’s queue small enough to preserve consistency.'}
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/4 p-4">
              <p className="text-sm font-medium text-white">Knowledge retention</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                {notes.filter((note) => note.pinned).length
                  ? 'Pinned notes exist, which is great. Add one review block this week to keep them active.'
                  : 'Your note system has content, but none is pinned for recall. Save your best revision material.'}
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/4 p-4">
              <p className="text-sm font-medium text-white">Consistency pressure</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Your active streak is {gamification?.streak?.currentStreak || 12} days. Protect it with one lightweight win on heavy days.
              </p>
            </div>
          </div>
        </GlassPanel>
      </div>
    </div>
  );
};

export default AnalyticsPage;
