import { AnimatePresence, motion as Motion } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  GraduationCap,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { navItems } from './navConfig';

const sidebarTransition = { duration: 0.28, ease: [0.22, 1, 0.36, 1] };

const Sidebar = ({
  collapsed,
  onToggle,
  currentPath,
  userInitials,
  userName,
  userRole,
}) => {
  return (
    <Motion.aside
      animate={{ width: collapsed ? 96 : 280 }}
      transition={sidebarTransition}
      className="hidden shrink-0 lg:flex"
    >
      <div className="relative flex min-h-screen w-full flex-col border-r border-white/10 bg-slate-950/45 px-4 py-5 backdrop-blur-2xl">
        <div className="absolute inset-x-4 top-4 h-24 rounded-[28px] bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.28),transparent_65%)] blur-2xl" />

        <div className="relative z-10 flex items-center justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#6366f1_0%,#8b5cf6_45%,#3b82f6_100%)] text-white shadow-[0_0_30px_rgba(99,102,241,0.35)]">
              <GraduationCap className="h-5 w-5" />
            </div>
            <AnimatePresence initial={false}>
              {!collapsed ? (
                <Motion.div
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={sidebarTransition}
                  className="min-w-0"
                >
                  <p className="truncate text-lg font-semibold text-white">Student OS</p>
                  <p className="truncate text-xs uppercase tracking-[0.3em] text-slate-400">
                    Productivity Suite
                  </p>
                </Motion.div>
              ) : null}
            </AnimatePresence>
          </div>

          <Motion.button
            type="button"
            onClick={onToggle}
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-slate-300 transition hover:bg-white/[0.08] hover:text-white"
            whileTap={{ scale: 0.96 }}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Motion.button>
        </div>

        <div className="relative z-10 mt-8 flex-1 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path;

            return (
              <div key={item.path} className="group relative">
                <NavLink
                  to={item.path}
                  end={item.path === '/'}
                  className={`flex items-center gap-3 rounded-2xl border px-3 py-3 text-sm transition ${
                    isActive
                      ? 'border-indigo-300/25 bg-[linear-gradient(135deg,rgba(99,102,241,0.18),rgba(59,130,246,0.16))] text-white shadow-[0_15px_35px_rgba(59,130,246,0.16)]'
                      : 'border-transparent text-slate-400 hover:border-white/10 hover:bg-white/[0.05] hover:text-white'
                  } ${collapsed ? 'justify-center' : ''}`}
                >
                  <Icon className={`h-5 w-5 shrink-0 ${isActive ? 'text-indigo-200' : ''}`} />
                  <AnimatePresence initial={false}>
                    {!collapsed ? (
                      <Motion.div
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -8 }}
                        transition={sidebarTransition}
                        className="min-w-0"
                      >
                        <p className="truncate font-medium">{item.label}</p>
                        <p className="truncate text-xs text-slate-500">{item.description}</p>
                      </Motion.div>
                    ) : null}
                  </AnimatePresence>
                </NavLink>

                {collapsed ? (
                  <div className="pointer-events-none absolute left-full top-1/2 z-30 ml-3 hidden -translate-y-1/2 rounded-xl border border-white/10 bg-slate-950/95 px-3 py-2 text-xs text-slate-200 shadow-2xl group-hover:block">
                    {item.label}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>

        <div className="relative z-10 space-y-4">
          <div className="overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04] p-4">
            <AnimatePresence mode="wait" initial={false}>
              {!collapsed ? (
                <Motion.div
                  key="expanded-momentum"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={sidebarTransition}
                >
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Momentum</p>
                  <div className="mt-3 flex items-end justify-between gap-3">
                    <div>
                      <p className="text-3xl font-semibold text-white">12 Days</p>
                      <p className="mt-1 text-sm text-slate-400">Consistency above your average</p>
                    </div>
                    <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-200">
                      +18%
                    </div>
                  </div>
                  <div className="mt-4 h-2 rounded-full bg-white/8">
                    <div className="h-full w-[74%] rounded-full bg-[linear-gradient(90deg,#6366f1,#8b5cf6,#3b82f6)]" />
                  </div>
                </Motion.div>
              ) : (
                <Motion.div
                  key="collapsed-momentum"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex justify-center"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-200">
                    12
                  </div>
                </Motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className={`flex items-center gap-3 rounded-[28px] border border-white/10 bg-white/[0.04] p-3 ${collapsed ? 'justify-center' : ''}`}>
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#312e81,#4f46e5,#2563eb)] text-sm font-semibold text-white">
              {userInitials}
            </div>
            <AnimatePresence initial={false}>
              {!collapsed ? (
                <Motion.div
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={sidebarTransition}
                  className="min-w-0"
                >
                  <p className="truncate text-sm font-medium text-white">{userName}</p>
                  <p className="truncate text-xs text-slate-400">{userRole}</p>
                </Motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </Motion.aside>
  );
};

export default Sidebar;
