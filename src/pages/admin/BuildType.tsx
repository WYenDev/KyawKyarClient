import { useState } from "react";
import { Plus, Trash2, Pencil } from "lucide-react";

import {
    BuildType,
    useGetApiBuildTypes,
    usePostApiBuildTypes,
    usePatchApiBuildTypesId,
    useDeleteApiBuildTypesId,
} from "../../services/api";

/* ================= COMPONENT ================= */
const BuildTypes = () => {
    /* ================= STATE ================= */
    const [openModal, setOpenModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState<BuildType | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<BuildType | null>(null);
    const [name, setName] = useState("");
    const [error, setError] = useState<string | null>(null);

    /* ===== CLIENT SIDE PAGINATION ===== */
    const [page, setPage] = useState(1);
    const limit = 13;

    /* ================= QUERY ================= */
    const {
        data: buildTypes = [],
        isLoading,
        isError,
        refetch,
    } = useGetApiBuildTypes();

    /* ===== PAGINATION LOGIC ===== */
    const total = buildTypes.length;
    const totalPages = Math.ceil(total / limit);

    const paginatedBuildTypes = buildTypes.slice(
        (page - 1) * limit,
        page * limit
    );

    /* ================= MUTATIONS ================= */
    const { mutate: createBuildType, isPending: creating } =
        usePostApiBuildTypes({
            mutation: {
                onSuccess: () => {
                    refetch();
                    setPage(1);
                    closeModal();
                },
                onError: (err: unknown) => {
                    const msg =
                        (err as any)?.payload?.error ??
                        "Failed to create build type";
                    setError(msg);
                },
            },
        });

    const { mutate: updateBuildType, isPending: updating } =
        usePatchApiBuildTypesId({
            mutation: {
                onSuccess: () => {
                    refetch();
                    closeModal();
                },
                onError: (err: unknown) => {
                    const msg =
                        (err as any)?.payload?.error ??
                        "Failed to update build type";
                    setError(msg);
                },
            },
        });

    const { mutate: deleteBuildType, isPending: deleting } =
        useDeleteApiBuildTypesId({
            mutation: {
                onSuccess: () => {
                    refetch();
                    setDeleteTarget(null);
                    setPage(1);
                },
                onError: () => {
                    alert("Failed to delete build type");
                },
            },
        });

    /* ================= HELPERS ================= */
    const closeModal = () => {
        setOpenModal(false);
        setSelectedItem(null);
        setName("");
        setError(null);
    };

    /* ================= HANDLERS ================= */
    const openCreate = () => {
        setSelectedItem(null);
        setName("");
        setError(null);
        setOpenModal(true);
    };

    const openEdit = (item: BuildType) => {
        setSelectedItem(item);
        setName(item.name);
        setError(null);
        setOpenModal(true);
    };

    const handleSubmit = () => {
        if (!name.trim()) {
            setError("Build type name is required");
            return;
        }

        if (selectedItem) {
            updateBuildType({
                id: selectedItem.id,
                data: { name },
            });
        } else {
            createBuildType({
                data: { name },
            });
        }
    };

    const confirmDelete = () => {
        if (!deleteTarget) return;
        deleteBuildType({ id: deleteTarget.id });
    };

    /* ================= UI ================= */
    return (
        <div className="bg-[#F8F9FB] p-8 h-full overflow-y-auto">
            {/* HEADER */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">
                    Build Types Management
                </h1>

                <button
                    onClick={openCreate}
                    className="flex items-center gap-2 bg-black text-white px-5 py-2 rounded-xl text-sm hover:bg-gray-800"
                >
                    <Plus size={16} />
                    Add Build Type
                </button>
            </div>

            {/* TABLE */}
            <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-600">
                        <tr>
                            <th className="px-8 py-4 text-left">
                                Build Type Name
                            </th>
                            <th className="px-8 py-4 text-right w-40">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td
                                    colSpan={2}
                                    className="py-12 text-center text-gray-400"
                                >
                                    Loading...
                                </td>
                            </tr>
                        ) : isError ? (
                            <tr>
                                <td
                                    colSpan={2}
                                    className="py-12 text-center text-red-500"
                                >
                                    Failed to load build types
                                </td>
                            </tr>
                        ) : paginatedBuildTypes.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={2}
                                    className="py-12 text-center text-gray-400"
                                >
                                    No build types found
                                </td>
                            </tr>
                        ) : (
                            paginatedBuildTypes.map((item) => (
                                <tr
                                    key={item.id}
                                    className="border-t hover:bg-gray-50"
                                >
                                    <td className="px-8 py-4 font-medium text-gray-900">
                                        {item.name}
                                    </td>

                                    <td className="px-8 py-4">
                                        <div className="flex justify-end gap-4">
                                            <button
                                                onClick={() =>
                                                    openEdit(item)
                                                }
                                                className="text-indigo-600 hover:underline flex items-center gap-1"
                                            >
                                                <Pencil size={14} />
                                                Edit
                                            </button>

                                            <button
                                                onClick={() =>
                                                    setDeleteTarget(item)
                                                }
                                                className="text-red-500 hover:underline flex items-center gap-1"
                                            >
                                                <Trash2 size={14} />
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                {/* PAGINATION (SAME UI AS BRANDS) */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-8 py-4 border-t">
                        <span className="text-sm text-gray-500">
                            Page {page} of {totalPages}
                        </span>

                        <div className="flex gap-2">
                            <button
                                disabled={page === 1}
                                onClick={() => setPage((p) => p - 1)}
                                className="px-3 py-1 rounded-lg border text-sm
                                           disabled:opacity-40 hover:bg-gray-100"
                            >
                                Previous
                            </button>

                            {Array.from(
                                { length: totalPages },
                                (_, i) => i + 1
                            ).map((p) => (
                                <button
                                    key={p}
                                    onClick={() => setPage(p)}
                                    className={`px-3 py-1 rounded-lg text-sm border
                                        ${p === page
                                            ? "bg-black text-white"
                                            : "hover:bg-gray-100"
                                        }`}
                                >
                                    {p}
                                </button>
                            ))}

                            <button
                                disabled={page === totalPages}
                                onClick={() => setPage((p) => p + 1)}
                                className="px-3 py-1 rounded-lg border text-sm
                                           disabled:opacity-40 hover:bg-gray-100"
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
                                ? "Edit Build Type"
                                : "Add Build Type"}
                        </h2>

                        {error && (
                            <div className="mb-4 text-red-600 text-sm">
                                {error}
                            </div>
                        )}

                        <input
                            className="border p-3 rounded-xl w-full"
                            placeholder="Build type name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />

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
                                className="bg-black text-white px-4 py-2 rounded-xl disabled:opacity-50"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* DELETE CONFIRM */}
            {deleteTarget && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white w-full max-w-md rounded-2xl p-6">
                        <h2 className="text-lg font-semibold mb-2">
                            Delete Build Type
                        </h2>

                        <p className="text-sm text-gray-600 mb-6">
                            Are you sure you want to delete
                            <br />
                            <span className="font-medium text-gray-900">
                                {deleteTarget.name}
                            </span>
                            ?
                        </p>

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

export default BuildTypes;
