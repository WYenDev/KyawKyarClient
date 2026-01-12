// src/pages/admin/Cars.tsx

import { useMemo, useState } from "react";
import { Plus, Trash2, Pencil, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
    CarListItem,
    useGetApiCarsActive,
    usePatchApiCarsIdSoftDelete,
} from "../../services/api";

const Cars = () => {
    const navigate = useNavigate();

    const [deleteTarget, setDeleteTarget] = useState<CarListItem | null>(null);
    const [searchText, setSearchText] = useState("");

    /* ===================== API ===================== */
    const { data, isLoading, refetch } = useGetApiCarsActive({
        page: 1,
        limit: 20,
    });

    const { mutate: softDeleteCar, isPending: deleting } =
        usePatchApiCarsIdSoftDelete({
            mutation: {
                onSuccess: () => {
                    refetch();
                    setDeleteTarget(null);
                },
            },
        });

    const cars = data?.items ?? [];

    /* ===================== SEARCH ===================== */
    const filteredCars = useMemo(() => {
        if (!searchText.trim()) return cars;
        const q = searchText.toLowerCase();
        return cars.filter((c) =>
            `${c.model?.brand?.name ?? ""} ${c.model?.name ?? ""}`
                .toLowerCase()
                .includes(q)
        );
    }, [cars, searchText]);

    /* ===================== RENDER ===================== */
    return (
        <div className="bg-[#F8F9FB] p-8 h-full overflow-y-auto">
            {/* HEADER */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold">Cars Management</h1>

                <button
                    onClick={() => navigate("/admin/cars/create")}
                    className="flex items-center gap-2 bg-black text-white px-5 py-2 rounded-xl"
                >
                    <Plus size={16} /> Add Car
                </button>
            </div>

            {/* SEARCH */}
            <div className="mb-4 flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm">
                <Search size={16} />
                <input
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    placeholder="Search by model or brand..."
                    className="outline-none w-full"
                />
            </div>

            {/* TABLE */}
            <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-4 text-left">Model</th>
                            <th className="px-6 py-4 text-center">Year</th>
                            <th className="px-6 py-4 text-center">Price</th>
                            <th className="px-6 py-4 text-center">Mileage</th>
                            <th className="px-6 py-4 text-center">Fuel</th>
                            <th className="px-6 py-4 text-center">Transmission</th>
                            <th className="px-6 py-4 text-center">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan={8} className="py-10 text-center">
                                    Loading...
                                </td>
                            </tr>
                        ) : filteredCars.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="py-10 text-center">
                                    No cars found
                                </td>
                            </tr>
                        ) : (
                            filteredCars.map((car) => (
                                <tr key={car.id} className="border-t">
                                    <td className="px-6 py-4">
                                        {car.model?.brand?.name} {car.model?.name}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {car.modelYear}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {car.price.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {car.mileage}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {car.fuel}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {car.transmission}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {car.status}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() =>
                                                navigate(`/admin/cars/${car.id}/edit`)
                                            }
                                            className="mr-4 text-indigo-600"
                                        >
                                            <Pencil size={14} />
                                        </button>

                                        <button
                                            onClick={() => setDeleteTarget(car)}
                                            className="text-red-600"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* DELETE CONFIRM MODAL */}
            {deleteTarget && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white max-w-md w-full rounded-2xl p-6">
                        <h2 className="text-lg font-semibold mb-2">Delete Car</h2>

                        <p className="mb-6">
                            Are you sure you want to delete{" "}
                            <b>
                                {deleteTarget.model?.brand?.name}{" "}
                                {deleteTarget.model?.name}
                            </b>
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
                                onClick={() =>
                                    softDeleteCar({ id: deleteTarget.id })
                                }
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

export default Cars;
