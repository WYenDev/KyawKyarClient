import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import Select, { Option } from "../../components/Select";
import { Star } from "lucide-react";

import { Steering } from "../../types";

import {
    Status,
    CarCreate,
    usePostApiCars,
    useGetApiBrands,
    useGetApiModelsBrandBrandId,
    useGetApiCarsFilters,
    useGetApiGradesModelId,
} from "../../services/api";

/* ===================== FORM TYPE ===================== */
type CarForm = {
    modelId: string;
    modelYear: number;
    // Keep as string while typing to avoid input quirks (leading zeros). We'll coerce before submit.
    price: number | string;
    mileage: number | string;
    engineSize?: number | null;
    fuelTypeId: string;
    transmissionTypeId: string;
    steering?: string;
    status: Status;
    colorId: string;
    showroomId?: string;
    buildTypeId?: string;
    gradeId?: string;
    isNewArrival?: boolean;
    featured?: boolean;
    // Optional license block. If any of the core license fields are provided,
    // the user must provide all four: prefixNumber, prefixLetter, registrationNumber, regionId.
    license?: {
        prefixNumber?: number;
        prefixLetter?: string;
        registrationNumber?: number;
        registeredName?: string;
        expiryDate?: string;
        regionId?: string;
    };
};

/* ===================== STATIC OPTIONS ===================== */
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

    /* ===================== STATE ===================== */
    const [brandId, setBrandId] = useState<string>("");

    /* ===================== QUERIES ===================== */
    const { data: brandData } = useGetApiBrands({ page: 1, limit: 100 });
    const { data: modelData } = useGetApiModelsBrandBrandId(brandId, {
        query: { enabled: !!brandId },
    });
    const { data: filterData } = useGetApiCarsFilters();

    /* ===================== FORM STATE ===================== */
    const [form, setForm] = useState<CarForm>({
        modelId: "",
        modelYear: new Date().getFullYear(),
        // initialize as empty strings so inputs don't show 0
        price: "",
        mileage: "",
        engineSize: null,
        fuelTypeId: "",
        transmissionTypeId: "",
        steering: Steering.Left,
        status: Status.Available,
        colorId: "",
        showroomId: undefined,
        buildTypeId: undefined,
        gradeId: undefined,
        isNewArrival: false,
        featured: false,
    });

    /* ===================== OPTIONS ===================== */
    const brandOptions: Option<string>[] = useMemo(
        () =>
            brandData?.items?.map((b) => ({
                label: b.name,
                value: b.id,
            })) ?? [],
        [brandData]
    );

    const modelOptions: Option<string>[] = useMemo(
        () =>
            modelData?.map((m) => ({
                label: m.name,
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

    // Regions (for license). We show the region code in the UI but use id as value.
    const regionOptions: Option<string>[] = useMemo(
        () =>
            filterData?.regions?.map((r) => ({
                label: r.code, // display code (e.g. "01")
                value: r.id,
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

    const fuelOptions: Option<string>[] = useMemo(
        () =>
            filterData?.fuelTypes?.map((f) => ({
                label: f.name,
                value: f.id,
            })) ?? [],
        [filterData]
    );

    const transmissionOptions: Option<string>[] = useMemo(
        () =>
            filterData?.transmissionTypes?.map((t) => ({
                label: t.name,
                value: t.id,
            })) ?? [],
        [filterData]
    );

    /* ===================== GRADES (MODEL DEPENDENT ⭐) ===================== */
    const gradesQuery = useGetApiGradesModelId(form.modelId, {
        query: {
            enabled: !!form.modelId, // ⭐ modelId ရှိမှ fetch
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
    const { mutate, isPending } = usePostApiCars({
        mutation: {
            onSuccess: () => navigate("/admin/cars"),
        },
    });

    /* ===================== HANDLERS ===================== */
    const onChangeBrand = (newBrandId: string) => {
        setBrandId(newBrandId);
        setForm({
            ...form,
            modelId: "",
            gradeId: undefined,
        });
    };

    const onChangeModel = (modelId: string) => {
        setForm({
            ...form,
            modelId,
            gradeId: undefined, // ⭐ reset grade on model change
        });
    };

    const handleSave = () => {
        // If user started to provide license info, require the four core fields
        const license = form.license;
        if (license) {
            const hasCore =
                license.prefixNumber !== undefined ||
                !!license.prefixLetter ||
                license.registrationNumber !== undefined ||
                !!license.regionId;

            if (hasCore) {
                if (
                    license.prefixNumber === undefined ||
                    !license.prefixLetter ||
                    license.registrationNumber === undefined ||
                    !license.regionId
                ) {
                    // minimal client-side validation - do not submit if incomplete
                    alert("Please provide complete license info: prefix number, prefix letter, registration number and region.");
                    return;
                }
            }
        }

        console.log('featured', form.featured)

        if (!form.modelId || !form.colorId) return;

        // build payload coercing price and mileage to numbers if provided
        const payload = { ...form } as unknown as CarCreate;
        if (typeof payload.price === "string") {
            payload.price = payload.price === "" ? 0 : Number(payload.price);
        }
        if (typeof payload.mileage === "string") {
            payload.mileage = payload.mileage === "" ? 0 : Number(payload.mileage);
        }

        // Ensure prefix letter is uppercase before sending
        if (payload.license && payload.license.prefixLetter) {
            payload.license.prefixLetter = String(payload.license.prefixLetter).trim().toUpperCase();
        }

        mutate({ data: payload as CarCreate });
    };

    /* ===================== RENDER ===================== */
    return (
        <div className="bg-[#F8F9FB] h-full overflow-y-auto w-full">
            <div className="max-w-5xl mx-auto p-4 md:p-8">
                <h1 className="text-xl md:text-2xl font-semibold mb-6 text-gray-900">
                    Create Car
                </h1>

                <div className="bg-white rounded-2xl shadow-sm p-4 md:p-8">
                    {/* ===== BASIC INFO ===== */}
                    <Section title="Basic Information">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 md:gap-6">
                            <Field label="Brand">
                                <Select
                                    value={brandId}
                                    options={brandOptions}
                                    placeholder="Select brand"
                                    onChange={onChangeBrand}
                                />
                            </Field>

                            <Field label="Model">
                                <Select
                                    value={form.modelId}
                                    options={modelOptions}
                                    placeholder={
                                        brandId
                                            ? "Select model"
                                            : "Select brand first"
                                    }
                                    onChange={onChangeModel}
                                    className={
                                        !brandId
                                            ? "opacity-50 cursor-not-allowed"
                                            : ""
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
                                    placeholder={
                                        form.modelId ? "Select grade" : "Select model first"
                                    }
                                    onChange={(v) =>
                                        setForm({
                                            ...form,
                                            gradeId: v || undefined,
                                        })
                                    }
                                    className={!form.modelId ? "opacity-50 cursor-not-allowed" : ""}
                                />
                            </Field>
                        </div>
                    </Section>

                    {/* ===== SPECIFICATIONS ===== */}
                    <Section title="Specifications">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                            <Input
                                label="Model Year"
                                value={form.modelYear}
                                onChange={(v) =>
                                    setForm({ ...form, modelYear: Number(v) })
                                }
                            />
                            <div>
                                <label className="block text-sm mb-1">Price</label>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    value={String(form.price ?? "")}
                                    onChange={(e) => {
                                        // keep digits only and remove leading zeros
                                        const raw = e.target.value || "";
                                        const digits = raw.replace(/\D+/g, "");
                                        const cleaned = digits.replace(/^0+/, "");
                                        setForm({ ...form, price: cleaned });
                                    }}
                                    className="w-full rounded-xl border px-4 py-3"
                                />
                            </div>

                            <div>
                                <label className="block text-sm mb-1">Mileage</label>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    value={String(form.mileage ?? "")}
                                    onChange={(e) => {
                                        const raw = e.target.value || "";
                                        const digits = raw.replace(/\D+/g, "");
                                        const cleaned = digits.replace(/^0+/, "");
                                        setForm({ ...form, mileage: cleaned });
                                    }}
                                    className="w-full rounded-xl border px-4 py-3"
                                />
                            </div>
                            <Input
                                label="Engine Power"
                                value={form.engineSize ?? ""}
                                onChange={(v) =>
                                    setForm({
                                        ...form,
                                        engineSize: v ? Number(v) : null,
                                    })
                                }
                            />
                        </div>
                    </Section>

                    {/* ===== STATUS ===== */}
                    <Section title="Status">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 items-end">
                            <Select
                                value={form.fuelTypeId}
                                options={fuelOptions}
                                placeholder="Fuel"
                                onChange={(v) => setForm({ ...form, fuelTypeId: v ?? "" })}
                            />

                            <Select
                                value={form.transmissionTypeId}
                                options={transmissionOptions}
                                placeholder="Transmission"
                                onChange={(v) =>
                                    setForm({ ...form, transmissionTypeId: v ?? "" })
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
                        
                        <div className="flex flex-col sm:flex-row gap-4 md:gap-6 pt-2">
                                <label className="flex items-center gap-2 cursor-pointer bg-gray-50 p-3 rounded-xl border border-gray-100 flex-1 sm:flex-initial">
                                    <input
                                        type="checkbox"
                                        checked={!!form.isNewArrival}
                                        onChange={(e) => {
                                            const checked = e.target.checked;
                                            setForm((prev) => ({
                                                ...prev,
                                                isNewArrival: checked,
                                            }));
                                        }}
                                        className="w-5 h-5 ml-auto"
                                    />
                                    <span className="text-sm font-medium text-gray-700">
                                        New Arrival
                                    </span>
                                </label>

                                <label className="flex items-center gap-2 cursor-pointer bg-gray-50 p-3 rounded-xl border border-gray-100 flex-1 sm:flex-initial">
                                    <input
                                        type="checkbox"
                                        checked={!!form.featured}
                                        onChange={(e) =>{
                                            const checked = e.target.checked;
                                            console.log('checkted', checked)
                                            setForm((prev) => ({
                                                ...prev,
                                                featured: checked, 
                                            }))
                                        }}
                                        className="w-5 h-5 ml-auto"
                                    />
                                    <span className="flex items-center gap-1 text-sm font-medium text-gray-700">
                                        <Star
                                            size={14}
                                            className={
                                                form.featured
                                                    ? "fill-indigo-600 text-indigo-600"
                                                    : ""
                                            }
                                        />
                                        Featured Car
                                    </span>
                                </label>
                            </div>
                    </Section>

                    {/* ===== LICENSE ===== */}
                    <Section title="License">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                            <Input
                                label="Prefix Number"
                                value={form.license?.prefixNumber ?? ""}
                                onChange={(v) =>
                                    setForm({
                                        ...form,
                                        license: {
                                            ...form.license,
                                            prefixNumber: v ? Number(v) : undefined,
                                        },
                                    })
                                }
                            />

                            <div>
                                <label className="block text-sm mb-1">Prefix Letter</label>
                                <input
                                    type="text"
                                    value={form.license?.prefixLetter ?? ""}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            license: {
                                                ...form.license,
                                                prefixLetter: e.target.value.toUpperCase(),
                                            },
                                        })
                                    }
                                    className="w-full rounded-xl border px-4 py-3"
                                    maxLength={2}
                                />
                            </div>

                            <div>
                                <label className="block text-sm mb-1">Region</label>
                                <Select
                                    value={form.license?.regionId ?? ""}
                                    options={[{ label: "No Region", value: "" }, ...regionOptions]}
                                    placeholder="Select region"
                                    onChange={(v) =>
                                        setForm({
                                            ...form,
                                            license: {
                                                ...form.license,
                                                regionId: v || undefined,
                                            },
                                        })
                                    }
                                />
                            </div>

                            <Input
                                label="Registration Number"
                                value={form.license?.registrationNumber ?? ""}
                                onChange={(v) =>
                                    setForm({
                                        ...form,
                                        license: {
                                            ...form.license,
                                            registrationNumber: v ? Number(v) : undefined,
                                        },
                                    })
                                }
                            />

                            <div className="col-span-1 sm:col-span-2">
                                <label className="block text-sm mb-1">Registered Name (optional)</label>
                                <input
                                    type="text"
                                    value={form.license?.registeredName ?? ""}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            license: {
                                                ...form.license,
                                                registeredName: e.target.value ? e.target.value : undefined,
                                            },
                                        })
                                    }
                                    className="w-full rounded-xl border px-4 py-3"
                                />
                            </div>

                            <div className="col-span-1 sm:col-span-2">
                                <label className="block text-sm mb-1">Expiry Date (optional)</label>
                                <input
                                    type="date"
                                    value={form.license?.expiryDate ? form.license.expiryDate.slice(0, 10) : ""}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            license: {
                                                ...form.license,
                                                expiryDate: e.target.value ? new Date(e.target.value).toISOString() : undefined,
                                            },
                                        })
                                    }
                                    className="w-full rounded-xl border px-4 py-3"
                                />
                            </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-4 md:gap-6 pt-2">
                             <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100 flex-1 sm:flex-initial">
                                <label className="text-sm font-medium text-gray-700 min-w-max">New Arrival</label>
                                <input
                                    type="checkbox"
                                    checked={form.isNewArrival ?? false}
                                    onChange={(e) =>
                                        setForm({ ...form, isNewArrival: e.target.checked })
                                    }
                                    className="w-5 h-5 ml-auto"
                                />
                             </div>

                             <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100 flex-1 sm:flex-initial">
                                <label className="text-sm font-medium text-gray-700 min-w-max">Featured</label>
                                <input
                                    type="checkbox"
                                    checked={form.featured ?? false}
                                    onChange={(e) =>
                                        setForm({ ...form, featured: e.target.checked })
                                    }
                                    className="w-5 h-5 ml-auto"
                                />
                             </div>
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
