import {
  FiGrid,
  FiMessageSquare,
  FiCompass,
  FiList,
  FiBookOpen,
  FiBookmark,
} from 'react-icons/fi';

const tabs = [
  { id: 'overview', label: 'Overview', icon: FiGrid },
  { id: 'chat', label: 'Ask Document', icon: FiMessageSquare },
  { id: 'insights', label: 'Insights', icon: FiCompass },
  { id: 'sections', label: 'Key Sections', icon: FiList },
  { id: 'notes', label: 'Notes', icon: FiBookOpen },
  { id: 'bookmarks', label: 'Bookmarks', icon: FiBookmark },
];

export default function DocumentTabs({ activeTab, onTabChange, counts = {} }) {
  return (
    <div className="border-b border-slate-200/80 dark:border-[#1E293B] overflow-x-auto no-scrollbar">
      <nav className="flex items-center gap-1 sm:gap-2 min-w-max pb-px">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const count = counts[tab.id];

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all relative border-b-2 -mb-px ${
                isActive
                  ? 'border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400 font-bold'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <tab.icon className={`text-sm ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
              {typeof count === 'number' && count > 0 && (
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                    isActive
                      ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
