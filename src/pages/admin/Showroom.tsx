import { useState, Fragment } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2, Pencil, ChevronRight, ChevronDown, MoreVertical } from "lucide-react";

import {
    Showroom,
    ShowroomCreate,
    useGetApiShowrooms,
    usePostApiShowrooms,
    useDeleteApiShowroomsId,
} from "../../services/api";

/* ================= TYPES ================= */
type FormPhone = { id?: string; showroomId?: string; phone: string };

type ShowroomCreateForm = Omit<ShowroomCreate, "phones"> & {
    phones: FormPhone[];
};

// Simple error type
type ApiError = {
    payload?: {
        error?: string;
    };
};

/* ================= COMPONENT ================= */
const Showrooms = () => {
    const navigate = useNavigate();

    /* ================= STATE ================= */
    const [openModal, setOpenModal] = useState(false); // create-only modal
    const [deleteTarget, setDeleteTarget] = useState<Showroom | null>(null);
    const [error, setError] = useState<string | null>(null);

    // track expanded row in the list view
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [openActionId, setOpenActionId] = useState<string | null>(null);
    const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number } | null>(null);

    /* ================= PHONE (create form local only) ================= */
    const [newPhone, setNewPhone] = useState("");

    /* ================= FORM (create only) ================= */
    const [form, setForm] = useState<ShowroomCreateForm>({
        name: "",
        addressEn: "",
        addressMm: "",
        city: "",
        googleMapUrl: "",
        phones: [],
    });

    /* ===== PAGINATION ===== */
    const [page, setPage] = useState(1);
    const limit = 13;

    /* ================= QUERY ================= */
    const {
        data,
        isLoading,
        isError,
        refetch,
    } = useGetApiShowrooms({
        page,
        limit,
    });

    const showrooms = data?.items ?? [];
    const total = data?.total ?? 0;
    const totalPages = Math.ceil(total / limit);

    /* ================= MUTATIONS ================= */
    const { mutate: createShowroom, isPending: creating } = usePostApiShowrooms({
        mutation: {
            onSuccess: () => {
                refetch();
                setPage(1);
                closeModal();
            },
            onError: (err: unknown) => {
                const e = err as ApiError;
                setError(e?.payload?.error ?? "Failed to create showroom");
            },
        },
    });

    const { mutate: deleteShowroom, isPending: deleting } = useDeleteApiShowroomsId({
        mutation: {
            onSuccess: () => {
                refetch();
                setDeleteTarget(null);
                setPage(1);
            },
        },
    });

    /* ================= HELPERS ================= */
    const closeModal = () => {
        setOpenModal(false);
        setError(null);
        setNewPhone("");
        setForm({
            name: "",
            addressEn: "",
            addressMm: "",
            city: "",
            googleMapUrl: "",
            phones: [],
        });
    };

    const displayName = (item: Pick<Showroom, "name" | "city">) =>
        (item.name && item.name.trim().length > 0 ? item.name.trim() : item.city);

    /* ================= HANDLERS ================= */
    const openCreate = () => {
        closeModal();
        setOpenModal(true);
    };

    const handleSubmit = () => {
        if (!form.addressEn?.trim() || !form.city?.trim()) {
            setError("Address (EN) and City are required");
            return;
        }

        const payload: ShowroomCreate = {
            addressEn: form.addressEn,
            addressMm: form.addressMm,
            city: form.city,
            phones: form.phones.map((p) => ({ phone: p.phone })),
        };
        const trimmedName = form.name?.trim();
        if (trimmedName) payload.name = trimmedName;
        const trimmedMapUrl = form.googleMapUrl?.trim();
        if (trimmedMapUrl) payload.googleMapUrl = trimmedMapUrl;

        createShowroom({ data: payload });
    };

    const handleAddPhone = () => {
        if (!newPhone.trim()) return;
        setForm((prev) => ({
            ...prev,
            phones: [...(prev.phones ?? []), { phone: newPhone }],
        }));
        setNewPhone("");
    };

    // Navigate to dedicated edit page like car edit
    const openEdit = (item: Showroom) => {
        navigate(`/admin/showrooms/${item.id}/edit`);
    };

    const confirmDelete = () => {
        if (!deleteTarget) return;
        deleteShowroom({ id: deleteTarget.id });
    };

    /* ================= UI ================= */
    return (
        <div className="bg-[#F8F9FB] px-4 py-6 md:p-8 h-full overflow-y-auto">
            {/* HEADER */}
            <div className="flex items-center justify-between gap-3 flex-nowrap mb-6">
                <h1 className="text-2xl font-semibold leading-tight flex-1 min-w-0">Showrooms Management</h1>

                <button
                    onClick={openCreate}
                    className="flex items-center justify-center bg-black text-white rounded-full hover:bg-gray-800 transition w-10 h-10 shrink-0"
                    aria-label="Add showroom"
                >
                    <Plus size={18} />
                    <span className="sr-only">Add showroom</span>
                </button>
            </div>

            {/* LIST (Expandable rows) */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-gray-600">
                            <tr>
                                <th className="px-8 py-4 text-left">Showroom</th>
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
                                    <td colSpan={2} className="py-12 text-center text-red-500">Failed to load showrooms</td>
                                </tr>
                            ) : showrooms.length === 0 ? (
                                <tr>
                                    <td colSpan={2} className="py-12 text-center text-gray-500">No showrooms found</td>
                                </tr>
                            ) : (
                                showrooms.map((item) => {
                                    const isOpen = expandedId === item.id;
                                    const nameOrCity = displayName(item);
                                    return (
                                        <Fragment key={item.id}>
                                            <tr className="border-t">
                                                <td className="px-8 py-4 align-top">
                                                    <button
                                                        onClick={() => setExpandedId(isOpen ? null : item.id)}
                                                        className="flex items-center gap-3 text-left w-full"
                                                        aria-expanded={isOpen}
                                                    >
                                                        {isOpen ? (
                                                            <ChevronDown size={16} className="text-slate-600" />
                                                        ) : (
                                                            <ChevronRight size={16} className="text-slate-600" />
                                                        )}
                                                        {item.imageUrl ? (
                                                            <img src={item.imageUrl} alt="" className="w-12 h-12 rounded-lg object-cover shrink-0 border border-slate-200" />
                                                        ) : (
                                                            <div className="w-12 h-12 rounded-lg bg-slate-100 shrink-0 border border-slate-200 flex items-center justify-center text-slate-400 text-xs">—</div>
                                                        )}
                                                        <span className="font-medium text-slate-800 truncate">{nameOrCity}</span>
                                                    </button>
                                                </td>
                                                <td className="px-8 py-4 align-top">
                                                    <div className="flex justify-end">
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                if (openActionId === item.id) {
                                                                    setOpenActionId(null);
                                                                    setDropdownPosition(null);
                                                                } else {
                                                                    const rect = e.currentTarget.getBoundingClientRect();
                                                                    setDropdownPosition({ top: rect.bottom + 4, left: rect.right - 160 });
                                                                    setOpenActionId(item.id);
                                                                }
                                                            }}
                                                            className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
                                                            title="Actions"
                                                            aria-expanded={openActionId === item.id}
                                                        >
                                                            <MoreVertical size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                            {isOpen && (
                                                <tr className="border-t">
                                                    <td colSpan={2} className="px-8 py-4 bg-gray-50">
                                                        <div className="bg-white rounded-xl border p-4 space-y-3">
                                                            <div className="flex items-start gap-4">
                                                                <div className="w-32 text-slate-500">Name</div>
                                                                <div className="flex-1 text-slate-800">{item.name?.trim() || "—"}</div>
                                                            </div>
                                                            <div className="flex items-start gap-4">
                                                                <div className="w-32 text-slate-500">Address (EN)</div>
                                                                <div className="flex-1 text-slate-800">{item.addressEn}</div>
                                                            </div>
                                                            <div className="flex items-start gap-4">
                                                                <div className="w-32 text-slate-500">Address (MM)</div>
                                                                <div className="flex-1 text-slate-800">{item.addressMm}</div>
                                                            </div>
                                                            <div className="flex items-start gap-4">
                                                                <div className="w-32 text-slate-500">City</div>
                                                                <div className="flex-1"><span className="inline-flex items-center px-2 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-medium">{item.city}</span></div>
                                                            </div>
                                                            <div className="flex items-start gap-4">
                                                                <div className="w-32 text-slate-500">Phones</div>
                                                                <div className="flex-1 flex flex-wrap gap-2">
                                                                    {item.phones?.length ? (
                                                                        item.phones.map((p) => (
                                                                            <span key={p.id} className="truncate text-gray-700 px-2 py-1 rounded-lg bg-gray-50 border border-gray-100 text-xs">{p.phone}</span>
                                                                        ))
                                                                    ) : (
                                                                        <span className="text-gray-400">—</span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="flex items-start gap-4">
                                                                <div className="w-32 text-slate-500">Map</div>
                                                                <div className="flex-1">
                                                                    {item.googleMapUrl ? (
                                                                        <a
                                                                            href={item.googleMapUrl}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="text-indigo-600 hover:text-indigo-700 underline text-sm"
                                                                        >
                                                                            View Map
                                                                        </a>
                                                                    ) : (
                                                                        <span className="text-gray-400">—</span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="flex items-start gap-4">
                                                                <div className="w-32 text-slate-500">Image</div>
                                                                <div className="flex-1">
                                                                    {item.imageUrl ? (
                                                                        <img src={item.imageUrl} alt="" className="w-36 h-28 rounded-lg object-cover border border-slate-200" />
                                                                    ) : (
                                                                        <span className="text-gray-400">No image. Add one in Edit.</span>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            <div className="pt-2 flex justify-end">
                                                                <button
                                                                    type="button"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        if (openActionId === item.id) {
                                                                            setOpenActionId(null);
                                                                            setDropdownPosition(null);
                                                                        } else {
                                                                            const rect = e.currentTarget.getBoundingClientRect();
                                                                            setDropdownPosition({ top: rect.bottom + 4, left: rect.right - 160 });
                                                                            setOpenActionId(item.id);
                                                                        }
                                                                    }}
                                                                    className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
                                                                    title="Actions"
                                                                    aria-expanded={openActionId === item.id}
                                                                >
                                                                    <MoreVertical size={18} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </Fragment>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* PAGINATION */}
                {total > 0 && (
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-8 py-4 border-t">
                        <div className="text-sm text-slate-600 text-center sm:text-left">
                            Showing {(page - 1) * limit + 1} - {Math.min(page * limit, total)} of {total}
                        </div>
                        <div className="flex items-center justify-center gap-3">
                            <button
                                onClick={() => setPage(Math.max(1, page - 1))}
                                disabled={page <= 1}
                                className={`px-3 py-1 rounded-md border ${page <= 1 ? 'bg-slate-100 text-slate-400 border-slate-200' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'}`}
                            >
                                Prev
                            </button>
                            <div className="text-sm text-slate-700">Page {page} of {totalPages}</div>
                            <button
                                onClick={() => setPage(Math.min(totalPages, page + 1))}
                                disabled={page >= totalPages}
                                className={`px-3 py-1 rounded-md border ${page >= totalPages ? 'bg-slate-100 text-slate-400 border-slate-200' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'}`}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Floating dropdown portal – does not affect table row height */}
            {openActionId && dropdownPosition && (() => {
                const openItem = showrooms.find((s) => s.id === openActionId);
                if (!openItem) return null;
                const close = () => { setOpenActionId(null); setDropdownPosition(null); };
                return createPortal(
                    <>
                        <div
                            className="fixed inset-0 z-[99]"
                            aria-hidden
                            onClick={close}
                        />
                        <div
                            className="fixed w-40 bg-white border rounded-md shadow-lg z-[100] py-1"
                            style={{ top: dropdownPosition.top, left: dropdownPosition.left }}
                        >
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); openEdit(openItem); close(); }}
                                className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center gap-2"
                            >
                                <Pencil size={14} /> Edit
                            </button>
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); setDeleteTarget(openItem); close(); }}
                                disabled={deleting}
                                className="w-full text-left px-3 py-2 hover:bg-gray-50 text-red-600 flex items-center gap-2 disabled:opacity-50"
                            >
                                <Trash2 size={14} /> Delete
                            </button>
                        </div>
                    </>,
                    document.body
                );
            })()}

            {/* CREATE MODAL */}
            {openModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
                    <div className="bg-white w-full max-w-md rounded-2xl p-6">
                        <h2 className="text-xl font-semibold mb-4">Add Showroom</h2>

                        {error && (
                            <div className="mb-4 text-red-600">{error}</div>
                        )}

                        <div className="space-y-3">
                            <input
                                className="border p-3 rounded-xl w-full"
                                placeholder="Name (optional)"
                                value={form.name ?? ""}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        name: e.target.value,
                                    })
                                }
                            />
                            <input
                                className="border p-3 rounded-xl w-full"
                                placeholder="Address (English)"
                                value={form.addressEn}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        addressEn: e.target.value,
                                    })
                                }
                            />
                            <input
                                className="border p-3 rounded-xl w-full"
                                placeholder="လိပ်စာ (မြန်မာ)"
                                value={form.addressMm}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        addressMm: e.target.value,
                                    })
                                }
                            />
                            <input
                                className="border p-3 rounded-xl w-full"
                                placeholder="City"
                                value={form.city}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        city: e.target.value,
                                    })
                                }
                            />
                            <input
                                className="border p-3 rounded-xl w-full"
                                placeholder="Paste Google Maps share link"
                                value={form.googleMapUrl ?? ""}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        googleMapUrl: e.target.value,
                                    })
                                }
                            />

                            {/* PHONE INPUT (local list for create) */}
                            <div className="grid grid-cols-[1fr_auto] gap-2">
                                <input
                                    className="border p-3 rounded-xl w-full"
                                    placeholder="Phone number"
                                    value={newPhone}
                                    onChange={(e) => setNewPhone(e.target.value)}
                                />
                                <button
                                    onClick={handleAddPhone}
                                    disabled={!newPhone.trim()}
                                    className="bg-black text-white px-4 rounded-xl disabled:opacity-50"
                                >
                                    Add
                                </button>
                            </div>

                            {/* CREATE MODE PHONE LIST */}
                            {form.phones && form.phones.length > 0 && (
                                <div className="space-y-2">
                                    {form.phones.map((p, i) => (
                                        <div
                                            key={i}
                                            className="flex justify-between items-center border rounded-xl px-3 py-2"
                                        >
                                            <span>{p.phone}</span>
                                            <button
                                                className="text-red-500 text-sm"
                                                onClick={() =>
                                                    setForm((f) => ({
                                                        ...f,
                                                        phones: f.phones.filter((_, idx) => idx !== i),
                                                    }))
                                                }
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end gap-4 mt-6">
                            <button
                                onClick={closeModal}
                                className="border px-4 py-2 rounded-xl"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={creating}
                                className="bg-black text-white px-4 py-2 rounded-xl disabled:opacity-50"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* DELETE SHOWROOM */}
            {deleteTarget && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
                    <div className="bg-white p-6 rounded-2xl w-full max-w-md">
                        <h3 className="font-semibold mb-2">Delete Showroom</h3>
                        <p className="mb-4 text-sm text-slate-700">
                            {(() => {
                                const nameOrCity = displayName(deleteTarget);
                                return `Are you sure you want to delete "${nameOrCity}"?`;
                            })()}
                        </p>
                        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-4">
                            <button
                                onClick={() => setDeleteTarget(null)}
                                className="border px-4 py-2 rounded-xl"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
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

export default Showrooms;
