import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getAllTargets } from '../api/targetApi';
import { ArrowRight, BriefcaseBusiness, Clock3, Flame, Goal, TrendingUp } from 'lucide-react';

const DashboardPage = () => {
  const { user } = useAuth();
  const [targets, setTargets] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAllTargets();
        setTargets(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const focusedTarget = targets.find((t) => t.isFocused);
  const activeTargets = targets.filter((t) => t.status === 'ACTIVE');

  // Calculate days left for focused target
  const daysLeft = focusedTarget?.deadline
    ? Math.ceil((new Date(focusedTarget.deadline) - new Date()) / (1000 * 60 * 60 * 24))
    : null;

  const weeklyData = [
    { day: 'Mon', hours: 6 },
    { day: 'Tue', hours: 4.5 },
    { day: 'Wed', hours: 7 },
    { day: 'Thu', hours: 5 },
    { day: 'Fri', hours: 7.5 },
    { day: 'Sat', hours: 3.5 },
    { day: 'Sun', hours: 4 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 xl:grid-cols-[1.35fr_0.85fr]">
        <div className="rounded-[32px] border border-white/10 bg-[linear-gradient(135deg,rgba(121,224,255,0.14),rgba(255,190,125,0.08),rgba(255,255,255,0.04))] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.25)] backdrop-blur-xl">
          <p className="text-xs uppercase tracking-[0.35em] text-cyan-100/60">Dashboard overview</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-white">
            Welcome back, {user?.name?.split(' ')[0]}.
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-300">
            This space is designed to feel premium, but stay simple. Your top priorities,
            deadlines, and study momentum are visible at a glance.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-[24px] border border-white/10 bg-slate-950/30 p-5">
              <div className="flex items-center gap-2 text-orange-200">
                <Flame size={18} />
                <span className="text-sm font-medium">Daily streak</span>
              </div>
              <p className="mt-3 text-4xl font-black text-white">12</p>
              <p className="mt-1 text-sm text-slate-400">Stay consistent today</p>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-slate-950/30 p-5">
              <div className="flex items-center gap-2 text-emerald-200">
                <TrendingUp size={18} />
                <span className="text-sm font-medium">Weekly XP</span>
              </div>
              <p className="mt-3 text-4xl font-black text-white">+120</p>
              <p className="mt-1 text-sm text-slate-400">More than last week</p>
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
                <span>{focusedTarget.progressPercentage}%</span>
              </div>
              <div className="mt-2 h-3 overflow-hidden rounded-full bg-white/8">
                <div
                  className="h-full rounded-full bg-[linear-gradient(90deg,#79e0ff,#ffbf7d)]"
                  style={{ width: `${focusedTarget.progressPercentage}%` }}
                />
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Deadline</p>
                  <p className="mt-2 text-lg font-semibold text-white">{focusedTarget.deadline || 'Not set'}</p>
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
            <span className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-sm text-slate-300">4 tasks</span>
          </div>

          <div className="mt-6 space-y-3">
            {[
              { title: 'Complete DSA Assignment', done: false },
              { title: 'Review React Hooks', done: true },
              { title: 'Mock Interview Prep', done: false },
              { title: 'Read DBMS Chapter 5', done: false },
            ].map((task, i) => (
              <div key={i} className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/5 px-4 py-3 transition hover:bg-white/8">
                <div className={`flex h-5 w-5 items-center justify-center rounded-md border-2 transition
                  ${task.done
                    ? 'border-cyan-300 bg-cyan-300'
                    : 'border-slate-500 hover:border-cyan-300'}`}>
                  {task.done && <span className="text-white text-xs">✓</span>}
                </div>
                <span className={`text-sm ${task.done ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                  {task.title}
                </span>
              </div>
            ))}
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
                        {target.deadline || 'No deadline'}
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
            {weeklyData.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div className="relative w-full rounded-t-2xl bg-white/5" style={{ height: '148px' }}>
                  <div
                    className="absolute bottom-0 w-full rounded-2xl bg-[linear-gradient(180deg,rgba(121,224,255,0.95),rgba(255,191,125,0.65))]"
                    style={{ height: `${(d.hours / 8) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-slate-500">{d.day}</span>
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
            {[
              { title: 'Frontend Developer', company: 'Google', location: 'Remote', match: '92%' },
              { title: 'Software Engineer', company: 'Microsoft', location: 'Seattle', match: '88%' },
              { title: 'Full Stack Developer', company: 'Amazon', location: 'Austin', match: '85%' },
            ].map((job, i) => (
              <div key={i} className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/5 p-4 transition hover:bg-white/8">
                <div>
                  <p className="text-sm font-medium text-slate-100">{job.title}</p>
                  <p className="text-xs text-slate-500">{job.company} · {job.location}</p>
                </div>
                <span className="flex items-center gap-1 text-sm font-bold text-emerald-300">
                  {job.match}
                  <ArrowRight size={14} />
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
