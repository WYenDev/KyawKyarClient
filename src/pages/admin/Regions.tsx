import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Pencil } from "lucide-react";

import {
    Region,
    RegionCreate,
    useGetApiRegions,
    usePostApiRegions,
    getGetApiRegionsQueryKey,
} from "../../services/api";
import { useQueryClient } from "@tanstack/react-query";

type ApiError = { payload?: { error?: string } };

const Regions = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [name, setName] = useState("");
    const [code, setCode] = useState("");
    const [error, setError] = useState<string | null>(null);

    const { data: regions = [], isLoading, isError } = useGetApiRegions();

    const { mutate: createRegion, isPending: creating } = usePostApiRegions({
        mutation: {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: getGetApiRegionsQueryKey() });
                closeCreateModal();
            },
            onError: (err: unknown) => {
                setError((err as ApiError)?.payload?.error ?? "Failed to create region");
            },
        },
    });

    const closeCreateModal = () => {
        setCreateModalOpen(false);
        setName("");
        setCode("");
        setError(null);
    };

    const handleCreate = () => {
        const n = name.trim();
        const c = code.trim();
        if (!n || !c) {
            setError("Name and code are required");
            return;
        }
        setError(null);
        createRegion({
            data: { name: n, code: c.toUpperCase() } as RegionCreate,
        });
    };

    return (
        <div className="bg-[#F8F9FB] px-4 py-6 md:p-8 h-full overflow-y-auto">
            <div className="flex items-center justify-between gap-3 flex-nowrap mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">Regions</h1>
                <button
                    onClick={() => setCreateModalOpen(true)}
                    className="flex items-center justify-center gap-2 bg-black text-white rounded-xl px-4 py-2 hover:bg-gray-800 shrink-0"
                >
                    <Plus size={18} />
                    Add Region
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-600">
                        <tr>
                            <th className="px-8 py-4 text-left">Name</th>
                            <th className="px-8 py-4 text-left">Code</th>
                            <th className="px-8 py-4 text-right w-28">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan={3} className="py-12 text-center text-gray-400">
                                    Loading...
                                </td>
                            </tr>
                        ) : isError ? (
                            <tr>
                                <td colSpan={3} className="py-12 text-center text-red-500">
                                    Failed to load regions
                                </td>
                            </tr>
                        ) : regions.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="py-12 text-center text-gray-400">
                                    No regions yet. Add one to get started.
                                </td>
                            </tr>
                        ) : (
                            regions.map((region: Region) => (
                                <tr key={region.id} className="border-t hover:bg-gray-50">
                                    <td className="px-8 py-4 font-medium text-gray-900">{region.name}</td>
                                    <td className="px-8 py-4 text-gray-600">{region.code}</td>
                                    <td className="px-8 py-4 text-right">
                                        <button
                                            onClick={() => navigate(`/admin/regions/${region.id}/edit`)}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border hover:bg-gray-100"
                                        >
                                            <Pencil size={14} />
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {createModalOpen && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white w-full max-w-md rounded-2xl p-6">
                        <h2 className="text-xl font-semibold mb-4">Add Region</h2>
                        {error && (
                            <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-700 text-sm">{error}</div>
                        )}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="border border-gray-300 p-3 rounded-xl w-full"
                                    placeholder="e.g. Yangon"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Code</label>
                                <input
                                    type="text"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                                    className="border border-gray-300 p-3 rounded-xl w-full"
                                    placeholder="e.g. 01 or YGN"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-4 mt-6">
                            <button onClick={closeCreateModal} className="border px-4 py-2 rounded-xl">
                                Cancel
                            </button>
                            <button
                                onClick={handleCreate}
                                disabled={creating}
                                className="bg-black text-white px-4 py-2 rounded-xl disabled:opacity-50"
                            >
                                Create
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Regions;
