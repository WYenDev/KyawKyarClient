import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
                <input value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} type="password" className="w-full mt-1 px-3 py-2 border rounded" />
              </div>

              <div>
                <label className="text-sm text-slate-700">{t('passwordChange.new', 'New password')}</label>
                <input value={newPassword} onChange={(e) => setNewPassword(e.target.value)} type="password" className="w-full mt-1 px-3 py-2 border rounded" />
              </div>

              <div>
                <label className="text-sm text-slate-700">{t('passwordChange.confirm', 'Confirm new password')}</label>
                <input value={confirm} onChange={(e) => setConfirm(e.target.value)} type="password" className="w-full mt-1 px-3 py-2 border rounded" />
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
