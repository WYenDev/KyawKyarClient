import { useMemo, useState, useEffect } from "react";
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
import { useNavigate } from "react-router-dom";
import { keepPreviousData } from '@tanstack/react-query';

import {
    CarListItem,
    useGetApiCarsActive,
    useGetApiCarsDeleted,
    useGetApiCarsSold,
    usePatchApiCarsIdSoftDelete,
    usePostApiCarsIdRestore,
} from "../../services/api";

const PLACEHOLDER_IMAGE =
    "https://www.shutterstock.com/image-vector/flat-car-picture-placeholder-symbol-600nw-2366856295.jpg";

/* ================= CONSTANTS ================= */
const PAGE_LIMIT = 8;        // ⭐ 1 page = 8 cars (4 x 2 grid)


const Cars = () => {
    const navigate = useNavigate();

    /* ================= STATE ================= */
    const [activeTab, setActiveTab] = useState<'active' | 'sold' | 'deleted'>('active');
    const [deleteTarget, setDeleteTarget] = useState<CarListItem | null>(null);
    const [searchText, setSearchText] = useState("");
    const [page, setPage] = useState(1);

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
        isLoading: soldLoading
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

    const { mutate: softDeleteCar, isPending: deleting } =
        usePatchApiCarsIdSoftDelete({
            mutation: {
                onSuccess: () => {
                    refetchActive();
                    refetchDeleted();
                    setDeleteTarget(null);
                    setPage(1);
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
        setPage(1);
    }, [searchText, activeTab]);

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
                        onClick={() => setActiveTab('active')}
                        className={`pb-2 px-1 text-sm font-medium transition-colors relative ${
                            activeTab === 'active' 
                                ? 'text-black border-b-2 border-black' 
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        Active Cars
                    </button>
                    <button
                        onClick={() => setActiveTab('sold')}
                        className={`pb-2 px-1 text-sm font-medium transition-colors relative ${
                            activeTab === 'sold' 
                                ? 'text-black border-b-2 border-black' 
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        Sold Cars
                    </button>
                    <button
                        onClick={() => setActiveTab('deleted')}
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
                                       overflow-hidden cursor-pointer group"
                        >
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

                                <div className="flex justify-between pt-3 border-t">
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
                                    setDeleteTarget(car);
                                }}
                                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
                            >
                                <Trash2 size={14} /> Delete
                            </button>
                        </>
                    ) : activeTab === 'sold' ? (
                        <div className="text-sm text-slate-500 ml-auto">Sold</div>
                    ) : (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                restoreCar({ id: car.id });
                            }}
                            disabled={restoring}
                            className="text-green-600 text-sm flex items-center gap-1 ml-auto disabled:opacity-50"
                        >
                            <RotateCcw size={14} /> Restore
                        </button>
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

            {/* DELETE MODAL */}
            {deleteTarget && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center px-4">
                    <div className="bg-white p-6 rounded-xl w-full max-w-md">
                        <h2 className="font-semibold mb-2">Delete Car</h2>
                        <p className="text-sm mb-6">
                            Delete{" "}
                            <b>
                                {deleteTarget.model?.brand?.name}{" "}
                                {deleteTarget.model?.name}
                            </b>
                            ?
                        </p>

                        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-4">
                            <button
                                onClick={() => setDeleteTarget(null)}
                                className="border px-4 py-2 rounded w-full sm:w-auto"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() =>
                                    softDeleteCar({ id: deleteTarget.id })
                                }
                                disabled={deleting}
                                className="bg-red-600 text-white px-4 py-2 rounded w-full sm:w-auto"
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

export default Cars;
