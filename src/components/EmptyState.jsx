export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="bg-white dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 sm:p-12 text-center transition-colors">
      {Icon && (
        <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-950/60 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-indigo-100 dark:border-indigo-900/50">
          <Icon className="text-2xl text-indigo-600 dark:text-indigo-400" />
        </div>
      )}
      <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-1">{title}</h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed mb-6">
        {description}
      </p>
      {action && <div>{action}</div>}
    </div>
  );
}
