import React, { useEffect, useState } from 'react';

/**
 * Animated SVG Bezier Energy Ribbon that flows dynamically across sections as the user scrolls
 */
export default function ScrollPathConnector() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress(window.scrollY / totalScroll);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-40">
      <svg
        className="w-full h-full"
        viewBox="0 0 1440 4800"
        fill="none"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Main Gradient Line */}
          <linearGradient id="scroll-path-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.8" />
            <stop offset="25%" stopColor="#3B82F6" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.8" />
            <stop offset="75%" stopColor="#EC4899" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#00F0FF" stopOpacity="0.9" />
          </linearGradient>

          {/* Glowing Filter */}
          <filter id="path-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer Glow Path */}
        <path
          d="M 720 100 Q 1100 800 720 1500 T 720 2800 Q 200 3500 720 4200 T 720 4700"
          stroke="url(#scroll-path-grad)"
          strokeWidth="3"
          strokeDasharray="12 12"
          className="animate-dash-flow"
          filter="url(#path-glow)"
        />

        {/* Inner Bright Fiber */}
        <path
          d="M 720 100 Q 1100 800 720 1500 T 720 2800 Q 200 3500 720 4200 T 720 4700"
          stroke="#00F0FF"
          strokeWidth="1.5"
          strokeOpacity="0.7"
        />
      </svg>
    </div>
  );
}
