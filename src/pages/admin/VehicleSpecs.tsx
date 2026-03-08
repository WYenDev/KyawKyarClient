import React, { useState } from "react";
import { Plus, Pencil, Trash2, MoreVertical } from "lucide-react";

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
  useGetApiFilterMinMaxPrice,
  usePatchApiFilterMinMaxPrice,
} from "../../services/api";

// Shared helpers
type ApiError = { payload?: { error?: string } };

const PAGE_LIMIT = 13;

type TabKey = "fuel" | "transmission" | "priceFilter";

const VehicleSpecs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("fuel");

  return (
    <div className="bg-[#F8F9FB] px-4 py-6 md:p-8 h-full overflow-y-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Vehicle Specifications</h1>
        <p className="text-sm text-gray-500 mt-1">Manage fuel types, transmission types, and price filter range</p>
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
          <button
            onClick={() => setActiveTab("priceFilter")}
            className={`whitespace-nowrap py-3 px-1 border-b-2 text-sm font-medium transition-colors ${
              activeTab === "priceFilter"
                ? "border-black text-black"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Price Filter
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl shadow-sm">
        {activeTab === "fuel" ? <FuelTypesTab /> : activeTab === "transmission" ? <TransmissionTypesTab /> : <PriceFilterTab />}
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
  const [openActionId, setOpenActionId] = useState<string | null>(null);

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
      <div className="flex items-center justify-between gap-3 flex-nowrap px-6 py-4 border-b">
        <h2 className="text-lg font-semibold text-gray-900 flex-1 min-w-0 break-words leading-tight">Fuel Types Management</h2>
        <button
          onClick={openCreate}
          className="flex items-center justify-center bg-black text-white rounded-full hover:bg-gray-800 w-9 h-9 sm:w-10 sm:h-10 shrink-0"
          aria-label="Add fuel type"
        >
          <Plus size={16} />
          <span className="sr-only">Add fuel type</span>
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
                  <div className="flex justify-end">
                    <div className="relative">
                      <button
                        onClick={(e) => { e.stopPropagation(); setOpenActionId(openActionId === item.id ? null : item.id); }}
                        className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
                        title="Actions"
                        aria-expanded={openActionId === item.id}
                      >
                        <MoreVertical size={18} />
                      </button>

                      {openActionId === item.id && (
                        <div className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-lg z-50">
                          <button
                            onClick={(e) => { e.stopPropagation(); openEdit(item); setOpenActionId(null); }}
                            className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center gap-2"
                          >
                            <Pencil size={14} /> Edit
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); setDeleteTarget(item); setOpenActionId(null); }}
                            className="w-full text-left px-3 py-2 hover:bg-gray-50 text-red-600 flex items-center gap-2"
                          >
                            <Trash2 size={14} /> Delete
                          </button>
                        </div>
                      )}
                    </div>
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
  const [openActionId, setOpenActionId] = useState<string | null>(null);

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
      <div className="flex items-center justify-between gap-3 flex-nowrap px-6 py-4 border-b">
        <h2 className="text-lg font-semibold text-gray-900 flex-1 min-w-0 break-words leading-tight">Transmission Types Management</h2>
        <button
          onClick={openCreate}
          className="flex items-center justify-center bg-black text-white rounded-full hover:bg-gray-800 w-9 h-9 sm:w-10 sm:h-10 shrink-0"
          aria-label="Add transmission type"
        >
          <Plus size={16} />
          <span className="sr-only">Add transmission type</span>
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
                  <div className="flex justify-end">
                    <div className="relative">
                      <button
                        onClick={(e) => { e.stopPropagation(); setOpenActionId(openActionId === item.id ? null : item.id); }}
                        className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
                        title="Actions"
                        aria-expanded={openActionId === item.id}
                      >
                        <MoreVertical size={18} />
                      </button>

                      {openActionId === item.id && (
                        <div className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-lg z-50">
                          <button
                            onClick={(e) => { e.stopPropagation(); openEdit(item); setOpenActionId(null); }}
                            className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center gap-2"
                          >
                            <Pencil size={14} /> Edit
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); setDeleteTarget(item); setOpenActionId(null); }}
                            className="w-full text-left px-3 py-2 hover:bg-gray-50 text-red-600 flex items-center gap-2"
                          >
                            <Trash2 size={14} /> Delete
                          </button>
                        </div>
                      )}
                    </div>
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

const PriceFilterTab: React.FC = () => {
  const [minPrice, setMinPrice] = useState<number | ''>(0);
  const [maxPrice, setMaxPrice] = useState<number | ''>(5000);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const { data, isLoading, isError } = useGetApiFilterMinMaxPrice({
    query: {
      placeholderData: (previousData) => previousData,
    },
  });

  React.useEffect(() => {
    if (data) {
      if (data.minPrice !== undefined) setMinPrice(data.minPrice);
      if (data.maxPrice !== undefined) setMaxPrice(data.maxPrice);
    }
  }, [data]);

  const handleMinPriceChange = (value: string) => {
    if (value === '') {
      setMinPrice('');
    } else {
      const num = Number(value);
      if (!isNaN(num)) {
        setMinPrice(num);
      }
    }
  };

  const handleMaxPriceChange = (value: string) => {
    if (value === '') {
      setMaxPrice('');
    } else {
      const num = Number(value);
      if (!isNaN(num)) {
        setMaxPrice(num);
      }
    }
  };

  const { mutate: updatePrice, isPending: updating } = usePatchApiFilterMinMaxPrice({
    mutation: {
      onSuccess: () => {
        setSuccess("Price filter range updated successfully");
        setError(null);
        setTimeout(() => setSuccess(null), 3000);
      },
      onError: (err: unknown) => {
        setError((err as ApiError)?.payload?.error ?? "Failed to update price filter");
        setSuccess(null);
      },
    },
  });

  const handleSave = () => {
    if (minPrice === '' || maxPrice === '') {
      setError("Please fill in both price fields");
      return;
    }

    const min = minPrice;
    const max = maxPrice;

    if (min > max) {
      setError("Min price cannot be greater than max price");
      return;
    }
    if (min < 0 || max < 0) {
      setError("Prices cannot be negative");
      return;
    }
    updatePrice({ data: { minPrice: min, maxPrice: max } });
  };

  const isValid = minPrice !== '' && maxPrice !== '';

  if (isLoading) {
    return (
      <div className="p-8 text-center text-gray-400">Loading...</div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 text-center text-red-500">Failed to load price filter settings</div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-2">Price Filter Range</h2>
      <p className="text-sm text-gray-500 mb-6">
        Set the default price range for the car filter. Values are in Lakhs.
      </p>

      {error && (
        <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 text-sm text-green-700 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Min Price (Lakhs)
          </label>
          <input
            type="number"
            value={minPrice}
            onChange={(e) => handleMinPriceChange(e.target.value)}
            className="border p-3 rounded-xl w-full"
            min={0}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Max Price (Lakhs)
          </label>
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => handleMaxPriceChange(e.target.value)}
            className="border p-3 rounded-xl w-full"
            min={0}
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={updating || !isValid}
          className="bg-black text-white px-6 py-2.5 rounded-xl disabled:opacity-50 hover:bg-gray-800"
        >
          {updating ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

export default VehicleSpecs;
