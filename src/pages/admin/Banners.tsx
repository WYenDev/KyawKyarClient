import { useState } from "react";
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

import {
    useGetApiBanners,
    usePostApiBanners,
    usePatchApiBannersId,
    useDeleteApiBannersId,
    usePostApiBannersIdImage,
    useDeleteApiBannersIdImage,
    GetApiBanners200Item
} from "../../services/api";
import { Edit2, Trash2, Plus, Image as ImageIcon, Loader2 } from "lucide-react";
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
    const { data: banners, isLoading, error, isError } = useGetApiBanners();
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    
    // We use the hooks' pending state instead of local state
    const { mutateAsync: uploadImage, isPending: isUploadingImage } = usePostApiBannersIdImage();
    const { mutateAsync: deleteImage, isPending: isDeletingImage } = useDeleteApiBannersIdImage();

    const { mutate: createBanner, isPending: isCreatingBanner } = usePostApiBanners();
    const { mutate: updateBanner, isPending: isUpdatingBanner } = usePatchApiBannersId();
    const { mutate: deleteBanner, isPending: isDeletingBanner } = useDeleteApiBannersId();

    const { register, handleSubmit, reset, setValue, watch, control, formState: { errors } } = useForm<BannerFormInputs>({
        defaultValues: {
            text: "",
            backgroundColor: "#FFFFFF",
            order: 0,
            isActive: true,
        }
    });

    const watchedBgColor = watch("backgroundColor");

    if (isLoading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin" /></div>;
    if (isError) return <div className="p-8 text-red-500">Error loading banners: {(error as Error).message}</div>;

    // Ensure banners is an array to prevent crashes
    const safeBanners = Array.isArray(banners) ? banners : [];
    
    // Debug info
    console.log('Banners data:', banners);

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
                    queryClient.invalidateQueries({ queryKey: ['/api/banners'] });
                    resetForm();
                }
            });
        } else {
            createBanner({
                data: formData as any
            }, {
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ['/api/banners'] });
                    resetForm();
                }
            });
        }
    };

    const handleEdit = (banner: GetApiBanners200Item) => {
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
        try {
            await uploadImage({
                id: isEditing,
                data: { image: file } 
            });
            queryClient.invalidateQueries({ queryKey: ['/api/banners'] });
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
            queryClient.invalidateQueries({ queryKey: ['/api/banners'] });
        } catch (error) {
            console.error("Failed to delete image", error);
            alert("Failed to delete image");
        }
    };

    const handleDelete = (id: string) => {
        if (window.confirm("Are you sure you want to delete this banner?")) {
            deleteBanner({ id }, {
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ['/api/banners'] });
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

    if (isLoading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin" /></div>;

    const isSubmitting = isCreatingBanner || isUpdatingBanner;

    return (
        <div className="px-4 py-6 md:p-6">
            <div className="flex items-center justify-between gap-3 flex-nowrap mb-6">
                <h1 className="text-2xl font-bold flex-1 min-w-0 break-words leading-tight">Banner Management</h1>
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
                <div className="bg-white p-6 rounded-lg shadow mb-8">
                    <h2 className="text-xl font-semibold mb-4">{isEditing ? "Edit Banner" : "Create Banner"}</h2>
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
                                <div className="flex gap-2">
                                    <input
                                        type="color"
                                        {...register("backgroundColor")}
                                        value={watchedBgColor || "#FFFFFF"}
                                        className="h-10 w-20 p-1 border rounded"
                                    />
                                    <input
                                        type="text"
                                        {...register("backgroundColor", { pattern: /^#[0-9A-Fa-f]{6}$/ })}
                                        value={watchedBgColor || "#FFFFFF"}
                                        placeholder="#FFFFFF"
                                        className="flex-1 p-2 border rounded"
                                    />
                                </div>
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

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preview</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Text</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {safeBanners.map((banner) => (
                            <tr key={banner.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div 
                                        className="h-10 w-20 rounded border flex items-center justify-center text-xs overflow-hidden"
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
                                <td className="px-6 py-4">
                                    <div 
                                        className="max-w-xs text-sm text-gray-900 ql-editor !p-0 !min-h-0 !overflow-hidden !max-h-16" 
                                        dangerouslySetInnerHTML={{ __html: banner.text || '' }}
                                        title="Banner Preview"
                                    />
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    <div>Order: {banner.order}</div>
                                    <div className="text-xs text-gray-400">{banner.backgroundImageUrl ? "Image BG" : "Color BG"}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        banner.isActive 
                                            ? "bg-green-100 text-green-800" 
                                            : "bg-gray-100 text-gray-800"
                                    }`}>
                                        {banner.isActive ? "Active" : "Inactive"}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        onClick={() => handleEdit(banner)}
                                        className="text-blue-600 hover:text-blue-900 mr-4"
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
                                <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                                    No banners found. Create one to get started.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Banners;
