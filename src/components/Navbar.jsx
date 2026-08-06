import { FiMenu, FiSun, FiMoon, FiLogOut } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ onMenuClick }) {
  const { isDark, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  // Get user initials from fullName
  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <header className="h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30 transition-colors">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Open menu"
        >
          <FiMenu className="text-xl" />
        </button>
        <span className="lg:hidden font-bold text-slate-900 dark:text-white text-base">
          Doc<span className="text-blue-600 dark:text-indigo-400">Q&A</span>
        </span>
      </div>

      <div className="flex items-center gap-3">
        {/* Day / Night Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="relative group p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-amber-400 hover:bg-slate-200 dark:hover:bg-slate-700/80 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          title={isDark ? 'Switch to Day Mode' : 'Switch to Night Mode'}
          aria-label="Toggle Day or Night theme"
        >
          <div className="relative w-5 h-5 flex items-center justify-center">
            {isDark ? (
              <FiSun className="text-lg text-amber-400 transform transition-transform duration-300 rotate-0 hover:rotate-45" />
            ) : (
              <FiMoon className="text-lg text-indigo-600 transform transition-transform duration-300 rotate-0 hover:-rotate-12" />
            )}
          </div>
          {/* Tooltip */}
          <span className="absolute right-0 top-12 hidden group-hover:block whitespace-nowrap bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-[11px] font-semibold px-2.5 py-1 rounded-md shadow-lg pointer-events-none z-50">
            {isDark ? 'Day Mode' : 'Night Mode'}
          </span>
        </button>

        {/* User Badge */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-semibold text-xs shadow-md shadow-blue-500/20">
            {getInitials(user?.fullName)}
          </div>
          <span className="hidden sm:inline text-xs font-semibold text-slate-700 dark:text-slate-300 max-w-[120px] truncate">
            {user?.fullName || 'User'}
          </span>
        </div>

        {/* Logout Button */}
        <button
          onClick={logout}
          className="relative group p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-rose-500/50"
          aria-label="Logout"
        >
          <FiLogOut className="text-base" />
          {/* Tooltip */}
          <span className="absolute right-0 top-12 hidden group-hover:block whitespace-nowrap bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-[11px] font-semibold px-2.5 py-1 rounded-md shadow-lg pointer-events-none z-50">
            Logout
          </span>
        </button>
      </div>
    </header>
  );
}
