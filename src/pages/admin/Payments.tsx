import { useState } from "react";
import { Plus, Trash2, Pencil } from "lucide-react";

import {
  useGetApiShowroomInstallments,
  usePostApiShowroomInstallments,
  usePatchApiShowroomInstallmentsId,
  useDeleteApiShowroomInstallmentsId,
  useGetApiBankInstallments,
  usePatchApiBankInstallmentsId,
} from "../../services/api";

/* ================= TYPES ================= */
/* Use shared API model types from `src/services/types.d.ts` (ambient declarations).
   These interfaces are declared globally so the generated `api.ts` file can
   reference them; we can import them locally via TypeScript type-only imports
   if needed. */

type ShowroomForm = {
  duration: number; // in years
  initialPayment: number; // percent
  interestRate: number; // percent
  paperWorkFee: number; // percent
};

/* Simple error type */
type ApiError = { payload?: { error?: string } };

const Payments = () => {
  /* ================ STATE ================ */
  // pagination reserved (not used currently)

  const [openShowroomModal, setOpenShowroomModal] = useState(false);
  const [editingShowroom, setEditingShowroom] = useState<ShowroomInstallment | null>(null);
  const [showroomForm, setShowroomForm] = useState<ShowroomForm>({ duration: 1, initialPayment: 0, interestRate: 0, paperWorkFee: 0 });
  const [showroomError, setShowroomError] = useState<string | null>(null);

  const [openBankModal, setOpenBankModal] = useState(false);
  const [editingBank, setEditingBank] = useState<BankInstallment | null>(null);
  const [bankForm, setBankForm] = useState<{ initialPayment: number; deposit: number }>({ initialPayment: 0, deposit: 0 });
  const [bankError, setBankError] = useState<string | null>(null);

  /* ================ QUERIES ================ */
  const { data: showroomData, isLoading: showroomLoading, refetch: refetchShowrooms } = useGetApiShowroomInstallments();
  const showroomList = showroomData ?? [];

  const { data: bankData, isLoading: bankLoading, refetch: refetchBanks } = useGetApiBankInstallments();
  const bankList = bankData ?? [];
  const bankConfig = Array.isArray(bankList) && bankList.length > 0 ? bankList[0] : undefined;

  /* ================ MUTATIONS ================ */
  const { mutate: createShowroom, isPending: creatingShowroom } = usePostApiShowroomInstallments({
    mutation: {
      onSuccess: () => {
        refetchShowrooms();
        setOpenShowroomModal(false);
        setShowroomForm({ duration: 1, initialPayment: 0, interestRate: 0, paperWorkFee: 0 });
      },
      onError: (err: unknown) => {
        const e = err as ApiError;
        setShowroomError(e?.payload?.error ?? "Failed to create showroom installment");
      },
    },
  });

  const { mutate: updateShowroom, isPending: updatingShowroom } = usePatchApiShowroomInstallmentsId({
    mutation: {
      onSuccess: () => {
        refetchShowrooms();
        setOpenShowroomModal(false);
        setEditingShowroom(null);
      },
      onError: (err: unknown) => {
        const e = err as ApiError;
        setShowroomError(e?.payload?.error ?? "Failed to update showroom installment");
      },
    },
  });

  const { mutate: deleteShowroom } = useDeleteApiShowroomInstallmentsId({
    mutation: {
      onSuccess: () => {
        refetchShowrooms();
      },
    },
  });

  const { mutate: patchBank, isPending: updatingBank } = usePatchApiBankInstallmentsId({
    mutation: {
      onSuccess: () => {
        refetchBanks();
        setOpenBankModal(false);
        setEditingBank(null);
      },
      onError: (err: unknown) => {
        const e = err as ApiError;
        setBankError(e?.payload?.error ?? "Failed to update bank installment");
      },
    },
  });

  /* ================ HELPERS ================ */
  const openCreateShowroom = () => {
    setEditingShowroom(null);
    setShowroomForm({ duration: 1, initialPayment: 0, interestRate: 0, paperWorkFee: 0 });
    setShowroomError(null);
    setOpenShowroomModal(true);
  };

  const openEditShowroom = (item: ShowroomInstallment) => {
    setEditingShowroom(item);
    setShowroomForm({
      duration: Number(item.duration ?? 1),
      initialPayment: Number(item.initialPayment ?? 0),
      interestRate: Number(item.interestRate ?? 0),
      paperWorkFee: Number(item.paperWorkFee ?? 0),
    });
    setShowroomError(null);
    setOpenShowroomModal(true);
  };

  const handleSubmitShowroom = () => {
    if (!showroomForm.duration || showroomForm.duration <= 0) {
      setShowroomError("Duration must be > 0 (years)");
      return;
    }

    const payload: ShowroomInstallmentCreate | ShowroomInstallmentUpdate = {
      duration: showroomForm.duration,
      initialPayment: showroomForm.initialPayment,
      interestRate: showroomForm.interestRate,
      paperWorkFee: showroomForm.paperWorkFee,
    };

    if (editingShowroom) {
      updateShowroom({ id: editingShowroom.id, data: payload });
    } else {
      createShowroom({ data: payload as ShowroomInstallmentCreate });
    }
  };

  const confirmDeleteShowroom = (id: string) => {
    deleteShowroom({ id });
  };

  const openEditBank = (item?: BankInstallment) => {
    if (!item) return;
    setEditingBank(item);
    setBankForm({ initialPayment: Number(item.initialPayment ?? 0), deposit: Number(item.deposit ?? 0) });
    setBankError(null);
    setOpenBankModal(true);
  };

  const handleSubmitBank = () => {
    if (!editingBank) return;
    const payload: BankInstallmentUpdate = {
      initialPayment: bankForm.initialPayment,
      deposit: bankForm.deposit,
    };

    patchBank({ id: editingBank.id, data: payload });
  };

  /* ================ UI ================ */
  return (
    <div className="bg-[#F8F9FB] p-8 h-full overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Payments / Installments</h1>
      </div>

      {/* BANK SECTION */}
      <div className="mb-8 bg-white rounded-2xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Bank Installment (Single)</h2>
          <div>
            {bankConfig ? (
              <button onClick={() => openEditBank(bankConfig)} className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-xl text-sm">
                <Pencil size={14} /> Edit
              </button>
            ) : (
              <div className="text-sm text-gray-500">No bank installment configured</div>
            )}
          </div>
        </div>

        {bankLoading ? (
          <p>Loading...</p>
        ) : bankConfig ? (
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <div className="text-xs text-gray-400">Initial Payment</div>
              <div className="font-bold">{bankConfig.initialPayment}%</div>
            </div>
            <div>
              <div className="text-xs text-gray-400">Deposit</div>
              <div className="font-bold">{bankConfig.deposit}%</div>
            </div>
            <div>
              <div className="text-xs text-gray-400">Other</div>
              <div className="text-sm text-gray-500">Tax is applied on checkout</div>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-500">No bank installment available (contact backend).</p>
        )}
      </div>

      {/* SHOWROOM SECTION */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Showroom Installments</h2>
          <div>
            <button onClick={openCreateShowroom} className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-xl text-sm">
              <Plus size={14} /> Add Plan
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-6 py-3 text-left">Duration (yrs)</th>
                <th className="px-6 py-3 text-left">Initial Payment (%)</th>
                <th className="px-6 py-3 text-left">Paperwork (%)</th>
                <th className="px-6 py-3 text-left">Interest (%)</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {showroomLoading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center">Loading...</td>
                </tr>
              ) : showroomList.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center">No showroom plans</td>
                </tr>
              ) : (
                 showroomList.map((s: ShowroomInstallment) => (
                  <tr key={s.id} className="border-t">
                    <td className="px-6 py-3">{s.duration ?? 0}</td>
                    <td className="px-6 py-3">{s.initialPayment ?? 0}%</td>
                    <td className="px-6 py-3">{s.paperWorkFee ?? 0}%</td>
                    <td className="px-6 py-3">{s.interestRate ?? 0}%</td>
                    <td className="px-6 py-3 text-right">
                      <div className="flex justify-end gap-3">
                        <button onClick={() => openEditShowroom(s)} className="text-indigo-600">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => confirmDeleteShowroom(s.id)} className="text-red-600">
                          <Trash2 size={14} />
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

      {/* SHOWROOM MODAL */}
      {openShowroomModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-4">{editingShowroom ? "Edit Showroom Plan" : "Add Showroom Plan"}</h2>

            {showroomError && <div className="mb-3 text-red-600">{showroomError}</div>}

            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-500">Duration (years)</label>
                <input type="number" value={showroomForm.duration} onChange={(e) => setShowroomForm({ ...showroomForm, duration: Number(e.target.value) })} className="border p-3 rounded-xl w-full" />
              </div>

              <div>
                <label className="text-xs text-gray-500">Initial Payment (%)</label>
                <input type="number" value={showroomForm.initialPayment} onChange={(e) => setShowroomForm({ ...showroomForm, initialPayment: Number(e.target.value) })} className="border p-3 rounded-xl w-full" />
              </div>

              <div>
                <label className="text-xs text-gray-500">Paperwork Fee (%)</label>
                <input type="number" value={showroomForm.paperWorkFee} onChange={(e) => setShowroomForm({ ...showroomForm, paperWorkFee: Number(e.target.value) })} className="border p-3 rounded-xl w-full" />
              </div>

              <div>
                <label className="text-xs text-gray-500">Interest Rate (%)</label>
                <input type="number" value={showroomForm.interestRate} onChange={(e) => setShowroomForm({ ...showroomForm, interestRate: Number(e.target.value) })} className="border p-3 rounded-xl w-full" />
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button onClick={() => setOpenShowroomModal(false)} className="border px-4 py-2 rounded-xl">Cancel</button>
              <button onClick={handleSubmitShowroom} disabled={creatingShowroom || updatingShowroom} className="bg-black text-white px-4 py-2 rounded-xl">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* BANK MODAL */}
      {openBankModal && editingBank && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-4">Edit Bank Installment</h2>

            {bankError && <div className="mb-3 text-red-600">{bankError}</div>}

            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-500">Initial Payment (%)</label>
                <input type="number" value={bankForm.initialPayment} onChange={(e) => setBankForm({ ...bankForm, initialPayment: Number(e.target.value) })} className="border p-3 rounded-xl w-full" />
              </div>

              <div>
                <label className="text-xs text-gray-500">Deposit (%)</label>
                <input type="number" value={bankForm.deposit} onChange={(e) => setBankForm({ ...bankForm, deposit: Number(e.target.value) })} className="border p-3 rounded-xl w-full" />
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button onClick={() => setOpenBankModal(false)} className="border px-4 py-2 rounded-xl">Cancel</button>
              <button onClick={handleSubmitBank} disabled={updatingBank} className="bg-black text-white px-4 py-2 rounded-xl">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payments;
