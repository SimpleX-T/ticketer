import { motion } from "motion/react";
import { FaQuoteLeft } from "react-icons/fa6";

export default function Testimonials() {
  return (
    <section className="py-24 bg-primary relative z-10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="bg-secondary/20 text-secondary px-4 py-1 rounded-full text-sm font-medium">
              TESTIMONIALS
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-secondary mt-4 mb-6">
              What Our Users Say
            </h2>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              name: "Sarah Johnson",
              role: "Event Attendee",
              text: "Tesarus made it so easy to find and book tickets for my favorite concert. The digital ticket system is seamless and I love getting updates about events!",
              avatar:
                "https://dwpdigital.blog.gov.uk/wp-content/uploads/sites/197/2016/07/P1090594-1.jpeg",
            },
            {
              name: "Michael Chen",
              role: "Event Organizer",
              text: "As an event organizer, I've tried many platforms, but Tesarus offers the best tools for managing ticket sales and attendee information. Highly recommended!",
              avatar:
                "https://images.ctfassets.net/lh3zuq09vnm2/yBDals8aU8RWtb0xLnPkI/19b391bda8f43e16e64d40b55561e5cd/How_tracking_user_behavior_on_your_website_can_improve_customer_experience.png",
            },
            {
              name: "Olivia Williams",
              role: "Regular User",
              text: "I've discovered so many amazing local events through Tesarus that I wouldn't have found otherwise. The interface is intuitive and the ticket process is hassle-free.",
              avatar:
                "https://dentalia.orionthemes.com/demo-1/wp-content/uploads/2016/10/dentalia-demo-deoctor-5-1-750x750.jpg",
            },
          ].map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-primary-300 p-8 rounded-2xl shadow-lg border border-secondary/10 relative"
            >
              <div className="absolute -top-6 left-8 w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-white">
                <FaQuoteLeft className="rotate-15" />
              </div>
              <p className="text-secondary-100 mb-6 italic">
                "{testimonial.text}"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-secondary/20 mr-4 overflow-hidden">
                  {testimonial.avatar ? (
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <div className="w-full h-full bg-secondary/40 flex items-center justify-center text-white font-bold">
                      {testimonial.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="text-secondary font-bold">
                    {testimonial.name}
                  </h4>
                  <p className="text-secondary/70 text-sm">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
