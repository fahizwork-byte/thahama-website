"use client";

import { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";
import { FiMenu, FiX } from "react-icons/fi";

const navLinks = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Branches", href: "#branches" },
  { name: "Gallery", href: "#gallery" },
  { name: "Offers", href: "#services" },
  { name: "Contact", href: "#contact" },
];




export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isAtTop, setIsAtTop] = useState(true);
  const navRef = useRef<HTMLElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);
  const hasAnimated = useRef(false);

  // Entrance animation - navbar slides down from top on first load
  useEffect(() => {
    if (navRef.current && !hasAnimated.current && typeof window !== "undefined") {
      // Small delay to ensure component is fully mounted
      const timer = setTimeout(() => {
        if (navRef.current) {
          // Temporarily disable CSS transition to avoid conflicts
          const originalTransition = navRef.current.style.transition;
          navRef.current.style.transition = "none";

          // Set initial state - navbar hidden above
          gsap.set(navRef.current, {
            y: -100,
            force3D: true,
            immediateRender: true,
          });

          // Animate navbar sliding down from top
          gsap.to(navRef.current, {
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            delay: 0.2,
            force3D: true,
            overwrite: true,
            onComplete: () => {
              // Restore CSS transition after animation
              if (navRef.current) {
                navRef.current.style.transition = originalTransition || "";
              }
            },
          });

          hasAnimated.current = true;
        }
      }, 50);

      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    // Initialize lastScrollY with current scroll position
    lastScrollY.current = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const heroSectionHeight = window.innerHeight;

      // Check if within hero section (full viewport height)
      const isInHeroSection = currentScrollY < heroSectionHeight;
      setIsAtTop(isInHeroSection);

      // Show navbar when at top or scrolling up, hide when scrolling down
      if (isInHeroSection) {
        // Always show when in hero section (transparent, no blur)
        setIsVisible(true);
      } else if (currentScrollY < lastScrollY.current) {
        // Show when scrolling up (even if not in hero section)
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY.current && !isInHeroSection) {
        // Hide when scrolling down (only if not in hero section)
        setIsVisible(false);
      }

      lastScrollY.current = currentScrollY;
    };

    // Check initial scroll position on mount
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuRef.current) {
      if (isOpen) {
        gsap.to(mobileMenuRef.current, {
          x: 0,
          duration: 0.4,
          ease: "power3.out",
        });
      } else {
        gsap.to(mobileMenuRef.current, {
          x: "100%",
          duration: 0.4,
          ease: "power3.in",
        });
      }
    }
  }, [isOpen]);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsOpen(false);
    }
  };

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-1500 ease-in-out ${isVisible ? "translate-y-0" : "-translate-y-full"
        } ${isAtTop
          ? "py-6"
          : "py-4 bg-primary/95 backdrop-blur-md shadow-lg"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}

          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("#home");
            }}
            className="text-2xl md:text-3xl font-bold"
          >
            <span className="text-white">THAHAMA</span>
            <span className="text-accent">:market</span>
          </a>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(link.href);
                }}
                className="text-white hover:text-accent transition-colors duration-300 font-medium"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white text-2xl z-50"
            aria-label="Toggle menu"
          >
            {isOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        ref={mobileMenuRef}
        className="fixed top-0 right-0 bottom-0 w-64 bg-primary md:hidden shadow-2xl translate-x-full"
        style={{ transform: "translateX(100%)" }}
      >
        <div className="flex flex-col gap-6 pt-24 px-8">
          {navLinks.map((link, index) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection(link.href);
              }}
              className="text-white hover:text-accent transition-colors duration-300 text-lg font-medium"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {link.name}
            </a>
          ))}
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </nav>
  );
}

