import {
  FiFileText,
  FiDatabase,
  FiShield,
  FiBookOpen,
  FiLayers,
  FiGlobe,
} from 'react-icons/fi';

const actions = [
  {
    id: 'summarize',
    label: 'Summarize',
    icon: FiFileText,
    color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 dark:bg-emerald-950/60 border-emerald-200/40 dark:border-emerald-900/40',
  },
  {
    id: 'extract-data',
    label: 'Extract Data',
    icon: FiDatabase,
    color: 'text-sky-600 dark:text-sky-400 bg-sky-500/10 dark:bg-sky-950/60 border-sky-200/40 dark:border-sky-900/40',
  },
  {
    id: 'find-risks',
    label: 'Find Risks',
    icon: FiShield,
    color: 'text-rose-600 dark:text-rose-400 bg-rose-500/10 dark:bg-rose-950/60 border-rose-200/40 dark:border-rose-900/40',
  },
  {
    id: 'generate-notes',
    label: 'Generate Notes',
    icon: FiBookOpen,
    color: 'text-orange-600 dark:text-orange-400 bg-orange-500/10 dark:bg-orange-950/60 border-orange-200/40 dark:border-orange-900/40',
  },
  {
    id: 'create-flashcards',
    label: 'Create Flashcards',
    icon: FiLayers,
    color: 'text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 dark:bg-indigo-950/60 border-indigo-200/40 dark:border-indigo-900/40',
  },
  {
    id: 'translate',
    label: 'Translate',
    icon: FiGlobe,
    color: 'text-violet-600 dark:text-violet-400 bg-violet-500/10 dark:bg-violet-950/60 border-violet-200/40 dark:border-violet-900/40',
  },
];

export default function QuickActionsCard({ onTriggerAction, loadingAction }) {
  return (
    <div className="glass-card p-4 sm:p-5 rounded-2xl shadow-xs space-y-3.5 border border-slate-200/90 dark:border-[#1E293B]">
      {/* Header */}
      <div className="flex items-center gap-2">
        <span className="text-indigo-600 dark:text-indigo-400 font-mono font-bold text-xs">⚡</span>
        <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider font-mono">
          Quick Actions
        </h3>
      </div>

      {/* 2-Column Action Buttons Grid */}
      <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
        {actions.map((action) => {
          const isLoading = loadingAction === action.id;

          return (
            <button
              key={action.id}
              onClick={() => onTriggerAction(action.id)}
              disabled={!!loadingAction}
              className="flex items-center gap-2 p-2.5 rounded-xl bg-white dark:bg-[#141B2D] hover:bg-slate-50 dark:hover:bg-[#1E293B] border border-slate-200/80 dark:border-[#1E293B] text-slate-700 dark:text-slate-200 text-xs font-semibold shadow-2xs transition-all active:scale-98 disabled:opacity-50 text-left group"
            >
              <div
                className={`w-7 h-7 rounded-lg ${action.color} flex items-center justify-center border shadow-2xs flex-shrink-0 group-hover:scale-105 transition-transform`}
              >
                {isLoading ? (
                  <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <action.icon className="text-xs" />
                )}
              </div>
              <span className="truncate">{action.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
