import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

import {
    Showroom,
    ShowroomUpdate,
    ShowroomPhone,
    useGetApiShowrooms,
    usePutApiShowroomsId,
    usePostApiShowroomsShowroomIdPhones,
    usePutApiShowroomsShowroomIdPhonesPhoneId,
    useDeleteApiShowroomsShowroomIdPhonesPhoneId,
    getGetApiShowroomsQueryKey,
} from "../../services/api";


const ShowroomEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const queryClient = useQueryClient();
    const { data: showroomsData, isLoading } = useGetApiShowrooms({ page: 1, limit: 1000 });
    const showrooms = showroomsData?.items ?? [];

    const showroom = showrooms.find((s) => s.id === id) as Showroom | undefined;

    const [form, setForm] = useState({ name: "", addressEn: "", addressMm: "", city: "", googleMapUrl: "", phones: [] as { id?: string; showroomId?: string; phone: string }[] });
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (showroom) {
            setForm({
                name: showroom.name ?? "",
                addressEn: showroom.addressEn,
                addressMm: showroom.addressMm,
                city: showroom.city,
                googleMapUrl: showroom.googleMapUrl ?? "",
                phones: showroom.phones?.map((p) => ({ id: p.id, showroomId: p.showroomId, phone: p.phone })) ?? [],
            });
        }
    }, [showroom]);

    const { mutate: updateShowroom } = usePutApiShowroomsId({});
    const { mutate: addPhone } = usePostApiShowroomsShowroomIdPhones({});
    const { mutate: updatePhone } = usePutApiShowroomsShowroomIdPhonesPhoneId({});
    const { mutate: deletePhone } = useDeleteApiShowroomsShowroomIdPhonesPhoneId({});

    if (isLoading) return <div className="p-8">Loading...</div>;
    if (!showroom) return <div className="p-8">Showroom not found</div>;

    const handleSave = () => {
        // If only phones are edited, allow saving without requiring address/city
        const basicChanged = (
            (form.name ?? "") !== (showroom.name ?? "") ||
            (form.addressEn ?? "") !== (showroom.addressEn ?? "") ||
            (form.addressMm ?? "") !== (showroom.addressMm ?? "") ||
            (form.city ?? "") !== (showroom.city ?? "") ||
            (form.googleMapUrl ?? "") !== (showroom.googleMapUrl ?? "")
        );

        if (basicChanged) {
            if (!form.addressEn.trim() || !form.city.trim()) {
                setError("Address (EN) and City are required");
                return;
            }

            const payload: ShowroomUpdate = {
                name: (form.name ?? "").trim() || undefined,
                addressEn: form.addressEn,
                addressMm: form.addressMm,
                city: form.city,
                googleMapUrl: form.googleMapUrl,
            };

            // Update showroom only when basic fields changed
            updateShowroom({ id: showroom.id, data: payload });
        }

        // Sync phones: update existing, add new, delete removed
        const orig = showroom.phones ?? [];
        const origById = new Map(orig.map((p) => [p.id, p.phone]));

        form.phones.forEach((p) => {
            if (p.id) {
                if (origById.get(p.id) !== p.phone) {
                    updatePhone({ showroomId: showroom.id, phoneId: p.id, data: { phone: p.phone } });
                }
            } else {
                addPhone({ showroomId: showroom.id, data: { phone: p.phone } as unknown as ShowroomPhone });
            }
        });

        const currIds = new Set(form.phones.filter((p) => p.id).map((p) => p.id));
        orig.forEach((p) => {
            if (!currIds.has(p.id)) {
                deletePhone({ showroomId: showroom.id, phoneId: p.id });
            }
        });

        // Revalidate all showrooms queries (any page) so list is fresh
        queryClient.invalidateQueries({ queryKey: getGetApiShowroomsQueryKey(), exact: false });
        navigate("/admin/showrooms");
    };

    return (
        <div className="bg-[#F8F9FB] h-full overflow-y-auto w-full">
            <div className="max-w-5xl mx-auto p-4 md:p-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-xl md:text-2xl font-semibold text-gray-900">Edit Showroom</h1>
                </div>

                <div className="bg-white rounded-2xl shadow-sm p-4 md:p-8">
                    {error && (
                        <div className="mb-4 text-red-600 text-sm">{error}</div>
                    )}

                    {/* ===== BASIC INFO ===== */}
                    <div className="grid grid-cols-1 gap-4 md:gap-6">
                        <div>
                            <label className="block text-sm mb-1">Name (optional)</label>
                            <input className="border p-3 rounded-xl w-full" placeholder="Showroom name" value={form.name ?? ""} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-sm mb-1">Address (English)</label>
                            <textarea className="border p-3 rounded-xl w-full" value={form.addressEn} onChange={(e) => setForm({ ...form, addressEn: e.target.value })} rows={3} />
                        </div>
                        <div>
                            <label className="block text-sm mb-1">လိပ်စာ (မြန်မာ)</label>
                            <textarea className="border p-3 rounded-xl w-full" value={form.addressMm} onChange={(e) => setForm({ ...form, addressMm: e.target.value })} rows={3} />
                        </div>
                        <div>
                            <label className="block text-sm mb-1">City</label>
                            <input className="border p-3 rounded-xl w-full" placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
                        </div>
                        <div>
                            <label className="block text-sm mb-1">Google Maps Link</label>
                            <input className="border p-3 rounded-xl w-full" placeholder="Paste Google Maps share link" value={form.googleMapUrl ?? ""} onChange={(e) => setForm({ ...form, googleMapUrl: e.target.value })} />
                        </div>
                    </div>

                    {/* ===== PHONES ===== */}
                    <div className="mt-8">
                        <h2 className="text-lg font-medium mb-1">Phones</h2>
                        <p className="text-xs text-slate-500 mb-3">Manage phone numbers separately. Saving without basic changes will only update phones.</p>
                        <div className="space-y-2">
                            {form.phones.map((p, i) => (
                                <div key={p.id ?? `new-${i}`} className="grid grid-cols-[1fr_auto] gap-3 items-center">
                                    <input
                                        value={p.phone}
                                        placeholder="Phone number"
                                        onChange={(e) => setForm((f) => ({ ...f, phones: f.phones.map((ph, idx) => idx === i ? { ...ph, phone: e.target.value } : ph) }))}
                                        className="border p-3 rounded-xl w-full"
                                    />
                                    <button onClick={() => setForm((f) => ({ ...f, phones: f.phones.filter((_, idx) => idx !== i) }))} className="w-8 h-8 flex items-center justify-center rounded-full bg-red-50 hover:bg-red-100">
                                        <Trash2 size={14} className="text-red-600" />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="mt-3">
                            <AddPhoneInput setForm={setForm} />
                        </div>
                    </div>

                    {/* ===== ACTIONS ===== */}
                    <div className="flex justify-end gap-4 mt-10">
                        <button onClick={() => navigate(-1)} className="px-6 py-2 rounded-xl border">Cancel</button>
                        <button onClick={handleSave} className="px-8 py-2 rounded-xl bg-black text-white">Save</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const AddPhoneInput = ({ setForm }: any) => {
    const [phone, setPhone] = useState("");
    return (
        <div className="grid grid-cols-[1fr_auto] gap-3 items-center">
            <input value={phone} onChange={(e) => setPhone(e.target.value)} className="border p-3 rounded-xl w-full" placeholder="Phone number" />
            <button
                onClick={() => {
                    if (!phone.trim()) return;
                    setForm((f: any) => ({ ...f, phones: [...(f.phones ?? []), { phone }] }));
                    setPhone("");
                }}
                className="bg-black text-white px-4 py-2 rounded-xl"
            >
                Add
            </button>
        </div>
    );
};

export default ShowroomEdit;
