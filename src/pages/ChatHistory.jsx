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

// Fallback history matching reference screenshots if backend is empty
const defaultHistory = [
  {
    id: 201,
    docName: 'Analytics_Architecture_Spec.pdf',
    question: 'Summarise the ingestion pipeline in the architecture spec.',
    answer:
      'Events are published to a durable queue, validated and enriched in a streaming worker, then batch-loaded into warehouse tables partitioned by event_date.',
    askedAt: '2026-08-04T10:00:00Z',
  },
  {
    id: 202,
    docName: 'Vendor_Agreement_2028.pdf',
    question: 'Summarise the key risks in the vendor agreement.',
    answer:
      'Key risks include SLA breach penalties, data transfer restrictions to non-EU jurisdictions, and indemnification caps limited to 12 months fees.',
    askedAt: '2026-07-21T14:30:00Z',
  },
  {
    id: 203,
    docName: 'Q3_Investor_Update.pdf',
    question: 'What was the YoY growth rate in Q3?',
    answer:
      'Revenue grew 34% YoY with gross margins reaching 72% driven by enterprise expansion.',
    askedAt: '2026-07-29T09:15:00Z',
  },
];

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
    if (selectedDocId) {
      setLoading(true);
      getChatHistory(selectedDocId)
        .then((res) => {
          if (isCancelled) return;
          const items = (res.data || []).map((item) => ({
            id: item.id,
            docName: documents.find((d) => String(d.id) === String(selectedDocId))?.fileName || 'Document',
            question: item.question,
            answer: (item.answer || '')
              .replace(/^\[?Document QA Answer\]?:?\s*/i, '')
              .replace(/^\[?AI Answer\]?:?\s*/i, '')
              .replace(/^Answer:\s*/i, ''),
            askedAt: item.askedAt,
          }));
          setHistory(items);
        })
        .catch((err) => {
          if (isCancelled) return;
          console.error(err);
          setHistory([]);
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
          to="/chat"
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
            className="w-full pl-9 pr-3.5 py-2.5 bg-white dark:bg-[#141B2D] border border-slate-200/80 dark:border-[#1E293B] rounded-2xl text-xs font-medium text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
          />
        </div>

        {documents.length > 0 && (
          <select
            value={selectedDocId}
            onChange={(e) => setSelectedDocId(e.target.value)}
            className="px-3.5 py-2.5 bg-white dark:bg-[#141B2D] border border-slate-200/80 dark:border-[#1E293B] rounded-2xl text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="">All documents</option>
            {documents.map((doc) => (
              <option key={doc.id} value={doc.id}>
                {doc.fileName}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* History Cards List */}
      {loading ? (
        <ListSkeleton rows={4} />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={FiClock}
          title="No history found"
          description="Ask questions in the AI Chat page to record Q&A logs."
        />
      ) : (
        <div className="space-y-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-3xl bg-white dark:bg-[#141B2D] border border-slate-200/80 dark:border-[#1E293B] shadow-xs space-y-3 transition-all hover:border-indigo-300 dark:hover:border-indigo-900/60"
            >
              {/* Card Top Metadata */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40">
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
                  onClick={() => navigate('/chat')}
                  className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  <span>Continue in chat</span>
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
