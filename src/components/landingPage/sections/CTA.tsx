import { motion } from "motion/react";
import { Link } from "react-router-dom";

export default function CTA() {
  return (
    <section className="py-20 bg-gradient-to-r from-primary-100 to-secondary relative z-10">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Experience Amazing Events?
          </h2>
          <p className="text-white/80 text-lg mb-8">
            Join thousands of users who discover and attend events through
            Tesarus every day.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/events"
              className="bg-white text-secondary hover:bg-white/90 px-8 py-3 rounded-xl text-lg font-semibold transition-colors duration-300"
            >
              Browse Events
            </Link>
            <Link
              to="/create-event"
              className="border-2 border-white text-white hover:bg-white/10 px-8 py-3 rounded-xl text-lg font-semibold transition-colors duration-300"
            >
              Host Your Event
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
