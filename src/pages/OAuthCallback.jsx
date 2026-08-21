import { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { oauthLogin } from '../api/authApi';

export default function OAuthCallback() {
  const { provider } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loginWithToken } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const code = searchParams.get('code');
    const oauthError = searchParams.get('error') || searchParams.get('error_description');

    if (oauthError) {
      setError(`OAuth authentication cancelled or denied by ${provider}: ${oauthError}`);
      setLoading(false);
      return;
    }

    if (!code) {
      setError(`Missing authorization code from ${provider}.`);
      setLoading(false);
      return;
    }

    const processOAuth = async () => {
      try {
        setLoading(true);
        const redirectUri = `${window.location.origin}/oauth/callback/${provider}`;
        const res = await oauthLogin(provider, code, redirectUri);

        const { token, fullName, email } = res.data;
        loginWithToken(token, fullName, email);
        navigate('/', { replace: true });
      } catch (err) {
        console.error(`OAuth login error (${provider}):`, err);
        setError(err.response?.data?.message || err.message || `Failed to complete ${provider} login.`);
      } finally {
        setLoading(false);
      }
    };

    processOAuth();
  }, [provider, searchParams, loginWithToken, navigate]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#070b16] text-white p-6" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="w-full max-w-md bg-[#0a1022]/90 border border-white/[0.08] rounded-2xl p-8 shadow-2xl text-center">
        {loading ? (
          <div className="space-y-4">
            <div className="w-12 h-12 border-3 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto" />
            <h2 className="text-lg font-bold text-white tracking-tight">Authenticating with {provider}...</h2>
            <p className="text-xs text-slate-400">Verifying security credentials and creating your AI workspace session.</p>
          </div>
        ) : error ? (
          <div className="space-y-5">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto text-xl font-bold">
              !
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Authentication Failed</h2>
              <p className="text-xs text-rose-400 mt-2 leading-relaxed bg-rose-500/10 border border-rose-500/20 p-3 rounded-xl">{error}</p>
            </div>
            <button
              onClick={() => navigate('/login', { replace: true })}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/25"
            >
              Return to Login
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
