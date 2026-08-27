import { FiAlertTriangle, FiArrowRight } from 'react-icons/fi';

export default function PotentialRisksCard({ risks = [], onViewAllRisks, onSelectRiskPage }) {
  const displayRisks = risks.slice(0, 3);

  const getSeverityBadge = (severity = 'Medium') => {
    switch (severity?.toLowerCase()) {
      case 'critical':
        return 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border-rose-200/60 dark:border-rose-900/40';
      case 'high':
        return 'bg-orange-50 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 border-orange-200/60 dark:border-orange-900/40';
      case 'medium':
        return 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border-amber-200/60 dark:border-amber-900/40';
      default:
        return 'bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 border-sky-200/60 dark:border-sky-900/40';
    }
  };

  return (
    <div className="glass-card p-5 sm:p-6 rounded-2xl space-y-4 shadow-xs flex flex-col justify-between">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-rose-500/10 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center border border-rose-200/40 dark:border-rose-900/40">
              <FiAlertTriangle className="text-xs" />
            </div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white tracking-tight">
              Potential Risks
            </h3>
          </div>
          {risks.length > 0 && (
            <span className="text-[11px] font-mono font-semibold text-slate-400 dark:text-slate-500">
              {risks.length} identified
            </span>
          )}
        </div>

        {/* Risks List or Empty State */}
        {displayRisks.length === 0 ? (
          <div className="py-6 text-center text-xs text-slate-400 dark:text-slate-500">
            No significant risks detected in this document.
          </div>
        ) : (
          <div className="space-y-2 pt-1">
            {displayRisks.map((item, idx) => (
              <div
                key={idx}
                onClick={() => item.page && onSelectRiskPage?.(item.page)}
                className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-[#141B2D]/70 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2 min-w-0 pr-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors truncate">
                      {item.title}
                    </p>
                    {item.page && (
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                        Page {item.page}
                      </p>
                    )}
                  </div>
                </div>
                <span
                  className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md border tracking-wider flex-shrink-0 ${getSeverityBadge(
                    item.severity
                  )}`}
                >
                  {item.severity || 'Medium'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Button */}
      {risks.length > 0 && (
        <div className="pt-1">
          <button
            onClick={onViewAllRisks}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 bg-slate-50 dark:bg-[#141B2D] hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/50 dark:hover:text-rose-400 border border-slate-200/80 dark:border-[#1E293B] text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl transition-all shadow-2xs"
          >
            <span>View All Risks</span>
            <FiArrowRight className="text-xs" />
          </button>
        </div>
      )}
    </div>
  );
}
