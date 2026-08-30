import React, { useState } from 'react';
import {
  FiMessageSquare,
  FiEye,
  FiColumns,
  FiEdit3,
  FiLayers,
  FiCreditCard,
  FiFileText,
  FiArrowRight,
  FiCpu,
  FiShield,
  FiZap,
  FiTarget,
} from 'react-icons/fi';
import { Link } from 'react-router-dom';

export default function EverythingConnectedSection() {
  const [activePill, setActivePill] = useState('ask');

  const nodes = [
    {
      id: 'ask',
      label: 'Ask',
      dotColor: 'bg-blue-400 shadow-[0_0_8px_#38bdf8]',
      title: 'Interactive Document Q&A',
      desc: 'Ask complex questions in natural language and receive verified answers with page citations and bounding box highlights.',
      icon: FiMessageSquare,
      link: '/documents',
    },
    {
      id: 'insights',
      label: 'Insights',
      dotColor: 'bg-purple-400 shadow-[0_0_8px_#c084fc]',
      title: 'Automated Insight Extraction',
      desc: 'DocuMind automatically maps key topics, potential risks, financial figures, important dates, and legal clauses.',
      icon: FiEye,
      link: '/documents',
    },
    {
      id: 'compare',
      label: 'Compare',
      dotColor: 'bg-cyan-400 shadow-[0_0_8px_#22d3ee]',
      title: 'Cross-Document Comparison',
      desc: 'Place multiple PDFs or contracts side-by-side to detect structural discrepancies, revisions, and clause differences.',
      icon: FiColumns,
      link: '/documents',
    },
    {
      id: 'notes',
      label: 'Notes',
      dotColor: 'bg-indigo-400 shadow-[0_0_8px_#818cf8]',
      title: 'Synthesized Study Notes',
      desc: 'Jot down thoughts linked directly to specific pages and quotes for rapid retrieval anytime without context switching.',
      icon: FiEdit3,
      link: '/notes',
    },
    {
      id: 'sections',
      label: 'Sections',
      dotColor: 'bg-teal-400 shadow-[0_0_8px_#2dd4bf]',
      title: 'Hierarchical Section Tree',
      desc: 'Instantly navigate across deep document hierarchies, nested provisions, chapters, and subheadings with 1-click jumps.',
      icon: FiLayers,
      link: '/documents',
    },
    {
      id: 'flashcards',
      label: 'Flashcards',
      dotColor: 'bg-sky-400 shadow-[0_0_8px_#38bdf8]',
      title: 'AI Flashcards & Spaced Repetition',
      desc: 'Generate interactive 3D flashcard decks with active recall scoring for exam preparation, board briefings, and interviews.',
      icon: FiCreditCard,
      link: '/flashcards',
    },
    {
      id: 'documents',
      label: 'Documents',
      dotColor: 'bg-emerald-400 shadow-[0_0_8px_#34d399]',
      title: 'Multi-Format Knowledge Repository',
      desc: 'Upload PDFs, Word files, notes, and text files. All parsed under one unified semantic connectome.',
      icon: FiFileText,
      link: '/documents',
    },
  ];

  const leftPillars = [
    {
      icon: FiCpu,
      title: 'Unified Neural Embeddings',
      desc: 'Every document is parsed into dense vector clusters, ensuring instant semantic retrieval across search, chat, and insights.',
      color: 'cyan',
    },
    {
      icon: FiZap,
      title: 'Cross-Modal Context Sync',
      desc: 'Switch seamlessly between Q&A chat, structured insight tables, and personal notes without losing your citation trace.',
      color: 'blue',
    },
  ];

  const rightPillars = [
    {
      icon: FiTarget,
      title: 'Deep Semantic Citations',
      desc: 'Every extracted risk, date, note, and flashcard anchors back to the exact page and paragraph in your original file.',
      color: 'purple',
    },
    {
      icon: FiShield,
      title: 'Zero-Silo Workspace',
      desc: 'Upload once, instantly access all 7 modules. Zero redundant indexing, re-parsing, or manual tagging required.',
      color: 'indigo',
    },
  ];

  const activeNodeData = nodes.find((n) => n.id === activePill) || nodes[0];
  const ActiveIcon = activeNodeData.icon;

  return (
    <section
      id="connected-system"
      className="relative py-28 px-4 sm:px-6 lg:px-8 bg-transparent overflow-hidden flex flex-col items-center justify-center"
    >
      {/* ─────────────────────────────────────────────────────────────
          1. HUGE 3D DEPTH BACKGROUND WATERMARK & AMBIENT AURORA
          ───────────────────────────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center select-none">
        <span className="text-[12vw] font-black text-watermark absolute top-1/2 -translate-y-1/2 tracking-[0.2em] whitespace-nowrap opacity-[0.035]">
          CONNECTED SYSTEM
        </span>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[54rem] h-[46rem] bg-gradient-to-tr from-cyan-600/12 via-blue-600/15 to-purple-600/12 rounded-full blur-[140px]" />
        <div className="absolute top-1/4 right-10 w-96 h-96 bg-purple-600/10 rounded-full blur-[110px]" />
        <div className="absolute bottom-1/4 left-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-[110px]" />
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-10 flex flex-col items-center">
        {/* Centered Heading */}
        <div className="max-w-3xl text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[10.5px] font-bold tracking-widest uppercase mb-4 backdrop-blur-md shadow-[0_0_15px_rgba(0,240,255,0.15)]">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_6px_#00f0ff]" />
            <span>ONE CONNECTED SYSTEM</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.12] mb-4">
            Everything Connected <br />
            to{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-indigo-300 to-purple-400 drop-shadow-[0_0_25px_rgba(99,102,241,0.3)]">
              DocuMind.
            </span>
          </h2>

          <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-xl mx-auto font-normal">
            Search, insights, notes, comparisons and flashcards all run on the
            same understanding of your documents.
          </p>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            2. MAIN 3-COLUMN COMPOSITION: ALTERNATING PILLARS + CONNECTED HUB
            ───────────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center w-full my-4">
          {/* ═════════════════════════════════════════════════════════
              LEFT COLUMN: SYSTEM ARCHITECTURE PILLARS
              ═════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-3 flex flex-col gap-4 order-2 lg:order-1">
            {leftPillars.map((p, i) => {
              const Icon = p.icon;
              return (
                <div
                  key={i}
                  className="p-4 rounded-2xl border border-white/[0.10] hover:border-cyan-400/40 backdrop-blur-2xl transition-all duration-300 hover:scale-[1.02] group cursor-pointer"
                  style={{
                    backgroundColor: 'rgba(8, 16, 40, 0.28)',
                    boxShadow: 'inset 0 1px 1px 0 rgba(255,255,255,0.15), 0 8px 24px 0 rgba(0,0,0,0.4)',
                    backdropFilter: 'blur(24px)',
                  }}
                >
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-300 text-sm mb-2.5 group-hover:scale-110 transition-transform">
                    <Icon />
                  </div>
                  <p className="text-xs font-bold text-white tracking-tight leading-tight group-hover:text-cyan-300 transition-colors">
                    {p.title}
                  </p>
                  <p className="text-[10.5px] text-slate-400 leading-relaxed mt-1">
                    {p.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* ═════════════════════════════════════════════════════════
              CENTER COLUMN: CENTRAL INTELLIGENCE ENGINE & 7 PILLS (NO 3D MODEL)
              ═════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-6 relative flex flex-col items-center justify-center order-1 lg:order-2 p-6 rounded-3xl bg-[#081232]/60 border border-cyan-500/30 backdrop-blur-2xl shadow-[0_0_40px_rgba(0,240,255,0.15)] my-auto">
            {/* Central Top Hub Card */}
            <div
              className="relative z-20 px-8 py-4 rounded-2xl border border-sky-400/40 backdrop-blur-2xl flex flex-col items-center text-center select-none mb-6 group hover:border-sky-400 transition-all hover:scale-105"
              style={{
                backgroundColor: 'rgba(8, 16, 40, 0.50)',
                boxShadow: 'inset 0 1px 2px 0 rgba(255,255,255,0.18), 0 12px 35px 0 rgba(0,0,0,0.5), 0 0 30px rgba(56,189,248,0.2)',
                backdropFilter: 'blur(28px)',
              }}
            >
              <div className="w-10 h-10 mx-auto rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 text-lg mb-2 shadow-[0_0_15px_rgba(0,240,255,0.4)]">
                <FiCpu />
              </div>
              <p className="text-base sm:text-lg font-black text-white tracking-tight">
                DocuMind
              </p>
              <p className="text-[9.5px] sm:text-[10px] font-black tracking-[0.22em] text-cyan-400 uppercase mt-0.5">
                INTELLIGENCE ENGINE
              </p>
            </div>

            {/* 3 Rows of Connected Feature Pills */}
            <div className="w-full flex flex-col items-center gap-3 z-10">
              {/* Row 1: Ask, Insights, Compare */}
              <div className="flex items-center justify-center gap-2.5 sm:gap-3.5 flex-wrap">
                {nodes.slice(0, 3).map((n) => {
                  const isActive = activePill === n.id;
                  return (
                    <button
                      key={n.id}
                      onClick={() => setActivePill(n.id)}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold backdrop-blur-xl border transition-all duration-300 cursor-pointer shadow-md ${
                        isActive
                          ? 'bg-[#0d1f52] border-cyan-400 text-white shadow-[0_0_20px_rgba(0,240,255,0.5)] scale-105'
                          : 'bg-[#081028]/90 border-blue-500/30 text-slate-300 hover:border-cyan-400/60 hover:text-white'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${n.dotColor}`} />
                      <span>{n.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Row 2: Notes, Sections, Flashcards */}
              <div className="flex items-center justify-center gap-2.5 sm:gap-3.5 flex-wrap">
                {nodes.slice(3, 6).map((n) => {
                  const isActive = activePill === n.id;
                  return (
                    <button
                      key={n.id}
                      onClick={() => setActivePill(n.id)}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold backdrop-blur-xl border transition-all duration-300 cursor-pointer shadow-md ${
                        isActive
                          ? 'bg-[#0d1f52] border-cyan-400 text-white shadow-[0_0_20px_rgba(0,240,255,0.5)] scale-105'
                          : 'bg-[#081028]/90 border-blue-500/30 text-slate-300 hover:border-cyan-400/60 hover:text-white'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${n.dotColor}`} />
                      <span>{n.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Row 3: Documents */}
              <div className="flex items-center justify-center">
                {nodes.slice(6, 7).map((n) => {
                  const isActive = activePill === n.id;
                  return (
                    <button
                      key={n.id}
                      onClick={() => setActivePill(n.id)}
                      className={`inline-flex items-center gap-2 px-6 py-2 rounded-full text-xs font-semibold backdrop-blur-xl border transition-all duration-300 cursor-pointer shadow-md ${
                        isActive
                          ? 'bg-[#0d1f52] border-cyan-400 text-white shadow-[0_0_20px_rgba(0,240,255,0.5)] scale-105'
                          : 'bg-[#081028]/90 border-blue-500/30 text-slate-300 hover:border-cyan-400/60 hover:text-white'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${n.dotColor}`} />
                      <span>{n.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ═════════════════════════════════════════════════════════
              RIGHT COLUMN: SYSTEM ARCHITECTURE PILLARS
              ═════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-3 flex flex-col gap-4 order-3">
            {rightPillars.map((p, i) => {
              const Icon = p.icon;
              return (
                <div
                  key={i}
                  className="p-4 rounded-2xl border border-white/[0.10] hover:border-purple-400/40 backdrop-blur-2xl transition-all duration-300 hover:scale-[1.02] group cursor-pointer"
                  style={{
                    backgroundColor: 'rgba(8, 16, 40, 0.28)',
                    boxShadow: 'inset 0 1px 1px 0 rgba(255,255,255,0.15), 0 8px 24px 0 rgba(0,0,0,0.4)',
                    backdropFilter: 'blur(24px)',
                  }}
                >
                  <div className="w-8 h-8 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-300 text-sm mb-2.5 group-hover:scale-110 transition-transform">
                    <Icon />
                  </div>
                  <p className="text-xs font-bold text-white tracking-tight leading-tight group-hover:text-purple-300 transition-colors">
                    {p.title}
                  </p>
                  <p className="text-[10.5px] text-slate-400 leading-relaxed mt-1">
                    {p.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            3. LIVE INTERACTIVE FEATURE INSPECTOR DRAWER
            ───────────────────────────────────────────────────────────── */}
        <div
          className="w-full max-w-2xl mt-8 p-5 rounded-3xl border border-sky-400/25 backdrop-blur-2xl flex items-start gap-4 z-20 transition-all duration-200"
          style={{
            backgroundColor: 'rgba(8, 16, 40, 0.30)',
            boxShadow: 'inset 0 1px 1px 0 rgba(255,255,255,0.15), 0 15px 40px 0 rgba(0,0,0,0.6)',
            backdropFilter: 'blur(28px)',
          }}
        >
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-300 text-lg flex-shrink-0 shadow-sm">
            <ActiveIcon />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-white tracking-tight">
                {activeNodeData.title}
              </p>
              <Link
                to={activeNodeData.link}
                className="text-[10.5px] font-semibold text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1 group"
              >
                Launch Module <FiArrowRight className="text-xs transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed font-normal mt-1">
              {activeNodeData.desc}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
