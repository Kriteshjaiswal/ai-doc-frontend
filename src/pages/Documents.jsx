import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiFileText, FiMessageSquare, FiTrash2, FiClock } from 'react-icons/fi';
import { getAllDocuments, deleteDocument } from '../api/documentApi';
import { deleteChatsByDocument } from '../api/chatApi';
import { CardSkeleton } from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import DeleteModal from '../components/DeleteModal';
import StatusMessage from '../components/StatusMessage';

export default function Documents() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [status, setStatus] = useState({ type: null, message: null });

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const res = await getAllDocuments();
      setDocuments(res.data || []);
    } catch (err) {
      setStatus({ type: 'error', message: err.message });
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
        setStatus({ type: 'success', message: 'Document and its chat history deleted successfully' });
      } else if (deleteTarget.type === 'chat') {
        await deleteChatsByDocument(deleteTarget.id);
        setStatus({ type: 'success', message: `Chat history cleared for "${deleteTarget.fileName}"` });
      }
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Action failed' });
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

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
        onConfirm={handleDelete}
        title={deleteTarget?.type === 'doc' ? 'Delete Document' : 'Clear Chat History'}
        message={
          deleteTarget?.type === 'doc'
            ? `Are you sure you want to delete "${deleteTarget?.fileName}"? This will also remove all associated chat history.`
            : `Are you sure you want to clear all chat history for "${deleteTarget?.fileName}"?`
        }
        loading={deleting}
      />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Documents</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage your document collection and chat histories
          </p>
        </div>
        <Link
          to="/upload"
          className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-indigo-500/20"
        >
          Upload New
        </Link>
      </div>

      {loading ? (
        <CardSkeleton count={6} />
      ) : documents.length === 0 ? (
        <EmptyState
          icon={FiFileText}
          title="No documents uploaded yet"
          description="Upload a PDF document to start querying with AI."
          action={
            <Link
              to="/upload"
              className="px-4 py-2.5 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-500/20"
            >
              Upload Document
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm hover:border-indigo-500/40 dark:hover:border-indigo-800/60 card-3d perspective-800 flex flex-col justify-between"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 bg-rose-50 dark:bg-rose-950/50 rounded-xl flex items-center justify-center flex-shrink-0 border border-rose-100 dark:border-rose-900/50">
                  <FiFileText className="text-rose-500 text-base" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate" title={doc.fileName}>
                    {doc.fileName}
                  </h3>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                    {(doc.fileSize / 1024).toFixed(1)} KB •{' '}
                    {new Date(doc.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                <div className="flex gap-2">
                  <Link
                    to={`/chat?documentId=${doc.id}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-indigo-950/60 text-blue-600 dark:text-indigo-400 text-xs font-bold rounded-lg hover:bg-blue-100 dark:hover:bg-indigo-900/80 transition-colors"
                  >
                    <FiMessageSquare className="text-xs" />
                    Chat
                  </Link>
                  <button
                    onClick={() => setDeleteTarget({ type: 'chat', id: doc.id, fileName: doc.fileName })}
                    className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 text-xs font-semibold rounded-lg hover:bg-amber-50 hover:text-amber-700 dark:hover:bg-amber-950/40 dark:hover:text-amber-300 transition-colors"
                    title="Clear chat history for this document"
                  >
                    <FiClock className="text-xs" />
                    Clear Chat
                  </button>
                </div>
                <button
                  onClick={() => setDeleteTarget({ type: 'doc', id: doc.id, fileName: doc.fileName })}
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors"
                  title="Delete document"
                >
                  <FiTrash2 className="text-xs" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
