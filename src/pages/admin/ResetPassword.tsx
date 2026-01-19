import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Eye, EyeOff } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { usePostApiAdminResetSuperadminPassword } from '../../services/api';

interface FormState {
  username: string;
  newPassword: string;
  confirm: string;
}

const ResetPassword: React.FC = () => {
  const { t } = useTranslation('admin');
  const navigate = useNavigate();

  const [form, setForm] = useState<FormState>({ username: '', newPassword: '', confirm: '' });
  const [error, setError] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const resetMutation = usePostApiAdminResetSuperadminPassword({
    mutation: {
      onSuccess: () => {
        setLoading(false);
        navigate('/admin/login');
      },
      onError: (err: any) => {
        console.error('Reset password failed', err);
        setError(t('reset.error', 'Failed to reset password.'));
      },
      onSettled: () => setLoading(false),
    }
  });

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
  };

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    setError(null);

    if (!form.username.trim()) {
      setError(t('reset.errorUsername', 'Please enter username'));
      return;
    }
    if (!form.newPassword) {
      setError(t('reset.errorNew', 'Please enter new password'));
      return;
    }
    if (form.newPassword !== form.confirm) {
      setError(t('reset.errorMatch', 'Passwords do not match'));
      return;
    }

    resetMutation.mutate({ data: {  newPassword: form.newPassword } });
  };


  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="bg-white border border-gray-100 rounded-2xl shadow-lg p-8">
            <h1 className="text-xl font-semibold text-slate-800 mb-4">{t('reset.title', 'Reset Password')}</h1>

            {error && <div className="mb-4 text-sm text-red-700 bg-red-50 p-3 rounded">{error}</div>}

            <form onSubmit={submit} className="space-y-4">
              <div>
                <label htmlFor="username" className="text-sm text-slate-700">{t('reset.username', 'Username')}</label>
                <input
                  id="username"
                  name="username"
                  value={form.username}
                  onChange={onChange}
                  className="w-full mt-1 px-3 py-2 border rounded"
                  autoComplete="username"
                />
              </div>

              <div>
                <label htmlFor="newPassword" className="text-sm text-slate-700">{t('reset.newPassword', 'New password')}</label>
                <div className="relative">
                  <input
                    id="newPassword"
                    name="newPassword"
                    type={showNew ? 'text' : 'password'}
                    value={form.newPassword}
                    onChange={onChange}
                    className="w-full mt-1 px-3 py-2 border rounded"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew((s) => !s)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500"
                    aria-label={showNew ? 'Hide password' : 'Show password'}
                  >
                    {showNew ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirm" className="text-sm text-slate-700">{t('reset.confirm', 'Confirm new password')}</label>
                <div className="relative">
                  <input
                    id="confirm"
                    name="confirm"
                    type={showConfirm ? 'text' : 'password'}
                    value={form.confirm}
                    onChange={onChange}
                    className="w-full mt-1 px-3 py-2 border rounded"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((s) => !s)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500"
                    aria-label={showConfirm ? 'Hide password' : 'Show password'}
                  >
                    {showConfirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end">
                <button type="submit" disabled={loading} className="px-4 py-2 bg-indigo-600 text-white rounded">
                  {loading ? t('reset.saving', 'Saving...') : t('reset.submit', 'Reset')}
                </button>
              </div>
            </form>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ResetPassword;
