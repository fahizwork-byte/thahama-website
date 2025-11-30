/**
 * Home Page - Server Component (Main Entry Point)
 * 
 * This is the main page component. It's a server component that imports
 * client components only where needed (for animations and interactivity).
 * 
 * Performance optimizations:
 * - Main page is server-rendered for better SEO and initial load
 * - Client components are only used where interactivity is required
 * - Static content (Footer) is server-rendered
 * 
 * @component
 * @returns {JSX.Element} Complete homepage with all sections
 */
import dynamic from "next/dynamic";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SmoothScroll from "./components/SmoothScroll";

// Lazy load heavy components for better initial page load
// These components have GSAP animations and can be loaded after initial render
const Hero = dynamic(() => import("./sections/Hero"), {
  loading: () => <div className="h-screen bg-primary" />,
});

const About = dynamic(() => import("./sections/About"), {
  loading: () => <div className="h-96 bg-light" />,
});

const Services = dynamic(() => import("./sections/Services"), {
  loading: () => <div className="h-96 bg-white" />,
});

const Branches = dynamic(() => import("./sections/Branches"), {
  loading: () => <div className="h-96 bg-light" />,
});

const Gallery = dynamic(() => import("./sections/Gallery"), {
  loading: () => <div className="h-96 bg-dark" />,
});

const Testimonials = dynamic(() => import("./sections/Testimonials"), {
  loading: () => <div className="h-96 bg-light" />,
});

const FAQ = dynamic(() => import("./sections/FAQ"), {
  loading: () => <div className="h-96 bg-white" />,
});

const Contact = dynamic(() => import("./sections/Contact"), {
  loading: () => <div className="h-96 bg-light" />,
});

export default function Home() {
  return (
    <>
      {/* Smooth scroll wrapper - must be client component for Lenis */}
      <SmoothScroll />
      
      {/* Navbar - client component for scroll behavior and mobile menu */}
      <Navbar />
      
      <main className="overflow-x-hidden relative">
        {/* Hero Section - Full viewport height with animations */}
        <Hero />
        
        {/* Spacer to push content below fixed hero section */}
        <div className="h-screen relative z-10" />
        
        {/* About Section - Company info with animated stats */}
        <About />
        
        {/* Services Section - Service cards with animations */}
        <Services />
        
        {/* Branches Section - Branch locations from JSON */}
        <Branches />
        
        {/* Gallery Section - Image gallery with lightbox */}
        <Gallery />
        
        {/* Testimonials Section - Auto-scrolling carousel */}
        <Testimonials />
        
        {/* FAQ Section - Accordion with smooth animations */}
        <FAQ />
        
        {/* Contact Section - Contact info and map */}
        <Contact />
      </main>
      
      {/* Footer - Server component (static content) */}
      <Footer />
    </>
  );
}
