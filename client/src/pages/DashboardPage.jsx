import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getAllTargets } from '../api/targetApi';

const DashboardPage = () => {
  const { user } = useAuth();
  const [targets, setTargets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAllTargets();
        setTargets(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
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

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-white">
          Welcome back, {user?.name?.split(' ')[0]}! 👋
        </h1>
        <p className="text-gray-500 mt-1">Here's what's happening with your studies today.</p>
      </div>

      {/* Top Cards Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Active Target Card */}
        <div className="lg:col-span-6 bg-[#1e1e35] rounded-2xl p-6 border border-[#2a2a45]">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse"></span>
            <span className="text-gray-400 text-sm font-semibold">Active Target</span>
          </div>
          {focusedTarget ? (
            <>
              <h2 className="text-white text-xl font-bold mb-2">{focusedTarget.title}</h2>
              <div className="flex items-center justify-between text-sm text-gray-400 mb-3">
                <span>Progress: {focusedTarget.progressPercentage}%</span>
                {daysLeft !== null && (
                  <span className="flex items-center gap-1">
                    📅 {daysLeft > 0 ? `${daysLeft} days left` : 'Overdue!'}
                  </span>
                )}
              </div>
              <div className="w-full bg-[#2a2a45] rounded-full h-2.5">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2.5 rounded-full transition-all"
                  style={{ width: `${focusedTarget.progressPercentage}%` }}
                />
              </div>
            </>
          ) : (
            <>
              <h2 className="text-white text-lg font-semibold mb-1">No focused target</h2>
              <p className="text-gray-500 text-sm">Go to Targets and focus on one to see it here.</p>
            </>
          )}
        </div>

        {/* Daily Streak */}
        <div className="lg:col-span-3 bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-white/70 text-lg">🔥</span>
            <span className="text-white/70 text-sm font-semibold">Daily Streak</span>
          </div>
          <p className="text-white text-4xl font-extrabold">12</p>
          <p className="text-white/60 text-sm mt-1">Keep it going! 💪</p>
        </div>

        {/* Total XP */}
        <div className="lg:col-span-3 bg-gradient-to-br from-green-500 to-emerald-700 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-white/70 text-lg">🏆</span>
            <span className="text-white/70 text-sm font-semibold">Total XP</span>
          </div>
          <p className="text-white text-4xl font-extrabold">2,450</p>
          <p className="text-white/60 text-sm mt-1">+120 this week</p>
        </div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Today's Tasks */}
        <div className="lg:col-span-7 bg-[#1e1e35] rounded-2xl p-6 border border-[#2a2a45]">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <span className="text-blue-400">✓</span>
              <h3 className="text-white font-bold text-lg">Today's Tasks</h3>
            </div>
            <span className="text-gray-500 text-sm">4 tasks</span>
          </div>

          <div className="space-y-3">
            {[
              { title: 'Complete DSA Assignment', done: false },
              { title: 'Review React Hooks', done: true },
              { title: 'Mock Interview Prep', done: false },
              { title: 'Read DBMS Chapter 5', done: false },
            ].map((task, i) => (
              <div key={i} className="flex items-center gap-3 py-2.5 px-3 rounded-xl hover:bg-[#252545] transition">
                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition
                  ${task.done
                    ? 'bg-blue-600 border-blue-600'
                    : 'border-gray-600 hover:border-blue-400'}`}>
                  {task.done && <span className="text-white text-xs">✓</span>}
                </div>
                <span className={`text-sm ${task.done ? 'line-through text-gray-600' : 'text-gray-300'}`}>
                  {task.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div className="lg:col-span-5 bg-[#1e1e35] rounded-2xl p-6 border border-[#2a2a45]">
          <div className="flex items-center gap-2 mb-5">
            <span className="text-orange-400">⏰</span>
            <h3 className="text-white font-bold text-lg">Upcoming Deadlines</h3>
          </div>

          <div className="space-y-4">
            {activeTargets.length > 0 ? (
              activeTargets.slice(0, 4).map((target) => {
                const days = target.deadline
                  ? Math.ceil((new Date(target.deadline) - new Date()) / (1000 * 60 * 60 * 24))
                  : null;
                return (
                  <div key={target.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-200 text-sm font-medium">{target.title}</p>
                      <p className="text-gray-600 text-xs mt-0.5">
                        {target.deadline || 'No deadline'}
                      </p>
                    </div>
                    {days !== null && (
                      <span className={`px-2.5 py-1 text-xs font-bold rounded-lg
                        ${days <= 7 ? 'bg-red-500/20 text-red-400' :
                          days <= 14 ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-blue-500/20 text-blue-400'}`}>
                        {days}d
                      </span>
                    )}
                  </div>
                );
              })
            ) : (
              <p className="text-gray-600 text-sm">No active targets yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Third Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Weekly Study Hours (placeholder chart) */}
        <div className="lg:col-span-7 bg-[#1e1e35] rounded-2xl p-6 border border-[#2a2a45]">
          <div className="flex items-center gap-2 mb-5">
            <span className="text-green-400">📈</span>
            <h3 className="text-white font-bold text-lg">Weekly Study Hours</h3>
          </div>

          {/* Simple bar chart */}
          <div className="flex items-end justify-between gap-3 h-40 px-2">
            {[
              { day: 'Mon', hours: 6 },
              { day: 'Tue', hours: 4.5 },
              { day: 'Wed', hours: 7 },
              { day: 'Thu', hours: 5 },
              { day: 'Fri', hours: 7.5 },
              { day: 'Sat', hours: 3.5 },
              { day: 'Sun', hours: 4 },
            ].map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full relative" style={{ height: '120px' }}>
                  <div
                    className="absolute bottom-0 w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-lg transition-all hover:from-blue-500 hover:to-blue-300"
                    style={{ height: `${(d.hours / 8) * 100}%` }}
                  />
                </div>
                <span className="text-gray-500 text-xs">{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Job Alerts */}
        <div className="lg:col-span-5 bg-[#1e1e35] rounded-2xl p-6 border border-[#2a2a45]">
          <div className="flex items-center gap-2 mb-5">
            <span className="text-blue-400">💼</span>
            <h3 className="text-white font-bold text-lg">Job Alerts</h3>
          </div>

          <div className="space-y-4">
            {[
              { title: 'Frontend Developer', company: 'Google', location: 'Remote', match: '92%' },
              { title: 'Software Engineer', company: 'Microsoft', location: 'Seattle', match: '88%' },
              { title: 'Full Stack Developer', company: 'Amazon', location: 'Austin', match: '85%' },
            ].map((job, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-[#252545] hover:bg-[#2a2a55] transition">
                <div>
                  <p className="text-gray-200 text-sm font-medium">{job.title}</p>
                  <p className="text-gray-500 text-xs">{job.company} · {job.location}</p>
                </div>
                <span className="text-green-400 text-sm font-bold">{job.match}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;