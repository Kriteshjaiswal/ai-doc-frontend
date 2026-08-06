import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiFileText, FiMessageSquare, FiTrash2, FiClock, FiChevronLeft, FiBookOpen, FiCalendar, FiHardDrive, FiAlignLeft } from 'react-icons/fi';
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
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [mobileShowSummary, setMobileShowSummary] = useState(false);

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
        if (selectedDoc?.id === deleteTarget.id) {
          setSelectedDoc(null);
          setMobileShowSummary(false);
        }
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

  const handleDocClick = (doc) => {
    setSelectedDoc(doc);
    setMobileShowSummary(true);
  };

  const handleBackToList = () => {
    setMobileShowSummary(false);
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
            Manage your document collection and view AI-generated 3-4 line summaries
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
        <>
          {/* Desktop: Split Panel Layout */}
          <div className="hidden md:flex gap-5 h-[calc(100vh-16rem)]">
            {/* Left Panel — Document List */}
            <div className="w-[40%] flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-sm">
              <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/30">
                <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  {documents.length} Document{documents.length !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    onClick={() => handleDocClick(doc)}
                    className={`p-4 rounded-xl cursor-pointer transition-all border ${
                      selectedDoc?.id === doc.id
                        ? 'bg-indigo-50/80 dark:bg-indigo-950/50 border-indigo-300 dark:border-indigo-700 shadow-sm'
                        : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800/40 hover:border-slate-200 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 border ${
                        selectedDoc?.id === doc.id
                          ? 'bg-indigo-100 dark:bg-indigo-900/60 border-indigo-200 dark:border-indigo-800/60'
                          : 'bg-rose-50 dark:bg-rose-950/50 border-rose-100 dark:border-rose-900/50'
                      }`}>
                        <FiFileText className={`text-sm ${
                          selectedDoc?.id === doc.id
                            ? 'text-indigo-600 dark:text-indigo-400'
                            : 'text-rose-500'
                        }`} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate" title={doc.fileName}>
                          {doc.fileName}
                        </h3>
                        <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                          {(doc.fileSize / 1024).toFixed(1)} KB • {new Date(doc.uploadedAt).toLocaleDateString()}
                        </p>
                        {doc.extractedText && (
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-1.5 font-normal leading-relaxed">
                            {doc.extractedText}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/50">
                      <Link
                        to={`/chat?documentId=${doc.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-1 px-2.5 py-1.5 bg-blue-50 dark:bg-indigo-950/60 text-blue-600 dark:text-indigo-400 text-[11px] font-bold rounded-lg hover:bg-blue-100 dark:hover:bg-indigo-900/80 transition-colors"
                      >
                        <FiMessageSquare className="text-[10px]" /> Chat
                      </Link>
                      <button
                        onClick={(e) => { e.stopPropagation(); setDeleteTarget({ type: 'chat', id: doc.id, fileName: doc.fileName }); }}
                        className="flex items-center gap-1 px-2 py-1.5 bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 text-[11px] font-semibold rounded-lg hover:bg-amber-50 hover:text-amber-700 dark:hover:bg-amber-950/40 dark:hover:text-amber-300 transition-colors"
                      >
                        <FiClock className="text-[10px]" /> Clear Chat
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); setDeleteTarget({ type: 'doc', id: doc.id, fileName: doc.fileName }); }}
                        className="ml-auto p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors"
                        title="Delete document"
                      >
                        <FiTrash2 className="text-xs" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Panel — Document Summary */}
            <div className="w-[60%] bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-sm flex flex-col">
              {selectedDoc ? (
                <>
                  {/* Summary Header */}
                  <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/30">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-950/60 rounded-xl flex items-center justify-center border border-indigo-100 dark:border-indigo-900/50">
                        <FiBookOpen className="text-indigo-600 dark:text-indigo-400 text-base" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">
                          {selectedDoc.fileName}
                        </h2>
                        <div className="flex items-center gap-3 mt-0.5 text-[11px] text-slate-400 dark:text-slate-500">
                          <span className="flex items-center gap-1"><FiHardDrive className="text-[10px]" /> {(selectedDoc.fileSize / 1024).toFixed(1)} KB</span>
                          <span className="flex items-center gap-1"><FiCalendar className="text-[10px]" /> {new Date(selectedDoc.uploadedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <Link
                        to={`/chat?documentId=${selectedDoc.id}`}
                        className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-indigo-500/20"
                      >
                        <FiMessageSquare className="text-xs" /> Ask AI
                      </Link>
                    </div>
                  </div>

                  {/* Summary Content */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    <h3 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                      <FiAlignLeft className="text-sm" /> AI-Generated Summary (Backend extracted_text)
                    </h3>

                    {selectedDoc.extractedText ? (
                      <div className="bg-gradient-to-br from-slate-50 to-indigo-50/30 dark:from-slate-800/40 dark:to-indigo-950/20 rounded-2xl p-5 border border-slate-200/60 dark:border-slate-700/50 shadow-inner space-y-3">
                        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold text-xs mb-1">
                          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                          <span>3-4 Line AI Summary</span>
                        </div>
                        <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium whitespace-pre-wrap">
                          {selectedDoc.extractedText}
                        </p>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <FiFileText className="text-3xl text-slate-300 dark:text-slate-700 mx-auto mb-2" />
                        <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold">No summary available</p>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center space-y-3">
                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto border border-slate-200 dark:border-slate-700">
                      <FiBookOpen className="text-2xl text-slate-400 dark:text-slate-500" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-600 dark:text-slate-300">Select a document</h3>
                    <p className="text-xs text-slate-400 dark:text-slate-500 max-w-xs">
                      Click on a document in the left panel to view its AI summary saved in the database.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile: Toggle between list and summary */}
          <div className="md:hidden">
            {!mobileShowSummary ? (
              /* Mobile Document List */
              <div className="grid grid-cols-1 gap-4">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm hover:border-indigo-500/40 dark:hover:border-indigo-800/60 card-3d perspective-800 flex flex-col justify-between"
                  >
                    <div className="flex items-start gap-3 mb-3" onClick={() => handleDocClick(doc)} role="button" tabIndex={0}>
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
                        {doc.extractedText && (
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 font-normal">
                            {doc.extractedText}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDocClick(doc)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-bold rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/80 transition-colors"
                        >
                          <FiBookOpen className="text-xs" />
                          Summary
                        </button>
                        <Link
                          to={`/chat?documentId=${doc.id}`}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-xs font-bold rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/80 transition-colors"
                        >
                          <FiMessageSquare className="text-xs" />
                          Chat
                        </Link>
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
            ) : selectedDoc ? (
              /* Mobile Document Summary */
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
                {/* Back button header */}
                <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/30 flex items-center gap-3">
                  <button
                    onClick={handleBackToList}
                    className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <FiChevronLeft className="text-lg" />
                  </button>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">
                      {selectedDoc.fileName}
                    </h2>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500">
                      {(selectedDoc.fileSize / 1024).toFixed(1)} KB • {new Date(selectedDoc.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Summary Content */}
                <div className="p-5 space-y-3">
                  <h3 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                    AI Summary (extracted_text column)
                  </h3>

                  {selectedDoc.extractedText ? (
                    <div className="bg-slate-50 dark:bg-slate-800/40 rounded-xl p-4 border border-slate-100 dark:border-slate-800/60">
                      <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium whitespace-pre-wrap">
                        {selectedDoc.extractedText}
                      </p>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <FiFileText className="text-2xl text-slate-300 dark:text-slate-700 mx-auto mb-2" />
                      <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold">No summary available</p>
                    </div>
                  )}
                </div>

                {/* Action buttons */}
                <div className="px-5 pb-5 flex gap-3">
                  <Link
                    to={`/chat?documentId=${selectedDoc.id}`}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-indigo-500/20"
                  >
                    <FiMessageSquare className="text-sm" /> Chat with this document
                  </Link>
                </div>
              </div>
            ) : null}
          </div>
        </>
      )}
    </div>
  );
}
