import React, { useState } from 'react';
import {
  FiUploadCloud,
  FiFileText,
  FiCheckCircle,
  FiAlertTriangle,
  FiSearch,
  FiSend,
  FiLayers,
  FiTag,
  FiUsers,
  FiCalendar,
  FiCpu,
  FiActivity,
  FiShield,
  FiBookOpen,
  FiCreditCard,
  FiEdit3,
  FiCopy,
  FiArrowUpRight,
  FiCheck,
  FiZap,
  FiLock,
  FiTrendingUp,
} from 'react-icons/fi';

/* ══════════════════════════════════════════════════════════════════
   1. DOCUMENT HUB & UPLOAD MOCKUP (Transparent Glass UI)
   ══════════════════════════════════════════════════════════════════ */
export function DocumentHubMockup() {
  const [selectedDoc, setSelectedDoc] = useState(0);

  const docs = [
    {
      name: 'Master_Service_Agreement_v4.pdf',
      size: '2.4 MB',
      pages: 34,
      status: 'Indexed & Vectorized',
      chunks: '128 Chunks',
      date: 'Today, 2:15 PM',
      color: 'cyan',
    },
    {
      name: 'Q3_Financial_Audit_Report.docx',
      size: '1.8 MB',
      pages: 18,
      status: 'Ready for Q&A',
      chunks: '74 Chunks',
      date: 'Yesterday',
      color: 'indigo',
    },
    {
      name: 'System_Architecture_Blueprint.pdf',
      size: '4.1 MB',
      pages: 52,
      status: 'OCR Verified',
      chunks: '210 Chunks',
      date: 'Aug 28, 2026',
      color: 'purple',
    },
  ];

  return (
    <div className="w-full rounded-3xl bg-slate-950/60 backdrop-blur-2xl border border-white/10 p-5 sm:p-6 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] flex flex-col gap-4 text-left select-none relative overflow-hidden group">
      {/* Ambient Top Glow Line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />

      {/* Header Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.07]">
        <div className="flex items-center gap-2.5">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
          <span className="text-[11px] font-mono text-slate-400 ml-2 font-medium tracking-wide">
            documind://workspace/documents
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
            Vector Store Active
          </span>
        </div>
      </div>

      {/* Simulated Upload Dropzone */}
      <div className="rounded-2xl border border-dashed border-cyan-500/30 bg-cyan-950/20 p-4 sm:p-5 flex items-center justify-between gap-4 transition-all duration-300 hover:border-cyan-400/60 hover:bg-cyan-950/30">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 text-lg flex-shrink-0 shadow-[0_0_15px_rgba(0,240,255,0.25)]">
            <FiUploadCloud />
          </div>
          <div>
            <p className="text-xs sm:text-sm font-bold text-white leading-snug">
              Drop documents to vectorize
            </p>
            <p className="text-[11px] text-slate-400">
              PDF, DOCX, TXT, MD • Auto OCR & Embeddings
            </p>
          </div>
        </div>
        <button className="px-3.5 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-semibold transition-all">
          Upload
        </button>
      </div>

      {/* Ingestion Pipeline Live Progress */}
      <div className="rounded-xl bg-slate-900/60 border border-white/[0.06] p-3 flex flex-col gap-2">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-slate-300 font-medium flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            Ingesting & Extracting: <strong className="text-white">API_Architecture_v2.pdf</strong>
          </span>
          <span className="text-cyan-400 font-mono font-bold">100% Parsed</span>
        </div>
        <div className="w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
          <div className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400 h-full rounded-full w-full" />
        </div>
      </div>

      {/* Document Library Cards */}
      <div className="flex flex-col gap-2 pt-1">
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Recent Documents (3)
        </p>
        <div className="grid grid-cols-1 gap-2">
          {docs.map((doc, idx) => {
            const isSelected = selectedDoc === idx;
            return (
              <div
                key={idx}
                onClick={() => setSelectedDoc(idx)}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? 'bg-cyan-950/40 border-cyan-400/50 shadow-[0_0_20px_rgba(0,240,255,0.15)]'
                    : 'bg-slate-900/40 border-white/[0.06] hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-300 text-sm flex-shrink-0">
                    <FiFileText />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-white truncate">
                      {doc.name}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400">
                      <span>{doc.pages} pages</span>
                      <span>•</span>
                      <span>{doc.size}</span>
                      <span>•</span>
                      <span className="text-cyan-300 font-mono">{doc.chunks}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                    <FiCheckCircle className="text-[9px]" />
                    {doc.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   2. DOCUMENT OVERVIEW & INTELLIGENCE MOCKUP (Transparent Glass UI)
   ══════════════════════════════════════════════════════════════════ */
export function DocumentOverviewMockup() {
  const [activeTab, setActiveTab] = useState('clauses');

  const tabs = [
    { id: 'clauses', label: 'Important Clauses (8)', icon: FiLayers, color: 'cyan' },
    { id: 'risks', label: 'Potential Risks (2)', icon: FiAlertTriangle, color: 'rose' },
    { id: 'topics', label: 'Key Topics (6)', icon: FiTag, color: 'purple' },
    { id: 'entities', label: 'Entities (14)', icon: FiUsers, color: 'indigo' },
  ];

  return (
    <div className="w-full rounded-3xl bg-slate-950/60 backdrop-blur-2xl border border-white/10 p-5 sm:p-6 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] flex flex-col gap-4 text-left select-none relative overflow-hidden group">
      {/* Ambient Top Glow Line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-purple-400/50 to-transparent" />

      {/* Header Bar with Document Meta */}
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.07]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300 text-base shadow-[0_0_15px_rgba(168,85,247,0.3)]">
            <FiCpu />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-white">
              Enterprise_Cloud_Contract.pdf
            </h4>
            <p className="text-[10px] text-slate-400">
              AI Multi-Layer Extraction • 42 Pages Analyzed
            </p>
          </div>
        </div>
        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
          Executive Grade
        </span>
      </div>

      {/* Executive Summary Mini-Card */}
      <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-white/[0.08] relative">
        <p className="text-[10.5px] font-bold uppercase tracking-wider text-cyan-300 mb-1.5 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
          AI Executive Synthesis
        </p>
        <p className="text-xs text-slate-200 leading-relaxed font-normal">
          Agreement defines a 3-year enterprise cloud migration SLA with 99.99% uptime guarantee, mutual indemnification, and liability capped at 12 months fees.
        </p>
      </div>

      {/* Interactive Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-purple-500/25 border border-purple-400/50 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                  : 'bg-slate-900/40 border border-white/[0.06] text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
              }`}
            >
              <Icon className="text-xs" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Dynamic Content Body */}
      <div className="min-h-[160px] flex flex-col justify-center">
        {activeTab === 'clauses' && (
          <div className="space-y-2 animate-in fade-in duration-200">
            <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-left">
              <div className="flex items-center justify-between text-[11px] font-bold text-cyan-300 mb-1">
                <span>§ 14.2 Limitation of Direct Liability</span>
                <span className="text-[10px] text-cyan-400 font-mono">Page 28</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed font-mono">
                "Neither party shall be liable for aggregate damages exceeding the total fees paid during preceding 12 months."
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/40 border border-white/[0.06] text-left">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-300 mb-1">
                <span>§ 18.4 Termination for Convenience</span>
                <span className="text-[10px] text-slate-400 font-mono">Page 35</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed font-mono">
                "Either party may terminate this Agreement without cause upon sixty (60) days written notice."
              </p>
            </div>
          </div>
        )}

        {activeTab === 'risks' && (
          <div className="space-y-2 animate-in fade-in duration-200">
            <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-500/40 text-left">
              <div className="flex items-center gap-2 text-[11px] font-bold text-rose-300 mb-1">
                <FiAlertTriangle className="text-rose-400" />
                <span>High Exposure: Unlimited Indemnity for IP Infringement</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Section 16.1 carves out intellectual property indemnity from the aggregate liability cap.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'topics' && (
          <div className="flex flex-wrap gap-2 animate-in fade-in duration-200">
            {['Cloud Infrastructure', 'Data Privacy GDPR', 'SLA 99.99%', 'SOC2 Compliance', 'Escrow Source Code', 'Dispute Arbitration'].map((topic, i) => (
              <span key={i} className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-purple-500/15 border border-purple-500/30 text-purple-200">
                #{topic}
              </span>
            ))}
          </div>
        )}

        {activeTab === 'entities' && (
          <div className="grid grid-cols-2 gap-2 animate-in fade-in duration-200">
            <div className="p-2.5 rounded-xl bg-slate-900/50 border border-white/[0.06]">
              <span className="text-[10px] text-indigo-300 uppercase font-bold block">Signatory / Org</span>
              <span className="text-xs text-white font-semibold">Nexus Cloud Corp.</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900/50 border border-white/[0.06]">
              <span className="text-[10px] text-indigo-300 uppercase font-bold block">Jurisdiction</span>
              <span className="text-xs text-white font-semibold">Delaware, USA</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   3. CONTEXTUAL AI CHAT & CITATION MOCKUP (Transparent Glass UI)
   ══════════════════════════════════════════════════════════════════ */
export function ChatCitationMockup() {
  const [selectedCitation, setSelectedCitation] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState(0);

  const qaPairs = [
    {
      q: 'What are the termination notice conditions and penalties?',
      a: 'According to Section 18.4, either party may terminate for convenience with 60 days advance written notice. No early termination penalty applies provided all accrued service fees are settled within 30 days.',
      citation: 'Section 18.4 • Page 35',
      quote: '"Either party may terminate upon 60 days notice without penalty, provided pending invoices are settled within thirty (30) business days."',
    },
    {
      q: 'Is there a guaranteed service uptime SLA in this agreement?',
      a: 'Yes. Section 9.2 guarantees a 99.99% monthly system availability SLA. If availability drops below 99.5%, a 15% billing credit is automatically issued.',
      citation: 'Section 9.2 • Page 19',
      quote: '"Provider guarantees 99.99% monthly uptime. Unscheduled downtime exceeding 0.05% triggers an automatic 15% tier credit."',
    },
  ];

  const currentQA = qaPairs[activeQuestion];

  return (
    <div className="w-full rounded-3xl bg-slate-950/60 backdrop-blur-2xl border border-white/10 p-5 sm:p-6 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] flex flex-col gap-4 text-left select-none relative overflow-hidden group">
      {/* Ambient Top Glow Line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-400/50 to-transparent" />

      {/* Header Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.07]">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#00f0ff]" />
          <span className="text-xs font-bold text-white tracking-wide">
            DocuMind Grounded Q&A Assistant
          </span>
        </div>
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/15 text-blue-300 border border-blue-500/30">
          100% Grounded RAG
        </span>
      </div>

      {/* Preset Question Pills */}
      <div className="flex gap-2">
        {qaPairs.map((pair, idx) => (
          <button
            key={idx}
            onClick={() => {
              setActiveQuestion(idx);
              setSelectedCitation(false);
            }}
            className={`px-3 py-1.5 rounded-xl text-[11px] font-medium transition-all text-left truncate flex-1 ${
              activeQuestion === idx
                ? 'bg-blue-500/25 border border-blue-400/50 text-white shadow-[0_0_12px_rgba(59,130,246,0.3)]'
                : 'bg-slate-900/50 border border-white/[0.06] text-slate-400 hover:text-slate-200'
            }`}
          >
            {pair.q}
          </button>
        ))}
      </div>

      {/* Chat Dialogue Stream */}
      <div className="flex flex-col gap-3">
        {/* User Bubble */}
        <div className="self-end max-w-[85%] p-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-medium shadow-md">
          {currentQA.q}
        </div>

        {/* Assistant Bubble */}
        <div className="self-start max-w-[95%] p-3.5 rounded-2xl bg-slate-900/80 border border-white/[0.08] text-slate-200 text-xs leading-relaxed space-y-2.5">
          <p>{currentQA.a}</p>

          {/* Clickable Citation Badge */}
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => setSelectedCitation(!selectedCitation)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10.5px] font-bold font-mono transition-all cursor-pointer ${
                selectedCitation
                  ? 'bg-cyan-400 text-slate-950 shadow-[0_0_15px_#00f0ff]'
                  : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30'
              }`}
            >
              <FiBookOpen className="text-xs" />
              <span>{currentQA.citation}</span>
              <span className="text-[9px] uppercase font-sans font-normal opacity-80">(Click Source)</span>
            </button>
          </div>

          {/* Expanded Verified Source Proof Drawer */}
          {selectedCitation && (
            <div className="p-3 rounded-xl bg-[#06152a] border border-cyan-400/50 text-slate-200 text-[11px] animate-in fade-in slide-in-from-top-1 duration-200">
              <div className="flex items-center justify-between text-cyan-300 font-bold text-[10px] mb-1">
                <span>VERIFIED DOCUMENT EVIDENCE</span>
                <span className="font-mono">Match Score 99.4%</span>
              </div>
              <p className="font-mono text-slate-300 italic text-[10.5px]">
                {currentQA.quote}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Input Field Bar */}
      <div className="flex items-center gap-2 p-2 rounded-2xl bg-slate-900/70 border border-white/[0.08]">
        <input
          type="text"
          readOnly
          value="Ask anything from your uploaded PDF..."
          className="bg-transparent text-xs text-slate-400 w-full px-2 outline-none cursor-default"
        />
        <div className="w-7 h-7 rounded-xl bg-blue-600 flex items-center justify-center text-white text-xs shadow-sm">
          <FiSend />
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   4. ACTIVE RECALL FLASHCARDS MOCKUP (Transparent Glass UI)
   ══════════════════════════════════════════════════════════════════ */
export function FlashcardsMockup() {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="w-full rounded-3xl bg-slate-950/60 backdrop-blur-2xl border border-white/10 p-5 sm:p-6 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] flex flex-col gap-4 text-left select-none relative overflow-hidden group">
      {/* Ambient Top Glow Line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent" />

      {/* Header Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.07]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300 text-sm shadow-[0_0_15px_rgba(16,185,129,0.3)]">
            <FiCreditCard />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-white">
              Distributed Systems Deck
            </h4>
            <p className="text-[10px] text-slate-400">Card 3 of 24 • Spaced Repetition</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
            88% Mastery
          </span>
        </div>
      </div>

      {/* Interactive 3D Flip Card Container */}
      <div
        onClick={() => setFlipped(!flipped)}
        className="w-full min-h-[170px] sm:min-h-[180px] rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-950/90 border border-emerald-500/30 p-5 cursor-pointer flex flex-col justify-between transition-all duration-300 hover:border-emerald-400/60 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)] relative overflow-hidden"
      >
        <div className="flex items-center justify-between">
          <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
            {flipped ? 'ANSWER & CITATION' : 'QUESTION'}
          </span>
          <span className="text-[10px] text-slate-400">
            {flipped ? 'Click to show question ↺' : 'Click card to reveal answer ↻'}
          </span>
        </div>

        <div className="py-2">
          {!flipped ? (
            <p className="text-sm sm:text-base font-bold text-white leading-snug">
              What does the CAP theorem state regarding partition tolerance in distributed databases?
            </p>
          ) : (
            <div className="space-y-1.5">
              <p className="text-xs sm:text-sm text-emerald-200 font-medium leading-relaxed">
                In the presence of a network partition (P), a distributed system must choose between guaranteeing Consistency (C) or Availability (A); it cannot provide both simultaneously.
              </p>
              <p className="text-[10px] font-mono text-slate-400">
                Source: Distributed_Architecture.pdf • Page 42, §4.1
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-white/[0.05]">
          <span>Difficulty: Medium</span>
          <span className="text-emerald-400 font-semibold">Active Recall Mode</span>
        </div>
      </div>

      {/* Self-Rating Feedback Action Buttons */}
      <div className="grid grid-cols-3 gap-2">
        <button className="py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-xs font-semibold transition-all">
          Hard (1d)
        </button>
        <button className="py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-semibold transition-all">
          Good (3d)
        </button>
        <button className="py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-semibold transition-all">
          Easy (7d)
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   5. AI RESEARCH NOTES WORKSPACE MOCKUP (Transparent Glass UI)
   ══════════════════════════════════════════════════════════════════ */
export function NotesWorkspaceMockup() {
  return (
    <div className="w-full rounded-3xl bg-slate-950/60 backdrop-blur-2xl border border-white/10 p-5 sm:p-6 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] flex flex-col gap-4 text-left select-none relative overflow-hidden group">
      {/* Ambient Top Glow Line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />

      {/* Header Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.07]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 text-sm shadow-[0_0_15px_rgba(245,158,11,0.3)]">
            <FiEdit3 />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-white">
              Q3 Strategic Architecture Review
            </h4>
            <p className="text-[10px] text-slate-400">Linked to: System_Architecture.pdf</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
            <FiCheck className="text-[9px]" /> Auto-Saved
          </span>
        </div>
      </div>

      {/* Rich Markdown Note Editor Body */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/[0.08] space-y-3 font-sans">
        <div className="flex items-center justify-between pb-2 border-b border-white/[0.05]">
          <div className="flex gap-2">
            <span className="px-2 py-0.5 rounded bg-white/10 text-slate-300 text-[10px] font-mono font-bold"># Heading</span>
            <span className="px-2 py-0.5 rounded bg-white/10 text-slate-300 text-[10px] font-mono font-bold">**Bold**</span>
            <span className="px-2 py-0.5 rounded bg-white/10 text-slate-300 text-[10px] font-mono font-bold">&gt; Quote</span>
          </div>
          <span className="text-[10px] text-amber-300 font-medium">Markdown Mode</span>
        </div>

        <div className="space-y-2 text-xs">
          <h5 className="font-bold text-white text-sm">## Core Microservice Migration Milestones</h5>
          <p className="text-slate-300 leading-relaxed">
            The monolith decoupling requires three specific architectural phases:
          </p>

          {/* Linked Quote Snippet */}
          <div className="border-l-2 border-amber-400 pl-3 py-1 bg-amber-950/20 text-slate-200 text-[11px] rounded-r-lg">
            <span className="text-amber-300 font-bold block text-[10px]">CITED FROM PAGE 12:</span>
            "Event-driven broker architecture will process 45,000 req/sec with guaranteed sub-10ms delivery."
          </div>

          <div className="flex items-center gap-2 pt-1">
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/20 text-amber-200 border border-amber-500/30">
              #Microservices
            </span>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-500/20 text-blue-200 border border-blue-500/30">
              #Architecture2026
            </span>
          </div>
        </div>
      </div>

      {/* AI Assistant Inline Action Bar */}
      <div className="p-2.5 rounded-xl bg-amber-950/20 border border-amber-500/30 flex items-center justify-between text-xs">
        <span className="text-amber-200 font-medium flex items-center gap-1.5">
          <FiZap className="text-amber-400" />
          AI Copilot: Generate action items from this note?
        </span>
        <button className="px-3 py-1 rounded-lg bg-amber-500/30 hover:bg-amber-500/40 text-amber-200 text-[11px] font-bold border border-amber-500/50 transition-all">
          Generate
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   6. COMMAND DASHBOARD & ANALYTICS MOCKUP (Transparent Glass UI)
   ══════════════════════════════════════════════════════════════════ */
export function DashboardMockup() {
  const kpis = [
    { label: 'Total Documents', value: '48', change: '+12% this month', icon: FiFileText, color: 'blue' },
    { label: 'Verified Q&A Queries', value: '1,420', change: '99.8% precision', icon: FiZap, color: 'cyan' },
    { label: 'Hours Saved', value: '94 hrs', change: 'Reading & audit time', icon: FiTrendingUp, color: 'emerald' },
    { label: 'Security & Encryption', value: 'AES-256', change: 'SOC2 Type II Ready', icon: FiShield, color: 'purple' },
  ];

  return (
    <div className="w-full rounded-3xl bg-slate-950/60 backdrop-blur-2xl border border-white/10 p-5 sm:p-6 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.7)] flex flex-col gap-4 text-left select-none relative overflow-hidden group">
      {/* Ambient Top Glow Line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />

      {/* Header Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.07]">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
          <span className="text-xs font-bold text-white tracking-wide">
            Enterprise Intelligence Mission Control
          </span>
        </div>
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
          Live System Health: 100%
        </span>
      </div>

      {/* KPI 4-Card Grid */}
      <div className="grid grid-cols-2 gap-2.5">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className="p-3 rounded-2xl bg-slate-900/60 border border-white/[0.06] flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-medium text-slate-400">{kpi.label}</span>
                <div className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center text-slate-300 text-xs">
                  <Icon />
                </div>
              </div>
              <div>
                <p className="text-base sm:text-lg font-black text-white">{kpi.value}</p>
                <p className="text-[9.5px] font-medium text-cyan-400">{kpi.change}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Intelligence Stream */}
      <div className="p-3 rounded-2xl bg-slate-900/50 border border-white/[0.06] space-y-2">
        <p className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400">
          Live Processing Stream
        </p>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-slate-300">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Compliance audit completed on <strong className="text-white">HIPAA_Vendor_v2.pdf</strong>
            </span>
            <span className="text-[10px] text-slate-500 font-mono">1m ago</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-300">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              24 Flashcards generated for <strong className="text-white">Cloud_Architect_Guide.pdf</strong>
            </span>
            <span className="text-[10px] text-slate-500 font-mono">5m ago</span>
          </div>
        </div>
      </div>
    </div>
  );
}
