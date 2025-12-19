"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FiStar } from "react-icons/fi";
import Image from "next/image";
import { useLanguage } from "@/app/i18n/LanguageContext";
import { siteContent } from "@/app/data/siteContent";

gsap.registerPlugin(ScrollTrigger);

// Define type for Testimonial item if not imported
interface TestimonialItem {
  id: string;
  name: string;
  nameArabic: string;
  rating: number;
  image: string;
  // Added properties for handling
  review: string;
  role: string;
}

// Convert siteContent.testimonials to compatible format
// Since siteContent.testimonials is empty, this will be empty array
// If it had data, we would map it here.
const testimonialsConfig: TestimonialItem[] = siteContent.testimonials.map((t, i) => ({
  id: `t-${i}`,
  name: t.nameEn || "",
  nameArabic: t.nameAr || "",
  rating: t.rating || 5,
  image: "/images/person1.png", // Default placeholder
  review: t.review || "",
  role: "Customer" // Default
}));

export default function Testimonials() {
  const { t, language } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<gsap.core.Tween | null>(null);
  const resumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const ctx = gsap.context(() => {
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
              toggleActions: "play none none none",
            },
          }
        );
      }

      // Carousel auto-scroll animation (desktop only)
      if (carouselRef.current && typeof window !== "undefined" && window.innerWidth >= 768) {
        const carousel = carouselRef.current;
        const cards = carousel.querySelectorAll(".testimonial-card");
        if (cards.length > 0) {
          const cardWidth = cards[0]?.clientWidth || 0;
          const gap = 32; // 2rem gap
          const totalWidth = (cardWidth + gap) * testimonialsConfig.length;

          // Clear existing content to prevent duplicate accumulation on re-renders
          // We need to be careful here. React manages the DOM. 
          // If we modify innerHTML, React might lose track.
          // Instead of innerHTML += clone, let's rely on React to render duplicates if needed, 
          // OR just accept that for this GSAP implementation we might need to be careful.
          // For simplicity and robustness with translations, we will NOT clone via innerHTML.
          // We will render the list TWICE in the JSX.

          gsap.set(carousel, { x: 0 });

          // Infinite scroll animation
          const carouselAnimation = gsap.to(carousel, {
            x: -(totalWidth),
            duration: 40,
            ease: "none",
            repeat: -1,
            modifiers: {
              x: gsap.utils.unitize((x) => parseFloat(x) % totalWidth),
            },
          });

          animationRef.current = carouselAnimation;

          // Function to pause animation
          const pauseAnimation = () => {
            carouselAnimation.timeScale(0);
            if (resumeTimeoutRef.current) {
              clearTimeout(resumeTimeoutRef.current);
            }
          };

          // Function to resume animation after delay
          const resumeAnimation = (delay: number = 3000) => {
            if (resumeTimeoutRef.current) {
              clearTimeout(resumeTimeoutRef.current);
            }
            resumeTimeoutRef.current = setTimeout(() => {
              carouselAnimation.timeScale(1);
            }, delay);
          };

          // Pause on hover
          carousel.addEventListener("mouseenter", pauseAnimation);

          const handleMouseLeave = () => {
            carouselAnimation.timeScale(1);
          };
          carousel.addEventListener("mouseleave", handleMouseLeave);

          // Pause on card click/touch and resume after 3 seconds
          const handleCardInteraction = () => {
            pauseAnimation();
            resumeAnimation(3000);
          };

          const allCards = carousel.querySelectorAll(".testimonial-card");
          allCards.forEach((card) => {
            card.addEventListener("click", handleCardInteraction);
            card.addEventListener("touchstart", handleCardInteraction, { passive: true });
          });

          return () => {
            carousel.removeEventListener("mouseenter", pauseAnimation);
            carousel.removeEventListener("mouseleave", handleMouseLeave);
            allCards.forEach((card) => {
              card.removeEventListener("click", handleCardInteraction);
              card.removeEventListener("touchstart", handleCardInteraction);
            });
            if (resumeTimeoutRef.current) {
              clearTimeout(resumeTimeoutRef.current);
            }
          };
        }
      }
    }, sectionRef);

    return () => {
      if (resumeTimeoutRef.current) {
        clearTimeout(resumeTimeoutRef.current);
      }
      ctx.revert();
    };
  }, [language]); // Re-run when language changes to update measurements

  const toggleExpanded = (id: string) => {
    setExpandedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  // Helper to render a card
  const renderCard = (testimonial: typeof testimonialsConfig[0], keyPrefix: string) => (
    <div
      key={`${keyPrefix}-${testimonial.id}`}
      className="testimonial-card shrink-0 w-64 md:w-96 bg-white p-5 md:p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300"
    >
      {/* Stars */}
      <div className="flex gap-1 mb-4">
        {[...Array(testimonial.rating)].map((_, i) => (
          <FiStar key={i} className="text-accent fill-accent" />
        ))}
      </div>

      {/* Testimonial Text */}
      <p className="text-gray-700 leading-relaxed mb-6 italic">
        &ldquo;{testimonial.review}&rdquo;
      </p>

      {/* Customer Info */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 bg-gradient-to-br from-accent to-primary rounded-full flex items-center justify-center text-white text-xl font-bold shrink-0">
          {testimonial.name.charAt(0)}
        </div>
        <div>
          <h4 className="font-bold text-primary">
            {language === 'ar' ? testimonial.nameArabic : testimonial.name}
          </h4>
          <p className="text-accent text-xs font-medium">
            {testimonial.role}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      className="py-12 md:py-32 bg-light relative overflow-hidden z-10"
    >
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mb-8 md:mb-16">
        <h2
          ref={titleRef}
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-center text-primary mb-4 md:mb-6"
        >
          {t("testimonials.title")} <span className="text-accent">{t("testimonials.titleHighlight")}</span>
        </h2>

        <p className="text-center text-gray-600 text-lg max-w-2xl mx-auto">
          {t("testimonials.subtitle")}
        </p>
      </div>

      {/* Mobile: List View with Expandable Cards */}
      <div className="md:hidden max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-4">
          {testimonialsConfig.map((testimonial) => {
            const isExpanded = expandedIds.has(testimonial.id);
            const text = testimonial.review;
            const shouldTruncate = !isExpanded && text.length > 60;

            return (
              <div
                key={testimonial.id}
                className="bg-white p-5 rounded-2xl shadow-lg transition-all duration-300 cursor-pointer"
                onClick={() => toggleExpanded(testimonial.id)}
              >
                {/* Stars */}
                <div className="flex gap-1 mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FiStar key={i} className="text-accent fill-accent text-sm" />
                  ))}
                </div>

                {/* Testimonial Text with Blur Effect */}
                <div className="relative mb-4">
                  <p
                    className={`text-gray-700 leading-relaxed italic ${shouldTruncate ? "line-clamp-3" : ""
                      }`}
                  >
                    &ldquo;{text}&rdquo;
                  </p>
                  {shouldTruncate && (
                    <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white via-white/70 to-transparent pointer-events-none flex items-end justify-center pb-2">
                      <span className="text-xs text-gray-500 font-medium">{t("testimonials.tapToRead")}</span>
                    </div>
                  )}
                </div>

                {/* Customer Info */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-accent to-primary rounded-full flex items-center justify-center text-white text-lg font-bold shrink-0">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-primary text-sm">
                      {language === 'ar' ? testimonial.nameArabic : testimonial.name}
                    </h4>
                    <p className="text-accent text-xs font-medium">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Desktop: Carousel Container */}
      <div className="hidden md:block relative overflow-hidden">
        <div
          ref={carouselRef}
          className="flex gap-8 will-change-transform"
        >
          {/* Render twice for seamless loop without cloning DOM */}
          {testimonialsConfig.map((t, i) => renderCard(t, "original"))}
          {testimonialsConfig.map((t, i) => renderCard(t, "clone"))}
        </div>
      </div>
    </section>
  );
}
