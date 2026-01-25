import { useState } from "react";
import { Plus, Trash2, Pencil } from "lucide-react";

import {
    Showroom,
    ShowroomCreate,
    ShowroomUpdate,
    ShowroomPhone,
    useGetApiShowrooms,
    usePostApiShowrooms,
    usePutApiShowroomsId,
    useDeleteApiShowroomsId,
    usePostApiShowroomsShowroomIdPhones,
    usePutApiShowroomsShowroomIdPhonesPhoneId,
    useDeleteApiShowroomsShowroomIdPhonesPhoneId,
} from "../../services/api";

/* ================= TYPES ================= */
type FormPhone = { phone: string };

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
    /* ================= STATE ================= */
    const [openModal, setOpenModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState<Showroom | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Showroom | null>(null);

    const [deletePhoneTarget, setDeletePhoneTarget] =
        useState<ShowroomPhone | null>(null);

    const [editingPhone, setEditingPhone] =
        useState<ShowroomPhone | null>(null);

    const [editPhoneValue, setEditPhoneValue] = useState("");

    const [error, setError] = useState<string | null>(null);
    const [phoneError, setPhoneError] = useState<string | null>(null);


    /* ================= PHONE ================= */
    const [newPhone, setNewPhone] = useState("");

    /* ================= FORM ================= */
    const [form, setForm] = useState<ShowroomCreateForm>({
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
    const { mutate: createShowroom, isPending: creating } =
        usePostApiShowrooms({
            mutation: {
                onSuccess: () => {
                    refetch();
                    setPage(1);
                    closeModal();
                },
                onError: (err: unknown) => {
                    const error = err as ApiError;
                    setError(error?.payload?.error ?? "Failed to create showroom");
                },
            },
        });

    const { mutate: updateShowroom, isPending: updating } =
        usePutApiShowroomsId({
            mutation: {
                onSuccess: () => {
                    refetch();
                    closeModal();
                },
                onError: (err: unknown) => {
                    const error = err as ApiError;
                    setError(error?.payload?.error ?? "Failed to update showroom");
                },
            },
        });

    const { mutate: deleteShowroom, isPending: deleting } =
        useDeleteApiShowroomsId({
            mutation: {
                onSuccess: () => {
                    refetch();
                    setDeleteTarget(null);
                    setPage(1);
                },
            },
        });

    /* ================= PHONE MUTATIONS ================= */
    const { mutate: addPhone, isPending: addingPhone } =
        usePostApiShowroomsShowroomIdPhones({
            mutation: {
                onSuccess: () => {
                    refetch();
                    setNewPhone("");
                    setPhoneError(null);
                },
                onError: (err: unknown) => {
                    const error = err as ApiError;
                    setPhoneError(
                        error?.payload?.error ?? "Failed to add phone number"
                    );
                },
            },
        });

    const { mutate: updatePhone, isPending: updatingPhone } =
        usePutApiShowroomsShowroomIdPhonesPhoneId({
            mutation: {
                onSuccess: () => {
                    refetch();
                    setEditingPhone(null);
                    setEditPhoneValue("");
                    setPhoneError(null);
                },
                onError: (err: unknown) => {
                    const error = err as ApiError;
                    setPhoneError(
                        error?.payload?.error ?? "Failed to update phone number"
                    );
                },
            },
        });


    const { mutate: deletePhone } =
        useDeleteApiShowroomsShowroomIdPhonesPhoneId({
            mutation: {
                onSuccess: () => {
                    refetch();
                    setDeletePhoneTarget(null);
                    setPhoneError(null);
                },
                onError: (err: unknown) => {
                    const error = err as ApiError;
                    setPhoneError(
                        error?.payload?.error ?? "Failed to delete phone number"
                    );
                },
            },
        });


    /* ================= HELPERS ================= */
    const closeModal = () => {
        setOpenModal(false);
        setSelectedItem(null);
        setError(null);
        setPhoneError(null);
        setNewPhone("");
        setForm({
            addressEn: "",
            addressMm: "",
            city: "",
            googleMapUrl: "",
            phones: [],
        });
    };

    /* ================= HANDLERS ================= */
    const openCreate = () => {
        closeModal();
        setOpenModal(true);
    };

    const openEdit = (item: Showroom) => {
        setSelectedItem(item);
        setForm({
            addressEn: item.addressEn,
            addressMm: item.addressMm,
            city: item.city,
            googleMapUrl: item.googleMapUrl ?? "",
            phones: item.phones?.map((p) => ({ phone: p.phone })) ?? [],
        });
        setOpenModal(true);
    };

    const handleSubmit = () => {
        if (!form.addressEn.trim() || !form.city.trim()) {
            setError("Address (EN) and City are required");
            return;
        }

        if (selectedItem) {
            const payload: ShowroomUpdate = {
                addressEn: form.addressEn,
                addressMm: form.addressMm,
                city: form.city,
                googleMapUrl: form.googleMapUrl,
            };

            updateShowroom({
                id: selectedItem.id,
                data: payload,
            });
        } else {
            createShowroom({
                data: {
                    addressEn: form.addressEn,
                    addressMm: form.addressMm,
                    city: form.city,
                    googleMapUrl: form.googleMapUrl,
                    phones: form.phones.map((p) => ({ phone: p.phone })),
                },
            });
        }
    };

    const handleAddPhone = () => {
        if (!newPhone.trim()) return;

        // CREATE MODE
        if (!selectedItem) {
            setForm({
                ...form,
                phones: [...(form.phones ?? []), { phone: newPhone }],
            });
            setNewPhone("");
            return;
        }

        // EDIT MODE
        addPhone({
            showroomId: selectedItem.id,
            data: { phone: newPhone } as unknown as ShowroomPhone,
        });
    };

    const openEditPhone = (phone: ShowroomPhone) => {
        setEditingPhone(phone);
        setEditPhoneValue(phone.phone);
    };

    const handleUpdatePhone = () => {
        if (!editingPhone) return;

        updatePhone({
            showroomId: editingPhone.showroomId,
            phoneId: editingPhone.id,
            data: { phone: editPhoneValue },
        });
        setEditingPhone(null);
    };


    const confirmDelete = () => {
        if (!deleteTarget) return;
        deleteShowroom({ id: deleteTarget.id });
    };

    const confirmDeletePhone = () => {
        if (!deletePhoneTarget) return;

        deletePhone({
            showroomId: deletePhoneTarget.showroomId,
            phoneId: deletePhoneTarget.id,
        });
        setDeletePhoneTarget(null);
    };


    /* ================= UI ================= */
    return (
        <div className="bg-[#F8F9FB] p-8 h-full overflow-y-auto">
            {/* HEADER */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold">
                    Showrooms Management
                </h1>

                <button
                    onClick={openCreate}
                    className="flex items-center gap-2 bg-black text-white px-5 py-2 rounded-xl text-sm"
                >
                    <Plus size={16} />
                    Add Showroom
                </button>
            </div>

            {/* TABLE */}
            <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-600">
                        <tr>
                            <th className="px-8 py-4 text-left">Address (EN)</th>
                            <th className="px-8 py-4 text-left">Address (MM)</th>
                            <th className="px-8 py-4 text-left">City</th>
                            <th className="px-8 py-4 text-left min-w-[200px]">Phones</th>
                            <th className="px-8 py-4 text-left">Map</th>
                            <th className="px-8 py-4 text-right w-40">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan={6} className="py-12 text-center">
                                    Loading...
                                </td>
                            </tr>
                        ) : isError ? (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="py-12 text-center text-red-500"
                                >
                                    Failed to load showrooms
                                </td>
                            </tr>
                        ) : showrooms.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="py-12 text-center">
                                    No showrooms found
                                </td>
                            </tr>
                        ) : (
                            showrooms.map((item) => (
                                <tr key={item.id} className="border-t">
                                    <td className="px-8 py-4 font-medium">
                                        {item.addressEn}
                                    </td>
                                    <td className="px-8 py-4">
                                        {item.addressMm}
                                    </td>
                                    <td className="px-8 py-4">{item.city}</td>

                                    <td className="px-8 py-4 space-y-1">
                                        {item.phones?.map((p) => (
                                            <div
                                                key={p.id}
                                                className="flex justify-between items-center"
                                            >
                                                <span>{p.phone}</span>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() =>
                                                            openEditPhone(p)
                                                        }
                                                        className="text-indigo-600"
                                                    >
                                                        <Pencil size={12} />
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            setDeletePhoneTarget(
                                                                p
                                                            )
                                                        }
                                                        className="text-red-500"
                                                    >
                                                        <Trash2 size={12} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </td>

                                    <td className="px-8 py-4">
                                        {item.googleMapUrl ? (
                                            <a
                                                href={item.googleMapUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 underline text-sm"
                                            >
                                                View Map
                                            </a>
                                        ) : (
                                            <span className="text-gray-400">
                                                —
                                            </span>
                                        )}
                                    </td>

                                    <td className="px-8 py-4">
                                        <div className="flex justify-end gap-4">
                                            <button
                                                onClick={() => openEdit(item)}
                                                className="text-indigo-600"
                                            >
                                                <Pencil size={14} />
                                            </button>
                                            <button
                                                onClick={() =>
                                                    setDeleteTarget(item)
                                                }
                                                className="text-red-500"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                {/* PAGINATION */}
                {totalPages > 1 && (
                    <div className="flex justify-between px-8 py-4 border-t">
                        <span>
                            Page {page} of {totalPages}
                        </span>
                        <div className="flex gap-2">
                            <button
                                disabled={page === 1}
                                onClick={() => setPage((p) => p - 1)}
                                className="border px-3 py-1 rounded"
                            >
                                Previous
                            </button>
                            <button
                                disabled={page === totalPages}
                                onClick={() => setPage((p) => p + 1)}
                                className="border px-3 py-1 rounded"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* CREATE / EDIT MODAL */}
            {openModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white w-full max-w-md rounded-2xl p-6">
                        <h2 className="text-xl font-semibold mb-4">
                            {selectedItem
                                ? "Edit Showroom"
                                : "Add Showroom"}
                        </h2>

                        {error && (
                            <div className="mb-4 text-red-600">{error}</div>
                        )}

                        <div className="space-y-3">
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

                            {/* PHONE INPUT */}
                            <div className="flex gap-2">
                                <input
                                    className="border p-3 rounded-xl w-full"
                                    placeholder="Phone number"
                                    value={newPhone}
                                    onChange={(e) =>
                                        setNewPhone(e.target.value)
                                    }
                                />
                                <button
                                    onClick={handleAddPhone}
                                    disabled={addingPhone}
                                    className="bg-black text-white px-4 rounded-xl"
                                >
                                    Add
                                </button>
                            </div>
                            {phoneError && (
                                <p className="text-red-600 text-sm mt-1">
                                    {phoneError}
                                </p>
                            )}


                            {/* CREATE MODE PHONE LIST */}
                            {!selectedItem &&
                                form.phones &&
                                form.phones.length > 0 && (
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
                                                        setForm({
                                                            ...form,
                                                            phones:
                                                                form.phones?.filter(
                                                                    (
                                                                        _,
                                                                        idx
                                                                    ) =>
                                                                        idx !==
                                                                        i
                                                                ),
                                                        })
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
                                disabled={creating || updating}
                                className="bg-black text-white px-4 py-2 rounded-xl"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* EDIT PHONE MODAL */}
            {editingPhone && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
                        <h2 className="text-lg font-semibold mb-4">
                            Edit Phone
                        </h2>

                        <input
                            className="border p-3 rounded-xl w-full mb-4"
                            value={editPhoneValue}
                            onChange={(e) =>
                                setEditPhoneValue(e.target.value)
                            }
                        />

                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => setEditingPhone(null)}
                                className="border px-4 py-2 rounded-xl"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdatePhone}
                                disabled={updatingPhone}
                                className="bg-black text-white px-4 py-2 rounded-xl"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* DELETE SHOWROOM */}
            {deleteTarget && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-2xl">
                        <p className="mb-4">{deleteTarget.addressEn}</p>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => setDeleteTarget(null)}
                                className="border px-4 py-2 rounded-xl"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                disabled={deleting}
                                className="bg-red-600 text-white px-4 py-2 rounded-xl"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* DELETE PHONE */}
            {deletePhoneTarget && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-2xl">
                        <p className="mb-4">
                            Delete phone {deletePhoneTarget.phone}?
                        </p>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => {
                                    setDeletePhoneTarget(null);
                                    setPhoneError(null);
                                }}

                                className="border px-4 py-2 rounded-xl"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDeletePhone}
                                className="bg-red-600 text-white px-4 py-2 rounded-xl"
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
