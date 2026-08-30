import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

export default function FinalCtaSection() {
  return (
    <section
      id="cta"
      className="relative py-28 px-4 sm:px-6 lg:px-8 bg-[#030712] overflow-hidden flex flex-col items-center justify-center"
    >
      {/* Ambient Lighting */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[48rem] h-[36rem] bg-gradient-to-tr from-indigo-600/15 via-purple-600/15 to-transparent rounded-full blur-[130px]" />
      </div>

      <div className="max-w-4xl mx-auto w-full relative z-10 flex flex-col items-center">
        {/* Large Rounded Glass Card */}
        <div className="w-full p-10 sm:p-14 rounded-3xl bg-[#081028]/90 border border-blue-500/35 backdrop-blur-3xl shadow-[0_20px_70px_rgba(0,0,0,0.85)] flex flex-col items-center text-center relative overflow-hidden">
          {/* Top accent glow line */}
          <div className="absolute top-0 left-1/4 right-1/4 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 via-indigo-500 to-transparent shadow-[0_0_15px_#00f0ff]" />

          {/* Heading */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.12] mb-3">
            Your Documents <br />
            Have{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-indigo-300 to-purple-400 drop-shadow-[0_0_25px_rgba(99,102,241,0.3)]">
              More to Say.
            </span>
          </h2>

          {/* Subtitle */}
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-md font-normal mb-8">
            Let DocuMind help you find it.
          </p>

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-3.5">
            <Link
              to="/login?mode=register"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 shadow-[0_0_25px_rgba(99,102,241,0.55)] border border-white/20 transition-all hover:scale-105 active:scale-95 group cursor-pointer"
            >
              <span>Get Started</span>
              <FiArrowRight className="text-xs transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center px-6 py-3 rounded-full text-xs sm:text-sm font-semibold text-slate-300 hover:text-white bg-[#0a1128]/80 hover:bg-[#121f48] border border-blue-500/25 backdrop-blur-md transition-all shadow-sm cursor-pointer"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
