// import { Search } from "lucide-react";
// import { useState } from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";

export default function Hero() {
  // const [query, setQuery] = useState("");
  return (
    <section className="relative bg-gradient-to-br from-primary via-primary-200 overflow-hidden to-primary-100 min-h-screen">
      <div className="absolute top-full -translate-y-[100px] md:-translate-y-[150px] blur-[7px] w-full aspect-square rounded-[1000vh] border-[10px] border-secondary z-[2] " />
      <div
        style={{
          backgroundColor: "var(--color-primary)",
          backgroundImage:
            "linear-gradient(#24A0B51e 1px,transparent 0),linear-gradient(90deg,#24A0B51e 1px,transparent 0)",
          WebkitBackgroundSize: "8rem 8rem",
          backgroundSize: "7rem 7rem",
          width: "100%",
          height: "100%",
          position: "fixed",
          top: 0,
          left: 0,
          // zIndex: -1,
        }}
      />

      <div className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 z-50 pt-20 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto"
        >
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Experience Events <br />
            <span className="bg-gradient-to-tr from-primary-100 to-secondary bg-clip-text text-transparent">
              Like Never Before
            </span>
          </h1>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Secure your spot at the most exclusive events with digital tickets
            that unlock unforgettable experiences.
          </p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="max-w-3xl mx-auto mb-10 relative"
          >
            {/* <div className="relative flex items-center">
              <div className="absolute left-4 text-secondary/70">
                <Search size={20} />
              </div>
              <input
                type="text"
                placeholder="Search for events, concerts, workshops..."
                className="w-full p-4 pl-12 pr-4 rounded-full border-2 border-secondary/30 focus:border-secondary/70 text-secondary bg-white/90 backdrop-blur-sm placeholder:text-secondary/50 focus:outline-none shadow-lg"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div> */}

            {/* Category Pills */}
            {/* <div className="flex flex-wrap justify-center gap-2 mt-4">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setCategoryFilter(category.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${
                      categoryFilter === category.id
                        ? "bg-secondary text-white"
                        : "bg-white/80 text-secondary hover:bg-white"
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div> */}
          </motion.div>

          <div className="flex gap-4 justify-center">
            <Link
              to="/events"
              className="bg-gradient-to-r from-primary-100 to-secondary cursor-pointer hover:from-secondary hover:to-primary-100 text-white px-4 lg:px-8 py-3 rounded-xl text-lg font-semibold transition-colors duration-500"
            >
              Explore Events
            </Link>
            <a
              href="#how-it-works"
              className="border-2 border-secondary text-secondary hover:bg-primary-100/30 cursor-pointer px-4 lg:px-8 py-3 rounded-xl text-lg font-semibold transition-colors duration-300"
            >
              How It Works
            </a>
          </div>
        </motion.div>

        {/* Featured Event Preview */}
        {/* <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-12 max-w-md mx-auto relative"
          >
            <div className="absolute -inset-1.5 bg-gradient-to-r from-secondary to-primary-100 rounded-2xl blur opacity-30"></div>
            <div className="relative bg-primary-300/80 backdrop-blur-sm p-2 rounded-2xl border border-secondary/20 shadow-xl">
              <img
                src="/featured-event-preview.jpg"
                alt="Featured Event"
                className="w-full h-48 object-cover rounded-xl opacity-80"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-secondary/80 backdrop-blur-sm p-3 rounded-lg text-left">
                <p className="text-xs text-white/70">FEATURED EVENT</p>
                <h3 className="text-white font-bold">
                  Summer Music Festival 2025
                </h3>
              </div>
            </div>
          </motion.div> */}
      </div>
    </section>
  );
}
