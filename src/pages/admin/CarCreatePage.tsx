import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import Select, { Option } from "../../components/Select";

import {
    Fuel,
    Transmission,
    Status,
    Steering,
    CarCreate,
    usePostApiCars,
    useGetApiModels,
    useGetApiCarsFilters,
} from "../../services/api";

/* ===================== FORM TYPE ===================== */
type CarForm = {
    modelId: string;
    modelYear: number;
    price: number;
    mileage: number;
    enginePower?: number | null;
    fuel: Fuel;
    transmission: Transmission;
    steering?: Steering;
    status: Status;
    colorId: string;
    showroomId?: string;
    buildTypeId?: string;
    gradeId?: string;
    isNewArrival?: boolean;
};

/* ===================== SELECT OPTIONS ===================== */
const fuelOptions: Option<Fuel>[] = [
    { label: "Petrol", value: Fuel.Petrol },
    { label: "Diesel", value: Fuel.Diesel },
    { label: "Electric", value: Fuel.Electric },
    { label: "Hybrid", value: Fuel.Hybrid },
];

const transmissionOptions: Option<Transmission>[] = [
    { label: "Manual", value: Transmission.Manual },
    { label: "Automatic", value: Transmission.Automatic },
    { label: "CVT", value: Transmission.CVT },
];

const steeringOptions: Option<Steering>[] = [
    { label: "Left", value: Steering.Left },
    { label: "Right", value: Steering.Right },
];

const statusOptions: Option<Status>[] = [
    { label: "Available", value: Status.Available },
    { label: "Sold", value: Status.Sold },
];

const CarCreatePage = () => {
    const navigate = useNavigate();

    /* ===================== QUERIES ===================== */
    const { data: modelData } = useGetApiModels({ page: 1, limit: 100 });
    const { data: filterData } = useGetApiCarsFilters();

    /* ===================== OPTIONS ===================== */
    const modelOptions: Option<string>[] = useMemo(
        () =>
            modelData?.models?.map((m) => ({
                label: `${m.brand?.name ?? ""} ${m.name}`,
                value: m.id,
            })) ?? [],
        [modelData]
    );

    const colorOptions: Option<string>[] = useMemo(
        () =>
            filterData?.colors?.map((c) => ({
                label: c.name,
                value: c.id,
            })) ?? [],
        [filterData]
    );

    const showroomOptions: Option<string>[] = useMemo(
        () => [
            { label: "No Showroom", value: "" },
            ...(filterData?.showrooms?.map((s) => ({
                label: `${s.city} - ${s.addressEn}`,
                value: s.id,
            })) ?? []),
        ],
        [filterData]
    );

    const buildTypeOptions: Option<string>[] = useMemo(
        () =>
            filterData?.buildTypes?.map((b) => ({
                label: b.name,
                value: b.id,
            })) ?? [],
        [filterData]
    );

    const gradeOptions: Option<string>[] = useMemo(() => {
        const grades = (filterData as any)?.grades as
            | { id: string; name: string }[]
            | undefined;

        return (
            grades?.map((g) => ({
                label: g.name,
                value: g.id,
            })) ?? []
        );
    }, [filterData]);

    /* ===================== FORM STATE ===================== */
    const [form, setForm] = useState<CarForm>({
        modelId: "",
        modelYear: new Date().getFullYear(),
        price: 0,
        mileage: 0,
        enginePower: null,
        fuel: Fuel.Petrol,
        transmission: Transmission.Manual,
        steering: Steering.Left,
        status: Status.Available,
        colorId: "",
        showroomId: undefined,
        buildTypeId: undefined,
        gradeId: undefined,
        isNewArrival: false,
    });

    /* ===================== MUTATION ===================== */
    const { mutate, isPending } = usePostApiCars({
        mutation: {
            onSuccess: () => navigate("/admin/cars"),
        },
    });

    const handleSave = () => {
        if (!form.modelId || !form.colorId) return;
        mutate({ data: form as CarCreate });
    };

    /* ===================== RENDER ===================== */
    return (
        <div className="bg-[#F8F9FB] min-h-screen p-8">
            <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-sm p-8">
                <h1 className="text-2xl font-semibold mb-8">Create Car</h1>

                {/* ===== BASIC INFO ===== */}
                <Section title="Basic Information">
                    <div className="grid grid-cols-2 gap-6">
                        <Field label="Model">
                            <Select
                                value={form.modelId}
                                options={modelOptions}
                                placeholder="Select model"
                                onChange={(v) =>
                                    setForm({ ...form, modelId: v ?? "" })
                                }
                            />
                        </Field>

                        <Field label="Color">
                            <Select
                                value={form.colorId}
                                options={colorOptions}
                                placeholder="Select color"
                                onChange={(v) =>
                                    setForm({ ...form, colorId: v ?? "" })
                                }
                            />
                        </Field>

                        <Field label="Showroom">
                            <Select
                                value={form.showroomId ?? ""}
                                options={showroomOptions}
                                placeholder="No Showroom"
                                onChange={(v) =>
                                    setForm({
                                        ...form,
                                        showroomId: v || undefined,
                                    })
                                }
                            />
                        </Field>

                        <Field label="Build Type">
                            <Select
                                value={form.buildTypeId ?? ""}
                                options={buildTypeOptions}
                                placeholder="Build Type"
                                onChange={(v) =>
                                    setForm({
                                        ...form,
                                        buildTypeId: v || undefined,
                                    })
                                }
                            />
                        </Field>

                        <Field label="Grade">
                            <Select
                                value={form.gradeId ?? ""}
                                options={gradeOptions}
                                placeholder="Grade"
                                onChange={(v) =>
                                    setForm({
                                        ...form,
                                        gradeId: v || undefined,
                                    })
                                }
                            />
                        </Field>
                    </div>
                </Section>

                {/* ===== SPECIFICATIONS ===== */}
                <Section title="Specifications">
                    <div className="grid grid-cols-4 gap-6">
                        <Input
                            label="Model Year"
                            value={form.modelYear}
                            onChange={(v) =>
                                setForm({
                                    ...form,
                                    modelYear: Number(v),
                                })
                            }
                        />
                        <Input
                            label="Price"
                            value={form.price}
                            onChange={(v) =>
                                setForm({ ...form, price: Number(v) })
                            }
                        />
                        <Input
                            label="Mileage"
                            value={form.mileage}
                            onChange={(v) =>
                                setForm({ ...form, mileage: Number(v) })
                            }
                        />
                        <Input
                            label="Engine Power"
                            value={form.enginePower ?? ""}
                            onChange={(v) =>
                                setForm({
                                    ...form,
                                    enginePower: v ? Number(v) : null,
                                })
                            }
                        />
                    </div>
                </Section>

                {/* ===== STATUS ===== */}
                <Section title="Status">
                    <div className="grid grid-cols-4 gap-6 items-end">
                        <Select
                            value={form.fuel}
                            options={fuelOptions}
                            placeholder="Fuel"
                            onChange={(v) =>
                                setForm({ ...form, fuel: v })
                            }
                        />

                        <Select
                            value={form.transmission}
                            options={transmissionOptions}
                            placeholder="Transmission"
                            onChange={(v) =>
                                setForm({ ...form, transmission: v })
                            }
                        />

                        <Select
                            value={form.steering ?? Steering.Left}
                            options={steeringOptions}
                            placeholder="Steering"
                            onChange={(v) =>
                                setForm({ ...form, steering: v })
                            }
                        />

                        <Select
                            value={form.status}
                            options={statusOptions}
                            placeholder="Status"
                            onChange={(v) =>
                                setForm({ ...form, status: v })
                            }
                        />
                    </div>

                    <div className="mt-6">
                        <label className="flex items-center gap-2 text-sm">
                            <input
                                type="checkbox"
                                checked={!!form.isNewArrival}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        isNewArrival: e.target.checked,
                                    })
                                }
                            />
                            New Arrival
                        </label>
                    </div>
                </Section>

                {/* ===== ACTIONS ===== */}
                <div className="flex justify-end gap-4 mt-10">
                    <button
                        onClick={() => navigate(-1)}
                        className="px-6 py-2 rounded-xl border"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isPending}
                        className="px-8 py-2 rounded-xl bg-black text-white"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CarCreatePage;

/* ===================== UI HELPERS ===================== */

const Section = ({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) => (
    <div className="mb-10">
        <h2 className="text-lg font-medium mb-4">{title}</h2>
        {children}
    </div>
);

const Field = ({
    label,
    children,
}: {
    label: string;
    children: React.ReactNode;
}) => (
    <div>
        <label className="block text-sm mb-1">{label}</label>
        {children}
    </div>
);

const Input = ({
    label,
    value,
    onChange,
}: {
    label: string;
    value: string | number;
    onChange: (v: string) => void;
}) => (
    <div>
        <label className="block text-sm mb-1">{label}</label>
        <input
            type="number"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full rounded-xl border px-4 py-3"
        />
    </div>
);
