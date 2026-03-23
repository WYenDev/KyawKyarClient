import { useMemo, useState, useEffect, useRef } from "react";
import {
    Plus,
    Trash2,
    Pencil,
    Search,
    X,
    Calendar,
    Gauge,
    Fuel,
    Settings,
    MapPin,
    RotateCcw,
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { keepPreviousData } from '@tanstack/react-query';

import {
    CarListItem,
    Status,
    useDeleteApiCarsId,
    useGetApiCarsActive,
    useGetApiCarsDeleted,
    useGetApiCarsSold,
    usePatchApiCarsId,
    usePatchApiCarsIdSoftDelete,
    usePostApiCarsDeleteBatch,
    usePostApiCarsIdRestore,
} from "../../services/api";

const PLACEHOLDER_IMAGE =
    "https://www.shutterstock.com/image-vector/flat-car-picture-placeholder-symbol-600nw-2366856295.jpg";

type DeleteMode = "soft" | "hard";
type DeleteTarget = {
    car: CarListItem;
    mode: DeleteMode;
};

/* ================= CONSTANTS ================= */
const PAGE_LIMIT = 8;        // ⭐ 1 page = 8 cars (4 x 2 grid)


const Cars = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const tabFromUrl = searchParams.get('tab');
    const initialTab = (tabFromUrl === 'sold' || tabFromUrl === 'deleted') ? tabFromUrl : 'active';

    /* ================= STATE ================= */
    const [activeTab, setActiveTab] = useState<'active' | 'sold' | 'deleted'>(initialTab);

    /* ================= SYNC TAB FROM URL (e.g. dashboard link or browser back) ================= */
    useEffect(() => {
        const tab = searchParams.get('tab');
        if (tab === 'sold' || tab === 'deleted') setActiveTab(tab);
        else if (tab === 'active' || !tab) setActiveTab('active');
    }, [searchParams]);
    const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);
    const [searchText, setSearchText] = useState("");
    const [selectMode, setSelectMode] = useState(false);
    const [selectedCarIds, setSelectedCarIds] = useState<string[]>([]);
    const [confirmBulkDelete, setConfirmBulkDelete] = useState(false);
    const prevSearchTextRef = useRef(searchText);
    const prevActiveTabRef = useRef(activeTab);

    const page = useMemo(() => {
        const p = searchParams.get('page');
        return p ? parseInt(p, 10) : 1;
    }, [searchParams]);

    const isSearching = searchText.trim().length > 0;

    /* ================= API ================= */
    // Active tab uses /api/cars/active with server pagination; search is client-side
    const LIMIT = PAGE_LIMIT; // pagesize (8)

    const activeParams = useMemo(() => ({
        page,
        limit: LIMIT,
    }), [page]);

    const activeHookParams = activeTab === 'active' ? activeParams : undefined;

    const { data: activeResponse, isLoading: activeLoading, refetch: refetchActive } =
        useGetApiCarsActive(activeHookParams, { query: { placeholderData: keepPreviousData, enabled: activeTab === 'active' } });

    const { 
        data: soldData, 
        isLoading: soldLoading,
        refetch: refetchSold,
    } = useGetApiCarsSold({
        page,
        limit: LIMIT,
    }, { query: { enabled: activeTab === 'sold' } });

    const { 
        data: deletedData, 
        isLoading: deletedLoading, 
        refetch: refetchDeleted 
    } = useGetApiCarsDeleted({
        page,
        limit: LIMIT,
    }, { query: { enabled: activeTab === 'deleted' } });

    const { mutate: softDeleteCar, isPending: isSoftDeleting } =
        usePatchApiCarsIdSoftDelete({
            mutation: {
                onSuccess: () => {
                    refetchActive();
                    refetchDeleted();
                    setDeleteTarget(null);
                    const params = new URLSearchParams(searchParams);
                    params.set('page', '1');
                    setSearchParams(params);
                },
            },
        });

    const { mutate: hardDeleteCar, isPending: isHardDeleting } = useDeleteApiCarsId({
        mutation: {
            onSuccess: (_, variables) => {
                const id = variables?.id;
                if (!id) return;
                refetchDeleted();
                setSelectedCarIds((current) => current.filter((selectedId) => selectedId !== id));
                setDeleteTarget(null);
            },
        },
    });

    const { mutate: restoreCar, isPending: restoring } = usePostApiCarsIdRestore({
        mutation: {
            onSuccess: () => {
                refetchActive();
                refetchDeleted();
            },
        },
    });

    const { mutate: batchDeleteCars, isPending: isBulkDeleting } = usePostApiCarsDeleteBatch({
        mutation: {
            onSuccess: () => {
                refetchDeleted();
                setSelectedCarIds([]);
                setSelectMode(false);
                setConfirmBulkDelete(false);
                const params = new URLSearchParams(searchParams);
                params.set('page', '1');
                setSearchParams(params);
            },
        },
    });

    const { mutate: markAvailable, isPending: markingAvailable } = usePatchApiCarsId({
        mutation: {
            onSuccess: () => {
                refetchActive();
                refetchSold();
            },
        },
    });

    // currentData / loading / cars source
    const currentData = activeTab === 'active' ? activeResponse : activeTab === 'sold' ? soldData : deletedData;
    const isLoading = activeTab === 'active' ? activeLoading : activeTab === 'sold' ? soldLoading : deletedLoading;
    const cars: CarListItem[] = activeTab === 'active'
        ? (activeResponse?.items ?? [])
        : activeTab === 'sold'
            ? (soldData?.items ?? [])
            : (deletedData?.items ?? []);

    /* ================= SEARCH FILTER ================= */
    const filteredCars: CarListItem[] = useMemo(() => {
        if (!isSearching) return cars;

        const q = searchText.toLowerCase();
        return cars.filter((c: CarListItem) => {
            const brand = c.model?.brand?.name ?? "";
            const model = c.model?.name ?? "";
            return `${brand} ${model}`.toLowerCase().includes(q);
        });
    }, [cars, searchText, isSearching]);

    /* ================= PAGINATION DATA ================= */
    const total = isSearching
        ? filteredCars.length
        : currentData?.total ?? 0;

    const totalPages = Math.ceil(total / PAGE_LIMIT);

    const visibleCars: CarListItem[] = useMemo(() => {
        if (!isSearching) return filteredCars;

        const start = (page - 1) * PAGE_LIMIT;
        return filteredCars.slice(start, start + PAGE_LIMIT);
    }, [filteredCars, page, isSearching]);

    useEffect(() => {
        const prevSearch = prevSearchTextRef.current;
        const prevTab = prevActiveTabRef.current;

        if (searchText !== prevSearch || activeTab !== prevTab) {
            const params = new URLSearchParams(searchParams);
            params.set('page', '1');
            setSearchParams(params);
        }

        prevSearchTextRef.current = searchText;
        prevActiveTabRef.current = activeTab;
    }, [searchText, activeTab, searchParams, setSearchParams]);

    useEffect(() => {
        if (activeTab !== 'deleted') {
            setSelectMode(false);
            setSelectedCarIds([]);
            setConfirmBulkDelete(false);
        }
    }, [activeTab]);

    const isDeletedTab = activeTab === 'deleted';
    const deletedVisibleIds = isDeletedTab ? visibleCars.map((car) => car.id) : [];
    const selectedCount = selectedCarIds.length;
    const isAllVisibleSelected =
        deletedVisibleIds.length > 0 &&
        deletedVisibleIds.every((id) => selectedCarIds.includes(id));

    const toggleSelectMode = () => {
        if (selectMode) {
            setSelectMode(false);
            setSelectedCarIds([]);
            setConfirmBulkDelete(false);
            return;
        }
        setSelectMode(true);
    };

    const toggleCarSelection = (carId: string) => {
        setSelectedCarIds((prev) =>
            prev.includes(carId) ? prev.filter((id) => id !== carId) : [...prev, carId]
        );
    };

    const handleSelectVisible = () => {
        if (!isDeletedTab || deletedVisibleIds.length === 0) return;

        if (isAllVisibleSelected) {
            setSelectedCarIds((prev) =>
                prev.filter((id) => !deletedVisibleIds.includes(id))
            );
            return;
        }

        setSelectedCarIds((prev) => {
            const nextSet = new Set(prev);
            deletedVisibleIds.forEach((id) => nextSet.add(id));
            return Array.from(nextSet);
        });
    };

    const handleDeleteConfirmation = () => {
        if (!deleteTarget) return;

        if (deleteTarget.mode === "soft") {
            softDeleteCar({ id: deleteTarget.car.id });
        } else {
            hardDeleteCar({ id: deleteTarget.car.id });
        }
    };

    const handleBatchDelete = () => {
        if (selectedCount === 0) return;
        batchDeleteCars({ data: { ids: selectedCarIds } });
    };

    const deleteCarLabel = deleteTarget
        ? `${deleteTarget.car.model?.brand?.name ?? ""} ${deleteTarget.car.model?.name ?? ""}`.trim()
        : "";
    const isHardDeleteTarget = deleteTarget?.mode === 'hard';
    const isDeleteInProgress = isHardDeleteTarget ? isHardDeleting : isSoftDeleting;

    /* ================= RENDER ================= */
    return (
        <div className="bg-[#F8F9FB] px-4 py-6 md:p-8 h-full overflow-y-auto">
            {/* HEADER */}
            <div className="flex items-center justify-between gap-3 flex-wrap mb-6">
                <h1 className="text-2xl font-semibold text-left flex-1 min-w-[200px]">Cars Management</h1>

                <button
                    onClick={() => navigate("/admin/cars/create")}
                    className="flex items-center justify-center bg-black text-white rounded-full hover:bg-gray-800 transition w-10 h-10 shrink-0"
                    aria-label="Add car"
                >
                    <Plus size={18} />
                    <span className="sr-only">Add car</span>
                </button>
            </div>

            {/* TABS */}
            <div className="flex flex-wrap gap-3 sm:gap-4 mb-6 border-b border-gray-200">
                    <button
                        onClick={() => { setActiveTab('active'); setSearchParams({ tab: 'active' }); }}
                        className={`pb-2 px-1 text-sm font-medium transition-colors relative ${
                            activeTab === 'active' 
                                ? 'text-black border-b-2 border-black' 
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        Active Cars
                    </button>
                    <button
                        onClick={() => { setActiveTab('sold'); setSearchParams({ tab: 'sold' }); }}
                        className={`pb-2 px-1 text-sm font-medium transition-colors relative ${
                            activeTab === 'sold' 
                                ? 'text-black border-b-2 border-black' 
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        Sold Cars
                    </button>
                    <button
                        onClick={() => { setActiveTab('deleted'); setSearchParams({ tab: 'deleted' }); }}
                        className={`pb-2 px-1 text-sm font-medium transition-colors relative ${
                            activeTab === 'deleted' 
                                ? 'text-black border-b-2 border-black' 
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        Deleted Cars
                    </button>
            </div>

            {/* SEARCH */}
            <div className="mb-6">
                <div className="relative max-w-md w-full">
                    <Search
                        size={16}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        placeholder="Search by brand or model..."
                        className="w-full pl-10 pr-10 py-3 rounded-xl border
                                   focus:outline-none focus:ring-2 focus:ring-black/20
                                   text-sm bg-white"
                    />
                    {searchText && (
                        <button
                            onClick={() => setSearchText("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>
            </div>

            {isDeletedTab && (
                <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-wrap items-center gap-3">
                        <button
                            type="button"
                            onClick={toggleSelectMode}
                            disabled={cars.length === 0}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition border ${selectMode ? 'border-black bg-black text-white hover:bg-slate-900' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'} disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            {selectMode ? "Cancel selection" : "Select cars"}
                        </button>
                        {selectMode && deletedVisibleIds.length > 0 && (
                            <button
                                type="button"
                                onClick={handleSelectVisible}
                                className="px-4 py-2 rounded-full text-sm font-medium text-slate-700 border border-slate-200 bg-white hover:border-slate-300"
                            >
                                {isAllVisibleSelected ? "Deselect visible" : "Select visible"}
                            </button>
                        )}
                        {selectMode && selectedCount > 0 && (
                            <button
                                type="button"
                                onClick={() => setSelectedCarIds([])}
                                className="px-4 py-2 rounded-full text-sm font-medium text-slate-500 border border-slate-200 bg-white hover:border-slate-300"
                            >
                                Clear selection
                            </button>
                        )}
                        {selectMode && (
                            <span className="text-sm text-slate-600">
                                {selectedCount} selected
                            </span>
                        )}
                    </div>
                    {selectMode && (
                        <button
                            type="button"
                            onClick={() => setConfirmBulkDelete(true)}
                            disabled={selectedCount === 0}
                            className={`px-4 py-2 rounded-full text-sm font-semibold transition ${selectedCount === 0 ? 'bg-slate-200 text-slate-500 cursor-not-allowed' : 'bg-red-600 text-white hover:bg-red-500'}`}
                        >
                            Delete selected
                        </button>
                    )}
                </div>
            )}

            {/* CAR CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                {isLoading ? (
                    <div className="col-span-full py-12 text-center text-gray-400">
                        Loading...
                    </div>
                ) : visibleCars.length === 0 ? (
                    <div className="col-span-full py-12 text-center text-gray-400">
                        No cars found
                    </div>
                ) : (
                    visibleCars.map((car: CarListItem) => (
                        <div
                            key={car.id}
                            className="bg-white rounded-xl shadow-sm
                                       hover:shadow-md transition
                                       overflow-hidden cursor-pointer group relative"
                        >
                            {isDeletedTab && selectMode && (
                                <label
                                    className="absolute top-4 right-4 z-10"
                                    aria-label={`Select ${car.model?.brand?.name} ${car.model?.name}`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedCarIds.includes(car.id)}
                                        onChange={(e) => {
                                            e.stopPropagation();
                                            toggleCarSelection(car.id);
                                        }}
                                        className="h-5 w-5 rounded border border-slate-300 text-black focus:ring-2 focus:ring-black"
                                    />
                                </label>
                            )}
                            {/* IMAGE */}
                            <img
                                src={
                                    car.primaryImage?.url ||
                                    PLACEHOLDER_IMAGE
                                }
                                alt={car.model?.name}
                                className="w-full h-48 object-contain
                                           group-hover:scale-105 transition"
                            />

                            {/* CONTENT */}
                            <div className="p-6">
                                <h3 className="font-bold mb-1">
                                    {car.model?.brand?.name} {car.model?.name}
                                </h3>

                                <div className="flex items-center text-sm text-gray-500 mb-3">
                                    <MapPin className="w-4 h-4 mr-1" />
                                    {car.showroom?.city || "Unknown"}
                                </div>

                                <div className="grid grid-cols-2 gap-3 text-sm text-gray-600 mb-4">
                                    <div className="flex items-center">
                                        <Calendar className="w-4 h-4 mr-2" />
                                        {car.modelYear}
                                    </div>
                                    <div className="flex items-center">
                                        <Gauge className="w-4 h-4 mr-2" />
                                        {car.mileage}
                                    </div>
                                    <div className="flex items-center">
                                        <Fuel className="w-4 h-4 mr-2" />
                                        {car.fuelType?.name}
                                    </div>
                                    <div className="flex items-center">
                                        <Settings className="w-4 h-4 mr-2" />
                                        {car.transmissionType?.name}
                                    </div>
                                </div>

                                <div className="text-indigo-600 font-bold text-lg mb-3">
                                    {car.price.toLocaleString()}
                                </div>

                                <div className="flex items-center justify-between pt-3 border-t">
                    {activeTab === 'active' ? (
                        <>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/admin/cars/${car.id}/edit`);
                                }}
                                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors"
                            >
                                <Pencil size={14} /> Edit
                            </button>

                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setDeleteTarget({ car, mode: 'soft' });
                                }}
                                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
                            >
                                <Trash2 size={14} /> Delete
                            </button>
                        </>
                    ) : activeTab === 'sold' ? (
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                markAvailable({ id: car.id, data: { status: Status.Available } });
                            }}
                            disabled={markingAvailable}
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-green-600 bg-green-50 hover:bg-green-100 transition-colors disabled:opacity-50 ml-auto"
                        >
                            <RotateCcw size={14} /> Back to inventory
                        </button>
                    ) : (
                        <div className="flex items-center justify-between gap-3 w-full">
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    restoreCar({ id: car.id });
                                }}
                                disabled={restoring}
                                className="text-green-600 text-sm flex items-center gap-1 disabled:opacity-50"
                            >
                                <RotateCcw size={14} /> Restore
                            </button>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setDeleteTarget({ car, mode: 'hard' });
                                }}
                                disabled={isHardDeleting}
                                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-colors disabled:opacity-50"
                            >
                                <Trash2 size={14} /> Delete
                            </button>
                        </div>
                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* PAGINATION */}
            {total > 0 && (
                <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-sm text-slate-600 text-center sm:text-left">
                        Showing {(page - 1) * LIMIT + 1} - {Math.min(page * LIMIT, total)} of {total}
                    </div>
                    <div className="flex items-center justify-center gap-3">
                        <button
                            onClick={() => {
                                const params = new URLSearchParams(searchParams);
                                params.set('page', String(Math.max(1, page - 1)));
                                setSearchParams(params);
                            }}
                            disabled={page <= 1}
                            className={`px-3 py-1 rounded-md border ${page <= 1 ? 'bg-slate-100 text-slate-400 border-slate-200' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'}`}
                        >
                            Prev
                        </button>
                        <div className="text-sm text-slate-700">Page {page} of {totalPages}</div>
                        <button
                            onClick={() => {
                                const params = new URLSearchParams(searchParams);
                                params.set('page', String(Math.min(totalPages, page + 1)));
                                setSearchParams(params);
                            }}
                            disabled={page >= totalPages}
                            className={`px-3 py-1 rounded-md border ${page >= totalPages ? 'bg-slate-100 text-slate-400 border-slate-200' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'}`}
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}

            {/* BULK DELETE CONFIRMATION */}
            {confirmBulkDelete && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center px-4">
                    <div className="bg-white p-6 rounded-xl w-full max-w-md">
                        <h2 className="font-semibold mb-2">
                            Permanently delete {selectedCount} {selectedCount === 1 ? "car" : "cars"}
                        </h2>
                        <p className="text-sm text-gray-600 mb-6">
                            This will permanently remove the selected cars from the system.
                            This action cannot be undone.
                        </p>

                        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-4">
                            <button
                                onClick={() => setConfirmBulkDelete(false)}
                                className="border px-4 py-2 rounded w-full sm:w-auto"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleBatchDelete}
                                disabled={selectedCount === 0 || isBulkDeleting}
                                className="bg-red-600 text-white px-4 py-2 rounded w-full sm:w-auto disabled:opacity-50"
                            >
                                {isBulkDeleting ? "Deleting..." : "Delete selected"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* DELETE MODAL */}
            {deleteTarget && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center px-4">
                    <div className="bg-white p-6 rounded-xl w-full max-w-md">
                        <h2 className="font-semibold mb-2">
                            {isHardDeleteTarget ? "Delete car permanently" : "Delete car"}
                        </h2>
                        <p className="text-sm mb-6">
                            {isHardDeleteTarget ? (
                                <>
                                    Permanently delete <b>{deleteCarLabel}</b>? This cannot be undone.
                                </>
                            ) : (
                                <>
                                    Delete <b>{deleteCarLabel}</b>?
                                </>
                            )}
                        </p>

                        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-4">
                            <button
                                onClick={() => setDeleteTarget(null)}
                                className="border px-4 py-2 rounded w-full sm:w-auto"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteConfirmation}
                                disabled={isDeleteInProgress}
                                className="bg-red-600 text-white px-4 py-2 rounded w-full sm:w-auto"
                            >
                                {isHardDeleteTarget ? "Delete permanently" : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cars;
