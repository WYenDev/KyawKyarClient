import { useEffect, useState } from "react";
import { Plus, Trash2, Pencil } from "lucide-react";
import Select, { Option } from "../../components/Select";

/* ================= TYPES ================= */
type Fuel = "Petrol" | "Diesel";
type Transmission = "Manual" | "Automatic";
type Status = "Available" | "Sold";

interface Car {
    id: string;
    modelId: string;
    modelYear: number;
    showroomId: string;
    price: number;
    mileage: number;
    fuel: Fuel;
    transmission: Transmission;
    status: Status;
    colorId: string;
}

/* ================= OPTIONS ================= */
const fuelOptions: Option<Fuel>[] = [
    { label: "Petrol", value: "Petrol" },
    { label: "Diesel", value: "Diesel" },
];

const transmissionOptions: Option<Transmission>[] = [
    { label: "Manual", value: "Manual" },
    { label: "Automatic", value: "Automatic" },
];

const statusOptions: Option<Status>[] = [
    { label: "Available", value: "Available" },
    { label: "Sold", value: "Sold" },
];

/* ================= COMPONENT ================= */
const Cars = () => {
    const [cars, setCars] = useState<Car[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const [openModal, setOpenModal] = useState<boolean>(false);
    const [selectedCar, setSelectedCar] = useState<Car | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Car | null>(null);

    const [form, setForm] = useState<Omit<Car, "id">>({
        modelId: "",
        modelYear: new Date().getFullYear(),
        showroomId: "",
        price: 0,
        mileage: 0,
        fuel: "Petrol",
        transmission: "Manual",
        status: "Available",
        colorId: "",
    });

    const [error, setError] = useState<string | null>(null);

    /* ================= MOCK LOAD ================= */
    useEffect(() => {
        setTimeout(() => {
            setCars([
                {
                    id: "1",
                    modelId: "33798743-d22a-4060-94f2-bcecae113eef",
                    modelYear: 2022,
                    showroomId: "SR-001",
                    price: 0,
                    mileage: 0,
                    fuel: "Petrol",
                    transmission: "Manual",
                    status: "Sold",
                    colorId: "c1",
                },
                {
                    id: "2",
                    modelId: "4cdb2210-dc03-43c1-ae93-0771b4c6a8",
                    modelYear: 2024,
                    showroomId: "SR-002",
                    price: 100000000,
                    mileage: 1,
                    fuel: "Petrol",
                    transmission: "Automatic",
                    status: "Available",
                    colorId: "c2",
                },
            ]);
            setLoading(false);
        }, 500);
    }, []);

    /* ================= HANDLERS ================= */
    const openCreate = () => {
        setSelectedCar(null);
        setForm({
            modelId: "",
            modelYear: new Date().getFullYear(),
            showroomId: "",
            price: 0,
            mileage: 0,
            fuel: "Petrol",
            transmission: "Manual",
            status: "Available",
            colorId: "",
        });
        setError(null);
        setOpenModal(true);
    };

    const openEdit = (car: Car) => {
        setSelectedCar(car);
        setForm({ ...car });
        setOpenModal(true);
    };

    const handleSubmit = () => {
        if (!form.modelId || !form.showroomId) {
            setError("Model ID and Showroom ID are required");
            return;
        }

        if (selectedCar) {
            setCars((prev) =>
                prev.map((c) =>
                    c.id === selectedCar.id ? { ...c, ...form } : c
                )
            );
        } else {
            setCars((prev) => [
                ...prev,
                { id: crypto.randomUUID(), ...form },
            ]);
        }

        setOpenModal(false);
        setSelectedCar(null);
    };

    /* ================= DELETE ================= */
    const confirmDelete = () => {
        if (!deleteTarget) return;
        setCars((prev) => prev.filter((c) => c.id !== deleteTarget.id));
        setDeleteTarget(null);
    };

    /* ================= UI ================= */
    return (
        <div className="bg-[#F8F9FB] p-8 overflow-x-hidden">
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
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
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
                        {loading ? (
                            <tr>
                                <td colSpan={8} className="py-10 text-center text-gray-400">
                                    Loading...
                                </td>
                            </tr>
                        ) : (
                            cars.map((car) => (
                                <tr key={car.id} className="border-t hover:bg-gray-50">
                                    <td className="px-6 py-4 text-xs font-mono">
                                        {car.modelId}
                                    </td>
                                    <td className="px-6 py-4 text-center">{car.modelYear}</td>
                                    <td className="px-6 py-4 text-center">
                                        {car.price.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 text-center">{car.mileage}</td>
                                    <td className="px-6 py-4 text-center">{car.fuel}</td>
                                    <td className="px-6 py-4 text-center">{car.transmission}</td>
                                    <td className="px-6 py-4 text-center">{car.status}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-end gap-4">
                                            <button
                                                onClick={() => openEdit(car)}
                                                className="text-indigo-600 inline-flex items-center gap-1"
                                            >
                                                <Pencil size={14} />
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => setDeleteTarget(car)}
                                                className="text-red-500 inline-flex items-center gap-1"
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
                        <h2 className="text-xl font-semibold mb-6">
                            {selectedCar ? "Edit Car" : "Add Car"}
                        </h2>

                        {error && (
                            <div className="mb-4 text-red-600 text-sm">{error}</div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <Input label="Model ID" value={form.modelId} onChange={(v) => setForm({ ...form, modelId: v })} />
                            <Input label="Model Year" type="number" value={form.modelYear} onChange={(v) => setForm({ ...form, modelYear: Number(v) })} />
                            <Input label="Showroom ID" value={form.showroomId} onChange={(v) => setForm({ ...form, showroomId: v })} />
                            <Input label="Price" type="number" value={form.price} onChange={(v) => setForm({ ...form, price: Number(v) })} />
                            <Input label="Mileage" type="number" value={form.mileage} onChange={(v) => setForm({ ...form, mileage: Number(v) })} />
                        </div>

                        <div className="grid grid-cols-3 gap-4 mt-4">
                            <Select<Fuel>
                                value={form.fuel}
                                options={fuelOptions}
                                onChange={(v: Fuel) => setForm({ ...form, fuel: v })}
                            />
                            <Select<Transmission>
                                value={form.transmission}
                                options={transmissionOptions}
                                onChange={(v: Transmission) =>
                                    setForm({ ...form, transmission: v })
                                }
                            />
                            <Select<Status>
                                value={form.status}
                                options={statusOptions}
                                onChange={(v: Status) => setForm({ ...form, status: v })}
                            />
                        </div>

                        <div className="flex justify-end gap-4 mt-6">
                            <button
                                onClick={() => setOpenModal(false)}
                                className="border px-4 py-2 rounded-xl"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="bg-black text-white px-4 py-2 rounded-xl"
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
    onCancel: () => void;
    onConfirm: () => void;
}

const ConfirmDelete = ({ name, onCancel, onConfirm }: ConfirmDeleteProps) => (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white w-full max-w-md rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-2">Delete Car</h2>
            <p className="text-sm text-gray-600 mb-6">
                Are you sure you want to delete:
                <br />
                <span className="font-medium text-gray-900">{name}</span>
            </p>
            <div className="flex justify-end gap-4">
                <button onClick={onCancel} className="border px-4 py-2 rounded-xl">
                    Cancel
                </button>
                <button onClick={onConfirm} className="bg-red-600 text-white px-4 py-2 rounded-xl">
                    Delete
                </button>
            </div>
        </div>
    </div>
);

export default Cars;
