import { useState, useRef, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import {
  FiGrid,
  FiFileText,
  FiRepeat,
  FiLayers,
  FiBookOpen,
  FiClock,
  FiBookmark,
  FiTrash2,
  FiPlus,
  FiX,
  FiZap,
} from 'react-icons/fi';
import { DocumindIcon } from './DocumindLogo';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/', icon: FiGrid, label: 'Dashboard' },
  { to: '/documents', icon: FiFileText, label: 'Documents' },
  { to: '/comparisons', icon: FiRepeat, label: 'Comparisons' },
  { to: '/flashcards', icon: FiLayers, label: 'Flashcards' },
  { to: '/notes', icon: FiBookOpen, label: 'Notes' },
  { to: '/history', icon: FiClock, label: 'History' },
  { to: '/bookmarks', icon: FiBookmark, label: 'Bookmarks' },
  { to: '/trash', icon: FiTrash2, label: 'Trash' },
];

export default function Sidebar({ isOpen, onClose }) {
  const [isHovered, setIsHovered] = useState(false);
  const enterTimeoutRef = useRef(null);
  const leaveTimeoutRef = useRef(null);
  const { user } = useAuth();
  const location = useLocation();

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
            <Link to="/" className="flex items-center gap-3.5 overflow-hidden group">
              <div className="w-10 h-10 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]">
                <DocumindIcon className="w-9 h-9" />
              </div>
              <div
                className={`flex flex-col whitespace-nowrap overflow-hidden transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
                  isExpanded || isOpen
                    ? 'opacity-100 translate-x-0 pointer-events-auto'
                    : 'lg:opacity-0 lg:-translate-x-3 pointer-events-none'
                }`}
              >
                <div className="font-extrabold text-base tracking-tight flex items-baseline leading-none">
                  <span className="text-slate-900 dark:text-white">Docu</span>
                  <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-fuchsia-500 bg-clip-text text-transparent font-black ml-0.5">
                    Mind
                  </span>
                </div>
                <span className="text-[9px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider mt-1 font-mono">
                  AI Intelligence
                </span>
              </div>
            </Link>

            {/* Mobile close button */}
            <button
              onClick={onClose}
              className="lg:hidden ml-auto p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#1E293B]"
              aria-label="Close sidebar"
            >
              <FiX className="text-lg" />
            </button>
          </div>

          {/* Upload Button */}
          <div className="p-3">
            <Link
              to="/upload"
              onClick={onClose}
              className={`flex items-center rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/25 transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] active:scale-98 overflow-hidden ${
                isExpanded || isOpen
                  ? 'px-3.5 py-2.5 w-full justify-start gap-2.5'
                  : 'lg:w-10 lg:h-10 lg:p-0 lg:justify-center mx-auto'
              }`}
              title="Upload Document"
            >
              <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                <FiPlus className="text-lg" />
              </div>
              <span
                className={`whitespace-nowrap overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
                  isExpanded || isOpen
                    ? 'max-w-[160px] opacity-100 translate-x-0'
                    : 'lg:max-w-0 lg:opacity-0 lg:-translate-x-3 pointer-events-none'
                }`}
              >
                Upload Document
              </span>
            </Link>
          </div>

          {/* Navigation Links Group */}
          <nav className="px-2.5 py-1 space-y-1 flex-1 overflow-x-hidden">
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
                  {/* Fixed-size Icon Container so it NEVER shifts */}
                  <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                    <item.icon
                      className={`text-base transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
                        isCurrentActive ? 'scale-105' : 'group-hover:scale-110'
                      }`}
                    />
                  </div>

                  {/* Nav Label - Synchronized 500ms Smooth Slide & Fade */}
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

        {/* Bottom Section: Plan Usage & User Profile */}
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

          {/* User Profile Footer */}
          <div className="flex items-center gap-3 px-1 py-1 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0 shadow-xs ring-2 ring-white dark:ring-[#1E293B]">
              {getInitials(user?.fullName)}
            </div>
            <div
              className={`min-w-0 overflow-hidden transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
                isExpanded || isOpen
                  ? 'opacity-100 translate-x-0 pointer-events-auto'
                  : 'lg:opacity-0 lg:-translate-x-3 pointer-events-none'
              }`}
            >
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate leading-tight whitespace-nowrap">
                {user?.fullName || 'Kritesh Jaiswal'}
              </p>
              <p className="text-[10.5px] text-slate-400 dark:text-slate-500 truncate leading-tight mt-0.5 font-mono whitespace-nowrap">
                {user?.email || 'kritesh@example.com'}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
