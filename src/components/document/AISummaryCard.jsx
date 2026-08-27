import { FiFileText, FiArrowRight } from 'react-icons/fi';

export default function AISummaryCard({ summary, onReadFullSummary }) {
  const defaultText =
    summary ||
    'The uploaded document contains structured domain information, key specifications, and analytical insights extracted across its pages.';

  return (
    <div className="glass-card p-5 sm:p-6 rounded-2xl space-y-4 shadow-xs flex flex-col justify-between">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-200/40 dark:border-emerald-900/40">
            <FiFileText className="text-xs" />
          </div>
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white tracking-tight">
            AI Summary
          </h3>
        </div>

        {/* Dynamic Summary Text */}
        <p className="text-xs sm:text-[13px] text-slate-600 dark:text-slate-300 leading-relaxed">
          {defaultText}
        </p>
      </div>

      {/* Action Button */}
      <div className="pt-1">
        <button
          onClick={onReadFullSummary}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 bg-slate-50 dark:bg-[#141B2D] hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950/50 dark:hover:text-indigo-400 border border-slate-200/80 dark:border-[#1E293B] text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl transition-all shadow-2xs"
        >
          <span>Read Full Summary</span>
          <FiArrowRight className="text-xs" />
        </button>
      </div>
    </div>
  );
}
