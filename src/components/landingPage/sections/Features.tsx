import { motion } from "motion/react";
import { FaClock, FaStar, FaTicket, FaUsers } from "react-icons/fa6";

export default function Features() {
  return (
    <section className="py-24 bg-primary-200 relative z-10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="bg-secondary/20 text-secondary px-4 py-1 rounded-full text-sm font-medium">
              FEATURES
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-secondary mt-4 mb-6">
              Why Choose Tesarus
            </h2>
            <p className="text-secondary-100 max-w-2xl mx-auto text-lg">
              Our platform offers everything you need for a seamless event
              experience.
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {[
            {
              icon: FaTicket,
              title: "Digital Tickets",
              text: "Secure, QR-coded tickets delivered instantly to your device.",
            },
            {
              icon: FaUsers,
              title: "Community Events",
              text: "Connect with like-minded people at curated local and global events.",
            },
            {
              icon: FaStar,
              title: "Exclusive Access",
              text: "Get early access and special offers for premium events.",
            },
            {
              icon: FaClock,
              title: "Real-time Updates",
              text: "Receive instant notifications about event changes and reminders.",
            },
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-primary-300 p-6 rounded-xl shadow-md border border-secondary/10 hover:border-secondary/30 transition-all duration-300 hover:shadow-lg"
            >
              <div className="bg-secondary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <feature.icon className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="text-xl text-secondary font-bold mb-3">
                {feature.title}
              </h3>
              <p className="text-secondary-100">{feature.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
