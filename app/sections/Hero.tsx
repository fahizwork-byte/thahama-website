"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import ScrollIndicator from "@/app/components/ScrollIndicator";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Parallax zoom effect on background image
      // Zoom in when scrolling up, zoom out when scrolling down
      if (imageRef.current) {
        // Set initial scale (zoomed in at top)
        gsap.set(imageRef.current, { scale: 1.25 });

        const handleScroll = () => {
          const scrollY = window.scrollY;

          // Calculate scale based on scroll position
          // Max scroll distance for effect (800px for smooth transition)
          const maxScroll = 800;
          const scrollProgress = Math.min(scrollY / maxScroll, 1);

          // Zoom out as you scroll down, zoom in as you scroll up
          // At top (scrollY = 0): scale = 1.25 (zoomed in)
          // After scrolling 800px: scale = 1.0 (normal size)
          const scale = 1.25 - scrollProgress * 0.25;

          // Clamp scale between 1.0 and 1.25
          const clampedScale = Math.max(1.0, Math.min(1.25, scale));

          gsap.to(imageRef.current, {
            scale: clampedScale,
            duration: 0.2,
            ease: "none",
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

        // Initial call to set correct scale
        handleScroll();

        return () => {
          window.removeEventListener("scroll", scrollHandler);
        };
      }
      // Title animation with stagger
      if (titleRef.current) {
        const titleChars = titleRef.current.textContent?.split("") || [];
        titleRef.current.innerHTML = titleChars
          .map((char) => `<span class="inline-block">${char === " " ? "&nbsp;" : char}</span>`)
          .join("");

        gsap.fromTo(
          titleRef.current.children,
          {
            opacity: 0,
            y: 100,
            rotateX: -90,
          },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 1,
            stagger: 0.02,
            ease: "power4.out",
            delay: 0.3,
          }
        );
      }

      // Subtitle animation
      if (subtitleRef.current) {
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
      if (scrollIndicatorRef.current) {
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

    return () => ctx.revert();
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
              willChange: "transform",
              transformOrigin: "center center"
            }}
          >
            <Image
              // src="/images/Family Shopping for Fresh Produce.png"
              // src="/images/Untitled design (1).png"
              // src="/images/ChatGPT Image Nov 29, 2025, 03_52_44 PM.png"
              src="/images/ChatGPT Image Nov 29, 2025, 04_01_26 PM.png"
              alt="/Family Shopping for Fresh Produce"
              fill
              className="object-cover"
              priority
              quality={90}
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
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1
          ref={titleRef}
          className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 perspective-1000"
        >
          Thahama Market
        </h1>

        <p
          ref={subtitleRef}
          className="text-xl md:text-2xl lg:text-3xl text-white mb-4 max-w-3xl mx-auto"
        >
          Freshness Everyday
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
            document.querySelector("#about")?.scrollIntoView({ behavior: "smooth" });
          }}
        />
      </div>
    </section>
  );
}

