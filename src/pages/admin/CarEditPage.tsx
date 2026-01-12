import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Select, { Option } from "../../components/Select";

import {
    Fuel,
    Transmission,
    Status,
    Steering,
    CarUpdate,
    useGetApiCarsId,
    usePatchApiCarsId,
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

const CarEditPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    /* ===================== QUERIES ===================== */
    const { data: car, isLoading } = useGetApiCarsId(id!);
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
    const [form, setForm] = useState<CarForm | null>(null);

    useEffect(() => {
        if (!car) return;

        setForm({
            modelId: car.modelId,
            modelYear: car.modelYear,
            price: car.price,
            mileage: car.mileage,
            enginePower: car.enginePower ?? null,
            fuel: car.fuel,
            transmission: car.transmission,
            steering: car.steering ?? Steering.Left,
            status: car.status,
            colorId: car.colorId,
            showroomId: car.showroomId ?? undefined,
            buildTypeId: car.buildTypeId ?? undefined,
            gradeId: car.gradeId ?? undefined,
            isNewArrival: car.isNewArrival ?? false,
        });
    }, [car]);

    /* ===================== MUTATION ===================== */
    const { mutate, isPending } = usePatchApiCarsId({
        mutation: {
            onSuccess: () => navigate("/admin/cars"),
        },
    });

    if (isLoading || !form) {
        return <div className="p-8">Loading...</div>;
    }

    const handleSave = () => {
        mutate({ id: id!, data: form as CarUpdate });
    };

    /* ===================== RENDER ===================== */
    return (
        <div className="p-8 max-w-6xl mx-auto">
            <div className="bg-white rounded-2xl shadow-sm p-8">
                <h1 className="text-2xl font-semibold mb-8">Edit Car</h1>

                {/* ===== BASIC INFORMATION ===== */}
                <section className="mb-10">
                    <h2 className="text-lg font-medium mb-4">Basic Information</h2>

                    <div className="grid grid-cols-2 gap-6">
                        <Select
                            value={form.modelId}
                            options={modelOptions}
                            placeholder="Select model"
                            onChange={(v) =>
                                setForm({ ...form, modelId: v ?? "" })
                            }
                        />

                        <Select
                            value={form.colorId}
                            options={colorOptions}
                            placeholder="Select color"
                            onChange={(v) =>
                                setForm({ ...form, colorId: v ?? "" })
                            }
                        />

                        <Select
                            value={form.showroomId ?? ""}
                            options={showroomOptions}
                            placeholder="Showroom"
                            onChange={(v) =>
                                setForm({ ...form, showroomId: v || undefined })
                            }
                        />

                        <Select
                            value={form.buildTypeId ?? ""}
                            options={buildTypeOptions}
                            placeholder="Build Type"
                            onChange={(v) =>
                                setForm({ ...form, buildTypeId: v || undefined })
                            }
                        />

                        <Select
                            value={form.gradeId ?? ""}
                            options={gradeOptions}
                            placeholder="Grade"
                            onChange={(v) =>
                                setForm({ ...form, gradeId: v || undefined })
                            }
                        />
                    </div>
                </section>

                {/* ===== SPECIFICATIONS ===== */}
                <section className="mb-10">
                    <h2 className="text-lg font-medium mb-4">Specifications</h2>

                    <div className="grid grid-cols-4 gap-6">
                        <Input
                            label="Model Year"
                            value={form.modelYear}
                            onChange={(v) =>
                                setForm({ ...form, modelYear: Number(v) })
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
                </section>

                {/* ===== STATUS ===== */}
                <section className="mb-10">
                    <h2 className="text-lg font-medium mb-4">Status</h2>

                    <div className="grid grid-cols-4 gap-6">
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

                    <label className="flex items-center gap-2 mt-4">
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
                </section>

                {/* ===== ACTIONS ===== */}
                <div className="flex justify-end gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="px-6 py-2 rounded-xl border"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isPending}
                        className="px-6 py-2 rounded-xl bg-black text-white"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CarEditPage;

/* ===================== INPUT ===================== */
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
            className="border p-3 rounded-xl w-full"
        />
    </div>
);
