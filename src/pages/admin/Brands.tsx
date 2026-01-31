import { useState } from "react";
import { Plus, Trash2, Pencil, ChevronRight, ChevronDown } from "lucide-react";

import {
    Brand,
    Model,
    Grade,
    useGetApiBrands,
    useGetApiModelsBrandBrandId,
    useGetApiGradesModelId,
    usePostApiBrands,
    usePutApiBrandsId,
    useDeleteApiBrandsId,
    usePostApiBrandsIdImage,
    useDeleteApiBrandsIdImage,
    usePostApiModels,
    usePutApiModelsId,
    useDeleteApiModelsId,
    usePostApiGrades,
    usePatchApiGradesId,
    useDeleteApiGradesId,
} from "../../services/api";

type ApiError = {
    payload?: {
        error?: string;
    };
};

// --- Models Component ---
const ModelList = ({ brandId }: { brandId: string }) => {
    const { data: models = [], isLoading, refetch } = useGetApiModelsBrandBrandId(brandId);
    const [expandedModelId, setExpandedModelId] = useState<string | null>(null);

    // Modal states
    const [isModelModalOpen, setIsModelModalOpen] = useState(false);
    const [editingModel, setEditingModel] = useState<Model | null>(null);
    const [modelName, setModelName] = useState("");

    const [deleteTarget, setDeleteTarget] = useState<Model | null>(null);
    const [error, setError] = useState<string | null>(null);

    const { mutate: createModel, isPending: creating } = usePostApiModels({
        mutation: {
            onSuccess: () => {
                refetch();
                closeModelModal();
            },
            onError: (err: unknown) => setError((err as ApiError)?.payload?.error ?? "Failed to create model"),
        },
    });

    const { mutate: updateModel, isPending: updating } = usePutApiModelsId({
        mutation: {
            onSuccess: () => {
                refetch();
                closeModelModal();
            },
            onError: (err: unknown) => setError((err as ApiError)?.payload?.error ?? "Failed to update model"),
        },
    });

    const { mutate: deleteModel, isPending: deleting } = useDeleteApiModelsId({
        mutation: {
            onSuccess: () => {
                refetch();
                setDeleteTarget(null);
            },
            onError: (err: unknown) => setError((err as ApiError)?.payload?.error ?? "Failed to delete model"),
        },
    });

    const openCreateModel = () => {
        setEditingModel(null);
        setModelName("");
        setError(null);
        setIsModelModalOpen(true);
    };

    const openEditModel = (model: Model) => {
        setEditingModel(model);
        setModelName(model.name);
        setError(null);
        setIsModelModalOpen(true);
    };

    const closeModelModal = () => {
        setIsModelModalOpen(false);
        setEditingModel(null);
        setModelName("");
        setError(null);
    };

    const handleModelSubmit = () => {
        if (!modelName.trim()) {
            setError("Model name is required");
            return;
        }

        if (editingModel) {
            updateModel({ id: editingModel.id, data: { name: modelName, brandId } });
        } else {
            createModel({ data: { name: modelName, brandId } });
        }
    };

    const toggleExpand = (modelId: string) => {
        setExpandedModelId(expandedModelId === modelId ? null : modelId);
    };

    if (isLoading) return <div className="pl-8 py-2 text-gray-400">Loading models...</div>;

    return (
        <div className="pl-6 py-2">
             <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Models</h4>
                 <button
                    onClick={openCreateModel}
                    className="flex items-center gap-1 text-xs bg-gray-100 px-2 py-1 rounded hover:bg-gray-200"
                >
                    <Plus size={12} /> Add Model
                </button>
            </div>
            
            {models.length === 0 && <div className="text-sm text-gray-400 italic">No models found</div>}

            <div className="space-y-2">
                {models.map((model) => (
                    <div key={model.id} className="border-l-2 border-gray-100 pl-4">
                        <div className="flex items-center justify-between group py-1">
                            <div 
                                className="flex items-center gap-2 cursor-pointer select-none"
                                onClick={() => toggleExpand(model.id)}
                            >
                                {expandedModelId === model.id ? <ChevronDown size={14} className="text-gray-400"/> : <ChevronRight size={14} className="text-gray-400" />}
                                <span className="font-medium text-gray-700 text-sm hover:text-black">{model.name}</span>
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => openEditModel(model)} className="text-gray-400 hover:text-indigo-600">
                                    <Pencil size={12} />
                                </button>
                                <button onClick={() => { setDeleteTarget(model); setError(null); }} className="text-gray-400 hover:text-red-500">
                                    <Trash2 size={12} />
                                </button>
                            </div>
                        </div>

                        {expandedModelId === model.id && (
                             <GradeList modelId={model.id} />
                        )}
                    </div>
                ))}
            </div>

            {/* Model Modal */}
            {isModelModalOpen && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={(e) => e.stopPropagation()}>
                    <div className="bg-white w-full max-w-sm rounded-xl p-6">
                         <h2 className="text-lg font-semibold mb-4">{editingModel ? "Edit Model" : "Add Model"}</h2>
                        {error && <div className="mb-4 text-red-600 text-xs">{error}</div>}
                        <input
                            className="border p-2 rounded-lg w-full text-sm mb-4"
                            placeholder="Model name"
                            value={modelName}
                            onChange={(e) => setModelName(e.target.value)}
                            autoFocus
                        />
                        <div className="flex justify-end gap-3">
                            <button onClick={closeModelModal} className="text-sm text-gray-500 hover:text-gray-700">Cancel</button>
                            <button 
                                onClick={handleModelSubmit} 
                                disabled={creating || updating}
                                className="bg-black text-white px-3 py-1.5 rounded-lg text-sm disabled:opacity-50"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

             {/* Delete Model Confirm */}
             {deleteTarget && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={(e) => e.stopPropagation()}>
                    <div className="bg-white w-full max-w-sm rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-4 text-red-600">
                           <div className="bg-red-100 p-2 rounded-full">
                                <Trash2 size={20} />
                           </div>
                           <h2 className="text-lg font-semibold">{error ? "Delete Failed" : "Delete Model"}</h2>
                        </div>
                        
                        {error ? (
                            <div className="mb-6">
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm font-medium">
                                    {error}
                                </div>
                            </div>
                        ) : (
                            <div className="mb-6">
                                <p className="text-sm text-gray-600 font-medium">
                                    Are you sure you want to delete <span className="font-bold text-gray-900">{deleteTarget.name}</span>?
                                </p>
                            </div>
                        )}
                        
                        <div className="flex justify-end gap-3 pt-2">
                            {error ? (
                                <button 
                                    onClick={() => { setDeleteTarget(null); setError(null); }} 
                                    className="px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors"
                                >
                                    Close
                                </button>
                            ) : (
                                <>
                                    <button 
                                        onClick={() => { setDeleteTarget(null); setError(null); }} 
                                        className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        onClick={() => deleteModel({ id: deleteTarget.id })} 
                                        disabled={deleting}
                                        className="px-4 py-2 rounded-lg text-sm font-medium bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 transition-colors"
                                    >
                                        {deleting ? "Deleting..." : "Delete Model"}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- Grades Component ---
const GradeList = ({ modelId }: { modelId: string }) => {
    const { data: grades = [], isLoading, refetch } = useGetApiGradesModelId(modelId);

    const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
    const [editingGrade, setEditingGrade] = useState<Grade | null>(null);
    const [gradeName, setGradeName] = useState("");
    const [deleteTarget, setDeleteTarget] = useState<Grade | null>(null);
    const [error, setError] = useState<string | null>(null);

    const { mutate: createGrade, isPending: creating } = usePostApiGrades({
        mutation: {
            onSuccess: () => {
                refetch();
                closeGradeModal();
            },
            onError: (err: unknown) => setError((err as ApiError)?.payload?.error ?? "Failed to create grade"),
        },
    });

    const { mutate: updateGrade, isPending: updating } = usePatchApiGradesId({
        mutation: {
            onSuccess: () => {
                refetch();
                closeGradeModal();
            },
            onError: (err: unknown) => setError((err as ApiError)?.payload?.error ?? "Failed to update grade"),
        },
    });

    const { mutate: deleteGrade, isPending: deleting } = useDeleteApiGradesId({
        mutation: { 
            onSuccess: () => { refetch(); setDeleteTarget(null); },
            onError: (err: unknown) => setError((err as ApiError)?.payload?.error ?? "Failed to delete grade"),
        },
    });

    const openCreateGrade = () => {
        setEditingGrade(null);
        setGradeName("");
        setError(null);
        setIsGradeModalOpen(true);
    };

    const openEditGrade = (grade: Grade) => {
        setEditingGrade(grade);
        setGradeName(grade.name);
        setError(null);
        setIsGradeModalOpen(true);
    };

    const closeGradeModal = () => {
        setIsGradeModalOpen(false);
        setEditingGrade(null);
        setGradeName("");
        setError(null);
    };

    const handleGradeSubmit = () => {
        if (!gradeName.trim()) {
            setError("Grade name is required");
            return;
        }
        if (editingGrade) {
            updateGrade({ id: editingGrade.id, data: { name: gradeName } });
        } else {
            createGrade({ data: { name: gradeName, modelId } });
        }
    };

    if (isLoading) return <div className="pl-6 py-1 text-xs text-gray-400">Loading grades...</div>;

    return (
        <div className="pl-6 py-2">
            <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Grades</h4>
                <button
                    onClick={openCreateGrade}
                    className="flex items-center gap-1 text-xs bg-gray-50 px-2 py-1 rounded hover:bg-gray-100 border border-gray-100"
                >
                    <Plus size={10} /> Add Grade
                </button>
            </div>
            
             {grades.length === 0 && <div className="text-xs text-gray-400 italic">No grades found</div>}

            <div className="grid grid-cols-2 gap-2">
                {grades.map((grade) => (
                    <div key={grade.id} className="flex items-center justify-between bg-gray-50 rounded px-3 py-2 group hover:bg-gray-100 transition-colors">
                        <span className="text-xs text-gray-700 font-medium">{grade.name}</span>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => openEditGrade(grade)} className="text-gray-400 hover:text-indigo-600">
                                <Pencil size={10} />
                            </button>
                            <button onClick={() => { setDeleteTarget(grade); setError(null); }} className="text-gray-400 hover:text-red-500">
                                <Trash2 size={10} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

             {/* Grade Modal */}
             {isGradeModalOpen && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={(e) => e.stopPropagation()}>
                    <div className="bg-white w-full max-w-sm rounded-xl p-6">
                        <h2 className="text-lg font-semibold mb-4">{editingGrade ? "Edit Grade" : "Add Grade"}</h2>
                        {error && <div className="mb-4 text-red-600 text-xs">{error}</div>}
                        <input
                            className="border p-2 rounded-lg w-full text-sm mb-4"
                            placeholder="Grade name"
                            value={gradeName}
                            onChange={(e) => setGradeName(e.target.value)}
                            autoFocus
                        />
                        <div className="flex justify-end gap-3">
                            <button onClick={closeGradeModal} className="text-sm text-gray-500 hover:text-gray-700">Cancel</button>
                            <button 
                                onClick={handleGradeSubmit} 
                                disabled={creating || updating}
                                className="bg-black text-white px-3 py-1.5 rounded-lg text-sm disabled:opacity-50"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Grade Confirm */}
            {deleteTarget && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={(e) => e.stopPropagation()}>
                    <div className="bg-white w-full max-w-sm rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-4 text-red-600">
                           <div className="bg-red-100 p-2 rounded-full">
                                <Trash2 size={20} />
                           </div>
                           <h2 className="text-lg font-semibold">{error ? "Delete Failed" : "Delete Grade"}</h2>
                        </div>

                        {error ? (
                            <div className="mb-6">
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm font-medium">
                                    {error}
                                </div>
                            </div>
                        ) : (
                            <div className="mb-6">
                                <p className="text-sm text-gray-600 font-medium">
                                    Are you sure you want to delete <span className="font-bold text-gray-900">{deleteTarget.name}</span>?
                                </p>
                            </div>
                        )}

                        <div className="flex justify-end gap-3 pt-2">
                            {error ? (
                                <button 
                                    onClick={() => { setDeleteTarget(null); setError(null); }} 
                                    className="px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors"
                                >
                                    Close
                                </button>
                            ) : (
                                <>
                                    <button 
                                        onClick={() => { setDeleteTarget(null); setError(null); }} 
                                        className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        onClick={() => deleteGrade({ id: deleteTarget.id })} 
                                        disabled={deleting}
                                        className="px-4 py-2 rounded-lg text-sm font-medium bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 transition-colors"
                                    >
                                        {deleting ? "Deleting..." : "Delete Grade"}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};


const Brands = () => {
    /* ================= STATE ================= */
    const [openModal, setOpenModal] = useState(false);
    const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Brand | null>(null);
    const [expandedBrandId, setExpandedBrandId] = useState<string | null>(null);

    const [name, setName] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);

    const [search, setSearch] = useState("");

    // Using refetch to ensure fresh data
    const { data: brandData, isLoading, isError, refetch } = useGetApiBrands({
        page: 1, // Fetching all (or large enough page to effectively get all for now, assuming not huge # of brands)
        limit: 1000, 
    });

    const brands = brandData?.items ?? [];

    // Filter brands locally
    const filteredBrands = brands.filter((b) =>
        b.name.toLowerCase().includes(search.toLowerCase())
    );

    /* ================= MUTATIONS ================= */
    const { mutate: createBrand, isPending: creating } = usePostApiBrands({
        mutation: {
            onSuccess: () => {
                refetch();
                closeModal();
            },
            onError: (err: unknown) => {
                setError((err as ApiError)?.payload?.error ?? "Failed to create brand");
            },
        },
    });

    const { mutate: updateBrand, isPending: updating } = usePutApiBrandsId({
        mutation: {
            onSuccess: (updated) => {
                const id = selectedBrand?.id ?? updated?.id;
                if (id && imageFile) {
                    uploadBrandImage({ id, data: { image: imageFile } });
                } else {
                    refetch();
                    closeModal();
                }
            },
            onError: (err: unknown) => {
                setError((err as ApiError)?.payload?.error ?? "Failed to update brand");
            },
        },
    });

    const { mutate: deleteBrand, isPending: deleting } = useDeleteApiBrandsId({
        mutation: {
            onError: (err: unknown) => {
                setError((err as ApiError)?.payload?.error ?? "Failed to delete brand");
            },
            onSuccess: () => {
                refetch();
                setDeleteTarget(null);
            },
        },
    });

    const { mutate: uploadBrandImage } = usePostApiBrandsIdImage({
        mutation: {
            onSuccess: () => {
                refetch();
                closeModal();
                setImageFile(null);
            },
            onError: (err: unknown) => {
                setError((err as ApiError)?.payload?.error ?? "Failed to upload image");
            },
        },
    });

    const { mutate: removeBrandImage } = useDeleteApiBrandsIdImage({
        mutation: {
            onSuccess: () => {
                refetch();
                closeModal();
            },
            onError: () => {
                setError("Failed to remove image");
            },
        },
    });

    /* ================= HELPERS ================= */
    const closeModal = () => {
        setOpenModal(false);
        setSelectedBrand(null);
        setName("");
        setError(null);
        setImageFile(null);
    };

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
            updateBrand({ id: selectedBrand.id, data: { name } });
        } else {
            createBrand({ data: { name } });
        }
    };

    const confirmDelete = () => {
        if (!deleteTarget) return;
        deleteBrand({ id: deleteTarget.id });
    };

    const toggleExpand = (brandId: string) => {
        setExpandedBrandId(expandedBrandId === brandId ? null : brandId);
    };

    /* ================= UI ================= */
    return (
        <div className="bg-[#F8F9FB] p-8 h-full overflow-y-auto">
            {/* HEADER */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">
                    Brands, Models & Grades
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
                        <Plus size={16} /> Add Brand
                    </button>
                </div>
            </div>

            {/* LIST */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
                 {isLoading ? (
                    <div className="py-12 text-center text-gray-400">Loading brands...</div>
                ) : isError ? (
                    <div className="py-12 text-center text-red-500">Failed to load data</div>
                ) : filteredBrands.length === 0 ? (
                    <div className="py-12 text-center text-gray-400">No brands found</div>
                ) : (
                    <div className="space-y-4">
                        {filteredBrands.map((brand) => (
                            <div key={brand.id} className="border border-gray-100 rounded-xl overflow-hidden bg-white">
                                <div className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
                                    <div 
                                        className="flex items-center gap-3 cursor-pointer select-none flex-1"
                                        onClick={() => toggleExpand(brand.id)}
                                    >
                                        {expandedBrandId === brand.id ? <ChevronDown size={20} className="text-gray-500" /> : <ChevronRight size={20} className="text-gray-500" />}
                                        {(brand as unknown as { imageUrl?: string | null }).imageUrl ? (
                                            <img
                                                src={(brand as unknown as { imageUrl?: string | null }).imageUrl as string}
                                                alt={brand.name}
                                                className="w-10 h-6 object-cover rounded border"
                                            />
                                        ) : (
                                            <span className="w-10 h-6 rounded border bg-gray-100 flex items-center justify-center text-[10px] text-gray-400">—</span>
                                        )}
                                        <span className="font-semibold text-gray-900 text-lg">{brand.name}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button 
                                            onClick={() => openEdit(brand)} 
                                            className="p-2 text-gray-500 hover:text-indigo-600 rounded-full hover:bg-white transition-colors"
                                            title="Edit Brand"
                                        >
                                            <Pencil size={18} />
                                        </button>
                                        <button 
                                            onClick={() => { setDeleteTarget(brand); setError(null); }} 
                                            className="p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-white transition-colors"
                                            title="Delete Brand"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>

                                {expandedBrandId === brand.id && (
                                    <div className="border-t border-gray-100">
                                         <ModelList brandId={brand.id} />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* BRAND MODAL */}
            {openModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white w-full max-w-md rounded-2xl p-6">
                        <h2 className="text-xl font-semibold mb-4">{selectedBrand ? "Edit Brand" : "Add Brand"}</h2>
                        {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}
                        <input
                            className="border p-3 rounded-xl w-full mb-6"
                            placeholder="Brand name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            autoFocus
                        />
                        {selectedBrand && (
                            <div className="mt-4">
                                <label className="block text-sm text-gray-600 mb-2">Replace image (optional)</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                                    className="border p-3 rounded-xl w-full"
                                />
                                {(selectedBrand as unknown as { imageUrl?: string | null }).imageUrl && (
                                    <div className="mt-2">
                                        <span className="block text-xs text-gray-500 mb-1">Current image</span>
                                        <img
                                            src={(selectedBrand as unknown as { imageUrl?: string | null }).imageUrl as string}
                                            alt={selectedBrand.name}
                                            className="w-full h-32 object-cover rounded-md border"
                                        />
                                        <button
                                            onClick={() => removeBrandImage({ id: selectedBrand.id })}
                                            className="mt-2 text-xs text-red-600 hover:underline"
                                        >
                                            Remove image
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="flex justify-end gap-4 mt-6">
                            <button onClick={closeModal} className="border px-4 py-2 rounded-xl">Cancel</button>
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

             {/* BRAND DELETE CONFIRM */}
             {deleteTarget && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white w-full max-w-md rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-4 text-red-600">
                           <div className="bg-red-100 p-2 rounded-full">
                                <Trash2 size={24} />
                           </div>
                           <h2 className="text-xl font-semibold">{error ? "Delete Failed" : "Delete Brand"}</h2>
                        </div>
                        
                        {error ? (
                            <div className="mb-6">
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">
                                    {error}
                                </div>
                            </div>
                        ) : (
                            <div className="mb-8">
                                <p className="text-gray-600 text-lg">
                                    Are you sure you want to delete <span className="font-bold text-gray-900">{deleteTarget.name}</span>?
                                </p>
                            </div>
                        )}

                        <div className="flex justify-end gap-3">
                            {error ? (
                                <button 
                                    onClick={() => { setDeleteTarget(null); setError(null); }} 
                                    className="px-5 py-2.5 rounded-xl bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors"
                                >
                                    Close
                                </button>
                            ) : (
                                <>
                                    <button 
                                        onClick={() => { setDeleteTarget(null); setError(null); }} 
                                        className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        onClick={confirmDelete} 
                                        disabled={deleting} 
                                        className="px-5 py-2.5 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 disabled:opacity-50 shadow-lg shadow-red-200 transition-all"
                                    >
                                        {deleting ? "Deleting..." : "Yes, Delete Brand"}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Brands;
