import { useLocation } from 'react-router-dom';
import { FiMenu, FiSun, FiMoon, FiLogOut, FiSearch, FiBell } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ onMenuClick, onOpenSearch }) {
  const { isDark, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const location = useLocation();

  // Get current page title from pathname
  const getPageTitle = (path) => {
    switch (path) {
      case '/':
        return 'Dashboard';
      case '/upload':
        return 'Upload';
      case '/documents':
        return 'Documents';
      case '/flashcards':
        return 'Flashcards';
      case '/chat':
        return 'AI Chat';
      case '/history':
        return 'History';
      default:
        return 'Dashboard';
    }
  };

  // Get user initials from fullName
  const getInitials = (name) => {
    if (!name) return 'KJ';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <header className="h-16 bg-white/80 dark:bg-[#0B0F17]/90 backdrop-blur-md border-b border-slate-200/80 dark:border-[#1E293B] flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30 transition-colors">
      {/* Left: Mobile Toggle & Page Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1E293B] transition-colors"
          aria-label="Open menu"
        >
          <FiMenu className="text-xl" />
        </button>

        {/* Page Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <span>Workspace</span>
          <span className="text-slate-300 dark:text-slate-600">/</span>
          <span className="text-slate-900 dark:text-slate-200 font-bold">
            {getPageTitle(location.pathname)}
          </span>
        </div>
      </div>

      {/* Right Toolbar */}
      <div className="flex items-center gap-3">
        {/* Global Search Button */}
        <button
          onClick={onOpenSearch}
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#141B2D] border border-slate-200/80 dark:border-[#1E293B] text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700 text-xs font-medium transition-all"
        >
          <FiSearch className="text-xs text-slate-400" />
          <span>Search...</span>
          <kbd className="ml-2 px-1.5 py-0.5 rounded bg-slate-200 dark:bg-[#1E293B] text-slate-600 dark:text-slate-400 text-[10px] font-mono">
            ⌘K
          </kbd>
        </button>

        {/* Mobile Search Icon */}
        <button
          onClick={onOpenSearch}
          className="sm:hidden p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#141B2D]"
          aria-label="Search"
        >
          <FiSearch className="text-lg" />
        </button>

        {/* Notification Bell */}
        <button
          className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#141B2D] transition-colors relative"
          aria-label="Notifications"
        >
          <FiBell className="text-base" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500" />
        </button>

        {/* Day / Night Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#141B2D] transition-colors"
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle theme"
        >
          {isDark ? <FiSun className="text-base text-amber-400" /> : <FiMoon className="text-base text-indigo-600" />}
        </button>

        {/* User Badge */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200/80 dark:border-[#1E293B]">
          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-sm">
            {getInitials(user?.fullName)}
          </div>
          <span className="hidden md:inline text-xs font-semibold text-slate-700 dark:text-slate-200 max-w-[120px] truncate">
            {user?.fullName || 'Kritesh Jaiswal'}
          </span>
        </div>

        {/* Logout Button */}
        <button
          onClick={logout}
          className="p-2 rounded-xl text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
          aria-label="Logout"
          title="Logout"
        >
          <FiLogOut className="text-base" />
        </button>
      </div>
    </header>
  );
}
