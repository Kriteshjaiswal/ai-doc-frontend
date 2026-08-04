import { FiCheckCircle, FiAlertCircle, FiX } from 'react-icons/fi';

export default function StatusMessage({ type, message, onClose }) {
  if (!type || !message) return null;

  const isSuccess = type === 'success';

  return (
    <div
      className={`fixed top-20 right-4 sm:right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border animate-slide-in backdrop-blur-md ${
        isSuccess
          ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20 dark:bg-emerald-950/80 dark:border-emerald-800'
          : 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20 dark:bg-rose-950/80 dark:border-rose-800'
      }`}
    >
      {isSuccess ? (
        <FiCheckCircle className="text-emerald-500 text-lg flex-shrink-0" />
      ) : (
        <FiAlertCircle className="text-rose-500 text-lg flex-shrink-0" />
      )}
      <p className="text-xs font-semibold">{message}</p>
      {onClose && (
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-current transition-colors ml-2"
        >
          <FiX className="text-sm" />
        </button>
      )}
    </div>
  );
}
