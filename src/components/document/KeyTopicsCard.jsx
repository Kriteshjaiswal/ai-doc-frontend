import { FiTag, FiArrowRight } from 'react-icons/fi';

export default function KeyTopicsCard({ topics = [], onViewAllTopics, onSelectTopicPage }) {
  const displayTopics = topics.slice(0, 5);

  return (
    <div className="glass-card p-5 sm:p-6 rounded-2xl space-y-4 shadow-xs flex flex-col justify-between">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/10 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-200/40 dark:border-indigo-900/40">
              <FiTag className="text-xs" />
            </div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white tracking-tight">
              Key Topics
            </h3>
          </div>
          {topics.length > 0 && (
            <span className="text-[11px] font-mono font-semibold text-slate-400 dark:text-slate-500">
              {topics.length} detected
            </span>
          )}
        </div>

        {/* Topics List or Empty State */}
        {displayTopics.length === 0 ? (
          <div className="py-6 text-center text-xs text-slate-400 dark:text-slate-500">
            No specific topics identified from this document.
          </div>
        ) : (
          <div className="space-y-2 pt-1">
            {displayTopics.map((topic, idx) => (
              <div
                key={idx}
                onClick={() => {
                  if (topic.pages && topic.pages.length > 0) {
                    onSelectTopicPage?.(topic.pages[0]);
                  }
                }}
                className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-[#141B2D]/70 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 flex-shrink-0" />
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                    {topic.name}
                  </span>
                  {topic.pages && topic.pages.length > 0 && (
                    <span className="hidden sm:inline text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                      p.{topic.pages[0]}
                    </span>
                  )}
                </div>
                <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-[#1E293B] px-2 py-0.5 rounded-md tabular-nums ml-2 flex-shrink-0">
                  {topic.count || 1}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Button */}
      {topics.length > 0 && (
        <div className="pt-1">
          <button
            onClick={onViewAllTopics}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 bg-slate-50 dark:bg-[#141B2D] hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950/50 dark:hover:text-indigo-400 border border-slate-200/80 dark:border-[#1E293B] text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl transition-all shadow-2xs"
          >
            <span>View All Topics</span>
            <FiArrowRight className="text-xs" />
          </button>
        </div>
      )}
    </div>
  );
}
