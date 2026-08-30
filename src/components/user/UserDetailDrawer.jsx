import { useState, useEffect } from 'react';
import {
  FiX,
  FiUser,
  FiMail,
  FiShield,
  FiKey,
  FiMonitor,
  FiSmartphone,
  FiActivity,
  FiTrash2,
  FiCheckCircle,
  FiAlertCircle,
  FiClock,
  FiGlobe,
  FiLogOut,
  FiRefreshCw,
} from 'react-icons/fi';
import { getUserDetail, updateUserStatus, deleteUser, revokeSession, revokeOtherSessions } from '../../api/userApi';
import SetPasswordModal from '../auth/SetPasswordModal';

export default function UserDetailDrawer({ isOpen, onClose, userId, currentUserId, onUserUpdated }) {
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'sessions' | 'audit'
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchDetails = async () => {
    if (!userId) return;
    setLoading(true);
    setError('');
    try {
      const res = await getUserDetail(userId);
      setDetail(res.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load user details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && userId) {
      fetchDetails();
    }
  }, [isOpen, userId]);

  if (!isOpen) return null;

  const handleRevokeSession = async (sessionId) => {
    try {
      await revokeSession(sessionId);
      setActionSuccess('Session terminated successfully.');
      fetchDetails();
      setTimeout(() => setActionSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to revoke session.');
    }
  };

  const handleRevokeOtherSessions = async () => {
    try {
      await revokeOtherSessions();
      setActionSuccess('All other device sessions terminated.');
      fetchDetails();
      setTimeout(() => setActionSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to revoke other sessions.');
    }
  };

  const handleStatusChange = async (newStatus) => {
    setActionLoading(true);
    try {
      await updateUserStatus(userId, detail.user.role, newStatus);
      setActionSuccess(`User status updated to ${newStatus}.`);
      fetchDetails();
      if (onUserUpdated) onUserUpdated();
      setTimeout(() => setActionSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update user status.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!window.confirm('Are you sure you want to permanently delete this user account?')) return;
    setActionLoading(true);
    try {
      await deleteUser(userId);
      if (onUserUpdated) onUserUpdated();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete user.');
      setActionLoading(false);
    }
  };

  const user = detail?.user;
  const sessions = detail?.activeSessions || [];
  const auditLogs = detail?.recentAuditLogs || [];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-sm animate-fade-in select-none">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-2xl bg-[#090f20] border-l border-white/[0.1] text-slate-100 shadow-2xl flex flex-col justify-between overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-white/[0.08] flex items-center justify-between relative bg-[#0b1226]/80 backdrop-blur-md">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500/20 via-blue-600/20 to-purple-600/20 border border-white/[0.15] flex items-center justify-center font-bold text-xl text-white shadow-inner">
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt="" className="w-full h-full rounded-2xl object-cover" />
                ) : (
                  user?.fullName?.slice(0, 2).toUpperCase() || 'U'
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-white tracking-tight">{user?.fullName || 'User Details'}</h2>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      user?.role === 'ROLE_ADMIN'
                        ? 'bg-purple-500/15 text-purple-400 border border-purple-500/30'
                        : 'bg-blue-500/15 text-cyan-400 border border-blue-500/30'
                    }`}
                  >
                    {user?.role === 'ROLE_ADMIN' ? 'Admin' : 'User'}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{user?.email}</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/[0.06] transition-colors cursor-pointer"
            >
              <FiX className="text-xl" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 px-6 pt-3 border-b border-white/[0.06] bg-[#070d1d]/90">
            <button
              onClick={() => setActiveTab('profile')}
              className={`pb-3 text-xs font-bold tracking-wide flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
                activeTab === 'profile'
                  ? 'border-cyan-400 text-cyan-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <FiUser /> Overview & Profile
            </button>
            <button
              onClick={() => setActiveTab('sessions')}
              className={`pb-3 text-xs font-bold tracking-wide flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
                activeTab === 'sessions'
                  ? 'border-cyan-400 text-cyan-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <FiMonitor /> Active Sessions ({sessions.length})
            </button>
            <button
              onClick={() => setActiveTab('audit')}
              className={`pb-3 text-xs font-bold tracking-wide flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
                activeTab === 'audit'
                  ? 'border-cyan-400 text-cyan-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <FiActivity /> Security Audit Log
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {error && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-400 text-xs font-medium flex items-center gap-2">
                <FiAlertCircle className="text-sm flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {actionSuccess && (
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-semibold flex items-center gap-2">
                <FiCheckCircle className="text-sm flex-shrink-0" />
                <span>{actionSuccess}</span>
              </div>
            )}

            {loading ? (
              <div className="py-20 flex flex-col items-center justify-center">
                <div className="w-8 h-8 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin mb-3" />
                <p className="text-xs text-slate-400">Loading user profile & sessions...</p>
              </div>
            ) : (
              <>
                {/* ─── TAB 1: PROFILE OVERVIEW ─── */}
                {activeTab === 'profile' && user && (
                  <div className="space-y-6">
                    {/* User Metadata Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-[#0b1226] border border-white/[0.06]">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                          Auth Provider
                        </p>
                        <p className="text-sm font-semibold text-white flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-cyan-400" />
                          {user.provider}
                        </p>
                      </div>

                      <div className="p-4 rounded-xl bg-[#0b1226] border border-white/[0.06]">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                          Email Status
                        </p>
                        <p className="text-sm font-semibold flex items-center gap-1.5 text-emerald-400">
                          <FiCheckCircle className="text-xs" />
                          {user.emailVerified ? 'Verified' : 'Pending Verification'}
                        </p>
                      </div>

                      <div className="p-4 rounded-xl bg-[#0b1226] border border-white/[0.06]">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                          Account Status
                        </p>
                        <p
                          className={`text-sm font-semibold ${
                            user.accountStatus === 'ACTIVE' ? 'text-emerald-400' : 'text-amber-400'
                          }`}
                        >
                          {user.accountStatus}
                        </p>
                      </div>

                      <div className="p-4 rounded-xl bg-[#0b1226] border border-white/[0.06]">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                          Member Since
                        </p>
                        <p className="text-sm font-semibold text-slate-200">
                          {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                    </div>

                    {/* Password & Security Card */}
                    <div className="p-5 rounded-2xl bg-[#0b1226] border border-white/[0.08] relative overflow-hidden">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-cyan-400">
                            <FiKey className="text-lg" />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-white tracking-tight">Local Account Password</h4>
                            <p className="text-xs text-slate-400 mt-0.5">
                              {user.hasPassword
                                ? 'Local password is set and active.'
                                : 'No local password set (Signed up with Google/GitHub OAuth).'}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => setShowPasswordModal(true)}
                          className="px-3.5 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:brightness-110 text-white text-xs font-bold rounded-lg shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
                        >
                          {user.hasPassword ? 'Change Password' : 'Create Password'}
                        </button>
                      </div>
                    </div>

                    {/* Account Controls */}
                    <div className="p-5 rounded-2xl bg-[#0b1226] border border-white/[0.08] space-y-4">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                        Account Controls & Status
                      </h4>

                      <div className="flex flex-wrap items-center gap-3">
                        {user.accountStatus === 'ACTIVE' ? (
                          <button
                            type="button"
                            disabled={actionLoading}
                            onClick={() => handleStatusChange('SUSPENDED')}
                            className="px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                          >
                            Suspend Account
                          </button>
                        ) : (
                          <button
                            type="button"
                            disabled={actionLoading}
                            onClick={() => handleStatusChange('ACTIVE')}
                            className="px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                          >
                            Activate Account
                          </button>
                        )}

                        <button
                          type="button"
                          disabled={actionLoading}
                          onClick={handleDeleteUser}
                          className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer ml-auto"
                        >
                          <FiTrash2 className="text-xs" />
                          Delete User Account
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* ─── TAB 2: ACTIVE SESSIONS ─── */}
                {activeTab === 'sessions' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-slate-400">
                        Active sessions have a <strong className="text-cyan-400">10-minute sliding window</strong> of inactivity.
                      </p>
                      {sessions.length > 1 && (
                        <button
                          type="button"
                          onClick={handleRevokeOtherSessions}
                          className="text-xs text-rose-400 hover:text-rose-300 font-semibold underline underline-offset-2 cursor-pointer"
                        >
                          Terminate All Other Devices
                        </button>
                      )}
                    </div>

                    <div className="space-y-3">
                      {sessions.map((sess) => (
                        <div
                          key={sess.sessionId}
                          className={`p-4 rounded-xl border transition-all ${
                            sess.current
                              ? 'bg-cyan-950/20 border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.1)]'
                              : 'bg-[#0b1226] border-white/[0.06]'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/[0.1] flex items-center justify-center text-slate-300 flex-shrink-0 mt-0.5">
                                {sess.deviceType?.includes('Mobile') ? (
                                  <FiSmartphone className="text-lg" />
                                ) : (
                                  <FiMonitor className="text-lg" />
                                )}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h5 className="text-xs font-bold text-white">{sess.deviceType || 'Device'}</h5>
                                  {sess.current && (
                                    <span className="px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-[10px] font-bold">
                                      Current Device
                                    </span>
                                  )}
                                </div>
                                <p className="text-[11px] text-slate-400 font-mono mt-1 flex items-center gap-2">
                                  <span>IP: {sess.ipAddress}</span>
                                  <span>•</span>
                                  <span>Last Active: {sess.lastActivityAt ? new Date(sess.lastActivityAt).toLocaleTimeString() : 'Active'}</span>
                                </p>
                                <p className="text-[10px] text-slate-500 truncate max-w-[360px] mt-1">
                                  {sess.userAgent}
                                </p>
                              </div>
                            </div>

                            {!sess.current && (
                              <button
                                type="button"
                                onClick={() => handleRevokeSession(sess.sessionId)}
                                className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/25 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                              >
                                <FiLogOut className="text-xs" />
                                Terminate
                              </button>
                            )}
                          </div>
                        </div>
                      ))}

                      {sessions.length === 0 && (
                        <div className="text-center py-10 text-slate-500 text-xs">
                          No active sessions found.
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* ─── TAB 3: AUDIT LOGS ─── */}
                {activeTab === 'audit' && (
                  <div className="space-y-3">
                    <p className="text-xs text-slate-400">
                      Security audit events and login history for this account.
                    </p>

                    <div className="space-y-2.5">
                      {auditLogs.map((log) => (
                        <div
                          key={log.id}
                          className="p-3.5 rounded-xl bg-[#0b1226] border border-white/[0.06] flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-cyan-400 text-xs">
                              <FiClock />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-200">{log.action}</p>
                              <p className="text-[11px] text-slate-400 mt-0.5">{log.details}</p>
                            </div>
                          </div>

                          <div className="text-right">
                            <p className="text-[10px] font-mono text-slate-400">
                              {log.timestamp ? new Date(log.timestamp).toLocaleString() : ''}
                            </p>
                            <p className="text-[10px] font-mono text-slate-500">{log.ipAddress}</p>
                          </div>
                        </div>
                      ))}

                      {auditLogs.length === 0 && (
                        <div className="text-center py-10 text-slate-500 text-xs">
                          No recent audit logs available.
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Drawer Footer */}
          <div className="p-4 border-t border-white/[0.08] bg-[#070d1d] flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2 bg-white/[0.06] hover:bg-white/[0.1] text-slate-300 text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Set Local Password Modal */}
      <SetPasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onSuccess={() => {
          fetchDetails();
          if (onUserUpdated) onUserUpdated();
        }}
      />
    </div>
  );
}
