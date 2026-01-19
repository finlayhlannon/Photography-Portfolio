import { useState } from "react";

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
  loading?: "lazy" | "eager";
  onClick?: () => void;
  sizes?: string;
  quality?: "low" | "high";
}

export default function ImageWithFallback({
  src,
  alt,
  className = "",
  loading = "lazy",
  onClick,
  sizes = "400px",
  quality = "low"
}: ImageWithFallbackProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Create different quality versions using URL parameters for Convex storage
  const createQualityUrl = (originalUrl: string, targetQuality: "low" | "high") => {
    if (!originalUrl) return originalUrl;
    
    if (targetQuality === "low") {
      // Low quality for thumbnails/previews - much smaller size and lower quality for faster loading
      return `${originalUrl}?width=300&quality=40`;
    } else {
      // High quality for full view - original resolution
      return originalUrl;
    }
  };

  const imageSrc = createQualityUrl(src, quality);

  return (
    <div className={`relative ${onClick ? 'cursor-pointer' : ''}`} onClick={onClick}>
      {!imageLoaded && (
        <div className="absolute inset-0 bg-gray-800 animate-pulse rounded" />
      )}
      
      <img
        src={imageSrc}
        alt={alt}
        className={`${className} transition-opacity duration-300 ${
          imageLoaded ? "opacity-100" : "opacity-0"
        }`}
        loading={loading}
        onLoad={() => setImageLoaded(true)}
        onError={() => setImageError(true)}
        sizes={sizes}
      />
      
      {imageError && (
        <div className="absolute inset-0 bg-gray-800 flex items-center justify-center text-gray-400 text-sm">
          Failed to load image
        </div>
      )}
    </div>
  );
}