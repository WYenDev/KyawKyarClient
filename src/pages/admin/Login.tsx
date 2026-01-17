import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { usePostApiAuthLogin } from '../../services/api';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import logo from '../../assets/logo-with-text.png';
import { User, Lock, Eye, EyeOff } from 'lucide-react';

interface LoginForm {
  username: string;
  password: string;
}

const AdminLogin: React.FC = () => {
  const { t } = useTranslation('admin');
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState<LoginForm>({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const loginMutation = usePostApiAuthLogin({
    mutation: {
      onSuccess: (response, variables) => {
        if (response.accessToken && response.needPasswordChange !== undefined && response.username !== undefined && response.role !== undefined) {
          login({
            username: response.username,
            accessToken: response.accessToken,
            needPasswordChange: response.needPasswordChange,
            resetPassword: response.resetPassword ?? false,
            recoverCodesSaved: response.recoverCodesSaved ?? false, 
            role: response.role
          });
          navigate('/admin/');
        } else {
          console.log('Invalid login response:', response, variables.data.username);
          setError(t('login.invalidResponse', 'Invalid login response'));
        }
      },
      onError: (err: any) => {
        console.error('Login failed:', err);
        setError(t('login.failed', 'Login failed. Check credentials and try again.'));
      },
      onSettled: () => setLoading(false),
    }
  });

  const handleForgotPassword = () => {
    navigate("/admin/forgot-password")

  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError(null);

    // simple client-side validation
    if (!form.username.trim() || !form.password) {
      setError(t('login.error', 'Invalid username or password'));
      return;
    }

    setLoading(true);

    try {
      loginMutation.mutate({
        data: {
          username: form.username,
          password: form.password
        }
      });
    }
    catch (err) {
      console.error(err);
      setLoading(false);
      setError(t('login.failed', 'Login failed.'));
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="bg-white border border-gray-100 rounded-2xl shadow-lg p-8">
            <div className="flex flex-col items-center mb-6">
              <img src={logo} alt="logo" className="h-12 mb-3" />
              <h1 className="text-xl font-semibold text-slate-800">{t('login.title')}</h1>
              <p className="text-sm text-slate-500 mt-1">{t('login.hint', 'Use your admin credentials to sign in')}</p>
            </div>

            {error && (
              <div className="mb-4 text-sm text-red-700 bg-red-50 p-3 rounded">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="username" className="sr-only">{t('login.username')}</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <User className="h-5 w-5" />
                  </span>
                  <input
                    id="username"
                    name="username"
                    value={form.username}
                    onChange={onChange}
                    autoComplete="username"
                    placeholder={t('login.usernamePlaceholder')}
                    className="w-full pl-11 pr-3 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="sr-only">{t('login.password')}</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <Lock className="h-5 w-5" />
                  </span>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={onChange}
                    autoComplete="current-password"
                    placeholder={t('login.passwordPlaceholder')}
                    className="w-full pl-11 pr-12 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end">
                <button type="button" className="text-sm text-indigo-600 hover:underline" onClick={handleForgotPassword }>
                  {t('login.forgot', 'Forgot?')}
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-60"
              >
                {loading && (
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                )}
                <span>{loading ? t('login.loading') : t('login.submit')}</span>
              </button>

              <div className="text-center">
                <p className="text-xs text-slate-400">{t('login.support', 'Need help? Contact the site administrator')}</p>
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminLogin;
