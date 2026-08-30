import React from 'react';
import { Link } from 'react-router-dom';
import {
  FiArrowRight,
  FiFileText,
  FiCpu,
  FiActivity,
  FiMessageSquare,
  FiCreditCard,
  FiEdit3,
} from 'react-icons/fi';

export default function HeroSection() {
  const quickKeyPages = [
    { name: 'Document Ingestion', icon: FiFileText, route: '#page-section-documents' },
    { name: 'Document Overview', icon: FiCpu, route: '#page-section-overview' },
    { name: 'Grounded AI Chat', icon: FiMessageSquare, route: '#page-section-chat' },
    { name: 'Active Flashcards', icon: FiCreditCard, route: '#page-section-flashcards' },
    { name: 'Research Notes', icon: FiEdit3, route: '#page-section-notes' },
    { name: 'Mission Dashboard', icon: FiActivity, route: '#page-section-dashboard' },
  ];

  const scrollToSection = (hash) => {
    const element = document.querySelector(hash);
    if (element) {
      const yOffset = -90;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <section
      id="hero"
      className="relative pt-36 pb-20 sm:pt-44 sm:pb-24 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center overflow-hidden bg-transparent"
    >
      {/* ─────────────────────────────────────────────────────────────
          1. HUGE DEPTH BACKGROUND WATERMARK & AMBIENT AURORA
          ───────────────────────────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center select-none">
        <span className="text-[14vw] font-black text-watermark absolute top-1/2 -translate-y-1/2 tracking-[0.2em] whitespace-nowrap opacity-[0.03]">
          DOCUMIND
        </span>

        {/* Soft Radial Ambient Glows */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[58rem] h-[44rem] bg-gradient-to-b from-blue-600/15 via-purple-600/10 to-transparent rounded-full blur-[140px] animate-light-pulse" />
        <div className="absolute top-1/3 left-10 w-[32rem] h-[32rem] bg-cyan-500/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 right-10 w-[32rem] h-[32rem] bg-purple-600/10 rounded-full blur-[120px]" />
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. CENTERED HEADLINE, SUBTITLE & CALL TO ACTION BUTTONS
          ───────────────────────────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto w-full flex flex-col items-center text-center z-10">
        {/* Pill Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[10.5px] font-bold tracking-widest uppercase backdrop-blur-xl mb-6 shadow-[0_0_20px_rgba(0,240,255,0.2)]">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#00f0ff]" />
          <span>ENTERPRISE AI DOCUMENT INTELLIGENCE</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-[4.25rem] font-black text-white tracking-tight leading-[1.08] mb-6">
          Your Documents. <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-indigo-300 to-purple-400 drop-shadow-[0_0_35px_rgba(99,102,241,0.35)]">
            Understood by AI.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto font-normal mb-9">
          Upload multi-format documents, inspect automated risk & clause extractions, query with verified page citations, and boost retention with 3D flashcards.
        </p>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link
            to="/login?mode=register"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-bold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 shadow-[0_0_25px_rgba(99,102,241,0.55)] border border-white/20 transition-all hover:scale-105 active:scale-95 group cursor-pointer"
          >
            <span>Get Started Free</span>
            <FiArrowRight className="text-sm transition-transform group-hover:translate-x-0.5" />
          </Link>
          <button
            onClick={() => scrollToSection('#key-pages')}
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800/90 border border-blue-500/25 backdrop-blur-xl transition-all shadow-sm cursor-pointer"
          >
            <span>Explore Key Pages</span>
            <span className="text-cyan-400 text-xs">↓</span>
          </button>
        </div>

        {/* Quick Key Page Jump Badges */}
        <div className="flex items-center justify-center gap-2 flex-wrap pt-10 max-w-3xl">
          {quickKeyPages.map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={idx}
                onClick={() => scrollToSection(item.route)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium text-slate-300 hover:text-cyan-300 bg-white/[0.04] hover:bg-cyan-500/15 border border-white/[0.08] hover:border-cyan-500/40 transition-all cursor-pointer backdrop-blur-md shadow-sm"
              >
                <Icon className="text-xs text-cyan-400" />
                <span>{item.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
