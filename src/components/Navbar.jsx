import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  FiMenu,
  FiSun,
  FiMoon,
  FiLogOut,
  FiSearch,
  FiBell,
  FiChevronRight,
  FiAlertTriangle,
  FiX,
} from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ onMenuClick, onOpenSearch }) {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const location = useLocation();

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && showLogoutModal) {
        setShowLogoutModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showLogoutModal]);

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
      case '/comparisons':
        return 'Comparisons';
      case '/notes':
        return 'Notes';
      case '/history':
        return 'History';
      case '/bookmarks':
        return 'Bookmarks';
      case '/trash':
        return 'Trash';
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

  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    logout();
  };

  return (
    <>
      <header className="h-16 bg-white/80 dark:bg-[#0B0F17]/90 backdrop-blur-md border-b border-slate-200/80 dark:border-[#1E293B] flex items-center justify-between px-3 sm:px-6 sticky top-0 z-30 transition-colors w-full min-w-0">
        {/* Left: Mobile Toggle & Page Breadcrumb */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-1.5 sm:p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1E293B] transition-colors flex-shrink-0 cursor-pointer"
            aria-label="Open menu"
          >
            <FiMenu className="text-xl" />
          </button>

          {/* Mobile Page Title (< lg) */}
          <div className="lg:hidden font-bold text-sm sm:text-base text-slate-900 dark:text-white truncate">
            {getPageTitle(location.pathname)}
          </div>

          {/* Desktop Breadcrumb (lg+) */}
          <div className="hidden lg:flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors">
              Workspace
            </span>
            <FiChevronRight className="text-xs text-slate-400 dark:text-slate-600" />
            <span className="text-slate-900 dark:text-white font-bold">
              {getPageTitle(location.pathname)}
            </span>
          </div>
        </div>

        {/* Center Search Bar (Desktop md+) */}
        <div className="hidden md:flex flex-1 max-w-md mx-6 justify-center">
          <button
            onClick={onOpenSearch}
            className="w-full flex items-center justify-between px-3.5 py-1.5 rounded-full bg-slate-100/80 dark:bg-[#141B2D]/90 border border-slate-200/80 dark:border-[#1E293B] text-slate-400 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700 text-xs font-medium transition-all shadow-2xs cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <FiSearch className="text-xs text-slate-400" />
              <span>Search documents...</span>
            </div>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-[#1E293B] text-slate-600 dark:text-slate-400 text-[10px] font-mono">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right Toolbar */}
        <div className="flex items-center gap-1 sm:gap-2.5 flex-shrink-0">
          {/* Mobile Search Icon (< md) */}
          <button
            onClick={onOpenSearch}
            className="md:hidden p-1.5 sm:p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#141B2D] transition-colors cursor-pointer"
            aria-label="Search"
          >
            <FiSearch className="text-base sm:text-lg" />
          </button>

          {/* Notification Bell */}
          <button
            className="p-1.5 sm:p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#141B2D] transition-colors relative cursor-pointer"
            aria-label="Notifications"
          >
            <FiBell className="text-base" />
            <span className="absolute top-1 sm:top-1.5 right-1 sm:right-1.5 w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_6px_rgba(99,102,241,0.6)]" />
          </button>

          {/* Day / Night Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-1.5 sm:p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#141B2D] transition-colors cursor-pointer"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle theme"
          >
            {isDark ? <FiSun className="text-base text-amber-400" /> : <FiMoon className="text-base text-indigo-600" />}
          </button>

          {/* User Badge (Visible on sm+) */}
          <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-200/80 dark:border-[#1E293B]">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white font-bold text-xs shadow-xs">
              {getInitials(user?.fullName)}
            </div>
            <span className="hidden lg:inline text-xs font-semibold text-slate-700 dark:text-slate-200 max-w-[130px] truncate">
              {user?.fullName || 'Kritesh Jaiswal'}
            </span>
          </div>

          {/* Logout Button (Opens Confirmation Modal) */}
          <button
            onClick={() => setShowLogoutModal(true)}
            className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
            aria-label="Logout"
            title="Log out of DocuMind"
          >
            <FiLogOut className="text-base" />
          </button>
        </div>
      </header>

      {/* ═══════════════════════════════════════════════════════════
          LOGOUT CONFIRMATION MODAL (YES / NO / CANCEL)
          ═══════════════════════════════════════════════════════════ */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={() => setShowLogoutModal(false)}
            aria-hidden="true"
          />

          {/* Modal Dialog Card */}
          <div className="relative w-full max-w-md bg-white dark:bg-[#0E1322] border border-slate-200 dark:border-[#1E293B] rounded-3xl p-6 sm:p-7 shadow-2xl shadow-black/80 space-y-5 z-10 animate-in zoom-in-95 duration-200">
            {/* Header with Warning Icon & Close */}
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center text-xl shadow-xs">
                <FiLogOut />
              </div>
              <button
                onClick={() => setShowLogoutModal(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#1E293B] transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <FiX className="text-lg" />
              </button>
            </div>

            {/* Content Text */}
            <div className="space-y-2">
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Are you sure you want to log out?
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                You will be signed out of your <strong>DocuMind</strong> workspace. You will need to log back in to access your uploaded documents, flashcards, and chat history.
              </p>
            </div>

            {/* Current Active Account Preview */}
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-[#141B2D] border border-slate-200/80 dark:border-[#1E293B]">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
                {getInitials(user?.fullName)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {user?.fullName || 'Kritesh Jaiswal'}
                </p>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 font-mono truncate">
                  {user?.email || 'user@example.com'}
                </p>
              </div>
            </div>

            {/* Action Buttons: Cancel vs Yes, Log out */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-200 dark:border-[#1E293B] bg-slate-100 dark:bg-[#141B2D] hover:bg-slate-200 dark:hover:bg-[#1E293B] text-slate-700 dark:text-slate-200 font-bold text-xs transition-colors cursor-pointer text-center"
              >
                No, Stay Logged In
              </button>
              <button
                type="button"
                onClick={handleConfirmLogout}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-98 text-white font-bold text-xs shadow-md shadow-rose-600/25 transition-all cursor-pointer text-center"
              >
                <FiLogOut className="text-sm" />
                <span>Yes, Log Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
