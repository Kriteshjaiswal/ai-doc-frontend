import { NavLink } from 'react-router-dom';
import {
  FiHome,
  FiUpload,
  FiFileText,
  FiMessageSquare,
  FiClock,
  FiZap,
  FiLayers,
} from 'react-icons/fi';

const navItems = [
  { to: '/', icon: FiHome, label: 'Dashboard' },
  { to: '/upload', icon: FiUpload, label: 'Upload' },
  { to: '/documents', icon: FiFileText, label: 'Documents' },
  { to: '/flashcards', icon: FiLayers, label: 'Flashcards' },
  { to: '/chat', icon: FiMessageSquare, label: 'AI Chat' },
  { to: '/history', icon: FiClock, label: 'History' },
];

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:z-auto flex flex-col justify-between ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Brand Logo */}
          <div className="flex items-center gap-3 px-6 h-16 border-b border-slate-200 dark:border-slate-800">
            <div className="w-9 h-9 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <FiMessageSquare className="text-white text-base" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-slate-900 dark:text-white text-lg tracking-tight">
                Doc<span className="text-blue-600 dark:text-indigo-400">Q&A</span>
              </span>
              <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">
                AI Assistant
              </span>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="mt-6 px-3 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-blue-50 dark:bg-indigo-950/60 text-blue-600 dark:text-indigo-400 shadow-sm border border-blue-100 dark:border-indigo-800/50'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
                  }`
                }
              >
                <item.icon className="text-lg" />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Footer info card */}
        <div className="p-4 m-3 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/50 dark:from-slate-800/80 dark:to-indigo-950/40 border border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-indigo-400 mb-1">
            <FiZap />
            <span>AI Document Engine</span>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            Upload PDFs & query instant context-aware AI answers.
          </p>
        </div>
      </aside>
    </>
  );
}
