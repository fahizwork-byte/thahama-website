"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import ScrollIndicator from "@/app/components/ScrollIndicator";
import { getOptimizedImagePath, getBlurPlaceholder } from "@/app/lib/image-utils";
import { siteContent } from "@/app/data/siteContent";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let scrollCleanup: (() => void) | null = null;

    const ctx = gsap.context(() => {
      // Parallax zoom effect on background image
      // Zoom in when scrolling up, zoom out when scrolling down
      if (imageRef.current && typeof window !== "undefined") {
        // Calculate scale based on scroll position
        const calculateScale = (scrollY: number) => {
          const maxScroll = 800;
          const scrollProgress = Math.min(scrollY / maxScroll, 1);
          const scale = 1.25 - scrollProgress * 0.25;
          return Math.max(1.0, Math.min(1.25, scale));
        };

        // Get initial scroll position and set scale
        const initialScrollY = window.scrollY;
        const initialScale = calculateScale(initialScrollY);

        // Only update if not already at the correct scale (prevents unnecessary animation on mount)
        if (initialScrollY > 0) {
          gsap.set(imageRef.current, { scale: initialScale });
        }

        const handleScroll = () => {
          if (typeof window === "undefined" || !imageRef.current) return;

          const scrollY = window.scrollY;
          const clampedScale = calculateScale(scrollY);

          // Add will-change when animation is active
          if (scrollY > 0 && scrollY < 800) {
            imageRef.current.style.willChange = "transform";
          } else {
            // Remove will-change when animation is complete
            imageRef.current.style.willChange = "auto";
          }

          gsap.to(imageRef.current, {
            scale: clampedScale,
            duration: 0.2,
            ease: "none",
            overwrite: true,
          });
        };

        // Use requestAnimationFrame for smooth performance
        let ticking = false;
        const scrollHandler = () => {
          if (!ticking) {
            window.requestAnimationFrame(() => {
              handleScroll();
              ticking = false;
            });
            ticking = true;
          }
        };

        window.addEventListener("scroll", scrollHandler, { passive: true });

        // Only call handleScroll if we're not at the top (to avoid unnecessary animation)
        if (initialScrollY > 0) {
          handleScroll();
        }

        // Store cleanup function
        scrollCleanup = () => {
          if (typeof window !== "undefined") {
            window.removeEventListener("scroll", scrollHandler);
          }
        };
      }
      // Title animation - emerging from below
      if (titleRef.current && typeof window !== "undefined") {
        // Set initial state - title hidden below
        gsap.set(titleRef.current, {
          opacity: 0,
          y: 80,
        });

        // Animate title emerging from below as one unit
        gsap.to(titleRef.current, {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          delay: 0.3,
        });
      }

      // Subtitle animation
      if (subtitleRef.current && typeof window !== "undefined") {
        gsap.fromTo(
          subtitleRef.current,
          {
            opacity: 0,
            y: 50,
          },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            delay: 1.2,
          }
        );
      }

      // Scroll indicator animation
      if (scrollIndicatorRef.current && typeof window !== "undefined") {
        gsap.fromTo(
          scrollIndicatorRef.current,
          {
            opacity: 0,
            y: -20,
          },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power2.out",
            delay: 1.8,
          }
        );
      }
    }, heroRef);

    return () => {
      if (scrollCleanup) scrollCleanup();
      ctx.revert();
    };
  }, []);

  return (
    <section
      id="home"
      ref={heroRef}
      className="fixed top-0 left-0 w-full h-screen flex items-center justify-center overflow-hidden z-0"
    >
      {/* Background Image with Parallax Zoom */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 -translate-y-12">
          <div
            ref={imageRef}
            className="absolute inset-0"
            style={{
              transformOrigin: "center center",
              transform: "scale(1.25)"
            }}
          >
            <Image
              src={getOptimizedImagePath("/images/ChatGPT Image Nov 29, 2025, 04_01_26 PM.png")}
              alt="THAHAMA:market - Freshness Everyday"
              fill
              className="object-cover"
              priority
              quality={90}
              placeholder="blur"
              blurDataURL={getBlurPlaceholder("ChatGPT Image Nov 29, 2025, 04_01_26 PM")}
              sizes="100vw"
            />
          </div>
        </div>
        {/* Light overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/60 via-dark/50 to-primary/60" />
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-10 z-[1]">
        <div className="absolute top-20 left-10 w-72 h-72 bg-accent rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent rounded-full blur-3xl animate-pulse delay-1000" />
      </div>


      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center w-full">
        <h1
          ref={titleRef}
          className="text-3xl sm:text-4xl md:text-7xl lg:text-8xl font-bold mb-6 perspective-1000 break-words whitespace-normal leading-tight"
        >
          <span className="text-white">THAHAMA</span>
          <span className="text-accent">:market</span>
        </h1>

        <p
          ref={subtitleRef}
          className="text-xl md:text-2xl lg:text-3xl text-white mb-4 max-w-3xl mx-auto"
        >
          {siteContent.hero.tagline}
        </p>


        {/* <p className="text-lg md:text-xl text-white max-w-2xl mx-auto mb-12">
          أسواق تهامة - Experience quality, freshness, and exceptional service
        </p> */}
      </div>

      {/* Scroll Indicator */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-40 left-1/2 transform -translate-x-1/2 z-20"
      >
        <ScrollIndicator
          onClick={() => {
            if (typeof window !== "undefined") {
              document.querySelector("#about")?.scrollIntoView({ behavior: "smooth" });
            }
          }}
        />
      </div>
    </section>
  );
}

