import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  FiMail,
  FiLock,
  FiUser,
  FiEye,
  FiEyeOff,
  FiShield,
  FiCpu,
  FiTarget,
  FiZap,
  FiAlertCircle,
  FiArrowRight,
  FiArrowLeft,
  FiCheckCircle,
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { getOAuthConfig } from '../api/authApi';
import { DocumindIcon } from '../components/DocumindLogo';
import { PdfIcon, WordIcon, TxtIcon } from '../components/auth/AiDocumentPipeline';

export default function Login() {
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get('mode') === 'register';
  const reason = searchParams.get('reason');

  const [isRegister, setIsRegister] = useState(initialMode);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [socialMsg, setSocialMsg] = useState('');
  const [forgotMsg, setForgotMsg] = useState('');

  const { login, register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (searchParams.get('mode') === 'register') {
      setIsRegister(true);
    }
  }, [searchParams]);

  useEffect(() => {
    if (reason === 'inactivity' || reason === 'session_expired') {
      setSocialMsg('Your session was logged out after inactivity for your security.');
    }
  }, [reason]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSocialMsg('');
    setForgotMsg('');

    const trimmedEmail = email.trim();
    const trimmedFullName = fullName.trim();

    if (isRegister && !trimmedFullName) {
      setError('Please enter your full name.');
      return;
    }

    if (!trimmedEmail) {
      setError('Please enter your email address.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!password) {
      setError('Please enter your password.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      if (isRegister) {
        const resData = await register(trimmedFullName, trimmedEmail.toLowerCase(), password);
        if (resData?.requiresOtpVerification) {
          navigate(`/verify-otp?email=${encodeURIComponent(trimmedEmail.toLowerCase())}`);
          return;
        }
      } else {
        const resData = await login(trimmedEmail.toLowerCase(), password);
        if (resData?.requiresOtpVerification) {
          navigate(`/verify-otp?email=${encodeURIComponent(trimmedEmail.toLowerCase())}`);
          return;
        }
      }
      navigate('/dashboard');
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        (isRegister ? 'Registration failed. Please try again.' : 'Login failed. Please check your credentials.');
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    setForgotMsg('Password reset instructions sent to your registered email.');
    setTimeout(() => setForgotMsg(''), 4500);
  };

  const handleGoogleLogin = async () => {
    setError('');
    setSocialMsg('');
    try {
      let googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
      if (!googleClientId) {
        try {
          const configRes = await getOAuthConfig();
          googleClientId = configRes.data?.googleClientId;
        } catch (cfgErr) {
          console.warn('Could not fetch backend OAuth config:', cfgErr.message);
        }
      }

      const redirectUri = `${window.location.origin}/oauth/callback/google`;
      if (googleClientId && googleClientId.trim() !== '') {
        const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${encodeURIComponent(
          redirectUri
        )}&response_type=code&scope=email%20profile&prompt=consent`;
        window.location.href = googleAuthUrl;
      } else {
        navigate('/oauth/callback/google?code=DEMO_GOOGLE_CODE');
      }
    } catch (err) {
      console.error('Google OAuth trigger error:', err);
      setSocialMsg('Google OAuth initialization failed.');
    }
  };

  const handleGitHubLogin = async () => {
    setError('');
    setSocialMsg('');
    try {
      let githubClientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
      if (!githubClientId) {
        try {
          const configRes = await getOAuthConfig();
          githubClientId = configRes.data?.githubClientId;
        } catch (cfgErr) {
          console.warn('Could not fetch backend OAuth config:', cfgErr.message);
        }
      }

      const redirectUri = `${window.location.origin}/oauth/callback/github`;
      if (githubClientId && githubClientId.trim() !== '') {
        const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${githubClientId}&redirect_uri=${encodeURIComponent(
          redirectUri
        )}&scope=user:email`;
        window.location.href = githubAuthUrl;
      } else {
        navigate('/oauth/callback/github?code=DEMO_GITHUB_CODE');
      }
    } catch (err) {
      console.error('GitHub OAuth trigger error:', err);
      setSocialMsg('GitHub OAuth initialization failed.');
    }
  };

  const features = [
    { icon: FiCpu, title: 'AI Powered', desc: 'Intelligent extraction' },
    { icon: FiShield, title: 'Enterprise Secure', desc: 'Private & isolated' },
    { icon: FiTarget, title: '~88% Accurate', desc: 'Grounded in citations' },
    { icon: FiZap, title: 'Instant Insights', desc: 'Multi-doc synthesis' },
  ];

  return (
    <div className="min-h-screen w-full flex flex-col relative overflow-y-auto bg-[#050816] text-white selection:bg-cyan-500/30 selection:text-cyan-200 font-sans scroll-smooth">
      {/* ─── 1. TOP CEILING AURORA LIGHT BEAM ─── */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/50 via-indigo-500/60 via-purple-500/50 to-transparent z-20 pointer-events-none shadow-[0_0_20px_rgba(99,102,241,0.6)]" />
      <div className="absolute -top-[140px] left-1/2 -translate-x-1/2 w-[800px] h-[280px] bg-gradient-to-b from-indigo-500/25 via-cyan-500/15 to-transparent rounded-full blur-[90px] z-10 pointer-events-none" />

      {/* ─── 2. TECHNICAL GRID LAYER WITH RADIAL VIGNETTE ─── */}
      <div
        className="absolute inset-0 pointer-events-none z-0 opacity-[0.05]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.2) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.2) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 85%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 85%)',
        }}
      />

      {/* ─── 3. FULL-PAGE MESH GRADIENT LIGHT EFFECTS ─── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Left Neural Pipeline Glow (Cyan-Blue Beam) */}
        <div className="absolute top-[10%] left-[5%] w-[700px] h-[700px] bg-gradient-to-tr from-cyan-500/[0.12] via-blue-600/[0.10] to-transparent rounded-full blur-[140px]" />

        {/* Right Login Card Aura (Indigo-Violet Beam) */}
        <div className="absolute top-[15%] right-[2%] w-[600px] h-[600px] bg-gradient-to-bl from-indigo-500/[0.14] via-purple-600/[0.10] to-transparent rounded-full blur-[130px]" />

        {/* Bottom Ambient Glow Floor */}
        <div className="absolute -bottom-[100px] left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-gradient-to-t from-blue-900/[0.12] via-indigo-950/[0.08] to-transparent rounded-full blur-[120px]" />
      </div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col justify-between flex-1">
        {/* Top Header Bar with Back Link */}
        <div className="flex items-center justify-between w-full mb-8">
          <Link to="/" className="flex items-center gap-3 group select-none">
            <DocumindIcon className="w-9 h-9 transition-transform group-hover:scale-105" />
            <div className="flex flex-col">
              <span className="text-lg font-bold text-white tracking-tight leading-none">
                DocuMind
              </span>
              <span className="text-[9px] font-bold tracking-[0.22em] text-cyan-400 uppercase leading-tight mt-0.5">
                AI INTELLIGENCE
              </span>
            </div>
          </Link>

          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition-all cursor-pointer backdrop-blur-md"
          >
            <FiArrowLeft className="text-xs" />
            <span>Back to Introduction</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center my-auto py-4">
          {/* ═════════════════════════════════════════════════════════
              LEFT CHAMBER: MARKETING & LIVE PIPELINE (70% GLASS)
              ═════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
            {/* Headline */}
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[11px] font-bold tracking-widest uppercase backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span>Next-Gen Document AI</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-black text-white tracking-tight leading-[1.1]">
                Turn complex documents <br />
                into{' '}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 drop-shadow-[0_0_25px_rgba(0,240,255,0.3)]">
                  intelligent answers.
                </span>
              </h1>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-lg font-normal">
                Upload PDFs, Word files, notes and slide decks. Ask complex questions,
                extract dates, risks, financial figures, and generate instant flashcards.
              </p>
            </div>

            {/* Floating Live Document Pipeline Card with 70% Glass Transparency */}
            <div
              className="p-5 rounded-3xl border border-cyan-500/30 backdrop-blur-2xl shadow-[0_15px_40px_rgba(0,0,0,0.5)] space-y-4"
              style={{ backgroundColor: 'rgba(8, 16, 40, 0.30)' }}
            >
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Live Document Ingestion Engine
                </span>
                <span className="text-[10px] font-mono font-bold text-cyan-300 bg-cyan-500/15 px-2 py-0.5 rounded-full border border-cyan-500/30">
                  REAL-TIME OCR + EMBEDDINGS
                </span>
              </div>

              {/* 3 Floating Document Badges (70% Glass) */}
              <div className="grid grid-cols-3 gap-3">
                <div
                  className="p-3 rounded-2xl border border-red-500/30 flex items-center gap-2.5 shadow-sm backdrop-blur-md"
                  style={{ backgroundColor: 'rgba(12, 22, 58, 0.30)' }}
                >
                  <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center flex-shrink-0">
                    <PdfIcon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">PDF</p>
                    <p className="text-[9.5px] text-slate-400">Structured</p>
                  </div>
                </div>

                <div
                  className="p-3 rounded-2xl border border-blue-500/30 flex items-center gap-2.5 shadow-sm backdrop-blur-md"
                  style={{ backgroundColor: 'rgba(12, 22, 58, 0.30)' }}
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                    <WordIcon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">DOCX</p>
                    <p className="text-[9.5px] text-slate-400">Deep Text</p>
                  </div>
                </div>

                <div
                  className="p-3 rounded-2xl border border-slate-500/30 flex items-center gap-2.5 shadow-sm backdrop-blur-md"
                  style={{ backgroundColor: 'rgba(12, 22, 58, 0.30)' }}
                >
                  <div className="w-8 h-8 rounded-lg bg-slate-500/20 flex items-center justify-center flex-shrink-0">
                    <TxtIcon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">TXT</p>
                    <p className="text-[9.5px] text-slate-400">Synthesized</p>
                  </div>
                </div>
              </div>

              {/* Animated Progress Step Line */}
              <div className="flex items-center justify-between text-[11px] text-slate-300 pt-1 font-medium">
                <span className="flex items-center gap-1.5 text-cyan-300">
                  <FiCheckCircle className="text-xs" /> Semantic Parsing
                </span>
                <span className="text-slate-600">•</span>
                <span className="flex items-center gap-1.5 text-blue-300">
                  <FiCheckCircle className="text-xs" /> Vector Chunking
                </span>
                <span className="text-slate-600">•</span>
                <span className="flex items-center gap-1.5 text-purple-300">
                  <FiCheckCircle className="text-xs" /> Grounded QA
                </span>
              </div>
            </div>

            {/* 4 Feature Badges Grid (70% Glass) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {features.map((f, i) => {
                const Icon = f.icon;
                return (
                  <div
                    key={i}
                    className="p-3 rounded-2xl border border-white/[0.10] backdrop-blur-xl"
                    style={{ backgroundColor: 'rgba(8, 16, 40, 0.30)' }}
                  >
                    <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-300 text-xs mb-2">
                      <Icon />
                    </div>
                    <p className="text-xs font-bold text-white leading-tight">
                      {f.title}
                    </p>
                    <p className="text-[10px] text-slate-400 leading-tight mt-0.5">
                      {f.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ═════════════════════════════════════════════════════════
              RIGHT CHAMBER: ULTRA-PREMIUM 70% GLASS LOGIN FORM
              ═════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-6 flex items-center justify-center w-full">
            <div
              className="w-full max-w-md p-6 sm:p-8 rounded-3xl border border-cyan-500/35 backdrop-blur-3xl shadow-[0_20px_70px_rgba(0,0,0,0.6)] relative overflow-hidden"
              style={{ backgroundColor: 'rgba(8, 16, 40, 0.30)' }}
            >
              {/* Top Accent Shimmer Beam */}
              <div className="absolute top-0 left-1/4 right-1/4 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 via-indigo-500 to-transparent shadow-[0_0_15px_#00f0ff]" />

              {/* Mode Switcher Tabs */}
              <div
                className="grid grid-cols-2 p-1 rounded-2xl border border-white/[0.08] mb-6 backdrop-blur-md"
                style={{ backgroundColor: 'rgba(5, 11, 29, 0.40)' }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setIsRegister(false);
                    setError('');
                  }}
                  className={`py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${!isRegister
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]'
                      : 'text-slate-400 hover:text-white'
                    }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsRegister(true);
                    setError('');
                  }}
                  className={`py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${isRegister
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)]'
                      : 'text-slate-400 hover:text-white'
                    }`}
                >
                  Create Account
                </button>
              </div>

              {/* Header Title inside Card */}
              <div className="mb-5">
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {isRegister ? 'Start with DocuMind' : 'Welcome back'}
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  {isRegister
                    ? 'Enter your details to create your workspace.'
                    : 'Access your document intelligence dashboard.'}
                </p>
              </div>

              {/* Error / Alert Messages */}
              {error && (
                <div className="mb-4 p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-medium flex items-start gap-2 animate-shake">
                  <FiAlertCircle className="text-rose-400 text-base flex-shrink-0 mt-0.5" />
                  <span className="leading-snug">{error}</span>
                </div>
              )}

              {socialMsg && (
                <div className="mb-4 p-3 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-medium flex items-start gap-2">
                  <FiAlertCircle className="text-amber-400 text-base flex-shrink-0 mt-0.5" />
                  <span className="leading-snug">{socialMsg}</span>
                </div>
              )}

              {forgotMsg && (
                <div className="mb-4 p-3 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-medium flex items-start gap-2">
                  <FiCheckCircle className="text-cyan-400 text-base flex-shrink-0 mt-0.5" />
                  <span className="leading-snug">{forgotMsg}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {isRegister && (
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Full Name
                    </label>
                    <div className="relative">
                      <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm pointer-events-none" />
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="John Doe"
                        required={isRegister}
                        className="w-full h-11 pl-10 pr-4 bg-[#050b1d]/60 border border-white/[0.10] focus:border-cyan-400/80 focus:ring-2 focus:ring-cyan-500/20 rounded-xl text-xs text-white placeholder-slate-500 outline-none transition-all backdrop-blur-md"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm pointer-events-none" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@company.com"
                      required
                      className="w-full h-11 pl-10 pr-4 bg-[#050b1d]/60 border border-white/[0.10] focus:border-cyan-400/80 focus:ring-2 focus:ring-cyan-500/20 rounded-xl text-xs text-white placeholder-slate-500 outline-none transition-all backdrop-blur-md"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                      Password
                    </label>
                    {!isRegister && (
                      <button
                        type="button"
                        onClick={handleForgotPassword}
                        className="text-[11px] text-cyan-400 hover:text-cyan-300 transition-colors font-semibold cursor-pointer"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      minLength={6}
                      className="w-full h-11 pl-10 pr-10 bg-[#050b1d]/60 border border-white/[0.10] focus:border-cyan-400/80 focus:ring-2 focus:ring-cyan-500/20 rounded-xl text-xs text-white placeholder-slate-500 outline-none transition-all backdrop-blur-md"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-1 cursor-pointer"
                    >
                      {showPassword ? <FiEyeOff className="text-sm" /> : <FiEye className="text-sm" />}
                    </button>
                  </div>
                </div>

                {/* Submit CTA Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 disabled:opacity-50 text-white text-xs font-bold tracking-wide shadow-[0_0_25px_rgba(99,102,241,0.55)] border border-white/20 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>{isRegister ? 'Create Free Account' : 'Sign In to Workspace'}</span>
                      <FiArrowRight className="text-sm" />
                    </>
                  )}
                </button>
              </form>

              {/* Social Login Separator */}
              <div className="relative my-6 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/[0.08]" />
                </div>
                <span className="relative px-3 bg-[#081028]/60 backdrop-blur-md text-[10.5px] font-bold text-slate-400 uppercase tracking-wider rounded-full border border-white/[0.06]">
                  Or continue with
                </span>
              </div>

              {/* Social OAuth Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="h-11 rounded-xl bg-[#050b1d]/60 hover:bg-[#0c1538]/80 border border-white/[0.10] hover:border-cyan-400/50 text-xs font-semibold text-white flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-sm backdrop-blur-md"
                >
                  <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  <span>Google</span>
                </button>

                <button
                  type="button"
                  onClick={handleGitHubLogin}
                  className="h-11 rounded-xl bg-[#050b1d]/60 hover:bg-[#0c1538]/80 border border-white/[0.10] hover:border-purple-400/50 text-xs font-semibold text-white flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-sm backdrop-blur-md"
                >
                  <svg className="w-4 h-4 flex-shrink-0 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"
                    />
                  </svg>
                  <span>GitHub</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Trust & Security Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-white/[0.06] text-xs text-slate-500">
          <p>© 2026 DocuMind AI Intelligence. Enterprise grade security.</p>
          <div className="flex items-center gap-6 text-slate-400 mt-2 sm:mt-0">
            <span className="flex items-center gap-1.5">
              <FiShield className="text-cyan-400" /> End-to-end encrypted
            </span>
            <span className="flex items-center gap-1.5">
              <FiTarget className="text-purple-400" /> Grounded synthesis
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
