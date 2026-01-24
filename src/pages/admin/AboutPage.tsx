import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Loader2, Save } from "lucide-react";
import { useGetApiAbout, usePostApiAboutImages } from "../../services/api";

const AboutPage = () => {
    const queryClient = useQueryClient();
    const [uploadingDict, setUploadingDict] = useState<Record<number, boolean>>({});

    // ----- QUERIES -----
    const { data: aboutData, isLoading } = useGetApiAbout();
    const images = aboutData?.images ?? [];

    // ----- MUTATIONS -----
    const { mutate: uploadImage } = usePostApiAboutImages({
        mutation: {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["/api/about"] });
            },
            onError: (error) => {
                console.error("Upload failed", error);
                alert("Failed to upload image.");
            },
        },
    });

    // ----- HANDLERS -----
    const handleFileChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        sequenceNumber: number
    ) => {
        if (!e.target.files || !e.target.files[0]) return;

        const file = e.target.files[0];

        // Set local loading state
        setUploadingDict((prev) => ({ ...prev, [sequenceNumber]: true }));

        uploadImage(
            {
                data: {
                    sequenceNumber: sequenceNumber,
                    image: file,
                },
            },
            {
                onSuccess: () => {
                    setUploadingDict((prev) => ({ ...prev, [sequenceNumber]: false }));
                },
                onError: () => {
                    setUploadingDict((prev) => ({ ...prev, [sequenceNumber]: false }));
                },
            }
        );
    };

    // Helper to get image at sequence
    const getImageAt = (seq: number) => images.find((img) => img.sequenceNumber === seq);

    if (isLoading) {
        return <div className="p-8">Loading...</div>;
    }

    return (
        <div className="bg-[#F8F9FB] min-h-full p-8">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-2xl font-semibold text-gray-900 mb-6">
                    About Page Images
                </h1>

                <div className="bg-white rounded-2xl shadow-sm p-8">
                    <p className="text-gray-500 mb-8">
                        Upload up to 4 images. These will be displayed on the About page.
                        Use the sequence number to order them (0-3).
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {[0, 1, 2, 3].map((seq) => {
                            const img = getImageAt(seq);
                            const isUploading = uploadingDict[seq];

                            return (
                                <div
                                    key={seq}
                                    className="border rounded-xl p-4 flex flex-col gap-4"
                                >
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium text-gray-700">
                                            Sequence #{seq}
                                        </span>
                                        {/* Status badge if needed */}
                                    </div>

                                    <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden relative group border-2 border-dashed border-gray-300 flex items-center justify-center">
                                        {img ? (
                                            <>
                                                <img
                                                    src={img.url}
                                                    alt={`Sequence ${seq}`}
                                                    className="w-full h-full object-cover"
                                                />
                                                {/* Overlay for replacing */}
                                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                                                    <label className="cursor-pointer bg-white text-black px-4 py-2 rounded-lg font-medium hover:bg-gray-100">
                                                        Replace
                                                        <input
                                                            type="file"
                                                            className="hidden"
                                                            accept="image/*"
                                                            onChange={(e) => handleFileChange(e, seq)}
                                                        />
                                                    </label>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="text-center">
                                                <label className="cursor-pointer flex flex-col items-center gap-2 text-gray-500 hover:text-indigo-600 transition p-4">
                                                    <div className="p-3 bg-white rounded-full shadow-sm">
                                                        <Plus size={24} />
                                                    </div>
                                                    <span className="text-sm font-medium">
                                                        Upload Image
                                                    </span>
                                                    <input
                                                        type="file"
                                                        className="hidden"
                                                        accept="image/*"
                                                        onChange={(e) => handleFileChange(e, seq)}
                                                    />
                                                </label>
                                            </div>
                                        )}

                                        {isUploading && (
                                            <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
                                                <Loader2 className="animate-spin text-indigo-600" />
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="text-xs text-gray-400">
                                        Recommended size: 800x600 or similar aspect ratio.
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
