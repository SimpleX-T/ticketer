import { useState } from "react";
import { useAppContext } from "../../contexts/AppContext";
import { HiMiniCheckBadge } from "react-icons/hi2";
import { BsQrCode } from "react-icons/bs";
import { FaTicket } from "react-icons/fa6";
import { motion } from "motion/react";
import { Event } from "../../types";
import { Link } from "react-router-dom";
import { generateRandomId } from "../../utils/helpers";

const mockEvents: Event[] = [
  {
    id: generateRandomId(),
    name: "Summer Music Festival",
    date: "2024-07-15",
    location: "Central Park, New York",
    description:
      "Annual summer music festival featuring top artists from around the world.",
    image:
      "https://i.pinimg.com/736x/b3/dc/9c/b3dc9c80a7f08f69383415a79317ac4b.jpg",
    prices: {
      REGULAR: "50",
      VIP: "150",
      VVIP: "300",
    },
    soldOut: false,
  },
  {
    id: generateRandomId(),
    name: "Tech Conference 2024",
    date: "2024-08-20",
    location: "Convention Center, San Francisco",
    description:
      "The biggest tech conference of the year, featuring keynote speakers and workshops.",
    image:
      "https://i.pinimg.com/736x/cd/cf/09/cdcf0988ae7baec4e52d6214a5198d4b.jpg",
    prices: {
      REGULAR: "100",
      VIP: "250",
      VVIP: "500",
    },
    soldOut: true,
  },
  {
    id: generateRandomId(),
    name: "Food & Wine Expo",
    date: "2024-09-10",
    location: "Metro Toronto Convention Centre",
    description:
      "A culinary extravaganza showcasing the best food and wine from around the globe.",
    image:
      "https://i.pinimg.com/736x/cd/cf/09/cdcf0988ae7baec4e52d6214a5198d4b.jpg",
    prices: {
      REGULAR: "40",
      VIP: "120",
      VVIP: "250",
    },
    soldOut: false,
  },
  {
    id: generateRandomId(),
    name: "Comic Con 2025",
    date: "2025-10-03",
    location: "San Diego Convention Center",
    description:
      "The ultimate pop culture event featuring celebrities, panels, and exclusive merchandise.",
    image:
      "https://i.pinimg.com/736x/36/73/d4/3673d463776873e57195d2dfbac48d58.jpg",
    prices: {
      REGULAR: "75",
      VIP: "200",
      VVIP: "400",
    },
    soldOut: false,
  },
  {
    id: generateRandomId(),
    name: "Winter Wonderland",
    date: "2024-12-20",
    location: "Hyde Park, London",
    description:
      "A magical winter festival with ice skating, festive markets, and live entertainment.",
    image:
      "https://i.pinimg.com/736x/5b/25/3b/5b253bc89176bc94f14a02af61182176.jpg",
    prices: {
      REGULAR: "30",
      VIP: "80",
      VVIP: "150",
    },
    soldOut: false,
  },
  {
    id: generateRandomId(),
    name: "E-Sports Championship",
    date: "2024-11-15",
    location: "Staples Center, Los Angeles",
    description:
      "Watch the world's best gamers compete in this high-stakes e-sports tournament.",
    image:
      "https://i.pinimg.com/736x/1d/dc/ad/1ddcad35dd9f6df59114e9d9832dbd0c.jpg",
    prices: {
      REGULAR: "60",
      VIP: "180",
      VVIP: "350",
    },
    soldOut: false,
  },
  {
    id: generateRandomId(),
    name: "Jazz Nights",
    date: "2024-06-25",
    location: "Blue Note, Tokyo",
    description:
      "An intimate evening of smooth jazz performances by legendary artists.",
    image: "https://source.unsplash.com/random/800x600/?jazz,music",
    prices: {
      REGULAR: "70",
      VIP: "200",
      VVIP: "400",
    },
    soldOut: false,
  },
  {
    id: generateRandomId(),
    name: "Marathon 2024",
    date: "2024-04-14",
    location: "Boston, Massachusetts",
    description:
      "Join thousands of runners in one of the world's most prestigious marathons.",
    image: "https://source.unsplash.com/random/800x600/?marathon,running",
    prices: {
      REGULAR: "20",
      VIP: "50",
      VVIP: "100",
    },
    soldOut: true,
  },
  {
    id: generateRandomId(),
    name: "Art Basel",
    date: "2024-12-05",
    location: "Miami Beach, Florida",
    description:
      "A premier art fair showcasing contemporary works from leading galleries.",
    image:
      "https://i.pinimg.com/736x/0a/6d/95/0a6d95b2fd58623e878b10a656424079.jpg",
    prices: {
      REGULAR: "80",
      VIP: "250",
      VVIP: "500",
    },
    soldOut: false,
  },
  {
    id: generateRandomId(),
    name: "Film Festival",
    date: "2024-05-22",
    location: "Cannes, France",
    description:
      "Celebrate the art of cinema with screenings, red carpets, and celebrity appearances.",
    image:
      "https://i.pinimg.com/736x/81/87/7a/81877a9702109d20755036ae1d4fc48d.jpg",
    prices: {
      REGULAR: "100",
      VIP: "300",
      VVIP: "600",
    },
    soldOut: false,
  },
  {
    id: generateRandomId(),
    name: "Startup Summit",
    date: "2024-09-30",
    location: "Austin, Texas",
    description:
      "A gathering of innovators, entrepreneurs, and investors shaping the future of tech.",
    image:
      "https://i.pinimg.com/736x/17/63/cb/1763cb885cfdcc8bdf19014ad375457c.jpg",
    prices: {
      REGULAR: "90",
      VIP: "220",
      VVIP: "450",
    },
    soldOut: false,
  },
  {
    id: generateRandomId(),
    name: "Fashion Week",
    date: "2024-03-15",
    location: "Paris, France",
    description:
      "Experience the latest trends and collections from top fashion designers.",
    image: "https://source.unsplash.com/random/800x600/?fashion,runway",
    prices: {
      REGULAR: "150",
      VIP: "400",
      VVIP: "800",
    },
    soldOut: false,
  },
  {
    id: generateRandomId(),
    name: "Beer Festival",
    date: "2024-08-10",
    location: "Munich, Germany",
    description:
      "Celebrate the finest beers from around the world with live music and food stalls.",
    image: "https://source.unsplash.com/random/800x600/?beer,festival",
    prices: {
      REGULAR: "25",
      VIP: "60",
      VVIP: "120",
    },
    soldOut: false,
  },
  {
    id: generateRandomId(),
    name: "Space Exploration Expo",
    date: "2024-07-30",
    location: "Kennedy Space Center, Florida",
    description:
      "Discover the future of space travel with interactive exhibits and expert talks.",
    image: "https://source.unsplash.com/random/800x600/?space,rocket",
    prices: {
      REGULAR: "50",
      VIP: "120",
      VVIP: "250",
    },
    soldOut: false,
  },
  {
    id: generateRandomId(),
    name: "Yoga Retreat",
    date: "2024-06-10",
    location: "Bali, Indonesia",
    description:
      "Rejuvenate your mind and body with a week-long yoga retreat in paradise.",
    image: "https://source.unsplash.com/random/800x600/?yoga,retreat",
    prices: {
      REGULAR: "200",
      VIP: "500",
      VVIP: "1000",
    },
    soldOut: false,
  },
];

const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { addTicket } = useAppContext();

  const filteredEvents = mockEvents.filter((event) =>
    event.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBuyTicket = (
    event: Event,
    ticketType: "REGULAR" | "VIP" | "VVIP"
  ) => {
    addTicket({
      id: `${event.id}-${Date.now()}`,
      name: event.name,
      price: event.prices[ticketType],
      type: ticketType,
      eventName: event.name,
      eventId: event.id,
      total: parseInt(event.prices[ticketType]),
    });
  };

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
              <button className="bg-gradient-to-r from-primary-100 to-secondary cursor-pointer hover:from-secondary hover:to-primary-100 text-white px-8 py-3 rounded-xl text-lg font-semibold transition-colors duration-500">
                Explore Events
              </button>
              <button className="border-2 border-secondary text-white hover:bg-primary-100/30 cursor-pointer px-8 py-3 rounded-xl text-lg font-semibold transition-colors duration-300">
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
                text: "Browse our curated selection of exclusive events",
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
      <section className="py-20 container relative mx-auto px-4 z-50">
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredEvents.map((event, index) => (
            <motion.div
              key={event.id}
              className={`relative group ${
                index === 0 || index === 3 ? "md:col-span-2" : ""
              }`}
            >
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

                  <div className="space-y-3">
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
                  </div>
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
