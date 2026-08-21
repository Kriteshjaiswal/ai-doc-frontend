import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiMail, FiLock, FiUser, FiEye, FiEyeOff,
  FiFileText, FiSearch, FiShield, FiCpu,
  FiMessageSquare, FiLayers
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { getOAuthConfig } from '../api/authApi';

/* ═══════════════════════════════════════════════════════════════
   FLOATING ANTIGRAVITY LABEL COMPONENT
   ═══════════════════════════════════════════════════════════════ */

function AntigravityLabel({
  text,
  dotPosition = 'right', // 'left' | 'right'
  delay = 0,
  floatY = 4.5,
  floatX = 2.0,
  floatRotate = 0.7,
  duration = 5.2,
  className = '',
  style = {}
}) {
  return (
    <div
      className={`absolute pointer-events-none select-none z-20 ${className}`}
      style={style}
    >
      <motion.div
        initial={{
          opacity: 0,
          y: 45,
          scale: 0.96,
          filter: 'blur(4px)'
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
          filter: 'blur(0px)'
        }}
        transition={{
          duration: 0.9,
          delay: delay,
          ease: [0.16, 1, 0.3, 1]
        }}
      >
        <motion.div
          animate={{
            y: [-floatY, floatY, -floatY],
            x: [-floatX, floatX, -floatX],
            rotate: [-floatRotate, floatRotate, -floatRotate]
          }}
          transition={{
            duration: duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: delay + 0.9
          }}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0b1329]/80 border border-white/10 backdrop-blur-md shadow-lg shadow-black/40"
        >
          {dotPosition === 'left' && (
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,1)] flex-shrink-0" />
          )}
          <span className="text-[11px] font-medium text-slate-300 tracking-wide whitespace-nowrap">
            {text}
          </span>
          {dotPosition === 'right' && (
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,1)] flex-shrink-0" />
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SUBTLE 4-POINT SPARKLE ICON
   ═══════════════════════════════════════════════════════════════ */

function SparkleIcon({ className = '', delay = 1.4 }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{
        opacity: [0, 0.8, 0.4, 0.9, 0.6],
        scale: [0.6, 1, 0.9, 1.05, 1],
        rotate: [0, 15, -10, 15, 0]
      }}
      transition={{
        duration: 4.5,
        delay: delay,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
      className={`pointer-events-none select-none text-indigo-300/60 ${className}`}
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
      </svg>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   BRAND HEADER & HERO
   ═══════════════════════════════════════════════════════════════ */

function BrandHeader() {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-blue-600 flex items-center justify-center shadow-lg shadow-indigo-500/25 flex-shrink-0 border border-white/20">
        <FiMessageSquare className="text-white text-[18px]" />
      </div>
      <div className="leading-tight">
        <span className="text-[18px] font-bold text-white tracking-tight block">DocQ&A</span>
        <span className="text-[9.5px] font-semibold text-slate-400 uppercase tracking-[0.2em] block mt-0.5">
          AI DOCUMENT INTELLIGENCE
        </span>
      </div>
    </div>
  );
}

function HeroSection() {
  return (
    <div className="w-full">
      <p className="text-[11px] font-bold text-indigo-400/90 uppercase tracking-[0.22em] mb-3">
        TRUSTED DOCUMENT INTELLIGENCE
      </p>

      <h1 className="text-[36px] sm:text-[42px] xl:text-[46px] font-extrabold text-white leading-[1.08] tracking-tight mb-3.5">
        Your documents,<br />
        <span className="bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent">
          understood by AI.
        </span>
      </h1>

      <p className="text-[13.5px] sm:text-[14px] text-slate-400 leading-relaxed max-w-[500px]">
        Upload documents, ask questions in natural language, and get accurate answers grounded in your source material.
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   AI SHOWCASE PREVIEW
   ═══════════════════════════════════════════════════════════════ */

const SCENES = [
  {
    id: 'financial',
    status: { label: 'ANALYZED', color: 'emerald' },
    metaLeft: 'CITATIONS P.18 · P.24',
    metaRight: 'EMBEDDINGS 1,284 CHUNKS',
    doc: {
      name: 'Q3-financial-report.pdf',
      meta: '42 pages · Indexed',
      icon: FiFileText,
    },
    question: 'What drove the margin change this quarter?',
    answer: 'Gross margin rose 2.4 pts, driven by supply consolidation and lower freight costs.',
    citations: ['p.18', 'p.24']
  },
  {
    id: 'search',
    status: { label: 'INDEXED', color: 'emerald' },
    metaLeft: 'CITATIONS P.31 · P.42',
    metaRight: 'EMBEDDINGS 2,410 CHUNKS',
    doc: {
      name: 'Annual-customer-review.pdf',
      meta: '67 pages · Indexed',
      icon: FiSearch,
    },
    question: 'Find all references to customer churn.',
    answer: 'Found 14 primary references across 8 chapters with churn rate declining from 5.1% to 3.8% YoY.',
    citations: ['p.31', 'p.42']
  }
];

function AIShowcase() {
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % SCENES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const scene = SCENES[activeIdx];
  const DocIcon = scene.doc.icon;

  return (
    <div className="relative w-full my-7">
      {/* ─── ANTIGRAVITY FLOATING LABELS ─── */}
      <AntigravityLabel
        text="Fast Vector Search"
        dotPosition="right"
        delay={0.1}
        floatY={4.0}
        floatX={1.5}
        floatRotate={0.5}
        duration={5.0}
        className="-top-3 left-[16%]"
      />

      <AntigravityLabel
        text="Source Attribution"
        dotPosition="left"
        delay={0.4}
        floatY={4.5}
        floatX={-2.0}
        floatRotate={-0.6}
        duration={5.6}
        className="top-1 -right-3 xl:-right-6"
      />

      <AntigravityLabel
        text="Semantic Indexing"
        dotPosition="right"
        delay={0.7}
        floatY={3.5}
        floatX={2.0}
        floatRotate={0.6}
        duration={4.8}
        className="top-[36%] -left-6 xl:-left-10"
      />

      <AntigravityLabel
        text="RAG Architecture"
        dotPosition="right"
        delay={1.0}
        floatY={5.0}
        floatX={1.8}
        floatRotate={-0.5}
        duration={5.4}
        className="bottom-[14%] -left-5 xl:-left-8"
      />

      <AntigravityLabel
        text="Natural Language Processing"
        dotPosition="left"
        delay={1.3}
        floatY={4.2}
        floatX={-2.0}
        floatRotate={0.7}
        duration={5.2}
        className="bottom-[14%] -right-4 xl:-right-8"
      />

      <AntigravityLabel
        text="Knowledge Graph"
        dotPosition="right"
        delay={1.6}
        floatY={3.8}
        floatX={1.5}
        floatRotate={-0.4}
        duration={4.9}
        className="-bottom-5 left-[14%]"
      />

      <AntigravityLabel
        text="Scalable LLMs"
        dotPosition="left"
        delay={1.9}
        floatY={4.2}
        floatX={-1.5}
        floatRotate={0.5}
        duration={5.5}
        className="-bottom-5 left-[52%]"
      />

      {/* Showcase Blueprint Box Frame */}
      <div className="relative w-full rounded-2xl p-3.5 sm:p-4 border border-dashed border-indigo-400/30 bg-[#080d1e]/80 shadow-[inset_0_0_30px_rgba(79,70,229,0.06)]">
        <div
          className="w-full bg-[#0a1020]/95 border border-white/[0.1] rounded-xl overflow-hidden shadow-2xl flex flex-col justify-between"
          style={{ minHeight: '268px' }}
        >
          {/* Header Status Bar */}
          <div className="flex items-center justify-between px-4 sm:px-5 pt-3.5 pb-2.5 text-[9px] font-bold tracking-wider uppercase border-b border-white/[0.04]">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
              <span className="text-emerald-400 font-semibold">{scene.status.label}</span>
            </div>

            <div className="flex items-center gap-3 text-slate-400 font-mono text-[9px]">
              <span>{scene.metaLeft}</span>
              <span className="text-slate-600">·</span>
              <span>{scene.metaRight}</span>
            </div>
          </div>

          {/* Animated Scene Content */}
          <div className="p-4 sm:p-5 flex-1 flex flex-col justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={scene.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="space-y-3"
              >
                {/* Document Pill */}
                <div className="flex items-center gap-3 bg-[#0d162d]/80 border border-white/[0.06] rounded-xl p-2.5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/15 border border-indigo-500/20 flex items-center justify-center flex-shrink-0">
                    <DocIcon className="text-indigo-400 text-sm" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold text-white truncate">
                      {scene.doc.name}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {scene.doc.meta}
                    </p>
                  </div>
                </div>

                {/* User Question */}
                <div className="flex justify-end">
                  <div className="bg-[#141d33] border border-white/[0.08] rounded-xl rounded-br-sm px-3.5 py-2 max-w-[85%] shadow-sm">
                    <p className="text-[12px] text-slate-200 font-medium">
                      {scene.question}
                    </p>
                  </div>
                </div>

                {/* AI Response Box */}
                <div className="bg-[#0c1527] border border-indigo-500/20 rounded-xl p-3 shadow-inner">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <div className="w-4 h-4 rounded bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center">
                      <FiCpu className="text-white text-[9px]" />
                    </div>
                    <span className="text-[9.5px] font-bold text-indigo-400 uppercase tracking-wider">
                      DOCQ&A
                    </span>
                  </div>
                  <p className="text-[11.5px] text-slate-300 leading-relaxed mb-2">
                    {scene.answer}
                  </p>
                  {scene.citations && (
                    <div className="flex items-center gap-1.5">
                      {scene.citations.map((c, i) => (
                        <span key={i} className="px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                          {c}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dots */}
          <div className="flex items-center justify-center gap-1.5 pb-3">
            {SCENES.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIdx(i)}
                className="focus:outline-none"
              >
                <div
                  className="h-1 rounded-full transition-all duration-300"
                  style={{
                    width: i === activeIdx ? '18px' : '5px',
                    backgroundColor: i === activeIdx ? '#6366f1' : 'rgba(255,255,255,0.15)',
                  }}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   FEATURE CARDS ROW
   ═══════════════════════════════════════════════════════════════ */

function FeatureRow() {
  const features = [
    {
      icon: FiCpu,
      title: 'AI-powered understanding',
      desc: 'Structure, tables, and language parsed on upload.',
    },
    {
      icon: FiSearch,
      title: 'Context-aware answers',
      desc: 'Responses grounded in your own source passages.',
    },
    {
      icon: FiShield,
      title: 'Secure workspace',
      desc: 'Isolated storage with enterprise-grade controls.',
    },
  ];

  return (
    <div className="relative w-full mt-3">
      <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
        {features.map((f, i) => (
          <div
            key={i}
            className="bg-[#0b1224]/80 border border-white/[0.06] rounded-xl p-3 sm:p-3.5 hover:border-indigo-500/20 hover:bg-[#0e162d]/90 transition-all duration-200 flex flex-col justify-between"
          >
            <div>
              <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/15 flex items-center justify-center mb-2">
                <f.icon className="text-indigo-400 text-xs" />
              </div>
              <h4 className="text-[12px] font-semibold text-white/90 mb-1 leading-tight">
                {f.title}
              </h4>
            </div>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              {f.desc}
            </p>
          </div>
        ))}
      </div>
      <SparkleIcon className="absolute -bottom-2 -right-3" delay={1.8} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   FORM FIELDS & SOCIAL BUTTONS
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
  error
}) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <label
          htmlFor={id}
          className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.12em]"
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
            bg-[#090e1d] border border-white/[0.08] rounded-xl text-[14px] font-medium text-white
            placeholder-slate-500
            focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/40
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
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors p-1"
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

function SocialButton({ icon, label, onClick, disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex-1 flex items-center justify-center gap-2 h-[44px] bg-[#090e1d] border border-white/[0.08] rounded-xl text-[13px] font-medium text-slate-200 hover:bg-white/[0.05] hover:border-white/[0.15] transition-all duration-200 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {icon}
      <span>{label}</span>
    </button>
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
   MAIN AUTHENTICATION PAGE
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
        setSocialMsg('Google OAuth is ready. To enable live Google Sign-In, configure GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables.');
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
        setSocialMsg('GitHub OAuth is ready. To enable live GitHub Sign-In, configure GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET environment variables.');
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
      className="min-h-screen lg:h-screen w-full flex relative overflow-y-auto lg:overflow-hidden auth-grid-bg"
      style={{
        fontFamily: "'Inter', sans-serif",
        backgroundColor: '#070b16'
      }}
    >
      {/* Base 60px Grid Pattern Layer */}
      <div className="auth-grid-mask" />

      {/* Illuminated Ambient Grid Lines Layer */}
      <div className="auth-grid-accent" />

      {/* Glowing Ambient Radial Light Spotlights */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Blue Top-Left Hero Spotlight */}
        <div className="absolute -top-32 left-[5%] w-[650px] h-[650px] bg-blue-600/[0.14] rounded-full blur-[130px]" />
        {/* Purple Top-Right Login Card Spotlight */}
        <div className="absolute -top-24 right-[5%] w-[600px] h-[600px] bg-violet-600/[0.12] rounded-full blur-[130px]" />
        {/* Indigo Center Showcase Spotlight */}
        <div className="absolute top-[28%] left-[18%] w-[550px] h-[550px] bg-indigo-600/[0.10] rounded-full blur-[120px]" />
      </div>

      {/* Main Symmetric 2-Column Grid Container */}
      <div className="relative z-10 w-full max-w-[1380px] mx-auto px-6 sm:px-10 lg:px-12 xl:px-16 py-8 lg:py-4 h-full flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] xl:grid-cols-[1.2fr_0.8fr] gap-8 lg:gap-12 xl:gap-16 items-center w-full my-auto">

          {/* ═══════════════════════════════════════════════════════
               LEFT COLUMN: Branding, Hero, Showcase, Feature Cards
             ═══════════════════════════════════════════════════════ */}
          <div className="hidden lg:flex flex-col w-full max-w-[620px] mx-auto lg:mx-0">
            <div className="mb-6">
              <BrandHeader />
            </div>

            <HeroSection />

            <AIShowcase />

            <FeatureRow />
          </div>

          {/* ═══════════════════════════════════════════════════════
               RIGHT COLUMN: Login Card
             ═══════════════════════════════════════════════════════ */}
          <div className="w-full flex flex-col items-center justify-center">

            {/* Mobile-only Brand Header & Hero */}
            <div className="lg:hidden w-full max-w-[420px] mb-6">
              <BrandHeader />
              <div className="mt-4">
                <h1 className="text-[28px] font-extrabold text-white leading-[1.12] tracking-tight">
                  Your documents,<br />
                  <span className="bg-gradient-to-r from-white via-indigo-200 to-indigo-400 bg-clip-text text-transparent">
                    understood by AI.
                  </span>
                </h1>
                <p className="text-[13px] text-slate-400 mt-2 leading-relaxed">
                  Upload documents, ask questions in natural language, and get accurate answers.
                </p>
              </div>
            </div>

            {/* Login Card */}
            <div className="w-full max-w-[420px]">
              <div className="bg-[#0a1022]/90 backdrop-blur-xl border border-white/[0.08] rounded-[24px] shadow-2xl shadow-black/50 p-7 sm:p-8">
                <h2 className="text-[26px] font-bold text-white tracking-tight leading-tight">
                  {isRegister ? 'Create your account' : 'Welcome back'}
                </h2>
                <p className="text-[13px] text-slate-400 mt-1.5 leading-relaxed mb-7">
                  {isRegister
                    ? 'Start your AI document journey today.'
                    : 'Sign in to continue to your documents and AI workspace.'}
                </p>

                {/* Status & Error Alerts */}
                <div className="min-h-0">
                  {error && (
                    <div
                      className="mb-5 px-3.5 py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[12px] font-semibold"
                      role="alert"
                    >
                      {error}
                    </div>
                  )}
                  {socialMsg && (
                    <div
                      className="mb-5 px-3.5 py-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[12px] font-semibold leading-relaxed"
                      role="status"
                    >
                      {socialMsg}
                    </div>
                  )}
                  {forgotMsg && (
                    <div
                      className="mb-5 px-3.5 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[12px] font-semibold"
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
                            className="text-[11px] text-slate-400 hover:text-indigo-400 transition-colors font-medium"
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
                    className="w-full h-[48px] mt-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:via-indigo-500 hover:to-violet-500 text-white text-[14px] font-semibold rounded-xl shadow-lg shadow-indigo-500/20 transition-all duration-200 hover:shadow-indigo-500/35 hover:brightness-110 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>{isRegister ? 'Creating account...' : 'Signing in...'}</span>
                      </>
                    ) : (
                      <span>{isRegister ? 'Create Account' : 'Sign in'}</span>
                    )}
                  </button>
                </form>

                {/* OR Divider */}
                <div className="flex items-center gap-3 my-6">
                  <div className="flex-1 h-px bg-white/[0.06]" />
                  <span className="text-[10px] text-slate-500 font-medium uppercase tracking-widest">
                    OR
                  </span>
                  <div className="flex-1 h-px bg-white/[0.06]" />
                </div>

                {/* Social Login Buttons */}
                <div className="flex gap-3">
                  <SocialButton
                    icon={<GoogleIcon />}
                    label="Continue with Google"
                    onClick={handleGoogleLogin}
                  />
                  <SocialButton
                    icon={<GitHubIcon />}
                    label="Continue with GitHub"
                    onClick={handleGitHubLogin}
                  />
                </div>

                {/* Footer Switch */}
                <div className="mt-6 pt-5 border-t border-white/[0.05] text-center">
                  <p className="text-[13px] text-slate-400">
                    {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
                    <button
                      onClick={toggleMode}
                      className="text-white font-bold hover:text-indigo-400 transition-colors ml-1 underline underline-offset-2"
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
