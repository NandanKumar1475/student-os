import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from "../hooks/useAuth";

const navItems = [
  { path: '/', label: 'Dashboard', icon: '⊞' },
  { path: '/targets', label: 'Targets', icon: '◎' },
  { path: '/tasks', label: 'Tasks', icon: '☑' },
  { path: '/notes', label: 'Notes', icon: '📄' },
  { path: '/analytics', label: 'Analytics', icon: '📊' },
  { path: '/jobs', label: 'Jobs', icon: '💼' },
  { path: '/resources', label: 'Resources', icon: '📦' },
];

const MainLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase()
    : '?';

  return (
    <div className="flex h-screen bg-[#0f0f1a]">
      {/* Sidebar */}
      <aside className="w-56 bg-[#151525] flex flex-col border-r border-[#1e1e35]">
        {/* Logo */}
        <div className="px-5 py-6">
          <h1 className="text-xl font-bold">
            <span className="text-blue-400">Student</span>{' '}
            <span className="text-white font-extrabold">OS</span>
          </h1>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                    : 'text-gray-400 hover:text-white hover:bg-[#1e1e35]'
                }`
              }
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Streak & XP */}
        <div className="px-4 pb-3">
          <div className="bg-[#1e1e35] rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-orange-400 text-lg">🔥</span>
                <span className="text-white text-sm font-semibold">Streak</span>
              </div>
              <span className="text-white font-bold">12</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-yellow-400 text-lg">🏆</span>
              <span className="text-gray-400 text-sm">2,450 XP</span>
            </div>
          </div>
        </div>

        {/* User Profile */}
        <div className="px-4 pb-5">
          <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#1e1e35] transition cursor-pointer"
               onClick={() => navigate('/profile')}>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-semibold truncate">{user?.name}</p>
              <p className="text-gray-500 text-xs truncate">{user?.branch || 'Student'}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 bg-[#151525] border-b border-[#1e1e35] flex items-center justify-between px-6">
          <div className="flex-1 max-w-xl">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
              <input
                type="text"
                placeholder="Search anything..."
                className="w-full bg-[#1e1e35] text-gray-300 text-sm pl-10 pr-4 py-2.5 rounded-xl border border-[#2a2a45] focus:border-blue-500 focus:outline-none transition placeholder-gray-600"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative text-gray-400 hover:text-white transition">
              🔔
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"></span>
            </button>
            <button
              onClick={handleLogout}
              className="text-gray-400 hover:text-red-400 text-sm transition"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;