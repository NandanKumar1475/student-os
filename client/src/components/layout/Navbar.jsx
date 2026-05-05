import { AnimatePresence, motion as Motion } from 'framer-motion';
import {
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  Search,
  UserCircle2,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import FloatingInput from '../ui/FloatingInput';
import GradientButton from '../ui/GradientButton';

const menuTransition = { duration: 0.2, ease: [0.22, 1, 0.36, 1] };

const Navbar = ({
  onOpenMobileMenu,
  onOpenQuickCapture,
  searchValue,
  onSearchChange,
  userInitials,
  userName,
  userRole,
  notificationCount,
  notifications,
  notificationsOpen,
  onToggleNotifications,
  profileOpen,
  onToggleProfile,
  onLogout,
}) => {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/45 px-4 py-4 backdrop-blur-2xl sm:px-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-center gap-3">
          <Motion.button
            type="button"
            onClick={onOpenMobileMenu}
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-slate-200 transition hover:bg-white/[0.08] lg:hidden"
            whileTap={{ scale: 0.96 }}
          >
            <Menu className="h-5 w-5" />
          </Motion.button>

          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Student command center</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Premium productivity for focused students
            </h1>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <FloatingInput
            label="Search tasks, notes, or targets"
            value={searchValue}
            onChange={onSearchChange}
            icon={Search}
            className="w-full sm:w-[360px]"
          />

          <GradientButton
            className="hidden min-w-[148px] sm:inline-flex"
            onClick={onOpenQuickCapture}
          >
            Quick Capture
          </GradientButton>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Motion.button
                type="button"
                onClick={onToggleNotifications}
                className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-slate-200 transition hover:bg-white/[0.08]"
                whileTap={{ scale: 0.96 }}
              >
                <Bell className="h-5 w-5" />
                {notificationCount > 0 ? (
                  <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-indigo-300 shadow-[0_0_12px_rgba(165,180,252,0.8)]" />
                ) : null}
              </Motion.button>

              <AnimatePresence>
                {notificationsOpen ? (
                  <Motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={menuTransition}
                    className="absolute right-0 mt-3 w-[320px] overflow-hidden rounded-[28px] border border-white/10 bg-slate-950/95 p-3 shadow-[0_30px_80px_rgba(2,6,23,0.55)]"
                  >
                    <div className="mb-3 flex items-center justify-between px-2">
                      <div>
                        <p className="text-sm font-semibold text-white">Notifications</p>
                        <p className="text-xs text-slate-400">Recent momentum updates</p>
                      </div>
                      <span className="rounded-full bg-indigo-400/10 px-2 py-1 text-xs text-indigo-200">
                        {notificationCount} new
                      </span>
                    </div>

                    <div className="space-y-2">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className="rounded-2xl border border-white/8 bg-white/[0.04] p-3"
                        >
                          <p className="text-sm font-medium text-white">{notification.title}</p>
                          <p className="mt-1 text-xs leading-5 text-slate-400">{notification.body}</p>
                        </div>
                      ))}
                    </div>
                  </Motion.div>
                ) : null}
              </AnimatePresence>
            </div>

            <div className="relative">
              <Motion.button
                type="button"
                onClick={onToggleProfile}
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-left transition hover:bg-white/[0.08]"
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#312e81,#4f46e5,#2563eb)] text-sm font-semibold text-white">
                  {userInitials}
                </div>
                <div className="hidden min-w-0 sm:block">
                  <p className="truncate text-sm font-medium text-white">{userName}</p>
                  <p className="truncate text-xs text-slate-400">{userRole}</p>
                </div>
                <ChevronDown className="hidden h-4 w-4 text-slate-400 sm:block" />
              </Motion.button>

              <AnimatePresence>
                {profileOpen ? (
                  <Motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={menuTransition}
                    className="absolute right-0 mt-3 w-56 overflow-hidden rounded-[28px] border border-white/10 bg-slate-950/95 p-2 shadow-[0_30px_80px_rgba(2,6,23,0.55)]"
                  >
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm text-slate-200 transition hover:bg-white/[0.06]"
                    >
                      <UserCircle2 className="h-4 w-4" />
                      Profile Settings
                    </Link>
                    <button
                      type="button"
                      onClick={onLogout}
                      className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm text-rose-200 transition hover:bg-rose-400/10"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </button>
                  </Motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
