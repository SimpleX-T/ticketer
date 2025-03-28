import {
  FaCalendarAlt,
  FaTicketAlt,
  FaImage,
  FaUsers,
  FaRocket,
} from "react-icons/fa";
import { Link } from "react-router-dom";

export default function AboutUs() {
  return (
    <main className="w-full min-h-screen bg-gradient-to-br from-primary via-primary-200 to-primary-100 py-24 px-6">
      <section className="max-w-4xl mx-auto text-white">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About Terasus</h1>
          <p className="text-lg md:text-xl text-secondary-100 max-w-2xl mx-auto">
            We’re here to make event planning effortless and unforgettable.
            Terasus empowers organizers to create, manage, and share events with
            ease, connecting people through memorable experiences.
          </p>
        </div>

        {/* Mission Section */}
        <div className="bg-primary-300 rounded-xl shadow-lg p-8 mb-12 border border-secondary/20">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <FaRocket className="text-secondary" /> Our Mission
          </h2>
          <p className="text-secondary-100">
            At Terasus, we believe every event deserves to shine. Our mission is
            to streamline the chaos of planning into a seamless process, giving
            you the tools to craft events that inspire, engage, and bring people
            together—whether it’s a local meetup or a global conference.
          </p>
        </div>

        {/* Features Section */}
        <div className="space-y-12">
          <h2 className="text-2xl font-semibold text-center">What We Do</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Feature 1: Event Creation */}
            <div className="bg-primary-200 p-6 rounded-lg shadow-md border border-secondary/10 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-3 mb-3">
                <FaCalendarAlt className="text-secondary text-2xl" />
                <h3 className="text-xl font-medium">
                  Create Events Effortlessly
                </h3>
              </div>
              <p className="text-secondary-100 text-sm">
                From start to finish, build your event with a sleek form. Set
                dates, locations, and descriptions in minutes, all within an
                intuitive interface designed for speed and simplicity.
              </p>
            </div>

            {/* Feature 2: Ticket Management */}
            <div className="bg-primary-200 p-6 rounded-lg shadow-md border border-secondary/10 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-3 mb-3">
                <FaTicketAlt className="text-secondary text-2xl" />
                <h3 className="text-xl font-medium">Flexible Ticket Types</h3>
              </div>
              <p className="text-secondary-100 text-sm">
                Offer multiple ticket options—free, paid, or VIP. Manage
                capacities, track sales, and ensure every attendee has the
                perfect entry, all in real-time.
              </p>
            </div>

            {/* Feature 3: Image Uploads */}
            <div className="bg-primary-200 p-6 rounded-lg shadow-md border border-secondary/10 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-3 mb-3">
                <FaImage className="text-secondary text-2xl" />
                <h3 className="text-xl font-medium">Stunning Visuals</h3>
              </div>
              <p className="text-secondary-100 text-sm">
                Upload event images or link to URLs to showcase your vision.
                Preview them instantly, making your event pop with vibrant,
                eye-catching visuals.
              </p>
            </div>

            {/* Feature 4: Community Connection */}
            <div className="bg-primary-200 p-6 rounded-lg shadow-md border border-secondary/10 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-3 mb-3">
                <FaUsers className="text-secondary text-2xl" />
                <h3 className="text-xl font-medium">Connect & Engage</h3>
              </div>
              <p className="text-secondary-100 text-sm">
                Bring people together with events that spark interaction. Share
                your creations instantly and let attendees discover what’s next,
                wherever they are.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <p className="text-lg text-secondary-100 mb-6">
            Ready to bring your next event to life?
          </p>
          <Link
            to="/create-event"
            className="inline-flex items-center gap-2 px-6 py-3 bg-secondary text-white font-medium rounded-lg hover:bg-secondary-200 focus:ring-2 focus:ring-secondary-500 transition-all duration-300"
          >
            Get Started <FaRocket size={16} />
          </Link>
        </div>
      </section>
    </main>
  );
}
