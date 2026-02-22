import Navbar from "../../components/navbar/Navbar";
import About from "./About";
import Footer from "./Footer";
import Hero from './Hero';
import Services from "./Services";
import TestimonialsSection from "../../components/TestimonialsSection";
import WhatsAppFloatingButton from "../../components/WhatsAppFloatingButton";
import { Helmet } from 'react-helmet-async';

const Home = () => {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "LegalService",
    "name": "Wakili - Kenya's Legal Services Platform",
    "description": "Find verified Kenyan lawyers for family law, land disputes, business registration, employment law, debt recovery, and more. Get legal advice, document drafting, and court representation within 2 hours.",
    "url": "https://wakili.co.ke",
    "telephone": "+254112810203",
    "areaServed": "KE",
    "priceRange": "KES 2000-500000",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "ratingCount": "500"
    },
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "KE",
      "addressRegion": "Kenya"
    },
    "knowsAbout": [
      "Family Law",
      "Land Law",
      "Business Registration",
      "Employment Law",
      "Debt Recovery",
      "Contract Review",
      "Divorce in Kenya",
      "Landlord-Tenant Law",
      "Wills and Succession"
    ]
  };

  return (
    <>
      <Helmet>
        <title>Wakili - Find a Lawyer in Kenya | Legal Services for Family, Land, Business Law</title>
        <meta name="description" content="Get verified Kenyan lawyers for family law, land disputes, business registration, employment issues, debt recovery & more. Legal consultation in 2 hours. 500+ cases won." />
        <meta name="keywords" content="lawyer in Kenya, legal services Kenya, divorce lawyer, land law, business registration, employment law, debt recovery, Nairobi lawyer" />
        <meta property="og:title" content="Wakili - Find a Lawyer in Kenya | Legal Services Platform" />
        <meta property="og:description" content="Verified lawyers for family, land, business & employment law. Fast legal advice, document drafting & court representation in Kenya." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://wakili.co.ke" />
        <meta name="author" content="Wakili Legal Services Kenya" />
        <meta name="robots" content="index, follow" />
        <meta name="canonical" content="https://wakili.co.ke" />
        <script type="application/ld+json">
          {JSON.stringify(schemaData)}
        </script>
      </Helmet>
      
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
    </>
  );
}

export default Home;