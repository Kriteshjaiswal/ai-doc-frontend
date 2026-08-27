import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiFileText,
  FiMessageSquare,
  FiTrash2,
  FiSearch,
  FiPlus,
  FiEye,
  FiCompass,
  FiFilter,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
  FiLayers,
} from 'react-icons/fi';
import { getAllDocuments, deleteDocument } from '../api/documentApi';
import { deleteChatsByDocument } from '../api/chatApi';
import { ListSkeleton } from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import DeleteModal from '../components/DeleteModal';
import StatusMessage from '../components/StatusMessage';
import CustomDropdown from '../components/CustomDropdown';

export default function Documents() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('recent');

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: null, message: null });
  const navigate = useNavigate();

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
    if (!bytes) return '0 KB';
    if (bytes >= 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }
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

  const renderStatusBadge = (status = 'COMPLETED') => {
    if (status === 'PROCESSING') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border border-amber-200/60 dark:border-amber-900/50">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
          Analyzing
        </span>
      );
    } else if (status === 'FAILED') {
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
        Analyzed
      </span>
    );
  };

  // Filter & Sort
  const filtered = documents
    .filter((doc) => {
      const matchesSearch = (doc.fileName || '').toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === 'All' ||
        (statusFilter === 'Ready' && doc.analysisStatus === 'COMPLETED') ||
        doc.analysisStatus === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return (a.fileName || '').localeCompare(b.fileName || '');
      if (sortBy === 'size') return (b.fileSize || 0) - (a.fileSize || 0);
      return new Date(b.uploadedAt || 0) - new Date(a.uploadedAt || 0);
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
            ? `Are you sure you want to delete "${deleteTarget?.fileName}"? This will also remove all associated AI analysis and chat history.`
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
            {documents.length} document{documents.length !== 1 ? 's' : ''} in your workspace library
          </p>
        </div>
        <Link
          to="/upload"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-600/25 transition-all"
        >
          <FiPlus className="text-sm" />
          Upload Document
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 glass-card p-3.5 rounded-2xl shadow-xs">
        <div className="relative w-full sm:w-80">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search documents..."
            className="w-full pl-9 pr-3.5 py-2 bg-slate-50/80 dark:bg-black/20 border border-slate-200/80 dark:border-white/[0.08] rounded-xl text-xs font-medium text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <CustomDropdown
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { value: 'All', label: 'All statuses', icon: FiFilter },
              { value: 'COMPLETED', label: 'Analyzed', icon: FiCheckCircle },
              { value: 'PROCESSING', label: 'Analyzing', icon: FiClock },
              { value: 'FAILED', label: 'Failed', icon: FiAlertCircle },
            ]}
            placeholder="Status"
            menuWidth="w-48"
            searchable={false}
            align="right"
          />

          <CustomDropdown
            value={sortBy}
            onChange={setSortBy}
            options={[
              { value: 'recent', label: 'Most recent', icon: FiClock },
              { value: 'name', label: 'Name', icon: FiFileText },
              { value: 'size', label: 'Size', icon: FiLayers },
            ]}
            placeholder="Sort by"
            menuWidth="w-44"
            searchable={false}
            align="right"
          />
        </div>
      </div>

      {/* Main Content */}
      {loading ? (
        <ListSkeleton rows={5} />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={FiFileText}
          title="No documents in library"
          description="Upload a PDF file to generate automatic AI analysis, summaries, topics, and question-answering."
        />
      ) : (
        <>
          {/* Desktop & Tablet Table (md+) */}
          <div className="hidden md:block glass-card rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-white/[0.06] bg-slate-50/60 dark:bg-[#0c111e]/70">
                    <th className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase px-5 py-3.5">
                      DOCUMENT
                    </th>
                    <th className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase px-5 py-3.5">
                      SIZE
                    </th>
                    <th className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase px-5 py-3.5">
                      PAGES
                    </th>
                    <th className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase px-5 py-3.5">
                      UPLOADED
                    </th>
                    <th className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase px-5 py-3.5">
                      STATUS
                    </th>
                    <th className="text-right text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase px-5 py-3.5">
                      ACTIONS
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/[0.05]">
                  {filtered.map((doc) => (
                    <tr
                      key={doc.id}
                      onClick={() => navigate(`/documents/${doc.id}`)}
                      className="hover:bg-indigo-50/40 dark:hover:bg-indigo-950/30 transition-colors cursor-pointer group"
                    >
                      {/* Document Name */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-rose-500/10 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center flex-shrink-0 border border-rose-200/40 dark:border-rose-900/40">
                            <FiFileText className="text-sm" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate max-w-[280px]">
                              {doc.fileName}
                            </p>
                            <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate max-w-xs">
                              {doc.summary ? doc.summary.substring(0, 70) + '...' : 'PDF document'}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Size */}
                      <td className="px-5 py-3.5 text-xs text-slate-500 dark:text-slate-400 font-medium font-mono">
                        {formatSize(doc.fileSize)}
                      </td>

                      {/* Pages */}
                      <td className="px-5 py-3.5 text-xs text-slate-700 dark:text-slate-300 font-semibold font-mono">
                        {doc.pageCount || 1} pg{doc.pageCount !== 1 ? 's' : ''}
                      </td>

                      {/* Uploaded */}
                      <td className="px-5 py-3.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
                        {formatDate(doc.uploadedAt)}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-3.5">
                        {renderStatusBadge(doc.analysisStatus)}
                      </td>

                      {/* Actions */}
                      <td
                        className="px-5 py-3.5 text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            to={`/documents/${doc.id}`}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-bold rounded-lg hover:bg-indigo-600 hover:text-white transition-all shadow-2xs"
                            title="Open Overview"
                          >
                            <FiCompass className="text-xs" />
                            <span>Overview</span>
                          </Link>
                          <Link
                            to={`/documents/${doc.id}/chat`}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-lg hover:bg-slate-200 dark:hover:bg-white/20 transition-all shadow-2xs"
                            title="Open Chat"
                          >
                            <FiMessageSquare className="text-xs" />
                            <span>Chat</span>
                          </Link>
                          <button
                            onClick={() => setDeleteTarget({ type: 'doc', id: doc.id, fileName: doc.fileName })}
                            className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                            title="Delete document"
                          >
                            <FiTrash2 className="text-xs" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Document Cards (< md) */}
          <div className="md:hidden space-y-3">
            {filtered.map((doc) => (
              <div
                key={doc.id}
                onClick={() => navigate(`/documents/${doc.id}`)}
                className="glass-card glass-card-hover p-4 rounded-2xl space-y-3 cursor-pointer"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-rose-500/10 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center flex-shrink-0 border border-rose-200/40 dark:border-rose-900/40">
                      <FiFileText className="text-sm" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                        {doc.fileName}
                      </p>
                      <p className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">
                        {doc.pageCount || 1} pages • {formatSize(doc.fileSize)}
                      </p>
                    </div>
                  </div>
                  <div>{renderStatusBadge(doc.analysisStatus)}</div>
                </div>

                <div className="pt-2 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  <Link
                    to={`/documents/${doc.id}`}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl shadow-xs transition-all"
                  >
                    <FiCompass className="text-xs" />
                    <span>View Overview</span>
                  </Link>
                  <button
                    onClick={() => setDeleteTarget({ type: 'doc', id: doc.id, fileName: doc.fileName })}
                    className="p-2 text-slate-400 hover:text-rose-600 rounded-xl transition-colors border border-slate-200/80 dark:border-white/[0.08]"
                    title="Delete document"
                  >
                    <FiTrash2 className="text-xs" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
