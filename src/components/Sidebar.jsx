import { useState, useRef, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import {
  FiGrid,
  FiFileText,
  FiRepeat,
  FiLayers,
  FiBookOpen,
  FiClock,
  FiTrash2,
  FiPlus,
  FiX,
  FiZap,
  FiUsers,
  FiUser,
} from 'react-icons/fi';
import { DocumindIcon } from './DocumindLogo';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ isOpen, onClose, onOpenProfile }) {
  const [isHovered, setIsHovered] = useState(false);
  const enterTimeoutRef = useRef(null);
  const leaveTimeoutRef = useRef(null);
  const { user } = useAuth();
  const location = useLocation();

  const isAdmin = user?.role === 'ROLE_ADMIN' || user?.role === 'ADMIN';

  const navItems = [
    { to: '/dashboard', icon: FiGrid, label: 'Dashboard' },
    { to: '/documents', icon: FiFileText, label: 'Documents' },
    ...(isAdmin ? [{ to: '/users', icon: FiUsers, label: 'Users Directory' }] : []),
    { to: '/comparisons', icon: FiRepeat, label: 'Comparisons' },
    { to: '/flashcards', icon: FiLayers, label: 'Flashcards' },
    { to: '/notes', icon: FiBookOpen, label: 'Notes' },
    { to: '/history', icon: FiClock, label: 'History' },
    { to: '/trash', icon: FiTrash2, label: 'Trash' },
  ];

  // Clear timers on unmount
  useEffect(() => {
    return () => {
      if (enterTimeoutRef.current) clearTimeout(enterTimeoutRef.current);
      if (leaveTimeoutRef.current) clearTimeout(leaveTimeoutRef.current);
    };
  }, []);

  // Graceful, professional hover debounce
  const handleMouseEnter = () => {
    if (leaveTimeoutRef.current) clearTimeout(leaveTimeoutRef.current);
    enterTimeoutRef.current = setTimeout(() => {
      setIsHovered(true);
    }, 60);
  };

  const handleMouseLeave = () => {
    if (enterTimeoutRef.current) clearTimeout(enterTimeoutRef.current);
    leaveTimeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, 220);
  };

  // Get user initials
  const getInitials = (name) => {
    if (!name) return 'KJ';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const isExpanded = isHovered;

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 lg:hidden transition-opacity duration-500"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Main Sidebar (Desktop Hover-Expandable + Mobile Slide Drawer) */}
      <aside
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`fixed top-0 left-0 z-50 h-full bg-white dark:bg-[#0B0F17] border-r border-slate-200/80 dark:border-[#1E293B] flex flex-col justify-between select-none overflow-x-hidden transition-[width,box-shadow,transform] duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
          // Mobile state
          isOpen
            ? 'translate-x-0 w-[260px] max-w-[85vw]'
            : '-translate-x-full lg:translate-x-0'
        } ${
          // Desktop hover expand
          isExpanded
            ? 'lg:w-[250px] shadow-2xl shadow-slate-950/25 dark:shadow-black/80'
            : 'lg:w-[72px] shadow-xs'
        }`}
      >
        {/* Top Header & Navigation Links */}
        <div className="flex-1 flex flex-col min-h-0 overflow-y-auto overflow-x-hidden no-scrollbar">
          {/* Brand Logo Header */}
          <div className="h-16 flex items-center px-4 border-b border-slate-100 dark:border-[#1E293B]/70 flex-shrink-0">
            <Link
              to="/dashboard"
              className="flex items-center gap-3 w-full group overflow-hidden"
              onClick={onClose}
            >
              {/* Direct Documind Vector Mark */}
              <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
                <DocumindIcon className="w-9 h-9 group-hover:scale-110 transition-transform duration-300 drop-shadow-xs" />
              </div>

              {/* Brand Typography */}
              <div
                className={`flex flex-col min-w-0 transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
                  isExpanded || isOpen
                    ? 'opacity-100 max-w-[160px] translate-x-0'
                    : 'lg:opacity-0 lg:max-w-0 lg:-translate-x-3 pointer-events-none'
                }`}
              >
                <div className="flex items-center tracking-tight leading-none">
                  <span className="font-extrabold text-base bg-gradient-to-r from-cyan-600 to-indigo-600 dark:from-cyan-400 dark:via-sky-300 dark:to-indigo-300 bg-clip-text text-transparent font-sans">
                    Docu
                  </span>
                  <span className="font-extrabold text-base bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent font-sans">
                    Mind
                  </span>
                </div>
                <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-0.5 font-mono">
                  AI Intelligence
                </span>
              </div>
            </Link>

            {/* Mobile Close Button */}
            <button
              onClick={onClose}
              className="lg:hidden p-1 rounded-lg text-slate-400 hover:text-slate-200 ml-auto"
            >
              <FiX className="text-lg" />
            </button>
          </div>

          {/* Primary Action Button (Upload Document) */}
          <div className="p-3">
            <Link
              to="/upload"
              onClick={onClose}
              className={`flex items-center rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:brightness-110 text-white font-bold transition-all duration-300 shadow-md shadow-indigo-500/25 relative group overflow-hidden ${
                isExpanded || isOpen
                  ? 'h-10 px-3.5 gap-2.5 w-full justify-start'
                  : 'lg:w-10 lg:h-10 lg:p-0 lg:justify-center mx-auto'
              }`}
              title="Upload Document"
            >
              <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                <FiPlus className="text-base group-hover:rotate-90 transition-transform duration-300" />
              </div>
              <span
                className={`text-xs whitespace-nowrap overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
                  isExpanded || isOpen
                    ? 'max-w-[140px] opacity-100 translate-x-0'
                    : 'lg:max-w-0 lg:opacity-0 lg:-translate-x-3 pointer-events-none'
                }`}
              >
                Upload Document
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-3 space-y-1.5 py-1">
            {navItems.map((item) => {
              const isCurrentActive =
                item.to === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(item.to);

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  className={`flex items-center rounded-xl text-xs font-semibold transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] relative group overflow-hidden ${
                    isExpanded || isOpen
                      ? 'px-3 py-2.5 gap-3.5 w-full justify-start'
                      : 'lg:w-10 lg:h-10 lg:p-0 lg:justify-center mx-auto'
                  } ${
                    isCurrentActive
                      ? 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 font-bold shadow-2xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#1E293B]/60 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                  title={!isExpanded && !isOpen ? item.label : undefined}
                >
                  <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                    <item.icon
                      className={`text-base transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
                        isCurrentActive ? 'scale-105' : 'group-hover:scale-110'
                      }`}
                    />
                  </div>

                  <span
                    className={`whitespace-nowrap overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
                      isExpanded || isOpen
                        ? 'max-w-[160px] opacity-100 translate-x-0'
                        : 'lg:max-w-0 lg:opacity-0 lg:-translate-x-3 pointer-events-none'
                    }`}
                  >
                    {item.label}
                  </span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: Plan Usage & Clickable User Profile */}
        <div className="border-t border-slate-100 dark:border-[#1E293B]/70 p-3 space-y-2.5 flex-shrink-0 bg-slate-50/50 dark:bg-[#0B0F17]/50 overflow-hidden">
          {/* Pro Plan Usage Card */}
          <div
            className={`overflow-hidden transition-[max-height,opacity,transform] duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
              isExpanded || isOpen
                ? 'max-h-28 opacity-100 translate-y-0 pointer-events-auto'
                : 'lg:max-h-0 lg:opacity-0 lg:-translate-y-2 pointer-events-none'
            }`}
          >
            <div className="p-2.5 rounded-xl bg-white dark:bg-[#141B2D] border border-slate-200/80 dark:border-[#1E293B] shadow-2xs space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-bold">
                <span className="text-slate-800 dark:text-slate-200 flex items-center gap-1">
                  <FiZap className="text-indigo-600 dark:text-indigo-400 text-xs" />
                  Pro Plan
                </span>
                <button className="text-indigo-600 dark:text-indigo-400 hover:underline text-[10.5px]">
                  Upgrade
                </button>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-1.5 rounded-full w-[45%]" />
              </div>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono whitespace-nowrap">
                45.6 GB / 100 GB used
              </p>
            </div>
          </div>

          {/* Clickable User Profile Footer */}
          <Link
            to="/profile"
            onClick={onClose}
            className="w-full flex items-center gap-3 px-1.5 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-[#1E293B]/70 transition-all cursor-pointer text-left group"
            title="Click to view My Profile & Security"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 shadow-xs ring-2 ring-white dark:ring-[#1E293B] group-hover:scale-105 transition-transform">
              {getInitials(user?.fullName)}
            </div>
            <div
              className={`min-w-0 overflow-hidden transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
                isExpanded || isOpen
                  ? 'opacity-100 translate-x-0 pointer-events-auto'
                  : 'lg:opacity-0 lg:-translate-x-3 pointer-events-none'
              }`}
            >
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate leading-tight whitespace-nowrap group-hover:text-cyan-400 transition-colors">
                {user?.fullName || 'Kritesh Jaiswal'}
              </p>
              <p className="text-[10.5px] text-slate-400 dark:text-slate-500 truncate leading-tight mt-0.5 font-mono whitespace-nowrap">
                {user?.email || 'kritesh@example.com'}
              </p>
            </div>
          </Link>
        </div>
      </aside>
    </>
  );
}
