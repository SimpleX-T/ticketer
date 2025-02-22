import { useState } from "react";
// import { useAppContext } from "../../contexts/AppContext";
import { HiMiniCheckBadge } from "react-icons/hi2";
import { BsQrCode } from "react-icons/bs";
import { FaTicket } from "react-icons/fa6";
import { motion } from "motion/react";
// import { Event } from "../../types";
import { Link } from "react-router-dom";
import { mockEvents } from "../../utils/constants";

const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");
  // const { addTicket } = useAppContext();

  const filteredEvents = mockEvents.filter((event) =>
    event.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // const handleBuyTicket = (
  //   event: Event,
  //   ticketType: "REGULAR" | "VIP" | "VVIP"
  // ) => {
  //   addTicket({
  //     id: `${event.id}-${Date.now()}`,
  //     name: event.name,
  //     ticketType: event.ticketsType,
  //     type: ticketType,
  //     eventName: event.name,
  //     eventId: event.id,
  //     total: parseInt(event.ticketsType[ticketType]),
  //   });
  // };

  return (
    <div className="min-h-screen bg-white w-full">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-primary-200 overflow-hidden to-primary-100 h-screen">
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

        <div className="relative h-full flex items-center justify-center text-center px-4 z-50">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
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
            <div className="flex gap-4 justify-center">
              <button className="bg-gradient-to-r from-primary-100 to-secondary cursor-pointer hover:from-secondary hover:to-primary-100 text-white px-4 lg:px-8 py-3 rounded-xl text-lg font-semibold transition-colors duration-500">
                Explore Events
              </button>
              <button className="border-2 border-secondary text-secondary hover:bg-primary-100/30 cursor-pointer px-4 lg:px-8 py-3 rounded-xl text-lg font-semibold transition-colors duration-300">
                How It Works
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-20 bg-primary-200 relative z-10">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-secondary text-center mb-16">
            Get Your Ticket in 3 Steps
          </h2>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: FaTicket,
                title: "Choose Event",
                text: "Browse our curated selection of exclusive events available to the public",
              },
              {
                icon: BsQrCode,
                title: "Get Ticket",
                text: "Select your ticket type and complete secure checkout",
              },
              {
                icon: HiMiniCheckBadge,
                title: "Attend",
                text: "Receive digital ticket with QR code for entry",
              },
            ].map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="bg-secondary-300 p-8 rounded-2xl shadow-lg border border-secondary"
              >
                <step.icon className="w-12 h-12 text-secondary mb-6" />
                <h3 className="text-2xl text-secondary font-bold mb-4">
                  {step.title}
                </h3>
                <p className="text-secondary-100">{step.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Events Bento Grid */}
      <section className="py-20 bg-primary container relative mx-auto px-4 z-50">
        <div className="mb-12 z-50">
          <h2 className="text-4xl font-bold text-center text-secondary mb-6">
            Upcoming Events
          </h2>
          <input
            type="text"
            placeholder="Search events..."
            className="max-w-xl w-full mx-auto block p-4 rounded-xl border-2 border-secondary focus:border-secondary-100 text-secondary placeholder:text-secondary-300 focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="gap-6 space-y-6 columns-[350px]">
          {filteredEvents.map((event) => (
            <motion.div key={event.id} className={`relative group`}>
              <Link
                to={`/events/${event.id}`}
                className="h-full block relative bg-primary-300 text-secondary rounded-2xl overflow-hidden shadow-lg border border-secondary-100"
              >
                {event.soldOut && (
                  <div className="absolute inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-10">
                    <span className="text-2xl font-bold text-white">
                      Sold Out
                    </span>
                  </div>
                )}

                <img
                  src={event.image}
                  alt={event.name}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform"
                />

                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-bold">{event.name}</h3>
                    <span className="text-sm truncate bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                      {event.location}
                    </span>
                  </div>

                  <p className="text-secibdary-400 mb-4">{event.description}</p>

                  {/* <div className="space-y-3">
                    {Object.entries(event.prices).map(([type, price]) => (
                      <button
                        key={type}
                        onClick={() =>
                          handleBuyTicket(
                            event,
                            type as "REGULAR" | "VIP" | "VVIP"
                          )
                        }
                        disabled={event.soldOut}
                        className={`w-full flex justify-between items-center p-3 rounded-lg
                            ${
                              event.soldOut
                                ? "bg-gray-100 cursor-not-allowed"
                                : "bg-blue-50 hover:bg-blue-100"
                            }`}
                      >
                        <span>{type}</span>
                        <span className="font-semibold">${price}</span>
                      </button>
                    ))}
                  </div> */}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
