import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Trash2, Star, Upload, X , Loader2} from "lucide-react";
import heic2any from "heic2any";
import { useQueryClient } from "@tanstack/react-query";

import Select, { Option } from "../../components/Select";


import {
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
    getGetApiCarsActiveQueryKey,
    getGetApiCarsDeletedQueryKey,
    getGetApiCarsIdQueryKey,
} from "../../services/api";

/* ===================== FORM TYPE ===================== */
type CarForm = {
    modelId: string;
    modelYear: number;
    // keep as string while editing (avoid leading-zero issues)
    price: number | string;
    mileage: number | string;
    enginePower?: number | null;
    fuelTypeId: string;
    transmissionTypeId: string;
    steering?: SteeringPosition;
    status: Status;
    colorId: string;
    showroomId?: string;
    buildTypeId?: string;
    gradeId?: string;
    isNewArrival?: boolean;
    featured?: boolean;
    // Optional license block
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
    const queryClient = useQueryClient();

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
            // convert to string for editing
            price: car.price ?? "",
            mileage: car.mileage ?? "",
            enginePower: car.engineSize ?? null,
            fuelTypeId: car.fuelTypeId,
            transmissionTypeId: car.transmissionTypeId,
            steering: car.steering || SteeringPosition.Left,
            status: car.status,
            colorId: car.colorId,
            showroomId: car.showroomId ?? undefined,
            buildTypeId: car.buildTypeId ?? undefined,
            gradeId: car.gradeId ?? undefined,
            isNewArrival: car.isNewArrival ?? false,
            featured: car.featured ?? false,
            // initialize license from existing car. keep expiryDate as ISO string if present
            license: car.license
                ? {
                    prefixNumber: car.license.prefixNumber,
                    prefixLetter: car.license.prefixLetter,
                    registrationNumber: car.license.registrationNumber,
                    registeredName: car.license.registeredName ?? undefined,
                    expiryDate: car.license.expiryDate ?? undefined,
                    regionId: car.license.regionId ?? undefined,
                }
                : undefined,
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
                    alert("Please provide complete license info: prefix number, prefix letter, registration number and region.");
                    return;
                }
            }
        }

        try {
            // coerce price/mileage to numbers
            const payload: any = { ...form };
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

            // 1. Update basic fields
            await updateCar({ id: id!, data: payload as CarUpdate });

            // 2. Handle featured status
            if (form.featured !== car.featured) {
                if (form.featured) {
                    await featureCar({ id: id! });
                } else {
                    await unfeatureCar({ id: id! });
                }
            }

            // Invalidate queries to refresh data
            await queryClient.invalidateQueries({ queryKey: getGetApiCarsActiveQueryKey() });
            await queryClient.invalidateQueries({ queryKey: getGetApiCarsDeletedQueryKey() });
            await queryClient.invalidateQueries({ queryKey: getGetApiCarsIdQueryKey(id!) });

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
                            <div>
                                <label className="block text-sm mb-1">Price</label>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    value={String(form.price ?? "")}
                                    onChange={(e) => {
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
                                value={form.fuelTypeId}
                                options={fuelOptions}
                                placeholder="Fuel"
                                onChange={(v) =>
                                    setForm({ ...form, fuelTypeId: v ?? "" })
                                }
                            />
                            <Select
                                value={form.transmissionTypeId}
                                options={transmissionOptions}
                                placeholder="Transmission"
                                onChange={(v) =>
                                    setForm({
                                        ...form,
                                        transmissionTypeId: v ?? "",
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
                    </Section>

                    {/* ===== LICENSE ===== */}
                    <Section title="License">
                        <div className="grid grid-cols-4 gap-6">
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
                                                prefixLetter: e.target.value,
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

                            <div className="col-span-2">
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

                            <div className="col-span-2">
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
                    </Section>


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

/**
 * Resizes an image blob/file to a maximum width while maintaining aspect ratio.
 */
const resizeImage = (file: Blob | File, maxWidth: number = 1920): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event: ProgressEvent<FileReader>) => {
      const img = new Image();
      // event.target?.result is string | ArrayBuffer | null
      img.src = event.target?.result as string;

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Only resize if the image is wider than the maxWidth
        if (width > maxWidth) {
          height = (maxWidth / width) * height;
          width = maxWidth;
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Could not get canvas context"));
          return;
        }

        // Use high-quality image smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        
        ctx.drawImage(img, 0, 0, width, height);

        // Export as WebP
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error("Canvas to Blob conversion failed"));
            }
          },
          "image/webp",
          0.7 // 0.7 is the sweet spot for file size vs quality
        );
      };

      img.onerror = (err) => reject(err);
    };

    reader.onerror = (err) => reject(err);
  });
};

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
    const [isProcessing, setIsProcessing] = useState(false);

    /* ===================== ACTIONS ===================== */
    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setIsProcessing(true);
            const rawFiles = Array.from(e.target.files);
            const processedFiles: File[] = [];

            for (const file of rawFiles) {
                const isHeic = file.type === "image/heic" || file.name.toLowerCase().endsWith(".heic");
                const isHeif = file.type === "image/heif" || file.name.toLowerCase().endsWith(".heif");
                
                if (isHeif || isHeic) {
                    try {
                        const blob = await heic2any({
                            blob: file,
                            toType: "image/webp",
                            quality: 0.7
                        });
                        const convertedBlob = Array.isArray(blob) ? blob[0] : blob;
                        const resizedBlob = await resizeImage(convertedBlob, 1920);

                        const newFileName = file.name.replace(/\.(heic|heif)$/i, ".webp");
                        const newFile = new File([resizedBlob], newFileName, {
                            type: "image/webp",
                            lastModified: new Date().getTime()
                        });
                        processedFiles.push(newFile);
                    } catch (error) {
                        console.error("HEIC conversion failed", error);
                        processedFiles.push(file);
                    }
                } else {
                    try {
                        const resizedBlob = await resizeImage(file, 1920);
                        const newFile = new File([resizedBlob], file.name, {
                            type: file.type,
                            lastModified: new Date().getTime()
                        });
                        processedFiles.push(newFile);
                    } catch {
                        processedFiles.push(file);
                    }
                }
            }
            setFiles((prev) => [...prev, ...processedFiles]);
            setIsProcessing(false);
        }
    };

    // FIXED: Added missing removeFile function
    const removeFile = (idx: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== idx));
        if (primaryIndex === idx) setPrimaryIndex(null);
        if (primaryIndex !== null && idx < primaryIndex)
            setPrimaryIndex(primaryIndex - 1);
    };

    // FIXED: Added missing handleUpload function which uses 'upload'
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
                    <div key={img.id} className="relative group aspect-square bg-gray-100 rounded-xl overflow-hidden border">
                        <img src={img.url} alt="Car" className="w-full h-full object-cover" />
                        {img.isPrimary && (
                            <div className="absolute top-2 left-2 bg-yellow-400 text-xs font-bold px-2 py-1 rounded">PRIMARY</div>
                        )}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                            {!img.isPrimary && (
                                <button onClick={() => setPrimary({ imageId: img.id })} className="p-2 bg-white rounded-full text-yellow-600">
                                    <Star size={16} />
                                </button>
                            )}
                            <button onClick={() => deleteImage({ imageId: img.id })} className="p-2 bg-white rounded-full text-red-600">
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* UPLOAD AREA */}
            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6">
                <div className="flex flex-col items-center justify-center text-gray-500 mb-6">
                    <input type="file" multiple accept="image/*,.heic,.heif" onChange={handleFileSelect} className="hidden" id="image-upload" />
                    <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center hover:text-indigo-600 transition">
                        <Upload size={32} className="mb-2" />
                        <span className="font-medium">Click to Upload Images</span>
                    </label>
                </div>

                {(files.length > 0 || isProcessing) && (
                    <div>
                        <h3 className="text-sm font-medium mb-3">New Images ({files.length})</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-4">
                            {files.map((file, idx) => (
                                <div key={idx} className={`relative aspect-square rounded-xl overflow-hidden border-2 ${primaryIndex === idx ? "border-yellow-500" : "border-transparent"}`}>
                                    <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover" />
                                    <button onClick={() => removeFile(idx)} className="absolute top-1 right-1 bg-white p-1 rounded-full shadow-md text-red-500 hover:bg-red-50">
                                        <X size={12} />
                                    </button>
                                    <button onClick={() => setPrimaryIndex(idx)} className={`absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] px-2 py-0.5 rounded-full font-bold shadow-sm ${primaryIndex === idx ? "bg-yellow-400 text-black" : "bg-white text-gray-500 hover:bg-gray-100"}`}>
                                        {primaryIndex === idx ? "COVER" : "SET COVER"}
                                    </button>
                                </div>
                            ))}

                            {isProcessing && (
                                <div className="aspect-square rounded-xl border-2 border-dashed border-indigo-200 bg-indigo-50 flex flex-col items-center justify-center animate-pulse">
                                    <Loader2 className="w-6 h-6 text-indigo-500 animate-spin mb-1" />
                                    <span className="text-[10px] text-indigo-600 font-bold">PROCESSING...</span>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end">
                            <button
                                onClick={handleUpload}
                                disabled={isUploading || isProcessing}
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
};/* ===================== IMAGE MANAGER ===================== */
