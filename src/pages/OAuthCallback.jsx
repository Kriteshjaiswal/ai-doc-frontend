import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
  FiUser,
  FiLock,
  FiEye,
  FiEyeOff,
  FiCheckCircle,
  FiAlertCircle,
  FiArrowRight,
  FiShield,
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { oauthLogin, setLocalPassword } from '../api/authApi';
import { updateProfile } from '../api/userApi';

export default function OAuthCallback() {
  const { provider } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loginWithToken, refreshProfile } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const processedRef = useRef(false);

  // Fresh user profile & password onboarding state
  const [showSetup, setShowSetup] = useState(false);
  const [authData, setAuthData] = useState(null);
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (processedRef.current) return;

    const code = searchParams.get('code');
    const oauthError = searchParams.get('error') || searchParams.get('error_description');

    if (oauthError) {
      processedRef.current = true;
      setError(`OAuth authentication cancelled or denied by ${provider}: ${oauthError}`);
      setLoading(false);
      return;
    }

    if (!code) {
      processedRef.current = true;
      setError(`Missing authorization code from ${provider}.`);
      setLoading(false);
      return;
    }

    processedRef.current = true;

    const processOAuth = async () => {
      try {
        setLoading(true);
        const redirectUri = `${window.location.origin}/oauth/callback/${provider}`;
        const res = await oauthLogin(provider, code, redirectUri);
        const authPayload = res?.data || res || {};
        const activeToken = authPayload.token || authPayload.sessionId;
        const userObj = authPayload.user || {
          id: authPayload.userId || 1,
          fullName: authPayload.fullName || 'User',
          email: authPayload.email || '',
          provider: provider ? provider.toUpperCase() : 'GOOGLE',
          role: 'ROLE_USER',
          accountStatus: 'ACTIVE',
          isEmailVerified: true,
          hasPassword: false,
        };

        loginWithToken(activeToken, userObj);

        const hasLocalPwd = Boolean(userObj.hasPassword || userObj.hasLocalPassword);
        const isFresh = Boolean(authPayload.isNewUser || authPayload.newUser || !hasLocalPwd);

        // If fresh OAuth user or user without local password, show Name & Password setup screen
        if (isFresh) {
          setAuthData({ token: activeToken, user: userObj });
          setFullName(userObj.fullName || '');
          setShowSetup(true);
          setLoading(false);
        } else {
          // Returning user with password already configured -> enter workspace directly
          navigate('/', { replace: true });
        }
      } catch (err) {
        console.error(`OAuth login error (${provider}):`, err);
        setError(err.response?.data?.message || err.message || `Failed to complete ${provider} login.`);
        setLoading(false);
      }
    };

    processOAuth();
  }, [provider, searchParams, loginWithToken, navigate]);

  const handleCompleteSetup = async (e) => {
    e.preventDefault();
    setFormError('');

    if (password && password.length < 6) {
      setFormError('Password must be at least 6 characters long.');
      return;
    }

    if (password && password !== confirmPassword) {
      setFormError('Passwords do not match.');
      return;
    }

    setSubmitting(true);
    try {
      // 1. Update Full Name if modified
      if (fullName && fullName.trim() !== authData?.user?.fullName) {
        await updateProfile(fullName.trim(), null);
      }

      // 2. Set Local Password if provided
      if (password) {
        await setLocalPassword(password);
      }

      await refreshProfile();
      navigate('/', { replace: true });
    } catch (err) {
      setFormError(err.response?.data?.message || err.message || 'Failed to save setup details.');
      setSubmitting(false);
    }
  };

  const handleSkip = () => {
    navigate('/', { replace: true });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#070b16] text-white p-4 sm:p-6 font-sans">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-b from-indigo-600/20 via-purple-600/10 to-transparent rounded-full blur-3xl opacity-60" />
      </div>

      <div className="relative w-full max-w-lg bg-[#0a1022]/95 border border-white/[0.10] rounded-3xl p-6 sm:p-9 shadow-2xl backdrop-blur-2xl">
        {/* Top Glow Accent Line */}
        <div className="absolute top-0 left-1/4 right-1/4 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400 via-indigo-500 to-transparent" />

        {loading ? (
          <div className="space-y-4 py-8 text-center">
            <div className="w-12 h-12 border-3 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto" />
            <h2 className="text-lg font-bold text-white tracking-tight">Authenticating with Google...</h2>
            <p className="text-xs text-slate-400">Verifying security credentials and preparing your AI workspace.</p>
          </div>
        ) : error ? (
          <div className="space-y-5 py-4 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto text-xl font-bold">
              !
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Authentication Failed</h2>
              <p className="text-xs text-rose-400 mt-2 leading-relaxed bg-rose-500/10 border border-rose-500/20 p-3 rounded-xl">{error}</p>
            </div>
            <button
              onClick={() => navigate('/login', { replace: true })}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/25 cursor-pointer"
            >
              Return to Login
            </button>
          </div>
        ) : showSetup ? (
          <div className="space-y-6">
            {/* Header with Google Verified Pill */}
            <div className="space-y-2 text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 mx-auto">
                <FiCheckCircle className="text-xs stroke-[3]" />
                <span>Google Account Connected</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                Complete Your Account Setup
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
                Confirm your display name and create a password so you can also log in directly using your email address.
              </p>
            </div>

            {formError && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-400 text-xs font-medium flex items-center gap-2">
                <FiAlertCircle className="text-sm flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {/* Setup Form */}
            <form onSubmit={handleCompleteSetup} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Your Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <FiUser className="text-sm" />
                  </div>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your name"
                    required
                    className="w-full h-11 pl-10 pr-4 bg-[#070d1d] border border-white/[0.10] rounded-xl text-sm font-medium text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                  />
                </div>
              </div>

              {/* Set Password (Optional or Recommended) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Create Password
                  </label>
                  <span className="text-[10px] font-medium text-slate-500">Optional</span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <FiLock className="text-sm" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    minLength={6}
                    className="w-full h-11 pl-10 pr-10 bg-[#070d1d] border border-white/[0.10] rounded-xl text-sm font-medium text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
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

              {/* Confirm Password */}
              {password && (
                <div className="animate-in fade-in slide-in-from-top-1">
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <FiLock className="text-sm" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter your password"
                      minLength={6}
                      required
                      className="w-full h-11 pl-10 pr-4 bg-[#070d1d] border border-white/[0.10] rounded-xl text-sm font-medium text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Security Hint */}
              <div className="p-3 rounded-xl bg-slate-900/60 border border-white/[0.06] flex items-start gap-2.5 text-[11px] text-slate-400 leading-relaxed">
                <FiShield className="text-indigo-400 text-sm flex-shrink-0 mt-0.5" />
                <span>You can always sign in via Google with 1-click, or use your email and password.</span>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full h-12 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Saving Profile...</span>
                    </>
                  ) : (
                    <>
                      <span>Complete Setup & Enter Workspace</span>
                      <FiArrowRight className="text-sm" />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleSkip}
                  className="w-full py-2 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                >
                  Skip for now & continue to Dashboard
                </button>
              </div>
            </form>
          </div>
        ) : null}
      </div>
    </div>
  );
}
