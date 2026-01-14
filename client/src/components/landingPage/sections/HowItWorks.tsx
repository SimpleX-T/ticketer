import { motion } from "motion/react";
import { BsQrCode } from "react-icons/bs";
import { FaTicket } from "react-icons/fa6";
import { HiMiniCheckBadge } from "react-icons/hi2";
import { Link } from "react-router-dom";

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-primary-200 relative z-10">
      <div className="container mx-auto px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="bg-secondary/20 text-secondary px-4 py-1 rounded-full text-sm font-medium">
              SIMPLE PROCESS
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-secondary mt-4 mb-6">
              How Tesarus Works
            </h2>
            <p className="text-secondary-100 max-w-2xl mx-auto text-lg">
              Our streamlined platform makes it easy to discover, purchase, and
              manage tickets for your favorite events.
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto relative">
          {/* Connecting Line (Desktop) */}
          {/* <div
              className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-primary-100 to-secondary hidden md:block"
              style={{ transform: "translateY(-50%)" }}
            /> */}

          {[
            {
              icon: FaTicket,
              title: "Find Your Event",
              text: "Browse our curated selection of exclusive events or use our powerful search to find exactly what you're looking for.",
              number: "01",
            },
            {
              icon: BsQrCode,
              title: "Secure Your Ticket",
              text: "Choose your preferred ticket type, complete a secure checkout process, and receive your digital ticket instantly.",
              number: "02",
            },
            {
              icon: HiMiniCheckBadge,
              title: "Enjoy The Experience",
              text: "Present your digital ticket with QR code at the venue for seamless entry and enjoy an unforgettable experience.",
              number: "03",
            },
          ].map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              viewport={{ once: true }}
              className="bg-secondary-300 p-8 rounded-2xl shadow-xl border border-secondary relative z-10"
            >
              <div className="absolute -top-5 -right-5 w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-white font-bold text-lg shadow-lg">
                {step.number}
              </div>
              <div className="bg-secondary/10 w-20 h-20 rounded-full flex items-center justify-center mb-6">
                <step.icon className="w-10 h-10 text-secondary" />
              </div>
              <h3 className="text-2xl text-secondary font-bold mb-4">
                {step.title}
              </h3>
              <p className="text-secondary-100">{step.text}</p>

              {/* {index < 2 && (
                  <div className="absolute -right-4 top-1/2 w-8 h-8 bg-secondary text-white rounded-full flex items-center justify-center transform translate-x-1/2 -translate-y-1/2 z-20 md:block ">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )} */}
            </motion.div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link
            to="/events"
            className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-white px-6 py-3 rounded-xl text-lg font-medium transition-colors duration-300"
          >
            <span>Find Events Now</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
