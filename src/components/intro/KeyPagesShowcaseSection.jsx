import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiFileText,
  FiCpu,
  FiMessageSquare,
  FiCreditCard,
  FiEdit3,
  FiActivity,
  FiArrowRight,
  FiCheckCircle,
  FiZap,
  FiShield,
  FiLayers,
  FiSearch,
  FiEye,
  FiTrendingUp,
  FiCompass,
  FiDatabase,
} from 'react-icons/fi';
import {
  DocumentHubMockup,
  DocumentOverviewMockup,
  ChatCitationMockup,
  FlashcardsMockup,
  NotesWorkspaceMockup,
  DashboardMockup,
} from './PageMockupViews';

export default function KeyPagesShowcaseSection() {
  const [activePageId, setActivePageId] = useState('documents');

  const pages = [
    {
      id: 'documents',
      num: '01',
      badge: 'DOCUMENT REPOSITORY & INGESTION',
      name: 'Document Hub & Intelligent Parsing',
      route: '/documents',
      icon: FiFileText,
      accentColor: 'cyan',
      glowColor: 'rgba(56, 189, 248, 0.15)',
      borderColor: 'border-cyan-500/30',
      pillBg: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
      headline: 'Ingest, OCR & Vectorize Any Document in Milliseconds',
      howItWorks:
        'Takes raw multi-format files (PDF, DOCX, TXT, Markdown), runs layout-aware OCR extraction, segments dense text into structured semantic chunks, and calculates high-dimensional vector embeddings for instant retrieval.',
      whyAddThis:
        'Solves the friction of unsearchable files, buried clauses, and manual reading. Instead of skimming hundreds of pages, this hub gives you a unified, AI-indexed knowledge vault ready for immediate interrogation.',
      highlights: [
        { label: 'Multi-Format Ingestion', desc: 'PDF, Word, Scanned OCR, TXT, MD' },
        { label: 'Vector Indexing', desc: 'Semantic embeddings for deep retrieval' },
        { label: 'Live Parsing Status', desc: 'Real-time OCR progress & chunk verification' },
        { label: 'Unified Library', desc: 'Search, tag, and organize files in one place' },
      ],
      mockup: <DocumentHubMockup />,
    },
    {
      id: 'overview',
      num: '02',
      badge: 'DEEP KNOWLEDGE EXTRACTION',
      name: 'Deep Document Overview & Intelligence',
      route: '/documents',
      icon: FiCpu,
      accentColor: 'purple',
      glowColor: 'rgba(168, 85, 247, 0.15)',
      borderColor: 'border-purple-500/30',
      pillBg: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
      headline: 'Automated Executive Summaries, Clauses, and Risk Flags',
      howItWorks:
        'Analyzes the entire document hierarchy to produce a 3-bullet executive synthesis, extracts binding clauses, flags hidden compliance or financial liabilities, maps named entities, and builds a clickable outline tree.',
      whyAddThis:
        'Reading a 50-page vendor contract or research report takes hours and leaves room for human oversight. This page surfaces 90% of critical decision factors in 5 seconds so you never miss a legal trap or financial obligation.',
      highlights: [
        { label: 'Clause Inspector', desc: 'Liability, indemnity, warranty & termination' },
        { label: 'Proactive Risk Alerts', desc: 'Instant warning flags on ambiguous terms' },
        { label: 'Entity & Date Mapping', desc: 'People, organizations, and strict milestones' },
        { label: 'Executive Synthesis', desc: 'High-yield TL;DR for rapid decision making' },
      ],
      mockup: <DocumentOverviewMockup />,
    },
    {
      id: 'chat',
      num: '03',
      badge: 'GROUNDED CONVERSATIONAL QA',
      name: 'Contextual AI Chat & Citation Engine',
      route: '/chat',
      icon: FiMessageSquare,
      accentColor: 'blue',
      glowColor: 'rgba(59, 130, 246, 0.15)',
      borderColor: 'border-blue-500/30',
      pillBg: 'bg-blue-500/10 text-blue-300 border-blue-500/30',
      headline: 'Hallucination-Free Q&A Backed by Verifiable Page Citations',
      howItWorks:
        'Uses advanced Retrieval-Augmented Generation (RAG) to cross-examine your natural language question against exact vector chunks, generating answers with clickable page badges and verbatim proof excerpts.',
      whyAddThis:
        'Generic AI chatbots make up facts (hallucinate). DocuMind answers only from your uploaded file and proves every single claim with direct page numbers, ensuring 100% compliance, legal safety, and audit readiness.',
      highlights: [
        { label: 'Verifiable Citations', desc: 'Click any badge to view the source passage' },
        { label: 'Zero Hallucination', desc: 'Strict RAG grounding strictly inside your document' },
        { label: 'Multi-Turn Context', desc: 'Follow-up questions remember previous answers' },
        { label: 'Preset Prompts', desc: '1-click queries for risks, summaries, & metrics' },
      ],
      mockup: <ChatCitationMockup />,
    },
    {
      id: 'flashcards',
      num: '04',
      badge: 'ACTIVE RECALL & MASTERY',
      name: 'Smart Flashcards & Spaced Repetition',
      route: '/flashcards',
      icon: FiCreditCard,
      accentColor: 'emerald',
      glowColor: 'rgba(16, 185, 129, 0.15)',
      borderColor: 'border-emerald-500/30',
      pillBg: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
      headline: 'Transform Dense Text into High-Yield Interactive Study Decks',
      howItWorks:
        'Extracts fundamental concepts, definitions, and formulas from your documents into interactive 3D flip cards, applying spaced repetition algorithms to schedule reviews based on your self-rated mastery score.',
      whyAddThis:
        'Passive reading leads to rapid forgetting. Active recall is scientifically proven to boost long-term retention by 300%. Ideal for medical students, legal trainees, engineers, and executives preparing for briefings.',
      highlights: [
        { label: '1-Click Deck Generation', desc: 'Instant flashcards generated directly from PDFs' },
        { label: 'Interactive 3D Flip', desc: 'Engaging active recall testing with citations' },
        { label: 'Spaced Repetition', desc: 'Adaptive difficulty intervals (Hard/Good/Easy)' },
        { label: 'Mastery Tracking', desc: 'Real-time progress score and concept retention' },
      ],
      mockup: <FlashcardsMockup />,
    },
    {
      id: 'notes',
      num: '05',
      badge: 'CONNECTED RESEARCH STUDIO',
      name: 'AI Markdown Notes & Workspace',
      route: '/notes',
      icon: FiEdit3,
      accentColor: 'amber',
      glowColor: 'rgba(245, 158, 11, 0.15)',
      borderColor: 'border-amber-500/30',
      pillBg: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
      headline: 'Integrated Research Notepad with Live Document Evidence',
      howItWorks:
        'Provides a rich markdown editor directly linked to your document context. Clip citations with one click, organize research tags, and use the AI Copilot to expand bullet points into polished briefings.',
      whyAddThis:
        'Toggling between a PDF viewer and a separate note-taking application wastes time and breaks focus. This workspace unites reading, citing, drafting, and AI synthesis in a single distraction-free window.',
      highlights: [
        { label: 'Live Document Linking', desc: 'Every quote remains permanently tied to its page' },
        { label: 'Rich Markdown Support', desc: 'Headings, syntax blocks, checklists, and tags' },
        { label: 'AI Inline Copilot', desc: 'Generate summaries, outlines, and takeaways' },
        { label: 'Auto-Save & Export', desc: 'Instant local sync and clean document export' },
      ],
      mockup: <NotesWorkspaceMockup />,
    },
    {
      id: 'dashboard',
      num: '06',
      badge: 'MISSION CONTROL & AUDIT',
      name: 'Unified Command Center & Security',
      route: '/dashboard',
      icon: FiActivity,
      accentColor: 'cyan',
      glowColor: 'rgba(56, 189, 248, 0.15)',
      borderColor: 'border-cyan-500/30',
      pillBg: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
      headline: 'Enterprise Usage Metrics, Activity Streams, and Data Privacy',
      howItWorks:
        'Aggregates all document intelligence activities, active chat sessions, vector storage quotas, and security audit logs into an interactive real-time dashboard with fast search command triggers.',
      whyAddThis:
        'Gives teams and leadership 360-degree visibility into knowledge assets, calculated time-savings, and guarantees enterprise-grade data isolation with AES-256 encryption and zero unauthorized AI training.',
      highlights: [
        { label: 'Productivity Metrics', desc: 'Track hours saved and query accuracy rates' },
        { label: 'Live Activity Stream', desc: 'Monitor ingestion and analysis workflows' },
        { label: 'Enterprise Security', desc: 'AES-256 encryption & SOC2 Type II compliance' },
        { label: 'Command Search', desc: 'Instant global keyboard shortcut navigator' },
      ],
      mockup: <DashboardMockup />,
    },
  ];

  const scrollToPage = (id) => {
    setActivePageId(id);
    const element = document.getElementById(`page-section-${id}`);
    if (element) {
      const yOffset = -90;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <section id="key-pages" className="relative py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-transparent overflow-hidden">
      {/* ─────────────────────────────────────────────────────────────
          SEAMLESS CONTINUOUS AMBIENT LIGHT GRADIENT BLOOMS
          (Completely eliminates hard section cuts and lines)
          ───────────────────────────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        <div className="absolute top-10 left-1/4 w-[48rem] h-[48rem] bg-cyan-600/10 rounded-full blur-[140px] animate-light-pulse" />
        <div className="absolute top-1/3 right-10 w-[42rem] h-[42rem] bg-purple-600/10 rounded-full blur-[140px]" />
        <div className="absolute top-2/3 left-10 w-[46rem] h-[46rem] bg-blue-600/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 right-1/4 w-[48rem] h-[48rem] bg-emerald-600/08 rounded-full blur-[140px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-20 sm:space-y-28">
        {/* ─────────────────────────────────────────────────────────────
            HEADER & QUICK KEY PAGES NAVIGATOR
            ───────────────────────────────────────────────────────────── */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[11px] font-bold tracking-widest uppercase backdrop-blur-xl shadow-[0_0_20px_rgba(0,240,255,0.15)]">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span>COMPLETE PRODUCT INTELLIGENCE ECOSYSTEM</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.12]">
            Key Product Pages. <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-indigo-300 to-purple-400 drop-shadow-[0_0_30px_rgba(99,102,241,0.3)]">
              Designed for Maximum Impact.
            </span>
          </h2>

          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Every page in DocuMind is purpose-built to solve a specific information bottleneck.
            Explore each core view below with interactive glass previews and their real-world rationale.
          </p>

          {/* Quick Jump Interactive Key Page Dock */}
          <div className="w-full pt-4">
            <div className="flex items-center justify-center gap-2 flex-wrap p-2 rounded-2xl bg-slate-950/60 backdrop-blur-2xl border border-white/10 shadow-xl">
              {pages.map((p) => {
                const Icon = p.icon;
                const isActive = activePageId === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => scrollToPage(p.id)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${isActive
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_0_18px_rgba(59,130,246,0.45)] border border-white/20 scale-105'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.05]'
                      }`}
                  >
                    <Icon className="text-xs" />
                    <span>{p.name.split('&')[0].trim()}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            ALTERNATING 6 KEY PAGES SHOWCASE
            Side A: Transparent Glass Mockup
            Side B: "⚙️ Page Ka Work" & "💡 Kyun Add Kiya (Why We Added This)"
            ───────────────────────────────────────────────────────────── */}
        <div className="space-y-32 sm:space-y-48">
          {pages.map((page, index) => {
            const isEven = index % 2 === 0;
            const PageIcon = page.icon;

            return (
              <div
                key={page.id}
                id={`page-section-${page.id}`}
                className={`flex flex-col ${
                  isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'
                } items-center justify-between gap-12 lg:gap-20 xl:gap-28 scroll-mt-28`}
              >
                {/* ═══════════════════════════════════════════════════════
                    COLUMN 1: TRANSPARENT GLASS EFFECT PAGE MOCKUP
                    ═══════════════════════════════════════════════════════ */}
                <div className="w-full lg:w-[46%] flex-shrink-0">
                  <div className="relative group">
                    {/* Ambient Spotlight Behind the Glass Card */}
                    <div
                      className="absolute -inset-2 rounded-3xl opacity-50 blur-2xl transition duration-500 group-hover:opacity-80"
                      style={{ background: page.glowColor }}
                    />

                    {/* Interactive Glass Mockup Wrapper */}
                    <div className="relative transform transition-transform duration-300 group-hover:scale-[1.01]">
                      {page.mockup}
                    </div>
                  </div>
                </div>

                {/* ═══════════════════════════════════════════════════════
                    COLUMN 2: DETAILED VALUE & FUNCTIONALITY BREAKDOWN
                    "⚙️ Us Page Ka Work" & "💡 Kyun Add Kiya"
                    ═══════════════════════════════════════════════════════ */}
                <div className="w-full lg:w-[48%] flex flex-col items-start space-y-5 text-left flex-shrink-0">
                  {/* Category Pill & Number Badge */}
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-[10.5px] font-bold tracking-widest uppercase backdrop-blur-xl border ${page.pillBg}`}>
                      {page.badge}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-500">
                      PAGE {page.num} OF 06
                    </span>
                  </div>

                  {/* Page Title & Main Headline */}
                  <div>
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-snug">
                      {page.name}
                    </h3>
                    <p className="text-sm sm:text-base text-slate-300 font-medium mt-1 leading-relaxed">
                      {page.headline}
                    </p>
                  </div>

                  {/* ⚙️ US PAGE KA WORK (FUNCTIONALITY & ENGINEERING) */}
                  <div className="w-full p-4 rounded-2xl bg-slate-900/50 backdrop-blur-xl border border-white/[0.08] space-y-1.5">
                    <div className="flex items-center gap-2 text-xs font-bold text-cyan-300 uppercase tracking-wider">
                      <FiZap className="text-cyan-400" />
                      <span>⚙️ How It Works (Page Ka Work)</span>
                    </div>
                    <p className="text-xs sm:text-[13px] text-slate-300 leading-relaxed font-normal">
                      {page.howItWorks}
                    </p>
                  </div>

                  {/* 💡 KYUN ADD KIYA / WHY WE ADDED THIS (USER VALUE PROPOSITION) */}
                  <div className="w-full p-4 rounded-2xl bg-slate-900/50 backdrop-blur-xl border border-white/[0.08] space-y-1.5">
                    <div className="flex items-center gap-2 text-xs font-bold text-purple-300 uppercase tracking-wider">
                      <FiCheckCircle className="text-purple-400" />
                      <span>💡 Why We Added This (Purpose & Value)</span>
                    </div>
                    <p className="text-xs sm:text-[13px] text-slate-300 leading-relaxed font-normal">
                      {page.whyAddThis}
                    </p>
                  </div>

                  {/* 4 Feature Capability Chips */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full pt-1">
                    {page.highlights.map((h, i) => (
                      <div
                        key={i}
                        className="p-2.5 rounded-xl bg-slate-950/40 border border-white/[0.05] flex items-start gap-2.5"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-bold text-white leading-tight">
                            {h.label}
                          </p>
                          <p className="text-[11px] text-slate-400 leading-tight mt-0.5">
                            {h.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Direct Route CTA Button */}
                  <div className="pt-2">
                    <Link
                      to={page.route}
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-[0_0_20px_rgba(59,130,246,0.35)] border border-white/20 transition-all hover:scale-105 active:scale-95 group cursor-pointer"
                    >
                      <span>Explore {page.name.split('&')[0].trim()}</span>
                      <FiArrowRight className="text-xs transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
