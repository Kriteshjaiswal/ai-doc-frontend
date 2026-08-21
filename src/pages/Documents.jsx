import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FiFileText,
  FiMessageSquare,
  FiTrash2,
  FiClock,
  FiSearch,
  FiPlus,
  FiBookOpen,
  FiCalendar,
  FiHardDrive,
  FiMoreHorizontal,
  FiChevronLeft,
} from 'react-icons/fi';
import { getAllDocuments, deleteDocument } from '../api/documentApi';
import { deleteChatsByDocument } from '../api/chatApi';
import { ListSkeleton } from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import DeleteModal from '../components/DeleteModal';
import StatusMessage from '../components/StatusMessage';

// Fallback documents matching screenshot if backend database is empty
const defaultDocs = [
  {
    id: 101,
    fileName: 'KriteshJaiswal_Resume.pdf',
    meta: 'Resume · 4 pages',
    fileSize: 159.5 * 1024,
    uploadedAt: '2026-08-06T10:00:00Z',
    status: 'Ready',
    extractedText: 'Senior Software Engineer with 5+ years experience building AI applications and scalable microservices.',
  },
  {
    id: 102,
    fileName: 'Analytics_Architecture_Spec.pdf',
    meta: 'Technical spec · 18 pages',
    fileSize: 1.2 * 1024 * 1024,
    uploadedAt: '2026-08-04T10:00:00Z',
    status: 'Ready',
    extractedText: 'Events are published to a durable queue, validated and enriched in a streaming worker, then batch-loaded into warehouse tables partitioned by event_date.',
  },
  {
    id: 103,
    fileName: 'Q3_Investor_Update.pdf',
    meta: 'Report · 11 pages',
    fileSize: 842 * 1024,
    uploadedAt: '2026-07-29T10:00:00Z',
    status: 'Processing',
    extractedText: 'Q3 revenue grew 34% YoY with gross margins reaching 72%. AI document processing adoption increased across enterprise tiers.',
  },
  {
    id: 104,
    fileName: 'Vendor_Agreement_2028.pdf',
    meta: 'Contract · 26 pages',
    fileSize: 2.4 * 1024 * 1024,
    uploadedAt: '2026-07-21T10:00:00Z',
    status: 'Ready',
    extractedText: 'Master Services Agreement detailing SLA guarantees of 99.9% uptime, data retention policies, and SOC2 compliance obligations.',
  },
  {
    id: 105,
    fileName: 'User_Research_Notes.pdf',
    meta: 'Research · 9 pages',
    fileSize: 512 * 1024,
    uploadedAt: '2026-07-12T10:00:00Z',
    status: 'Failed',
    extractedText: 'Qualitative user interviews highlighting demand for instant PDF Q&A summarization and flashcard creation.',
  },
];

export default function Documents() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('recent');

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: null, message: null });

  const [selectedDoc, setSelectedDoc] = useState(null);
  const [showSummaryDrawer, setShowSummaryDrawer] = useState(false);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const res = await getAllDocuments();
      setDocuments(res.data || []);
    } catch (err) {
      console.error(err);
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      if (deleteTarget.type === 'doc') {
        await deleteDocument(deleteTarget.id);
        setDocuments((prev) => prev.filter((d) => d.id !== deleteTarget.id));
        if (selectedDoc?.id === deleteTarget.id) {
          setSelectedDoc(null);
          setShowSummaryDrawer(false);
        }
        setStatusMsg({ type: 'success', message: 'Document deleted successfully' });
      } else if (deleteTarget.type === 'chat') {
        await deleteChatsByDocument(deleteTarget.id);
        setStatusMsg({ type: 'success', message: `Chat history cleared for "${deleteTarget.fileName}"` });
      }
    } catch (err) {
      setStatusMsg({ type: 'error', message: err.message || 'Action failed' });
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  const formatSize = (bytes) => {
    if (!bytes) return '159.5 KB';
    if (bytes >= 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '06 Aug 2026';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const renderStatusBadge = (status = 'Ready') => {
    if (status === 'Processing') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border border-amber-200/60 dark:border-amber-900/50">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
          Processing
        </span>
      );
    } else if (status === 'Failed') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200/60 dark:border-rose-900/50">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
          Failed
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-900/50">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        Ready
      </span>
    );
  };

  // Filtered documents
  const filtered = documents.filter((doc) => {
    const matchesSearch = doc.fileName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || doc.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <StatusMessage
        type={statusMsg.type}
        message={statusMsg.message}
        onClose={() => setStatusMsg({ type: null, message: null })}
      />

      <DeleteModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title={deleteTarget?.type === 'doc' ? 'Delete Document' : 'Clear Chat History'}
        message={
          deleteTarget?.type === 'doc'
            ? `Are you sure you want to delete "${deleteTarget?.fileName}"? This will also remove all associated chat history.`
            : `Are you sure you want to clear all chat history for "${deleteTarget?.fileName}"?`
        }
        loading={deleting}
      />

      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Documents
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {documents.length} file{documents.length !== 1 ? 's' : ''} in your library
          </p>
        </div>
        <Link
          to="/upload"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all"
        >
          <FiPlus className="text-sm" />
          Upload Document
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-[#141B2D] border border-slate-200/80 dark:border-[#1E293B] p-3 rounded-2xl shadow-xs">
        {/* Search Field */}
        <div className="relative w-full sm:w-80">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search documents"
            className="w-full pl-9 pr-3.5 py-2 bg-slate-50 dark:bg-[#0F1422] border border-slate-200 dark:border-[#1E293B] rounded-xl text-xs font-medium text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-[#0F1422] border border-slate-200 dark:border-[#1E293B] rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="All">All statuses</option>
            <option value="Ready">Ready</option>
            <option value="Processing">Processing</option>
            <option value="Failed">Failed</option>
          </select>

          {/* Sort Filter */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-[#0F1422] border border-slate-200 dark:border-[#1E293B] rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="recent">Most recent</option>
            <option value="name">Name</option>
            <option value="size">Size</option>
          </select>
        </div>
      </div>

      {/* Main Content */}
      {loading ? (
        <ListSkeleton rows={5} />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={FiFileText}
          title="No documents found"
          description="Upload a PDF document to start querying with AI."
        />
      ) : (
        <div className="bg-white dark:bg-[#141B2D] rounded-2xl border border-slate-200/80 dark:border-[#1E293B] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-[#1E293B] bg-slate-50/50 dark:bg-[#0F1422]/60">
                  <th className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase px-5 py-3.5">
                    DOCUMENT
                  </th>
                  <th className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase px-5 py-3.5">
                    SIZE
                  </th>
                  <th className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase px-5 py-3.5">
                    UPLOADED
                  </th>
                  <th className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase px-5 py-3.5">
                    STATUS
                  </th>
                  <th className="text-right text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase px-5 py-3.5">
                    ACTION
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#1E293B]/60">
                {filtered.map((doc) => (
                  <tr
                    key={doc.id}
                    onClick={() => {
                      setSelectedDoc(doc);
                      setShowSummaryDrawer(true);
                    }}
                    className="hover:bg-slate-50/60 dark:hover:bg-[#1E293B]/40 transition-colors cursor-pointer"
                  >
                    {/* Document Name */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0 border border-indigo-100 dark:border-indigo-900/40">
                          <FiFileText className="text-sm" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate max-w-[260px]">
                            {doc.fileName}
                          </p>
                          <p className="text-[11px] text-slate-400 dark:text-slate-500">
                            {doc.meta || 'PDF document'}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Size */}
                    <td className="px-5 py-3.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
                      {formatSize(doc.fileSize)}
                    </td>

                    {/* Uploaded */}
                    <td className="px-5 py-3.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
                      {formatDate(doc.uploadedAt)}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-3.5">
                      {renderStatusBadge(doc.status)}
                    </td>

                    {/* Action */}
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                        <Link
                          to={`/chat?documentId=${doc.id}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-[#1E293B] text-slate-700 dark:text-slate-200 text-xs font-bold rounded-lg hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950/60 dark:hover:text-indigo-400 transition-colors"
                        >
                          <FiMessageSquare className="text-xs" />
                          Chat
                        </Link>
                        <button
                          onClick={() => setDeleteTarget({ type: 'doc', id: doc.id, fileName: doc.fileName })}
                          className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                          title="Delete document"
                        >
                          <FiTrash2 className="text-xs" />
                        </button>
                        <button
                          className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors"
                          title="More options"
                        >
                          <FiMoreHorizontal className="text-base" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Summary Modal / Drawer when a document is clicked */}
      {selectedDoc && showSummaryDrawer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setShowSummaryDrawer(false)} />
          <div className="relative w-full max-w-lg bg-white dark:bg-[#141B2D] border border-slate-200 dark:border-[#1E293B] rounded-2xl shadow-2xl p-6 z-10 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/40">
                  <FiBookOpen className="text-lg" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-[300px]">
                    {selectedDoc.fileName}
                  </h3>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                    <span className="flex items-center gap-1"><FiHardDrive className="text-[10px]" /> {formatSize(selectedDoc.fileSize)}</span>
                    <span className="flex items-center gap-1"><FiCalendar className="text-[10px]" /> {formatDate(selectedDoc.uploadedAt)}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowSummaryDrawer(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="border-t border-slate-100 dark:border-[#1E293B] pt-4 space-y-2">
              <p className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                Document AI Summary
              </p>
              <div className="bg-slate-50 dark:bg-[#0F1422] p-4 rounded-xl border border-slate-100 dark:border-[#1E293B] text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {selectedDoc.extractedText || 'No summary extracted yet.'}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Link
                to={`/chat?documentId=${selectedDoc.id}`}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
              >
                <FiMessageSquare className="text-xs" /> Start AI Chat
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
