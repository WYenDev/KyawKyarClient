import { useState } from "react";
import { createPortal } from "react-dom";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// Configure Quill to use inline styles instead of classes
const Size = Quill.import('attributors/style/size');
// Add pixel values to allow precise control
const fontSizeArr = ['10px', '12px', '14px', '16px', '18px', '20px', '24px', '30px', '36px', '48px', '60px', '72px'];
Size.whitelist = fontSizeArr;
Quill.register(Size, true);

const Font = Quill.import('attributors/style/font');
Quill.register(Font, true);

const Align = Quill.import('attributors/style/align');
Quill.register(Align, true);

import { MAX_IMAGE_SIZE_BYTES } from "../../utils/imageUpload";
import {
    useGetApiFooterBanners,
    usePostApiFooterBanners,
    usePatchApiFooterBannersId,
    useDeleteApiFooterBannersId,
    usePostApiFooterBannersIdImage,
    useDeleteApiFooterBannersIdImage,
    GetApiFooterBanners200Item
} from "../../services/api";
import { Trash2, Plus, Image as ImageIcon, Loader2, MoreVertical, Pencil, CheckCircle, XCircle } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

type BannerFormInputs = {
    text: string;
    backgroundColor: string;
    order: number;
    isActive: boolean;
    // Removed backgroundImage from here as it's handled separately for edits
};

const Banners = () => {
    const queryClient = useQueryClient();
    const { data: banners, isLoading, error, isError } = useGetApiFooterBanners();
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [openActionId, setOpenActionId] = useState<string | null>(null);
    const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number } | null>(null);

    // We use the hooks' pending state instead of local state
    const { mutateAsync: uploadImage, isPending: isUploadingImage } = usePostApiFooterBannersIdImage();
    const { mutateAsync: deleteImage, isPending: isDeletingImage } = useDeleteApiFooterBannersIdImage();

    const { mutate: createBanner, isPending: isCreatingBanner } = usePostApiFooterBanners();
    const { mutate: updateBanner, isPending: isUpdatingBanner } = usePatchApiFooterBannersId();
    const { mutate: deleteBanner, isPending: isDeletingBanner } = useDeleteApiFooterBannersId();

    const { register, handleSubmit, reset, setValue, control, formState: { errors } } = useForm<BannerFormInputs>({
        defaultValues: {
            text: "",
            backgroundColor: "#FFFFFF",
            order: 0,
            isActive: true,
        }
    });

    if (isLoading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin" /></div>;
    if (isError) return <div className="p-8 text-red-500">Error loading banners: {(error as Error).message}</div>;

    // Ensure banners is an array to prevent crashes
    const safeBanners = Array.isArray(banners) ? banners : [];

    const onSubmit: SubmitHandler<BannerFormInputs> = (data) => {
        const formData = {
            text: data.text,
            backgroundColor: data.backgroundColor,
            order: Number(data.order),
            isActive: data.isActive,
        };
        
        if (isEditing) {
            updateBanner({
                id: isEditing,
                data: formData as any
            }, {
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ['/api/footer-banners'] });
                    resetForm();
                }
            });
        } else {
            createBanner({
                data: formData as any
            }, {
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ['/api/footer-banners'] });
                    resetForm();
                }
            });
        }
    };

    const handleEdit = (banner: GetApiFooterBanners200Item) => {
        setIsEditing(banner.id || null);
        setIsCreating(false);
        setValue("text", banner.text || "");
        setValue("backgroundColor", banner.backgroundColor || "#FFFFFF");
        setValue("order", banner.order || 0);
        setValue("isActive", banner.isActive || false);
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
            await uploadImage({
                id: isEditing,
                data: { image: file } 
            });
            queryClient.invalidateQueries({ queryKey: ['/api/footer-banners'] });
        } catch (error) {
            console.error("Failed to upload image", error);
            alert("Failed to upload image");
        } finally {
             // Reset file input value
            e.target.value = '';
        }
    };

    const handleImageRemove = async () => {
        if (!isEditing || !window.confirm("Remove this image?")) return;
        
        try {
            await deleteImage({ id: isEditing });
            queryClient.invalidateQueries({ queryKey: ['/api/footer-banners'] });
        } catch (error) {
            console.error("Failed to delete image", error);
            alert("Failed to delete image");
        }
    };

    const handleDelete = (id: string) => {
        if (window.confirm("Are you sure you want to delete this banner?")) {
            deleteBanner({ id }, {
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ['/api/footer-banners'] });
                }
            });
        }
    };

    const resetForm = () => {
        setIsEditing(null);
        setIsCreating(false);
        reset({
            text: "",
            backgroundColor: "#FFFFFF",
            order: 0,
            isActive: true,
        });
    };

    const handleCreate = () => {
        setIsEditing(null);
        setIsCreating(true);
        reset({
            text: "",
            backgroundColor: "#FFFFFF",
            order: 0,
            isActive: true,
        });
    }

    const isSubmitting = isCreatingBanner || isUpdatingBanner;

    return (
        <div className="px-4 py-4 sm:py-6 md:p-6 min-w-0">
            <div className="flex items-center justify-between gap-3 flex-nowrap mb-4 sm:mb-6">
                <h1 className="text-xl sm:text-2xl font-bold flex-1 min-w-0 break-words leading-tight">Banner Management</h1>
                {!isCreating && !isEditing && (
                    <button
                        onClick={handleCreate}
                        className="flex items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700 w-10 h-10 shrink-0"
                        aria-label="Create banner"
                    >
                        <Plus size={18} />
                        <span className="sr-only">Create banner</span>
                    </button>
                )}
            </div>

            {(isCreating || isEditing) && (
                <div className="bg-white p-4 sm:p-6 rounded-lg shadow mb-6 sm:mb-8">
                    <h2 className="text-lg sm:text-xl font-semibold mb-4">{isEditing ? "Edit Banner" : "Create Banner"}</h2>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Text Content</label>
                            <div className="bg-white">
                                <Controller
                                    name="text"
                                    control={control}
                                    rules={{ required: "Text is required" }}
                                    render={({ field }) => (
                                        <ReactQuill 
                                            theme="snow"
                                            value={field.value} 
                                            onChange={field.onChange}
                                            className="h-40 mb-12" // Add margin bottom to account for toolbar/toolbar height
                                            modules={{
                                                toolbar: [
                                                    [{ 'font': [] }],
                                                    [{ 'size': fontSizeArr }],
                                                    ['bold', 'italic', 'underline', 'strike'],
                                                    [{ 'color': [] }, { 'background': [] }],
                                                    [{ 'align': [] }],
                                                    ['clean']
                                                ],
                                            }}
                                        />
                                    )}
                                />
                            </div>
                            {errors.text && <span className="text-red-500 text-sm">{errors.text.message}</span>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Background Color</label>
                                <Controller
                                    name="backgroundColor"
                                    control={control}
                                    defaultValue="#FFFFFF"
                                    rules={{ pattern: { value: /^#[0-9A-Fa-f]{6}$/, message: "Invalid hex color" } }}
                                    render={({ field }) => (
                                        <div className="flex gap-2">
                                            <input
                                                type="color"
                                                {...field}
                                                className="h-10 w-20 p-1 border rounded cursor-pointer"
                                            />
                                            <input
                                                type="text"
                                                value={field.value || "#FFFFFF"}
                                                onChange={(e) => field.onChange(e.target.value)}
                                                onBlur={field.onBlur}
                                                placeholder="#FFFFFF"
                                                className="flex-1 p-2 border rounded"
                                            />
                                        </div>
                                    )}
                                />
                                {errors.backgroundColor && (
                                    <span className="text-red-500 text-sm">{errors.backgroundColor.message}</span>
                                )}
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium mb-1">Display Order</label>
                                <input
                                    type="number"
                                    {...register("order", { min: 0 })}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                        </div>

                        {isEditing && (
                            <div>
                                <label className="block text-sm font-medium mb-1">Background Image</label>
                                
                                {/* Show image preview info if current banner has one */}
                                {safeBanners.find(b => b.id === isEditing)?.backgroundImageUrl ? (
                                    <div className="mb-2 p-2 border rounded flex items-center justify-between bg-gray-50">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <ImageIcon size={16} />
                                            <span>Current Image Set</span>
                                            <a href={safeBanners.find(b => b.id === isEditing)?.backgroundImageUrl} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">(View)</a>
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
                                    <p className="text-xs text-gray-500 mb-2">No image set.</p>
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
                                <p className="text-xs text-gray-500 mt-1">Upload happens immediately. Overrides background color.</p>
                            </div>
                        )}
                        
                        {!isEditing && (
                            <div className="p-3 bg-blue-50 text-blue-800 text-sm rounded">
                                To add a background image, please create the banner first, then edit it.
                            </div>
                        )}

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="isActive"
                                {...register("isActive")}
                                className="w-4 h-4 rounded border-gray-300"
                            />
                            <label htmlFor="isActive" className="text-sm font-medium">Is Active</label>
                        </div>

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
                                {isEditing ? "Update Banner" : "Create Banner"}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-lg shadow overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preview</th>
                            <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                            <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {safeBanners.map((banner) => (
                            <tr key={banner.id}>
                                <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                                    <div 
                                        className="h-10 w-16 sm:w-20 rounded border flex items-center justify-center text-xs overflow-hidden shrink-0"
                                        style={{
                                            backgroundColor: banner.backgroundColor || '#fff',
                                            backgroundImage: banner.backgroundImageUrl ? `url(${banner.backgroundImageUrl})` : 'none',
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center', 
                                        }}
                                    >
                                        {!banner.backgroundImageUrl && "Color"}
                                    </div>
                                </td>
                                <td className="px-3 sm:px-6 py-3 sm:py-4 text-sm text-gray-500 whitespace-nowrap">
                                    <div>Order: {banner.order}</div>
                                    <div className="text-xs text-gray-400">{banner.backgroundImageUrl ? "Image BG" : "Color BG"}</div>
                                </td>
                                <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                                    <span
                                        className={`px-2 inline-flex items-center gap-1.5 text-xs leading-5 font-semibold rounded-full ${
                                            banner.isActive
                                                ? "bg-green-100 text-green-800"
                                                : "bg-gray-100 text-gray-800"
                                        }`}
                                        title={banner.isActive ? "Active" : "Inactive"}
                                    >
                                        {banner.isActive ? <CheckCircle size={14} className="shrink-0" /> : <XCircle size={14} className="shrink-0" />}
                                        <span className="hidden sm:inline">{banner.isActive ? "Active" : "Inactive"}</span>
                                    </span>
                                </td>
                                <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex justify-end">
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (openActionId === banner.id) {
                                                    setOpenActionId(null);
                                                    setDropdownPosition(null);
                                                } else {
                                                    const rect = e.currentTarget.getBoundingClientRect();
                                                    setDropdownPosition({ top: rect.bottom + 4, left: rect.right - 160 });
                                                    setOpenActionId(banner.id ?? null);
                                                }
                                            }}
                                            className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
                                            title="Actions"
                                            aria-expanded={openActionId === banner.id}
                                        >
                                            <MoreVertical size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {safeBanners.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-4 sm:px-6 py-8 text-center text-sm text-gray-500">
                                    No banners found. Create one to get started.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Floating dropdown portal – does not affect table row height */}
            {openActionId && dropdownPosition && (() => {
                const openBanner = safeBanners.find((b) => b.id === openActionId);
                if (!openBanner) return null;
                const close = () => { setOpenActionId(null); setDropdownPosition(null); };
                return createPortal(
                    <>
                        <div
                            className="fixed inset-0 z-[99]"
                            aria-hidden
                            onClick={close}
                        />
                        <div
                            className="fixed w-40 bg-white border rounded-md shadow-lg z-[100] py-1"
                            style={{ top: dropdownPosition.top, left: dropdownPosition.left }}
                        >
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); handleEdit(openBanner); close(); }}
                                className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center gap-2"
                            >
                                <Pencil size={14} /> Edit
                            </button>
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); handleDelete(openBanner.id!); close(); }}
                                disabled={isDeletingBanner}
                                className="w-full text-left px-3 py-2 hover:bg-gray-50 text-red-600 flex items-center gap-2 disabled:opacity-50"
                            >
                                {isDeletingBanner ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                                {isDeletingBanner ? "Deleting…" : "Delete"}
                            </button>
                        </div>
                    </>,
                    document.body
                );
            })()}
        </div>
    );
};

export default Banners;
