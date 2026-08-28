import { useEffect } from 'react';
import { FiCheckCircle, FiAlertCircle, FiAlertTriangle, FiInfo, FiX } from 'react-icons/fi';

export default function StatusMessage({ type, message, onClose, duration = 4000 }) {
  useEffect(() => {
    if (!type || !message || !onClose || duration <= 0) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [type, message, onClose, duration]);

  if (!type || !message) return null;

  const getConfig = () => {
    switch (type) {
      case 'success':
        return {
          icon: <FiCheckCircle className="text-emerald-500 text-lg flex-shrink-0" />,
          container:
            'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20 dark:bg-emerald-950/80 dark:border-emerald-800 shadow-emerald-500/10',
        };
      case 'warning':
        return {
          icon: <FiAlertTriangle className="text-amber-500 text-lg flex-shrink-0" />,
          container:
            'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20 dark:bg-amber-950/80 dark:border-amber-800 shadow-amber-500/10',
        };
      case 'info':
        return {
          icon: <FiInfo className="text-cyan-500 text-lg flex-shrink-0" />,
          container:
            'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-500/20 dark:bg-cyan-950/80 dark:border-cyan-800 shadow-cyan-500/10',
        };
      case 'error':
      default:
        return {
          icon: <FiAlertCircle className="text-rose-500 text-lg flex-shrink-0" />,
          container:
            'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20 dark:bg-rose-950/80 dark:border-rose-800 shadow-rose-500/10',
        };
    }
  };

  const config = getConfig();

  return (
    <div
      role="alert"
      className={`fixed top-20 right-4 sm:right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border animate-slide-in backdrop-blur-md max-w-[90vw] sm:max-w-md ${config.container}`}
    >
      {config.icon}
      <p className="text-xs font-semibold flex-1 leading-snug">{message}</p>
      {onClose && (
        <button
          onClick={onClose}
          aria-label="Dismiss alert"
          className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 text-current transition-colors ml-2 cursor-pointer flex-shrink-0"
        >
          <FiX className="text-sm" />
        </button>
      )}
    </div>
  );
}

