import { useState, useEffect } from 'react';
import { FiBookmark, FiPlus, FiTrash2, FiArrowRight } from 'react-icons/fi';
import { addDocumentBookmark, deleteDocumentBookmark, getDocumentBookmarks } from '../../api/documentApi';

export default function DocumentBookmarksTab({
  documentId,
  bookmarks = [],
  currentPage = 1,
  pageCount = 1,
  onUpdateBookmarks,
  onSelectPage,
}) {
  const [label, setLabel] = useState('');
  const [page, setPage] = useState(currentPage);
  const [saving, setSaving] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    if (documentId && bookmarks.length === 0) {
      getDocumentBookmarks(documentId)
        .then((res) => {
          if (res.data && res.data.length > 0) {
            onUpdateBookmarks?.(res.data);
          }
        })
        .catch((err) => console.error('Failed to load bookmarks:', err));
    }
  }, [documentId]);

  const handleAddBookmark = async (e) => {
    e.preventDefault();
    if (!label.trim()) return;

    try {
      setSaving(true);
      const newBm = {
        label: label.trim(),
        page: parseInt(page, 10) || 1,
        snippet: `Bookmarked section on Page ${page}`,
      };
      const res = await addDocumentBookmark(documentId, newBm);
      onUpdateBookmarks?.(res.data || []);
      setLabel('');
      setShowAddForm(false);
    } catch (err) {
      console.error('Failed to add bookmark:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteBookmark = async (bmId) => {
    try {
      const res = await deleteDocumentBookmark(documentId, bmId);
      onUpdateBookmarks?.(res.data || []);
    } catch (err) {
      console.error('Failed to delete bookmark:', err);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center border border-violet-200/40 dark:border-violet-900/40">
            <FiBookmark className="text-sm" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
              Document Bookmarks
            </h3>
            <p className="text-xs text-slate-400">
              {bookmarks.length} saved page bookmark{bookmarks.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setPage(currentPage);
            setShowAddForm((prev) => !prev);
          }}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs"
        >
          <FiPlus className="text-sm" />
          <span>{showAddForm ? 'Cancel' : 'Bookmark Page'}</span>
        </button>
      </div>

      {/* Add Bookmark Form */}
      {showAddForm && (
        <form
          onSubmit={handleAddBookmark}
          className="glass-card p-4 rounded-2xl border border-indigo-200 dark:border-indigo-900/60 shadow-md space-y-3 animate-in fade-in duration-150"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold uppercase text-slate-400 font-mono mb-1">
                Bookmark Label
              </label>
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="e.g. Key Liability Clause Section"
                className="w-full px-3 py-2 bg-white dark:bg-[#141B2D] border border-slate-200/80 dark:border-[#1E293B] rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-400 font-mono mb-1">
                Page (1 - {pageCount})
              </label>
              <input
                type="number"
                min="1"
                max={pageCount}
                value={page}
                onChange={(e) => setPage(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-[#141B2D] border border-slate-200/80 dark:border-[#1E293B] rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Bookmark'}
            </button>
          </div>
        </form>
      )}

      {/* Bookmarks List */}
      {bookmarks.length === 0 ? (
        <div className="glass-card p-10 rounded-2xl text-center space-y-2">
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            No bookmarks created yet.
          </p>
          <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
            Bookmark important pages to quickly jump back to them in the Document Preview panel.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {bookmarks.map((bm) => (
            <div
              key={bm.id}
              onClick={() => onSelectPage?.(bm.page)}
              className="glass-card glass-card-hover p-3.5 sm:p-4 rounded-2xl flex items-center justify-between gap-3 cursor-pointer group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center font-mono text-xs font-bold flex-shrink-0">
                  p.{bm.page}
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                    {bm.label}
                  </h4>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">
                    Page {bm.page} of {pageCount}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteBookmark(bm.id);
                  }}
                  className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                  title="Delete Bookmark"
                >
                  <FiTrash2 className="text-xs" />
                </button>
                <FiArrowRight className="text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all text-xs" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
