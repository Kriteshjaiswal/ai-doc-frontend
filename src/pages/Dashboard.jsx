import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiFileText, FiMessageSquare, FiUpload, FiArrowRight, FiZap, FiClock } from 'react-icons/fi';
import { getAllDocuments } from '../api/documentApi';
import { StatSkeleton, ListSkeleton } from '../components/LoadingSkeleton';

export default function Dashboard() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getAllDocuments();
      setDocuments(res.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Dashboard</h1>
        <StatSkeleton count={2} />
        <ListSkeleton rows={3} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 p-6 sm:p-8 text-white shadow-xl shadow-indigo-500/10 card-3d">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-blue-100 border border-white/20">
            <FiZap className="text-amber-300" />
            <span>AI Document Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome to DocQ&A
          </h1>
          <p className="text-sm text-blue-100/90 leading-relaxed">
            Upload your PDF files and start asking AI questions instantly. Get accurate summaries, deep insights, and instant answers.
          </p>
          <div className="pt-2 flex gap-3 flex-wrap">
            <Link
              to="/upload"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-blue-600 hover:bg-blue-50 text-xs font-bold rounded-xl shadow-lg transition-transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <FiUpload className="text-sm" />
              Upload PDF
            </Link>
            <Link
              to="/chat"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/15 hover:bg-white/25 text-white text-xs font-bold rounded-xl backdrop-blur-md transition-colors"
            >
              <FiMessageSquare className="text-sm" />
              Start Chatting
            </Link>
          </div>
        </div>

        {/* Decorative background glow circles */}
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 right-24 w-48 h-48 bg-indigo-400/20 rounded-full blur-xl pointer-events-none" />
      </div>

      {error && (
        <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 px-4 py-3 rounded-2xl text-xs font-semibold">
          {error}
        </div>
      )}

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm card-3d perspective-800">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950/60 rounded-2xl flex items-center justify-center border border-blue-100 dark:border-blue-900/50">
              <FiFileText className="text-blue-600 dark:text-blue-400 text-xl" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Total Uploaded Documents
              </span>
              <p className="text-3xl font-black text-slate-900 dark:text-white mt-0.5">
                {documents.length}
              </p>
            </div>
          </div>
        </div>

        <Link
          to="/chat"
          className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-sm hover:border-indigo-500/50 card-3d perspective-800 flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950/60 rounded-2xl flex items-center justify-center border border-indigo-100 dark:border-indigo-900/50">
              <FiMessageSquare className="text-indigo-600 dark:text-indigo-400 text-xl" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Interactive AI Assistant
              </span>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                Ask questions & query document insights →
              </p>
            </div>
          </div>
        </Link>
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          to="/upload"
          className="flex items-center gap-3 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 hover:border-blue-500/50 hover:bg-blue-50/40 dark:hover:bg-slate-800/50 card-3d perspective-800 group"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-105 transition-transform">
            <FiUpload className="text-lg" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">Upload Document</span>
            <span className="text-[11px] text-slate-400 dark:text-slate-500">Add new PDF files</span>
          </div>
        </Link>

        <Link
          to="/documents"
          className="flex items-center gap-3 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 hover:border-blue-500/50 hover:bg-blue-50/40 dark:hover:bg-slate-800/50 card-3d perspective-800 group"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-105 transition-transform">
            <FiFileText className="text-lg" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">Manage Documents</span>
            <span className="text-[11px] text-slate-400 dark:text-slate-500">View file library</span>
          </div>
        </Link>

        <Link
          to="/history"
          className="flex items-center gap-3 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 hover:border-blue-500/50 hover:bg-blue-50/40 dark:hover:bg-slate-800/50 card-3d perspective-800 group"
        >
          <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-950/50 flex items-center justify-center text-violet-600 dark:text-violet-400 group-hover:scale-105 transition-transform">
            <FiClock className="text-lg" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">Chat History</span>
            <span className="text-[11px] text-slate-400 dark:text-slate-500">Previous Q&A logs</span>
          </div>
        </Link>
      </div>

      {/* Recent Documents Table */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">Recent Documents</h2>
          {documents.length > 0 && (
            <Link
              to="/documents"
              className="text-xs font-bold text-blue-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              View all <FiArrowRight className="text-xs" />
            </Link>
          )}
        </div>

        {documents.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-8 text-center">
            <FiFileText className="text-3xl text-slate-300 dark:text-slate-700 mx-auto mb-2" />
            <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold">No documents uploaded yet</p>
            <Link
              to="/upload"
              className="inline-block mt-3 text-xs text-blue-600 dark:text-indigo-400 font-bold hover:underline"
            >
              Upload your first document
            </Link>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                    <th className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase px-5 py-3.5">
                      File Name
                    </th>
                    <th className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase px-5 py-3.5 hidden sm:table-cell">
                      File Size
                    </th>
                    <th className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase px-5 py-3.5">
                      Uploaded Date
                    </th>
                    <th className="text-right text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase px-5 py-3.5">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {documents.slice(0, 5).map((doc) => (
                    <tr
                      key={doc.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-rose-50 dark:bg-rose-950/50 rounded-xl flex items-center justify-center flex-shrink-0 border border-rose-100 dark:border-rose-900/50">
                            <FiFileText className="text-rose-500 text-sm" />
                          </div>
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate max-w-[200px]">
                            {doc.fileName}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-xs text-slate-500 dark:text-slate-400 hidden sm:table-cell">
                        {(doc.fileSize / 1024).toFixed(1)} KB
                      </td>
                      <td className="px-5 py-3.5 text-xs text-slate-500 dark:text-slate-400">
                        {new Date(doc.uploadedAt).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <Link
                          to={`/chat?documentId=${doc.id}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-indigo-950/60 text-blue-600 dark:text-indigo-400 text-xs font-bold rounded-lg hover:bg-blue-100 dark:hover:bg-indigo-900/80 transition-colors"
                        >
                          <FiMessageSquare className="text-xs" />
                          Chat
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
