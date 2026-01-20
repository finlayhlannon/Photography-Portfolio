import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Footer from "../components/Footer";

export default function EventsPage() {
  const events = useQuery(api.events.list) || [];

  return (
    <div>
      {/* Hero Section */}
      <section className="h-screen relative flex items-center justify-center bg-black">
        <div className="relative z-20 text-center px-4">
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-thin tracking-widest">
            EVENTS
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl font-light mt-4 tracking-wider text-gray-300">
            LINKS TO PHOTO FOLDERS
          </p>
        </div>
      </section>

      {/* Events List */}
      <section className="md:min-h-screen py-6 md:py-12 px-6 md:px-12">
        <div className="max-w-6xl mx-auto space-y-3 md:space-y-6">
          {events.length === 0 ? (
            <p className="text-center text-gray-400 text-xl">No events yet</p>
          ) : (
            events.map((event) => (
              <a
                key={event._id}
                href={event.link}
                target="_blank"
                rel="noopener noreferrer"
                className="event-banner block relative overflow-hidden group"
              >
                {event.imageUrl && (
                  <img
                    src={event.imageUrl}
                    alt={event.name}
                    className="event-banner-image w-full h-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <h2 className="text-3xl md:text-5xl font-light tracking-widest text-white uppercase">
                    {event.name}
                  </h2>
                </div>
              </a>
            ))
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
