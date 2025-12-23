"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import ScrollIndicator from "@/app/components/ScrollIndicator";
import { getOptimizedImagePath, getBlurPlaceholder } from "@/app/lib/image-utils";
import { siteContent } from "@/app/data/siteContent";
import { useDevice } from "@/app/hooks/useDevice";
import { createGSAPContext } from "@/app/lib/gsap-utils";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const { isMobile, isTablet } = useDevice();

  useEffect(() => {
    let scrollCleanup: (() => void) | null = null;

    const cleanupGSAP = createGSAPContext(() => {
      // 1. Parallax zoom effect on background image
      // We simplify or disable this on mobile to improve performance
      const shouldAnimateParallax = !isMobile && imageRef.current;

      if (shouldAnimateParallax && typeof window !== "undefined") {
        // Calculate scale based on scroll position
        const calculateScale = (scrollY: number) => {
          const maxScroll = 800;
          const scrollProgress = Math.min(scrollY / maxScroll, 1);
          // Scale from 1.25 down to 1.0
          const scale = 1.25 - scrollProgress * 0.25;
          return Math.max(1.0, Math.min(1.25, scale));
        };

        // Get initial scroll position
        const initialScrollY = window.scrollY;
        const initialScale = calculateScale(initialScrollY);

        if (initialScrollY > 0) {
          gsap.set(imageRef.current, { scale: initialScale });
        }

        const handleScroll = () => {
          if (!imageRef.current) return;
          const scrollY = window.scrollY;
          const clampedScale = calculateScale(scrollY);

          // Performance: Add will-change only when active
          if (scrollY > 0 && scrollY < 800) {
            imageRef.current.style.willChange = "transform";
          } else {
            imageRef.current.style.willChange = "auto";
          }

          gsap.to(imageRef.current, {
            scale: clampedScale,
            duration: 0.2,
            ease: "none",
            overwrite: true,
          });
        };

        // Throttled scroll handler using requestAnimationFrame
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
        if (initialScrollY > 0) handleScroll();

        scrollCleanup = () => {
          window.removeEventListener("scroll", scrollHandler);
        };
      } else if (imageRef.current) {
        // Static state for mobile/fallback
        gsap.set(imageRef.current, { scale: 1.1 }); // Slight zoom for impact
      }

      // 2. Title animation - emerging from below
      if (titleRef.current) {
        gsap.set(titleRef.current, { opacity: 0, y: 80 });
        gsap.to(titleRef.current, {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          delay: 0.3,
        });
      }

      // 3. Subtitle animation
      if (subtitleRef.current) {
        gsap.fromTo(subtitleRef.current,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            delay: 1.2,
          }
        );
      }

      // 4. Scroll indicator animation
      if (scrollIndicatorRef.current) {
        gsap.fromTo(scrollIndicatorRef.current,
          { opacity: 0, y: -20 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power2.out",
            delay: 1.8,
          }
        );
      }
    }, heroRef.current);

    return () => {
      if (scrollCleanup) scrollCleanup();
      cleanupGSAP();
    };
  }, [isMobile, isTablet]); // Re-run if device type changes

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
              transform: isMobile ? "scale(1.1)" : "scale(1.25)",
            }}
          >
            <Image
              src={getOptimizedImagePath("/images/ChatGPT Image Nov 29, 2025, 04_01_26 PM.png")}
              alt="THAHAMA:market - Freshness Everyday"
              fill
              className="object-cover"
              priority
              quality={isMobile ? 75 : 90} // Lower quality on mobile for speed
              placeholder="blur"
              blurDataURL={getBlurPlaceholder("ChatGPT Image Nov 29, 2025, 04_01_26 PM")}
              sizes="100vw"
            />
          </div>
        </div>
        {/* Light overlay for text readability */}
        <div className="absolute inset-0 bg-linear-to-br from-primary/60 via-dark/50 to-primary/60" />
      </div>

      {/* Animated Background Elements - Reduced on mobile */}
      {!isMobile && (
        <div className="absolute inset-0 opacity-10 z-1">
          <div className="absolute top-20 left-10 w-72 h-72 bg-accent rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center w-full -translate-y-16 md:-translate-y-20">
        <h1
          ref={titleRef}
          className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 perspective-1000 wrap-break-word whitespace-normal leading-tight tracking-tight"
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
      </div>

      {/* Scroll Indicator */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-48 md:bottom-56 left-1/2 transform -translate-x-1/2 z-20"
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
