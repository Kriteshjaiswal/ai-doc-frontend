import { FiCalendar, FiArrowRight } from 'react-icons/fi';

export default function ImportantDatesCard({ dates = [], onViewAllDates, onSelectDatePage }) {
  const displayDates = dates.slice(0, 3);

  return (
    <div className="glass-card p-5 sm:p-6 rounded-2xl space-y-4 shadow-xs flex flex-col justify-between">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-200/40 dark:border-amber-900/40">
              <FiCalendar className="text-xs" />
            </div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white tracking-tight">
              Important Dates
            </h3>
          </div>
          {dates.length > 0 && (
            <span className="text-[11px] font-mono font-semibold text-slate-400 dark:text-slate-500">
              {dates.length} timeline{dates.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* Dates List or Empty State */}
        {displayDates.length === 0 ? (
          <div className="py-6 text-center text-xs text-slate-400 dark:text-slate-500">
            No important dates or timeline milestones detected.
          </div>
        ) : (
          <div className="space-y-2 pt-1">
            {displayDates.map((item, idx) => (
              <div
                key={idx}
                onClick={() => item.page && onSelectDatePage?.(item.page)}
                className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-[#141B2D]/70 transition-colors cursor-pointer group"
              >
                <div className="min-w-0 pr-2">
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors truncate">
                    {item.event}
                  </p>
                  {item.page && (
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                      Page {item.page}
                    </p>
                  )}
                </div>
                <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200/50 dark:border-amber-900/40 px-2 py-0.5 rounded-md tabular-nums flex-shrink-0">
                  {item.date}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Button */}
      {dates.length > 0 && (
        <div className="pt-1">
          <button
            onClick={onViewAllDates}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 bg-slate-50 dark:bg-[#141B2D] hover:bg-amber-50 hover:text-amber-600 dark:hover:bg-amber-950/50 dark:hover:text-amber-400 border border-slate-200/80 dark:border-[#1E293B] text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl transition-all shadow-2xs"
          >
            <span>View All Dates</span>
            <FiArrowRight className="text-xs" />
          </button>
        </div>
      )}
    </div>
  );
}
