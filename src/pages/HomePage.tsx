import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import SectionPreview from "../components/SectionPreview";
import Footer from "../components/Footer";
import finlayImg from "../components/img/finlay.jpg";
import { Link } from "react-router-dom";

export default function HomePage() {
  const sections = useQuery(api.sections.list) || [];
  const events = useQuery(api.events.list) || [];
  const latestEvent = events[0]; // Get the most recent event

  return (
    <div>
      {/* Hero Section - Video background removed */}
      <section className="h-screen relative flex items-center justify-center bg-black">
        <div className="relative z-20 text-center">
          <h1 className="text-6xl md:text-8xl font-thin tracking-widest">
            FINLAY HLANNON
          </h1>
          <p className="text-xl md:text-2xl font-light mt-4 tracking-wider text-gray-300">
            PHOTOGRAPHER
          </p>
        </div>
      </section>

      {/* Events Preview Section */}
      {latestEvent && (
        <section className="h-screen flex items-center justify-between px-12">
          <div className="w-1/3 mb-16">
            <h2 className="text-4xl font-light mb-6 tracking-wider">Latest Event</h2>
            <p className="text-gray-300 leading-relaxed mb-4">{latestEvent.name}</p>
            <Link
              to="/events"
              className="text-gray-400 hover:text-white transition-colors uppercase tracking-wider text-sm"
            >
              View All Events →
            </Link>
          </div>
          
          <div className="w-1/2 h-3/4 relative">
            <a
              href={latestEvent.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full h-full relative overflow-hidden group"
            >
              {latestEvent.imageUrl && (
                <img
                  src={latestEvent.imageUrl}
                  alt={latestEvent.name}
                  className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 brightness-75 group-hover:brightness-50"
                />
              )}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-3xl font-light tracking-widest uppercase">
                  View Photos
                </span>
              </div>
            </a>
          </div>
        </section>
      )}

      {/* Section Previews */}
      {sections.map((section) => (
        <section key={section._id}>
          <SectionPreview section={section} />
        </section>
      ))}

      {/* About Section */}
      <section id="about" className="h-screen flex items-center justify-between px-12">
        <div className="w-1/2">
          <h2 className="text-4xl font-light mb-6 tracking-wider">About Me</h2>
          <div className="space-y-4 text-gray-300 leading-relaxed">
            <p>
              I'm Finlay Hlannon, a student photographer discovering my passion behind the lens. 
              As an athlete myself, I've developed a deep appreciation for sports photography, 
              capturing the energy and emotion of my school's athletic events for our social media.
            </p>
            <p>
              Beyond sports, I'm drawn to street photography and the stories found in everyday 
              moments. I'm also eager to explore automotive photography and continue growing my 
              skills across different styles and subjects.
            </p>
          </div>
        </div>
        <div className="w-1/3 h-3/4 bg-gray-800"><img src={finlayImg} alt="Finlay"/></div>      
      </section>

      {/* Contact Section */}
      <section id="contact" className="h-1/2 flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <h2 className="text-4xl font-light mb-8 tracking-wider">Get In Touch</h2>
          <div className="space-y-4">
            <a href="mailto:fin.hlannon@outlook.com" className="text-gray-400 hover:text-white transition-colors">
              Email
            </a>
            <br></br>
            <a href="https://www.instagram.com/finlays.camera" className="text-gray-400 hover:text-white transition-colors">
              Instagram
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}