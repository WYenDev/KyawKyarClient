import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Trash2, Star, Upload, X } from "lucide-react";

import Select, { Option } from "../../components/Select";


import {
    Fuel,
    Transmission,
    Status,
    CarUpdate,
    SteeringPosition,
    useGetApiCarsId,
    usePatchApiCarsId,
    useGetApiBrands,
    useGetApiModelsBrandBrandId,
    useGetApiCarsFilters,
    useGetApiGradesModelId,
    useGetApiCarImagesCarId,
    usePostApiCarImagesCarIdUpload,
    useDeleteApiCarImagesImageId,
    usePatchApiCarImagesImageIdSetPrimary,
    usePostApiCarsIdFeature,
    useDeleteApiCarsIdFeature,
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
    featured?: boolean;
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

    /* ===================== STATE ===================== */
    const [brandId, setBrandId] = useState<string>("");
    const [form, setForm] = useState<CarForm | null>(null);

    /* ===================== QUERIES ===================== */
    const { data: car, isLoading } = useGetApiCarsId(id!);
    const { data: brandData } = useGetApiBrands({ page: 1, limit: 100 });
    const { data: modelData } = useGetApiModelsBrandBrandId(brandId, {
        query: { enabled: !!brandId },
    });
    const { data: filterData } = useGetApiCarsFilters();

    /* ===================== INIT FORM ===================== */
    useEffect(() => {
        if (!car) return;

        if (car.model?.brandId) {
            setBrandId(car.model.brandId);
        }

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
            featured: car.featured ?? false,
        });
    }, [car]);

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
    const { mutateAsync: updateCar, isPending: isUpdating } = usePatchApiCarsId();
    const { mutateAsync: featureCar, isPending: isFeaturing } =
        usePostApiCarsIdFeature();
    const { mutateAsync: unfeatureCar, isPending: isUnfeaturing } =
        useDeleteApiCarsIdFeature();

    /* ===================== HANDLERS ===================== */
    const onChangeBrand = (newBrandId: string) => {
        setBrandId(newBrandId);
        if (form) {
            setForm({
                ...form,
                modelId: "",
                gradeId: undefined,
            });
        }
    };

    const onChangeModel = (modelId: string) => {
        if (!form) return;
        setForm({
            ...form,
            modelId,
            gradeId: undefined, // ⭐ reset grade
        });
    };

    const handleSave = async () => {
        if (!form || !car) return;

        try {
            // 1. Update basic fields
            await updateCar({ id: id!, data: form as CarUpdate });

            // 2. Handle featured status
            if (form.featured !== car.featured) {
                if (form.featured) {
                    await featureCar({ id: id! });
                } else {
                    await unfeatureCar({ id: id! });
                }
            }

            navigate("/admin/cars");
        } catch (error) {
            console.error(error);
            alert("Failed to save changes");
        }
    };

    const isPending = isUpdating || isFeaturing || isUnfeaturing;

    if (isLoading || !form) {
        return <div className="p-8">Loading...</div>;
    }

    /* ===================== RENDER ===================== */
    return (
        <div className="bg-[#F8F9FB] h-full overflow-y-auto p-8">
            <div className="max-w-5xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Edit Car
                    </h1>
                </div>

                <div className="bg-white rounded-2xl shadow-sm p-8">
                    {/* ===== IMAGES ===== */}
                    <CarImagesManager carId={id!} />

                    {/* ===== BASIC INFO ===== */}
                    <Section title="Basic Information">
                    <div className="grid grid-cols-2 gap-6">
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

                        {/* CHECKBOXES */}
                        <div className="col-span-4 flex flex-col lg:flex-row gap-6 pt-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={form.isNewArrival ?? false}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            isNewArrival: e.target.checked,
                                        })
                                    }
                                    className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <span className="text-sm font-medium text-gray-700">
                                    New Arrival
                                </span>
                            </label>

                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={form.featured ?? false}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            featured: e.target.checked,
                                        })
                                    }
                                    className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
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


/* ===================== IMAGE MANAGER ===================== */
const CarImagesManager = ({ carId }: { carId: string }) => {
    /* ===================== QUERY ===================== */
    const { data: images = [], refetch } = useGetApiCarImagesCarId(carId);

    /* ===================== MUTATIONS ===================== */
    const { mutate: upload, isPending: isUploading } =
        usePostApiCarImagesCarIdUpload({
            mutation: {
                onSuccess: () => {
                    refetch();
                    setFiles([]);
                    setPrimaryIndex(null);
                },
            },
        });

    const { mutate: deleteImage } = useDeleteApiCarImagesImageId({
        mutation: { onSuccess: () => refetch() },
    });

    const { mutate: setPrimary } = usePatchApiCarImagesImageIdSetPrimary({
        mutation: { onSuccess: () => refetch() },
    });

    /* ===================== LOCAL STATE ===================== */
    const [files, setFiles] = useState<File[]>([]);
    const [primaryIndex, setPrimaryIndex] = useState<number | null>(null);

    /* ===================== ACTIONS ===================== */
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            setFiles((prev) => [...prev, ...newFiles]);
        }
    };

    const removeFile = (idx: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== idx));
        if (primaryIndex === idx) setPrimaryIndex(null);
        if (primaryIndex !== null && idx < primaryIndex)
            setPrimaryIndex(primaryIndex - 1);
    };

    const handleUpload = () => {
        if (files.length === 0) return;
        upload({
            carId,
            data: {
                images: files,
                primaryIndex: primaryIndex !== null ? primaryIndex : undefined,
            },
        });
    };

    return (
        <Section title="Car Images">
            {/* EXISTING IMAGES */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
                {images.map((img) => (
                    <div
                        key={img.id}
                        className="relative group aspect-square bg-gray-100 rounded-xl overflow-hidden border"
                    >
                        <img
                            src={img.url}
                            alt="Car"
                            className="w-full h-full object-cover"
                        />
                        
                        {/* BADGES */}
                        {img.isPrimary && (
                            <div className="absolute top-2 left-2 bg-yellow-400 text-xs font-bold px-2 py-1 rounded">
                                PRIMARY
                            </div>
                        )}

                        {/* OVERLAY ACTIONS */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                            {!img.isPrimary && (
                                <button
                                    onClick={() => setPrimary({ imageId: img.id })}
                                    className="p-2 bg-white rounded-full hover:bg-yellow-100 text-yellow-600"
                                    title="Set as Primary"
                                >
                                    <Star size={16} />
                                </button>
                            )}
                            <button
                                onClick={() => deleteImage({ imageId: img.id })}
                                className="p-2 bg-white rounded-full hover:bg-red-100 text-red-600"
                                title="Delete"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* UPLOAD AREA */}
            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6">
                <div className="flex flex-col items-center justify-center text-gray-500 mb-6">
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                        id="image-upload"
                    />
                    <label
                        htmlFor="image-upload"
                        className="cursor-pointer flex flex-col items-center hover:text-indigo-600 transition"
                    >
                        <Upload size={32} className="mb-2" />
                        <span className="font-medium">Click to Upload Images</span>
                    </label>
                </div>

                {/* SELECTED FILES PREVIEW */}
                {files.length > 0 && (
                    <div>
                        <h3 className="text-sm font-medium mb-3">
                            New Images ({files.length})
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-4">
                            {files.map((file, idx) => (
                                <div
                                    key={idx}
                                    className={`relative aspect-square rounded-xl overflow-hidden border-2 ${
                                        primaryIndex === idx
                                            ? "border-yellow-500"
                                            : "border-transparent"
                                    }`}
                                >
                                    <img
                                        src={URL.createObjectURL(file)}
                                        alt="preview"
                                        className="w-full h-full object-cover"
                                    />
                                    <button
                                        onClick={() => removeFile(idx)}
                                        className="absolute top-1 right-1 bg-white p-1 rounded-full shadow-md text-red-500 hover:bg-red-50"
                                    >
                                        <X size={12} />
                                    </button>
                                    
                                    <button
                                        onClick={() => setPrimaryIndex(idx)}
                                        className={`absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] px-2 py-0.5 rounded-full font-bold shadow-sm ${
                                            primaryIndex === idx
                                                ? "bg-yellow-400 text-black"
                                                : "bg-white text-gray-500 hover:bg-gray-100"
                                        }`}
                                    >
                                        {primaryIndex === idx ? "COVER" : "SET COVER"}
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-end">
                            <button
                                onClick={handleUpload}
                                disabled={isUploading}
                                className="bg-black text-white px-6 py-2 rounded-xl flex items-center gap-2 hover:bg-gray-800 disabled:opacity-50"
                            >
                                {isUploading ? "Uploading..." : "Upload Selected"}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </Section>
    );
};
