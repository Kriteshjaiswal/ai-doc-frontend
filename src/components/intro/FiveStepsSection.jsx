import React, { useState, useEffect } from 'react';
import {
  FiUploadCloud,
  FiCpu,
  FiLayers,
  FiMessageSquare,
  FiGrid,
  FiArrowRight,
} from 'react-icons/fi';

export default function FiveStepsSection() {
  const [activeStep, setActiveStep] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const steps = [
    {
      num: '01',
      title: 'Upload',
      subtitle: 'Multi-Format Ingestion',
      desc: 'Drop in PDF, DOCX, TXT or scanned files. Automatic OCR and structure parsing begin instantly.',
      icon: FiUploadCloud,
      color: '#38bdf8',
      glow: 'rgba(56, 189, 248, 0.45)',
      gradient: 'from-sky-400 to-blue-500',
    },
    {
      num: '02',
      title: 'Understand',
      subtitle: 'Deep Semantic Context',
      desc: 'AI reads the full document context, maps hierarchies, tables, headers, and semantic cross-references.',
      icon: FiCpu,
      color: '#06b6d4',
      glow: 'rgba(6, 182, 212, 0.45)',
      gradient: 'from-cyan-400 to-teal-500',
    },
    {
      num: '03',
      title: 'Extract',
      subtitle: 'Automated Insight Discovery',
      desc: 'Critical clauses, potential risks, financial metrics, organizations, and key dates are structured.',
      icon: FiLayers,
      color: '#2dd4bf',
      glow: 'rgba(45, 212, 191, 0.45)',
      gradient: 'from-teal-400 to-emerald-500',
    },
    {
      num: '04',
      title: 'Ask',
      subtitle: 'Grounded Dialogue',
      desc: 'Converse in natural language with verified page-cited answers and bounding-box evidence highlights.',
      icon: FiMessageSquare,
      color: '#a855f7',
      glow: 'rgba(168, 85, 247, 0.45)',
      gradient: 'from-purple-400 to-fuchsia-500',
    },
    {
      num: '05',
      title: 'Explore & Organize',
      subtitle: 'Unified Intelligence Hub',
      desc: 'Synthesize study notes, generate spaced-repetition flashcards, and compare documents in one workspace.',
      icon: FiGrid,
      color: '#818cf8',
      glow: 'rgba(129, 140, 248, 0.45)',
      gradient: 'from-indigo-400 to-blue-500',
    },
  ];

  // Auto-cycle through steps every 3.2 seconds unless hovered
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 3200);
    return () => clearInterval(interval);
  }, [isAutoPlaying, steps.length]);

  return (
    <section
      id="five-steps"
      className="relative py-28 px-4 sm:px-6 lg:px-8 bg-transparent overflow-hidden flex flex-col items-center justify-center"
    >
      {/* ─────────────────────────────────────────────────────────────
          1. BACKGROUND AURORA & WATERMARK
          ───────────────────────────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center select-none">
        <span className="text-[14vw] font-black text-watermark absolute top-1/2 -translate-y-1/2 tracking-[0.2em] whitespace-nowrap opacity-[0.03]">
          WORKFLOW
        </span>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[56rem] h-[30rem] bg-gradient-to-r from-blue-600/12 via-cyan-500/10 to-purple-600/12 rounded-full blur-[140px]" />
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-10 flex flex-col items-center">
        {/* Centered Heading */}
        <div className="max-w-3xl text-center mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[10.5px] font-bold tracking-widest uppercase mb-4 backdrop-blur-md shadow-[0_0_15px_rgba(0,240,255,0.15)]">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_6px_#00f0ff]" />
            <span>HOW DOCUMIND WORKS</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.12] mb-4">
            From File to Understanding <br />
            in{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-cyan-300 to-purple-400 drop-shadow-[0_0_25px_rgba(56,189,248,0.3)]">
              5 Simple Steps.
            </span>
          </h2>

          <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-xl mx-auto font-normal">
            Upload your files once and let DocuMind synthesize deep structured intelligence across all modules automatically.
          </p>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            2. 5 STEP CONNECTED WORKFLOW PIPELINE
            ───────────────────────────────────────────────────────────── */}
        <div
          className="w-full relative my-4"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          {/* Animated Connecting Laser Conduit (Desktop) */}
          <div className="hidden lg:block absolute top-[68px] left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-sky-500/20 via-cyan-400/40 to-purple-500/20 z-0">
            {/* Glowing Traveling Data Pulse */}
            <div
              className="absolute top-0 bottom-0 w-44 bg-gradient-to-r from-transparent via-cyan-300 to-transparent blur-[1px] shadow-[0_0_12px_#00f0ff] transition-all duration-700 ease-out"
              style={{
                left: `${(activeStep / (steps.length - 1)) * 80}%`,
              }}
            />
          </div>

          {/* 5 Step Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 relative z-10">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              const isActive = activeStep === idx;

              return (
                <div
                  key={step.num}
                  onClick={() => setActiveStep(idx)}
                  onMouseEnter={() => setActiveStep(idx)}
                  className={`relative p-5 rounded-3xl transition-all duration-500 cursor-pointer flex flex-col items-center text-center group ${
                    isActive
                      ? 'border border-cyan-400/40 -translate-y-2'
                      : 'border border-white/[0.06] hover:border-white/[0.15] hover:-translate-y-1'
                  }`}
                  style={{
                    backgroundColor: isActive
                      ? 'rgba(8, 18, 48, 0.40)'
                      : 'rgba(8, 16, 40, 0.20)',
                    backdropFilter: 'blur(24px)',
                    WebkitBackdropFilter: 'blur(24px)',
                    boxShadow: isActive
                      ? `inset 0 1px 2px 0 rgba(255, 255, 255, 0.20), 0 20px 45px 0 rgba(0, 0, 0, 0.6), 0 0 35px ${step.glow}`
                      : 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.08), 0 8px 24px 0 rgba(0, 0, 0, 0.4)',
                  }}
                >
                  {/* Free-Floating Large Illuminated Icon (NO CIRCLES/RINGS AROUND IT) */}
                  <div className="relative mb-6 flex items-center justify-center h-20 w-20">
                    {/* Soft Neon Ambient Glow Halo behind icon */}
                    <div
                      className={`absolute inset-0 rounded-full blur-2xl transition-all duration-500 pointer-events-none ${
                        isActive ? 'scale-150 opacity-90' : 'scale-100 opacity-30 group-hover:opacity-70 group-hover:scale-125'
                      }`}
                      style={{ backgroundColor: step.color }}
                    />

                    {/* Standalone Large Icon with Floating Physics & Neon Drop-Shadow */}
                    <div
                      className={`relative z-10 transition-all duration-500 flex items-center justify-center ${
                        isActive
                          ? 'scale-125 -translate-y-1'
                          : 'scale-100 group-hover:scale-115 group-hover:-translate-y-1'
                      }`}
                      style={{
                        color: step.color,
                        filter: isActive
                          ? `drop-shadow(0 0 16px ${step.color}) drop-shadow(0 0 30px ${step.color})`
                          : `drop-shadow(0 0 8px ${step.glow})`,
                      }}
                    >
                      <Icon className="text-4xl sm:text-5xl lg:text-[44px]" />
                    </div>
                  </div>

                  {/* Step Number & Title Pill */}
                  <div className="flex items-center gap-2 mb-2 z-10">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10.5px] font-black tracking-wider transition-all duration-300 ${
                        isActive
                          ? 'bg-cyan-400/25 text-cyan-200 border border-cyan-400/60 shadow-[0_0_10px_rgba(0,240,255,0.4)]'
                          : 'bg-white/10 text-slate-300 border border-white/10 group-hover:border-cyan-400/30 group-hover:text-cyan-300'
                      }`}
                    >
                      {step.num}
                    </span>
                    <h3
                      className={`text-base sm:text-lg font-bold tracking-tight transition-colors duration-300 ${
                        isActive ? 'text-white' : 'text-slate-200 group-hover:text-white'
                      }`}
                    >
                      {step.title}
                    </h3>
                  </div>

                  {/* Step Subtitle */}
                  <p
                    className="text-[11px] font-semibold tracking-wide uppercase mb-2.5 transition-colors duration-300"
                    style={{ color: isActive ? step.color : '#94a3b8' }}
                  >
                    {step.subtitle}
                  </p>

                  {/* Step Description */}
                  <p className="text-xs text-slate-400 leading-relaxed font-normal">
                    {step.desc}
                  </p>

                  {/* Bottom Active Glow Accent Bar */}
                  <div
                    className={`mt-4 w-12 h-1 rounded-full transition-all duration-500 ${
                      isActive ? 'w-20 opacity-100' : 'w-6 opacity-0 group-hover:opacity-40'
                    }`}
                    style={{
                      backgroundColor: step.color,
                      boxShadow: `0 0 10px ${step.color}`,
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            3. INTERACTIVE ACTIVE STEP DETAIL DRAWER
            ───────────────────────────────────────────────────────────── */}
        <div
          className="w-full max-w-2xl mt-8 p-5 rounded-3xl border border-cyan-400/25 backdrop-blur-2xl flex items-center justify-between gap-4 z-20 transition-all duration-500 shadow-[0_15px_40px_rgba(0,0,0,0.6)]"
          style={{
            backgroundColor: 'rgba(8, 16, 40, 0.32)',
            boxShadow:
              'inset 0 1px 1px 0 rgba(255, 255, 255, 0.15), 0 15px 40px 0 rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(28px)',
          }}
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <span
              className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black text-white flex-shrink-0"
              style={{
                backgroundColor: steps[activeStep].color,
                boxShadow: `0 0 15px ${steps[activeStep].glow}`,
              }}
            >
              {steps[activeStep].num}
            </span>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white tracking-tight">
                Step {steps[activeStep].num}: {steps[activeStep].title} — {steps[activeStep].subtitle}
              </p>
              <p className="text-[11px] text-slate-300 leading-snug mt-0.5 truncate">
                {steps[activeStep].desc}
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveStep((prev) => (prev + 1) % steps.length)}
            className="px-3.5 py-1.5 rounded-xl bg-cyan-500/15 border border-cyan-500/35 text-cyan-300 text-xs font-semibold hover:bg-cyan-500/25 transition-all flex items-center gap-1.5 flex-shrink-0 cursor-pointer"
          >
            <span>Next Step</span>
            <FiArrowRight className="text-xs" />
          </button>
        </div>
      </div>
    </section>
  );
}
