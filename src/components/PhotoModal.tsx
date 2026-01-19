import { useEffect } from "react";

interface Photo {
  _id: string;
  title: string;
  description: string;
  date: string;
  imageUrl: string;
  mediumUrl?: string | null;
  thumbnailUrl?: string | null;
}

interface PhotoModalProps {
  photo: Photo | null;
  onClose: () => void;
}

export default function PhotoModal({ photo, onClose }: PhotoModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (photo) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [photo, onClose]);

  if (!photo) return null;

  return (
    <div
      className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 md:p-8"
      onClick={onClose}
    >
      <div
        className="max-w-7xl w-full h-full flex flex-col md:flex-row items-center gap-4 md:gap-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Full resolution image - properly contained */}
        <div className="flex-1 h-full flex items-center justify-center overflow-hidden">
          <img
            src={photo.imageUrl} // Always use full resolution for modal
            alt={photo.title}
            className="w-full h-full object-contain"
            loading="eager"
            style={{ maxWidth: '100%', maxHeight: '100%' }}
          />
        </div>
        
        {/* Photo details */}
        <div className="w-full md:w-80 md:h-full md:overflow-y-auto space-y-4 md:space-y-6 p-4 md:p-0">
          <div>
            <h3 className="text-xl md:text-2xl font-light mb-2">{photo.title}</h3>
            <p className="text-gray-400 text-sm uppercase tracking-wider">{photo.date}</p>
          </div>
          <p className="text-gray-300 leading-relaxed text-sm md:text-base">{photo.description}</p>
        </div>
      </div>
      
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 md:top-8 right-4 md:right-8 text-2xl md:text-3xl hover:text-gray-300 transition-colors z-10"
      >
        ×
      </button>
    </div>
  );
}