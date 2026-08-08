import { useState, useEffect } from 'react';
import { FiClock, FiSearch, FiMessageSquare, FiChevronDown, FiChevronUp, FiTrash2 } from 'react-icons/fi';
import { getAllDocuments } from '../api/documentApi';
import { getChatHistory, deleteChat, deleteChatsByDocument } from '../api/chatApi';
import { ListSkeleton } from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import DeleteModal from '../components/DeleteModal';
import StatusMessage from '../components/StatusMessage';

export default function ChatHistory() {
  const [documents, setDocuments] = useState([]);
  const [selectedDocId, setSelectedDocId] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [docsLoading, setDocsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState({});
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [status, setStatus] = useState({ type: null, message: null });

  useEffect(() => {
    fetchDocuments();
  }, []);

  useEffect(() => {
    let isCancelled = false;
    if (selectedDocId) {
      setLoading(true);
      getChatHistory(selectedDocId)
        .then((res) => {
          if (isCancelled) return;
          setHistory(res.data || []);
        })
        .catch((err) => {
          if (isCancelled) return;
          console.error(err);
        })
        .finally(() => {
          if (!isCancelled) setLoading(false);
        });
    } else {
      setHistory([]);
    }
    return () => {
      isCancelled = true;
    };
  }, [selectedDocId]);

  const fetchDocuments = async () => {
    try {
      const res = await getAllDocuments();
      setDocuments(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setDocsLoading(false);
    }
  };

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      if (deleteTarget.type === 'single') {
        await deleteChat(deleteTarget.id);
        setHistory((prev) => prev.filter((item) => item.id !== deleteTarget.id));
        setStatus({ type: 'success', message: 'Chat history entry deleted' });
      } else if (deleteTarget.type === 'all') {
        await deleteChatsByDocument(deleteTarget.documentId);
        setHistory([]);
        setStatus({ type: 'success', message: 'All chat history cleared for document' });
      }
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Failed to delete chat history' });
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  const selectedDocName = documents.find((d) => String(d.id) === String(selectedDocId))?.fileName;

  const filtered = history.filter(
    (item) =>
      item.question.toLowerCase().includes(search.toLowerCase()) ||
      item.answer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <StatusMessage
        type={status.type}
        message={status.message}
        onClose={() => setStatus({ type: null, message: null })}
      />

      <DeleteModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title={deleteTarget?.type === 'all' ? 'Clear All History' : 'Delete Chat Item'}
        message={
          deleteTarget?.type === 'all'
            ? `Are you sure you want to clear all chat history for "${selectedDocName || 'this document'}"? This action cannot be undone.`
            : `Are you sure you want to delete this chat conversation?`
        }
        loading={deleting}
      />

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Chat History</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Review and manage past AI conversations by document
          </p>
        </div>
        {selectedDocId && history.length > 0 && (
          <button
            onClick={() => setDeleteTarget({ type: 'all', documentId: Number(selectedDocId) })}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 dark:hover:bg-rose-900/60 rounded-xl transition-colors border border-rose-200/60 dark:border-rose-900/50"
          >
            <FiTrash2 className="text-sm" />
            Clear All History
          </button>
        )}
      </div>

      {/* Filters Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <select
          value={selectedDocId}
          onChange={(e) => setSelectedDocId(e.target.value)}
          className="flex-1 px-3.5 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
        >
          <option value="">Select a document to inspect history...</option>
          {documents.map((doc) => (
            <option key={doc.id} value={doc.id}>
              {doc.fileName}
            </option>
          ))}
        </select>

        {selectedDocId && (
          <div className="relative">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-64 pl-9 pr-3.5 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>
        )}
      </div>

      {/* Main Content Area */}
      {!selectedDocId ? (
        <EmptyState
          icon={FiClock}
          title="Select a document"
          description="Choose a document from the dropdown above to inspect its saved chat history."
        />
      ) : loading ? (
        <ListSkeleton rows={4} />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={FiMessageSquare}
          title={search ? 'No matching conversations' : 'No chat history'}
          description={
            search
              ? 'Try a different search query.'
              : 'Start asking questions with this document in the AI Chat page.'
          }
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-sm card-3d perspective-800"
            >
              <div className="flex items-center justify-between px-5 py-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                <button
                  onClick={() => toggleExpand(item.id)}
                  className="flex-1 flex items-center gap-3.5 min-w-0 text-left"
                >
                  <div className="w-9 h-9 bg-indigo-50 dark:bg-indigo-950/60 rounded-xl flex items-center justify-center flex-shrink-0 border border-indigo-100 dark:border-indigo-900/50">
                    <FiMessageSquare className="text-indigo-600 dark:text-indigo-400 text-sm" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                      {item.question}
                    </p>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                      {new Date(item.askedAt).toLocaleString()}
                    </p>
                  </div>
                </button>

                <div className="flex items-center gap-2 ml-3 flex-shrink-0">
                  <button
                    onClick={() => setDeleteTarget({ type: 'single', id: item.id })}
                    className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                    title="Delete this chat"
                  >
                    <FiTrash2 className="text-sm" />
                  </button>
                  <button
                    onClick={() => toggleExpand(item.id)}
                    className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors"
                  >
                    {expanded[item.id] ? (
                      <FiChevronUp className="text-sm" />
                    ) : (
                      <FiChevronDown className="text-sm" />
                    )}
                  </button>
                </div>
              </div>

              {expanded[item.id] && (
                <div className="px-5 pb-5 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-900/40">
                  <div className="mt-4 space-y-3">
                    <div className="bg-indigo-50/70 dark:bg-indigo-950/40 rounded-xl p-3.5 border border-indigo-100/60 dark:border-indigo-900/30">
                      <p className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">
                        Question
                      </p>
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{item.question}</p>
                    </div>
                    <div className="bg-white dark:bg-slate-800/60 rounded-xl p-3.5 border border-slate-200/60 dark:border-slate-700/60">
                      <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
                        AI Answer
                      </p>
                      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">{item.answer}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
