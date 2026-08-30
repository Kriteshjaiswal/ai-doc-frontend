import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import { DocumindIcon } from '../DocumindLogo';
import { useAuth } from '../../context/AuthContext';

export default function IntroHeader() {
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (hash) => {
    const element = document.querySelector(hash);
    if (element) {
      const yOffset = -85;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#030712]/90 backdrop-blur-xl border-b border-blue-500/20 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.7)]'
          : 'bg-transparent py-4 sm:py-5 border-b border-white/[0.04]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left: Brand Logo & Title */}
        <Link
          to="/"
          className="flex items-center gap-3 group select-none flex-shrink-0"
        >
          <DocumindIcon className="w-8 h-8 sm:w-9 sm:h-9 transition-transform duration-300 group-hover:scale-105" />
          <div className="flex flex-col">
            <span className="text-base sm:text-lg font-bold tracking-tight text-white leading-none">
              DocuMind
            </span>
            <span className="text-[8.5px] sm:text-[9px] font-bold tracking-[0.22em] text-cyan-400 uppercase leading-tight mt-0.5">
              AI INTELLIGENCE
            </span>
          </div>
        </Link>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          <button
            onClick={() => scrollTo('#hero')}
            className="px-3 py-1.5 rounded-full text-xs font-medium text-slate-300 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
          >
            Overview
          </button>
          <button
            onClick={() => scrollTo('#key-pages')}
            className="px-3 py-1.5 rounded-full text-xs font-semibold text-cyan-300 hover:text-cyan-200 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 transition-all cursor-pointer shadow-[0_0_12px_rgba(0,240,255,0.15)]"
          >
            Key Pages Showcase
          </button>
          <button
            onClick={() => scrollTo('#page-section-overview')}
            className="px-3 py-1.5 rounded-full text-xs font-medium text-slate-300 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
          >
            Intelligence
          </button>
          <button
            onClick={() => scrollTo('#page-section-chat')}
            className="px-3 py-1.5 rounded-full text-xs font-medium text-slate-300 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
          >
            AI Chat
          </button>
          <button
            onClick={() => scrollTo('#page-section-flashcards')}
            className="px-3 py-1.5 rounded-full text-xs font-medium text-slate-300 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
          >
            Flashcards
          </button>
          <button
            onClick={() => scrollTo('#cta')}
            className="px-3 py-1.5 rounded-full text-xs font-medium text-slate-300 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
          >
            Get Started
          </button>
        </nav>

        {/* Right: Auth Action Buttons */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {isAuthenticated ? (
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full text-xs font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-[0_0_20px_rgba(59,130,246,0.45)] border border-white/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>Dashboard</span>
              <FiArrowRight className="text-xs" />
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-semibold text-slate-200 hover:text-white bg-[#0a1128]/80 hover:bg-[#121f48] border border-blue-500/25 hover:border-cyan-400/50 backdrop-blur-md transition-all shadow-sm cursor-pointer"
              >
                Sign In
              </Link>
              <Link
                to="/login?mode=register"
                className="px-4 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs font-bold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 shadow-[0_0_20px_rgba(99,102,241,0.5)] border border-white/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5 cursor-pointer"
              >
                <span>Get Started</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
