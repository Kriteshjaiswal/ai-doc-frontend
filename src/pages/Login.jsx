import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { getOAuthConfig } from '../api/authApi';
import AiDocumentPipeline from '../components/auth/AiDocumentPipeline';
import DocumindLogo from '../components/DocumindLogo';

/* ═══════════════════════════════════════════════════════════════
   BRAND HEADER COMPONENT (DocuMind)
   ═══════════════════════════════════════════════════════════════ */

function DocQABranding() {
  return (
    <DocumindLogo size="lg" showText={true} showSubtitle={true} />
  );
}

/* ═══════════════════════════════════════════════════════════════
   FEATURE PILL BADGES
   ═══════════════════════════════════════════════════════════════ */

function FeatureBadges() {
  const features = [
    {
      icon: FiCpu,
      title: 'AI Powered',
      desc: 'Intelligent analysis',
    },
    {
      icon: FiShield,
      title: 'Secure',
      desc: 'Enterprise grade security',
    },
    {
      icon: FiTarget,
      title: 'Accurate',
      desc: 'Reliable answers',
    },
    {
      icon: FiZap,
      title: 'Fast',
      desc: 'Instant insights',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 pt-2">
      {features.map((f, i) => {
        const Icon = f.icon;
        return (
          <div key={i} className="flex items-start gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0 text-cyan-400 mt-0.5">
              <Icon className="text-xs" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white tracking-tight leading-none mb-1">
                {f.title}
              </p>
              <p className="text-[11px] text-slate-400 leading-tight">
                {f.desc}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   FORM FIELDS & SOCIAL AUTH ICONS
   ═══════════════════════════════════════════════════════════════ */

function FormField({
  id,
  label,
  type,
  value,
  onChange,
  placeholder,
  icon: Icon,
  required,
  autoFocus,
  rightAction,
  endIcon,
  endIconOnClick,
  endIconAriaLabel,
  minLength,
  error,
}) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1.5">
        <label
          htmlFor={id}
          className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.14em]"
        >
          {label}
        </label>
        {rightAction}
      </div>

      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-[15px] pointer-events-none" />
        )}
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          autoFocus={autoFocus}
          minLength={minLength}
          className={`
            w-full h-[48px] ${Icon ? 'pl-10' : 'pl-4'} ${endIcon ? 'pr-11' : 'pr-4'}
            bg-[#070d1d]/90 border border-white/[0.08] rounded-xl text-[14px] font-medium text-white
            placeholder-slate-500
            focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40
            transition-all duration-200
            ${error ? 'border-rose-500/50 focus:ring-rose-500/30' : ''}
          `}
        />
        {endIcon && (
          <button
            type="button"
            onClick={endIconOnClick}
            tabIndex={-1}
            aria-label={endIconAriaLabel}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors p-1 cursor-pointer"
          >
            {endIcon}
          </button>
        )}
      </div>

      {error && (
        <p className="text-[11px] text-rose-400 font-medium mt-1.5" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg className="w-4 h-4 text-slate-200 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN FULL-SCREEN LOGIN COMPONENT
   ═══════════════════════════════════════════════════════════════ */

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSocialMsg('');
    setForgotMsg('');
    setLoading(true);

    try {
      if (isRegister) {
        await register(fullName, email, password);
      } else {
        await login(email, password);
      }
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegister(!isRegister);
    setError('');
    setSocialMsg('');
    setForgotMsg('');
    setFullName('');
    setEmail('');
    setPassword('');
  };

  const handleForgotPassword = () => {
    setForgotMsg('Password reset link sent if account exists.');
    setSocialMsg('');
    setTimeout(() => setForgotMsg(''), 4000);
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

      if (!googleClientId || googleClientId.trim() === '') {
        setSocialMsg('Google OAuth is ready. Configure GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to activate live login.');
        return;
      }

      const redirectUri = `${window.location.origin}/oauth/callback/google`;
      const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=email%20profile&prompt=consent`;

      window.location.href = googleAuthUrl;
    } catch (err) {
      console.error('Google OAuth trigger error:', err);
      setSocialMsg('Google OAuth authorization initialization failed.');
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

      if (!githubClientId || githubClientId.trim() === '') {
        setSocialMsg('GitHub OAuth is ready. Configure GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET to activate live login.');
        return;
      }

      const redirectUri = `${window.location.origin}/oauth/callback/github`;
      const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${githubClientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=user:email`;

      window.location.href = githubAuthUrl;
    } catch (err) {
      console.error('GitHub OAuth trigger error:', err);
      setSocialMsg('GitHub OAuth authorization initialization failed.');
    }
  };

  return (
    <div
      className="min-h-screen w-full flex relative overflow-y-auto lg:overflow-hidden select-none bg-[#050816]"
      style={{
        fontFamily: "'Inter', sans-serif",
      }}
    >
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

      {/* ─── MAIN 2-COLUMN VIEWPORT CONTAINER ─── */}
      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-12 xl:px-16 py-6 lg:py-6 h-full flex flex-col justify-between my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1.25fr_0.75fr] xl:grid-cols-[1.3fr_0.7fr] gap-8 lg:gap-12 xl:gap-16 items-center w-full my-auto">

          {/* ═══════════════════════════════════════════════════════
               LEFT COLUMN: Brand, Live Neural Pipeline & Copy
             ═══════════════════════════════════════════════════════ */}
          <div className="flex flex-col justify-between w-full max-w-[820px] mx-auto lg:mx-0 space-y-4">
            {/* Top-Left Branding */}
            <div>
              <DocQABranding />
            </div>

            {/* Main AI Neural Intelligence Pipeline Visualization */}
            <div className="w-full">
              <AiDocumentPipeline />
            </div>

            {/* Bottom Marketing Copy */}
            <div className="space-y-3">
              <h1 className="text-[28px] sm:text-[34px] xl:text-[38px] font-extrabold text-white leading-[1.12] tracking-tight">
                Turn complex documents <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-cyan-400 via-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  into intelligent answers.
                </span>
              </h1>

              <p className="text-[13px] sm:text-[14px] text-slate-400 leading-relaxed max-w-[540px]">
                Upload documents, understand their content with AI, and ask questions using natural language.
              </p>

              {/* 4 Feature Badges Row */}
              <div className="pt-2">
                <FeatureBadges />
              </div>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════
               RIGHT COLUMN: Centered Glassmorphism Login Card
             ═══════════════════════════════════════════════════════ */}
          <div className="w-full flex flex-col items-center justify-center my-auto">
            <div className="w-full max-w-[420px]">
              {/* Glassmorphism Container with Dynamic Light Border & Ambient Flare */}
              <div className="relative group bg-[#090f20]/90 backdrop-blur-2xl border border-white/[0.10] rounded-[24px] shadow-[0_0_50px_-10px_rgba(99,102,241,0.22)] p-7 sm:p-8 overflow-hidden">
                {/* Top Subtle Light Reflection Beam inside Card */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/40 via-indigo-400/50 to-transparent pointer-events-none" />

                <h2 className="text-[24px] sm:text-[26px] font-bold text-white tracking-tight leading-tight">
                  {isRegister ? 'Create your account' : 'Welcome back'}
                </h2>
                <p className="text-[12.5px] sm:text-[13px] text-slate-400 mt-1.5 leading-relaxed mb-6">
                  {isRegister
                    ? 'Start your AI document journey today.'
                    : 'Sign in to continue to your documents and AI workspace.'}
                </p>

                {/* Status & Error Alerts */}
                <div className="min-h-0">
                  {error && (
                    <div
                      className="mb-4 px-3.5 py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[12px] font-semibold"
                      role="alert"
                    >
                      {error}
                    </div>
                  )}
                  {socialMsg && (
                    <div
                      className="mb-4 px-3.5 py-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[12px] font-semibold leading-relaxed"
                      role="status"
                    >
                      {socialMsg}
                    </div>
                  )}
                  {forgotMsg && (
                    <div
                      className="mb-4 px-3.5 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[12px] font-semibold"
                      role="status"
                    >
                      {forgotMsg}
                    </div>
                  )}
                </div>

                {/* Auth Form */}
                <form onSubmit={handleSubmit} noValidate>
                  <div className="space-y-4">
                    {isRegister && (
                      <FormField
                        id="fullName"
                        label="FULL NAME"
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="John Doe"
                        icon={FiUser}
                        required
                        autoFocus={isRegister}
                      />
                    )}

                    <FormField
                      id="email"
                      label="EMAIL"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      icon={FiMail}
                      required
                      autoFocus={!isRegister}
                    />

                    <FormField
                      id="password"
                      label="PASSWORD"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      icon={FiLock}
                      required
                      minLength={6}
                      rightAction={
                        !isRegister ? (
                          <button
                            type="button"
                            onClick={handleForgotPassword}
                            className="text-[11px] text-blue-400 hover:text-blue-300 transition-colors font-medium cursor-pointer"
                          >
                            Forgot password?
                          </button>
                        ) : null
                      }
                      endIcon={
                        showPassword ? (
                          <FiEyeOff className="text-[15px]" />
                        ) : (
                          <FiEye className="text-[15px]" />
                        )
                      }
                      endIconOnClick={() => setShowPassword(!showPassword)}
                      endIconAriaLabel={showPassword ? 'Hide password' : 'Show password'}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-[48px] mt-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 text-white text-[14px] font-bold rounded-xl shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:shadow-indigo-500/40 hover:brightness-110 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>{isRegister ? 'Creating account...' : 'Signing in...'}</span>
                      </>
                    ) : (
                      <span>{isRegister ? 'Create account' : 'Sign in'}</span>
                    )}
                  </button>
                </form>

                {/* OR Divider */}
                <div className="flex items-center gap-3 my-5">
                  <div className="flex-1 h-px bg-white/[0.08]" />
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest font-mono">
                    OR
                  </span>
                  <div className="flex-1 h-px bg-white/[0.08]" />
                </div>

                {/* Social Login Buttons */}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="flex-1 flex items-center justify-center gap-2 h-[44px] bg-[#070d1d]/80 border border-white/[0.08] rounded-xl text-[12.5px] font-semibold text-slate-200 hover:bg-white/[0.06] hover:border-white/[0.15] transition-all duration-200 active:scale-[0.99] cursor-pointer"
                  >
                    <GoogleIcon />
                    <span>Continue with Google</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleGitHubLogin}
                    className="flex-1 flex items-center justify-center gap-2 h-[44px] bg-[#070d1d]/80 border border-white/[0.08] rounded-xl text-[12.5px] font-semibold text-slate-200 hover:bg-white/[0.06] hover:border-white/[0.15] transition-all duration-200 active:scale-[0.99] cursor-pointer"
                  >
                    <GitHubIcon />
                    <span>Continue with GitHub</span>
                  </button>
                </div>

                {/* Switch between Sign In and Create Account */}
                <div className="mt-6 pt-4 border-t border-white/[0.06] text-center">
                  <p className="text-[12.5px] text-slate-400">
                    {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
                    <button
                      onClick={toggleMode}
                      className="text-white font-bold hover:text-blue-400 transition-colors ml-1 underline underline-offset-2 cursor-pointer"
                    >
                      {isRegister ? 'Sign in' : 'Create account'}
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
