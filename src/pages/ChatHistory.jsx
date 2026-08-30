import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiClock,
  FiSearch,
  FiMessageSquare,
  FiTrash2,
  FiPlus,
  FiChevronRight,
  FiFileText,
} from 'react-icons/fi';
import { getAllDocuments } from '../api/documentApi';
import { getChatHistory, deleteChat, deleteChatsByDocument } from '../api/chatApi';
import { ListSkeleton } from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import DeleteModal from '../components/DeleteModal';
import StatusMessage from '../components/StatusMessage';
import CustomDropdown from '../components/CustomDropdown';

export default function ChatHistory() {
  const [documents, setDocuments] = useState([]);
  const [selectedDocId, setSelectedDocId] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [status, setStatus] = useState({ type: null, message: null });
  const navigate = useNavigate();

  useEffect(() => {
    fetchDocuments();
  }, []);

  useEffect(() => {
    let isCancelled = false;
    setLoading(true);
    getChatHistory(selectedDocId || undefined)
      .then((res) => {
        if (isCancelled) return;
        const dataList = res.data || [];
        if (dataList.length > 0) {
          const items = dataList.map((item) => ({
            id: item.id,
            documentId: item.documentId,
            docName:
              documents.find((d) => String(d.id) === String(item.documentId))?.fileName ||
              (selectedDocId ? documents.find((d) => String(d.id) === String(selectedDocId))?.fileName : null) ||
              'Document',
            question: item.question,
            answer: (item.answer || '')
              .replace(/^\[?Document QA Answer\]?:?\s*/i, '')
              .replace(/^\[?AI Answer\]?:?\s*/i, '')
              .replace(/^Answer:\s*/i, ''),
            askedAt: item.askedAt,
          }));
          setHistory(items);
        } else {
          setHistory([]);
        }
      })
      .catch((err) => {
        if (isCancelled) return;
        console.error('Error fetching chat history:', err);
        setHistory([]);
      })
      .finally(() => {
        if (!isCancelled) setLoading(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [selectedDocId, documents]);

  const fetchDocuments = async () => {
    try {
      const res = await getAllDocuments();
      setDocuments(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      if (deleteTarget.type === 'single') {
        await deleteChat(deleteTarget.id);
        setHistory((prev) => prev.filter((item) => item.id !== deleteTarget.id));
        setStatus({ type: 'success', message: 'Chat log deleted' });
      } else if (deleteTarget.type === 'all') {
        await deleteChatsByDocument(deleteTarget.documentId);
        setHistory([]);
        setStatus({ type: 'success', message: 'All chat history cleared' });
      }
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Delete failed' });
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  const filtered = history.filter(
    (item) =>
      item.question.toLowerCase().includes(search.toLowerCase()) ||
      item.answer.toLowerCase().includes(search.toLowerCase()) ||
      item.docName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <StatusMessage
        type={status.type}
        message={status.message}
        onClose={() => setStatus({ type: null, message: null })}
      />

      <DeleteModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Chat Item"
        message="Are you sure you want to delete this chat conversation log?"
        loading={deleting}
      />

      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            History
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Previous Q&A logs across your documents
          </p>
        </div>

        <Link
          to={documents?.[0] ? `/documents/${documents[0].id}/chat` : '/documents'}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all"
        >
          <FiPlus className="text-sm" />
          New conversation
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
          <input
            type="text"
            placeholder="Search questions or documents"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2.5 glass-card rounded-2xl text-xs font-medium text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
          />
        </div>

        {documents.length > 0 && (
          <CustomDropdown
            value={selectedDocId}
            onChange={setSelectedDocId}
            options={[
              { value: '', label: 'All documents' },
              ...documents.map((doc) => ({
                value: doc.id,
                label: doc.fileName,
              })),
            ]}
            placeholder="All documents"
            menuWidth="w-72 sm:w-80"
            align="right"
          />
        )}
      </div>

      {/* History Cards List */}
      {loading ? (
        <ListSkeleton rows={4} />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={FiClock}
          title="No history found"
          description="Ask questions in any document's Chat tab to record Q&A logs."
        />
      ) : (
        <div className="space-y-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="glass-card glass-card-hover p-5 rounded-3xl space-y-3"
            >
              {/* Card Top Metadata */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200/40 dark:border-indigo-900/40">
                    <FiFileText className="text-xs" />
                    {item.docName}
                  </span>
                  <span className="text-[11px] text-slate-400 dark:text-slate-500">
                    {new Date(item.askedAt).toLocaleDateString()}
                  </span>
                </div>

                <button
                  onClick={() => setDeleteTarget({ type: 'single', id: item.id })}
                  className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg transition-colors"
                  title="Delete log"
                >
                  <FiTrash2 className="text-xs" />
                </button>
              </div>

              {/* Question */}
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                {item.question}
              </p>

              {/* Answer snippet */}
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">
                {item.answer}
              </p>

              {/* Continue in chat button */}
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => navigate(item.documentId ? `/documents/${item.documentId}/chat` : '/documents')}
                  className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  <span>Continue in document chat</span>
                  <FiChevronRight className="text-xs" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
