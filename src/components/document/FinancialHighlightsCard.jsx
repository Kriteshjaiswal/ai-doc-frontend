import { FiDollarSign, FiArrowRight } from 'react-icons/fi';

export default function FinancialHighlightsCard({
  financials = [],
  onViewAllFigures,
  onSelectFinancialPage,
}) {
  const displayFinancials = financials.slice(0, 3);

  return (
    <div className="glass-card p-5 sm:p-6 rounded-2xl space-y-4 shadow-xs flex flex-col justify-between">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-orange-500/10 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center border border-orange-200/40 dark:border-orange-900/40">
              <FiDollarSign className="text-xs" />
            </div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white tracking-tight">
              Financial Highlights
            </h3>
          </div>
          {financials.length > 0 && (
            <span className="text-[11px] font-mono font-semibold text-slate-400 dark:text-slate-500">
              {financials.length} metric{financials.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* Figures List or Empty State */}
        {displayFinancials.length === 0 ? (
          <div className="py-6 text-center text-xs text-slate-400 dark:text-slate-500">
            No financial figures detected in this document.
          </div>
        ) : (
          <div className="space-y-2 pt-1">
            {displayFinancials.map((item, idx) => (
              <div
                key={idx}
                onClick={() => item.page && onSelectFinancialPage?.(item.page)}
                className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-[#141B2D]/70 transition-colors cursor-pointer group"
              >
                <div className="min-w-0 pr-2">
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors truncate">
                    {item.label}
                  </p>
                  {item.page && (
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                      Page {item.page}
                    </p>
                  )}
                </div>
                <span className="text-xs font-mono font-extrabold text-slate-900 dark:text-white tabular-nums flex-shrink-0">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Button */}
      {financials.length > 0 && (
        <div className="pt-1">
          <button
            onClick={onViewAllFigures}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 bg-slate-50 dark:bg-[#141B2D] hover:bg-orange-50 hover:text-orange-600 dark:hover:bg-orange-950/50 dark:hover:text-orange-400 border border-slate-200/80 dark:border-[#1E293B] text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl transition-all shadow-2xs"
          >
            <span>View All Figures</span>
            <FiArrowRight className="text-xs" />
          </button>
        </div>
      )}
    </div>
  );
}
