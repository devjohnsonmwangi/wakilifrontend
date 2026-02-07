import Navbar from "../../components/navbar/Navbar";
import About from "./About";
import Footer from "./Footer";
import Hero from './Hero';
import Services from "./Services";
import TestimonialsSection from "../../components/TestimonialsSection";
import WhatsAppFloatingButton from "../../components/WhatsAppFloatingButton";

const Home = () => {
  return (
    // Main container for the page content
    // pt-16: Padding top for the fixed top navbar
    // pb-16: Padding bottom for the fixed bottom mobile navbar
    // lg:pb-0: On large screens and up, remove bottom padding as the mobile bottom navbar is hidden
    <div className="min-h-screen">
    
      <Navbar />

      {/* Hero Section */}
      <section id="hero" className="relative">
        <Hero />
      </section>

      {/* About Section */}
      <section id="about">
        <About />
      </section>

      {/* Services Section */}
      <section id="services">
        <Services />
      </section>

      {/* Testimonials Section */}
      <section id="testimonials">
        <TestimonialsSection />
      </section>

      {/* Footer Section */}
    
      <Footer />

      {/* WhatsApp Floating Button */}
      <WhatsAppFloatingButton 
        phoneNumber="+254112810203"
        message="Hello! I would like to inquire about your legal services. Can you help me?"
      />
    </div>
  );
}

export default Home;