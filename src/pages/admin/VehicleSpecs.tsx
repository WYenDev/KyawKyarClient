import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";

import {
  FuelType,
  TransmissionType,
  useGetApiFuelTypes,
  usePostApiFuelTypes,
  usePutApiFuelTypesId,
  useDeleteApiFuelTypesId,
  useGetApiTransmissionTypes,
  usePostApiTransmissionTypes,
  usePutApiTransmissionTypesId,
  useDeleteApiTransmissionTypesId,
} from "../../services/api";

// Shared helpers
type ApiError = { payload?: { error?: string } };

const PAGE_LIMIT = 13;

type TabKey = "fuel" | "transmission";

const VehicleSpecs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("fuel");

  return (
    <div className="bg-[#F8F9FB] p-8 h-full overflow-y-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Vehicle Specifications</h1>
        <p className="text-sm text-gray-500 mt-1">Manage fuel types and transmission types</p>
      </div>

      {/* Tabs */}
      <div className="mb-4 border-b border-gray-200">
        <nav className="-mb-px flex gap-6" aria-label="Tabs">
          <button
            onClick={() => setActiveTab("fuel")}
            className={`whitespace-nowrap py-3 px-1 border-b-2 text-sm font-medium transition-colors ${
              activeTab === "fuel"
                ? "border-black text-black"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Fuel Types
          </button>
          <button
            onClick={() => setActiveTab("transmission")}
            className={`whitespace-nowrap py-3 px-1 border-b-2 text-sm font-medium transition-colors ${
              activeTab === "transmission"
                ? "border-black text-black"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Transmission Types
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl shadow-sm">
        {activeTab === "fuel" ? <FuelTypesTab /> : <TransmissionTypesTab />}
      </div>
    </div>
  );
};

const FuelTypesTab: React.FC = () => {
  // Pagination
  const [page, setPage] = useState(1);

  // Modal states
  const [openModal, setOpenModal] = useState(false);
  const [editing, setEditing] = useState<FuelType | null>(null);
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<FuelType | null>(null);

  const { data, isLoading, isError, refetch } = useGetApiFuelTypes({ page, limit: PAGE_LIMIT });
  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_LIMIT));

  const { mutate: createItem, isPending: creating } = usePostApiFuelTypes({
    mutation: {
      onSuccess: () => {
        refetch();
        setOpenModal(false);
        setEditing(null);
        setName("");
        setError(null);
        setPage(1);
      },
      onError: (err: unknown) => setError((err as ApiError)?.payload?.error ?? "Fuel type name is required"),
    },
  });

  const { mutate: updateItem, isPending: updating } = usePutApiFuelTypesId({
    mutation: {
      onSuccess: () => {
        refetch();
        setOpenModal(false);
        setEditing(null);
        setName("");
        setError(null);
      },
      onError: (err: unknown) => setError((err as ApiError)?.payload?.error ?? "Fuel type name is required"),
    },
  });

  const { mutate: deleteItem, isPending: deleting } = useDeleteApiFuelTypesId({
    mutation: {
      onSuccess: () => {
        refetch();
        setDeleteTarget(null);
      },
      onError: (err: unknown) => setError((err as ApiError)?.payload?.error ?? "Failed to delete"),
    },
  });

  const openCreate = () => {
    setEditing(null);
    setName("");
    setError(null);
    setOpenModal(true);
  };

  const openEdit = (item: FuelType) => {
    setEditing(item);
    setName(item.name);
    setError(null);
    setOpenModal(true);
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      setError("Fuel type name is required");
      return;
    }
    if (editing) {
      updateItem({ id: editing.id, data: { name } });
    } else {
      createItem({ data: { name } });
    }
  };

  return (
    <div className="overflow-x-auto">
      {/* Header actions */}
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <h2 className="text-lg font-semibold text-gray-900">Fuel Types Management</h2>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-xl text-sm hover:bg-gray-800"
        >
          <Plus size={16} /> Add Fuel Type
        </button>
      </div>

      {/* Table */}
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-600">
          <tr>
            <th className="px-8 py-4 text-left">Name</th>
            <th className="px-8 py-4 text-right w-40">Actions</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={2} className="py-12 text-center text-gray-400">Loading...</td>
            </tr>
          ) : isError ? (
            <tr>
              <td colSpan={2} className="py-12 text-center text-red-500">Failed to load</td>
            </tr>
          ) : items.length === 0 ? (
            <tr>
              <td colSpan={2} className="py-12 text-center text-gray-400">No data found</td>
            </tr>
          ) : (
            items.map((item) => (
              <tr key={item.id} className="border-t hover:bg-gray-50">
                <td className="px-8 py-4 font-medium text-gray-900">{item.name}</td>
                <td className="px-8 py-4">
                  <div className="flex justify-end gap-4">
                    <button onClick={() => openEdit(item)} className="text-indigo-600 hover:underline flex items-center gap-1">
                      <Pencil size={14} /> Edit
                    </button>
                    <button onClick={() => setDeleteTarget(item)} className="text-red-500 hover:underline flex items-center gap-1">
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-8 py-4 border-t">
          <span className="text-sm text-gray-500">Page {page} of {totalPages}</span>
          <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-3 py-1 rounded-lg border text-sm disabled:opacity-40 hover:bg-gray-100"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`px-3 py-1 rounded-lg text-sm border ${p === page ? "bg-black text-white" : "hover:bg-gray-100"}`}
              >
                {p}
              </button>
            ))}
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1 rounded-lg border text-sm disabled:opacity-40 hover:bg-gray-100"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      {openModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-4">{editing ? "Edit Fuel Type" : "Add Fuel Type"}</h2>
            {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}
            <input
              className="border p-3 rounded-xl w-full"
              placeholder="Fuel type name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
            <div className="flex justify-end gap-4 mt-6">
              <button onClick={() => { setOpenModal(false); setEditing(null); setName(""); setError(null); }} className="border px-4 py-2 rounded-xl">
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={creating || updating}
                className="bg-black text-white px-4 py-2 rounded-xl disabled:opacity-50"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-2">Delete Fuel Type</h2>
            {error ? (
              <div className="mb-6 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                {error}
              </div>
            ) : (
              <p className="text-sm text-gray-600 mb-6">Are you sure you want to delete this fuel type?</p>
            )}
            <div className="flex justify-end gap-4">
              <button onClick={() => { setDeleteTarget(null); setError(null); }} className="border px-4 py-2 rounded-xl">
                Cancel
              </button>
              <button
                onClick={() => deleteItem({ id: deleteTarget.id })}
                disabled={deleting}
                className="bg-red-600 text-white px-4 py-2 rounded-xl disabled:opacity-50"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const TransmissionTypesTab: React.FC = () => {
  // Pagination
  const [page, setPage] = useState(1);

  // Modal states
  const [openModal, setOpenModal] = useState(false);
  const [editing, setEditing] = useState<TransmissionType | null>(null);
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<TransmissionType | null>(null);

  const { data, isLoading, isError, refetch } = useGetApiTransmissionTypes({ page, limit: PAGE_LIMIT });
  const items = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_LIMIT));

  const { mutate: createItem, isPending: creating } = usePostApiTransmissionTypes({
    mutation: {
      onSuccess: () => {
        refetch();
        setOpenModal(false);
        setEditing(null);
        setName("");
        setError(null);
        setPage(1);
      },
      onError: (err: unknown) => setError((err as ApiError)?.payload?.error ?? "Transmission type name is required"),
    },
  });

  const { mutate: updateItem, isPending: updating } = usePutApiTransmissionTypesId({
    mutation: {
      onSuccess: () => {
        refetch();
        setOpenModal(false);
        setEditing(null);
        setName("");
        setError(null);
      },
      onError: (err: unknown) => setError((err as ApiError)?.payload?.error ?? "Transmission type name is required"),
    },
  });

  const { mutate: deleteItem, isPending: deleting } = useDeleteApiTransmissionTypesId({
    mutation: {
      onSuccess: () => {
        refetch();
        setDeleteTarget(null);
      },
      onError: (err: unknown) => setError((err as ApiError)?.payload?.error ?? "Failed to delete"),
    },
  });

  const openCreate = () => {
    setEditing(null);
    setName("");
    setError(null);
    setOpenModal(true);
  };

  const openEdit = (item: TransmissionType) => {
    setEditing(item);
    setName(item.name);
    setError(null);
    setOpenModal(true);
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      setError("Transmission type name is required");
      return;
    }
    if (editing) {
      updateItem({ id: editing.id, data: { name } });
    } else {
      createItem({ data: { name } });
    }
  };

  return (
    <div className="overflow-x-auto">
      {/* Header actions */}
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <h2 className="text-lg font-semibold text-gray-900">Transmission Types Management</h2>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-xl text-sm hover:bg-gray-800"
        >
          <Plus size={16} /> Add Transmission Type
        </button>
      </div>

      {/* Table */}
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-600">
          <tr>
            <th className="px-8 py-4 text-left">Name</th>
            <th className="px-8 py-4 text-right w-40">Actions</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={2} className="py-12 text-center text-gray-400">Loading...</td>
            </tr>
          ) : isError ? (
            <tr>
              <td colSpan={2} className="py-12 text-center text-red-500">Failed to load</td>
            </tr>
          ) : items.length === 0 ? (
            <tr>
              <td colSpan={2} className="py-12 text-center text-gray-400">No data found</td>
            </tr>
          ) : (
            items.map((item) => (
              <tr key={item.id} className="border-t hover:bg-gray-50">
                <td className="px-8 py-4 font-medium text-gray-900">{item.name}</td>
                <td className="px-8 py-4">
                  <div className="flex justify-end gap-4">
                    <button onClick={() => openEdit(item)} className="text-indigo-600 hover:underline flex items-center gap-1">
                      <Pencil size={14} /> Edit
                    </button>
                    <button onClick={() => setDeleteTarget(item)} className="text-red-500 hover:underline flex items-center gap-1">
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-8 py-4 border-t">
          <span className="text-sm text-gray-500">Page {page} of {totalPages}</span>
          <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-3 py-1 rounded-lg border text-sm disabled:opacity-40 hover:bg-gray-100"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`px-3 py-1 rounded-lg text-sm border ${p === page ? "bg-black text-white" : "hover:bg-gray-100"}`}
              >
                {p}
              </button>
            ))}
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1 rounded-lg border text-sm disabled:opacity-40 hover:bg-gray-100"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      {openModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-4">{editing ? "Edit Transmission Type" : "Add Transmission Type"}</h2>
            {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}
            <input
              className="border p-3 rounded-xl w-full"
              placeholder="Transmission type name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
            <div className="flex justify-end gap-4 mt-6">
              <button onClick={() => { setOpenModal(false); setEditing(null); setName(""); setError(null); }} className="border px-4 py-2 rounded-xl">
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={creating || updating}
                className="bg-black text-white px-4 py-2 rounded-xl disabled:opacity-50"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-2">Delete Transmission Type</h2>
            {error ? (
              <div className="mb-6 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                {error}
              </div>
            ) : (
              <p className="text-sm text-gray-600 mb-6">Are you sure you want to delete this transmission type?</p>
            )}
            <div className="flex justify-end gap-4">
              <button onClick={() => { setDeleteTarget(null); setError(null); }} className="border px-4 py-2 rounded-xl">
                Cancel
              </button>
              <button
                onClick={() => deleteItem({ id: deleteTarget.id })}
                disabled={deleting}
                className="bg-red-600 text-white px-4 py-2 rounded-xl disabled:opacity-50"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleSpecs;
