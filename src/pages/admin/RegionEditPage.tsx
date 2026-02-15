import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

import {
    RegionUpdate,
    useGetApiRegions,
    usePatchApiRegionsId,
    useDeleteApiRegionsId,
    getGetApiRegionsQueryKey,
} from "../../services/api";

const RegionEditPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: regions = [], isLoading } = useGetApiRegions();
    const region = regions.find((r) => r.id === id);

    const [form, setForm] = useState({ name: "", code: "" });
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (region) {
            setForm({ name: region.name, code: region.code });
        }
    }, [region]);

    const { mutateAsync: updateRegion, isPending: isUpdating } = usePatchApiRegionsId({
        mutation: {
            onError: (err: unknown) => {
                const msg = (err as { payload?: { error?: string } })?.payload?.error ?? "Failed to update region";
                setError(msg);
            },
        },
    });

    const { mutateAsync: deleteRegion, isPending: isDeleting } = useDeleteApiRegionsId({
        mutation: {
            onError: (err: unknown) => {
                const payload = (err as { payload?: { error?: string } })?.payload;
                const detail = payload?.error?.trim();
                setError(detail ? `Failed to delete.\n${detail}` : "Failed to delete.");
            },
        },
    });

    if (isLoading) return <div className="p-8">Loading...</div>;
    if (!region) return <div className="p-8">Region not found</div>;

    const handleSave = async () => {
        const name = form.name.trim();
        const code = form.code.trim();
        if (!name || !code) {
            setError("Name and code are required");
            return;
        }
        setError(null);
        try {
            const payload: RegionUpdate = { name, code };
            await updateRegion({ id: id!, data: payload });
            await queryClient.invalidateQueries({ queryKey: getGetApiRegionsQueryKey() });
            navigate("/admin/regions");
        } catch {
            // error set in mutation onError
        }
    };

    const handleDelete = async () => {
        if (!window.confirm(`Delete region "${region.name}" (${region.code})? This will fail if any car license uses it.`)) return;
        setError(null);
        try {
            await deleteRegion({ id: id! });
            await queryClient.invalidateQueries({ queryKey: getGetApiRegionsQueryKey() });
            navigate("/admin/regions");
        } catch {
            // error set in mutation onError
        }
    };

    return (
        <div className="bg-[#F8F9FB] h-full overflow-y-auto w-full">
            <div className="max-w-2xl mx-auto p-4 md:p-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-xl md:text-2xl font-semibold text-gray-900">Edit Region</h1>
                </div>

                <div className="bg-white rounded-2xl shadow-sm p-4 md:p-8">
                    {error && (
                        <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-700 text-sm whitespace-pre-line">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 gap-4 md:gap-6">
                        <div>
                            <label className="block text-sm mb-1">Name <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                value={form.name}
                                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                                className="w-full rounded-xl border border-gray-300 px-4 py-3"
                                placeholder="e.g. Yangon"
                            />
                        </div>
                        <div>
                            <label className="block text-sm mb-1">Code <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                value={form.code}
                                onChange={(e) => setForm((f) => ({ ...f, code: e.target.value.toUpperCase() }))}
                                className="w-full rounded-xl border border-gray-300 px-4 py-3"
                                placeholder="e.g. 01 or YGN"
                            />
                        </div>
                    </div>

                    <div className="flex justify-between mt-10">
                        <div>
                            <button
                                type="button"
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="px-4 py-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-50"
                            >
                                Delete
                            </button>
                        </div>
                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={() => navigate("/admin/regions")}
                                className="px-6 py-2 rounded-xl border"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleSave}
                                disabled={isUpdating}
                                className="px-8 py-2 rounded-xl bg-black text-white disabled:opacity-50"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegionEditPage;
