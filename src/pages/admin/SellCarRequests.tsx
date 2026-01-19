import React, { useState } from 'react';
import { Pencil, Trash2, User, Search, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import {
  SellCarRequest,
  SellCarRequestStatus,
  SellCarRequestUpdateStatus,
  useGetApiSellCarRequests,
  usePutApiSellCarRequestsId,
  usePostApiSellCarRequestsIdAssign,
  useDeleteApiSellCarRequestsId,
  getGetApiSellCarRequestsQueryKey,
} from '../../services/api';

const STATUS_ORDER = [
  SellCarRequestStatus.PENDING,
  SellCarRequestStatus.INPROGESS,
  SellCarRequestStatus.CONTACTED,
  SellCarRequestStatus.CLOSED,
  SellCarRequestStatus.REJECTED,
];

const statusLabel = (s: string) => s.replace(/_/g, ' ');

const statusClass = (s: string) => {
  switch (s) {
    case SellCarRequestStatus.PENDING:
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case SellCarRequestStatus.INPROGESS:
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case SellCarRequestStatus.CONTACTED:
      return 'bg-indigo-100 text-indigo-800 border-indigo-200';
    case SellCarRequestStatus.CLOSED:
      return 'bg-green-100 text-green-800 border-green-200';
    case SellCarRequestStatus.REJECTED:
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const SellCarRequests: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(20);
  const [query, setQuery] = useState<string>('');

  const { data, isLoading, isError, refetch } = useGetApiSellCarRequests({ page, limit });
  const requests = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  const queryClient = useQueryClient();

  const { mutate: assignToMe } = usePostApiSellCarRequestsIdAssign({
    mutation: { onSuccess: () => { queryClient.invalidateQueries({ queryKey: getGetApiSellCarRequestsQueryKey() }); }, onError: () => alert('Failed to assign') },
  });

  const { mutate: updateReq } = usePutApiSellCarRequestsId({
    mutation: { onSuccess: () => { queryClient.invalidateQueries({ queryKey: getGetApiSellCarRequestsQueryKey() }); }, onError: () => alert('Failed to update request') },
  });

  const { mutate: deleteReq } = useDeleteApiSellCarRequestsId({
    mutation: { onSuccess: () => { queryClient.invalidateQueries({ queryKey: getGetApiSellCarRequestsQueryKey() }); }, onError: () => alert('Failed to delete request') },
  });

  const [editing, setEditing] = useState<SellCarRequest | null>(null);
  const [statusValue, setStatusValue] = useState<string | undefined>(undefined);
  const [deleteTarget, setDeleteTarget] = useState<SellCarRequest | null>(null);

  const openEdit = (r: SellCarRequest) => {
    setEditing(r);
    setStatusValue(r.status);
  };

  const closeEdit = () => {
    setEditing(null);
    setStatusValue(undefined);
  };

  const handleSave = () => {
    if (!editing || !statusValue) return;
    updateReq({ id: editing.id, data: { status: statusValue as SellCarRequestUpdateStatus } });
    closeEdit();
  };

  const handleAssign = (id: string) => {
    if (!confirm('Assign this request to you?')) return;
    assignToMe({ id });
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteReq({ id: deleteTarget.id });
    setDeleteTarget(null);
  };

  const filtered = requests.filter((r) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      (r.make ?? '').toLowerCase().includes(q) ||
      (r.model ?? '').toLowerCase().includes(q) ||
      (r.sellerName ?? '').toLowerCase().includes(q) ||
      (r.sellerPhone ?? '').toLowerCase().includes(q)
    );
  });

  const formatNumber = (n?: number | null) => (n === null || n === undefined ? '-' : n.toLocaleString());
  const formatString = (s?: string | null) => (s === null || s === undefined || s === '' ? '-' : s);

  return (
    <div className="bg-[#F8F9FB] min-h-screen p-8 overflow-y-auto">
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Sell Car Requests</h1>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search requests..."
                className="pl-10 pr-4 py-2 w-64 lg:w-80 rounded-xl border border-slate-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            </div>

            <button
              onClick={() => refetch()}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl shadow-sm hover:bg-slate-50 transition-colors"
            >
              <RefreshCw className="w-4 h-4 text-slate-600" />
              <span className="text-sm font-medium text-slate-700">Refresh</span>
            </button>

            <select
              value={limit}
              onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
              className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value={10}>10 / page</option>
              <option value={20}>20 / page</option>
              <option value={50}>50 / page</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 font-semibold text-slate-600">Car Details</th>
                <th className="px-6 py-4 font-semibold text-slate-600 text-center">Year</th>
                <th className="px-6 py-4 font-semibold text-slate-600 text-center">Mileage</th>
                <th className="px-6 py-4 font-semibold text-slate-600 text-center">Expected</th>
                <th className="px-6 py-4 font-semibold text-slate-600">Color</th>
                <th className="px-6 py-4 font-semibold text-slate-600">Seller</th>
                <th className="px-6 py-4 font-semibold text-slate-600">Assigned</th>
                <th className="px-6 py-4 font-semibold text-slate-600 text-center">Status</th>
                <th className="px-6 py-4 font-semibold text-slate-600 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr><td colSpan={9} className="py-12 text-center text-slate-400">Loading requests...</td></tr>
              ) : isError ? (
                <tr><td colSpan={9} className="py-12 text-center text-red-500">Error loading data.</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={9} className="py-12 text-center text-slate-400">No requests found.</td></tr>
              ) : (
                filtered.map((r) => (
                  <tr
                    key={r.id}
                    className="hover:bg-slate-50/50 transition-colors cursor-pointer"
                    onClick={() => navigate(`/admin/sell-requests/${r.id}`)}
                  >
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900">{formatString(r.make)}</div>
                      <div className="text-xs text-slate-500">{formatString(r.model)}</div>
                    </td>
                    <td className="px-6 py-4 text-center text-slate-600">{formatString(r.makeYear?.toString())}</td>
                    <td className="px-6 py-4 text-center text-slate-600 font-mono">{formatNumber(r.mileage)}</td>
                    <td className="px-6 py-4 text-center font-semibold text-indigo-600">${formatNumber(r.expectedPrice)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="w-4 h-4 rounded-full border" style={{ backgroundColor: r.color ?? 'transparent' }} />
                        <span className="text-sm text-slate-700">{formatString(r.color)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-slate-900 font-medium">{formatString(r.sellerName)}</div>
                      <div className="text-xs text-slate-500 font-mono">{formatString(r.sellerPhone)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-600">
                      {r.assignedAdminName ? (
                        <span className="inline-flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full bg-green-500" />
                          {r.assignedAdminName}
                        </span>
                      ) : '-'}
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold border ${statusClass(r.status ?? '')}`}>
                        {statusLabel(r.status ?? 'PENDING')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); openEdit(r); }}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg"
                          title="Edit Status"
                        >
                          <Pencil size={16} />
                        </button>

                        {!r.assignedAdminId && (
                          <button
                            onClick={(e) => { e.stopPropagation(); handleAssign(r.id); }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                            title="Assign to me"
                          >
                            <User size={16} />
                          </button>
                        )}

                        <button
                          onClick={(e) => { e.stopPropagation(); setDeleteTarget(r); }}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Container */}
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-slate-500 font-medium">
          Showing <span className="text-slate-900">{(page - 1) * limit + 1}</span> to <span className="text-slate-900">{Math.min(page * limit, total)}</span> of <span className="text-slate-900">{total}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page <= 1}
            className="px-4 py-2 text-sm font-medium rounded-xl border border-slate-200 bg-white disabled:opacity-50 disabled:bg-slate-50 hover:bg-slate-50 transition-colors"
          >
            Previous
          </button>
          <div className="px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl">
            {page} / {totalPages}
          </div>
          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page >= totalPages}
            className="px-4 py-2 text-sm font-medium rounded-xl border border-slate-200 bg-white disabled:opacity-50 disabled:bg-slate-50 hover:bg-slate-50 transition-colors"
          >
            Next
          </button>
        </div>
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl p-6 border border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 mb-1">Update Status</h2>
            <p className="text-sm text-slate-500 mb-6">Change the lifecycle of this car request.</p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Select Status</label>
                <select
                  value={statusValue}
                  onChange={(e) => setStatusValue(e.target.value)}
                  className="w-full border-slate-200 bg-slate-50 p-3 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                >
                  {STATUS_ORDER.map((s) => (
                    <option key={s} value={s}>{statusLabel(s)}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button onClick={closeEdit} className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
                Cancel
              </button>
              <button onClick={handleSave} className="flex-1 px-4 py-3 rounded-2xl bg-indigo-600 text-white font-semibold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-colors">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl p-8 text-center">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={32} />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Delete Request?</h2>
            <p className="text-sm text-slate-500 mb-8">
              This will permanently remove the request from <span className="font-bold text-slate-900">{deleteTarget.sellerName}</span>. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
                Keep it
              </button>
              <button onClick={handleDelete} className="flex-1 px-4 py-3 rounded-2xl bg-red-600 text-white font-semibold shadow-lg shadow-red-200 hover:bg-red-700 transition-colors">
                Delete Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellCarRequests;
