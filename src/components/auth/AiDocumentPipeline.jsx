import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

/* ═══════════════════════════════════════════════════════════════
   PREMIUM RECOGNIZABLE DOCUMENT FILE ICONS
   ═══════════════════════════════════════════════════════════════ */

export function WordIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M4 3.5C4 2.67 4.67 2 5.5 2H14.5L20 7.5V20.5C20 21.33 19.33 22 18.5 22H5.5C4.67 22 4 21.33 4 20.5V3.5Z" fill="#1e40af" />
      <path d="M14 2V8H20" fill="#60a5fa" opacity="0.9" />
      <rect x="2" y="7" width="11" height="11" rx="2" fill="#2563eb" />
      <path d="M4.5 9.5L5.8 15L7 11.2L8.2 15L9.5 9.5" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function PdfIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M4 3.5C4 2.67 4.67 2 5.5 2H14.5L20 7.5V20.5C20 21.33 19.33 22 18.5 22H5.5C4.67 22 4 21.33 4 20.5V3.5Z" fill="#991b1b" />
      <path d="M14 2V8H20" fill="#f87171" opacity="0.9" />
      <rect x="2" y="7" width="11" height="11" rx="2" fill="#dc2626" />
      <path d="M4.8 14.5C5.8 13 6.8 10.5 7.5 9.2C8.2 11.5 9.2 14 9.8 15M5.2 13.8C6.5 14.2 8.2 13.8 9.5 13.2" stroke="white" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

export function ExcelIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M4 3.5C4 2.67 4.67 2 5.5 2H14.5L20 7.5V20.5C20 21.33 19.33 22 18.5 22H5.5C4.67 22 4 21.33 4 20.5V3.5Z" fill="#065f46" />
      <path d="M14 2V8H20" fill="#34d399" opacity="0.9" />
      <rect x="2" y="7" width="11" height="11" rx="2" fill="#059669" />
      <path d="M5 9.5L9 15.5M9 9.5L5 15.5" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export function PptxIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M4 3.5C4 2.67 4.67 2 5.5 2H14.5L20 7.5V20.5C20 21.33 19.33 22 18.5 22H5.5C4.67 22 4 21.33 4 20.5V3.5Z" fill="#9a3412" />
      <path d="M14 2V8H20" fill="#fb923c" opacity="0.9" />
      <rect x="2" y="7" width="11" height="11" rx="2" fill="#ea580c" />
      <path d="M5.5 9.5H8C8.8 9.5 9.5 10.1 9.5 11C9.5 11.9 8.8 12.5 8 12.5H5.5V15.5M5.5 12.5H8" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export function CsvIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M4 3.5C4 2.67 4.67 2 5.5 2H14.5L20 7.5V20.5C20 21.33 19.33 22 18.5 22H5.5C4.67 22 4 21.33 4 20.5V3.5Z" fill="#0e7490" />
      <path d="M14 2V8H20" fill="#22d3ee" opacity="0.9" />
      <rect x="2" y="7" width="11" height="11" rx="2" fill="#0891b2" />
      <rect x="4.5" y="9.5" width="2.5" height="2.5" fill="white" />
      <rect x="8" y="9.5" width="2.5" height="2.5" fill="white" />
      <rect x="4.5" y="13" width="2.5" height="2.5" fill="white" />
      <rect x="8" y="13" width="2.5" height="2.5" fill="white" />
    </svg>
  );
}

export function TxtIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M4 3.5C4 2.67 4.67 2 5.5 2H14.5L20 7.5V20.5C20 21.33 19.33 22 18.5 22H5.5C4.67 22 4 21.33 4 20.5V3.5Z" fill="#334155" />
      <path d="M14 2V8H20" fill="#94a3b8" opacity="0.9" />
      <rect x="2" y="7" width="11" height="11" rx="2" fill="#475569" />
      <path d="M4.5 10H9.5M4.5 12.5H9.5M4.5 15H7.5" stroke="white" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

export function FaqIcon({ className = 'w-5 h-5' }) {
  return (
    <div className={`${className} rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/30 border border-white/20`}>
      <span className="text-white font-black text-xs">?</span>
    </div>
  );
}

export function ReportIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="4" fill="#4338ca" />
      <rect x="4" y="13" width="3.8" height="7" rx="1" fill="#818cf8" />
      <rect x="10" y="8" width="3.8" height="12" rx="1" fill="#a5b4fc" />
      <rect x="16" y="4" width="3.8" height="16" rx="1" fill="#c7d2fe" />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════
   EXACT 1:1 RECREATION OF THE REFERENCE AI NEURAL BRAIN
   (Upright Brain Silhouette, Nested Cloud Lobes, Radial Circuit Traces & Bold AI Chip)
   ═══════════════════════════════════════════════════════════════ */

export function ExactReferenceAiBrain({ className = 'w-[310px] h-[340px]' }) {
  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      {/* Subtle, gentle ambient glow (no harsh glare) */}
      <div className="absolute inset-4 rounded-full bg-cyan-500/10 blur-[36px] pointer-events-none" />
      <div className="absolute inset-10 rounded-full bg-blue-600/15 blur-[28px] pointer-events-none" />

      {/* SVG Brain Illustration with subtle, clean accent */}
      <svg
        viewBox="0 0 320 360"
        className="w-full h-full relative z-10 drop-shadow-[0_0_8px_rgba(0,210,255,0.25)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <style>{`
            @keyframes circuitThinkingFlow {
              0% {
                stroke-dashoffset: 48;
              }
              100% {
                stroke-dashoffset: 0;
              }
            }
            @keyframes synapticNodeBreathing {
              0%, 100% {
                r: 3.2px;
                opacity: 0.8;
                filter: drop-shadow(0 0 1.5px #00f0ff);
              }
              50% {
                r: 4.2px;
                opacity: 1;
                filter: drop-shadow(0 0 4px #00f0ff);
              }
            }
            @keyframes fissureThinkingPulse {
              0% {
                stroke-dashoffset: 40;
                opacity: 0.6;
              }
              50% {
                opacity: 1;
              }
              100% {
                stroke-dashoffset: 0;
                opacity: 0.6;
              }
            }
            @keyframes aiChipCoreGlow {
              0%, 100% {
                filter: drop-shadow(0 0 4px #00f0ff);
              }
              50% {
                filter: drop-shadow(0 0 8px #00f0ff);
              }
            }
            .brain-thinking-line {
              stroke-dasharray: 6 6;
              animation: circuitThinkingFlow 2s linear infinite;
            }
            .brain-thinking-line-fast {
              stroke-dasharray: 8 6;
              animation: circuitThinkingFlow 1.5s linear infinite;
            }
            .brain-thinking-line-reverse {
              stroke-dasharray: 6 6;
              animation: circuitThinkingFlow 2.2s linear infinite reverse;
            }
            .brain-fissure-animated {
              stroke-dasharray: 8 6;
              animation: fissureThinkingPulse 1.8s linear infinite;
            }
            .brain-node-pulse {
              animation: synapticNodeBreathing 2.4s ease-in-out infinite;
            }
          `}</style>

          <filter id="exact-glow-filter" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <linearGradient id="neon-cyan-exact" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00f0ff" />
            <stop offset="60%" stopColor="#00d4ff" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>

          <linearGradient id="circuit-blue-exact" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00f0ff" />
            <stop offset="65%" stopColor="#0099ff" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>

          <linearGradient id="active-pulse-cyan" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="50%" stopColor="#00f0ff" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>
        </defs>

        {/* ─── 1. OUTER SCALLOPED LOBES (LEFT HEMISPHERE - UPRIGHT BRAIN SHAPE) ─── */}
        <path
          d="M 152 46
             C 134 26, 106 26, 94 48
             C 74 46, 56 64, 56 86
             C 36 94, 26 118, 32 140
             C 18 152, 18 178, 30 194
             C 18 210, 26 236, 44 246
             C 42 264, 62 284, 82 282
             C 94 298, 120 304, 138 294
             C 148 304, 152 304, 152 304"
          stroke="url(#neon-cyan-exact)"
          strokeWidth="3.6"
          strokeLinecap="round"
          filter="url(#exact-glow-filter)"
        />

        {/* Inner parallel accent contour (Left) */}
        <path
          d="M 148 58
             C 134 42, 114 42, 104 58
             C 88 56, 72 70, 72 88
             C 56 96, 48 116, 52 134
             C 40 144, 40 166, 50 178
             C 40 192, 46 214, 60 222
             C 58 238, 74 254, 90 252
             C 100 264, 120 270, 134 262
             C 142 270, 148 270, 148 270"
          stroke="#00f0ff"
          strokeWidth="1.4"
          strokeOpacity="0.45"
          strokeLinecap="round"
        />

        {/* ─── 2. OUTER SCALLOPED LOBES (RIGHT HEMISPHERE - UPRIGHT BRAIN SHAPE) ─── */}
        <path
          d="M 168 46
             C 186 26, 214 26, 226 48
             C 246 46, 264 64, 264 86
             C 284 94, 294 118, 288 140
             C 302 152, 302 178, 290 194
             C 302 210, 294 236, 276 246
             C 278 264, 258 284, 238 282
             C 226 298, 200 304, 182 294
             C 172 304, 168 304, 168 304"
          stroke="url(#neon-cyan-exact)"
          strokeWidth="3.6"
          strokeLinecap="round"
          filter="url(#exact-glow-filter)"
        />

        {/* Inner parallel accent contour (Right) */}
        <path
          d="M 172 58
             C 186 42, 206 42, 216 58
             C 232 56, 248 70, 248 88
             C 264 96, 272 116, 268 134
             C 280 144, 280 166, 270 178
             C 280 192, 274 214, 260 222
             C 262 238, 246 254, 230 252
             C 220 264, 200 270, 186 262
             C 178 270, 172 270, 172 270"
          stroke="#00f0ff"
          strokeWidth="1.4"
          strokeOpacity="0.45"
          strokeLinecap="round"
        />

        {/* ─── 3. CENTRAL LONGITUDINAL FISSURE DIVIDER & BOTTOM STEM (ANIMATED STREAM) ─── */}
        {/* Base line */}
        <line x1="160" y1="36" x2="160" y2="120" stroke="#0099ff" strokeWidth="2.8" opacity="0.4" />
        <line x1="160" y1="220" x2="160" y2="324" stroke="#0099ff" strokeWidth="2.8" opacity="0.4" />

        {/* Active thinking moving energy pulse */}
        <line x1="160" y1="36" x2="160" y2="120" stroke="#00f0ff" strokeWidth="3" filter="url(#exact-glow-filter)" className="brain-fissure-animated" />
        <line x1="160" y1="220" x2="160" y2="324" stroke="#00f0ff" strokeWidth="3" filter="url(#exact-glow-filter)" className="brain-fissure-animated" />
        <circle cx="160" cy="324" r="5" fill="#00f0ff" filter="url(#exact-glow-filter)" className="brain-node-pulse" />

        {/* ─── 4. INTERNAL RADIAL NEURAL CIRCUIT TRACES (LEFT HEMISPHERE - ANIMATED FLOW) ─── */}
        {/* Base Static Dim Traces */}
        <g stroke="#1d4ed8" strokeWidth="2" strokeLinecap="round" opacity="0.45">
          <path d="M 134 122 L 134 90 L 142 76 L 142 54" />
          <path d="M 120 126 L 98 100 L 98 76" />
          <path d="M 112 138 L 84 116 L 66 116" />
          <path d="M 108 158 L 74 158 L 52 158" />
          <path d="M 108 184 L 78 184 L 58 200" />
          <path d="M 114 206 L 86 230 L 72 230" />
          <path d="M 126 218 L 102 246 L 102 268" />
          <path d="M 140 222 L 140 252 L 146 270" />
        </g>

        {/* Moving Active Neural Thinking Pulses (Flowing Radiating Lines) */}
        <g stroke="url(#active-pulse-cyan)" strokeWidth="2.8" strokeLinecap="round" filter="url(#exact-glow-filter)">
          {/* Top Branch 1 */}
          <path d="M 134 122 L 134 90 L 142 76 L 142 54" className="brain-thinking-line" />
          <circle cx="142" cy="54" r="4.2" fill="#00f0ff" className="brain-node-pulse" style={{ animationDelay: '0.1s' }} />

          {/* Top-Left Branch 2 */}
          <path d="M 120 126 L 98 100 L 98 76" className="brain-thinking-line-fast" />
          <circle cx="98" cy="76" r="4.2" fill="#00f0ff" className="brain-node-pulse" style={{ animationDelay: '0.4s' }} />

          {/* Upper-Left Branch 3 */}
          <path d="M 112 138 L 84 116 L 66 116" className="brain-thinking-line" />
          <circle cx="66" cy="116" r="4.2" fill="#00f0ff" className="brain-node-pulse" style={{ animationDelay: '0.7s' }} />

          {/* Mid-Left Branch 4 (Direct from main data stream) */}
          <path d="M 108 158 L 74 158 L 52 158" className="brain-thinking-line-fast" />
          <circle cx="52" cy="158" r="5" fill="#ffffff" filter="url(#exact-glow-filter)" className="brain-node-pulse" style={{ animationDelay: '0.2s' }} />

          {/* Lower-Mid-Left Branch 5 */}
          <path d="M 108 184 L 78 184 L 58 200" className="brain-thinking-line-reverse" />
          <circle cx="58" cy="200" r="4.2" fill="#00f0ff" className="brain-node-pulse" style={{ animationDelay: '0.9s' }} />

          {/* Lower-Left Branch 6 */}
          <path d="M 114 206 L 86 230 L 72 230" className="brain-thinking-line" />
          <circle cx="72" cy="230" r="4.2" fill="#00f0ff" className="brain-node-pulse" style={{ animationDelay: '1.2s' }} />

          {/* Bottom-Left Branch 7 */}
          <path d="M 126 218 L 102 246 L 102 268" className="brain-thinking-line-fast" />
          <circle cx="102" cy="268" r="4.2" fill="#00f0ff" className="brain-node-pulse" style={{ animationDelay: '0.5s' }} />

          {/* Bottom Branch 8 */}
          <path d="M 140 222 L 140 252 L 146 270" className="brain-thinking-line" />
          <circle cx="146" cy="270" r="4.2" fill="#00f0ff" className="brain-node-pulse" style={{ animationDelay: '1.5s' }} />
        </g>

        {/* ─── 5. INTERNAL RADIAL NEURAL CIRCUIT TRACES (RIGHT HEMISPHERE - ANIMATED FLOW) ─── */}
        {/* Base Static Dim Traces */}
        <g stroke="#1d4ed8" strokeWidth="2" strokeLinecap="round" opacity="0.45">
          <path d="M 186 122 L 186 90 L 178 76 L 178 54" />
          <path d="M 200 126 L 222 100 L 222 76" />
          <path d="M 208 138 L 236 116 L 254 116" />
          <path d="M 212 158 L 246 158 L 268 158" />
          <path d="M 212 184 L 242 184 L 262 200" />
          <path d="M 206 206 L 234 230 L 248 230" />
          <path d="M 194 218 L 218 246 L 218 268" />
          <path d="M 180 222 L 180 252 L 174 270" />
        </g>

        {/* Moving Active Neural Thinking Pulses (Flowing Radiating Lines) */}
        <g stroke="url(#active-pulse-cyan)" strokeWidth="2.8" strokeLinecap="round" filter="url(#exact-glow-filter)">
          {/* Top Branch 1 */}
          <path d="M 186 122 L 186 90 L 178 76 L 178 54" className="brain-thinking-line-fast" />
          <circle cx="178" cy="54" r="4.2" fill="#00f0ff" className="brain-node-pulse" style={{ animationDelay: '0.3s' }} />

          {/* Top-Right Branch 2 */}
          <path d="M 200 126 L 222 100 L 222 76" className="brain-thinking-line" />
          <circle cx="222" cy="76" r="4.2" fill="#00f0ff" className="brain-node-pulse" style={{ animationDelay: '0.6s' }} />

          {/* Upper-Right Branch 3 */}
          <path d="M 208 138 L 236 116 L 254 116" className="brain-thinking-line-fast" />
          <circle cx="254" cy="116" r="4.2" fill="#00f0ff" className="brain-node-pulse" style={{ animationDelay: '0.8s' }} />

          {/* Mid-Right Branch 4 */}
          <path d="M 212 158 L 246 158 L 268 158" className="brain-thinking-line" />
          <circle cx="268" cy="158" r="5" fill="#ffffff" filter="url(#exact-glow-filter)" className="brain-node-pulse" style={{ animationDelay: '0.1s' }} />

          {/* Lower-Mid-Right Branch 5 */}
          <path d="M 212 184 L 242 184 L 262 200" className="brain-thinking-line-reverse" />
          <circle cx="262" cy="200" r="4.2" fill="#00f0ff" className="brain-node-pulse" style={{ animationDelay: '1.1s' }} />

          {/* Lower-Right Branch 6 */}
          <path d="M 206 206 L 234 230 L 248 230" className="brain-thinking-line-fast" />
          <circle cx="248" cy="230" r="4.2" fill="#00f0ff" className="brain-node-pulse" style={{ animationDelay: '0.4s' }} />

          {/* Bottom-Right Branch 7 */}
          <path d="M 194 218 L 218 246 L 218 268" className="brain-thinking-line" />
          <circle cx="218" cy="268" r="4.2" fill="#00f0ff" className="brain-node-pulse" style={{ animationDelay: '1.3s' }} />

          {/* Bottom Branch 8 */}
          <path d="M 180 222 L 180 252 L 174 270" className="brain-thinking-line-fast" />
          <circle cx="174" cy="270" r="4.2" fill="#00f0ff" className="brain-node-pulse" style={{ animationDelay: '1.7s' }} />
        </g>

        {/* ─── 6. PROMINENT CENTRAL "AI" SQUARE MICROPROCESSOR CHIP ─── */}
        <g style={{ animation: 'aiChipCoreGlow 3s ease-in-out infinite' }}>
          {/* Outer glowing cyan chip frame */}
          <rect
            x="110"
            y="120"
            width="100"
            height="100"
            rx="18"
            fill="#050a18"
            stroke="#00f0ff"
            strokeWidth="3.8"
            filter="url(#exact-glow-filter)"
          />

          {/* Inner Cyan Accent Border */}
          <rect
            x="118"
            y="128"
            width="84"
            height="84"
            rx="12"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="1.4"
            opacity="0.85"
          />

          {/* Microchip Pin Connection Dots on Edges with Pulse */}
          <circle cx="130" cy="120" r="2.4" fill="#00f0ff" className="brain-node-pulse" />
          <circle cx="150" cy="120" r="2.4" fill="#00f0ff" className="brain-node-pulse" />
          <circle cx="170" cy="120" r="2.4" fill="#00f0ff" className="brain-node-pulse" />
          <circle cx="190" cy="120" r="2.4" fill="#00f0ff" className="brain-node-pulse" />

          <circle cx="130" cy="220" r="2.4" fill="#00f0ff" className="brain-node-pulse" />
          <circle cx="150" cy="220" r="2.4" fill="#00f0ff" className="brain-node-pulse" />
          <circle cx="170" cy="220" r="2.4" fill="#00f0ff" className="brain-node-pulse" />
          <circle cx="190" cy="220" r="2.4" fill="#00f0ff" className="brain-node-pulse" />

          <circle cx="110" cy="140" r="2.4" fill="#00f0ff" className="brain-node-pulse" />
          <circle cx="110" cy="160" r="2.4" fill="#00f0ff" className="brain-node-pulse" />
          <circle cx="110" cy="180" r="2.4" fill="#00f0ff" className="brain-node-pulse" />
          <circle cx="110" cy="200" r="2.4" fill="#00f0ff" className="brain-node-pulse" />

          <circle cx="210" cy="140" r="2.4" fill="#00f0ff" className="brain-node-pulse" />
          <circle cx="210" cy="160" r="2.4" fill="#00f0ff" className="brain-node-pulse" />
          <circle cx="210" cy="180" r="2.4" fill="#00f0ff" className="brain-node-pulse" />
          <circle cx="210" cy="200" r="2.4" fill="#00f0ff" className="brain-node-pulse" />

          {/* Bold, Sharp White "AI" Typography with Dynamic Thinking Glow */}
          <text
            x="160"
            y="184"
            textAnchor="middle"
            fill="#ffffff"
            fontSize="42"
            fontWeight="900"
            fontFamily="'Inter', sans-serif"
            letterSpacing="2px"
            style={{ textShadow: '0 0 16px #00f0ff, 0 0 32px #38bdf8' }}
          >
            AI
          </text>
        </g>
      </svg>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ORGANICALLY SCATTERED FLOATING DOCUMENTS CONFIGURATION
   ═══════════════════════════════════════════════════════════════ */

const DOCUMENTS = [
  {
    id: 'docx',
    label: 'DOCX',
    icon: WordIcon,
    topPx: 10,
    leftPx: 75,
    widthPx: 94,
    anchorX: 169,
    anchorY: 28,
    floatDuration: 4.8,
    floatY: 3.5,
    floatX: 1.5,
    delay: 0,
    targetY: 86,
  },
  {
    id: 'pdf',
    label: 'PDF',
    icon: PdfIcon,
    topPx: 65,
    leftPx: 0,
    widthPx: 94,
    anchorX: 94,
    anchorY: 83,
    floatDuration: 5.4,
    floatY: -3,
    floatX: 1.2,
    delay: 0.3,
    targetY: 120,
  },
  {
    id: 'xlsx',
    label: 'XLSX',
    icon: ExcelIcon,
    topPx: 120,
    leftPx: 90,
    widthPx: 94,
    anchorX: 184,
    anchorY: 138,
    floatDuration: 4.6,
    floatY: 2.8,
    floatX: -1.5,
    delay: 0.6,
    targetY: 152,
  },
  {
    id: 'report',
    label: 'REPORT',
    icon: ReportIcon,
    topPx: 175,
    leftPx: 15,
    widthPx: 106,
    anchorX: 121,
    anchorY: 193,
    floatDuration: 6.2,
    floatY: -3.5,
    floatX: 1.8,
    delay: 1.1,
    targetY: 180,
  },
  {
    id: 'pptx',
    label: 'PPTX',
    icon: PptxIcon,
    topPx: 230,
    leftPx: 85,
    widthPx: 94,
    anchorX: 179,
    anchorY: 248,
    floatDuration: 5.8,
    floatY: -3.5,
    floatX: 2,
    delay: 0.9,
    targetY: 212,
  },
  {
    id: 'csv',
    label: 'CSV',
    icon: CsvIcon,
    topPx: 285,
    leftPx: 0,
    widthPx: 94,
    anchorX: 94,
    anchorY: 303,
    floatDuration: 5.0,
    floatY: 3,
    floatX: -1.2,
    delay: 0.4,
    targetY: 242,
  },
  {
    id: 'txt',
    label: 'TXT',
    icon: TxtIcon,
    topPx: 340,
    leftPx: 70,
    widthPx: 94,
    anchorX: 164,
    anchorY: 358,
    floatDuration: 5.2,
    floatY: -2.8,
    floatX: 1.5,
    delay: 0.7,
    targetY: 268,
  },
  {
    id: 'faq',
    label: 'FAQ',
    icon: FaqIcon,
    topPx: 395,
    leftPx: 10,
    widthPx: 94,
    anchorX: 104,
    anchorY: 413,
    floatDuration: 4.9,
    floatY: 2.5,
    floatX: -1.5,
    delay: 0.2,
    targetY: 278,
  },
];

/* ═══════════════════════════════════════════════════════════════
   MAIN AI DOCUMENT INTELLIGENCE PIPELINE COMPONENT
   (Long Flowing Fiber-Optic Neural Streams + Multi-Particle System + Exact AI Brain)
   ═══════════════════════════════════════════════════════════════ */

export default function AiDocumentPipeline() {
  const { primaryStreams, secondaryFilaments, centralCoreBeam, chevronPositions } = useMemo(() => {
    const convergeX = 390;
    const convergeY = 215;
    const brainEntryX = 620;

    // 1. Long Primary Fiber-Optic Neural Streams (8 Document Connections)
    const primary = DOCUMENTS.map((doc, idx) => {
      const startX = doc.anchorX;
      const startY = doc.anchorY;
      const targetY = doc.targetY;

      const cp1X = startX + (convergeX - startX) * 0.48;
      const cp1Y = startY;
      const cp2X = convergeX - 45;
      const cp2Y = convergeY + (startY - convergeY) * 0.15;

      const d = `M ${startX} ${startY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${convergeX} ${convergeY} C ${convergeX + 65} ${convergeY}, ${brainEntryX - 45} ${targetY}, ${brainEntryX} ${targetY}`;

      const durations = [3.0, 3.4, 3.8, 4.2, 4.6, 3.2, 3.6, 4.0];
      const speed = durations[idx % durations.length];

      return {
        id: doc.id,
        d,
        startX,
        startY,
        brainEntryX,
        targetY,
        color: doc.id === 'pptx' || doc.id === 'report' ? '#c084fc' : '#38bdf8',
        speed,
        delay: doc.delay,
      };
    });

    // 2. Extra 12 Dense Secondary & Harmonic Filaments (Layered Flow)
    const secondary = [
      {
        id: 'fil-1',
        d: `M 169 35 C 260 40, 350 180, ${convergeX} ${convergeY} C 470 215, 570 95, ${brainEntryX} 95`,
        color: '#00f0ff',
        speed: 3.2,
        delay: 0.1,
      },
      {
        id: 'fil-2',
        d: `M 94 90 C 220 95, 330 190, ${convergeX} ${convergeY} C 480 215, 580 130, ${brainEntryX} 130`,
        color: '#38bdf8',
        speed: 3.6,
        delay: 0.4,
      },
      {
        id: 'fil-3',
        d: `M 184 145 C 280 150, 360 200, ${convergeX} ${convergeY} C 490 215, 580 165, ${brainEntryX} 165`,
        color: '#60a5fa',
        speed: 3.4,
        delay: 0.7,
      },
      {
        id: 'fil-4',
        d: `M 121 200 C 250 205, 340 210, ${convergeX} ${convergeY} C 490 215, 580 195, ${brainEntryX} 195`,
        color: '#c084fc',
        speed: 3.8,
        delay: 0.2,
      },
      {
        id: 'fil-5',
        d: `M 179 255 C 290 250, 360 225, ${convergeX} ${convergeY} C 490 215, 580 225, ${brainEntryX} 225`,
        color: '#38bdf8',
        speed: 3.5,
        delay: 0.8,
      },
      {
        id: 'fil-6',
        d: `M 94 310 C 240 300, 340 235, ${convergeX} ${convergeY} C 480 215, 580 255, ${brainEntryX} 255`,
        color: '#818cf8',
        speed: 3.9,
        delay: 0.5,
      },
      {
        id: 'fil-7',
        d: `M 164 365 C 280 350, 360 245, ${convergeX} ${convergeY} C 470 215, 570 285, ${brainEntryX} 285`,
        color: '#38bdf8',
        speed: 4.1,
        delay: 1.0,
      },
      {
        id: 'fil-8',
        d: `M 104 415 C 260 400, 350 255, ${convergeX} ${convergeY} C 460 215, 560 310, ${brainEntryX} 310`,
        color: '#c084fc',
        speed: 4.3,
        delay: 0.3,
      },
    ];

    // 3. Central Core Laser Stream into Brain
    const coreBeam = `M ${convergeX - 25} ${convergeY} L ${brainEntryX} ${convergeY}`;

    // 4. Glowing Animated Chevrons
    const chevrons = [
      { x: convergeX + 10, delay: 0 },
      { x: convergeX + 45, delay: 0.2 },
      { x: convergeX + 80, delay: 0.4 },
      { x: convergeX + 115, delay: 0.6 },
      { x: convergeX + 150, delay: 0.8 },
    ];

    return {
      primaryStreams: primary,
      secondaryFilaments: secondary,
      centralCoreBeam: coreBeam,
      chevronPositions: chevrons,
    };
  }, []);

  return (
    <div className="relative w-full select-none py-1 my-1" style={{ minHeight: '440px' }}>
      {/* ─── 1. RUNNING DENSE NEURAL DATA STREAMS SVG CANVAS ─── */}
      <svg
        viewBox="0 0 880 440"
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
        fill="none"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="fiber-blue-flow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0284c7" stopOpacity="0.3" />
            <stop offset="45%" stopColor="#38bdf8" stopOpacity="0.85" />
            <stop offset="85%" stopColor="#00f0ff" stopOpacity="1" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="1" />
          </linearGradient>

          <linearGradient id="fiber-purple-flow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.3" />
            <stop offset="45%" stopColor="#c084fc" stopOpacity="0.85" />
            <stop offset="85%" stopColor="#e879f9" stopOpacity="1" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="1" />
          </linearGradient>

          <linearGradient id="laser-core-stream" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.7" />
            <stop offset="60%" stopColor="#00f0ff" stopOpacity="1" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="1" />
          </linearGradient>

          <filter id="neural-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ─── SECONDARY HARMONIC FILAMENTS (DENSE LAYER) ─── */}
        {secondaryFilaments.map((f) => (
          <g key={f.id} opacity="0.4">
            <path
              d={f.d}
              stroke={f.color}
              strokeWidth="1.2"
              strokeLinecap="round"
            />
            <path
              d={f.d}
              stroke={f.color}
              strokeWidth="1.6"
              strokeDasharray="12 80"
              filter="url(#neural-glow)"
              style={{
                animation: `dashFlow ${f.speed}s linear infinite`,
                animationDelay: `${f.delay}s`,
              }}
            />
            <circle r="1.8" fill="#ffffff" filter="url(#neural-glow)">
              <animateMotion
                path={f.d}
                dur={`${f.speed}s`}
                repeatCount="indefinite"
                begin={`${f.delay}s`}
                keyPoints="0;1"
                keyTimes="0;1"
              />
            </circle>
            <circle r="1.6" fill="#00f0ff">
              <animateMotion
                path={f.d}
                dur={`${f.speed}s`}
                repeatCount="indefinite"
                begin={`${f.delay + f.speed * 0.5}s`}
                keyPoints="0;1"
                keyTimes="0;1"
              />
            </circle>
          </g>
        ))}

        {/* ─── PRIMARY LONG SWEEPING NEURAL DATA STREAMS ─── */}
        {primaryStreams.map((p) => {
          const isPurple = p.id === 'pptx' || p.id === 'report';
          const streamGrad = isPurple ? 'url(#fiber-purple-flow)' : 'url(#fiber-blue-flow)';

          return (
            <g key={p.id}>
              {/* 1. Thin Static Fiber-Optic Guide Line */}
              <path
                d={p.d}
                stroke={p.color}
                strokeWidth="1.5"
                strokeOpacity="0.25"
                strokeLinecap="round"
              />

              {/* 2. Moving Electric Energy Pulse Segment */}
              <path
                d={p.d}
                stroke={streamGrad}
                strokeWidth="2.2"
                strokeDasharray="18 100"
                strokeLinecap="round"
                filter="url(#neural-glow)"
                style={{
                  animation: `dashFlow ${p.speed}s linear infinite`,
                  animationDelay: `${p.delay}s`,
                }}
              />

              {/* 3. MULTIPLE MOVING DATA PARTICLES (3-4 on EVERY line) */}
              <circle r="2.8" fill="#ffffff" filter="url(#neural-glow)">
                <animateMotion
                  path={p.d}
                  dur={`${p.speed}s`}
                  repeatCount="indefinite"
                  begin={`${p.delay}s`}
                  keyPoints="0;1"
                  keyTimes="0;1"
                />
              </circle>
              <circle r="4.5" fill={p.color} opacity="0.85" filter="url(#neural-glow)">
                <animateMotion
                  path={p.d}
                  dur={`${p.speed}s`}
                  repeatCount="indefinite"
                  begin={`${p.delay}s`}
                  keyPoints="0;1"
                  keyTimes="0;1"
                />
              </circle>

              <circle r="2.2" fill="#ffffff" filter="url(#neural-glow)">
                <animateMotion
                  path={p.d}
                  dur={`${p.speed}s`}
                  repeatCount="indefinite"
                  begin={`${p.delay + p.speed * 0.3}s`}
                  keyPoints="0;1"
                  keyTimes="0;1"
                />
              </circle>
              <circle r="3.8" fill={p.color} opacity="0.75">
                <animateMotion
                  path={p.d}
                  dur={`${p.speed}s`}
                  repeatCount="indefinite"
                  begin={`${p.delay + p.speed * 0.3}s`}
                  keyPoints="0;1"
                  keyTimes="0;1"
                />
              </circle>

              <circle r="2.0" fill="#00f0ff">
                <animateMotion
                  path={p.d}
                  dur={`${p.speed}s`}
                  repeatCount="indefinite"
                  begin={`${p.delay + p.speed * 0.6}s`}
                  keyPoints="0;1"
                  keyTimes="0;1"
                />
              </circle>

              <circle r="1.8" fill="#ffffff">
                <animateMotion
                  path={p.d}
                  dur={`${p.speed}s`}
                  repeatCount="indefinite"
                  begin={`${p.delay + p.speed * 0.85}s`}
                  keyPoints="0;1"
                  keyTimes="0;1"
                />
              </circle>

              {/* Document Origin Terminal Connection Node */}
              <circle
                cx={p.startX}
                cy={p.startY}
                r="3.2"
                fill="#00f0ff"
                filter="url(#neural-glow)"
              />

              {/* Brain Synaptic Arrival Node on Outer Cortical Contour */}
              <circle
                cx={p.brainEntryX}
                cy={p.targetY}
                r="3.8"
                fill="#00f0ff"
                filter="url(#neural-glow)"
              />
            </g>
          );
        })}

        {/* ─── CENTRAL CORE HORIZONTAL LASER BEAM ─── */}
        <path
          d={centralCoreBeam}
          stroke="#00f0ff"
          strokeWidth="4.5"
          strokeOpacity="0.25"
          filter="url(#neural-glow)"
        />
        <path
          d={centralCoreBeam}
          stroke="url(#laser-core-stream)"
          strokeWidth="2.8"
          strokeLinecap="round"
          filter="url(#neural-glow)"
        />

        {/* Fast Laser Sparks */}
        <circle r="3.6" fill="#ffffff" filter="url(#neural-glow)">
          <animateMotion
            path={centralCoreBeam}
            dur="0.8s"
            repeatCount="indefinite"
            keyPoints="0;1"
            keyTimes="0;1"
          />
        </circle>
        <circle r="2.8" fill="#00f0ff">
          <animateMotion
            path={centralCoreBeam}
            dur="0.8s"
            repeatCount="indefinite"
            begin="0.4s"
            keyPoints="0;1"
            keyTimes="0;1"
          />
        </circle>

        {/* ─── LARGE ANIMATED GLOWING CHEVRON ARROWS (>>>>) ─── */}
        {chevronPositions.map((chev, ci) => (
          <g key={ci} transform={`translate(${chev.x}, 215)`}>
            <path
              d="M -5 -14 L 7 0 L -5 14"
              stroke="#00f0ff"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              filter="url(#neural-glow)"
              style={{
                animation: `pulse 1.5s ease-in-out infinite`,
                animationDelay: `${chev.delay}s`,
              }}
            />
            <path
              d="M -5 -14 L 7 0 L -5 14"
              stroke="#ffffff"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </g>
        ))}
      </svg>

      {/* ─── 2. ORGANICALLY SCATTERED FLOATING DOCUMENTS (FAR LEFT) ─── */}
      <div className="relative z-10 w-full h-[440px]">
        {DOCUMENTS.map((doc) => {
          const IconComponent = doc.icon;

          return (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: doc.delay }}
              className="absolute"
              style={{
                top: `${doc.topPx}px`,
                left: `${doc.leftPx}px`,
              }}
            >
              {/* Organic independent floating physics */}
              <motion.div
                animate={{
                  y: [-doc.floatY, doc.floatY, -doc.floatY],
                  x: [-doc.floatX, doc.floatX, -doc.floatX],
                }}
                transition={{
                  duration: doc.floatDuration,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: doc.delay,
                }}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#080e20]/95 border border-white/12 backdrop-blur-md shadow-xl shadow-black/70 hover:border-cyan-400/50 hover:shadow-cyan-500/25 transition-all cursor-default"
                style={{
                  width: `${doc.widthPx}px`,
                }}
              >
                <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center">
                  <IconComponent className="w-5 h-5" />
                </div>
                <span className="text-[12px] font-extrabold tracking-wider text-white font-mono">
                  {doc.label}
                </span>
              </motion.div>
            </motion.div>
          );
        })}

        {/* ─── 3. CENTRAL AI PROCESSING BADGE ─── */}
        <div
          className="absolute top-[66%] left-[45%] -translate-y-1/2 flex items-center gap-2 z-10 pointer-events-none"
        >
          <div className="px-3 py-1.5 rounded-full bg-[#081024]/95 border border-indigo-500/50 text-indigo-200 font-mono text-[10px] font-extrabold tracking-wider uppercase shadow-[0_0_16px_rgba(99,102,241,0.3)] flex items-center gap-2 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>AI PROCESSING</span>
          </div>
        </div>

        {/* ─── 4. EXACT REFERENCE AI BRAIN (FAR RIGHT) ─── */}
        <div className="absolute top-[50%] -right-4 -translate-y-1/2 z-10">
          <motion.div
            animate={{
              scale: [1, 1.02, 1],
            }}
            transition={{
              duration: 3.8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <ExactReferenceAiBrain className="w-[310px] h-[340px]" />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
