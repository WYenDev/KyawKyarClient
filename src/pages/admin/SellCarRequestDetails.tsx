import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, Pencil, User, Image as ImageIcon } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import {
  useGetApiSellCarRequestsId,
  usePutApiSellCarRequestsId,
  usePostApiSellCarRequestsIdAssign,
  useDeleteApiSellCarRequestsId,
  SellCarRequestStatus,
  SellCarRequestUpdateStatus,
  getGetApiSellCarRequestsQueryKey,
} from '../../services/api';

const STATUS_ORDER = [
  SellCarRequestStatus.PENDING,
  SellCarRequestStatus.INPROGESS,
  SellCarRequestStatus.CONTACTED,
  SellCarRequestStatus.CLOSED,
  SellCarRequestStatus.REJECTED,
];

const statusClass = (s?: string) => {
  switch (s) {
    case SellCarRequestStatus.PENDING:
      return 'bg-yellow-50 text-yellow-800 border-yellow-200';
    case SellCarRequestStatus.INPROGESS:
      return 'bg-blue-50 text-blue-800 border-blue-200';
    case SellCarRequestStatus.CONTACTED:
      return 'bg-indigo-50 text-indigo-800 border-indigo-200';
    case SellCarRequestStatus.CLOSED:
      return 'bg-green-50 text-green-800 border-green-200';
    case SellCarRequestStatus.REJECTED:
      return 'bg-red-50 text-red-800 border-red-200';
    default:
      return 'bg-gray-50 text-gray-800 border-gray-200';
  }
};

const SellCarRequestDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading, isError, refetch } = useGetApiSellCarRequestsId(id ?? '');
  const req = data ?? null;

  const queryClient = useQueryClient();
  const { mutate: assignToMe } = usePostApiSellCarRequestsIdAssign({ mutation: { onSuccess: () => { refetch(); queryClient.invalidateQueries({ queryKey: getGetApiSellCarRequestsQueryKey() }); }, onError: () => alert('Failed to assign') } });
  const { mutate: updateReq } = usePutApiSellCarRequestsId({ mutation: { onSuccess: () => { refetch(); queryClient.invalidateQueries({ queryKey: getGetApiSellCarRequestsQueryKey() }); }, onError: () => alert('Failed to update') } });
  const { mutate: deleteReq } = useDeleteApiSellCarRequestsId({ mutation: { onSuccess: () => { queryClient.invalidateQueries({ queryKey: getGetApiSellCarRequestsQueryKey() }); navigate('/admin/sell-requests'); }, onError: () => alert('Failed to delete') } });

  const [editing, setEditing] = useState<boolean>(false);
  const [statusValue, setStatusValue] = useState<string | undefined>(undefined);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [fullscreen, setFullscreen] = useState<boolean>(false);

  if (isLoading) return <div className="p-8">Loading...</div>;
  if (isError || !req) return <div className="p-8 text-red-600">Failed to load request.</div>;

  const formatNumber = (n?: number | null) => (n === null || n === undefined ? '-' : n.toLocaleString());
  const formatString = (s?: string | null) => (s === null || s === undefined || s === '' ? '-' : s);

  const openEdit = () => {
    setEditing(true);
    setStatusValue(req.status);
  };
  const closeEdit = () => { setEditing(false); setStatusValue(undefined); };
  const handleSave = () => { if (!statusValue) return; updateReq({ id: req.id, data: { status: statusValue as SellCarRequestUpdateStatus } }); closeEdit(); };
  const handleAssign = () => { if (!confirm('Assign to you?')) return; assignToMe({ id: req.id }); };
  const handleDelete = () => { if (!confirm('Delete this request?')) return; deleteReq({ id: req.id }); };

  const images = req.images ?? [];
  const mainImage = images[selectedIndex] ?? null;

  return (
    <div className="p-8 bg-[#F8F9FB] min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-start gap-4 mb-6">
          <button onClick={() => navigate(-1)} className="p-2 rounded-lg bg-white border border-slate-100 shadow-sm hover:shadow-md">
            <ArrowLeft />
          </button>

          <div className="flex-1">
            <div className="flex items-start gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">{req.make} {req.model}</h1>
                <div className="text-sm text-slate-500">{req.makeYear} • Requested by <span className="font-medium text-slate-800">{formatString(req.sellerName)}</span></div>
              </div>

              <div className="ml-auto flex items-center gap-3">
                <div className={`inline-flex items-center py-1 px-3 rounded-full border ${statusClass(req.status)} text-sm font-semibold`}>{req.status}</div>

                <button onClick={openEdit} className="inline-flex items-center gap-2 px-3 py-2 bg-white border rounded-xl hover:bg-slate-50 transition-shadow">
                  <Pencil size={16} /> <span className="hidden sm:inline">Edit Status</span>
                </button>

                {!req.assignedAdminId && (
                  <button onClick={handleAssign} className="inline-flex items-center gap-2 px-3 py-2 bg-white border rounded-xl hover:bg-slate-50 transition-shadow">
                    <User size={16} /> <span className="hidden sm:inline">Assign to me</span>
                  </button>
                )}

                <button onClick={handleDelete} className="inline-flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-shadow">
                  <Trash2 size={16} /> <span className="hidden sm:inline">Delete</span>
                </button>
              </div>
            </div>

            <div className="mt-4 text-sm text-slate-500">Status updated on <span className="font-medium text-slate-700">{new Date(req.updatedAt).toLocaleString()}</span></div>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left / Main */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
              {mainImage ? (
                <div className="relative bg-black/5">
                  <img
                    src={mainImage}
                    alt="car"
                    onClick={() => setFullscreen(true)}
                    className="w-full h-96 object-cover cursor-zoom-in"
                  />
                </div>
              ) : (
                <div className="w-full h-96 flex items-center justify-center text-slate-400">
                  <div className="text-center">
                    <ImageIcon className="mx-auto text-slate-300" />
                    <div className="mt-2">No images provided</div>
                  </div>
                </div>
              )}

              {images.length > 0 && (
                <div className="p-3 bg-white">
                  <div className="flex gap-3 overflow-x-auto">
                    {images.map((src, idx) => (
                      <button
                        key={src + idx}
                        onClick={() => setSelectedIndex(idx)}
                        className={`flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden border ${idx === selectedIndex ? 'border-indigo-500' : 'border-slate-100'} focus:outline-none`}
                      >
                        <img src={src} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Description</h3>
              <p className="text-sm text-slate-700 whitespace-pre-line">{req.details ?? '-'}</p>
            </div>

          </div>

          {/* Right / Info Card */}
          <aside className="sticky top-8 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <div className="space-y-4">
              <div>
                <div className="text-xs text-slate-400 uppercase tracking-wide">Expected Price</div>
                <div className="text-xl font-semibold text-indigo-600">{req.expectedPrice ? formatNumber(req.expectedPrice): 'unspecified'}</div>
              </div>

              <div>
                <div className="text-xs text-slate-400 uppercase tracking-wide">Mileage</div>
                <div className="text-sm text-slate-700">{formatNumber(req.mileage)} km</div>
              </div>

              <div>
                <div className="text-xs text-slate-400 uppercase tracking-wide">Color</div>
                <div className="flex items-center gap-3 mt-1">
                  <div className="w-5 h-5 rounded-full border" style={{ backgroundColor: req.color ?? 'transparent' }} />
                  <div className="text-sm text-slate-700">{formatString(req.color)}</div>
                </div>
              </div>

              <div>
                <div className="text-xs text-slate-400 uppercase tracking-wide">Assigned</div>
                <div className="text-sm text-slate-700">{req.assignedAdminName ?? '-'}</div>
              </div>

              <div>
                <div className="text-xs text-slate-400 uppercase tracking-wide">Created</div>
                <div className="text-sm text-slate-700">{new Date(req.createdAt).toLocaleString()}</div>
              </div>
              <div>
                <div className="text-xs text-slate-400 uppercase tracking-wide">Condition</div>
                <div className="text-sm text-slate-700">{req.condition}</div>
              </div>

              <div>
                <div className="text-xs text-slate-400 uppercase tracking-wide">Contact</div>
                <div className="mt-1 text-sm font-medium text-slate-800">{formatString(req.sellerName)}</div>
                <div className="text-sm text-slate-700">{formatString(req.sellerPhone)}</div>
              </div>

            </div>
          </aside>
        </div>

        {/* Fullscreen Image Modal */}
        {fullscreen && mainImage && (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
            <button onClick={() => setFullscreen(false)} className="absolute top-6 right-6 text-white p-2 rounded-full bg-black/30">Close</button>
            <img src={mainImage} alt="full" className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg shadow-lg" />
          </div>
        )}

        {/* Edit modal */}
        {editing && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl p-6 border border-slate-100">
              <h2 className="text-xl font-bold text-slate-900 mb-1">Update Status</h2>
              <p className="text-sm text-slate-500 mb-6">Change the lifecycle of this car request.</p>
              <div>
                <select value={statusValue} onChange={(e) => setStatusValue(e.target.value)} className="w-full border-slate-200 bg-slate-50 p-3 rounded-2xl text-sm">
                  {STATUS_ORDER.map((s) => (<option key={s} value={s}>{s}</option>))}
                </select>
              </div>
              <div className="flex gap-3 mt-8">
                <button onClick={closeEdit} className="flex-1 px-4 py-3 rounded-2xl border border-slate-200">Cancel</button>
                <button onClick={handleSave} className="flex-1 px-4 py-3 rounded-2xl bg-indigo-600 text-white">Save</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellCarRequestDetails;

