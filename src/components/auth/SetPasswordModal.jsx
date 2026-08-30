import { useState } from 'react';
import { FiLock, FiEye, FiEyeOff, FiX, FiCheck, FiAlertCircle } from 'react-icons/fi';
import { setLocalPassword } from '../../api/authApi';

export default function SetPasswordModal({ isOpen, onClose, onSuccess }) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await setLocalPassword(newPassword);
      setSuccessMsg(res.message || 'Password created successfully!');
      setTimeout(() => {
        if (onSuccess) onSuccess();
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to set password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-md bg-[#0b1120] border border-white/[0.1] rounded-2xl p-6 sm:p-8 shadow-[0_0_50px_rgba(99,102,241,0.2)] overflow-hidden">
        {/* Top Glow Beam */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 via-indigo-500 to-transparent" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/[0.06] transition-colors cursor-pointer"
        >
          <FiX className="text-lg" />
        </button>

        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-cyan-400">
            <FiLock className="text-xl" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">Create Local Password</h3>
            <p className="text-xs text-slate-400">Enable direct email & password sign-in</p>
          </div>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed mt-2 mb-5">
          Setting a local password allows you to sign in with your email address directly, in addition to Google or GitHub OAuth.
        </p>

        {error && (
          <div className="mb-4 px-3.5 py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-400 text-xs font-medium flex items-center gap-2">
            <FiAlertCircle className="text-sm flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 px-3.5 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-semibold flex items-center gap-2">
            <FiCheck className="text-sm flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 6 characters"
                required
                minLength={6}
                className="w-full h-11 pl-4 pr-10 bg-[#070d1d] border border-white/[0.08] rounded-xl text-sm font-medium text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-1 cursor-pointer"
              >
                {showPassword ? <FiEyeOff className="text-sm" /> : <FiEye className="text-sm" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Confirm Password
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              required
              minLength={6}
              className="w-full h-11 px-4 bg-[#070d1d] border border-white/[0.08] rounded-xl text-sm font-medium text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition-all"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-11 bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] rounded-xl text-xs font-semibold text-slate-300 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 h-11 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:brightness-110 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Save Password'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
