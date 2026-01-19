import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import PhotoModal from "../components/PhotoModal";
import Footer from "../components/Footer";
import ImageWithFallback from "../components/ImageWithFallback";

export default function SectionPage() {
  const { id } = useParams<{ id: string }>();
  const [selectedPhoto, setSelectedPhoto] = useState<any>(null);
  const [columns, setColumns] = useState(4);
  
  const section = useQuery(api.sections.get, id ? { id: id as any } : "skip");
  const photos = useQuery(api.photos.listBySection, id ? { sectionId: id as any } : "skip");

  // Responsive columns - more columns for smaller images
  useEffect(() => {
    const updateColumns = () => {
      if (window.innerWidth < 640) setColumns(2);
      else if (window.innerWidth < 768) setColumns(3);
      else if (window.innerWidth < 1024) setColumns(4);
      else setColumns(5);
    };

    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, []);

  if (!section || !photos) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Distribute photos across columns for masonry layout
  const photoColumns: any[][] = Array.from({ length: columns }, () => []);
  const tempHeights = new Array(columns).fill(0);

  photos.forEach((photo) => {
    const shortestColumnIndex = tempHeights.indexOf(Math.min(...tempHeights));
    photoColumns[shortestColumnIndex].push(photo);
    tempHeights[shortestColumnIndex] += 150 + Math.random() * 100;
  });

  return (
    <div className="pt-20">
      {/* Header */}
      <div className="container mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-5xl font-light tracking-wider mb-4">{section.name}</h1>
            <p className="text-gray-300 text-lg max-w-2xl">{section.description}</p>
          </div>
          <Link
            to="/"
            className="text-gray-400 hover:text-white transition-colors uppercase tracking-wider text-sm"
          >
            ← Back to Home
          </Link>
        </div>
      </div>

      {/* Masonry Photo Grid */}
      <div className="container mx-auto px-6 pb-20">
        <div className="flex gap-2 md:gap-3">
          {photoColumns.map((columnPhotos, columnIndex) => (
            <div key={columnIndex} className="flex-1 space-y-2 md:space-y-3">
              {columnPhotos.map((photo) => (
                <div
                  key={photo._id}
                  className="cursor-pointer group relative rounded-sm"
                  onClick={() => setSelectedPhoto(photo)}
                >
                  <ImageWithFallback
                    src={photo.imageUrl || ''}
                    alt={photo.title}
                    className="w-full h-auto transition-all duration-300 group-hover:brightness-75"
                    loading="lazy"
                    sizes="400px"
                    quality="low"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="text-center px-2">
                      <h3 className="text-white text-xs md:text-sm font-light truncate">{photo.title}</h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <PhotoModal
        photo={selectedPhoto}
        onClose={() => setSelectedPhoto(null)}
      />

      <Footer />
    </div>
  );
}