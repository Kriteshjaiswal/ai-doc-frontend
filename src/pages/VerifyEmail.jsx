import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { FiCheckCircle, FiAlertCircle, FiShield, FiArrowRight } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import DocumindLogo from '../components/DocumindLogo';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { verifyMagicToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setError('Missing verification token. Please check your verification link.');
      setLoading(false);
      return;
    }

    const processVerification = async () => {
      try {
        await verifyMagicToken(token);
        setSuccess(true);
        setTimeout(() => navigate('/'), 2000);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Verification link is invalid or has expired.');
      } finally {
        setLoading(false);
      }
    };

    processVerification();
  }, [token, verifyMagicToken, navigate]);

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-[#050816] select-none p-4"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400 via-indigo-500 to-transparent z-20 pointer-events-none" />
      <div className="relative z-10 w-full max-w-[440px]">
        <div className="text-center mb-8">
          <DocumindLogo size="lg" showText={true} showSubtitle={true} />
        </div>

        <div className="relative bg-[#090f20]/90 backdrop-blur-2xl border border-white/[0.10] rounded-[24px] shadow-[0_0_50px_rgba(99,102,241,0.2)] p-8 sm:p-10 text-center overflow-hidden">
          {loading && (
            <div className="py-8">
              <div className="w-12 h-12 border-3 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin mx-auto mb-4" />
              <h2 className="text-lg font-bold text-white tracking-tight">Verifying Your Account...</h2>
              <p className="text-xs text-slate-400 mt-2">Connecting to security validation engine</p>
            </div>
          )}

          {success && (
            <div className="py-6 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-3xl mx-auto mb-4 shadow-lg shadow-emerald-500/20">
                <FiCheckCircle />
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Email Verified!</h2>
              <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                Your account is now fully active. Redirecting you to your intelligent workspace...
              </p>
              <div className="mt-6 flex justify-center">
                <div className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-400">
                  <span>Launching DocuMind</span>
                  <FiArrowRight className="animate-pulse" />
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="py-6 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 text-3xl mx-auto mb-4">
                <FiAlertCircle />
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">Verification Failed</h2>
              <p className="text-xs text-rose-300 mt-2 leading-relaxed bg-rose-500/10 border border-rose-500/20 p-3 rounded-xl">
                {error}
              </p>
              <div className="mt-6">
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center h-11 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-500/25 hover:brightness-110 transition-all"
                >
                  Return to Sign In
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
