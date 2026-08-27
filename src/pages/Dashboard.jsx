import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FiFileText,
  FiMessageSquare,
  FiUpload,
  FiLayers,
  FiHelpCircle,
  FiArrowRight,
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

      if (docRes.status === 'fulfilled' && Array.isArray(docRes.value?.data)) {
        setDocuments(docRes.value.data);
      } else {
        setDocuments([]);
      }

      if (chatRes.status === 'fulfilled' && Array.isArray(chatRes.value?.data)) {
        setChats(chatRes.value.data);
      } else {
        setChats([]);
      }

      if (flashRes.status === 'fulfilled' && Array.isArray(flashRes.value?.data)) {
        setFlashcards(flashRes.value.data);
      } else {
        setFlashcards([]);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const displayDocs = documents;
  const docCount = documents.length;
  const chatCount = chats.length;
  const flashcardCount = flashcards.length;
  const questionCount = chats.length;

  const formatSize = (bytes) => {
    if (!bytes) return '17.1 KB';
    if (bytes >= 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '24 Aug 2026';
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
    <div className="space-y-6 sm:space-y-8">
      {/* ═══════════════════════════════════════════════════════════════
         1. HERO BANNER (Theme-Adaptive Light & Dark Grid + Lights Effect)
         ═══════════════════════════════════════════════════════════════ */}
      {/* ═══════════════════════════════════════════════════════════════
         1. HERO BANNER (Top-Tier SaaS Gradient Mesh & Soft Vector Grid)
         ═══════════════════════════════════════════════════════════════ */}
      <div className="relative rounded-3xl p-6 sm:p-8 lg:p-10 overflow-hidden transition-all bg-gradient-to-br from-white via-indigo-50/30 to-slate-100 dark:from-[#0d101e] dark:via-[#111528] dark:to-[#0a0d18] border border-slate-200/80 dark:border-white/[0.08] shadow-sm dark:shadow-2xl dark:shadow-black/60">
        {/* Top Accent Radiant Light Beam */}
        <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/50 dark:via-indigo-400/60 to-transparent pointer-events-none z-10" />

        {/* Ambient Gaussian Gradient Glow Flares */}
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 translate-x-1/6 w-[440px] h-[300px] bg-gradient-to-br from-indigo-500/20 via-purple-600/18 to-sky-500/10 dark:from-indigo-600/30 dark:via-purple-600/22 dark:to-indigo-900/10 rounded-full blur-[60px] pointer-events-none" />
        <div className="absolute -top-12 left-1/4 w-[280px] h-[180px] bg-indigo-400/10 dark:bg-purple-600/15 rounded-full blur-[55px] pointer-events-none" />

        {/* Professional Developer SVG Grid Pattern with Intersection Cross Dots & Radial Mask */}
        <div className="absolute inset-0 pointer-events-none [mask-image:radial-gradient(ellipse_80%_70%_at_68%_48%,#000_20%,transparent_90%)] -webkit-[mask-image:radial-gradient(ellipse_80%_70%_at_68%_48%,#000_20%,transparent_90%)]">
          <svg className="w-full h-full text-indigo-900/10 dark:text-indigo-300/[0.08]" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="pro-saas-grid" width="38" height="38" patternUnits="userSpaceOnUse">
                <path d="M 38 0 L 0 0 0 38" fill="none" stroke="currentColor" strokeWidth="1" />
                {/* Intersection Cross Dot */}
                <circle cx="38" cy="0" r="1" fill="currentColor" opacity="0.6" />
                <circle cx="0" cy="38" r="1" fill="currentColor" opacity="0.6" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#pro-saas-grid)" />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          {/* Left Content */}
          <div className="max-w-xl space-y-4">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 dark:bg-[#191d35]/90 text-[11px] font-bold text-indigo-700 dark:text-[#a5b4fc] border border-indigo-200/80 dark:border-indigo-500/30 shadow-xs backdrop-blur-md">
              <svg className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
              </svg>
              <span className="tracking-widest font-mono text-[10.5px]">AI DOCUMENT WORKSPACE</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-2xl sm:text-3xl lg:text-[34px] font-extrabold font-display tracking-tight leading-[1.2]">
              <span className="text-slate-900 dark:text-white">Turn your documents into </span>
              <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 dark:from-indigo-400 dark:via-purple-300 dark:to-indigo-200 bg-clip-text text-transparent">knowledge.</span>
            </h1>

            {/* Description */}
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300/90 leading-relaxed max-w-lg font-normal">
              Upload documents, ask intelligent questions, generate summaries, and transform information into actionable knowledge.
            </p>

            {/* CTA Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Link
                to="/upload"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-indigo-600/25 transition-all duration-200 active:scale-[0.98]"
              >
                <FiUpload className="text-sm" />
                <span>Upload Document</span>
              </Link>
              <Link
                to={documents?.[0] ? `/documents/${documents[0].id}/chat` : '/documents'}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white/90 hover:bg-white text-slate-700 dark:bg-white/5 dark:hover:bg-white/10 dark:text-slate-200 border border-slate-200/90 dark:border-white/10 text-xs font-semibold rounded-xl shadow-xs backdrop-blur-md transition-all duration-200 active:scale-[0.98]"
              >
                <FiMessageSquare className="text-sm text-slate-400" />
                <span>Ask Document</span>
              </Link>
            </div>
          </div>

          {/* Right Decorative 3-Tier Stacked Cards Mockup (Theme-Adaptive) */}
          <div className="hidden lg:flex items-center justify-center relative pr-4 flex-shrink-0">
            {/* Deepest Back Card 3 */}
            <div className="absolute -top-3 -left-5 w-64 sm:w-72 h-44 rounded-2xl bg-white/60 dark:bg-[#0e1324]/90 border border-slate-200/80 dark:border-slate-700/30 -rotate-6 shadow-xs pointer-events-none" />

            {/* Middle Card 2 */}
            <div className="absolute -top-1.5 -left-2.5 w-64 sm:w-72 h-44 rounded-2xl bg-white/80 dark:bg-[#111628]/95 border border-slate-200/90 dark:border-slate-700/45 -rotate-3 shadow-md pointer-events-none" />

            {/* Foreground Card 1 */}
            <div className="relative w-64 sm:w-72 p-5 rounded-2xl bg-white/95 dark:bg-[#151a2b] border border-slate-200/95 dark:border-slate-700/60 shadow-xl shadow-slate-200/50 dark:shadow-2xl dark:shadow-black/60 space-y-3.5 backdrop-blur-md">
              {/* Header Accent Bar */}
              <div className="w-28 h-2 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-[#6366f1] dark:to-[#818cf8]" />

              {/* 3 Placeholder Text Lines */}
              <div className="space-y-2 pt-0.5">
                <div className="w-full h-2.5 rounded-full bg-slate-200/80 dark:bg-[#242b44]" />
                <div className="w-4/5 h-2.5 rounded-full bg-slate-200/80 dark:bg-[#242b44]" />
                <div className="w-3/5 h-2.5 rounded-full bg-slate-200/80 dark:bg-[#242b44]" />
              </div>

              {/* Bottom AI Answer Tag */}
              <div className="pt-2">
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-[#212640] border border-indigo-200/90 dark:border-indigo-500/30 text-[11px] font-bold text-indigo-700 dark:text-[#9b9fed] shadow-2xs">
                  <svg className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
                  </svg>
                  <span>AI answer</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
         2. STAT CARDS (Glassmorphism & Interactive Hover)
         ═══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1: Documents */}
        <div className="glass-card glass-card-hover relative p-5 rounded-2xl flex flex-col justify-between group overflow-hidden">
          <div className="flex items-start justify-between relative z-10">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center border border-purple-200/40 dark:border-purple-900/50 shadow-xs group-hover:scale-110 transition-transform">
              <FiFileText className="text-base" />
            </div>
            <span className="text-[10.5px] font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 border border-purple-200/50 dark:border-purple-900/40 px-2 py-0.5 rounded-md font-mono">
              01
            </span>
          </div>
          <div className="mt-4 relative z-10">
            <p className="text-3xl font-black font-display text-slate-900 dark:text-white tracking-tight tabular-nums">
              {docCount}
            </p>
            <p className="text-xs font-bold text-slate-700 dark:text-slate-200 mt-1">
              Documents
            </p>
            <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500 mt-0.5">
              {docCount} active file{docCount !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Stat 2: AI Conversations */}
        <div className="glass-card glass-card-hover relative p-5 rounded-2xl flex flex-col justify-between group overflow-hidden">
          <div className="flex items-start justify-between relative z-10">
            <div className="w-9 h-9 rounded-xl bg-sky-500/10 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center border border-sky-200/40 dark:border-sky-900/50 shadow-xs group-hover:scale-110 transition-transform">
              <FiMessageSquare className="text-base" />
            </div>
            <span className="text-[10.5px] font-bold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60 border border-sky-200/50 dark:border-sky-900/40 px-2 py-0.5 rounded-md font-mono">
              02
            </span>
          </div>
          <div className="mt-4 relative z-10">
            <p className="text-3xl font-black font-display text-slate-900 dark:text-white tracking-tight tabular-nums">
              {chatCount}
            </p>
            <p className="text-xs font-bold text-slate-700 dark:text-slate-200 mt-1">
              AI Conversations
            </p>
            <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500 mt-0.5">
              {chatCount} turn{chatCount !== 1 ? 's' : ''} recorded
            </p>
          </div>
        </div>

        {/* Stat 3: Flashcards */}
        <div className="glass-card glass-card-hover relative p-5 rounded-2xl flex flex-col justify-between group overflow-hidden">
          <div className="flex items-start justify-between relative z-10">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-200/40 dark:border-emerald-900/50 shadow-xs group-hover:scale-110 transition-transform">
              <FiLayers className="text-base" />
            </div>
            <span className="text-[10.5px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/50 dark:border-emerald-900/40 px-2 py-0.5 rounded-md font-mono">
              03
            </span>
          </div>
          <div className="mt-4 relative z-10">
            <p className="text-3xl font-black font-display text-slate-900 dark:text-white tracking-tight tabular-nums">
              {flashcardCount}
            </p>
            <p className="text-xs font-bold text-slate-700 dark:text-slate-200 mt-1">
              Flashcards
            </p>
            <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500 mt-0.5">
              {flashcardCount} active to review
            </p>
          </div>
        </div>

        {/* Stat 4: Questions Asked */}
        <div className="glass-card glass-card-hover relative p-5 rounded-2xl flex flex-col justify-between group overflow-hidden">
          <div className="flex items-start justify-between relative z-10">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-200/40 dark:border-amber-900/50 shadow-xs group-hover:scale-110 transition-transform">
              <FiHelpCircle className="text-base" />
            </div>
            <span className="text-[10.5px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border border-amber-200/50 dark:border-amber-900/40 px-2 py-0.5 rounded-md font-mono">
              04
            </span>
          </div>
          <div className="mt-4 relative z-10">
            <p className="text-3xl font-black font-display text-slate-900 dark:text-white tracking-tight tabular-nums">
              {questionCount}
            </p>
            <p className="text-xs font-bold text-slate-700 dark:text-slate-200 mt-1">
              Questions Asked
            </p>
            <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500 mt-0.5">
              {questionCount} quer{questionCount !== 1 ? 'ies' : 'y'} asked
            </p>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
         3. QUICK ACTIONS (Glass Effect & Hover Micro-Interactions)
         ═══════════════════════════════════════════════════════════════ */}
      <div className="space-y-3">
        <h2 className="text-[11px] font-bold text-slate-500 dark:text-slate-400 font-mono uppercase tracking-widest">
          QUICK ACTIONS
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/upload"
            className="glass-card glass-card-hover flex items-center justify-between p-4 rounded-2xl group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/10 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-200/40 dark:border-indigo-900/50 group-hover:scale-110 transition-transform flex-shrink-0">
                <FiUpload className="text-base" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">Upload Document</p>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate">Add a new PDF</p>
              </div>
            </div>
            <FiArrowRight className="text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:translate-x-1 transition-all text-sm flex-shrink-0 ml-2" />
          </Link>

          <Link
            to={documents?.[0] ? `/documents/${documents[0].id}/chat` : '/documents'}
            className="glass-card glass-card-hover flex items-center justify-between p-4 rounded-2xl group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-sky-500/10 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center border border-sky-200/40 dark:border-sky-900/50 group-hover:scale-110 transition-transform flex-shrink-0">
                <FiMessageSquare className="text-base" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors truncate">Ask Document</p>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate">Chat directly with your active PDF</p>
              </div>
            </div>
            <FiArrowRight className="text-slate-400 group-hover:text-sky-600 dark:group-hover:text-sky-400 group-hover:translate-x-1 transition-all text-sm flex-shrink-0 ml-2" />
          </Link>

          <Link
            to="/flashcards"
            className="glass-card glass-card-hover flex items-center justify-between p-4 rounded-2xl group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-200/40 dark:border-emerald-900/50 group-hover:scale-110 transition-transform flex-shrink-0">
                <FiLayers className="text-base" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors truncate">Create Flashcards</p>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate">Turn documents into revision</p>
              </div>
            </div>
            <FiArrowRight className="text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 group-hover:translate-x-1 transition-all text-sm flex-shrink-0 ml-2" />
          </Link>

          <Link
            to="/documents"
            className="glass-card glass-card-hover flex items-center justify-between p-4 rounded-2xl group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-purple-500/10 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center border border-purple-200/40 dark:border-purple-900/50 group-hover:scale-110 transition-transform flex-shrink-0">
                <FiFileText className="text-base" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors truncate">View Documents</p>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate">Manage your library</p>
              </div>
            </div>
            <FiArrowRight className="text-slate-400 group-hover:text-purple-600 dark:group-hover:text-purple-400 group-hover:translate-x-1 transition-all text-sm flex-shrink-0 ml-2" />
          </Link>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
         4. RECENT DOCUMENTS SECTION (Glass Table & Mobile Cards)
         ═══════════════════════════════════════════════════════════════ */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-[11px] font-bold text-slate-500 dark:text-slate-400 font-mono uppercase tracking-widest">
            RECENT DOCUMENTS
          </h2>
          <Link
            to="/documents"
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 transition-colors font-sans"
          >
            <span>View all</span>
            <FiArrowRight className="text-xs" />
          </Link>
        </div>

        {/* Desktop & Tablet Table (md+) */}
        {displayDocs.length === 0 ? (
          <div className="glass-card p-8 rounded-2xl text-center space-y-2">
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              No recent documents uploaded yet.
            </p>
            <p className="text-[11px] text-slate-400">
              Upload a PDF to get started with AI document analysis.
            </p>
          </div>
        ) : (
          <>
            <div className="hidden md:block glass-card rounded-2xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-white/[0.06] bg-slate-50/60 dark:bg-[#0c111e]/70">
                      <th className="text-[10px] font-bold text-slate-400 dark:text-slate-500 font-mono uppercase tracking-wider px-5 py-3.5">
                        DOCUMENT
                      </th>
                      <th className="text-[10px] font-bold text-slate-400 dark:text-slate-500 font-mono uppercase tracking-wider px-5 py-3.5">
                        SIZE
                      </th>
                      <th className="text-[10px] font-bold text-slate-400 dark:text-slate-500 font-mono uppercase tracking-wider px-5 py-3.5">
                        UPLOADED
                      </th>
                      <th className="text-[10px] font-bold text-slate-400 dark:text-slate-500 font-mono uppercase tracking-wider px-5 py-3.5">
                        STATUS
                      </th>
                      <th className="text-right text-[10px] font-bold text-slate-400 dark:text-slate-500 font-mono uppercase tracking-wider px-5 py-3.5">
                        ACTION
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/[0.05]">
                    {displayDocs.slice(0, 5).map((doc) => (
                      <tr
                        key={doc.id}
                        className="hover:bg-indigo-50/40 dark:hover:bg-indigo-950/30 transition-colors cursor-pointer group"
                      >
                        {/* Document Info */}
                        <td className="px-5 py-3.5">
                          <Link to={`/documents/${doc.id}`} className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0 border border-indigo-200/40 dark:border-indigo-900/40">
                              <FiFileText className="text-sm" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate max-w-[280px]">
                                {doc.fileName}
                              </p>
                              <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate max-w-xs">
                                {doc.summary ? doc.summary.substring(0, 65) + '...' : 'PDF document'}
                              </p>
                            </div>
                          </Link>
                        </td>

                        {/* File Size */}
                        <td className="px-5 py-3.5 text-xs text-slate-500 dark:text-slate-400 font-medium font-mono">
                          {formatSize(doc.fileSize)}
                        </td>

                        {/* Uploaded Date */}
                        <td className="px-5 py-3.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
                          {formatDate(doc.uploadedAt)}
                        </td>

                        {/* Status Badge */}
                        <td className="px-5 py-3.5">
                          {renderStatusBadge(doc.analysisStatus || doc.status)}
                        </td>

                        {/* Action Buttons */}
                        <td className="px-5 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              to={`/documents/${doc.id}`}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-bold rounded-lg hover:bg-indigo-600 hover:text-white transition-all shadow-2xs active:scale-95"
                            >
                              <span>Overview</span>
                            </Link>
                            <Link
                              to={`/documents/${doc.id}/chat`}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-lg hover:bg-slate-200 dark:hover:bg-white/20 transition-all shadow-2xs active:scale-95"
                            >
                              <FiMessageSquare className="text-xs" />
                              <span>Chat</span>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Responsive Document Cards (< md) */}
            <div className="md:hidden space-y-3">
              {displayDocs.slice(0, 5).map((doc) => (
                <div
                  key={doc.id}
                  className="glass-card glass-card-hover p-4 rounded-2xl space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-indigo-500/10 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0 border border-indigo-200/40 dark:border-indigo-900/40">
                        <FiFileText className="text-sm" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                          {doc.fileName}
                        </p>
                        <p className="text-[11px] text-slate-400 dark:text-slate-500">
                          {formatSize(doc.fileSize)} • {formatDate(doc.uploadedAt)}
                        </p>
                      </div>
                    </div>
                    <div>{renderStatusBadge(doc.analysisStatus || doc.status)}</div>
                  </div>

                  <div className="pt-1 flex items-center gap-2">
                    <Link
                      to={`/documents/${doc.id}`}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl shadow-2xs active:scale-95"
                    >
                      <span>View Overview</span>
                    </Link>
                    <Link
                      to={`/documents/${doc.id}/chat`}
                      className="p-2 bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200 rounded-xl"
                    >
                      <FiMessageSquare className="text-xs" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
