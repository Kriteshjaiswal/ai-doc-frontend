import { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { FiMail, FiShield, FiArrowRight, FiRotateCw, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { resendOtp } from '../api/authApi';
import DocumindLogo from '../components/DocumindLogo';

export default function VerifyOtp() {
  const [searchParams] = useSearchParams();
  const emailParam = searchParams.get('email') || '';
  const [email, setEmail] = useState(emailParam);
  const [otp, setOtp] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [resendCooldown, setResendCooldown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const { verifyOtpCode } = useAuth();
  const navigate = useNavigate();

  // Cooldown countdown for resending OTP
  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setInterval(() => setResendCooldown((prev) => prev - 1), 1000);
    } else {
      setCanResend(true);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [resendCooldown]);

  // Focus first box on mount
  useEffect(() => {
    if (inputRefs[0]?.current) {
      inputRefs[0].current.focus();
    }
  }, []);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError('');

    // Auto-advance to next input
    if (value && index < 3) {
      inputRefs[index + 1].current?.focus();
    }

    // Auto-submit if all 4 digits are entered
    if (newOtp.every((d) => d !== '') && index === 3) {
      handleVerification(newOtp.join(''));
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (/^\d{4}$/.test(pastedData)) {
      const digits = pastedData.split('');
      setOtp(digits);
      inputRefs[3].current?.focus();
      handleVerification(pastedData);
    }
  };

  const handleVerification = async (otpCodeString) => {
    const code = otpCodeString || otp.join('');
    if (code.length !== 4) {
      setError('Please enter all 4 digits of the verification code.');
      return;
    }

    if (!email) {
      setError('Email address is missing. Please return to login.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await verifyOtpCode(email, code);
      setSuccessMsg('Email verified successfully! Redirecting to workspace...');
      setTimeout(() => navigate('/'), 1200);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Invalid or expired verification code.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend || !email) return;
    setError('');
    setSuccessMsg('');

    try {
      await resendOtp(email);
      setSuccessMsg('A fresh 4-digit verification code has been sent to your email.');
      setResendCooldown(60);
      setCanResend(false);
      setOtp(['', '', '', '']);
      inputRefs[0].current?.focus();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to resend verification code.');
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-[#050816] select-none p-4"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Top Aurora Beam */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400 via-indigo-500 to-transparent z-20 pointer-events-none" />
      <div className="absolute -top-[140px] left-1/2 -translate-x-1/2 w-[600px] h-[280px] bg-gradient-to-b from-indigo-500/20 via-cyan-500/10 to-transparent rounded-full blur-[90px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-[440px]">
        <div className="text-center mb-8">
          <DocumindLogo size="lg" showText={true} showSubtitle={true} />
        </div>

        <div className="relative bg-[#090f20]/90 backdrop-blur-2xl border border-white/[0.10] rounded-[24px] shadow-[0_0_50px_rgba(99,102,241,0.2)] p-7 sm:p-9 overflow-hidden">
          {/* Card Top Reflection Beam */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/40 via-indigo-400/50 to-transparent pointer-events-none" />

          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mx-auto mb-4">
            <FiShield className="text-2xl" />
          </div>

          <h2 className="text-2xl font-bold text-white text-center tracking-tight">Verify Your Email</h2>
          <p className="text-xs text-slate-400 text-center mt-2 leading-relaxed mb-6">
            We sent a 4-digit verification code to <br />
            <span className="text-cyan-400 font-semibold">{email || 'your email'}</span>
          </p>

          {error && (
            <div className="mb-5 px-3.5 py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-400 text-xs font-medium flex items-center gap-2 animate-shake">
              <FiAlertCircle className="text-sm flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-5 px-3.5 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-semibold flex items-center gap-2">
              <FiCheckCircle className="text-sm flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* 4-Digit OTP Input Boxes */}
          <div className="flex items-center justify-center gap-3.5 mb-6" onPaste={handlePaste}>
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={inputRefs[index]}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-14 h-16 text-center text-2xl font-bold text-white bg-[#070d1d] border border-white/[0.12] rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 transition-all font-mono shadow-inner"
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => handleVerification()}
            disabled={loading || otp.some((d) => d === '')}
            className="w-full h-12 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:brightness-110 text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Verify & Continue</span>
                <FiArrowRight className="text-base" />
              </>
            )}
          </button>

          {/* Resend OTP Section */}
          <div className="mt-6 pt-5 border-t border-white/[0.06] text-center">
            <p className="text-xs text-slate-400">
              Didn't receive the code?{' '}
              {canResend ? (
                <button
                  type="button"
                  onClick={handleResend}
                  className="text-cyan-400 font-bold hover:text-cyan-300 underline underline-offset-2 ml-1 cursor-pointer"
                >
                  Resend OTP
                </button>
              ) : (
                <span className="text-slate-500 font-medium ml-1">
                  Resend in <span className="text-cyan-400 font-mono font-semibold">{resendCooldown}s</span>
                </span>
              )}
            </p>
          </div>

          <div className="mt-4 text-center">
            <Link to="/login" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
              &larr; Back to Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
