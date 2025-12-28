import { useEffect, useState } from "react";
import { Plus, Trash2, Pencil } from "lucide-react";
import Select from "../../components/Select";

/* ================= TYPES ================= */
interface Brand {
    id: string;
    name: string;
}

interface Model {
    id: string;
    name: string;
    brandId: string;
}

/* ================= COMPONENT ================= */
const Models = () => {
    const [models, setModels] = useState<Model[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [loading, setLoading] = useState(true);

    const [openModal, setOpenModal] = useState(false);
    const [selectedModel, setSelectedModel] = useState<Model | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Model | null>(null);

    const [name, setName] = useState("");
    const [brandId, setBrandId] = useState("");
    const [error, setError] = useState<string | null>(null);

    /* ================= MOCK LOAD ================= */
    useEffect(() => {
        setTimeout(() => {
            const mockBrands: Brand[] = [
                { id: "b1", name: "Toyota" },
                { id: "b2", name: "Honda" },
                { id: "b3", name: "Suzuki" },
                { id: "b4", name: "Ford" },
            ];

            const mockModels: Model[] = [
                { id: "m1", name: "Land Cruiser", brandId: "b1" },
                { id: "m2", name: "Camry", brandId: "b1" },
                { id: "m3", name: "CR-V", brandId: "b2" },
                { id: "m4", name: "Swift", brandId: "b3" },
                { id: "m5", name: "Ranger", brandId: "b4" },
            ];

            setBrands(mockBrands);
            setModels(mockModels);
            setLoading(false);
        }, 500);
    }, []);

    /* ================= HELPERS ================= */
    const brandOptions = brands.map((b) => ({
        label: b.name,
        value: b.id,
    }));

    const getBrandName = (id: string) =>
        brands.find((b) => b.id === id)?.name ?? "-";

    /* ================= HANDLERS ================= */
    const openCreate = () => {
        setSelectedModel(null);
        setName("");
        setBrandId("");
        setError(null);
        setOpenModal(true);
    };

    const openEdit = (model: Model) => {
        setSelectedModel(model);
        setName(model.name);
        setBrandId(model.brandId);
        setError(null);
        setOpenModal(true);
    };

    const handleSubmit = () => {
        if (!name.trim() || !brandId) {
            setError("Model name and Brand are required");
            return;
        }

        if (selectedModel) {
            setModels((prev) =>
                prev.map((m) =>
                    m.id === selectedModel.id
                        ? { ...m, name, brandId }
                        : m
                )
            );
        } else {
            setModels((prev) => [
                ...prev,
                { id: crypto.randomUUID(), name, brandId },
            ]);
        }

        setOpenModal(false);
        setSelectedModel(null);
        setName("");
        setBrandId("");
    };

    /* ================= DELETE ================= */
    const confirmDelete = () => {
        if (!deleteTarget) return;

        setModels((prev) =>
            prev.filter((m) => m.id !== deleteTarget.id)
        );
        setDeleteTarget(null);
    };

    /* ================= UI ================= */
    return (
        <div className="bg-[#F8F9FB] p-8 overflow-x-hidden">
            {/* HEADER */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">
                    Models Management
                </h1>

                <button
                    onClick={openCreate}
                    className="flex items-center gap-2 bg-black text-white px-5 py-2 rounded-xl text-sm hover:bg-gray-800 transition"
                >
                    <Plus size={16} />
                    Add Model
                </button>
            </div>

            {/* TABLE */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-600">
                        <tr>
                            <th className="px-8 py-4 text-left">Model Name</th>
                            <th className="px-8 py-4 text-left">Brand</th>
                            <th className="px-8 py-4 text-right w-40">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={3} className="py-12 text-center text-gray-400">
                                    Loading...
                                </td>
                            </tr>
                        ) : models.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="py-12 text-center text-gray-400">
                                    No models found
                                </td>
                            </tr>
                        ) : (
                            models.map((model) => (
                                <tr
                                    key={model.id}
                                    className="border-t hover:bg-gray-50 transition"
                                >
                                    <td className="px-8 py-4 font-medium text-gray-900">
                                        {model.name}
                                    </td>
                                    <td className="px-8 py-4">
                                        {getBrandName(model.brandId)}
                                    </td>
                                    <td className="px-8 py-4">
                                        <div className="flex justify-end items-center gap-4">
                                            <button
                                                onClick={() => openEdit(model)}
                                                className="text-indigo-600 hover:underline text-sm inline-flex items-center gap-1"
                                            >
                                                <Pencil size={14} />
                                                Edit
                                            </button>

                                            <button
                                                onClick={() => setDeleteTarget(model)}
                                                className="text-red-500 hover:underline text-sm inline-flex items-center gap-1"
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

            {/* CREATE / EDIT MODAL */}
            {openModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white w-full max-w-md rounded-2xl p-6">
                        <h2 className="text-xl font-semibold mb-4">
                            {selectedModel ? "Edit Model" : "Add Model"}
                        </h2>

                        {error && (
                            <div className="mb-4 text-red-600 text-sm">{error}</div>
                        )}

                        <div className="space-y-4">
                            <input
                                className="border p-3 rounded-xl w-full"
                                placeholder="Model name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />

                            <Select
                                value={brandId}
                                onChange={(v) => setBrandId(v ?? "")}
                                options={brandOptions}
                                placeholder="Select Brand"
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

            {/* DELETE CONFIRM MODAL */}
            {deleteTarget && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white w-full max-w-md rounded-2xl p-6">
                        <h2 className="text-lg font-semibold mb-2">
                            Delete Model
                        </h2>

                        <p className="text-sm text-gray-600 mb-6">
                            Are you sure you want to delete this model?
                            <br />
                            <span className="font-medium text-gray-900">
                                {deleteTarget.name}
                            </span>
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

export default Models;
