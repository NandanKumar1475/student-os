import { AnimatePresence, motion as Motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { profileNavItem, navItems } from './navConfig';

const drawerTransition = { duration: 0.26, ease: [0.22, 1, 0.36, 1] };

const MobileNavigation = ({
  isOpen,
  onClose,
  currentPath,
  userInitials,
  userName,
  userRole,
}) => {
  const bottomNavItems = navItems.slice(0, 5);

  return (
    <>
      <AnimatePresence>
        {isOpen ? (
          <>
            <Motion.button
              type="button"
              aria-label="Close menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm lg:hidden"
            />
            <Motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={drawerTransition}
              className="fixed inset-y-0 left-0 z-50 w-[88vw] max-w-[320px] border-r border-white/10 bg-slate-950/95 p-4 shadow-2xl lg:hidden"
            >
              <div className="flex h-full flex-col">
                <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#312e81,#4f46e5,#2563eb)] text-sm font-semibold text-white">
                      {userInitials}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-white">{userName}</p>
                      <p className="truncate text-xs text-slate-400">{userRole}</p>
                    </div>
                  </div>
                </div>

                <nav className="mt-5 flex-1 space-y-2">
                  {[...navItems, profileNavItem].map((item) => {
                    const Icon = item.icon;
                    const isActive = currentPath === item.path;

                    return (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === '/'}
                        onClick={onClose}
                        className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm transition ${
                          isActive
                            ? 'border-indigo-300/25 bg-indigo-400/10 text-white'
                            : 'border-transparent bg-white/[0.02] text-slate-300'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <div>
                          <p className="font-medium">{item.label}</p>
                          <p className="text-xs text-slate-500">{item.description}</p>
                        </div>
                      </NavLink>
                    );
                  })}
                </nav>
              </div>
            </Motion.aside>
          </>
        ) : null}
      </AnimatePresence>

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-slate-950/90 px-3 py-3 backdrop-blur-2xl lg:hidden">
        <div className="mx-auto flex max-w-xl items-center justify-between gap-2">
          {bottomNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={`flex min-w-0 flex-1 flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[11px] transition ${
                  isActive ? 'bg-indigo-400/10 text-white' : 'text-slate-400'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="truncate">{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default MobileNavigation;
