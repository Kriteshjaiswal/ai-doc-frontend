import { FiCpu, FiZap } from 'react-icons/fi';

/**
 * 3D Rotating Glass/Wireframe Cube Loader
 */
export function ThreeDCubeLoader({ size = 'md', text = 'Loading...' }) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 space-y-4">
      <div className={`perspective-800 ${sizeClasses[size]}`}>
        <div className="w-full h-full relative preserve-3d animate-spin-3d">
          {/* Front */}
          <div className="absolute inset-0 bg-indigo-500/20 border-2 border-indigo-500/80 rounded-xl backdrop-blur-md translate-z-4 transform -translate-z-8" />
          {/* Back */}
          <div className="absolute inset-0 bg-blue-500/20 border-2 border-blue-500/80 rounded-xl backdrop-blur-md transform rotateY-180 -translate-z-8" />
          {/* Left */}
          <div className="absolute inset-0 bg-violet-500/20 border-2 border-violet-500/80 rounded-xl backdrop-blur-md transform -rotateY-90 -translate-z-8" />
          {/* Right */}
          <div className="absolute inset-0 bg-cyan-500/20 border-2 border-cyan-500/80 rounded-xl backdrop-blur-md transform rotateY-90 -translate-z-8" />
          {/* Top */}
          <div className="absolute inset-0 bg-purple-500/20 border-2 border-purple-500/80 rounded-xl backdrop-blur-md transform rotateX-90 -translate-z-8" />
          {/* Bottom */}
          <div className="absolute inset-0 bg-emerald-500/20 border-2 border-emerald-500/80 rounded-xl backdrop-blur-md transform -rotateX-90 -translate-z-8" />
        </div>
      </div>
      {text && (
        <p className="text-xs font-bold text-slate-600 dark:text-slate-300 tracking-wider uppercase animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
}

/**
 * Modern Sleek AI Thinking Loader for Chat Module with Question Analysis
 */
export function ThreeDAiThinkingLoader({
  currentQuestion = '',
  docName = '',
  statusText = 'AI is analyzing & synthesizing response...',
}) {
  return (
    <div className="p-4 sm:p-4.5 rounded-2xl bg-gradient-to-br from-indigo-50/90 via-slate-50/90 to-blue-50/50 dark:from-[#13192B] dark:via-[#0F1424] dark:to-[#0B0F19] border border-indigo-200/80 dark:border-indigo-900/50 shadow-sm backdrop-blur-md max-w-xl space-y-2.5 animate-in fade-in zoom-in-95 duration-200">
      {/* Top Header Row: Animated Pulse Dots & Status Label */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2.5">
          {/* Synchronized Wave Pulse Dots */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 dark:bg-indigo-400 animate-bounce [animation-duration:0.8s] [animation-delay:-0.3s]" />
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 dark:bg-cyan-400 animate-bounce [animation-duration:0.8s] [animation-delay:-0.15s]" />
            <span className="w-2.5 h-2.5 rounded-full bg-violet-600 dark:bg-violet-400 animate-bounce [animation-duration:0.8s]" />
          </div>
          <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
            Question Analysis & Synthesis
          </span>
        </div>

        {docName ? (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10.5px] font-semibold border border-indigo-500/20 truncate max-w-[200px]">
            📄 {docName}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10.5px] font-semibold border border-emerald-500/20">
            ⚡ General AI Knowledge
          </span>
        )}
      </div>

      {/* Live Question Analysis Card */}
      {currentQuestion && (
        <div className="px-3.5 py-2.5 rounded-xl bg-white/80 dark:bg-black/40 border border-slate-200/70 dark:border-white/[0.08] text-xs text-slate-700 dark:text-slate-200 font-medium leading-relaxed shadow-2xs">
          <div className="flex items-start gap-2">
            <span className="px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 font-mono text-[10px] font-bold uppercase tracking-wider flex-shrink-0 mt-0.5">
              Query
            </span>
            <span className="font-semibold text-slate-800 dark:text-slate-100 italic">
              "{currentQuestion}"
            </span>
          </div>
        </div>
      )}

      {/* Live Multi-Step Status Bar */}
      <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-medium pt-0.5">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping flex-shrink-0" />
          <span className="truncate">
            Parsing intent • Correlating knowledge • Generating structured answer
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * 3D Ring Perspective Spinner
 */
export function ThreeDSpinner({ size = 'md' }) {
  const dim = size === 'sm' ? 'w-5 h-5' : size === 'lg' ? 'w-12 h-12' : 'w-8 h-8';

  return (
    <div className={`relative perspective-800 ${dim} flex items-center justify-center`}>
      <div className="absolute inset-0 rounded-full border-2 border-indigo-500 border-t-transparent animate-ring-3d" />
      <div className="absolute inset-0 rounded-full border-2 border-cyan-400 border-b-transparent animate-ring-reverse-3d" />
    </div>
  );
}
