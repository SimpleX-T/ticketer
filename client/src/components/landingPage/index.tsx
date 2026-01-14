import Hero from "./sections/Hero";
import HowItWorks from "./sections/HowItWorks";
import Events from "./sections/Events";
import Features from "./sections/Features";
import Testimonials from "./sections/Testimonials";
import CTA from "./sections/CTA";

const Home = () => {
  return (
    <div className="min-h-screen bg-white w-full">
      {/* Hero Section */}
      <Hero />

      {/* How It Works Section */}
      <HowItWorks />

      {/* Events Section */}
      <Events />

      {/* Features Section */}
      <Features />

      {/* Testimonials Section */}
      <Testimonials />

      {/* CTA Section */}
      <CTA />
    </div>
  );
};

export default Home;
