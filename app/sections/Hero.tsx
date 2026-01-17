"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import ScrollIndicator from "@/app/components/ScrollIndicator";
import { siteContent } from "@/app/data/siteContent";
import { useDevice } from "@/app/hooks/useDevice";
import { createGSAPContext } from "@/app/lib/gsap-utils";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const infoCardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const { isMobile, isTablet } = useDevice();

  useEffect(() => {
    let scrollCleanup: (() => void) | null = null;

    const cleanupGSAP = createGSAPContext(() => {
      // 1. Parallax zoom effect on background image
      const shouldAnimateParallax = !isMobile && imageRef.current;

      if (shouldAnimateParallax && typeof window !== "undefined") {
        const calculateScale = (scrollY: number) => {
          const maxScroll = 800;
          // Subtle zoom out on scroll
          const progress = Math.min(scrollY / maxScroll, 1);
          return 1.1 - (progress * 0.1);
        };

        const initialScrollY = window.scrollY;
        const initialScale = calculateScale(initialScrollY);

        if (initialScrollY > 0) {
          gsap.set(imageRef.current, { scale: initialScale });
        }

        const handleScroll = () => {
          if (!imageRef.current) return;
          const scrollY = window.scrollY;
          const clampedScale = calculateScale(scrollY);

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
        gsap.set(imageRef.current, { scale: 1.1 }); // Start slightly zoomed in
      }

      // 2. Title animation - Staggered Reveal
      if (titleRef.current) {
        gsap.fromTo(titleRef.current.children,
          { y: 100, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.2,
            stagger: 0.1,
            ease: "power4.out",
            delay: 0.2,
          }
        );
      }

      // 3. Subtitle animation
      if (subtitleRef.current) {
        gsap.fromTo(subtitleRef.current,
          { opacity: 0, x: -20 },
          {
            opacity: 1,
            x: 0,
            duration: 1,
            ease: "power2.out",
            delay: 1.0,
          }
        );
      }

      // 4. Info Card Animation
      if (infoCardRef.current) {
        gsap.fromTo(infoCardRef.current,
          { opacity: 0, y: 20, backdropFilter: "blur(0px)" },
          {
            opacity: 1,
            y: 0,
            backdropFilter: "blur(12px)",
            duration: 1.2,
            ease: "power2.out",
            delay: 1.4,
          }
        );
      }

      // 5. Scroll indicator animation
      if (scrollIndicatorRef.current) {
        gsap.fromTo(scrollIndicatorRef.current,
          { opacity: 0, scale: 0 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.8,
            ease: "back.out(1.7)",
            delay: 2.0,
          }
        );
      }
    }, heroRef.current);

    return () => {
      if (scrollCleanup) scrollCleanup();
      cleanupGSAP();
    };
  }, [isMobile, isTablet]);

  return (
    <section
      id="home"
      ref={heroRef}
      className="fixed top-0 left-0 w-full h-[100svh] flex overflow-hidden z-0 bg-neutral-900"
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div
          ref={imageRef}
          className="relative w-full h-full"
          style={{ transform: "scale(1.1)" }}
        >
          <Image
            src="/images/hero-image-v2.jpg"
            alt="THAHAMA:market - Freshness Everyday"
            fill
            className="object-cover"
            priority
            quality={100}
            unoptimized
            placeholder="empty"
            sizes="100vw"
          />
          {/* Enhanced Gradient Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent z-10" />
        </div>
      </div>

      {/* Content Container */}
      <div className="relative z-20 w-full h-full max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 pointer-events-none">
        <div className="h-full flex flex-col justify-end pb-32 md:pb-48">

          {/* Main Typography - Left Aligned */}
          <div className="max-w-4xl pointer-events-auto transform -translate-y-12 md:translate-y-0">
            <h1 ref={titleRef} className="flex flex-col font-bold leading-[0.85] tracking-tighter text-white">
              <span className="text-7xl sm:text-8xl md:text-9xl lg:text-[10rem] xl:text-[11rem]">
                THAHAMA
              </span>
              <span className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl text-accent font-light ml-2 md:ml-4">
                :market
              </span>
            </h1>

            <div className="mt-8 md:mt-12 overflow-hidden">
              <p
                ref={subtitleRef}
                className="text-lg md:text-xl text-gray-200/90 font-medium tracking-wide max-w-sm border-l-2 border-accent pl-4"
              >
                {siteContent.hero.tagline}
              </p>
            </div>
          </div>

          {/* Glass Info Card - Responsive - Stacked on Mobile, Absolute on Desktop */}
          <div
            ref={infoCardRef}
            className={`
              z-20 pointer-events-auto
              relative mt-8 self-start
              md:absolute md:bottom-40 md:right-8 lg:right-12 md:mt-0
            `}
          >
            <div className="flex items-center gap-4 md:gap-6 p-4 md:p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl shadow-black/10 hover:bg-white/20 transition-colors duration-300">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] md:text-xs text-gray-300 uppercase tracking-widest">Opening Hours</span>
                <span className="text-base md:text-xl text-white font-bold">24 Hours / 7 Days</span>
              </div>

              {/* Divider - Hidden on very small screens if needed, but kept for design */}
              <div className="w-px h-8 md:h-10 bg-white/20" />

              <div className="flex flex-col gap-1">
                <span className="text-[10px] md:text-xs text-gray-300 uppercase tracking-widest">Quality</span>
                <span className="text-base md:text-xl text-white font-bold">Premium Fresh</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-30 pointer-events-auto"
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
