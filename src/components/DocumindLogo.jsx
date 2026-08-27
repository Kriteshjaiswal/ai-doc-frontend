import React from 'react';

/**
 * ═══════════════════════════════════════════════════════════════════════
 * DOCUMIND OFFICIAL BRAND LOGO (HIGH-FIDELITY VECTOR CONVERSION)
 * Faithful, transparent, vector recreation of the user's product mark:
 * - Dynamic Neon 3D "D" Ribbon (Cyan -> Royal Blue -> Magenta Glow)
 * - Multi-layer Document Stack with Data Lines
 * - Neural Data Filaments with floating data particles
 * - AI Human Head Silhouette with Glowing Neural Brain & Synapse Core
 * ═══════════════════════════════════════════════════════════════════════
 */
export function DocumindIcon({ className = 'w-8 h-8', animated = false }) {
  const id = React.useId();

  return (
    <svg
      className={`${className} flex-shrink-0 select-none ${
        animated ? 'hover:scale-105 transition-transform duration-300' : ''
      }`}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="DocuMind AI Logo"
    >
      <defs>
        {/* Neon D Outer Ribbon Gradient */}
        <linearGradient id={`${id}-d-ribbon`} x1="15" y1="10" x2="110" y2="105" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#00F0FF" />
          <stop offset="25%" stopColor="#00A3FF" />
          <stop offset="60%" stopColor="#2563EB" />
          <stop offset="85%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#C026D3" />
        </linearGradient>

        {/* Outer Rim Purple Glow Gradient */}
        <linearGradient id={`${id}-purple-rim`} x1="60" y1="20" x2="115" y2="90" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.4" />
          <stop offset="50%" stopColor="#A855F7" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#EC4899" stopOpacity="0.8" />
        </linearGradient>

        {/* Back Stack Page 1 (Purple/Blue) */}
        <linearGradient id={`${id}-page-back`} x1="5" y1="40" x2="35" y2="90" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#6366F1" />
          <stop offset="100%" stopColor="#9333EA" />
        </linearGradient>

        {/* Back Stack Page 2 (Cyan/Blue) */}
        <linearGradient id={`${id}-page-mid`} x1="10" y1="30" x2="42" y2="85" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#00E5FF" />
          <stop offset="100%" stopColor="#2563EB" />
        </linearGradient>

        {/* Main Foreground Document Page */}
        <linearGradient id={`${id}-page-front`} x1="18" y1="20" x2="52" y2="80" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="40%" stopColor="#F0F9FF" />
          <stop offset="100%" stopColor="#BAE6FD" />
        </linearGradient>

        {/* Neural Synapse Lines Stream */}
        <linearGradient id={`${id}-neural-grad`} x1="38" y1="40" x2="90" y2="70" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="40%" stopColor="#00E5FF" />
          <stop offset="75%" stopColor="#818CF8" />
          <stop offset="100%" stopColor="#E879F9" />
        </linearGradient>

        {/* Synapse Core Nucleus Glow Filter */}
        <filter id={`${id}-core-glow`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Soft Ambient Shadow */}
        <filter id={`${id}-drop-shadow`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#0284C7" floodOpacity="0.35" />
        </filter>
      </defs>

      <g filter={`url(#${id}-drop-shadow)`}>
        {/* ═══════════════════════════════════════════════════════
            1. LARGE D-SHAPED NEURAL ENCLOSURE ARCH
            ═══════════════════════════════════════════════════════ */}
        {/* Outer Glowing Edge Arc (Purple Neon Accent) */}
        <path
          d="M 36 10 C 72 8 112 24 112 60 C 112 94 72 112 36 110 L 46 96 C 72 96 96 82 96 60 C 96 38 72 24 46 24 Z"
          fill={`url(#${id}-purple-rim)`}
        />

        {/* Main Solid 3D Gradient "D" Ribbon */}
        <path
          d="M 32 12 C 68 12 106 26 106 60 C 106 92 68 108 32 108 C 24 108 18 102 20 94 L 24 88 C 28 88 34 88 40 88 C 66 88 88 76 88 60 C 88 44 66 32 40 32 C 34 32 28 32 24 32 L 20 26 C 18 18 24 12 32 12 Z"
          fill={`url(#${id}-d-ribbon)`}
        />

        {/* ═══════════════════════════════════════════════════════
            2. MULTI-LAYER DOCUMENT STACK (LEFT SIDE)
            ═══════════════════════════════════════════════════════ */}
        {/* Layer 3 - Back Page (Tilted Left, Purple) */}
        <path
          d="M 12 52 L 22 28 C 23 26 25 25 28 26 L 40 31 C 42 32 43 34 42 37 L 34 78 C 33 80 31 82 28 81 L 16 76 C 13 75 11 72 12 69 Z"
          fill={`url(#${id}-page-back)`}
          opacity="0.85"
        />

        {/* Layer 2 - Middle Page (Tilted Mid, Cyan) */}
        <path
          d="M 16 46 L 24 24 C 25 22 27 21 30 22 L 44 27 C 46 28 47 30 46 33 L 39 80 C 38 82 36 84 33 83 L 20 78 C 17 77 15 74 16 71 Z"
          fill={`url(#${id}-page-mid)`}
          opacity="0.9"
        />

        {/* Layer 1 - Foreground Main Document (Clean Page with Folded Corner) */}
        <path
          d="M 22 30 C 22 26 25 23 29 23 L 42 23 L 52 33 L 52 82 C 52 86 49 89 45 89 L 29 89 C 25 89 22 86 22 82 Z"
          fill={`url(#${id}-page-front)`}
          stroke="#0284C7"
          strokeWidth="1.5"
        />

        {/* Folded Page Corner */}
        <path
          d="M 42 23 L 42 31 C 42 32.5 43.5 33 45 33 L 52 33 Z"
          fill="#94A3B8"
        />

        {/* Document Data Content Lines */}
        <rect x="27" y="40" width="16" height="3" rx="1.5" fill="#0284C7" />
        <rect x="27" y="47" width="18" height="3" rx="1.5" fill="#0284C7" />
        <rect x="27" y="54" width="14" height="3" rx="1.5" fill="#0284C7" />
        <rect x="27" y="61" width="17" height="3" rx="1.5" fill="#0284C7" />
        <rect x="27" y="68" width="10" height="3" rx="1.5" fill="#38BDF8" />

        {/* ═══════════════════════════════════════════════════════
            3. NEURAL SYNAPSE STREAMS & DATA PARTICLES
            ═══════════════════════════════════════════════════════ */}
        {/* Stream Lines Flowing from Doc Lines to Mind */}
        <path
          d="M 46 41 C 56 41 60 38 68 40 C 72 41 74 44 76 46"
          stroke={`url(#${id}-neural-grad)`}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M 48 48 C 58 48 64 45 70 48 C 74 50 75 54 78 57"
          stroke={`url(#${id}-neural-grad)`}
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M 44 55 C 54 55 62 58 68 56 C 73 54 75 58 77 64"
          stroke={`url(#${id}-neural-grad)`}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M 47 62 C 54 62 58 67 66 65 C 70 64 72 68 74 72"
          stroke={`url(#${id}-neural-grad)`}
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Floating Data Bits / Synapse Pixels */}
        <rect x="54" y="32" width="3.5" height="3.5" rx="1" fill="#00E5FF" />
        <rect x="60" y="27" width="2.5" height="2.5" rx="0.8" fill="#38BDF8" />
        <rect x="49" y="70" width="3" height="3" rx="0.8" fill="#C084FC" />
        <rect x="58" y="75" width="3" height="3" rx="0.8" fill="#818CF8" />

        {/* ═══════════════════════════════════════════════════════
            4. AI HUMAN MIND SILHOUETTE + NEURAL BRAIN NETWORK
            ═══════════════════════════════════════════════════════ */}
        {/* Stylized Human/AI Profile Silhouette */}
        <path
          d="M 58 98 C 66 94 72 86 74 76 C 76 74 79 72 83 71 C 86 70 87 66 85 63 C 83 60 85 58 87 56 C 90 53 91 48 89 44 C 86 38 82 32 74 30 C 66 28 60 32 58 35 C 57 37 59 40 62 39 C 68 37 75 40 76 46 C 74 48 72 52 74 56 C 76 60 76 66 73 70 C 70 74 68 84 56 90 Z"
          fill="#0B1528"
          stroke={`url(#${id}-neural-grad)`}
          strokeWidth="1.5"
          opacity="0.95"
        />

        {/* Neural Brain Cortex Network (Tree of Intelligence) */}
        {/* Synapse Branching Lines */}
        <path
          d="M 74 76 L 76 66 L 78 57 L 76 46 L 70 42 M 76 66 L 82 62 M 78 57 L 85 52 L 86 44 M 76 46 L 82 40 L 78 35 L 72 34 M 78 57 L 74 48 L 68 44"
          stroke={`url(#${id}-neural-grad)`}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Neural Synapse Nodes (Glowing Constellation) */}
        <circle cx="72" cy="34" r="2.5" fill="#00F0FF" />
        <circle cx="78" cy="35" r="2.5" fill="#38BDF8" />
        <circle cx="82" cy="40" r="2.5" fill="#818CF8" />
        <circle cx="86" cy="44" r="2.5" fill="#C084FC" />
        <circle cx="85" cy="52" r="2.5" fill="#F472B6" />
        <circle cx="82" cy="62" r="2.5" fill="#A855F7" />
        <circle cx="70" cy="42" r="2.5" fill="#00E5FF" />
        <circle cx="68" cy="44" r="2" fill="#38BDF8" />
        <circle cx="74" cy="48" r="2.5" fill="#818CF8" />
        <circle cx="74" cy="76" r="2" fill="#6366F1" />

        {/* Central Luminous AI Mind Nucleus (Core Spark with Radial Glow) */}
        <circle cx="78" cy="57" r="5" fill="#FFFFFF" filter={`url(#${id}-core-glow)`} />
        <circle cx="78" cy="57" r="2.5" fill="#00F0FF" />
      </g>
    </svg>
  );
}

/**
 * ═══════════════════════════════════════════════════════════════════════
 * FULL BRAND LOGO COMPONENT
 * [ ICON ] DocuMind (with modern typography & AI intelligence tag)
 * ═══════════════════════════════════════════════════════════════════════
 */
export default function DocumindLogo({
  size = 'md', // 'sm' | 'md' | 'lg' | 'xl'
  showText = true,
  showSubtitle = true,
  className = '',
}) {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const titleSizes = {
    sm: 'text-base',
    md: 'text-lg sm:text-xl',
    lg: 'text-2xl sm:text-3xl',
    xl: 'text-3xl sm:text-4xl',
  };

  const subtitleSizes = {
    sm: 'text-[8px] tracking-[0.18em]',
    md: 'text-[9px] tracking-[0.22em]',
    lg: 'text-[10px] tracking-[0.25em]',
    xl: 'text-xs tracking-[0.25em]',
  };

  return (
    <div className={`flex items-center gap-3 select-none group ${className}`}>
      {/* High-Fidelity Vector Icon Mark */}
      <DocumindIcon className={`${iconSizes[size] || iconSizes.md} transition-transform duration-300 group-hover:scale-105`} />

      {/* Typography: "Docu" (Solid White/Dark) + "Mind" (Electric Gradient) */}
      {showText && (
        <div className="flex flex-col leading-none">
          <div className={`font-black tracking-tight flex items-baseline ${titleSizes[size] || titleSizes.md}`}>
            <span className="text-slate-900 dark:text-white font-extrabold">
              Docu
            </span>
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-fuchsia-500 bg-clip-text text-transparent font-black ml-0.5">
              Mind
            </span>
          </div>

          {showSubtitle && (
            <span
              className={`uppercase font-bold font-mono text-slate-400 dark:text-slate-500 mt-1 ${subtitleSizes[size] || subtitleSizes.md}`}
            >
              AI INTELLIGENCE
            </span>
          )}
        </div>
      )}
    </div>
  );
}
