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

const workspaceItems = [
  { to: '/', icon: FiHome, label: 'Dashboard' },
  { to: '/upload', icon: FiUpload, label: 'Upload' },
  { to: '/documents', icon: FiFileText, label: 'Documents' },
];

const aiToolsItems = [
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
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white dark:bg-[#0F1422] border-r border-slate-200/80 dark:border-[#1E293B] transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:z-auto flex flex-col justify-between ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Brand Logo */}
          <div className="flex items-center gap-3 px-6 h-16 border-b border-slate-100 dark:border-[#1E293B]">
            <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center shadow-md shadow-indigo-600/30 flex-shrink-0">
              <FiMessageSquare className="text-white text-base" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-extrabold text-slate-900 dark:text-white text-base tracking-tight">
                DocQ&A
              </span>
              <span className="text-[9px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-widest mt-0.5">
                AI ASSISTANT
              </span>
            </div>
          </div>

          {/* Navigation Groups */}
          <div className="py-5 px-3 space-y-6">
            {/* WORKSPACE GROUP */}
            <div>
              <div className="px-3 mb-2 text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">
                WORKSPACE
              </div>
              <nav className="space-y-1">
                {workspaceItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                        isActive
                          ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#1E293B]/60 hover:text-slate-900 dark:hover:text-slate-200'
                      }`
                    }
                  >
                    <item.icon className="text-base" />
                    {item.label}
                  </NavLink>
                ))}
              </nav>
            </div>

            {/* AI TOOLS GROUP */}
            <div>
              <div className="px-3 mb-2 text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">
                AI TOOLS
              </div>
              <nav className="space-y-1">
                {aiToolsItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                        isActive
                          ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#1E293B]/60 hover:text-slate-900 dark:hover:text-slate-200'
                      }`
                    }
                  >
                    <item.icon className="text-base" />
                    {item.label}
                  </NavLink>
                ))}
              </nav>
            </div>
          </div>
        </div>

        {/* Footer info card */}
        <div className="p-4 m-3 rounded-2xl bg-slate-50 dark:bg-[#141B2D] border border-slate-200/80 dark:border-[#1E293B]">
          <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-1">
            <FiZap className="text-xs" />
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
