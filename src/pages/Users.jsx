import { useState, useEffect, useCallback } from 'react';
import {
  FiUsers,
  FiUserCheck,
  FiShield,
  FiSearch,
  FiRefreshCw,
  FiChevronRight,
  FiCheckCircle,
  FiAlertCircle,
  FiLock,
  FiSmartphone,
  FiUser,
  FiClock,
  FiActivity,
} from 'react-icons/fi';
import { getAllUsers } from '../api/userApi';
import { useAuth } from '../context/AuthContext';
import UserDetailDrawer from '../components/user/UserDetailDrawer';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [providerFilter, setProviderFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsersCount, setTotalUsersCount] = useState(0);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const { user: currentUser } = useAuth();
  const isAdmin = currentUser?.role === 'ROLE_ADMIN' || currentUser?.role === 'ADMIN';

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getAllUsers({
        query: isAdmin ? searchQuery : '',
        role: roleFilter,
        provider: providerFilter,
        status: statusFilter,
        page,
        size: 15,
      });

      if (res.data?.content) {
        setUsers(res.data.content);
        setTotalPages(res.data.totalPages || 1);
        setTotalUsersCount(res.data.totalElements || res.data.content.length);
      } else if (Array.isArray(res.data)) {
        setUsers(res.data);
        setTotalPages(1);
        setTotalUsersCount(res.data.length);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load user information.');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, roleFilter, providerFilter, statusFilter, page, isAdmin]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleOpenUserDetail = (userId) => {
    setSelectedUserId(userId);
    setIsDrawerOpen(true);
  };

  // Filter only current user if not admin
  const displayedUsers = isAdmin
    ? users
    : users.filter((u) => u.id === currentUser?.id || u.email?.toLowerCase() === currentUser?.email?.toLowerCase());

  // Aggregate metrics
  const activeUser = displayedUsers[0] || currentUser;
  const verifiedCount = displayedUsers.filter((u) => u.emailVerified).length;
  const activeSessionsTotal = displayedUsers.reduce((acc, u) => acc + (u.activeSessionsCount || 1), 0);

  return (
    <div className="space-y-6 select-none max-w-7xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <span className="p-2 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 text-cyan-400">
              {isAdmin ? <FiUsers className="text-xl sm:text-2xl" /> : <FiUser className="text-xl sm:text-2xl" />}
            </span>
            {isAdmin ? 'Users Directory & Administration' : 'My Account & Security Profile'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {isAdmin
              ? 'Manage user accounts, active sessions, authentication providers, and security verifications.'
              : 'Review and manage your personal account identity, active login sessions, and authentication credentials.'}
          </p>
        </div>

        <button
          type="button"
          onClick={fetchUsers}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#0b1226] border border-slate-200 dark:border-white/[0.08] hover:border-cyan-500/50 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 transition-all shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <FiRefreshCw className={`text-xs ${loading ? 'animate-spin' : ''}`} />
          {isAdmin ? 'Refresh Directory' : 'Refresh Profile'}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#090f20]/90 border border-slate-200/80 dark:border-white/[0.08] shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {isAdmin ? 'Total Users' : 'Account Status'}
            </span>
            <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-cyan-400 flex items-center justify-center text-xs">
              <FiUser />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {isAdmin ? totalUsersCount : (activeUser?.accountStatus || 'ACTIVE')}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            {isAdmin ? 'Registered accounts' : 'Primary Account'}
          </p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#090f20]/90 border border-slate-200/80 dark:border-white/[0.08] shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Email Verified</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-xs">
              <FiUserCheck />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {isAdmin ? verifiedCount : (activeUser?.emailVerified ? 'Verified' : 'Pending')}
          </p>
          <p className="text-[11px] text-emerald-500/90 font-medium mt-0.5">4-digit OTP / OAuth Verified</p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#090f20]/90 border border-slate-200/80 dark:border-white/[0.08] shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Sessions</span>
            <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center text-xs">
              <FiSmartphone />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {isAdmin ? activeSessionsTotal : (activeUser?.activeSessionsCount || 1)}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">10-min active sliding window</p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#090f20]/90 border border-slate-200/80 dark:border-white/[0.08] shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Security State</span>
            <div className="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center text-xs">
              <FiShield />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Active</p>
          <p className="text-[11px] text-purple-400 font-medium mt-0.5">Gateway & JWT Protected</p>
        </div>
      </div>

      {/* Admin Search & Filters */}
      {isAdmin && (
        <div className="p-4 rounded-2xl bg-white dark:bg-[#090f20]/90 border border-slate-200/80 dark:border-white/[0.08] shadow-xs space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="relative lg:col-span-1">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or email..."
                className="w-full h-10 pl-9 pr-4 bg-slate-50 dark:bg-[#070d1d] border border-slate-200 dark:border-white/[0.08] rounded-xl text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
              />
            </div>

            <div>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full h-10 px-3 bg-slate-50 dark:bg-[#070d1d] border border-slate-200 dark:border-white/[0.08] rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 cursor-pointer"
              >
                <option value="">All Roles</option>
                <option value="ROLE_USER">Standard Users (ROLE_USER)</option>
                <option value="ROLE_ADMIN">Administrators (ROLE_ADMIN)</option>
              </select>
            </div>

            <div>
              <select
                value={providerFilter}
                onChange={(e) => setProviderFilter(e.target.value)}
                className="w-full h-10 px-3 bg-slate-50 dark:bg-[#070d1d] border border-slate-200 dark:border-white/[0.08] rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 cursor-pointer"
              >
                <option value="">All Providers</option>
                <option value="GOOGLE">Google OAuth</option>
                <option value="GITHUB">GitHub OAuth</option>
                <option value="LOCAL">Local Email/Password</option>
              </select>
            </div>

            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full h-10 px-3 bg-slate-50 dark:bg-[#070d1d] border border-slate-200 dark:border-white/[0.08] rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 cursor-pointer"
              >
                <option value="">All Statuses</option>
                <option value="ACTIVE">Active Accounts</option>
                <option value="PENDING_VERIFICATION">Pending Verification</option>
                <option value="SUSPENDED">Suspended</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Account Info / Directory Table */}
      <div className="rounded-2xl bg-white dark:bg-[#090f20]/90 border border-slate-200/80 dark:border-white/[0.08] shadow-xs overflow-hidden">
        {error && (
          <div className="p-4 bg-rose-500/10 border-b border-rose-500/20 text-rose-400 text-xs font-medium flex items-center gap-2">
            <FiAlertCircle className="text-sm flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 dark:border-white/[0.06] bg-slate-50/50 dark:bg-[#070d1d]/60 text-[10.5px] font-bold uppercase tracking-wider text-slate-400">
                <th className="py-3.5 px-4 sm:px-6">User / Identity</th>
                <th className="py-3.5 px-4">Auth Provider</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Email Status</th>
                <th className="py-3.5 px-4">Local Password</th>
                <th className="py-3.5 px-4">Active Sessions</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-white/[0.04]">
              {loading && displayedUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center">
                    <div className="w-8 h-8 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin mx-auto mb-2" />
                    <p className="text-xs text-slate-400">Loading user record...</p>
                  </td>
                </tr>
              ) : displayedUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-slate-400">
                    No matching user records found.
                  </td>
                </tr>
              ) : (
                displayedUsers.map((u) => (
                  <tr
                    key={u.id}
                    onClick={() => handleOpenUserDetail(u.id)}
                    className="hover:bg-slate-50/80 dark:hover:bg-white/[0.02] transition-colors cursor-pointer group"
                  >
                    {/* User Identity */}
                    <td className="py-4 px-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center font-bold text-white text-xs shadow-inner uppercase flex-shrink-0">
                          {u.fullName?.slice(0, 2) || u.email?.slice(0, 2) || 'US'}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900 dark:text-white truncate group-hover:text-cyan-400 transition-colors">
                            {u.fullName || 'DocuMind User'}
                          </p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{u.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Auth Provider */}
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10.5px] font-semibold bg-slate-100 dark:bg-white/[0.05] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/[0.06]">
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            u.provider === 'GOOGLE'
                              ? 'bg-red-400'
                              : u.provider === 'GITHUB'
                              ? 'bg-purple-400'
                              : 'bg-emerald-400'
                          }`}
                        />
                        {u.provider || 'LOCAL'}
                      </span>
                    </td>

                    {/* Role */}
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-md text-[10.5px] font-bold ${
                          u.role === 'ROLE_ADMIN'
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                        }`}
                      >
                        {u.role === 'ROLE_ADMIN' ? 'ADMIN' : 'USER'}
                      </span>
                    </td>

                    {/* Email Status */}
                    <td className="py-4 px-4">
                      {u.emailVerified ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400">
                          <FiCheckCircle className="text-xs" />
                          Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-400">
                          <FiAlertCircle className="text-xs" />
                          Pending
                        </span>
                      )}
                    </td>

                    {/* Local Password */}
                    <td className="py-4 px-4">
                      {u.hasLocalPassword ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-slate-400">
                          <FiLock className="text-xs text-emerald-400" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] text-slate-500">
                          <FiLock className="text-xs text-slate-600" />
                          OAuth Only
                        </span>
                      )}
                    </td>

                    {/* Active Sessions */}
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10.5px] font-semibold bg-blue-500/10 text-cyan-400 border border-blue-500/20">
                        <FiActivity className="text-xs" />
                        {u.activeSessionsCount || 1} active
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenUserDetail(u.id);
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 transition-colors cursor-pointer"
                      >
                        Details <FiChevronRight className="text-xs" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination if Admin */}
        {isAdmin && totalPages > 1 && (
          <div className="p-4 border-t border-slate-100 dark:border-white/[0.06] flex items-center justify-between">
            <p className="text-xs text-slate-400">
              Page <span className="font-bold text-white">{page + 1}</span> of{' '}
              <span className="font-bold text-white">{totalPages}</span>
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page === 0}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                className="px-3 py-1.5 rounded-lg border border-white/[0.08] text-xs font-medium text-slate-300 hover:bg-white/[0.04] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={page >= totalPages - 1}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1.5 rounded-lg border border-white/[0.08] text-xs font-medium text-slate-300 hover:bg-white/[0.04] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* User Details & Active Sessions Drawer */}
      <UserDetailDrawer
        userId={selectedUserId}
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedUserId(null);
        }}
        onUserUpdated={fetchUsers}
      />
    </div>
  );
}
