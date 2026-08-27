import { useState, useEffect } from 'react';
import {
  FiBookOpen,
  FiPlus,
  FiTrash2,
  FiClock,
  FiFileText,
  FiMaximize2,
  FiMinimize2,
} from 'react-icons/fi';
import { addDocumentNote, deleteDocumentNote, getDocumentNotes } from '../../api/documentApi';
import MarkdownRenderer from '../MarkdownRenderer';

export default function DocumentNotesTab({
  documentId,
  notes = [],
  onUpdateNotes,
  onSelectPage,
}) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [page, setPage] = useState('1');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (documentId && notes.length === 0) {
      getDocumentNotes(documentId)
        .then((res) => {
          if (res.data && res.data.length > 0) {
            onUpdateNotes?.(res.data);
          }
        })
        .catch((err) => console.error('Failed to load notes:', err));
    }
  }, [documentId]);

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    try {
      setSaving(true);
      const newNote = {
        title: title.trim(),
        content: content.trim(),
        page: parseInt(page, 10) || 1,
      };
      const res = await addDocumentNote(documentId, newNote);
      onUpdateNotes?.(res.data || []);
      setTitle('');
      setContent('');
      setShowAddForm(false);
    } catch (err) {
      console.error('Failed to add note:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      const res = await deleteDocumentNote(documentId, noteId);
      onUpdateNotes?.(res.data || []);
    } catch (err) {
      console.error('Failed to delete note:', err);
    }
  };

  return (
    <div className="space-y-5">
      {/* Tab Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center border border-orange-200/40 dark:border-orange-900/40">
            <FiBookOpen className="text-sm" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
              Document Notes & Saved Chats
            </h3>
            <p className="text-xs text-slate-400">
              {notes.length} note{notes.length !== 1 ? 's' : ''} saved for this document
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddForm((prev) => !prev)}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
        >
          <FiPlus className="text-sm" />
          <span>{showAddForm ? 'Cancel' : 'Add Note'}</span>
        </button>
      </div>

      {/* Add Note Form */}
      {showAddForm && (
        <form
          onSubmit={handleAddNote}
          className="glass-card p-5 rounded-2xl border border-indigo-200 dark:border-indigo-900/60 shadow-md space-y-3 animate-in fade-in duration-150"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold uppercase text-slate-400 font-mono mb-1">
                Note Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Key Observations on Chapter 2"
                className="w-full px-3 py-2 bg-white dark:bg-[#141B2D] border border-slate-200/80 dark:border-[#1E293B] rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-400 font-mono mb-1">
                Linked Page
              </label>
              <input
                type="number"
                min="1"
                value={page}
                onChange={(e) => setPage(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-[#141B2D] border border-slate-200/80 dark:border-[#1E293B] rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase text-slate-400 font-mono mb-1">
              Note Content (Markdown supported)
            </label>
            <textarea
              rows="4"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your observations, questions, or key findings..."
              className="w-full px-3 py-2 bg-white dark:bg-[#141B2D] border border-slate-200/80 dark:border-[#1E293B] rounded-xl text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 resize-none font-sans"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-100 rounded-lg cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs disabled:opacity-50 cursor-pointer"
            >
              {saving ? 'Saving...' : 'Save Note'}
            </button>
          </div>
        </form>
      )}

      {/* Notes List */}
      {notes.length === 0 ? (
        <div className="glass-card p-10 rounded-2xl text-center space-y-2">
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            No notes created yet for this document.
          </p>
          <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
            You can add notes manually, or click <strong className="text-orange-500">"Save to Note"</strong> on any Ask Document Q&A response to save questions and answers here with full formatting.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {notes.map((n) => (
            <div
              key={n.id}
              className="glass-card p-5 rounded-2xl border border-slate-200/80 dark:border-[#1E293B] space-y-3.5 shadow-2xs hover:shadow-xs transition-shadow"
            >
              {/* Note Header */}
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100 dark:border-[#1E293B]">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-orange-500/10 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center flex-shrink-0">
                    <FiBookOpen className="text-xs" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                      {n.title}
                    </h4>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {n.page && (
                    <button
                      onClick={() => onSelectPage?.(n.page)}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 font-mono font-bold text-[11px] border border-indigo-200/60 dark:border-indigo-900/50 hover:bg-indigo-100 transition-colors cursor-pointer"
                      title={`Jump to Page ${n.page}`}
                    >
                      <FiFileText className="text-[10px]" />
                      <span>Page {n.page}</span>
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteNote(n.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                    title="Delete Note"
                  >
                    <FiTrash2 className="text-xs" />
                  </button>
                </div>
              </div>

              {/* Rich Markdown Note Content */}
              <div className="text-xs sm:text-[13px] text-slate-700 dark:text-slate-300 leading-relaxed overflow-x-auto">
                <MarkdownRenderer content={n.content} onSelectPage={onSelectPage} />
              </div>

              {/* Note Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-[#1E293B] text-[11px] text-slate-400">
                {n.page ? (
                  <button
                    onClick={() => onSelectPage?.(n.page)}
                    className="text-[10px] font-mono font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                  >
                    View in Document Preview (Page {n.page})
                  </button>
                ) : (
                  <span />
                )}
                <span className="flex items-center gap-1 font-mono text-[10px]">
                  <FiClock className="text-[10px]" />
                  Saved
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
