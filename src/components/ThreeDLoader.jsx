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
 * High-tech 3D AI HUD Thinking Loader for Chat Module
 */
export function ThreeDAiThinkingLoader({ statusText = 'Analyzing document & synthesizing AI answer...' }) {
  return (
    <div className="flex gap-4 items-start p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-indigo-50/80 via-blue-50/40 to-slate-50/80 dark:from-indigo-950/40 dark:via-slate-900/60 dark:to-slate-900/80 border border-indigo-200/80 dark:border-indigo-800/60 shadow-lg shadow-indigo-500/5 backdrop-blur-md max-w-xl animate-slide-in">
      {/* 3D Floating Glowing Orb Container */}
      <div className="relative flex flex-col items-center flex-shrink-0 pt-1">
        {/* Floating 3D Orb */}
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-xl shadow-indigo-500/40 animate-float-3d border border-white/20">
          <FiCpu className="text-lg animate-pulse" />
        </div>

        {/* 3D Floor Shadow */}
        <div className="w-8 h-2 mt-2 bg-indigo-900/30 dark:bg-indigo-400/20 rounded-full blur-xs animate-shadow-pulse" />
      </div>

      {/* Details & Wave Animation */}
      <div className="flex-1 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-500/10 dark:bg-indigo-400/20 text-indigo-600 dark:text-indigo-300 text-[10px] font-extrabold uppercase tracking-wider border border-indigo-500/20">
              <FiZap className="text-amber-400 animate-spin" />
              <span>AI Thinking HUD</span>
            </span>
          </div>

          {/* 3D Audio-Wave Visualizer Bars */}
          <div className="flex items-end gap-1 h-7 px-2 py-1 bg-slate-900/10 dark:bg-slate-900/60 rounded-lg border border-slate-200/40 dark:border-slate-800">
            <div className="w-1 bg-gradient-to-t from-blue-500 to-indigo-500 rounded-full animate-wave-bar-1" />
            <div className="w-1 bg-gradient-to-t from-indigo-500 to-violet-500 rounded-full animate-wave-bar-2" />
            <div className="w-1 bg-gradient-to-t from-violet-500 to-purple-500 rounded-full animate-wave-bar-3" />
            <div className="w-1 bg-gradient-to-t from-purple-500 to-pink-500 rounded-full animate-wave-bar-4" />
            <div className="w-1 bg-gradient-to-t from-pink-500 to-cyan-500 rounded-full animate-wave-bar-5" />
          </div>
        </div>

        {/* Status Prompt */}
        <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 leading-relaxed">
          {statusText}
        </p>

        {/* Floating particle line */}
        <div className="w-full bg-slate-200 dark:bg-slate-800 h-1 rounded-full overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 h-full w-1/3 rounded-full animate-translate-x shadow-md shadow-indigo-500/50" />
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
