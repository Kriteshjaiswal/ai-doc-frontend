import { FiAlertTriangle, FiX } from 'react-icons/fi';

export default function DeleteModal({ isOpen, onClose, onConfirm, title, message, loading }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 w-full max-w-md z-10 animate-slide-in">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-50 dark:bg-red-950/50 rounded-xl flex items-center justify-center border border-red-100 dark:border-red-900/50">
              <FiAlertTriangle className="text-red-500 text-xl" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">{title || 'Confirm Action'}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <FiX className="text-lg" />
          </button>
        </div>
        <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-6">
          {message || 'Are you sure you want to proceed with this action?'}
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors disabled:opacity-50 shadow-md shadow-red-500/20"
          >
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
