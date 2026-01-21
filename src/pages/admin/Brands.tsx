import { useState, useMemo, useEffect } from "react";
import { Plus, Trash2, Pencil } from "lucide-react";

import {
    Brand,
    useGetApiBrands,
    usePostApiBrands,
    usePutApiBrandsId,
    useDeleteApiBrandsId,
} from "../../services/api";

type ApiError = {
    payload?: {
        error?: string;
    };
};

const Brands = () => {
    /* ================= STATE ================= */
    const [openModal, setOpenModal] = useState(false);
    const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Brand | null>(null);

    const [name, setName] = useState("");
    const [error, setError] = useState<string | null>(null);

    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    const PAGE_LIMIT = 13;
    const SEARCH_LIMIT = 10000;

    const isSearching = search.trim().length > 0;

    /* ================= QUERY ================= */
    const {
        data: brandData,
        isLoading,
        isError,
        refetch,
    } = useGetApiBrands({
        page: isSearching ? 1 : page,
        limit: isSearching ? SEARCH_LIMIT : PAGE_LIMIT,
    });

    const brands = brandData?.items ?? [];

    /* ================= SEARCH FILTER ================= */
    const filteredBrands = useMemo(() => {
        if (!isSearching) return brands;

        return brands.filter((b) =>
            b.name.toLowerCase().includes(search.toLowerCase())
        );
    }, [brands, search, isSearching]);

    /* ================= PAGINATION ================= */
    const total = isSearching
        ? filteredBrands.length
        : brandData?.total ?? 0;

    const totalPages = Math.ceil(total / PAGE_LIMIT);

    const visibleBrands = useMemo(() => {
        if (!isSearching) return filteredBrands;

        const start = (page - 1) * PAGE_LIMIT;
        return filteredBrands.slice(start, start + PAGE_LIMIT);
    }, [filteredBrands, page, isSearching]);

    useEffect(() => {
        setPage(1);
    }, [search]);

    /* ================= MUTATIONS ================= */
    const { mutate: createBrand, isPending: creating } = usePostApiBrands({
        mutation: {
            onSuccess: () => {
                refetch();
                closeModal();
            },
            onError: (err: unknown) => {
                setError(
                    (err as ApiError)?.payload?.error ??
                    "Failed to create brand"
                );
            },
        },
    });

    const { mutate: updateBrand, isPending: updating } = usePutApiBrandsId({
        mutation: {
            onSuccess: () => {
                refetch();
                closeModal();
            },
            onError: (err: unknown) => {
                setError(
                    (err as ApiError)?.payload?.error ??
                    "Failed to update brand"
                );
            },
        },
    });

    const { mutate: deleteBrand, isPending: deleting } = useDeleteApiBrandsId({
        mutation: {
            onSuccess: () => {
                refetch();
                setDeleteTarget(null);
            },
        },
    });

    /* ================= HELPERS ================= */
    const closeModal = () => {
        setOpenModal(false);
        setSelectedBrand(null);
        setName("");
        setError(null);
    };

    /* ================= HANDLERS ================= */
    const openCreate = () => {
        setSelectedBrand(null);
        setName("");
        setError(null);
        setOpenModal(true);
    };

    const openEdit = (brand: Brand) => {
        setSelectedBrand(brand);
        setName(brand.name);
        setError(null);
        setOpenModal(true);
    };

    const handleSubmit = () => {
        if (!name.trim()) {
            setError("Brand name is required");
            return;
        }

        if (selectedBrand) {
            updateBrand({
                id: selectedBrand.id,
                data: { name },
            });
        } else {
            createBrand({
                data: { name },
            });
        }
    };

    const confirmDelete = () => {
        if (!deleteTarget) return;
        deleteBrand({ id: deleteTarget.id });
    };

    /* ================= UI ================= */
    return (
        <div className="bg-[#F8F9FB] p-8 h-full overflow-y-auto">
            {/* HEADER */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">
                    Brands Management
                </h1>

                <div className="flex gap-3 items-center">
                    <input
                        type="text"
                        placeholder="Search brand..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border px-4 py-2 rounded-xl text-sm w-64"
                    />

                    <button
                        onClick={openCreate}
                        className="flex items-center gap-2 bg-black text-white px-5 py-2 rounded-xl text-sm hover:bg-gray-800"
                    >
                        <Plus size={16} />
                        Add Brand
                    </button>
                </div>
            </div>

            {/* TABLE */}
            <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-600">
                        <tr>
                            <th className="px-8 py-4 text-left">
                                Brand Name
                            </th>
                            <th className="px-8 py-4 text-right w-40">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan={2} className="py-12 text-center text-gray-400">
                                    Loading...
                                </td>
                            </tr>
                        ) : isError ? (
                            <tr>
                                <td colSpan={2} className="py-12 text-center text-red-500">
                                    Failed to load brands
                                </td>
                            </tr>
                        ) : visibleBrands.length === 0 ? (
                            <tr>
                                <td colSpan={2} className="py-12 text-center text-gray-400">
                                    No brands found
                                </td>
                            </tr>
                        ) : (
                            visibleBrands.map((brand) => (
                                <tr
                                    key={brand.id}
                                    className="border-t hover:bg-gray-50"
                                >
                                    <td className="px-8 py-4 font-medium text-gray-900">
                                        {brand.name}
                                    </td>

                                    <td className="px-8 py-4">
                                        <div className="flex justify-end gap-4">
                                            <button
                                                onClick={() => openEdit(brand)}
                                                className="text-indigo-600 hover:underline flex items-center gap-1"
                                            >
                                                <Pencil size={14} />
                                                Edit
                                            </button>

                                            <button
                                                onClick={() => setDeleteTarget(brand)}
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

                {/* PAGINATION  */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-8 py-4 border-t">
                        <span className="text-sm text-gray-500">
                            Page {page} of {totalPages}
                        </span>

                        <div className="flex gap-2">
                            <button
                                disabled={page === 1}
                                onClick={() => setPage((p) => p - 1)}
                                className="px-3 py-1 rounded-lg border text-sm disabled:opacity-40"
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
                                className="px-3 py-1 rounded-lg border text-sm disabled:opacity-40"
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
                            {selectedBrand ? "Edit Brand" : "Add Brand"}
                        </h2>

                        {error && (
                            <div className="mb-4 text-red-600 text-sm">
                                {error}
                            </div>
                        )}

                        <input
                            className="border p-3 rounded-xl w-full"
                            placeholder="Brand name"
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
                            Delete Brand
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

export default Brands;
