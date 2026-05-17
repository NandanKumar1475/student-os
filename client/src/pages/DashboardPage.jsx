import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getAllTargets } from '../api/targetApi';
import { gamificationService } from '../services/gamificationService';
import { jobService } from '../services/jobService';
import { taskService } from '../services/taskService';
import { ArrowRight, BriefcaseBusiness, Clock3, Flame, Goal, TrendingUp } from 'lucide-react';

const safeArray = (value) => (Array.isArray(value) ? value : []);

const toIsoDate = (date) => date.toISOString().slice(0, 10);

const formatDate = (value) => {
  if (!value) {
    return 'No deadline';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const getWeeklyData = (heatmap) => {
  const rows = safeArray(heatmap);
  const today = new Date();

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - index));
    const iso = toIsoDate(date);
    const activity = rows.find((row) => row.date === iso);

    return {
      day: date.toLocaleDateString(undefined, { weekday: 'short' }),
      hours: Number(((activity?.studyMinutes || 0) / 60).toFixed(1)),
    };
  });
};

const DashboardPage = () => {
  const { user } = useAuth();
  const [targets, setTargets] = useState([]);
  const [todayTasks, setTodayTasks] = useState([]);
  const [jobAlerts, setJobAlerts] = useState([]);
  const [gamification, setGamification] = useState(null);

  useEffect(() => {
    let active = true;

    const fetchData = async () => {
      const [targetResult, taskResult, jobResult, gamificationResult] = await Promise.allSettled([
        getAllTargets(),
        taskService.getToday(),
        jobService.getJobs(),
        gamificationService.getDashboard(),
      ]);

      if (!active) {
        return;
      }

      setTargets(targetResult.status === 'fulfilled' ? safeArray(targetResult.value.data) : []);
      setTodayTasks(taskResult.status === 'fulfilled' ? safeArray(taskResult.value.data) : []);
      setJobAlerts(jobResult.status === 'fulfilled' ? safeArray(jobResult.value.data) : []);
      setGamification(gamificationResult.status === 'fulfilled' ? gamificationResult.value.data : null);
    };

    void fetchData();

    return () => {
      active = false;
    };
  }, []);

  const focusedTarget = targets.find((target) => target.isFocused);
  const activeTargets = targets.filter((target) => target.status === 'ACTIVE');
  const currentStreak = gamification?.streak?.currentStreak ?? 0;
  const weeklyXP = gamification?.xp?.xpThisWeek ?? 0;
  const weeklyData = useMemo(() => getWeeklyData(gamification?.heatmap), [gamification?.heatmap]);
  const maxWeeklyHours = Math.max(1, ...weeklyData.map((item) => item.hours));

  const daysLeft = focusedTarget?.deadline
    ? Math.ceil((new Date(focusedTarget.deadline) - new Date()) / (1000 * 60 * 60 * 24))
    : null;

  const handleToggleTask = async (task) => {
    setTodayTasks((items) =>
      items.map((item) => (item.id === task.id ? { ...item, completed: !item.completed } : item)),
    );

    try {
      const response = await taskService.toggle(task.id);
      setTodayTasks((items) =>
        items.map((item) => (item.id === task.id ? response.data : item)),
      );
    } catch (error) {
      console.error(error);
      setTodayTasks((items) =>
        items.map((item) => (item.id === task.id ? { ...item, completed: task.completed } : item)),
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 xl:grid-cols-[1.35fr_0.85fr]">
        <div className="rounded-[32px] border border-white/10 bg-[linear-gradient(135deg,rgba(121,224,255,0.14),rgba(255,190,125,0.08),rgba(255,255,255,0.04))] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.25)] backdrop-blur-xl">
          <p className="text-xs uppercase tracking-[0.35em] text-cyan-100/60">Dashboard overview</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-white">
            Welcome back, {user?.name?.split(' ')[0] || 'Student'}.
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-300">
            Your live tasks, targets, deadlines, and study momentum are visible at a glance.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-[24px] border border-white/10 bg-slate-950/30 p-5">
              <div className="flex items-center gap-2 text-orange-200">
                <Flame size={18} />
                <span className="text-sm font-medium">Daily streak</span>
              </div>
              <p className="mt-3 text-4xl font-black text-white">{currentStreak}</p>
              <p className="mt-1 text-sm text-slate-400">
                {gamification?.streak?.todayActive ? 'Activity recorded today' : 'Record one action today'}
              </p>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-slate-950/30 p-5">
              <div className="flex items-center gap-2 text-emerald-200">
                <TrendingUp size={18} />
                <span className="text-sm font-medium">Weekly XP</span>
              </div>
              <p className="mt-3 text-4xl font-black text-white">+{weeklyXP}</p>
              <p className="mt-1 text-sm text-slate-400">Earned from your real activity</p>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-slate-950/30 p-5">
              <div className="flex items-center gap-2 text-cyan-200">
                <Goal size={18} />
                <span className="text-sm font-medium">Active targets</span>
              </div>
              <p className="mt-3 text-4xl font-black text-white">{activeTargets.length}</p>
              <p className="mt-1 text-sm text-slate-400">Goals in motion</p>
            </div>
          </div>
        </div>

        <div className="rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(8,20,34,0.92),rgba(7,17,29,0.78))] p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-cyan-100/55">Focused target</p>
              <h2 className="mt-2 text-2xl font-bold text-white">
                {focusedTarget ? focusedTarget.title : 'No target selected'}
              </h2>
            </div>
            <span className="rounded-full border border-emerald-300/15 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-200">
              Live
            </span>
          </div>

          {focusedTarget ? (
            <>
              <div className="mt-5 flex items-center justify-between text-sm text-slate-300">
                <span>Progress</span>
                <span>{focusedTarget.progressPercentage || 0}%</span>
              </div>
              <div className="mt-2 h-3 overflow-hidden rounded-full bg-white/8">
                <div
                  className="h-full rounded-full bg-[linear-gradient(90deg,#79e0ff,#ffbf7d)]"
                  style={{ width: `${focusedTarget.progressPercentage || 0}%` }}
                />
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Deadline</p>
                  <p className="mt-2 text-lg font-semibold text-white">{formatDate(focusedTarget.deadline)}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Time left</p>
                  <p className="mt-2 text-lg font-semibold text-white">
                    {daysLeft !== null ? (daysLeft > 0 ? `${daysLeft} days` : 'Needs attention') : 'No timeline'}
                  </p>
                </div>
              </div>
            </>
          ) : (
            <p className="mt-6 text-sm leading-6 text-slate-400">
              Pick a focused target from the Targets page and it will become your main dashboard anchor.
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(8,20,34,0.9),rgba(7,17,29,0.76))] p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-cyan-100/55">Today</p>
              <h3 className="mt-2 text-2xl font-bold text-white">Clear next actions</h3>
            </div>
            <span className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-sm text-slate-300">
              {todayTasks.length} tasks
            </span>
          </div>

          <div className="mt-6 space-y-3">
            {todayTasks.length ? (
              todayTasks.map((task) => (
                <button
                  key={task.id}
                  onClick={() => handleToggleTask(task)}
                  className="flex w-full items-center gap-3 rounded-2xl border border-white/8 bg-white/5 px-4 py-3 text-left transition hover:bg-white/8"
                >
                  <div className={`flex h-5 w-5 items-center justify-center rounded-md border-2 transition
                    ${task.completed
                      ? 'border-cyan-300 bg-cyan-300'
                      : 'border-slate-500 hover:border-cyan-300'}`}>
                    {task.completed && <span className="text-xs text-white">✓</span>}
                  </div>
                  <div className="min-w-0">
                    <span className={`block truncate text-sm ${task.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                      {task.title || 'Untitled task'}
                    </span>
                    {task.dueTime && <span className="text-xs text-slate-500">{task.dueTime}</span>}
                  </div>
                </button>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-white/10 bg-white/4 p-5">
                <p className="text-sm font-medium text-white">No tasks due today</p>
                <p className="mt-2 text-sm text-slate-400">
                  Add tasks from the Tasks page and they will appear here automatically.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(8,20,34,0.9),rgba(7,17,29,0.76))] p-6 backdrop-blur-xl">
          <div className="flex items-center gap-2">
            <Clock3 size={18} className="text-orange-200" />
            <h3 className="text-xl font-bold text-white">Upcoming deadlines</h3>
          </div>

          <div className="mt-5 space-y-4">
            {activeTargets.length > 0 ? (
              activeTargets.slice(0, 4).map((target) => {
                const days = target.deadline
                  ? Math.ceil((new Date(target.deadline) - new Date()) / (1000 * 60 * 60 * 24))
                  : null;
                return (
                  <div key={target.id} className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/5 p-4">
                    <div>
                      <p className="text-sm font-medium text-slate-100">{target.title}</p>
                      <p className="text-xs text-slate-500">
                        {formatDate(target.deadline)}
                      </p>
                    </div>
                    {days !== null && (
                      <span className={`rounded-xl px-3 py-1 text-xs font-bold
                        ${days <= 7 ? 'bg-red-500/15 text-red-300' :
                          days <= 14 ? 'bg-yellow-500/15 text-yellow-300' :
                          'bg-cyan-500/15 text-cyan-200'}`}>
                        {days}d
                      </span>
                    )}
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-slate-500">No active targets yet.</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(8,20,34,0.9),rgba(7,17,29,0.76))] p-6 backdrop-blur-xl">
          <div className="flex items-center gap-2">
            <TrendingUp size={18} className="text-emerald-200" />
            <h3 className="text-xl font-bold text-white">Weekly study hours</h3>
          </div>

          <div className="mt-8 flex h-48 items-end justify-between gap-3">
            {weeklyData.map((item) => (
              <div key={item.day} className="flex flex-1 flex-col items-center gap-2">
                <div className="relative w-full rounded-t-2xl bg-white/5" style={{ height: '148px' }}>
                  <div
                    className="absolute bottom-0 w-full rounded-2xl bg-[linear-gradient(180deg,rgba(121,224,255,0.95),rgba(255,191,125,0.65))]"
                    style={{ height: `${(item.hours / maxWeeklyHours) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-slate-500">{item.day}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(8,20,34,0.9),rgba(7,17,29,0.76))] p-6 backdrop-blur-xl">
          <div className="flex items-center gap-2">
            <BriefcaseBusiness size={18} className="text-cyan-200" />
            <h3 className="text-xl font-bold text-white">Job alerts</h3>
          </div>

          <div className="mt-5 space-y-4">
            {jobAlerts.length ? (
              jobAlerts.slice(0, 3).map((job) => (
                <a
                  key={`${job.source || 'job'}-${job.id || job.externalUrl}`}
                  href={job.externalUrl || undefined}
                  target={job.externalUrl ? '_blank' : undefined}
                  rel={job.externalUrl ? 'noreferrer' : undefined}
                  className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/5 p-4 transition hover:bg-white/8"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-100">{job.title || 'Untitled role'}</p>
                    <p className="truncate text-xs text-slate-500">
                      {job.company || 'Company not listed'} · {job.location || 'Location not listed'}
                    </p>
                  </div>
                  <span className="flex items-center gap-1 text-sm font-bold text-emerald-300">
                    {job.source || 'Live'}
                    <ArrowRight size={14} />
                  </span>
                </a>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-white/10 bg-white/4 p-5">
                <p className="text-sm font-medium text-white">No job matches yet</p>
                <p className="mt-2 text-sm text-slate-400">
                  Add a career goal in your profile or create skill targets to receive real matches.
                </p>
                <Link to="/profile" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-cyan-200">
                  Update profile <ArrowRight size={14} />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
