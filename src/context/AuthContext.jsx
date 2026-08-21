import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { loginUser, registerUser } from '../api/authApi';

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

  const login = useCallback(async (email, password) => {
    const res = await loginUser(email, password);
    const { token: jwt, fullName, email: userEmail } = res.data;
    persistAuth(jwt, { fullName, email: userEmail });
    return res;
  }, []);

  const loginWithToken = useCallback((jwtToken, fullName, userEmail) => {
    persistAuth(jwtToken, { fullName, email: userEmail });
  }, []);

  const register = useCallback(async (fullName, email, password) => {
    const res = await registerUser(fullName, email, password);
    const { token: jwt, fullName: name, email: userEmail } = res.data;
    persistAuth(jwt, { fullName: name, email: userEmail });
    return res;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('aidoc_token');
    localStorage.removeItem('aidoc_user');
    setToken(null);
    setUser(null);
  }, []);

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ user, token, loading, isAuthenticated, login, loginWithToken, register, logout }}>
      {children}
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
