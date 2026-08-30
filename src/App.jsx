import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Introduction = lazy(() => import('./pages/Introduction'));
const UploadDocument = lazy(() => import('./pages/UploadDocument'));
const Documents = lazy(() => import('./pages/Documents'));
const DocumentOverview = lazy(() => import('./pages/DocumentOverview'));
const ChatHistory = lazy(() => import('./pages/ChatHistory'));
const Flashcards = lazy(() => import('./pages/Flashcards'));
const Notes = lazy(() => import('./pages/Notes'));
const Users = lazy(() => import('./pages/Users'));
const Profile = lazy(() => import('./pages/Profile'));
const ComingSoon = lazy(() => import('./pages/ComingSoon'));
const Login = lazy(() => import('./pages/Login'));
const VerifyOtp = lazy(() => import('./pages/VerifyOtp'));
const VerifyEmail = lazy(() => import('./pages/VerifyEmail'));
const OAuthCallback = lazy(() => import('./pages/OAuthCallback'));

function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-[#060913]">
      <div className="w-8 h-8 border-3 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin" />
    </div>
  );
}

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="w-8 h-8 border-3 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="w-8 h-8 border-3 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function HomeRoute() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#060913]">
        <div className="w-8 h-8 border-3 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Introduction />;
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Home & Introduction Landing Page */}
              <Route path="/" element={<HomeRoute />} />
              <Route path="/intro" element={<Introduction />} />

              {/* Public routes — login/register, OTP verification & OAuth callback */}
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                }
              />
              <Route
                path="/verify-otp"
                element={
                  <PublicRoute>
                    <VerifyOtp />
                  </PublicRoute>
                }
              />
              <Route
                path="/verify-email"
                element={
                  <PublicRoute>
                    <VerifyEmail />
                  </PublicRoute>
                }
              />
              <Route
                path="/oauth/callback/:provider"
                element={<OAuthCallback />}
              />

              {/* Protected routes — require authentication */}
              <Route
                element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }
              >
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/upload" element={<UploadDocument />} />
                <Route path="/documents" element={<Documents />} />
                <Route path="/documents/:documentId" element={<DocumentOverview />} />
                <Route path="/documents/:documentId/:tab" element={<DocumentOverview />} />
                <Route path="/users" element={<Users />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/flashcards" element={<Flashcards />} />
                <Route path="/notes" element={<Notes />} />
                <Route path="/comparisons" element={<ComingSoon feature="comparisons" />} />
                <Route path="/trash" element={<ComingSoon feature="trash" />} />
                <Route path="/chat" element={<Navigate to="/documents" replace />} />
                <Route path="/history" element={<ChatHistory />} />
              </Route>

              {/* Catch all — redirect to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
