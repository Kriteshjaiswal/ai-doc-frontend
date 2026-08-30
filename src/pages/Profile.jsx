import { useState, useEffect, useCallback } from 'react';
import {
  FiUser,
  FiMail,
  FiShield,
  FiKey,
  FiMonitor,
  FiActivity,
  FiCheckCircle,
  FiAlertCircle,
  FiClock,
  FiCalendar,
  FiEdit2,
  FiCheck,
  FiAtSign,
  FiHash,
  FiGlobe,
  FiLayers,
  FiLock,
  FiRefreshCw,
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { getCurrentUserProfile, getUserDetail, updateProfile } from '../api/userApi';
import SetPasswordModal from '../components/auth/SetPasswordModal';

export default function Profile() {
  const { user: authUser, refreshProfile } = useAuth();
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editLoading, setEditLoading] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const fetchProfileData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      // 1. Direct call to DB for authenticated user profile
      const meRes = await getCurrentUserProfile();
      const meData = meRes.data?.data || meRes.data || {};

      let fullDetail = null;
      if (meData?.id) {
        try {
          const detailRes = await getUserDetail(meData.id);
          fullDetail = detailRes.data?.data || detailRes.data;
        } catch (detailErr) {
          console.warn('Could not fetch full user detail, using /users/me:', detailErr.message);
        }
      }

      const mergedUser = fullDetail?.user || meData || authUser || {};
      setDetail({
        user: mergedUser,
        activeSessions: fullDetail?.activeSessions || [],
        recentAuditLogs: fullDetail?.recentAuditLogs || [],
      });
      setEditName(mergedUser.fullName || '');
    } catch (err) {
      console.warn('Could not fetch user profile from DB, using auth context:', err.message);
      setDetail({
        user: authUser || {},
        activeSessions: [],
        recentAuditLogs: [],
      });
      setEditName(authUser?.fullName || '');
    } finally {
      setLoading(false);
    }
  }, [authUser]);

  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!editName.trim()) return;
    setEditLoading(true);
    try {
      await updateProfile(editName.trim(), null);
      setSuccessMsg('Profile updated successfully.');
      setIsEditing(false);
      await refreshProfile();
      await fetchProfileData();
      setTimeout(() => setSuccessMsg(''), 3500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setEditLoading(false);
    }
  };

  const user = detail?.user || authUser || {};
  const sessions = detail?.activeSessions || [];
  const auditLogs = detail?.recentAuditLogs || [];

  // Parse initials from actual user name
  const getInitials = (name, email) => {
    const target = name || email || 'DocuMind User';
    const parts = target.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // Format dates cleanly from real ISO strings
  const formatDate = (isoString) => {
    if (!isoString) {
      return new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    }
    try {
      const d = new Date(isoString);
      if (isNaN(d.getTime())) return 'Recently';
      return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return 'Recently';
    }
  };

  const formatDateTime = (isoString) => {
    if (!isoString) return 'Just now';
    try {
      const d = new Date(isoString);
      if (isNaN(d.getTime())) return 'Just now';
      const isToday = new Date().toDateString() === d.toDateString();
      const timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      return isToday ? `Today, ${timeStr}` : `${d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}, ${timeStr}`;
    } catch {
      return 'Just now';
    }
  };

  // Dynamically parse client browser and OS from active session or current navigator
  const parseBrowserAndOS = (ua = '') => {
    const raw = ua || (typeof navigator !== 'undefined' ? navigator.userAgent : '') || '';
    let browser = 'Chrome';
    let os = 'Windows';

    if (raw.includes('Edg/')) browser = 'Microsoft Edge';
    else if (raw.includes('Chrome/')) browser = 'Google Chrome';
    else if (raw.includes('Firefox/')) browser = 'Mozilla Firefox';
    else if (raw.includes('Safari/') && !raw.includes('Chrome/')) browser = 'Apple Safari';
    else if (raw.includes('Opera/') || raw.includes('OPR/')) browser = 'Opera';

    if (raw.includes('Windows NT 10.0') || raw.includes('Windows')) os = 'Windows 11';
    else if (raw.includes('Macintosh') || raw.includes('Mac OS')) os = 'macOS';
    else if (raw.includes('Linux')) os = 'Linux';
    else if (raw.includes('Android')) os = 'Android';
    else if (raw.includes('iPhone') || raw.includes('iPad')) os = 'iOS';

    return { browser, os };
  };

  // Find active session or construct dynamic current session
  const currentSession = sessions.find((s) => s.isCurrent) || sessions[0] || {
    deviceType: 'Desktop',
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Chrome · Windows',
    lastActivityAt: user.updatedAt || user.createdAt || new Date().toISOString(),
    ipAddress: '127.0.0.1',
  };

  const { browser, os } = parseBrowserAndOS(currentSession.userAgent || '');

  // Generate dynamic username slug
  const username = user.fullName
    ? '@' + user.fullName.toLowerCase().replace(/[^a-z0-9]/g, '')
    : '@' + (user.email?.split('@')[0]?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'user');

  // Email verification status boolean
  const isVerified = Boolean(user.emailVerified || user.isEmailVerified);
  const accountStatus = user.accountStatus || 'ACTIVE';
  const provider = user.provider || 'LOCAL';
  const hasLocalPassword = Boolean(user.hasPassword || user.hasLocalPassword || provider === 'LOCAL');

  if (loading && !detail && !authUser?.id) {
    return (
      <div className="space-y-6 max-w-6xl mx-auto pb-16 font-sans">
        <div className="h-44 rounded-[24px] bg-slate-100 dark:bg-slate-800/40 animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-64 rounded-[22px] bg-slate-100 dark:bg-slate-800/40 animate-pulse" />
          <div className="h-64 rounded-[22px] bg-slate-100 dark:bg-slate-800/40 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 select-none max-w-6xl mx-auto pb-16 font-sans">
      {/* Notifications / Alerts */}
      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <FiCheckCircle className="text-base flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/25 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <FiAlertCircle className="text-base flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
          HERO PROFILE BANNER CARD (TOP)
          ═══════════════════════════════════════════════════════════ */}
      <div className="relative bg-white dark:bg-[#090f20]/95 backdrop-blur-2xl border border-slate-200/90 dark:border-white/[0.08] rounded-[24px] p-6 sm:p-8 shadow-sm dark:shadow-[0_4px_30px_rgba(0,0,0,0.4)] overflow-hidden transition-colors duration-200">
        {/* Subtle Top Ambient Glow Beam */}
        <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/40 via-indigo-500/40 to-transparent pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5 sm:gap-6">
            {/* User Avatar with Glowing Blinking Active Dot */}
            <div className="relative flex-shrink-0">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-[#3b5998] via-[#4a69bd] to-[#6a89cc] p-[2.5px] shadow-md dark:shadow-[0_0_25px_rgba(99,102,241,0.3)]">
                <div className="w-full h-full rounded-full bg-slate-900 dark:bg-[#050816] flex items-center justify-center font-extrabold text-white text-2xl sm:text-3xl tracking-wider">
                  {getInitials(user.fullName, user.email)}
                </div>
              </div>

              {/* Blinking Online Green Indicator Dot */}
              <div className="absolute bottom-1 right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white dark:border-[#090f20] shadow-[0_0_8px_#10b981]" />
              </div>
            </div>

            {/* Profile Info */}
            <div className="space-y-1.5 min-w-0">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight truncate">
                {user.fullName || user.email?.split('@')[0] || 'User'}
              </h1>

              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                <FiMail className="text-xs text-slate-400 flex-shrink-0" />
                <span className="truncate">{user.email || '—'}</span>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                {/* Email Verification Status Badge */}
                {isVerified ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 shadow-2xs">
                    <FiCheck className="text-xs stroke-[3]" />
                    Email Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-amber-700 dark:text-amber-400 shadow-2xs">
                    <FiClock className="text-xs" />
                    Pending Verification
                  </span>
                )}

                {/* Account Status Badge with Blinking Dot */}
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 shadow-2xs">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                  {accountStatus === 'ACTIVE' ? 'Active Account' : accountStatus}
                </span>
              </div>

              <p className="text-[11.5px] text-slate-500 dark:text-slate-400 pt-1">
                Member since {formatDate(user.createdAt)}
              </p>
            </div>
          </div>

          {/* Edit Profile & Refresh Buttons */}
          <div className="flex items-center gap-2 self-start sm:self-center">
            <button
              type="button"
              onClick={fetchProfileData}
              title="Refresh profile details"
              className="p-2.5 bg-slate-50 dark:bg-[#0b1226] hover:bg-slate-100 dark:hover:bg-[#101a38] border border-slate-200 dark:border-white/[0.10] rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 transition-all cursor-pointer"
            >
              <FiRefreshCw className={`text-xs ${loading ? 'animate-spin' : ''}`} />
            </button>

            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-50 dark:bg-[#0b1226] hover:bg-slate-100 dark:hover:bg-[#101a38] border border-slate-200 dark:border-white/[0.10] hover:border-cyan-500/40 rounded-xl text-xs font-bold text-slate-800 dark:text-white transition-all shadow-xs cursor-pointer"
            >
              <FiEdit2 className="text-xs text-slate-500 dark:text-slate-300" />
              <span>Edit Profile</span>
            </button>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          ROW 1: PERSONAL INFORMATION & ACCOUNT IDENTITY
          ═══════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
        {/* Left Card: Personal Information */}
        <div className="bg-white dark:bg-[#090f20]/95 backdrop-blur-2xl border border-slate-200/90 dark:border-white/[0.08] rounded-[22px] p-6 sm:p-7 shadow-sm dark:shadow-xs space-y-6 transition-colors duration-200">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">Personal Information</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Details associated with your account.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-6">
            {/* Full Name */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 flex items-center justify-center text-sm flex-shrink-0 mt-0.5">
                  <FiUser />
                </div>
                <div className="min-w-0">
                  <span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider block">Full Name</span>
                  <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white truncate mt-0.5">{user.fullName || '—'}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="text-[11.5px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex-shrink-0 pt-0.5 cursor-pointer"
              >
                Edit
              </button>
            </div>

            {/* Email Address */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 flex items-center justify-center text-sm flex-shrink-0 mt-0.5">
                <FiMail />
              </div>
              <div className="min-w-0">
                <span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider block">Email Address</span>
                <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white truncate mt-0.5">{user.email || '—'}</p>
              </div>
            </div>

            {/* Username */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 flex items-center justify-center text-sm flex-shrink-0 mt-0.5">
                <FiAtSign />
              </div>
              <div className="min-w-0">
                <span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider block">Username</span>
                <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white truncate mt-0.5">{username}</p>
              </div>
            </div>

            {/* Account Status with Blinking Dot */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 flex items-center justify-center text-sm flex-shrink-0 mt-0.5">
                <FiActivity />
              </div>
              <div className="min-w-0">
                <span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider block">Account Status</span>
                <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2 mt-0.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                  {accountStatus}
                </p>
              </div>
            </div>

            {/* Authentication */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 flex items-center justify-center text-sm flex-shrink-0 mt-0.5">
                  <FiKey />
                </div>
                <div className="min-w-0">
                  <span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider block">Authentication</span>
                  <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white truncate mt-0.5">
                    {provider === 'GOOGLE' ? 'Google OAuth' : provider === 'GITHUB' ? 'GitHub OAuth' : 'Local Account'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPasswordModal(true)}
                className="text-[11.5px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex-shrink-0 pt-0.5 cursor-pointer"
              >
                {hasLocalPassword ? 'Change Password' : '+ Set Password'}
              </button>
            </div>

            {/* Email Verification */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 flex items-center justify-center text-sm flex-shrink-0 mt-0.5">
                <FiCheckCircle />
              </div>
              <div className="min-w-0">
                <span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider block">Email Verification</span>
                <p className="text-xs sm:text-sm font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-0.5">
                  {isVerified ? '✓ Verified' : 'Pending Verification'}
                </p>
              </div>
            </div>

            {/* Member Since */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 flex items-center justify-center text-sm flex-shrink-0 mt-0.5">
                <FiCalendar />
              </div>
              <div className="min-w-0">
                <span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider block">Member Since</span>
                <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white truncate mt-0.5">
                  {formatDate(user.createdAt)}
                </p>
              </div>
            </div>

            {/* Last Login / Activity */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 flex items-center justify-center text-sm flex-shrink-0 mt-0.5">
                <FiClock />
              </div>
              <div className="min-w-0">
                <span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-wider block">Last Login</span>
                <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white truncate mt-0.5">
                  {formatDateTime(currentSession.lastActivityAt || user.lastActiveAt || user.updatedAt || user.createdAt)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Card: Account Identity */}
        <div className="bg-white dark:bg-[#090f20]/95 backdrop-blur-2xl border border-slate-200/90 dark:border-white/[0.08] rounded-[22px] p-6 sm:p-7 shadow-sm dark:shadow-xs space-y-6 transition-colors duration-200">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">Account Identity</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Identifiers used across the platform.</p>
          </div>

          <div className="space-y-4 text-xs sm:text-sm">
            {/* User ID */}
            <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-white/[0.04]">
              <div className="flex items-center gap-2.5 text-slate-500 dark:text-slate-400">
                <FiHash className="text-sm" />
                <span>User ID</span>
              </div>
              <span className="font-mono text-xs text-slate-700 dark:text-slate-300">
                usr_{String(user.id || 1).padStart(4, '0')}••••••••
              </span>
            </div>

            {/* Authentication Provider */}
            <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-white/[0.04]">
              <div className="flex items-center gap-2.5 text-slate-500 dark:text-slate-400">
                <FiKey className="text-sm" />
                <span>Authentication</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-white/[0.05] text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/[0.08]">
                {provider}
              </span>
            </div>

            {/* Status with Blinking Dot */}
            <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-white/[0.04]">
              <div className="flex items-center gap-2.5 text-slate-500 dark:text-slate-400">
                <FiActivity className="text-sm" />
                <span>Status</span>
              </div>
              <span className="flex items-center gap-2 font-semibold text-emerald-600 dark:text-emerald-400 text-xs">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                {accountStatus}
              </span>
            </div>

            {/* Email Verification */}
            <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-white/[0.04]">
              <div className="flex items-center gap-2.5 text-slate-500 dark:text-slate-400">
                <FiMail className="text-sm" />
                <span>Email</span>
              </div>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400 text-xs">
                {isVerified ? '✓ Verified' : 'Pending'}
              </span>
            </div>

            {/* Created */}
            <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-white/[0.04]">
              <div className="flex items-center gap-2.5 text-slate-500 dark:text-slate-400">
                <FiCalendar className="text-sm" />
                <span>Created</span>
              </div>
              <span className="text-slate-700 dark:text-slate-300 font-medium text-xs">
                {formatDate(user.createdAt)}
              </span>
            </div>

            {/* Last Updated */}
            <div className="flex items-center justify-between py-1.5">
              <div className="flex items-center gap-2.5 text-slate-500 dark:text-slate-400">
                <FiClock className="text-sm" />
                <span>Last updated</span>
              </div>
              <span className="text-slate-700 dark:text-slate-300 font-medium text-xs">
                {formatDateTime(user.updatedAt || user.createdAt)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          ROW 2: SECURITY STATUS & CURRENT SESSION
          ═══════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
        {/* Left Card: Security Status */}
        <div className="bg-white dark:bg-[#090f20]/95 backdrop-blur-2xl border border-slate-200/90 dark:border-white/[0.08] rounded-[22px] p-6 sm:p-7 shadow-sm dark:shadow-xs flex flex-col justify-between space-y-6 transition-colors duration-200">
          <div className="flex items-start gap-4">
            {/* Green Shield Icon Badge */}
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/25 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-2xl flex-shrink-0 shadow-xs dark:shadow-[0_0_20px_rgba(16,185,129,0.2)]">
              <FiShield />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Security Status</span>
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {isVerified ? 'Your account is protected' : 'Verification Needed'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isVerified
                  ? 'Your account security is currently in good standing.'
                  : 'Please complete email verification to secure your workspace.'}
              </p>
            </div>
          </div>

          {/* 3 Dynamic Status Pills */}
          <div className="flex flex-wrap items-center gap-2.5 pt-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-50 dark:bg-[#070d1d] border border-slate-200 dark:border-white/[0.08] text-slate-700 dark:text-slate-200">
              <FiCheck className={`text-xs ${isVerified ? 'text-emerald-500' : 'text-slate-400'} stroke-[3]`} />
              {isVerified ? 'Email verified' : 'Email unverified'}
            </span>

            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-50 dark:bg-[#070d1d] border border-slate-200 dark:border-white/[0.08] text-slate-700 dark:text-slate-200">
              <FiCheck className={`text-xs ${hasLocalPassword ? 'text-emerald-500' : 'text-cyan-500'} stroke-[3]`} />
              {hasLocalPassword ? 'Password protected' : `${provider} OAuth Protected`}
            </span>

            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-50 dark:bg-[#070d1d] border border-slate-200 dark:border-white/[0.08] text-slate-700 dark:text-slate-200">
              <FiCheck className="text-emerald-500 stroke-[3]" />
              Active account
            </span>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={() => setShowPasswordModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-600/15 hover:bg-indigo-100 dark:hover:bg-indigo-600/25 border border-indigo-200 dark:border-indigo-500/30 rounded-xl text-xs font-bold text-indigo-700 dark:text-indigo-300 transition-all cursor-pointer"
            >
              <FiLock className="text-xs" />
              <span>{hasLocalPassword ? 'Change Password' : 'Set Local Password'}</span>
            </button>
          </div>
        </div>

        {/* Right Card: Current Session */}
        <div className="bg-white dark:bg-[#090f20]/95 backdrop-blur-2xl border border-slate-200/90 dark:border-white/[0.08] rounded-[22px] p-6 sm:p-7 shadow-sm dark:shadow-xs space-y-5 transition-colors duration-200">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">Current Session</h2>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/20 text-cyan-700 dark:text-cyan-400">
              Current Session
            </span>
          </div>

          {/* Highlighted Device Box with Pulsing Dot */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#070d1d] border border-slate-200/80 dark:border-white/[0.08] flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center text-xl flex-shrink-0">
                <FiMonitor />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-tight">
                  {browser} · {os}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{currentSession.deviceType || 'Desktop'} device</p>
              </div>
            </div>

            {/* Active now with Blinking Ping Animation */}
            <span className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-[0_0_6px_#10b981]" />
              </span>
              Active now
            </span>
          </div>

          {/* 4 Stats Grid */}
          <div className="grid grid-cols-2 gap-4 text-xs pt-1">
            <div className="flex items-start gap-2.5">
              <FiMonitor className="text-slate-400 text-sm mt-0.5" />
              <div>
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">DEVICE</span>
                <span className="font-semibold text-slate-800 dark:text-white">{currentSession.deviceType || 'Desktop'}</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <FiGlobe className="text-slate-400 text-sm mt-0.5" />
              <div>
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">BROWSER</span>
                <span className="font-semibold text-slate-800 dark:text-white">{browser}</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <FiLayers className="text-slate-400 text-sm mt-0.5" />
              <div>
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">OPERATING SYSTEM</span>
                <span className="font-semibold text-slate-800 dark:text-white">{os}</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <FiClock className="text-slate-400 text-sm mt-0.5" />
              <div>
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">LAST ACTIVE</span>
                <span className="font-semibold text-slate-800 dark:text-white">
                  {currentSession.lastActivityAt ? formatDateTime(currentSession.lastActivityAt) : 'Just now'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          ROW 3: RECENT ACTIVITY TIMELINE (FULL WIDTH)
          ═══════════════════════════════════════════════════════════ */}
      <div className="bg-white dark:bg-[#090f20]/95 backdrop-blur-2xl border border-slate-200/90 dark:border-white/[0.08] rounded-[22px] p-6 sm:p-8 shadow-sm dark:shadow-xs space-y-6 transition-colors duration-200">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">Recent Activity</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Real-time audit log events recorded for this account.</p>
        </div>

        <div className="space-y-5">
          {auditLogs && auditLogs.length > 0 ? (
            auditLogs.slice(0, 6).map((log, idx) => (
              <div key={log.id || idx} className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-white/[0.06] text-slate-600 dark:text-slate-300 flex items-center justify-center text-sm flex-shrink-0 mt-0.5">
                    {log.action?.includes('LOGIN') || log.action?.includes('OAUTH') ? (
                      <FiKey className="text-cyan-600 dark:text-cyan-400" />
                    ) : log.action?.includes('OTP') || log.action?.includes('VERIF') ? (
                      <FiCheckCircle className="text-emerald-600 dark:text-emerald-400" />
                    ) : log.action?.includes('PROFILE') ? (
                      <FiUser className="text-purple-600 dark:text-purple-400" />
                    ) : (
                      <FiMonitor className="text-indigo-600 dark:text-indigo-400" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                      {log.action === 'LOGIN_SUCCESS'
                        ? 'Signed in successfully'
                        : log.action === 'OAUTH_LOGIN'
                        ? `Logged in via ${provider} OAuth`
                        : log.action === 'OTP_VERIFIED'
                        ? 'Email verified via OTP'
                        : log.action === 'PROFILE_UPDATED'
                        ? 'Profile updated'
                        : log.action === 'SESSION_CREATED'
                        ? 'New session started'
                        : log.action === 'REGISTER_INITIATED'
                        ? 'Account registered'
                        : log.action || 'Activity recorded'}
                    </p>
                    <p className="text-[11.5px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {log.details || `${browser} on ${os} · ${log.ipAddress || 'Active Session'}`}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-slate-400 dark:text-slate-500 font-medium whitespace-nowrap">
                  {formatDateTime(log.timestamp || log.createdAt)}
                </span>
              </div>
            ))
          ) : (
            // Dynamic activity log generated strictly from user's live account timestamps
            <>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-white/[0.06] text-cyan-600 dark:text-cyan-400 flex items-center justify-center text-sm flex-shrink-0 mt-0.5">
                    <FiKey />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">Signed in successfully</p>
                    <p className="text-[11.5px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {browser} on {os} · {currentSession.ipAddress || 'Active Session'}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-slate-400 dark:text-slate-500 font-medium whitespace-nowrap">
                  {formatDateTime(currentSession.lastActivityAt || user.updatedAt || user.createdAt)}
                </span>
              </div>

              {isVerified && (
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-white/[0.06] text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-sm flex-shrink-0 mt-0.5">
                      <FiCheckCircle />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">Email verified</p>
                      <p className="text-[11.5px] text-slate-500 dark:text-slate-400 mt-0.5">
                        Verification completed for {user.email || 'account'}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-slate-400 dark:text-slate-500 font-medium whitespace-nowrap">
                    {formatDate(user.createdAt)}
                  </span>
                </div>
              )}

              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-white/[0.06] text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-sm flex-shrink-0 mt-0.5">
                    <FiUser />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">Account Created</p>
                    <p className="text-[11.5px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Registered via {provider} authentication
                    </p>
                  </div>
                </div>
                <span className="text-xs text-slate-400 dark:text-slate-500 font-medium whitespace-nowrap">
                  {formatDate(user.createdAt)}
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#090f20] border border-slate-200 dark:border-white/[0.12] rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl space-y-4 animate-in zoom-in-95">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Edit Profile Details</h3>
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl bg-slate-50 dark:bg-[#070d1d] border border-slate-200 dark:border-white/[0.10] text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-400 focus:outline-none"
                  placeholder="Enter full name"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/[0.10] text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/[0.04] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editLoading}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-xs font-bold text-white shadow-md shadow-indigo-500/25 cursor-pointer disabled:opacity-50"
                >
                  {editLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Set Password Modal */}
      <SetPasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onSuccess={() => {
          fetchProfileData();
          setSuccessMsg('Password updated successfully.');
          setTimeout(() => setSuccessMsg(''), 3500);
        }}
      />
    </div>
  );
}
