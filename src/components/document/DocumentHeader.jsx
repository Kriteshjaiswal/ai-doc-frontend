import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiArrowLeft,
  FiFileText,
  FiEdit2,
  FiMessageSquare,
  FiRepeat,
  FiMoreHorizontal,
  FiDownload,
  FiRefreshCw,
  FiTrash2,
  FiCheck,
  FiX,
} from 'react-icons/fi';

export default function DocumentHeader({
  document,
  onRename,
  onReanalyze,
  onDownload,
  onDelete,
  onOpenChat,
  onOpenCompare,
  reanalyzing = false,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(document?.fileName || '');
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const menuRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    setEditedName(document?.fileName || '');
  }, [document?.fileName]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMoreMenu(false);
      }
    };
    window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSaveRename = (e) => {
    e.preventDefault();
    if (editedName.trim() && editedName.trim() !== document?.fileName) {
      onRename(editedName.trim());
    }
    setIsEditing(false);
  };

  const formatSize = (bytes) => {
    if (!bytes) return '0 KB';
    if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Recently';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const pageCount = document?.pageCount || document?.analysis?.pageCount || 1;

  return (
    <div className="space-y-4">
      {/* Back to Documents Link */}
      <div>
        <Link
          to="/documents"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors group"
        >
          <FiArrowLeft className="text-xs group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Documents</span>
        </Link>
      </div>

      {/* Main Header Row */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Left: Document Icon & Title & Metadata */}
        <div className="flex items-start sm:items-center gap-3.5 min-w-0">
          {/* PDF Coral Badge */}
          <div className="w-11 h-11 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-500 dark:text-rose-400 flex items-center justify-center border border-rose-200/60 dark:border-rose-900/50 shadow-xs flex-shrink-0">
            <FiFileText className="text-xl" />
          </div>

          <div className="min-w-0 space-y-1">
            {/* Title / Rename Field */}
            {isEditing ? (
              <form onSubmit={handleSaveRename} className="flex items-center gap-1.5 max-w-md">
                <input
                  ref={inputRef}
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="px-2.5 py-1 text-base sm:text-lg font-bold text-slate-900 dark:text-white bg-white dark:bg-[#141B2D] border border-indigo-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                />
                <button
                  type="submit"
                  className="p-1.5 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
                  title="Save"
                >
                  <FiCheck className="text-xs" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditedName(document?.fileName || '');
                    setIsEditing(false);
                  }}
                  className="p-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-200 hover:bg-slate-300 transition-colors"
                  title="Cancel"
                >
                  <FiX className="text-xs" />
                </button>
              </form>
            ) : (
              <div className="flex items-center gap-2 group flex-wrap">
                <h1 className="text-lg sm:text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight truncate max-w-xl">
                  {document?.fileName || 'Document Overview'}
                </h1>
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-1 rounded-md text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors opacity-80 hover:opacity-100"
                  title="Rename document"
                  aria-label="Rename document"
                >
                  <FiEdit2 className="text-sm" />
                </button>
              </div>
            )}

            {/* Dynamic Metadata Subtitle */}
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5 flex-wrap">
              <span>Uploaded on {formatDate(document?.uploadedAt)}</span>
              <span>•</span>
              <span>{formatSize(document?.fileSize)}</span>
              <span>•</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {pageCount} page{pageCount !== 1 ? 's' : ''}
              </span>
            </p>
          </div>
        </div>

        {/* Right: Header Action Buttons */}
        <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
          {/* Ask Document Button */}
          <button
            onClick={onOpenChat}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white dark:bg-[#141B2D] border border-slate-200/90 dark:border-[#1E293B] text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-200 dark:hover:border-indigo-900/60 text-xs font-bold rounded-xl shadow-2xs transition-all active:scale-98"
          >
            <FiMessageSquare className="text-sm text-indigo-600 dark:text-indigo-400" />
            <span>Ask Document</span>
          </button>

          {/* Compare Button */}
          <button
            onClick={onOpenCompare}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white dark:bg-[#141B2D] border border-slate-200/90 dark:border-[#1E293B] text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-200 dark:hover:border-indigo-900/60 text-xs font-bold rounded-xl shadow-2xs transition-all active:scale-98"
          >
            <FiRepeat className="text-sm text-slate-400" />
            <span>Compare</span>
          </button>

          {/* More Actions Menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowMoreMenu((prev) => !prev)}
              className="p-2 rounded-xl bg-white dark:bg-[#141B2D] border border-slate-200/90 dark:border-[#1E293B] text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white shadow-2xs transition-colors"
              title="More actions"
              aria-label="More actions"
            >
              <FiMoreHorizontal className="text-base" />
            </button>

            {/* Dropdown Menu */}
            {showMoreMenu && (
              <div className="absolute right-0 mt-1.5 w-48 rounded-2xl bg-white dark:bg-[#141B2D] border border-slate-200/90 dark:border-[#1E293B] shadow-xl dark:shadow-black/60 p-1.5 z-40 space-y-0.5 animate-in fade-in zoom-in-95 duration-100">
                <button
                  onClick={() => {
                    setShowMoreMenu(false);
                    onReanalyze();
                  }}
                  disabled={reanalyzing}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl transition-colors text-left disabled:opacity-50"
                >
                  <FiRefreshCw className={`text-xs ${reanalyzing ? 'animate-spin' : ''}`} />
                  <span>{reanalyzing ? 'Re-analyzing...' : 'Re-analyze Document'}</span>
                </button>

                <button
                  onClick={() => {
                    setShowMoreMenu(false);
                    onDownload();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#1E293B] rounded-xl transition-colors text-left"
                >
                  <FiDownload className="text-xs" />
                  <span>Download PDF</span>
                </button>

                <button
                  onClick={() => {
                    setShowMoreMenu(false);
                    setIsEditing(true);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#1E293B] rounded-xl transition-colors text-left"
                >
                  <FiEdit2 className="text-xs" />
                  <span>Rename File</span>
                </button>

                <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />

                <button
                  onClick={() => {
                    setShowMoreMenu(false);
                    onDelete();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors text-left"
                >
                  <FiTrash2 className="text-xs" />
                  <span>Delete Document</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
