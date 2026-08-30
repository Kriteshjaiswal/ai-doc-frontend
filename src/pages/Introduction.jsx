import React, { useEffect } from 'react';
import IntroHeader from '../components/intro/IntroHeader';
import HeroSection from '../components/intro/HeroSection';
import KeyPagesShowcaseSection from '../components/intro/KeyPagesShowcaseSection';
import FiveStepsSection from '../components/intro/FiveStepsSection';
import FinalCtaSection from '../components/intro/FinalCtaSection';
import IntroFooter from '../components/intro/IntroFooter';

export default function Introduction() {
  useEffect(() => {
    document.title = 'DocuMind — Enterprise AI Document Intelligence';
  }, []);

  return (
    <div className="min-h-screen bg-[#030712] text-white selection:bg-cyan-500/30 selection:text-cyan-200 overflow-x-hidden font-sans relative scroll-smooth">
      {/* ═══════════════════════════════════════════════════════════════
          GLOBAL ANIMATED STARFIELD — spans entire page behind all sections
          ═══════════════════════════════════════════════════════════════ */}
      <div className="stars-layer-1" />
      <div className="stars-layer-2" />
      <div className="stars-layer-3" />

      {/* Header Navigation */}
      <IntroHeader />

      <main className="relative z-10">
        {/* Section 1: Clean Centered Hero */}
        <HeroSection />

        {/* Section 2: Key Pages Showcase (Transparent Glass Cards & 'How it Works' / 'Why Add This' Briefs) */}
        <KeyPagesShowcaseSection />

        {/* Section 3: 5 Simple Steps Pipeline */}
        <FiveStepsSection />

        {/* Section 4: Final Call to Action */}
        <FinalCtaSection />
      </main>

      {/* Footer */}
      <IntroFooter />
    </div>
  );
}
