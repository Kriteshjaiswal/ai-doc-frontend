import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FiFileText,
  FiMessageSquare,
  FiUpload,
  FiLayers,
  FiHelpCircle,
  FiArrowRight,
  FiZap,
  FiMoreHorizontal,
} from 'react-icons/fi';
import { getAllDocuments } from '../api/documentApi';
import { getChatHistory } from '../api/chatApi';
import { getFlashcards } from '../api/flashcardApi';
import { StatSkeleton, ListSkeleton } from '../components/LoadingSkeleton';

export default function Dashboard() {
  const [documents, setDocuments] = useState([]);
  const [chats, setChats] = useState([]);
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [docRes, chatRes, flashRes] = await Promise.allSettled([
        getAllDocuments(),
        getChatHistory(),
        getFlashcards(),
      ]);

      if (docRes.status === 'fulfilled') {
        setDocuments(docRes.value?.data || []);
      } else {
        setDocuments([]);
      }

      if (chatRes.status === 'fulfilled') {
        setChats(chatRes.value?.data || []);
      } else {
        setChats([]);
      }

      if (flashRes.status === 'fulfilled') {
        setFlashcards(flashRes.value?.data || []);
      } else {
        setFlashcards([]);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setDocuments([]);
      setChats([]);
      setFlashcards([]);
    } finally {
      setLoading(false);
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
    if (!dateStr) return 'Recent';
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

  if (loading) {
    return (
      <div className="space-y-6">
        <StatSkeleton count={4} />
        <ListSkeleton rows={4} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* -------------------------------------------------------------
         1. HERO BANNER
      ------------------------------------------------------------- */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 border bg-gradient-to-r from-[#cfd8f7] via-[#e5ecfc] to-[#f8faff] dark:from-[#171638] dark:via-[#1C1844] dark:to-[#161B3D] border-[#d0daf7] dark:border-indigo-900/30 shadow-xs">
        <div className="relative z-10 max-w-2xl space-y-3">
          {/* Eyebrow tag */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#dbe4fe] dark:bg-indigo-950/80 text-[11px] font-bold text-[#4f46e5] dark:text-indigo-300 border border-[#c7d3fd] dark:border-indigo-800/60">
            <FiZap className="text-[#4f46e5] dark:text-indigo-400 text-xs" />
            <span>AI DOCUMENT INTELLIGENCE</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0f172a] dark:text-white tracking-tight">
            Your documents, now searchable with AI.
          </h1>

          {/* Description */}
          <p className="text-xs sm:text-sm text-[#64748b] dark:text-slate-300 leading-relaxed">
            Upload documents, ask intelligent questions, generate summaries, and turn information into knowledge.
          </p>

          {/* CTA Buttons */}
          <div className="pt-3 flex items-center gap-3 flex-wrap">
            <Link
              to="/upload"
              className="inline-flex items-center justify-center px-4 py-2.5 bg-[#4f46e5] hover:bg-[#4338ca] text-white text-xs font-bold rounded-xl shadow-xs transition-all"
            >
              Upload Document
            </Link>
            <Link
              to="/chat"
              className="inline-flex items-center justify-center px-4 py-2.5 bg-white dark:bg-[#1E293B]/80 text-[#1e293b] dark:text-slate-200 border border-slate-200/90 dark:border-slate-700/80 hover:bg-slate-50 dark:hover:bg-[#1E293B] text-xs font-bold rounded-xl shadow-2xs transition-all"
            >
              Open AI Chat
            </Link>
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------------
         2. STAT CARDS (4 cards in one row on desktop)
      ------------------------------------------------------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1: Documents */}
        <div className="relative p-5 rounded-2xl bg-white dark:bg-[#141B2D] border border-slate-200/80 dark:border-[#1E293B] shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/40">
              <FiFileText className="text-base" />
            </div>
            <span className="text-[11px] font-bold text-slate-400 dark:text-slate-600 font-mono">
              01
            </span>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-black text-slate-900 dark:text-white">
              {documents.length}
            </p>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
              Documents
            </p>
            <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500 mt-1">
              {documents.length > 0 ? `${documents.length} active files` : 'No documents uploaded'}
            </p>
          </div>
        </div>

        {/* Stat 2: AI Conversations */}
        <div className="relative p-5 rounded-2xl bg-white dark:bg-[#141B2D] border border-slate-200/80 dark:border-[#1E293B] shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/40">
              <FiMessageSquare className="text-base" />
            </div>
            <span className="text-[11px] font-bold text-slate-400 dark:text-slate-600 font-mono">
              02
            </span>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-black text-slate-900 dark:text-white">
              {chats.length}
            </p>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
              AI Conversations
            </p>
            <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500 mt-1">
              {chats.length > 0 ? `${chats.length} turns recorded` : 'No conversations yet'}
            </p>
          </div>
        </div>

        {/* Stat 3: Flashcards */}
        <div className="relative p-5 rounded-2xl bg-white dark:bg-[#141B2D] border border-slate-200/80 dark:border-[#1E293B] shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/40">
              <FiLayers className="text-base" />
            </div>
            <span className="text-[11px] font-bold text-slate-400 dark:text-slate-600 font-mono">
              03
            </span>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-black text-slate-900 dark:text-white">
              {flashcards.length}
            </p>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
              Flashcards
            </p>
            <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500 mt-1">
              {flashcards.length > 0 ? `${flashcards.filter((f) => f.status === 'unseen' || f.status === 'learning').length} active to review` : 'No flashcards generated'}
            </p>
          </div>
        </div>

        {/* Stat 4: Questions Asked */}
        <div className="relative p-5 rounded-2xl bg-white dark:bg-[#141B2D] border border-slate-200/80 dark:border-[#1E293B] shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/40">
              <FiHelpCircle className="text-base" />
            </div>
            <span className="text-[11px] font-bold text-slate-400 dark:text-slate-600 font-mono">
              04
            </span>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-black text-slate-900 dark:text-white">
              {chats.length}
            </p>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
              Questions Asked
            </p>
            <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500 mt-1">
              {chats.length > 0 ? `${chats.length} queries asked` : 'No queries asked yet'}
            </p>
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------------
         3. QUICK ACTIONS (4 horizontal cards)
      ------------------------------------------------------------- */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
          Quick actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/upload"
            className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-[#141B2D] border border-slate-200/80 dark:border-[#1E293B] hover:border-indigo-300 dark:hover:border-indigo-800 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/40">
                <FiUpload className="text-base" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">Upload Document</p>
                <p className="text-[11px] text-slate-400 dark:text-slate-500">Add a new PDF</p>
              </div>
            </div>
            <FiArrowRight className="text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors text-sm" />
          </Link>

          <Link
            to="/chat"
            className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-[#141B2D] border border-slate-200/80 dark:border-[#1E293B] hover:border-indigo-300 dark:hover:border-indigo-800 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/40">
                <FiMessageSquare className="text-base" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">Ask AI</p>
                <p className="text-[11px] text-slate-400 dark:text-slate-500">Chat with your documents</p>
              </div>
            </div>
            <FiArrowRight className="text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors text-sm" />
          </Link>

          <Link
            to="/flashcards"
            className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-[#141B2D] border border-slate-200/80 dark:border-[#1E293B] hover:border-indigo-300 dark:hover:border-indigo-800 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/40">
                <FiLayers className="text-base" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">Create Flashcards</p>
                <p className="text-[11px] text-slate-400 dark:text-slate-500">Turn documents into revision</p>
              </div>
            </div>
            <FiArrowRight className="text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors text-sm" />
          </Link>

          <Link
            to="/documents"
            className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-[#141B2D] border border-slate-200/80 dark:border-[#1E293B] hover:border-indigo-300 dark:hover:border-indigo-800 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/40">
                <FiFileText className="text-base" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">View Documents</p>
                <p className="text-[11px] text-slate-400 dark:text-slate-500">Manage your library</p>
              </div>
            </div>
            <FiArrowRight className="text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors text-sm" />
          </Link>
        </div>
      </div>

      {/* -------------------------------------------------------------
         4. RECENT DOCUMENTS TABLE
      ------------------------------------------------------------- */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Recent documents
          </h2>
          <Link
            to="/documents"
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            View all <FiArrowRight className="text-xs" />
          </Link>
        </div>

        <div className="bg-white dark:bg-[#141B2D] rounded-2xl border border-slate-200/80 dark:border-[#1E293B] overflow-hidden shadow-xs">
          {documents.length === 0 ? (
            <div className="p-8 text-center space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/40 mx-auto">
                <FiFileText className="text-xl" />
              </div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">No documents uploaded yet</p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 max-w-xs mx-auto">Upload your first PDF document to start searching and asking questions with AI.</p>
              <div className="pt-1">
                <Link to="/upload" className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all">
                  <FiUpload className="text-xs" /> Upload Document
                </Link>
              </div>
            </div>
          ) : (
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
                  {documents.slice(0, 5).map((doc) => (
                    <tr
                      key={doc.id}
                      className="hover:bg-slate-50/60 dark:hover:bg-[#1E293B]/40 transition-colors"
                    >
                      {/* Document Info */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0 border border-indigo-100 dark:border-indigo-900/40">
                            <FiFileText className="text-sm" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate max-w-[240px]">
                              {doc.fileName}
                            </p>
                            <p className="text-[11px] text-slate-400 dark:text-slate-500">
                              {doc.meta || 'PDF document'}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* File Size */}
                      <td className="px-5 py-3.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
                        {formatSize(doc.fileSize)}
                      </td>

                      {/* Uploaded Date */}
                      <td className="px-5 py-3.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
                        {formatDate(doc.uploadedAt)}
                      </td>

                      {/* Status Badge */}
                      <td className="px-5 py-3.5">
                        {renderStatusBadge(doc.status)}
                      </td>

                      {/* Action Buttons */}
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/chat?documentId=${doc.id}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-[#1E293B] text-slate-700 dark:text-slate-200 text-xs font-bold rounded-lg hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950/60 dark:hover:text-indigo-400 transition-colors"
                          >
                            <FiMessageSquare className="text-xs" />
                            Chat
                          </Link>
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
          )}
        </div>
      </div>
    </div>
  );
}
