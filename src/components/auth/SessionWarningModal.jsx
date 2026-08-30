import { FiClock, FiAlertTriangle, FiCheckCircle } from 'react-icons/fi';

export default function SessionWarningModal({ isOpen, remainingSeconds, onExtend, onLogout }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-md bg-[#0b1120] border border-amber-500/30 rounded-2xl p-6 sm:p-8 shadow-[0_0_50px_rgba(245,158,11,0.2)] overflow-hidden">
        {/* Glow beam */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent" />

        <div className="flex items-center gap-3.5 mb-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 flex-shrink-0">
            <FiAlertTriangle className="text-2xl animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">Session Inactivity Warning</h3>
            <p className="text-xs text-slate-400">Automatic logout in progress</p>
          </div>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed mb-6">
          You have been inactive for 9 minutes. For your security, your session will automatically expire and you will be logged out in:
        </p>

        {/* Countdown Ring / Box */}
        <div className="bg-amber-500/10 border border-amber-500/25 rounded-xl p-4 flex items-center justify-center gap-3 mb-6">
          <FiClock className="text-amber-400 text-xl" />
          <span className="text-3xl font-extrabold text-amber-400 font-mono tracking-wider">
            00:{remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds}
          </span>
          <span className="text-xs text-amber-300 font-semibold uppercase tracking-wider">seconds</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onLogout}
            className="flex-1 h-11 bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] rounded-xl text-xs font-semibold text-slate-300 transition-colors cursor-pointer"
          >
            Log Out Now
          </button>
          <button
            type="button"
            onClick={onExtend}
            className="flex-1 h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <FiCheckCircle className="text-sm" />
            Stay Logged In
          </button>
        </div>
      </div>
    </div>
  );
}
