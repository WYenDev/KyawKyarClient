import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useGetApiBannersActive } from "../services/api";

const Banner = () => {
    const { data: banners, isLoading } = useGetApiBannersActive();
    const [isVisible, setIsVisible] = useState(true);

    const safeBanners = Array.isArray(banners) ? banners : [];

    // If no banners or dismissed, don't render
    if (isLoading || safeBanners.length === 0 || !isVisible) {
        return null;
    }
    
    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 flex flex-col items-center">
            {safeBanners.map((banner) => (
                <div 
                    key={banner.id}
                    className="relative w-full p-4 md:p-3 flex items-center justify-center text-center shadow-lg"
                    style={{
                        backgroundColor: banner.backgroundColor || '#ffffff',
                        backgroundImage: banner.backgroundImageUrl ? `url(${banner.backgroundImageUrl})` : 'none',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        color: isDarkColor(banner.backgroundColor) ? 'white' : 'black',
                    }}
                >
                    {/* Overlay if image is used to ensure text readability? Maybe not for now unless requested */}
                    <div className="container mx-auto max-w-7xl px-8">
                        <span className="font-medium text-sm md:text-base" dangerouslySetInnerHTML={{ __html: banner.text || '' }}></span>
                    </div>

                    <button 
                        onClick={() => setIsVisible(false)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-black/10 transition-colors"
                        aria-label="Close banner"
                    >
                        <X size={18} />
                    </button>
                </div>
            ))}
        </div>
    );
};

// Helper to decide text color based on background hex
function isDarkColor(hex?: string | null) {
    if (!hex) return false;
    // Remove hash
    const color = hex.substring(1); 
    // Convert to RGB
    const r = parseInt(color.substring(0, 2), 16); 
    const g = parseInt(color.substring(2, 4), 16); 
    const b = parseInt(color.substring(4, 6), 16); 
    // HSP equation
    const hsp = Math.sqrt(
        0.299 * (r * r) +
        0.587 * (g * g) +
        0.114 * (b * b)
    );
    return hsp < 127.5;
}

export default Banner;
