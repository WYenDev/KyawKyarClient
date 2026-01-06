import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { usePostApiAdminChangePassword } from '../../services/api';

const PasswordChange: React.FC = () => {
  const { t } = useTranslation('admin');
  const navigate = useNavigate();
  const {  markPasswordChanged } = useAuth();

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const changePasswordMutation = usePostApiAdminChangePassword({
    mutation: {
      onSuccess: () => {
        markPasswordChanged();
        navigate('/admin/');
      },
      onError: (err: any) => {
        console.error('Change password failed', err);
        setError(t('passwordChange.error', 'Failed to change password'));
      },
      onSettled: () => setLoading(false),
    }
  });

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    setError(null);

    if (!oldPassword || !newPassword) {
      setError(t('passwordChange.errorEmpty', 'Please fill both fields'));
      return;
    }
    if (newPassword !== confirm) {
      setError(t('passwordChange.errorMatch', 'New passwords do not match'));
      return;
    }

    setLoading(true);
    changePasswordMutation.mutate({ data: { oldPassword, newPassword } });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="bg-white border border-gray-100 rounded-2xl shadow-lg p-8">
            <h1 className="text-xl font-semibold text-slate-800 mb-4">{t('passwordChange.title', 'Change Password')}</h1>

            {error && <div className="mb-4 text-sm text-red-700 bg-red-50 p-3 rounded">{error}</div>}

            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className="text-sm text-slate-700">{t('passwordChange.old', 'Current password')}</label>
                <div className="relative">
                  <input
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    type={showOld ? 'text' : 'password'}
                    className="w-full mt-1 px-3 py-2 border rounded"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOld((s) => !s)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500"
                    aria-label={showOld ? 'Hide password' : 'Show password'}
                  >
                    {showOld ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm text-slate-700">{t('passwordChange.new', 'New password')}</label>
                <div className="relative">
                  <input
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    type={showNew ? 'text' : 'password'}
                    className="w-full mt-1 px-3 py-2 border rounded"
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
                <label className="text-sm text-slate-700">{t('passwordChange.confirm', 'Confirm new password')}</label>
                <div className="relative">
                  <input
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    type={showConfirm ? 'text' : 'password'}
                    className="w-full mt-1 px-3 py-2 border rounded"
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
                  {loading ? t('passwordChange.loading', 'Saving...') : t('passwordChange.submit', 'Save')}
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

export default PasswordChange;
