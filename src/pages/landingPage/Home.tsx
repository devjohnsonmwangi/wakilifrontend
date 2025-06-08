import Navbar from "../../components/navbar/Navbar";
import About from "./About";
import Footer from "./Footer";
import Hero from './Hero';
import Services from "./Services";

const Home = () => {
  return (
    // Main container for the page content
    // pt-16: Padding top for the fixed top navbar
    // pb-16: Padding bottom for the fixed bottom mobile navbar
    // lg:pb-0: On large screens and up, remove bottom padding as the mobile bottom navbar is hidden
    <div className="pt-16 pb-16 lg:pb-0">
    
      <Navbar />

      {/* Hero Section */}
      
      <section id="hero">
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

      {/* Footer Section */}
    
      <Footer />
    </div>
  );
}

export default Home;