import React, { useState } from 'react';
import { useGetApiAdmin, usePostApiAdmin, useDeleteApiAdminId, usePostApiAdminResetPassword } from '../../services/api';
import type { GetApiAdmin200Item } from '../../services/api';

const UserManagement: React.FC = () => {
  const {
    data: admins,
    isLoading,
    isError,
    refetch,
  } = useGetApiAdmin();

  const postAdminMutation = usePostApiAdmin();
  const [deleteTarget, setDeleteTarget] = useState<GetApiAdmin200Item | null>(null);

  const { mutate: deleteAdmin, isPending: deleting } = useDeleteApiAdminId({
    mutation: {
      onSuccess: () => {
        refetch();
        setDeleteTarget(null);
      },
      onError: () => alert('Failed to delete admin'),
    },
  });

  // Reset password mutation and state
  const { mutate: resetPasswordMutate, isPending: resetting } = usePostApiAdminResetPassword({
    mutation: {
      onSuccess: () => {
        refetch();
        setResetTarget(null);
        setResetPassword('');
        setShowResetModal(false);
      },
      onError: () => alert('Failed to reset password'),
    },
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const [showResetModal, setShowResetModal] = useState(false);
  const [resetTarget, setResetTarget] = useState<GetApiAdmin200Item | null>(null);
  const [resetPassword, setResetPassword] = useState('');

  const handleDelete = (admin?: GetApiAdmin200Item) => {
    if (!admin) return;
    setDeleteTarget(admin);
  };

  const confirmDelete = () => {
    if (!deleteTarget?.id) return;
    deleteAdmin({ id: deleteTarget.id });
  };

  const adminList: GetApiAdmin200Item[] = Array.isArray(admins) ? (admins as GetApiAdmin200Item[]) : [];

  const openModal = () => {
    setFormError(null);
    setUsername('');
    setPassword('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleCreate = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setFormError(null);
    if (!username.trim() || !password) {
      setFormError('Username and password are required');
      return;
    }
    setIsCreating(true);
    try {
      await postAdminMutation.mutateAsync({ data: { username: username.trim(), password } });
      await refetch();
      closeModal();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create admin';
      setFormError(msg);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="bg-[#F8F9FB] p-8 h-full overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">User Management</h1>

        {adminList.length < 5 ? (
          <button
            onClick={openModal}
            className="bg-black text-white px-5 py-2 rounded-xl text-sm"
          >
            Add Admin
          </button>
        ) : (
          <button
            type="button"
            className="bg-gray-300 text-gray-700 px-5 py-2 rounded-xl text-sm cursor-not-allowed"
            disabled
            title="Maximum admins reached"
          >
            Add Admin
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-6 py-4 text-left">Username</th>
              <th className="px-6 py-4 text-left">Role</th>
              <th className="px-6 py-4 text-left">Created At</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={4} className="py-10 text-center text-gray-400">
                  Loading admins...
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan={4} className="py-10 text-center text-red-500">
                  Failed to load admins
                </td>
              </tr>
            ) : adminList.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-10 text-center text-gray-400">
                  No admins found
                </td>
              </tr>
            ) : (
              adminList.map((a) => (
                <tr key={a.id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4">{a.username}</td>
                  <td className="px-6 py-4">{a.role ?? '-'}</td>
                  <td className="px-6 py-4">{a.createdAt ? new Date(a.createdAt).toLocaleString() : '-'}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-4">
                      <button
                        onClick={() => { setResetTarget(a); setShowResetModal(true); }}
                        className="text-indigo-600"
                      >
                        Reset Password
                      </button>
                      <button
                        onClick={() => handleDelete(a)}
                        className="text-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-4">Add Admin</h2>

            <form onSubmit={handleCreate}>
              {formError && <div className="mb-4 text-red-600 text-sm">{formError}</div>}

              <label className="block mb-3">
                <span className="text-sm font-medium">Username</span>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="border p-3 rounded-xl w-full mt-1"
                />
              </label>

              <label className="block mb-4">
                <span className="text-sm font-medium">Password</span>
                <input
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border p-3 rounded-xl w-full mt-1"
                />
              </label>

              <div className="flex justify-end gap-4 mt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={isCreating}
                  className="border px-4 py-2 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="bg-black text-white px-4 py-2 rounded-xl disabled:opacity-50"
                >
                  {isCreating ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RESET PASSWORD MODAL */}
      {showResetModal && resetTarget && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-4">Reset Password for {resetTarget.username}</h2>

            <div className="mb-3">
              <label className="block text-sm font-medium mb-1">New Password</label>
              <input
                type="text"
                value={resetPassword}
                onChange={(e) => setResetPassword(e.target.value)}
                className="border p-3 rounded-xl w-full mt-1"
              />
            </div>

            <div className="flex justify-end gap-4 mt-4">
              <button
                type="button"
                onClick={() => { setShowResetModal(false); setResetPassword(''); setResetTarget(null); }}
                className="border px-4 py-2 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!resetPassword.trim() || !resetTarget?.username) return alert('Password required');
                  resetPasswordMutate({ data: { username: resetTarget.username, newPassword: resetPassword } });
                }}
                disabled={resetting}
                className="bg-black text-white px-4 py-2 rounded-xl disabled:opacity-50"
              >
                {resetting ? 'Resetting...' : 'Reset Password'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM */}
      {deleteTarget && (
        <ConfirmDelete
          name={deleteTarget.username ?? 'admin'}
          loading={deleting}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
};

interface ConfirmDeleteProps {
  name: string;
  loading?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const ConfirmDelete = ({ name, loading, onCancel, onConfirm }: ConfirmDeleteProps) => (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white w-full max-w-md rounded-2xl p-6">
      <h2 className="text-lg font-semibold mb-2">Delete Admin</h2>
      <p className="text-sm text-gray-600 mb-6">
        Are you sure you want to delete
        <br />
        <span className="font-medium text-gray-900">{name}</span>?
      </p>
      <div className="flex justify-end gap-4">
        <button onClick={onCancel} className="border px-4 py-2 rounded-xl">
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className="bg-red-600 text-white px-4 py-2 rounded-xl disabled:opacity-50"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
);

export default UserManagement;
