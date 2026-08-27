import {
  FiFileText,
  FiFile,
  FiTag,
  FiCalendar,
  FiDollarSign,
  FiAlertTriangle,
  FiUsers,
  FiShield,
} from 'react-icons/fi';

export default function AnalysisStatsGrid({
  stats,
  pageCount = 1,
  onCardClick,
}) {
  const cards = [
    {
      id: 'pages',
      icon: FiFileText,
      iconColor: 'text-sky-600 dark:text-sky-400',
      bgColor: 'bg-sky-500/10 dark:bg-sky-950/60 border-sky-200/40 dark:border-sky-900/40',
      count: stats?.pages ?? pageCount,
      label: 'Pages',
      description: 'Total document pages',
    },
    {
      id: 'summary',
      icon: FiFile,
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-500/10 dark:bg-emerald-950/60 border-emerald-200/40 dark:border-emerald-900/40',
      count: stats?.summaryCount ?? 1,
      label: 'Summary',
      description: 'AI-generated summary',
    },
    {
      id: 'topics',
      icon: FiTag,
      iconColor: 'text-indigo-600 dark:text-indigo-400',
      bgColor: 'bg-indigo-500/10 dark:bg-indigo-950/60 border-indigo-200/40 dark:border-indigo-900/40',
      count: stats?.keyTopicsCount ?? 0,
      label: 'Key Topics',
      description: 'Main topics identified',
    },
    {
      id: 'dates',
      icon: FiCalendar,
      iconColor: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-500/10 dark:bg-amber-950/60 border-amber-200/40 dark:border-amber-900/40',
      count: stats?.datesCount ?? 0,
      label: 'Important Dates',
      description: 'Dates and timelines',
    },
    {
      id: 'financials',
      icon: FiDollarSign,
      iconColor: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-500/10 dark:bg-orange-950/60 border-orange-200/40 dark:border-orange-900/40',
      count: stats?.financialsCount ?? 0,
      label: 'Financial Figures',
      description: 'Key financial numbers',
    },
    {
      id: 'risks',
      icon: FiAlertTriangle,
      iconColor: 'text-rose-600 dark:text-rose-400',
      bgColor: 'bg-rose-500/10 dark:bg-rose-950/60 border-rose-200/40 dark:border-rose-900/40',
      count: stats?.risksCount ?? 0,
      label: 'Potential Risks',
      description: 'Risks and warnings',
    },
    {
      id: 'entities',
      icon: FiUsers,
      iconColor: 'text-sky-600 dark:text-sky-400',
      bgColor: 'bg-sky-500/10 dark:bg-sky-950/60 border-sky-200/40 dark:border-sky-900/40',
      count: stats?.entitiesCount ?? 0,
      label: 'Organizations / People',
      description: 'Entities and individuals',
    },
    {
      id: 'clauses',
      icon: FiShield,
      iconColor: 'text-violet-600 dark:text-violet-400',
      bgColor: 'bg-violet-500/10 dark:bg-violet-950/60 border-violet-200/40 dark:border-violet-900/40',
      count: stats?.clausesCount ?? 0,
      label: 'Important Clauses',
      description: 'Key clauses found',
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-xs text-indigo-600 dark:text-indigo-400 font-mono font-bold">✦</span>
        <div>
          <h2 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
            Document Overview
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            AI-generated insights from your document
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-3.5">
        {cards.map((card) => (
          <div
            key={card.id}
            onClick={() => onCardClick?.(card.id)}
            className="glass-card glass-card-hover p-3.5 sm:p-4 rounded-2xl cursor-pointer group flex flex-col justify-between transition-all"
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-xl ${card.bgColor} ${card.iconColor} flex items-center justify-center border shadow-2xs group-hover:scale-105 transition-transform flex-shrink-0`}
              >
                <card.icon className="text-sm" />
              </div>
              <div className="min-w-0">
                <p className="text-lg sm:text-xl font-black font-display text-slate-900 dark:text-white tracking-tight tabular-nums leading-none">
                  {card.count}
                </p>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate mt-0.5">
                  {card.label}
                </p>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-2.5 truncate">
              {card.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
