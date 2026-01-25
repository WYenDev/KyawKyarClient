import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Trash2, Star, Upload, X, Loader2 } from "lucide-react";
import heic2any from "heic2any";

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
    price: number | string;
    mileage: number | string;
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

/* ===================== UTILS ===================== */

const resizeImage = (file: Blob | File, maxWidth: number = 1920): Promise<Blob> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = (event: ProgressEvent<FileReader>) => {
            const img = new Image();
            img.src = event.target?.result as string;

            img.onload = () => {
                let width = img.width;
                let height = img.height;

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

                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = "high";
                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob(
                    (blob) => {
                        if (blob) resolve(blob);
                        else reject(new Error("Canvas conversion failed"));
                    },
                    "image/webp",
                    0.7
                );
            };
            img.onerror = (err) => reject(err);
        };
        reader.onerror = (err) => reject(err);
    });
};

const CarEditPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [brandId, setBrandId] = useState<string>("");
    const [form, setForm] = useState<CarForm | null>(null);

    const { data: car, isLoading } = useGetApiCarsId(id!);
    const { data: brandData } = useGetApiBrands({ page: 1, limit: 100 });
    const { data: modelData } = useGetApiModelsBrandBrandId(brandId, {
        query: { enabled: !!brandId },
    });
    const { data: filterData } = useGetApiCarsFilters();

    useEffect(() => {
        if (!car) return;
        if (car.model?.brandId) setBrandId(car.model.brandId);

        setForm({
            modelId: car.modelId,
            modelYear: car.modelYear,
            price: car.price ?? "",
            mileage: car.mileage ?? "",
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
            license: car.license ? { ...car.license, registeredName: car.license.registeredName ?? undefined, expiryDate: car.license.expiryDate ?? undefined, regionId: car.license.regionId ?? undefined } : undefined,
        });
    }, [car]);

    const brandOptions = useMemo(() => brandData?.items?.map(b => ({ label: b.name, value: b.id })) ?? [], [brandData]);
    const modelOptions = useMemo(() => modelData?.map(m => ({ label: m.name, value: m.id })) ?? [], [modelData]);
    const colorOptions = useMemo(() => filterData?.colors?.map(c => ({ label: c.name, value: c.id })) ?? [], [filterData]);
    const regionOptions = useMemo(() => filterData?.regions?.map(r => ({ label: r.code, value: r.id })) ?? [], [filterData]);
    const showroomOptions = useMemo(() => [{ label: "No Showroom", value: "" }, ...(filterData?.showrooms?.map(s => ({ label: `${s.city} - ${s.addressEn}`, value: s.id })) ?? [])], [filterData]);
    const buildTypeOptions = useMemo(() => filterData?.buildTypes?.map(b => ({ label: b.name, value: b.id })) ?? [], [filterData]);

    const gradesQuery = useGetApiGradesModelId(form?.modelId ?? "", { query: { enabled: !!form?.modelId } });
    const gradeOptions = useMemo(() => (gradesQuery.data ?? []).map(g => ({ label: g.name, value: g.id })), [gradesQuery.data]);

    const { mutateAsync: updateCar, isPending: isUpdating } = usePatchApiCarsId();
    const { mutateAsync: featureCar } = usePostApiCarsIdFeature();
    const { mutateAsync: unfeatureCar } = useDeleteApiCarsIdFeature();

    const handleSave = async () => {
        if (!form || !car) return;
        try {
            const payload: any = { ...form };
            payload.price = Number(payload.price) || 0;
            payload.mileage = Number(payload.mileage) || 0;
            if (payload.license?.prefixLetter) payload.license.prefixLetter = payload.license.prefixLetter.trim().toUpperCase();

            await updateCar({ id: id!, data: payload as CarUpdate });
            if (form.featured !== car.featured) {
                form.featured ? await featureCar({ id: id! }) : await unfeatureCar({ id: id! });
            }
            navigate("/admin/cars");
        } catch (error) {
            alert("Failed to save changes");
        }
    };

    if (isLoading || !form) return <div className="p-8 text-center font-medium">Loading Car Data...</div>;

    return (
        <div className="bg-[#F8F9FB] h-full overflow-y-auto p-8">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-2xl font-semibold text-gray-900 mb-6">Edit Car</h1>
                <div className="bg-white rounded-2xl shadow-sm p-8">
                    <CarImagesManager carId={id!} />
                    
                    <Section title="Basic Information">
                        <div className="grid grid-cols-2 gap-6">
                            <Field label="Brand"><Select value={brandId} options={brandOptions} placeholder="Select brand" onChange={(v) => { setBrandId(v); setForm({...form, modelId: "", gradeId: undefined})}} /></Field>
                            <Field label="Model"><Select value={form.modelId} options={modelOptions} placeholder={brandId ? "Select model" : "Select brand first"} onChange={(v) => setForm({...form, modelId: v, gradeId: undefined})} className={!brandId ? "opacity-50 cursor-not-allowed" : ""} /></Field>
                            <Field label="Color"><Select value={form.colorId} options={colorOptions} placeholder="Select color" onChange={(v) => setForm({ ...form, colorId: v ?? "" })} /></Field>
                            <Field label="Showroom"><Select value={form.showroomId ?? ""} options={showroomOptions} placeholder="No Showroom" onChange={(v) => setForm({ ...form, showroomId: v || undefined })} /></Field>
                        </div>
                    </Section>

                    {/* Specifications, Status, License blocks follow same pattern as your original file... */}
                    {/* (Shortened for space, keep your original UI blocks here) */}

                    <div className="flex justify-end gap-4 mt-10">
                        <button onClick={() => navigate(-1)} className="px-6 py-2 rounded-xl border">Cancel</button>
                        <button onClick={handleSave} disabled={isUpdating} className="px-8 py-2 rounded-xl bg-black text-white disabled:opacity-50">
                            {isUpdating ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

/* ===================== IMAGE MANAGER ===================== */
const CarImagesManager = ({ carId }: { carId: string }) => {
    const { data: images = [], refetch } = useGetApiCarImagesCarId(carId);
    const [files, setFiles] = useState<File[]>([]);
    const [primaryIndex, setPrimaryIndex] = useState<number | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const { mutate: upload, isPending: isUploading } = usePostApiCarImagesCarIdUpload({
        mutation: { onSuccess: () => { refetch(); setFiles([]); setPrimaryIndex(null); } }
    });
    const { mutate: deleteImage } = useDeleteApiCarImagesImageId({ mutation: { onSuccess: () => refetch() } });
    const { mutate: setPrimary } = usePatchApiCarImagesImageIdSetPrimary({ mutation: { onSuccess: () => refetch() } });

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        setIsProcessing(true);
        const rawFiles = Array.from(e.target.files);
        const processedFiles: File[] = [];

        for (const file of rawFiles) {
            try {
                let currentBlob: Blob = file;
                let fileName = file.name;

                const isHeif = /heic|heif/.test(file.type.toLowerCase()) || /\.(heic|heif)$/i.test(file.name);

                if (isHeif) {
                    const converted = await heic2any({ blob: file, toType: "image/webp", quality: 0.7 });
                    currentBlob = Array.isArray(converted) ? converted[0] : converted;
                    fileName = file.name.replace(/\.(heic|heif)$/i, ".webp");
                }

                const resizedBlob = await resizeImage(currentBlob, 1920);
                const newFile = new File([resizedBlob], fileName.replace(/\.[^/.]+$/, ".webp"), {
                    type: "image/webp",
                    lastModified: Date.now()
                });
                processedFiles.push(newFile);
            } catch (error) {
                console.error("Processing failed", file.name, error);
                processedFiles.push(file);
            }
        }
        setFiles(prev => [...prev, ...processedFiles]);
        setIsProcessing(false);
    };

    return (
        <Section title="Car Images">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
                {images.map((img) => (
                    <div key={img.id} className="relative group aspect-square bg-gray-100 rounded-xl overflow-hidden border">
                        <img src={img.url} alt="Car" className="w-full h-full object-cover" />
                        {img.isPrimary && <div className="absolute top-2 left-2 bg-yellow-400 text-[10px] font-bold px-2 py-1 rounded">PRIMARY</div>}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                            {!img.isPrimary && <button onClick={() => setPrimary({ imageId: img.id })} className="p-2 bg-white rounded-full text-yellow-600"><Star size={16} /></button>}
                            <button onClick={() => deleteImage({ imageId: img.id })} className="p-2 bg-white rounded-full text-red-600"><Trash2 size={16} /></button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 bg-gray-50/50">
                <div className="flex flex-col items-center justify-center text-gray-500 mb-6">
                    <input type="file" multiple accept="image/*,.heic,.heif" onChange={handleFileSelect} className="hidden" id="image-upload" />
                    <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center hover:text-indigo-600 transition">
                        <Upload size={32} className="mb-2" />
                        <span className="font-medium">Click to Upload Images</span>
                        <span className="text-xs text-gray-400 mt-1">HEIC, WebP, PNG, JPG supported</span>
                    </label>
                </div>

                {(files.length > 0 || isProcessing) && (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {files.map((file, idx) => (
                            <div key={idx} className={`relative aspect-square rounded-xl overflow-hidden border-2 ${primaryIndex === idx ? "border-yellow-500" : "border-gray-100"}`}>
                                <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" alt="preview" />
                                <button onClick={() => setFiles(prev => prev.filter((_, i) => i !== idx))} className="absolute top-1 right-1 bg-white/90 p-1 rounded-full text-red-500"><X size={12} /></button>
                                <button onClick={() => setPrimaryIndex(idx)} className={`absolute bottom-2 left-1/2 -translate-x-1/2 text-[9px] px-2 py-1 rounded-full font-bold ${primaryIndex === idx ? "bg-yellow-400 text-black" : "bg-white/90 text-gray-500"}`}>
                                    {primaryIndex === idx ? "COVER" : "SET COVER"}
                                </button>
                            </div>
                        ))}
                        {isProcessing && (
                            <div className="aspect-square rounded-xl border-2 border-dashed border-indigo-200 bg-indigo-50/30 flex flex-col items-center justify-center animate-pulse">
                                <Loader2 className="w-6 h-6 text-indigo-500 animate-spin mb-1" />
                                <span className="text-[10px] text-indigo-600 font-semibold">Processing...</span>
                            </div>
                        )}
                    </div>
                )}
                
                {files.length > 0 && (
                    <div className="flex justify-end mt-4">
                        <button onClick={() => upload({ carId, data: { images: files, primaryIndex: primaryIndex ?? undefined } })} disabled={isUploading || isProcessing} className="bg-indigo-600 text-white px-6 py-2 rounded-xl hover:bg-indigo-700 disabled:opacity-50">
                            {isUploading ? "Uploading..." : "Save New Images"}
                        </button>
                    </div>
                )}
            </div>
        </Section>
    );
};

/* ===================== UI HELPERS ===================== */
const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="mb-10">
        <h2 className="text-lg font-medium mb-4 border-b pb-2">{title}</h2>
        {children}
    </div>
);

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div><label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>{children}</div>
);

export default CarEditPage;
