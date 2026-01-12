import { useState, useMemo } from "react";
import { Plus, Trash2, Pencil } from "lucide-react";

import {
    Grade,
    Model,
    useGetApiModels,
    useGetApiModelsIdGrades,
    usePostApiGrades,
    usePatchApiGradesId,
    useDeleteApiGradesId,
} from "../../services/api";

const Grades = () => {
    /* ================= STATE ================= */
    const [openModal, setOpenModal] = useState(false);
    const [selectedGrade, setSelectedGrade] = useState<Grade | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Grade | null>(null);

    const [modelId, setModelId] = useState("");
    const [name, setName] = useState("");
    const [search, setSearch] = useState("");
    const [error, setError] = useState<string | null>(null);

    /* ================= MODELS ================= */
    const { data: modelData } = useGetApiModels({
        page: 1,
        limit: 1000,
    });

    const models: Model[] = modelData?.models ?? [];

    const getModelName = (id: string) =>
        models.find((m) => m.id === id)?.name ?? "-";

    /* ================= GRADES (ORVAL HOOK) ================= */
    const gradesQuery = useGetApiModelsIdGrades(modelId);

    const grades: Grade[] = gradesQuery.data ?? [];
    const isLoading = gradesQuery.isLoading;
    const isError = gradesQuery.isError;

    /* ================= SEARCH ================= */
    const filteredGrades = useMemo(() => {
        if (!search.trim()) return grades;
        return grades.filter((g) =>
            g.name.toLowerCase().includes(search.toLowerCase())
        );
    }, [grades, search]);

    /* ================= MUTATIONS ================= */
    const { mutate: createGrade, isPending: creating } = usePostApiGrades({
        mutation: {
            onSuccess: () => {
                gradesQuery.refetch();
                closeModal();
            },
            onError: (err: unknown) =>
                setError(
                    (err as any)?.payload?.error ??
                    "Failed to create grade"
                ),
        },
    });

    const { mutate: updateGrade, isPending: updating } = usePatchApiGradesId({
        mutation: {
            onSuccess: () => {
                gradesQuery.refetch();
                closeModal();
            },
            onError: (err: unknown) =>
                setError(
                    (err as any)?.payload?.error ??
                    "Failed to update grade"
                ),
        },
    });

    const { mutate: deleteGrade, isPending: deleting } =
        useDeleteApiGradesId({
            mutation: {
                onSuccess: () => {
                    gradesQuery.refetch();
                    setDeleteTarget(null);
                },
            },
        });

    /* ================= HELPERS ================= */
    const closeModal = () => {
        setOpenModal(false);
        setSelectedGrade(null);
        setName("");
        setError(null);
    };

    /* ================= HANDLERS ================= */
    const openCreate = () => {
        setSelectedGrade(null);
        setModelId("");
        setName("");
        setError(null);
        setOpenModal(true);
    };

    const openEdit = (grade: Grade) => {
        setSelectedGrade(grade);
        setModelId(grade.modelId);
        setName(grade.name);
        setError(null);
        setOpenModal(true);
    };

    const handleSubmit = () => {
        if (!modelId) {
            setError("Please select a model");
            return;
        }

        if (!name.trim()) {
            setError("Grade name is required");
            return;
        }

        if (selectedGrade) {
            updateGrade({
                id: selectedGrade.id,
                data: { name },
            });
        } else {
            createGrade({
                data: { name, modelId },
            });
        }
    };

    const confirmDelete = () => {
        if (!deleteTarget) return;
        deleteGrade({ id: deleteTarget.id });
    };

    /* ================= UI ================= */
    return (
        <div className="bg-[#F8F9FB] p-8 h-full overflow-y-auto">
            {/* HEADER */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">
                    Grades Management
                </h1>

                <div className="flex gap-3 items-center">
                    <input
                        type="text"
                        placeholder="Search grade..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border px-4 py-2 rounded-xl text-sm w-64"
                    />

                    <button
                        onClick={openCreate}
                        className="flex items-center gap-2 bg-black text-white px-5 py-2 rounded-xl text-sm hover:bg-gray-800"
                    >
                        <Plus size={16} />
                        Add Grade
                    </button>
                </div>
            </div>

            {/* TABLE */}
            <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-600">
                        <tr>
                            <th className="px-8 py-4 text-left">
                                Grade Name
                            </th>
                            <th className="px-8 py-4 text-left">
                                Model
                            </th>
                            <th className="px-8 py-4 text-right w-40">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {!modelId ? (
                            <tr>
                                <td
                                    colSpan={3}
                                    className="py-12 text-center text-gray-400"
                                >
                                    Create or edit a grade to select a model
                                </td>
                            </tr>
                        ) : isLoading ? (
                            <tr>
                                <td
                                    colSpan={3}
                                    className="py-12 text-center text-gray-400"
                                >
                                    Loading...
                                </td>
                            </tr>
                        ) : isError ? (
                            <tr>
                                <td
                                    colSpan={3}
                                    className="py-12 text-center text-red-500"
                                >
                                    Failed to load grades
                                </td>
                            </tr>
                        ) : filteredGrades.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={3}
                                    className="py-12 text-center text-gray-400"
                                >
                                    No grades found
                                </td>
                            </tr>
                        ) : (
                            filteredGrades.map((grade) => (
                                <tr
                                    key={grade.id}
                                    className="border-t hover:bg-gray-50"
                                >
                                    <td className="px-8 py-4 font-medium">
                                        {grade.name}
                                    </td>
                                    <td className="px-8 py-4">
                                        {getModelName(grade.modelId)}
                                    </td>
                                    <td className="px-8 py-4">
                                        <div className="flex justify-end gap-4">
                                            <button
                                                onClick={() =>
                                                    openEdit(grade)
                                                }
                                                className="text-indigo-600 hover:underline flex items-center gap-1"
                                            >
                                                <Pencil size={14} />
                                                Edit
                                            </button>
                                            <button
                                                onClick={() =>
                                                    setDeleteTarget(grade)
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
            </div>

            {/* CREATE / EDIT MODAL */}
            {openModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white w-full max-w-md rounded-2xl p-6">
                        <h2 className="text-xl font-semibold mb-4">
                            {selectedGrade ? "Edit Grade" : "Add Grade"}
                        </h2>

                        {error && (
                            <div className="mb-4 text-red-600 text-sm">
                                {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            <select
                                value={modelId}
                                onChange={(e) =>
                                    setModelId(e.target.value)
                                }
                                className="border p-3 rounded-xl w-full"
                            >
                                <option value="">Select Model</option>
                                {models.map((m) => (
                                    <option
                                        key={m.id}
                                        value={m.id}
                                    >
                                        {m.name}
                                    </option>
                                ))}
                            </select>

                            <input
                                autoFocus
                                className="border p-3 rounded-xl w-full"
                                placeholder="Grade name"
                                value={name}
                                onChange={(e) =>
                                    setName(e.target.value)
                                }
                            />
                        </div>

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
                            Delete Grade
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
                                onClick={() =>
                                    setDeleteTarget(null)
                                }
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

export default Grades;
