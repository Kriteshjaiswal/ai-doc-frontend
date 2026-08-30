import React, { useState } from 'react';
import {
  FiCheckSquare,
  FiUsers,
  FiAlertTriangle,
  FiFileText,
  FiTag,
  FiLayers,
  FiCalendar,
  FiDollarSign,
  FiArrowRight,
  FiDatabase,
} from 'react-icons/fi';

export default function DocumentsToKnowledgeSection() {
  const [activeNode, setActiveNode] = useState(1);

  const leftNodes = [
    {
      id: 1,
      label: 'Important Clauses',
      count: '8 detected',
      icon: FiCheckSquare,
      color: 'cyan',
      dotColor: 'bg-cyan-400 shadow-[0_0_8px_#00f0ff]',
      borderColor: 'hover:border-cyan-400/50',
      activeBg: 'border-cyan-400 bg-[#0c244d]',
      title: 'Automated Clause Extraction',
      desc: 'DocuMind detects liability, indemnification, warranty, and termination provisions automatically.',
      snippet: 'Clause §14.2: In no event shall either party be liable for indirect, incidental, or special consequential damages.',
    },
    {
      id: 2,
      label: 'People & Organizations',
      count: '5 entities',
      icon: FiUsers,
      color: 'blue',
      dotColor: 'bg-blue-400 shadow-[0_0_8px_#38bdf8]',
      borderColor: 'hover:border-blue-400/50',
      activeBg: 'border-blue-400 bg-[#0d2250]',
      title: 'Named Entity Recognition (NER)',
      desc: 'Identifies authors, company names, key executives, signatories, and organizational entities across pages.',
      snippet: 'Entities Detected: Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides (Design Patterns Authors), Addison-Wesley.',
    },
    {
      id: 3,
      label: 'Potential Risks',
      count: '1 alert',
      icon: FiAlertTriangle,
      color: 'rose',
      dotColor: 'bg-rose-400 shadow-[0_0_8px_#f43f5e]',
      borderColor: 'hover:border-rose-400/50',
      activeBg: 'border-rose-400 bg-[#2d1228]',
      title: 'Proactive Risk Flagging',
      desc: 'Flags ambiguous commitments, tight architectural coupling, compliance gaps, and tight deadlines.',
      snippet: 'Critical Risk Alert: Tight subsystem coupling detected in Chapter 3; recommended refactoring into abstract factory.',
    },
    {
      id: 4,
      label: 'Summary',
      count: '1 generated',
      icon: FiFileText,
      color: 'teal',
      dotColor: 'bg-teal-400 shadow-[0_0_8px_#2dd4bf]',
      borderColor: 'hover:border-teal-400/50',
      activeBg: 'border-teal-400 bg-[#09282d]',
      title: 'Executive AI Synthesis',
      desc: 'High-density multi-page overview generated from dense text with key takeaway bullets.',
      snippet: 'Synthesis: 23 classic software design patterns divided across Creational, Structural, and Behavioral catalogs.',
    },
  ];

  const rightNodes = [
    {
      id: 5,
      label: 'Key Topics',
      count: '7 identified',
      icon: FiTag,
      color: 'purple',
      dotColor: 'bg-purple-400 shadow-[0_0_8px_#c084fc]',
      borderColor: 'hover:border-purple-400/50',
      activeBg: 'border-purple-400 bg-[#241544]',
      title: 'Key Topic Categorization',
      desc: 'Synthesizes overarching concepts and thematic clusters without needing manual tagging.',
      snippet: 'Topics Identified: Creational Patterns • Object-Oriented Design • Factory Method • Polymorphism • Interface Decoupling.',
    },
    {
      id: 6,
      label: 'Key Sections',
      count: '14 mapped',
      icon: FiLayers,
      color: 'indigo',
      dotColor: 'bg-indigo-400 shadow-[0_0_8px_#818cf8]',
      borderColor: 'hover:border-indigo-400/50',
      activeBg: 'border-indigo-400 bg-[#161d4d]',
      title: 'Hierarchical Structure Mapping',
      desc: 'Instant outline generation of chapters, subheadings, tables, and nested legal articles.',
      snippet: 'Section Map: Chapter 1: Introduction • Chapter 2: Case Study • Chapter 3: Creational Patterns • Chapter 4: Structural.',
    },
    {
      id: 7,
      label: 'Important Dates',
      count: '12 detected',
      icon: FiCalendar,
      color: 'sky',
      dotColor: 'bg-sky-400 shadow-[0_0_8px_#38bdf8]',
      borderColor: 'hover:border-sky-400/50',
      activeBg: 'border-sky-400 bg-[#0d2250]',
      title: 'Chronological Timeline Parser',
      desc: 'Parses effective dates, contract renewal deadlines, publication dates, and quarterly targets.',
      snippet: 'Dates Found: October 1994 (Initial Publication), 2024 (Revised Digital Edition), Renewal: 30 days prior.',
    },
    {
      id: 8,
      label: 'Financial Figures',
      count: '8 metrics',
      icon: FiDollarSign,
      color: 'violet',
      dotColor: 'bg-violet-400 shadow-[0_0_8px_#a78bfa]',
      borderColor: 'hover:border-violet-400/50',
      activeBg: 'border-violet-400 bg-[#201542]',
      title: 'Financial & Quantitative Metrics',
      desc: 'Monetary sums, percentage metrics, KPI values and statistical points.',
      snippet: 'Key Metrics: $4.2M estimated refactoring savings • 35% latency reduction • 99.98% runtime reliability target.',
    },
  ];

  const allNodes = [...leftNodes, ...rightNodes];
  const activeData = allNodes.find((n) => n.id === activeNode) || allNodes[0];
  const ActiveIcon = activeData.icon;

  return (
    <section
      id="documents-to-knowledge"
      className="relative py-28 px-4 sm:px-6 lg:px-8 bg-transparent overflow-hidden flex flex-col items-center justify-center"
    >
      {/* 3D Depth Background Watermark & Theme Aurora Glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center select-none z-0">
        <span className="text-[14vw] font-black text-watermark absolute top-1/2 -translate-y-1/2 tracking-[0.2em] whitespace-nowrap opacity-[0.035]">
          KNOWLEDGE CORE
        </span>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[54rem] h-[44rem] bg-gradient-to-br from-blue-600/10 via-purple-600/8 to-transparent rounded-full blur-[140px]" />
        <div className="absolute top-1/3 left-8 w-96 h-96 bg-cyan-500/8 rounded-full blur-[110px]" />
        <div className="absolute bottom-1/3 right-8 w-96 h-96 bg-purple-600/8 rounded-full blur-[110px]" />
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-10 flex flex-col items-center">
        {/* Centered Heading */}
        <div className="max-w-3xl text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[10.5px] font-bold tracking-widest uppercase mb-4 backdrop-blur-xl shadow-[0_0_15px_rgba(0,240,255,0.15)]">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_6px_#00f0ff]" />
            <span>FROM DOCUMENTS TO KNOWLEDGE</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.12] mb-4">
            From Documents to{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-indigo-300 to-purple-400 drop-shadow-[0_0_25px_rgba(99,102,241,0.3)]">
              Knowledge.
            </span>
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl mx-auto font-normal">
            DocuMind doesn't just store your files. It understands what's inside
            them — turning pages into structured, navigable intelligence.
          </p>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            3-COLUMN CLEAN ARCHITECTURE: LEFT CARDS | CENTRAL SYNTHESIS MATRIX | RIGHT CARDS
            ───────────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center w-full my-4 relative z-10">
          {/* ═════════════════════════════════════════════════════════
              LEFT COLUMN: 4 STRUCTURED INSIGHT CARDS
              ═════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-4 flex flex-col gap-3.5 order-2 lg:order-1">
            {leftNodes.map((n) => {
              const Icon = n.icon;
              const isActive = activeNode === n.id;
              return (
                <div
                  key={n.id}
                  onClick={() => setActiveNode(n.id)}
                  className={`p-3.5 rounded-2xl transition-all duration-300 cursor-pointer backdrop-blur-2xl flex items-center justify-between border ${
                    isActive
                      ? 'border-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.4)] scale-[1.02]'
                      : 'border-white/[0.10] hover:border-white/[0.22] hover:scale-[1.01]'
                  }`}
                  style={{
                    backgroundColor: isActive
                      ? 'rgba(12, 36, 77, 0.40)'
                      : 'rgba(8, 16, 40, 0.28)',
                    boxShadow: isActive
                      ? 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.20), 0 8px 24px 0 rgba(0, 0, 0, 0.4)'
                      : 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.12), 0 8px 24px 0 rgba(0, 0, 0, 0.4)',
                  }}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-300 text-sm flex-shrink-0">
                      <Icon />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white tracking-tight truncate">
                        {n.label}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {n.count}
                      </p>
                    </div>
                  </div>
                  <span className={`w-2 h-2 rounded-full ${n.dotColor}`} />
                </div>
              );
            })}
          </div>

          {/* ═════════════════════════════════════════════════════════
              CENTER COLUMN: CENTRAL SYNTHESIS HUB & DOCUMENT PREVIEW
              ═════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-4 relative flex flex-col items-center justify-center p-6 rounded-3xl bg-[#081232]/60 border border-cyan-500/30 backdrop-blur-2xl shadow-[0_0_40px_rgba(0,240,255,0.15)] order-1 lg:order-2 my-auto">
            {/* Center Top Hub */}
            <div className="text-center select-none z-20 px-6 py-4 rounded-2xl bg-[#060e28]/95 border border-cyan-400/50 shadow-[0_0_30px_rgba(0,240,255,0.3)] mb-4">
              <div className="w-10 h-10 mx-auto rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 text-lg mb-2 shadow-[0_0_15px_rgba(0,240,255,0.4)]">
                <FiDatabase />
              </div>
              <p className="text-xs font-black tracking-[0.2em] text-white leading-tight">
                SYNTHESIS
              </p>
              <p className="text-[10px] font-black tracking-[0.22em] text-cyan-400 leading-tight mt-0.5">
                KNOWLEDGE MATRIX
              </p>
            </div>

            {/* Document Synthesis Progress Info */}
            <div className="w-full space-y-2.5 p-3.5 rounded-2xl bg-[#060c20]/80 border border-white/10 text-left">
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-300">
                <span>Design Patterns.pdf</span>
                <span className="text-cyan-400 font-bold">100% Parsed</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full w-full" />
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span>8 Categories Extracted</span>
                <span>487 Pages Synthesized</span>
              </div>
            </div>
          </div>

          {/* ═════════════════════════════════════════════════════════
              RIGHT COLUMN: 4 STRUCTURED INSIGHT CARDS
              ═════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-4 flex flex-col gap-3.5 order-3">
            {rightNodes.map((n) => {
              const Icon = n.icon;
              const isActive = activeNode === n.id;
              return (
                <div
                  key={n.id}
                  onClick={() => setActiveNode(n.id)}
                  className={`p-3.5 rounded-2xl transition-all duration-300 cursor-pointer backdrop-blur-2xl flex items-center justify-between border ${
                    isActive
                      ? 'border-purple-400 shadow-[0_0_20px_rgba(192,132,252,0.4)] scale-[1.02]'
                      : 'border-white/[0.10] hover:border-white/[0.22] hover:scale-[1.01]'
                  }`}
                  style={{
                    backgroundColor: isActive
                      ? 'rgba(36, 21, 68, 0.40)'
                      : 'rgba(8, 16, 40, 0.28)',
                    boxShadow: isActive
                      ? 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.20), 0 8px 24px 0 rgba(0, 0, 0, 0.4)'
                      : 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.12), 0 8px 24px 0 rgba(0, 0, 0, 0.4)',
                  }}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-300 text-sm flex-shrink-0">
                      <Icon />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white tracking-tight truncate">
                        {n.label}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {n.count}
                      </p>
                    </div>
                  </div>
                  <span className={`w-2 h-2 rounded-full ${n.dotColor}`} />
                </div>
              );
            })}
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            4. LIVE INTERACTIVE FEATURE INSPECTOR DRAWER
            ───────────────────────────────────────────────────────────── */}
        <div
          className="w-full max-w-3xl mt-8 p-5 rounded-3xl border border-cyan-400/30 backdrop-blur-2xl flex items-start gap-4 z-20 transition-all duration-300 shadow-[0_15px_40px_rgba(0,0,0,0.6)]"
          style={{
            backgroundColor: 'rgba(8, 16, 40, 0.35)',
            boxShadow:
              'inset 0 1px 1px 0 rgba(255, 255, 255, 0.15), 0 15px 40px 0 rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(28px)',
          }}
        >
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-300 text-lg flex-shrink-0 shadow-sm">
            <ActiveIcon />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs font-bold text-white tracking-tight">
                {activeData.title}
              </p>
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                {activeData.count}
              </span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed font-normal mb-2">
              {activeData.desc}
            </p>
            <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 text-[10.5px] font-mono text-cyan-300/90 leading-snug">
              <span className="text-slate-500 select-none mr-2">&gt;</span>
              {activeData.snippet}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
