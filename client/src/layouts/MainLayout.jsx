import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  LayoutDashboard,
  Goal,
  CheckSquare,
  FileText,
  Flame,
  BarChart3,
  BriefcaseBusiness,
  Library,
  Bell,
  Search,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { useAuth } from "../hooks/useAuth";

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/targets', label: 'Targets', icon: Goal },
  { path: '/tasks', label: 'Tasks', icon: CheckSquare },
  { path: '/notes', label: 'Notes', icon: FileText },
  { path: '/streaks', label: 'Streaks', icon: Flame },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/jobs', label: 'Jobs', icon: BriefcaseBusiness },
  { path: '/resources', label: 'Resources', icon: Library },
];

const MainLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const MotionDiv = motion.div;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase()
    : '?';

  const pageContent = children || <Outlet />;

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-[#07111f] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(81,204,255,0.18),transparent_28%),radial-gradient(circle_at_85%_18%,rgba(255,182,120,0.16),transparent_20%),linear-gradient(135deg,#05111e_0%,#0a1627_48%,#03070f_100%)]" />
      <div className="absolute inset-0 opacity-40 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-size-[72px_72px] mask-[radial-gradient(circle_at_center,black,transparent_80%)]" />

      <aside className="relative z-10 hidden w-72 shrink-0 flex-col border-r border-white/10 bg-[linear-gradient(180deg,rgba(7,18,31,0.96),rgba(6,14,24,0.9))] px-5 py-6 backdrop-blur-xl lg:flex">
        <div className="rounded-[28px] border border-white/10 bg-white/6 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#7be2ff,#ffbd7d)] text-slate-950">
              <Sparkles size={20} />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight">
                Student <span className="text-cyan-200">OS</span>
              </h1>
              <p className="text-sm text-slate-400">A clear system for ambitious students</p>
            </div>
          </div>
        </div>

        <nav className="mt-6 flex-1 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all ${
                  isActive
                    ? 'border border-cyan-200/25 bg-[linear-gradient(90deg,rgba(121,224,255,0.18),rgba(255,189,122,0.12))] text-white shadow-[0_10px_30px_rgba(123,226,255,0.1)]'
                    : 'border border-transparent text-slate-400 hover:border-white/8 hover:bg-white/6 hover:text-white'
                }`
              }
            >
              <item.icon size={18} className="text-cyan-200/90" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="rounded-[28px] border border-white/10 bg-white/6 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-cyan-100/55">Momentum</p>
              <p className="mt-2 text-3xl font-black text-white">12 day</p>
            </div>
            <div className="rounded-2xl bg-orange-300/12 px-3 py-2 text-orange-200">Streak</div>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/8">
            <div className="h-full w-[72%] rounded-full bg-[linear-gradient(90deg,#79e0ff,#ffbf7d)]" />
          </div>
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-slate-400">2,450 XP earned</span>
            <span className="text-emerald-300">+120 this week</span>
          </div>
        </div>

        <div className="mt-4 rounded-[28px] border border-white/10 bg-white/6 p-4">
          <button
            className="flex w-full items-center gap-3 rounded-2xl px-2 py-2 text-left transition hover:bg-white/6"
            onClick={() => navigate('/profile')}
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#7be2ff,#4db7ff,#ffbd7d)] text-sm font-bold text-slate-950">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-white">{user?.name}</p>
              <p className="truncate text-xs text-slate-400">{user?.branch || 'Student'}</p>
            </div>
          </button>
        </div>
      </aside>

      <div className="relative z-10 flex min-h-screen flex-1 flex-col overflow-hidden">
        <header className="border-b border-white/10 bg-[linear-gradient(180deg,rgba(8,19,33,0.92),rgba(8,18,30,0.7))] px-4 py-4 backdrop-blur-xl sm:px-6">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-cyan-100/55">Student command center</p>
              <h2 className="mt-1 text-2xl font-black tracking-tight text-white">Easy to use. Hard to ignore.</h2>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative w-full sm:w-80">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search tasks, goals, jobs..."
                  className="w-full rounded-2xl border border-white/10 bg-white/6 py-3 pl-11 pr-4 text-sm text-slate-200 outline-none transition placeholder:text-slate-500 focus:border-cyan-300/35 focus:bg-white/10"
                />
              </div>

              <button className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/6 text-slate-300 transition hover:bg-white/10 hover:text-white">
                <Bell size={18} />
                <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-cyan-300" />
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-sm font-medium text-slate-300 transition hover:border-red-300/20 hover:bg-red-400/10 hover:text-red-200"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
          <AnimatePresence mode="wait" initial={false}>
            <MotionDiv
              key={location.pathname}
              initial={{ opacity: 0, y: 22, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -14, filter: 'blur(8px)' }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              className="h-full"
            >
              {pageContent}
            </MotionDiv>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
