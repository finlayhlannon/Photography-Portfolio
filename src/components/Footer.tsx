import { Link } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function Footer() {
  const sections = useQuery(api.sections.list) || [];

  return (
    <footer className="bg-black border-t border-gray-800 py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-light mb-4 tracking-wider">FINLAY HLANNON</h3>
            <p className="text-gray-400 text-sm">
              Student Photograher
            </p>
          </div>
          
          <div>
            <h4 className="text-sm uppercase tracking-wider mb-4 text-gray-300">Portfolio</h4>
            <ul className="space-y-2">
              {sections.map((section) => (
                <li key={section._id}>
                  <Link
                    to={`/section/${section._id}`}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {section.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm uppercase tracking-wider mb-4 text-gray-300">About</h4>
            <ul className="space-y-2">
              <li>
                <a href="#about" className="text-gray-400 hover:text-white transition-colors text-sm">
                  About Me
                </a>
              </li>
              <li>
                <a href="#contact" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Contact
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm uppercase tracking-wider mb-4 text-gray-300">Connect</h4>
            <ul className="space-y-2">
              <li>
                <a href="https://www.instagram.com/finlays.camera" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Instagram
                </a>
              </li>
              <li>
                <a href="mailto:fin.hlannon@outlook.com" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Email
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2026 Finlay Hlannon. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
