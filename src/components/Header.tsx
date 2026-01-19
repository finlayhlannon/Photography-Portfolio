import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function Header() {
  const [isVisible, setIsVisible] = useState(false);
  const sections = useQuery(api.sections.list) || [];

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setIsVisible(e.clientY < 100);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm border-b border-gray-800 transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <nav className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-xl font-light tracking-wider">
            FINLAY HLANNON
          </Link>
          <div className="flex space-x-8">
            {sections.map((section) => (
              <Link
                key={section._id}
                to={`/section/${section._id}`}
                className="text-sm uppercase tracking-wider hover:text-gray-300 transition-colors"
              >
                {section.name}
              </Link>
            ))}
            <a href="../#about" className="text-sm uppercase tracking-wider hover:text-gray-300 transition-colors">
              About
            </a>
            <a href="../#contact" className="text-sm uppercase tracking-wider hover:text-gray-300 transition-colors">
              Contact
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
}
