"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { getOptimizedImagePath, getBlurPlaceholder } from "@/app/lib/image-utils";

gsap.registerPlugin(ScrollTrigger);

import { useLanguage } from "@/app/i18n/LanguageContext";
import { siteContent } from "@/app/data/siteContent";

export default function About() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  // Helper to parse stats from string "20+" -> number: 20, suffix: "+"
  const parseStat = (val: string, defaultSuffix: string) => {
    const match = val.match(/^(\d+(?:\.\d+)?)([A-Za-z+]*)$/);
    if (match) {
      return { number: parseFloat(match[1]), suffix: match[2] };
    }
    return { number: 0, suffix: val }; // Fallback
  };

  const branchesStat = parseStat(siteContent.statistics.branches, "+");
  const customersStat = parseStat(siteContent.statistics.customers, "+");
  const experienceStat = parseStat(siteContent.statistics.years, "+");
  const productsStat = parseStat(siteContent.statistics.products, "+");

  const stats = [
    { number: branchesStat.number, suffix: branchesStat.suffix, label: t("about.stats.branches") },
    { number: customersStat.number, suffix: customersStat.suffix, label: t("about.stats.customers") },
    { number: experienceStat.number, suffix: experienceStat.suffix, label: t("about.stats.experience") },
    { number: productsStat.number, suffix: productsStat.suffix, label: t("about.stats.products") },
  ];

  useEffect(() => {
    let cleanup: (() => void) | null = null;
    let timeoutId: NodeJS.Timeout | null = null;
    let scrollCleanup: (() => void) | null = null;

    // Wait a bit for refs to be ready
    const initAnimations = () => {
      if (!sectionRef.current) {
        timeoutId = setTimeout(initAnimations, 100);
        return;
      }

      const ctx = gsap.context(() => {
        // Parallax zoom effect on about image
        // Zoom in when scrolling up, zoom out when scrolling down
        if (imageRef.current && sectionRef.current && typeof window !== "undefined") {
          // Set initial scale (zoomed in)
          gsap.set(imageRef.current, { scale: 1.6 });

          const handleScroll = () => {
            if (typeof window === "undefined") return;

            const scrollY = window.scrollY;
            const sectionTop = sectionRef.current?.offsetTop || 0;
            const sectionHeight = sectionRef.current?.offsetHeight || 0;
            const windowHeight = window.innerHeight;

            // Calculate when section enters viewport
            const sectionStart = sectionTop - windowHeight;
            const sectionEnd = sectionTop + sectionHeight;

            // Calculate scroll progress relative to section
            // When section is at top of viewport: progress = 0 (zoomed in)
            // When section is scrolled past: progress = 1 (normal size)
            let scrollProgress = 0;

            if (scrollY > sectionStart && scrollY < sectionEnd) {
              // Section is in viewport
              scrollProgress = (scrollY - sectionStart) / (sectionEnd - sectionStart);
            } else if (scrollY >= sectionEnd) {
              // Section is scrolled past
              scrollProgress = 1;
            }

            // Zoom out as you scroll down through the section
            // At top: scale = 1.6 (zoomed in)
            // At bottom: scale = 1.0 (normal size)
            const scale = 1.6 - scrollProgress * 0.6;

            // Clamp scale between 1.0 and 1.6
            const clampedScale = Math.max(1.0, Math.min(1.6, scale));

            // Add will-change when animation is active
            if (imageRef.current) {
              if (scrollY > sectionStart && scrollY < sectionEnd) {
                imageRef.current.style.willChange = "transform";
              } else {
                // Remove will-change when animation is complete
                imageRef.current.style.willChange = "auto";
              }
            }

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

          // Store cleanup function for scroll handler
          scrollCleanup = () => {
            if (typeof window !== "undefined") {
              window.removeEventListener("scroll", scrollHandler);
            }
          };
        }
        // Title animation
        if (titleRef.current) {
          gsap.fromTo(
            titleRef.current,
            {
              opacity: 0,
              y: 50,
            },
            {
              opacity: 1,
              y: 0,
              duration: 1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: titleRef.current,
                start: "top 80%",
                end: "top 50%",
                toggleActions: "play none none none",
              },
            }
          );
        }

        // Content animation
        if (contentRef.current) {
          gsap.fromTo(
            contentRef.current,
            {
              opacity: 0,
              x: -50,
            },
            {
              opacity: 1,
              x: 0,
              duration: 1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: contentRef.current,
                start: "top 80%",
                end: "top 50%",
                toggleActions: "play none none none",
              },
            }
          );
        }

        // Stats animation with counter
        if (statsRef.current && typeof window !== "undefined") {
          const statElements = Array.from(statsRef.current.querySelectorAll(".stat-number"));

          if (statElements.length > 0) {
            // Create a single ScrollTrigger that handles all counters
            ScrollTrigger.create({
              trigger: statsRef.current,
              start: "top 75%",
              once: true,
              onEnter: () => {
                statElements.forEach((element, index) => {
                  if (!element || index >= stats.length) return;
                  if (!(element instanceof HTMLElement)) return;

                  const target = stats[index].number;
                  const obj = { value: 0 };

                  // Ensure initial value is 0
                  element.textContent = "0";

                  // Animate the counter
                  gsap.to(obj, {
                    value: target,
                    duration: 2,
                    ease: "power2.out",
                    onUpdate: () => {
                      const currentValue = Math.round(obj.value);
                      element.textContent = currentValue.toLocaleString();
                    },
                  });
                });
              },
            });

            // Fade-in animation for stats cards
            gsap.fromTo(
              statsRef.current.children,
              {
                opacity: 0,
                y: 30,
              },
              {
                opacity: 1,
                y: 0,
                duration: 0.8,
                stagger: 0.15,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: statsRef.current,
                  start: "top 75%",
                  toggleActions: "play none none none",
                },
              }
            );

            // Fade-in animation for stats cards
            gsap.fromTo(
              statsRef.current.children,
              {
                opacity: 0,
                y: 30,
              },
              {
                opacity: 1,
                y: 0,
                duration: 0.8,
                stagger: 0.15,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: statsRef.current,
                  start: "top 75%",
                  toggleActions: "play none none none",
                },
              }
            );

            // Refresh ScrollTrigger to ensure it works
            ScrollTrigger.refresh();
          }
        }
      }, sectionRef);

      cleanup = () => {
        if (scrollCleanup) scrollCleanup();
        ctx.revert();
      };
    };

    // Start initialization
    initAnimations();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (cleanup) cleanup();
    };
  }, [stats]); // Add stats to dependency array

  return (
    <section
      id="about"
      ref={sectionRef}
      className="pt-12 md:pt-20 pb-8 md:pb-16 bg-light relative overflow-hidden -mt-20 md:-mt-32 rounded-t-3xl z-10"
    >
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <h2
          ref={titleRef}
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-center text-primary mb-4 md:mb-8"
        >
          {t("about.title")} <span className="text-accent">{t("about.titleHighlight")}</span>
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-center mb-8 md:mb-12">
          <div ref={contentRef}>
            <h3 className="text-2xl md:text-3xl font-bold text-primary mb-6">
              {t("about.whoWeAre")}
            </h3>

            {/* Desktop: Full text always visible */}
            <div className="hidden lg:block">
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                {siteContent.about.paragraph1}
              </p>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                {siteContent.about.paragraph2}
              </p>
              <p className="text-gray-600 text-lg leading-relaxed">
                {siteContent.about.paragraph3}
              </p>
            </div>

            {/* Mobile: Truncated text with read more */}
            <div className="lg:hidden">
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                {siteContent.about.paragraph1}
              </p>

              {isExpanded ? (
                <>
                  <p className="text-gray-600 text-lg leading-relaxed mb-6">
                    {siteContent.about.paragraph2}
                  </p>
                  <p className="text-gray-600 text-lg leading-relaxed mb-4">
                    {siteContent.about.paragraph3}
                  </p>
                  <button
                    onClick={() => setIsExpanded(false)}
                    className="text-accent font-semibold hover:text-accent/80 transition-colors"
                  >
                    {t("about.readLess")}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsExpanded(true)}
                  className="text-accent font-semibold hover:text-accent/80 transition-colors"
                >
                  {t("about.readMore")}
                </button>
              )}
            </div>
          </div>

          <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl">
            <div
              ref={imageRef}
              className="absolute inset-0"
              style={{
                transformOrigin: "center center"
              }}
            >
              <Image
                src={getOptimizedImagePath("/images/about_image.png")}
                alt="About Thahama Market"
                fill
                className="object-cover rounded-2xl"
                loading="lazy"
                placeholder="blur"
                blurDataURL={getBlurPlaceholder("about_image")}
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div
          ref={statsRef}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8"
        >
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center p-4 md:p-8 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300"
            >
              <div className="text-2xl md:text-5xl font-bold text-accent mb-2">
                <span className="stat-number">0</span>
                <span>{stat.suffix}</span>
              </div>
              <div className="text-sm md:text-base text-gray-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

