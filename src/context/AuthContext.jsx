import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  loginUser,
  registerUser,
  verifyOtp,
  verifyMagicLink,
  resendOtp,
  setLocalPassword,
  logoutUser,
} from '../api/authApi';
import { getCurrentUserProfile } from '../api/userApi';
import { useIdleTimer } from '../hooks/useIdleTimer';
import SessionWarningModal from '../components/auth/SessionWarningModal';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('aidoc_token') || null);
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('aidoc_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      localStorage.removeItem('aidoc_token');
      localStorage.removeItem('aidoc_user');
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  const persistAuth = (tokenValue, userValue) => {
    localStorage.setItem('aidoc_token', tokenValue);
    localStorage.setItem('aidoc_user', JSON.stringify(userValue));
    setToken(tokenValue);
    setUser(userValue);
  };

  const logout = useCallback(async () => {
    try {
      await logoutUser();
    } catch (e) {
      console.warn('Logout API call failed:', e.getMessage);
    } finally {
      localStorage.removeItem('aidoc_token');
      localStorage.removeItem('aidoc_user');
      setToken(null);
      setUser(null);
    }
  }, []);

  // 10-Minute Inactivity Auto-Logout Hook
  const { showWarning, remainingSeconds, extendSession } = useIdleTimer({
    enabled: !!token,
    onTimeout: () => {
      logout();
      window.location.href = '/login?reason=inactivity';
    },
  });

  const login = useCallback(async (email, password) => {
    const res = await loginUser(email, password);
    if (res.data?.requiresOtpVerification) {
      return res.data;
    }
    const { token: sessionToken, sessionId, user: userData } = res.data;
    const activeToken = sessionToken || sessionId;
    persistAuth(activeToken, userData);
    return res.data;
  }, []);

  const register = useCallback(async (fullName, email, password) => {
    const res = await registerUser(fullName, email, password);
    return res.data;
  }, []);

  const verifyOtpCode = useCallback(async (email, otpCode) => {
    const res = await verifyOtp(email, otpCode);
    const { token: sessionToken, sessionId, user: userData } = res.data;
    const activeToken = sessionToken || sessionId;
    persistAuth(activeToken, userData);
    return res.data;
  }, []);

  const verifyMagicToken = useCallback(async (tokenString) => {
    const res = await verifyMagicLink(tokenString);
    const { token: sessionToken, sessionId, user: userData } = res.data;
    const activeToken = sessionToken || sessionId;
    persistAuth(activeToken, userData);
    return res.data;
  }, []);

  const loginWithToken = useCallback((activeToken, userData) => {
    persistAuth(activeToken, userData);
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!token) return;
    try {
      const res = await getCurrentUserProfile();
      if (res.data) {
        setUser(res.data);
        localStorage.setItem('aidoc_user', JSON.stringify(res.data));
      }
    } catch (e) {
      console.warn('Failed to refresh user profile:', e.message);
    }
  }, [token]);

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        login,
        register,
        verifyOtpCode,
        verifyMagicToken,
        loginWithToken,
        refreshProfile,
        logout,
      }}
    >
      {children}

      {/* 10-Minute Inactivity Warning Modal */}
      <SessionWarningModal
        isOpen={showWarning}
        remainingSeconds={remainingSeconds}
        onExtend={extendSession}
        onLogout={logout}
      />
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
