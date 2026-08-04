import { ThreeDSpinner } from './ThreeDLoader';

export function StatSkeleton({ count = 2 }) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-${count} gap-5`}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 animate-pulse perspective-800"
        >
          <div className="preserve-3d">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
              <div className="space-y-2 flex-1">
                <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-24" />
                <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-16" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function ListSkeleton({ rows = 3 }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-center py-8">
        <div className="flex flex-col items-center gap-4">
          <ThreeDSpinner size="lg" />
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider animate-pulse">
            Loading data...
          </p>
        </div>
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 flex items-center justify-between animate-pulse"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-slate-200 dark:bg-slate-800 rounded-xl" />
            <div className="space-y-2">
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-48" />
              <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-24" />
            </div>
          </div>
          <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-16" />
        </div>
      ))}
    </div>
  );
}

export function CardSkeleton({ count = 6 }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center py-6">
        <div className="flex flex-col items-center gap-3">
          <ThreeDSpinner size="lg" />
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider animate-pulse">
            Loading documents...
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 animate-pulse"
          >
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 bg-slate-200 dark:bg-slate-800 rounded-xl flex-shrink-0" />
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
                <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
              </div>
            </div>
            <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
