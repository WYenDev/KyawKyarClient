import { useState } from "react";
import { Plus, Trash2, Pencil, MoreVertical } from "lucide-react";

import { MAX_IMAGE_SIZE_BYTES } from "../../utils/imageUpload";
import {
    BuildType,
    useGetApiBuildTypes,
    usePostApiBuildTypes,
    usePatchApiBuildTypesId,
    useDeleteApiBuildTypesId,
    usePostApiBuildTypesIdImage,
    useDeleteApiBuildTypesIdImage,
} from "../../services/api";

type ApiError = {
    payload?: {
        error?: string;
    };
};

/* ================= COMPONENT ================= */
const BuildTypes = () => {
    /* ================= STATE ================= */
    const [openModal, setOpenModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState<BuildType | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<BuildType | null>(null);
    const [openActionId, setOpenActionId] = useState<string | null>(null);
    const [name, setName] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const placeholderImage = "https://storage.googleapis.com/kyaw-kyar.appspot.com/brands/default-brand.png";

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
                        (err as ApiError)?.payload?.error ??
                        "Failed to create build type";
                    setError(msg);
                },
            },
        });

    const { mutate: updateBuildType, isPending: updating } =
        usePatchApiBuildTypesId({
            mutation: {
                onSuccess: () => {
                    // Only patch name on save; image uploads happen immediately on selection
                    refetch();
                    closeModal();
                },
                onError: (err: unknown) => {
                    const msg =
                        (err as ApiError)?.payload?.error ??
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

    const { mutate: uploadImage } = usePostApiBuildTypesIdImage({
        mutation: {
            onSuccess: () => {
                // Update the selected item preview to show the newly uploaded image
                setSelectedItem((prev) => {
                    if (!prev) return prev;
                    return {
                        ...prev,
                        imageUrl: imageFile ? URL.createObjectURL(imageFile) : prev.imageUrl ?? null,
                    };
                });
                refetch();
                // Clear the local file once preview is set
                setImageFile(null);
            },
            onError: (err: unknown) => {
                const msg =
                    (err as ApiError)?.payload?.error ??
                    "Failed to upload image";
                setError(msg);
            },
        },
    });

    const { mutate: removeImage } = useDeleteApiBuildTypesIdImage({
        mutation: {
            onSuccess: () => {
                // Remove image from local preview and show placeholder
                setSelectedItem((prev) => {
                    if (!prev) return prev;
                    return { ...prev, imageUrl: null };
                });
                setImageFile(null);
                refetch();
            },
            onError: () => {
                setError("Failed to remove image");
            },
        },
    });

    /* ================= HELPERS ================= */
    const closeModal = () => {
        setOpenModal(false);
        setSelectedItem(null);
        setName("");
        setError(null);
        setImageFile(null);
    };

    /* ================= HANDLERS ================= */
    const openCreate = () => {
        setSelectedItem(null);
        setName("");
        setError(null);
        setImageFile(null);
        setOpenModal(true);
    };

    const openEdit = (item: BuildType) => {
        setSelectedItem(item);
        setName(item.name);
        setError(null);
        setImageFile(null);
        setOpenModal(true);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        if (file && file.size > MAX_IMAGE_SIZE_BYTES) {
            setError("Image must be 10 MB or less.");
            return;
        }
        setImageFile(file);
        if (file && selectedItem) {
            uploadImage({ id: selectedItem.id, data: { image: file } });
        }
    };

    const handleSubmit = () => {
        if (!name.trim()) {
            setError("Build type name is required");
            return;
        }

        if (selectedItem) {
            // The image is already uploaded via handleImageChange, so we only patch the name
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
        <div className="bg-[#F8F9FB] px-4 py-6 md:p-8 h-full overflow-y-auto">
            {/* HEADER */}
            <div className="flex items-center justify-between gap-3 flex-nowrap mb-6">
                <h1 className="text-2xl font-semibold text-gray-900 flex-1 min-w-0 break-words leading-tight">
                    Build Types Management
                </h1>

                <button
                    onClick={openCreate}
                    className="flex items-center justify-center bg-black text-white rounded-full hover:bg-gray-800 w-10 h-10 shrink-0"
                    aria-label="Add build type"
                >
                    <Plus size={18} />
                    <span className="sr-only">Add build type</span>
                </button>
            </div>

            {/* TABLE */}
            <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-600">
                        <tr>
                            <th className="px-8 py-4 text-left w-28"><span className="sr-only">Image</span></th>
                            <th className="px-8 py-4 text-left"><span className="sr-only">Build Type Name</span></th>
                            <th className="px-8 py-4 text-right w-40"><span className="sr-only">Actions</span></th>
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
                                    <td className="pl-4 pr-8 py-4">
                                        <div className="w-20 h-12 sm:w-24 sm:h-14 rounded border bg-white flex items-center justify-center overflow-hidden">
                                            {item.imageUrl ? (
                                                <img
                                                    src={item.imageUrl}
                                                    alt={item.name}
                                                    className="max-w-full max-h-full object-contain"
                                                />
                                            ) : (
                                                <span className="text-gray-400 text-xs">No image</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-8 py-4 font-medium text-gray-900">
                                        {item.name}
                                    </td>

                                    <td className="px-8 py-4">
                                        <div className="flex justify-end">
                                            <div className="relative">
                                                <button
                                                    onClick={() => setOpenActionId(openActionId === item.id ? null : item.id)}
                                                    className="p-2 rounded-md hover:bg-gray-100"
                                                    aria-label="Row actions"
                                                >
                                                    <MoreVertical size={16} />
                                                </button>

                                                {openActionId === item.id && (
                                                    <div className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-lg z-10">
                                                        <button
                                                            onClick={() => { openEdit(item); setOpenActionId(null); }}
                                                            className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center gap-2"
                                                        >
                                                            <Pencil size={14} /> Edit
                                                        </button>

                                                        <button
                                                            onClick={() => { setDeleteTarget(item); setOpenActionId(null); }}
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

                        {selectedItem && (
                            <div className="mt-4">
                                <label className="block text-sm text-gray-600 mb-2">
                                    Replace image (optional)
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="border p-3 rounded-xl w-full"
                                />
                                <div className="mt-2">
                                    <span className="block text-xs text-gray-500 mb-1">Image</span>
                                    <div className="w-full h-32 object-center rounded-md border bg-gray-50 overflow-hidden flex items-center justify-center">
                                        {imageFile || selectedItem?.imageUrl ? (
                                            <img
                                                src={imageFile ? URL.createObjectURL(imageFile) : (selectedItem?.imageUrl as string)}
                                                alt={selectedItem?.name ?? "preview"}
                                                className="w-full h-full object-contain"
                                            />
                                        ) : (
                                            <img
                                                src={placeholderImage}
                                                alt="placeholder"
                                                className="w-24 h-16 object-contain opacity-60"
                                            />
                                        )}
                                    </div>
                                    {selectedItem?.imageUrl && (
                                        <button
                                            onClick={() => selectedItem && removeImage({ id: selectedItem.id })}
                                            className="mt-2 text-xs text-red-600 hover:underline"
                                        >
                                            Remove image
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}

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
