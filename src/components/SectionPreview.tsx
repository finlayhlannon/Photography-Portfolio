import { useState } from "react";
import { Link } from "react-router-dom";

interface SectionPreviewProps {
  section: {
    _id: string;
    name: string;
    description: string;
    coverImageUrl: string | null;
  };
}

export default function SectionPreview({ section }: SectionPreviewProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="h-screen flex items-center justify-between px-12">
      <div className="w-1/3 mb-16">
        <h2 className="text-4xl font-light mb-6 tracking-wider">{section.name}</h2>
        <p className="text-gray-300 leading-relaxed">{section.description}</p>
      </div>
      
      <div className="w-1/2 h-3/4 relative">
        <Link
          to={`/section/${section._id}`}
          className="block w-full h-full relative overflow-hidden"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {section.coverImageUrl && (
            <img
              src={section.coverImageUrl}
              alt={section.name}
              className={`w-full h-full object-cover transition-all duration-500 ${
                isHovered ? "scale-110 brightness-50" : "brightness-75"
              }`}
            />
          )}
          <div
            className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          >
            <span className="text-3xl font-light tracking-widest uppercase">
              {section.name}
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
}
