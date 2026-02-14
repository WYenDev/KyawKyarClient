import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { MAX_IMAGE_SIZE_BYTES } from "../../utils/imageUpload";
import {
    useGetApiPromoBanners,
    usePostApiPromoBanners,
    usePatchApiPromoBannersId,
    useDeleteApiPromoBannersId,
    usePostApiPromoBannersIdImage,
    useDeleteApiPromoBannersIdImage,
    useGetApiBrands,
    GetApiPromoBanners200Item,
} from "../../services/api";
import { Edit2, Trash2, Plus, Image as ImageIcon, Loader2, Sparkles, Megaphone } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

type PromoBannerFormInputs = {
    type: "NEW_ARRIVAL" | "PROMOTION";
    title: string;
    brandId: string;
    linkUrl: string;
    order: number;
    isActive: boolean;
};

const PromoBanners = () => {
    const queryClient = useQueryClient();
    const { data: banners, isLoading, error, isError } = useGetApiPromoBanners();
    const { data: brands } = useGetApiBrands();
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [isCreating, setIsCreating] = useState(false);

    const { mutateAsync: uploadImage, isPending: isUploadingImage } = usePostApiPromoBannersIdImage();
    const { mutateAsync: deleteImage, isPending: isDeletingImage } = useDeleteApiPromoBannersIdImage();

    const { mutate: createBanner, isPending: isCreatingBanner } = usePostApiPromoBanners();
    const { mutate: updateBanner, isPending: isUpdatingBanner } = usePatchApiPromoBannersId();
    const { mutate: deleteBanner, isPending: isDeletingBanner } = useDeleteApiPromoBannersId();

    const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<PromoBannerFormInputs>({
        defaultValues: {
            type: "PROMOTION",
            title: "",
            brandId: "",
            linkUrl: "",
            order: 0,
            isActive: true,
        }
    });

    const watchType = watch("type");

    if (isLoading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin" /></div>;
    if (isError) return <div className="p-8 text-red-500">Error loading promo banners: {(error as unknown as Error)?.message}</div>;

    const safeBanners = Array.isArray(banners) ? banners : [];
    // brands API returns paginated { items, total, ... }
    const brandsData = brands as { items?: { id?: string; name?: string }[] } | undefined;
    const safeBrands = brandsData?.items ?? [];

    const invalidateQueries = () => {
        queryClient.invalidateQueries({ queryKey: ['/api/promo-banners'] });
    };

    const onSubmit: SubmitHandler<PromoBannerFormInputs> = (data) => {
        const formData: {
            type: "NEW_ARRIVAL" | "PROMOTION";
            title?: string;
            order: number;
            isActive: boolean;
            brandId?: string;
            linkUrl?: string;
        } = {
            type: data.type,
            title: data.title || undefined,
            order: Number(data.order),
            isActive: data.isActive,
        };

        if (data.type === "NEW_ARRIVAL") {
            formData.brandId = data.brandId || undefined;
            formData.linkUrl = undefined;
        } else {
            formData.linkUrl = data.linkUrl || undefined;
            formData.brandId = undefined;
        }

        if (isEditing) {
            updateBanner({ id: isEditing, data: formData as never }, {
                onSuccess: () => { invalidateQueries(); resetForm(); }
            });
        } else {
            createBanner({ data: formData as never }, {
                onSuccess: () => { invalidateQueries(); resetForm(); }
            });
        }
    };

    const handleEdit = (banner: GetApiPromoBanners200Item) => {
        setIsEditing(banner.id || null);
        setIsCreating(false);
        setValue("type", (banner.type as "NEW_ARRIVAL" | "PROMOTION") || "PROMOTION");
        setValue("title", banner.title || "");
        setValue("brandId", banner.brandId || "");
        setValue("linkUrl", banner.linkUrl || "");
        setValue("order", banner.order || 0);
        setValue("isActive", banner.isActive ?? true);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!isEditing || !e.target.files?.[0]) return;

        const file = e.target.files[0];
        if (file.size > MAX_IMAGE_SIZE_BYTES) {
            alert("Image must be 10 MB or less.");
            e.target.value = '';
            return;
        }
        try {
            await uploadImage({ id: isEditing, data: { image: file } });
            invalidateQueries();
        } catch (error) {
            console.error("Failed to upload image", error);
            alert("Failed to upload image");
        } finally {
            e.target.value = '';
        }
    };

    const handleImageRemove = async () => {
        if (!isEditing || !window.confirm("Remove this image?")) return;
        try {
            await deleteImage({ id: isEditing });
            invalidateQueries();
        } catch (error) {
            console.error("Failed to delete image", error);
            alert("Failed to delete image");
        }
    };

    const handleDelete = (id: string) => {
        if (window.confirm("Are you sure you want to delete this promo banner?")) {
            deleteBanner({ id }, { onSuccess: invalidateQueries });
        }
    };

    const resetForm = () => {
        setIsEditing(null);
        setIsCreating(false);
        reset({
            type: "PROMOTION",
            title: "",
            brandId: "",
            linkUrl: "",
            order: 0,
            isActive: true,
        });
    };

    const handleCreate = () => {
        setIsEditing(null);
        setIsCreating(true);
        reset({
            type: "PROMOTION",
            title: "",
            brandId: "",
            linkUrl: "",
            order: 0,
            isActive: true,
        });
    };

    const isSubmitting = isCreatingBanner || isUpdatingBanner;

    return (
        <div className="px-4 py-6 md:p-6">
            <div className="flex items-center justify-between gap-3 flex-nowrap mb-6">
                <h1 className="text-2xl font-bold flex-1 min-w-0 break-words leading-tight">Promo Banners</h1>
                {!isCreating && !isEditing && (
                    <button
                        onClick={handleCreate}
                        className="flex items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700 w-10 h-10 shrink-0"
                        aria-label="Create promo banner"
                    >
                        <Plus size={18} />
                    </button>
                )}
            </div>

            {/* CREATE / EDIT FORM */}
            {(isCreating || isEditing) && (
                <div className="bg-white p-6 rounded-lg shadow mb-8">
                    <h2 className="text-xl font-semibold mb-4">
                        {isEditing ? "Edit Promo Banner" : "Create Promo Banner"}
                    </h2>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {/* Type selector */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Banner Type</label>
                            <div className="grid grid-cols-2 gap-3">
                                <label
                                    className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                                        watchType === "NEW_ARRIVAL"
                                            ? "border-emerald-500 bg-emerald-50"
                                            : "border-gray-200 hover:border-gray-300"
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        value="NEW_ARRIVAL"
                                        {...register("type")}
                                        className="sr-only"
                                    />
                                    <Sparkles size={20} className={watchType === "NEW_ARRIVAL" ? "text-emerald-600" : "text-gray-400"} />
                                    <div>
                                        <span className="text-sm font-semibold block">New Arrival</span>
                                        <span className="text-xs text-gray-500">Links to brand cars page</span>
                                    </div>
                                </label>
                                <label
                                    className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                                        watchType === "PROMOTION"
                                            ? "border-indigo-500 bg-indigo-50"
                                            : "border-gray-200 hover:border-gray-300"
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        value="PROMOTION"
                                        {...register("type")}
                                        className="sr-only"
                                    />
                                    <Megaphone size={20} className={watchType === "PROMOTION" ? "text-indigo-600" : "text-gray-400"} />
                                    <div>
                                        <span className="text-sm font-semibold block">Promotion</span>
                                        <span className="text-xs text-gray-500">Links to custom URL</span>
                                    </div>
                                </label>
                            </div>
                        </div>

                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium mb-1">Title / Alt Text</label>
                            <input
                                type="text"
                                {...register("title")}
                                placeholder="e.g. New Year Sale, Toyota New Arrivals"
                                className="w-full p-2 border rounded"
                            />
                        </div>

                        {/* Brand selector (for NEW_ARRIVAL) */}
                        {watchType === "NEW_ARRIVAL" && (
                            <div>
                                <label className="block text-sm font-medium mb-1">Brand *</label>
                                <select
                                    {...register("brandId", {
                                        validate: (val) =>
                                            watchType !== "NEW_ARRIVAL" || !!val || "Please select a brand",
                                    })}
                                    className="w-full p-2 border rounded"
                                >
                                    <option value="">Select a brand...</option>
                                    {safeBrands.map((brand) => (
                                        <option key={brand.id} value={brand.id}>
                                            {brand.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.brandId && (
                                    <span className="text-red-500 text-sm">{errors.brandId.message}</span>
                                )}
                            </div>
                        )}

                        {/* Link URL (for PROMOTION) */}
                        {watchType === "PROMOTION" && (
                            <div>
                                <label className="block text-sm font-medium mb-1">Link URL *</label>
                                <input
                                    type="text"
                                    {...register("linkUrl", {
                                        validate: (val) =>
                                            watchType !== "PROMOTION" || !!val || "Please enter a URL",
                                    })}
                                    placeholder="e.g. /buyCars or https://example.com/sale"
                                    className="w-full p-2 border rounded"
                                />
                                {errors.linkUrl && (
                                    <span className="text-red-500 text-sm">{errors.linkUrl.message}</span>
                                )}
                                <p className="text-xs text-gray-500 mt-1">
                                    Use relative paths (e.g. /buyCars) for internal pages or full URLs for external links.
                                </p>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Display Order</label>
                                <input
                                    type="number"
                                    {...register("order", { min: 0 })}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                            <div className="flex items-center gap-2 pt-6">
                                <input
                                    type="checkbox"
                                    id="isActive"
                                    {...register("isActive")}
                                    className="w-4 h-4 rounded border-gray-300"
                                />
                                <label htmlFor="isActive" className="text-sm font-medium">Active</label>
                            </div>
                        </div>

                        {/* Image upload (only in edit mode) */}
                        {isEditing && (
                            <div>
                                <label className="block text-sm font-medium mb-1">Banner Image</label>
                                {safeBanners.find((b) => b.id === isEditing)?.imageUrl ? (
                                    <div className="mb-2 p-2 border rounded flex items-center justify-between bg-gray-50">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <ImageIcon size={16} />
                                            <span>Image uploaded</span>
                                            <a
                                                href={safeBanners.find((b) => b.id === isEditing)?.imageUrl ?? undefined}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-blue-500 hover:underline"
                                            >
                                                (View)
                                            </a>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleImageRemove}
                                            disabled={isDeletingImage}
                                            className="text-red-500 text-xs hover:text-red-700 font-medium disabled:opacity-50"
                                        >
                                            {isDeletingImage ? "Removing..." : "Remove Image"}
                                        </button>
                                    </div>
                                ) : (
                                    <p className="text-xs text-gray-500 mb-2">No image uploaded yet.</p>
                                )}
                                <div className="flex items-center gap-2">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        disabled={isUploadingImage}
                                        className="w-full p-2 border rounded text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                    />
                                    {isUploadingImage && <Loader2 className="animate-spin text-blue-600" size={20} />}
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    Recommended: wide banner image (e.g. 1400×400). Upload after creating the banner.
                                </p>
                            </div>
                        )}

                        {!isEditing && (
                            <div className="p-3 bg-blue-50 text-blue-800 text-sm rounded">
                                Create the banner first, then edit it to upload the image.
                            </div>
                        )}

                        <div className="flex justify-end gap-2 mt-6">
                            <button
                                type="button"
                                onClick={resetForm}
                                className="px-4 py-2 border rounded hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                            >
                                {isSubmitting && <Loader2 className="animate-spin" size={16} />}
                                {isEditing ? "Update" : "Create"}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* BANNERS TABLE */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {safeBanners.map((banner) => (
                            <tr key={banner.id}>
                                <td className="px-4 py-3">
                                    {banner.imageUrl ? (
                                        <img
                                            src={banner.imageUrl}
                                            alt={banner.title || "Banner"}
                                            className="h-12 w-24 object-cover rounded border"
                                        />
                                    ) : (
                                        <div className="h-12 w-24 bg-gray-100 rounded border flex items-center justify-center text-xs text-gray-400">
                                            No image
                                        </div>
                                    )}
                                </td>
                                <td className="px-4 py-3">
                                    <span
                                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold ${
                                            banner.type === "NEW_ARRIVAL"
                                                ? "bg-emerald-100 text-emerald-700"
                                                : "bg-indigo-100 text-indigo-700"
                                        }`}
                                    >
                                        {banner.type === "NEW_ARRIVAL" ? (
                                            <><Sparkles size={12} /> New Arrival</>
                                        ) : (
                                            <><Megaphone size={12} /> Promotion</>
                                        )}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-900 max-w-[200px] truncate">
                                    {banner.title || <span className="text-gray-400 italic">No title</span>}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-500">
                                    {banner.type === "NEW_ARRIVAL" ? (
                                        <span>Brand: <strong>{banner.brandName || "—"}</strong></span>
                                    ) : (
                                        <span className="truncate block max-w-[180px]" title={banner.linkUrl ?? undefined}>
                                            {banner.linkUrl || "—"}
                                        </span>
                                    )}
                                    <div className="text-xs text-gray-400 mt-0.5">Order: {banner.order}</div>
                                </td>
                                <td className="px-4 py-3">
                                    <span
                                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            banner.isActive
                                                ? "bg-green-100 text-green-800"
                                                : "bg-gray-100 text-gray-800"
                                        }`}
                                    >
                                        {banner.isActive ? "Active" : "Inactive"}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-right text-sm font-medium">
                                    <button
                                        onClick={() => handleEdit(banner)}
                                        className="text-blue-600 hover:text-blue-900 mr-3"
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(banner.id!)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        {isDeletingBanner ? <Loader2 className="animate-spin" size={18} /> : <Trash2 size={18} />}
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {safeBanners.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-6 py-8 text-center text-sm text-gray-500">
                                    No promo banners yet. Create one to get started.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PromoBanners;
