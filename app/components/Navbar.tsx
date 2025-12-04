/**
 * Navbar Component - Client Component
 * 
 * Sticky navigation bar with smart show/hide behavior based on scroll direction.
 * 
 * Features:
 * - Slides down from top on initial page load
 * - Hides when scrolling down, shows when scrolling up
 * - Transparent in hero section, blur background when scrolled
 * - Mobile menu with GSAP slide animation
 * - Smooth scroll to sections
 * 
 * Performance optimizations:
 * - Uses refs to avoid unnecessary re-renders
 * - Passive scroll listeners for better performance
 * - GSAP animations with proper cleanup
 * 
 * @component
 * @returns {JSX.Element} Navigation bar with logo, links, and mobile menu
 */
"use client";

import { useEffect, useState, useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { FiMenu, FiX } from "react-icons/fi";

// Navigation links configuration
// Static data - could be moved to a config file if needed
const navLinks = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Branches", href: "#branches" },
  { name: "Gallery", href: "#gallery" },
  { name: "Offers", href: "#services" },
  { name: "Contact", href: "#contact" },
];

export default function Navbar() {
  // State management
  const [isOpen, setIsOpen] = useState(false); // Mobile menu open/close state
  const [isMenuRendered, setIsMenuRendered] = useState(false); // Controls if menu is in DOM for animations
  const [isVisible, setIsVisible] = useState(true); // Navbar visibility (hide/show on scroll)
  const [isAtTop, setIsAtTop] = useState(true); // Whether user is in hero section

  // Refs for DOM elements and animation tracking
  const navRef = useRef<HTMLElement>(null); // Main navbar element
  const mobileMenuRef = useRef<HTMLDivElement>(null); // Mobile menu drawer
  const lastScrollY = useRef(0); // Track last scroll position for direction detection
  const hasAnimated = useRef(false); // Track if entrance animation has played

  /**
   * Entrance Animation Effect
   * 
   * Animates navbar sliding down from top on initial page load.
   * Only runs once using hasAnimated ref to prevent re-animation on re-renders.
   */
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

  /**
   * Scroll Behavior Effect
   * 
   * Handles navbar visibility based on scroll direction and position:
   * - Always visible in hero section (transparent)
   * - Shows when scrolling up (with blur background)
   * - Hides when scrolling down (outside hero section)
   * 
   * Performance: Uses passive scroll listener and refs to minimize re-renders
   */
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

  /**
   * Mobile Menu Animation Effect
   * 
   * Animates mobile menu dropdown from top using GSAP.
   * Uses useLayoutEffect to set initial state before paint to prevent glitches.
   */
  useLayoutEffect(() => {
    if (!mobileMenuRef.current) return;

    let animation: gsap.core.Tween | null = null;

    if (isOpen && isMenuRendered) {
      // Kill any existing animations
      gsap.killTweensOf(mobileMenuRef.current);

      // Set initial state immediately (before paint) to prevent flash
      gsap.set(mobileMenuRef.current, {
        y: -30,
        opacity: 0,
        scale: 0.9,
        immediateRender: true,
        force3D: true,
      });

      // Animate menu in from top after a single frame
      requestAnimationFrame(() => {
        if (mobileMenuRef.current && isOpen) {
          animation = gsap.to(mobileMenuRef.current, {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.4,
            ease: "power3.out",
            force3D: true,
            overwrite: true,
          });
        }
      });
    } else if (!isOpen && isMenuRendered) {
      // Kill any existing animations
      gsap.killTweensOf(mobileMenuRef.current);

      // Animate menu out before removing from DOM
      animation = gsap.to(mobileMenuRef.current, {
        y: -30,
        opacity: 0,
        scale: 0.9,
        duration: 0.3,
        ease: "power2.in",
        force3D: true,
        overwrite: true,
        onComplete: () => {
          setIsMenuRendered(false);
        },
      });
    }

    return () => {
      if (animation) {
        animation.kill();
      }
    };
  }, [isOpen, isMenuRendered]);

  /**
   * Click Outside Handler
   * 
   * Closes mobile menu when clicking outside of it.
   */
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;

      // Check if click is outside menu and not on the menu button
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(target) &&
        navRef.current &&
        !navRef.current.querySelector('button[aria-label="Toggle menu"]')?.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    // Add event listeners with a small delay to avoid immediate closure
    const timer = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isOpen]);

  /**
   * Smooth Scroll to Section
   * 
   * Scrolls to a section when navigation link is clicked.
   * Closes mobile menu after navigation.
   * 
   * @param {string} href - Section ID to scroll to (e.g., "#about")
   */
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
            onClick={() => {
              if (!isOpen) {
                // Set menu to render first, then open (React will batch these)
                setIsMenuRendered(true);
                setIsOpen(true);
              } else {
                setIsOpen(false);
              }
            }}
            className="md:hidden text-white text-2xl z-50"
            aria-label="Toggle menu"
          >
            {isOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay - Starts below navbar */}
      {isOpen && isMenuRendered && (
        <div
          className="fixed top-[88px] left-0 right-0 bottom-0 bg-black/40 backdrop-blur-sm md:hidden z-40 transition-opacity duration-300"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsOpen(false);
          }}
          onTouchStart={(e) => {
            e.preventDefault();
            setIsOpen(false);
          }}
        />
      )}

      {/* Mobile Menu Dropdown Box */}
      {isMenuRendered && (
        <div
          ref={mobileMenuRef}
          className="fixed top-[88px] left-4 right-4 md:hidden z-50 bg-primary/98 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 overflow-hidden max-w-sm mx-auto pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
          style={{ willChange: "transform, opacity" }}
        >
          <div className="flex flex-col py-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(link.href);
                }}
                className="text-white hover:text-accent hover:bg-white/5 transition-all duration-200 text-base font-medium py-3 px-6 active:bg-white/10"
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

