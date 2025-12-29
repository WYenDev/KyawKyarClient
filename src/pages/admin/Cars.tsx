import { useState } from "react";
import { Plus, Trash2, Pencil } from "lucide-react";
import Select, { Option } from "../../components/Select";

import {
    CarListItem,
    CarCreate,
    CarUpdate,
    Fuel,
    Transmission,
    Status,
    useGetApiCars,
    usePostApiCars,
    usePatchApiCarsId,
    useDeleteApiCarsId,
} from "../../services/api";

/* ================= OPTIONS ================= */
const fuelOptions: Option<Fuel>[] = [
    { label: "Petrol", value: Fuel.Petrol },
    { label: "Diesel", value: Fuel.Diesel },
];

const transmissionOptions: Option<Transmission>[] = [
    { label: "Manual", value: Transmission.Manual },
    { label: "Automatic", value: Transmission.Automatic },
];

const statusOptions: Option<Status>[] = [
    { label: "Available", value: Status.Available },
    { label: "Sold", value: Status.Sold },
];

/* ================= UI SAFE FORM ================= */
type CarForm = Omit<CarCreate, "status"> & {
    status: Status;
};

/* ================= COMPONENT ================= */
const Cars = () => {
    const [openModal, setOpenModal] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<CarListItem | null>(null);
    const [error, setError] = useState<string | null>(null);

    /* ================= FORM ================= */
    const [form, setForm] = useState<CarForm>({
        modelId: "",
        modelYear: new Date().getFullYear(),
        price: 0,
        mileage: 0,
        fuel: Fuel.Petrol,
        transmission: Transmission.Manual,
        status: Status.Available,
        colorId: "",
        showroomId: null,
    });

    /* ================= QUERY ================= */
    const { data, isLoading, isError, refetch } = useGetApiCars({
        page: 1,
        limit: 20,
    });

    const cars = data?.items ?? [];

    /* ================= MUTATIONS ================= */
    const { mutate: createCar, isPending: creating } = usePostApiCars({
        mutation: {
            onSuccess: () => {
                refetch();
                closeModal();
            },
            onError: () => setError("Failed to create car"),
        },
    });

    const { mutate: updateCar, isPending: updating } = usePatchApiCarsId({
        mutation: {
            onSuccess: () => {
                refetch();
                closeModal();
            },
            onError: () => setError("Failed to update car"),
        },
    });

    const { mutate: deleteCar, isPending: deleting } = useDeleteApiCarsId({
        mutation: {
            onSuccess: () => {
                refetch();
                setDeleteTarget(null);
            },
            onError: () => alert("Failed to delete car"),
        },
    });

    /* ================= HELPERS ================= */
    const closeModal = () => {
        setOpenModal(false);
        setEditingId(null);
        setError(null);
    };

    const openCreate = () => {
        setEditingId(null);
        setForm({
            modelId: "",
            modelYear: new Date().getFullYear(),
            price: 0,
            mileage: 0,
            fuel: Fuel.Petrol,
            transmission: Transmission.Manual,
            status: Status.Available,
            colorId: "",
            showroomId: null,
        });
        setOpenModal(true);
    };

    const openEdit = (car: CarListItem) => {
        setEditingId(car.id);
        setForm({
            modelId: car.modelId,
            modelYear: car.modelYear,
            price: car.price,
            mileage: car.mileage,
            fuel: car.fuel ?? Fuel.Petrol,
            transmission: car.transmission ?? Transmission.Manual,
            status: car.status ?? Status.Available,
            colorId: car.colorId,
            showroomId: car.showroomId ?? null,
        });
        setOpenModal(true);
    };

    const handleSubmit = () => {
        if (!form.modelId || !form.colorId) {
            setError("Model ID and Color ID are required");
            return;
        }

        if (editingId) {
            const payload: CarUpdate = { ...form };
            updateCar({ id: editingId, data: payload });
        } else {
            createCar({ data: form });
        }
    };

    const confirmDelete = () => {
        if (!deleteTarget) return;
        deleteCar({ id: deleteTarget.id });
    };

    /* ================= UI ================= */
    return (
        <div className="bg-[#F8F9FB] p-8 h-full overflow-y-auto">
            {/* HEADER */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">
                    Cars Management
                </h1>

                <button
                    onClick={openCreate}
                    className="flex items-center gap-2 bg-black text-white px-5 py-2 rounded-xl text-sm"
                >
                    <Plus size={16} />
                    Add Car
                </button>
            </div>

            {/* TABLE */}
            <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-600">
                        <tr>
                            <th className="px-6 py-4 text-left">Model ID</th>
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
                                <td colSpan={8} className="py-10 text-center text-gray-400">
                                    Loading...
                                </td>
                            </tr>
                        ) : isError ? (
                            <tr>
                                <td colSpan={8} className="py-10 text-center text-red-500">
                                    Failed to load cars
                                </td>
                            </tr>
                        ) : cars.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="py-10 text-center text-gray-400">
                                    No cars found
                                </td>
                            </tr>
                        ) : (
                            cars.map((car) => (
                                <tr key={car.id} className="border-t hover:bg-gray-50">
                                    <td className="px-6 py-4 text-xs font-mono">{car.modelId}</td>
                                    <td className="px-6 py-4 text-center">{car.modelYear}</td>
                                    <td className="px-6 py-4 text-center">{car.price.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-center">{car.mileage}</td>
                                    <td className="px-6 py-4 text-center">{car.fuel}</td>
                                    <td className="px-6 py-4 text-center">{car.transmission}</td>
                                    <td className="px-6 py-4 text-center">{car.status}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-end gap-4">
                                            <button
                                                onClick={() => openEdit(car)}
                                                className="text-indigo-600 flex items-center gap-1"
                                            >
                                                <Pencil size={14} />
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => setDeleteTarget(car)}
                                                className="text-red-500 flex items-center gap-1"
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
            </div>

            {/* MODAL */}
            {openModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white w-full max-w-lg rounded-2xl p-6">
                        <h2 className="text-xl font-semibold mb-4">
                            {editingId ? "Edit Car" : "Add Car"}
                        </h2>

                        {error && (
                            <div className="mb-4 text-red-600 text-sm">{error}</div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <Input label="Model ID" value={form.modelId} onChange={(v) => setForm({ ...form, modelId: v })} />
                            <Input label="Color ID" value={form.colorId} onChange={(v) => setForm({ ...form, colorId: v })} />
                            <Input label="Showroom ID" value={form.showroomId ?? ""} onChange={(v) => setForm({ ...form, showroomId: v || null })} />
                            <Input label="Model Year" type="number" value={form.modelYear} onChange={(v) => setForm({ ...form, modelYear: Number(v) })} />
                            <Input label="Price" type="number" value={form.price} onChange={(v) => setForm({ ...form, price: Number(v) })} />
                            <Input label="Mileage" type="number" value={form.mileage} onChange={(v) => setForm({ ...form, mileage: Number(v) })} />
                        </div>

                        <div className="grid grid-cols-3 gap-4 mt-4">
                            <Select<Fuel>
                                value={form.fuel}
                                options={fuelOptions}
                                onChange={(v) => setForm({ ...form, fuel: v })}
                            />
                            <Select<Transmission>
                                value={form.transmission}
                                options={transmissionOptions}
                                onChange={(v) => setForm({ ...form, transmission: v })}
                            />
                            <Select<Status>
                                value={form.status}
                                options={statusOptions}
                                onChange={(v) => setForm({ ...form, status: v })}
                            />
                        </div>

                        <div className="flex justify-end gap-4 mt-6">
                            <button onClick={closeModal} className="border px-4 py-2 rounded-xl">
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
                <ConfirmDelete
                    name={deleteTarget.modelId}
                    loading={deleting}
                    onCancel={() => setDeleteTarget(null)}
                    onConfirm={confirmDelete}
                />
            )}
        </div>
    );
};

/* ================= SMALL COMPONENTS ================= */

interface InputProps {
    label: string;
    type?: "text" | "number";
    value: string | number;
    onChange: (value: string) => void;
}

const Input = ({ label, type = "text", value, onChange }: InputProps) => (
    <div>
        <label className="block text-sm font-medium mb-1">{label}</label>
        <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="border p-3 rounded-xl w-full"
        />
    </div>
);

interface ConfirmDeleteProps {
    name: string;
    loading?: boolean;
    onCancel: () => void;
    onConfirm: () => void;
}

const ConfirmDelete = ({ name, loading, onCancel, onConfirm }: ConfirmDeleteProps) => (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white w-full max-w-md rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-2">Delete Car</h2>
            <p className="text-sm text-gray-600 mb-6">
                Are you sure you want to delete
                <br />
                <span className="font-medium text-gray-900">{name}</span>?
            </p>
            <div className="flex justify-end gap-4">
                <button onClick={onCancel} className="border px-4 py-2 rounded-xl">
                    Cancel
                </button>
                <button
                    onClick={onConfirm}
                    disabled={loading}
                    className="bg-red-600 text-white px-4 py-2 rounded-xl disabled:opacity-50"
                >
                    Delete
                </button>
            </div>
        </div>
    </div>
);

export default Cars;
