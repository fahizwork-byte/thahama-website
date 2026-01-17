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
import { Suspense } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SmoothScroll from "./components/SmoothScroll";
import SkeletonLoader from "./components/SkeletonLoader";

// Lazy load heavy components for better initial page load
// These components have GSAP animations and can be loaded after initial render
const Hero = dynamic(() => import("./sections/Hero"), {
  loading: () => <SkeletonLoader variant="hero" className="bg-primary" />,
});

const About = dynamic(() => import("./sections/About"), {
  loading: () => <SkeletonLoader variant="section" className="bg-light" />,
});

const Services = dynamic(() => import("./sections/Services"), {
  loading: () => <SkeletonLoader variant="section" className="bg-white" />,
});

const Branches = dynamic(() => import("./sections/Branches"), {
  loading: () => <SkeletonLoader variant="section" className="bg-light" />,
});

const Gallery = dynamic(() => import("./sections/Gallery"), {
  loading: () => <SkeletonLoader variant="section" className="bg-dark" />,
});

const Testimonials = dynamic(() => import("./sections/Testimonials"), {
  loading: () => <SkeletonLoader variant="section" className="bg-light" />,
});

const FAQ = dynamic(() => import("./sections/FAQ"), {
  loading: () => <SkeletonLoader variant="section" className="bg-white" />,
});

const Contact = dynamic(() => import("./sections/Contact"), {
  loading: () => <SkeletonLoader variant="section" className="bg-light" />,
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
        <Suspense fallback={<SkeletonLoader variant="hero" className="bg-primary" />}>
          <Hero />
        </Suspense>

        {/* Spacer to push content below fixed hero section - reduced height to show next section peak */}
        <div className="h-[100vh] relative z-10" />

        {/* Services Section - Service cards with animations */}
        <Suspense fallback={<SkeletonLoader variant="section" className="bg-white" />}>
          <Services />
        </Suspense>

        {/* Branches Section - Branch locations from JSON */}
        <Suspense fallback={<SkeletonLoader variant="section" className="bg-light" />}>
          <Branches />
        </Suspense>

        {/* Testimonials Section - Auto-scrolling carousel */}
        <Suspense fallback={<SkeletonLoader variant="section" className="bg-light" />}>
          <Testimonials />
        </Suspense>

        {/* About Section - Company info with animated stats */}
        <Suspense fallback={<SkeletonLoader variant="section" className="bg-light" />}>
          <About />
        </Suspense>

        {/* Gallery Section - Image gallery with lightbox */}
        <Suspense fallback={<SkeletonLoader variant="section" className="bg-dark" />}>
          <Gallery />
        </Suspense>

        {/* FAQ Section - Accordion with smooth animations */}
        <Suspense fallback={<SkeletonLoader variant="section" className="bg-white" />}>
          <FAQ />
        </Suspense>

        {/* Contact Section - Contact info and map */}
        <Suspense fallback={<SkeletonLoader variant="section" className="bg-light" />}>
          <Contact />
        </Suspense>
      </main>

      {/* Footer - Server component (static content) */}
      <Footer />
    </>
  );
}
