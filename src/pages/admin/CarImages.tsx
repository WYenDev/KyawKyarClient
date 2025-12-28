import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import Select from "../../components/Select";

/* ================= TYPES ================= */
type Visibility = "PUBLIC" | "PRIVATE";

interface Car {
    id: string;
    vin: string;
}

interface CarImage {
    id: string;
    carId: string;
    storageBaseKey: string;
    altText: string;
    mimeType: string;
    isPrimary: boolean;
    sequenceNumber: number;
    visibility: Visibility;
}

/* ================= COMPONENT ================= */
const CarImages: React.FC = () => {
    const [cars, setCars] = useState<Car[]>([]);
    const [images, setImages] = useState<CarImage[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const [openModal, setOpenModal] = useState<boolean>(false);
    const [selectedImage, setSelectedImage] = useState<CarImage | null>(null);

    const [form, setForm] = useState({
        carId: "",
        storageBaseKey: "",
        altText: "",
        mimeType: "image/jpeg",
        isPrimary: false,
        sequenceNumber: 1,
        visibility: "PUBLIC" as Visibility,
    });

    const [error, setError] = useState<string>("");

    /* ================= MOCK DATA ================= */
    useEffect(() => {
        setCars([
            { id: "c1", vin: "TOYOTA-001" },
            { id: "c2", vin: "HONDA-002" },
        ]);

        setImages([
            {
                id: "img1",
                carId: "c1",
                storageBaseKey: "/mock/car1.jpg",
                altText: "Front view",
                mimeType: "image/jpeg",
                isPrimary: true,
                sequenceNumber: 1,
                visibility: "PUBLIC",
            },
        ]);

        setLoading(false);
    }, []);

    /* ================= HELPERS ================= */
    const carOptions = cars.map((c) => ({
        label: c.vin,
        value: c.id,
    }));

    const getCarVin = (id: string): string => {
        const car = cars.find((c) => c.id === id);
        return car ? car.vin : "-";
    };

    /* ================= HANDLERS ================= */
    const openCreate = () => {
        setSelectedImage(null);
        setForm({
            carId: "",
            storageBaseKey: "",
            altText: "",
            mimeType: "image/jpeg",
            isPrimary: false,
            sequenceNumber: 1,
            visibility: "PUBLIC",
        });
        setError("");
        setOpenModal(true);
    };

    const openEdit = (img: CarImage) => {
        setSelectedImage(img);
        setForm({
            carId: img.carId,
            storageBaseKey: img.storageBaseKey,
            altText: img.altText,
            mimeType: img.mimeType,
            isPrimary: img.isPrimary,
            sequenceNumber: img.sequenceNumber,
            visibility: img.visibility,
        });
        setError("");
        setOpenModal(true);
    };

    const handleSubmit = () => {
        if (!form.carId || !form.storageBaseKey) {
            setError("Car and Image are required");
            return;
        }

        if (selectedImage) {
            setImages((prev) =>
                prev.map((i) =>
                    i.id === selectedImage.id ? { ...i, ...form } : i
                )
            );
        } else {
            setImages((prev) => [
                ...prev,
                {
                    id: crypto.randomUUID(),
                    ...form,
                },
            ]);
        }

        setOpenModal(false);
        setSelectedImage(null);
    };

    /* ================= UI ================= */
    return (
        <div className="bg-[#F8F9FB] p-8 overflow-x-hidden">
            {/* HEADER */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">
                    Car Images Management
                </h1>

                <button
                    onClick={openCreate}
                    className="flex items-center gap-2 bg-black text-white px-5 py-2 rounded-xl text-sm hover:bg-gray-800 transition"
                >
                    <Plus size={16} />
                    Add Image
                </button>
            </div>

            {/* TABLE */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-600">
                        <tr>
                            <th className="px-6 py-4 text-left">Car</th>
                            <th className="px-6 py-4 text-center">Preview</th>
                            <th className="px-6 py-4 text-center">Primary</th>
                            <th className="px-6 py-4 text-center">Order</th>
                            <th className="px-6 py-4 text-center">Visibility</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading && (
                            <tr>
                                <td colSpan={6} className="py-12 text-center text-gray-400">
                                    Loading...
                                </td>
                            </tr>
                        )}

                        {!loading && images.length === 0 && (
                            <tr>
                                <td colSpan={6} className="py-12 text-center text-gray-400">
                                    No images found
                                </td>
                            </tr>
                        )}

                        {!loading &&
                            images.map((img) => (
                                <tr
                                    key={img.id}
                                    className="border-t hover:bg-gray-50 transition"
                                >
                                    <td className="px-6 py-4 font-medium">
                                        {getCarVin(img.carId)}
                                    </td>

                                    <td className="px-6 py-4 text-center">
                                        <img
                                            src={img.storageBaseKey}
                                            alt={img.altText}
                                            className="w-24 h-16 object-cover rounded-lg mx-auto bg-gray-100"
                                        />
                                    </td>

                                    <td className="px-6 py-4 text-center">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-medium ${img.isPrimary
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-gray-100 text-gray-500"
                                                }`}
                                        >
                                            {img.isPrimary ? "Yes" : "No"}
                                        </span>
                                    </td>

                                    <td className="px-6 py-4 text-center">
                                        {img.sequenceNumber}
                                    </td>

                                    <td className="px-6 py-4 text-center">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-medium ${img.visibility === "PUBLIC"
                                                    ? "bg-blue-100 text-blue-700"
                                                    : "bg-gray-200 text-gray-600"
                                                }`}
                                        >
                                            {img.visibility}
                                        </span>
                                    </td>

                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => openEdit(img)}
                                            className="text-indigo-600 hover:underline text-sm"
                                        >
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>

            {/* CREATE / EDIT MODAL */}
            {openModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white w-full max-w-lg rounded-2xl p-6">
                        <h2 className="text-xl font-semibold mb-6">
                            {selectedImage ? "Edit Car Image" : "Add Car Image"}
                        </h2>

                        {error && (
                            <div className="mb-4 text-red-600 text-sm">
                                {error}
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className="block text-sm font-medium mb-1">
                                    Car (VIN)
                                </label>
                                <Select
                                    value={form.carId}
                                    onChange={(v: string) =>
                                        setForm({ ...form, carId: v })
                                    }
                                    options={carOptions}
                                    placeholder="Select Car"
                                />
                            </div>

                            <div className="col-span-2">
                                <label className="block text-sm font-medium mb-1">
                                    Storage Base Key
                                </label>
                                <input
                                    className="border p-3 rounded-xl w-full"
                                    value={form.storageBaseKey}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            storageBaseKey: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div className="col-span-2">
                                <label className="block text-sm font-medium mb-1">
                                    Alt Text
                                </label>
                                <input
                                    className="border p-3 rounded-xl w-full"
                                    value={form.altText}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            altText: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    MIME Type
                                </label>
                                <input
                                    className="border p-3 rounded-xl w-full"
                                    value={form.mimeType}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            mimeType: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Sequence Number
                                </label>
                                <input
                                    type="number"
                                    className="border p-3 rounded-xl w-full"
                                    value={form.sequenceNumber}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            sequenceNumber: Number(e.target.value),
                                        })
                                    }
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Visibility
                                </label>
                                <Select
                                    value={form.visibility}
                                    onChange={(v: Visibility) =>
                                        setForm({ ...form, visibility: v })
                                    }
                                    options={[
                                        { label: "PUBLIC", value: "PUBLIC" },
                                        { label: "PRIVATE", value: "PRIVATE" },
                                    ]}
                                />
                            </div>

                            <div className="flex items-center gap-3 mt-6">
                                <input
                                    type="checkbox"
                                    checked={form.isPrimary}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            isPrimary: e.target.checked,
                                        })
                                    }
                                />
                                <span className="text-sm font-medium">
                                    Primary Image
                                </span>
                            </div>
                        </div>

                        <div className="flex justify-end gap-4 mt-8">
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
        </div>
    );
};

export default CarImages;
