import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Select, { Option } from "../../components/Select";


import {
    Fuel,
    Transmission,
    Status,
    CarUpdate,
    SteeringPosition,
    useGetApiCarsId,
    usePatchApiCarsId,
    useGetApiModels,
    useGetApiCarsFilters,
    useGetApiGradesModelId,
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
    steering?: SteeringPosition;
    status: Status;
    colorId: string;
    showroomId?: string;
    buildTypeId?: string;
    gradeId?: string;
    isNewArrival?: boolean;
};

/* ===================== STATIC OPTIONS ===================== */
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

const steeringOptions: Option<SteeringPosition>[] = [
    { label: "Left", value: SteeringPosition.Left },
    { label: "Right", value: SteeringPosition.Right },
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

    /* ===================== FORM STATE ===================== */
    const [form, setForm] = useState<CarForm | null>(null);

    /* ===================== INIT FORM ===================== */
    useEffect(() => {
        if (!car) return;

        setForm({
            modelId: car.modelId,
            modelYear: car.modelYear,
            price: car.price,
            mileage: car.mileage,
            enginePower: car.engineSize ?? null,
            fuel: car.fuel,
            transmission: car.transmission,
            steering: car.steering || SteeringPosition.Left,
            status: car.status,
            colorId: car.colorId,
            showroomId: car.showroomId ?? undefined,
            buildTypeId: car.buildTypeId ?? undefined,
            gradeId: car.gradeId ?? undefined,
            isNewArrival: car.isNewArrival ?? false,
        });
    }, [car]);

    /* ===================== MODEL OPTIONS ===================== */
    const modelOptions: Option<string>[] = useMemo(
        () =>
            modelData?.models?.map((m) => ({
                label: `${m.brand?.name ?? ""} ${m.name}`,
                value: m.id,
            })) ?? [],
        [modelData]
    );

    /* ===================== FILTER OPTIONS ===================== */
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

    /* ===================== GRADES (MODEL DEPENDENT ⭐) ===================== */
    const gradesQuery = useGetApiGradesModelId(form?.modelId ?? "", {
        query: {
            enabled: !!form?.modelId,
        },
    });

    const gradeOptions: Option<string>[] = useMemo(
        () =>
            (gradesQuery.data ?? []).map((g) => ({
                label: g.name,
                value: g.id,
            })),
        [gradesQuery.data]
    );

    /* ===================== MUTATION ===================== */
    const { mutate, isPending } = usePatchApiCarsId({
        mutation: {
            onSuccess: () => navigate("/admin/cars"),
        },
    });

    /* ===================== HANDLERS ===================== */
    const onChangeModel = (modelId: string) => {
        if (!form) return;
        setForm({
            ...form,
            modelId,
            gradeId: undefined, // ⭐ reset grade
        });
    };

    const handleSave = () => {
        if (!form) return;
        mutate({ id: id!, data: form as CarUpdate });
    };

    if (isLoading || !form) {
        return <div className="p-8">Loading...</div>;
    }

    /* ===================== RENDER ===================== */
    return (
        <div className="bg-[#F8F9FB] min-h-screen p-8">
            <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-sm p-8">
                <h1 className="text-2xl font-semibold mb-8">Edit Car</h1>

                {/* ===== BASIC INFO ===== */}
                <Section title="Basic Information">
                    <div className="grid grid-cols-2 gap-6">
                        <Field label="Model">
                            <Select
                                value={form.modelId}
                                options={modelOptions}
                                placeholder="Select model"
                                onChange={onChangeModel}
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
                                placeholder={
                                    form.modelId
                                        ? "Select grade"
                                        : "Select model first"
                                }
                                onChange={(v) =>
                                    setForm({
                                        ...form,
                                        gradeId: v || undefined,
                                    })
                                }
                                className={
                                    !form.modelId
                                        ? "opacity-50 cursor-not-allowed"
                                        : ""
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
                                setForm({
                                    ...form,
                                    transmission: v,
                                })
                            }
                        />
                        <Select
                            value={form.steering ?? SteeringPosition.Left}
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

export default CarEditPage;

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
