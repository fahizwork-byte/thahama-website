"use client";

import { useEffect, useRef, useMemo } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { Quote } from "lucide-react";
import { getOptimizedImagePath, getBlurPlaceholder } from "@/app/lib/image-utils";
import { useLanguage } from "@/app/i18n/LanguageContext";
import { siteContent } from "@/app/data/siteContent";
import SectionWrapper from "@/app/components/ui/SectionWrapper";
import { useDevice } from "@/app/hooks/useDevice";

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const { t } = useLanguage();
  const { isMobile } = useDevice();

  // We only keep refs for internal staggered animations not handled by wrapper
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  // Helper to parse stats from string "20+" -> number: 20, suffix: "+"
  const parseStat = (val: string) => {
    const match = val.match(/^(\d+(?:\.\d+)?)([A-Za-z+]*)$/);
    if (match) {
      return { number: parseFloat(match[1]), suffix: match[2] };
    }
    return { number: 0, suffix: val }; // Fallback
  };

  const branchesStat = parseStat(siteContent.statistics.branches);
  const customersStat = parseStat(siteContent.statistics.customers);
  const experienceStat = parseStat(siteContent.statistics.years);
  const productsStat = parseStat(siteContent.statistics.products);

  const stats = useMemo(() => [
    { number: branchesStat.number, suffix: branchesStat.suffix, label: t("about.stats.branches"), sub: "Branches" },
    { number: customersStat.number, suffix: customersStat.suffix, label: t("about.stats.customers"), sub: "Happy Customers" },
    { number: experienceStat.number, suffix: experienceStat.suffix, label: t("about.stats.experience"), sub: "Years Experience" },
    { number: productsStat.number, suffix: productsStat.suffix, label: t("about.stats.products"), sub: "Products" },
  ], [branchesStat, customersStat, experienceStat, productsStat, t]);

  useEffect(() => {
    let ctx: gsap.Context;

    const initAnimations = () => {
      // Wrapper handles main fade in, we just handle internal staggering here
      ctx = gsap.context(() => {
        // Right Column Animation (Text Stagger)
        if (rightColRef.current) {
          gsap.fromTo(rightColRef.current.children,
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              stagger: 0.1,
              ease: "power2.out",
              scrollTrigger: {
                trigger: rightColRef.current,
                start: "top 85%",
                toggleActions: "play none none none"
              }
            }
          );
        }

        // Stats Counter Animation
        if (statsRef.current) {
          const statElements = Array.from(statsRef.current.querySelectorAll(".stat-number"));
          if (statElements.length > 0) {
            ScrollTrigger.create({
              trigger: statsRef.current,
              start: "top 90%",
              once: true,
              onEnter: () => {
                statElements.forEach((element, index) => {
                  if (index >= stats.length) return;
                  const target = stats[index].number;
                  const obj = { value: 0 };

                  gsap.to(obj, {
                    value: target,
                    duration: 2,
                    ease: "power2.out",
                    onUpdate: () => {
                      if (element) {
                        const val = Math.ceil(obj.value);
                        element.textContent = val.toLocaleString();
                      }
                    }
                  });
                });
              }
            });
          }
        }
      });
    };

    // Small timeout to ensure DOM is ready
    const timer = setTimeout(initAnimations, 100);

    return () => {
      clearTimeout(timer);
      if (ctx) ctx.revert();
    };
  }, [stats]);

  return (
    <SectionWrapper
      id="about"
      className="bg-white rounded-t-[3rem] md:rounded-t-[4rem] -mt-10 z-20"
      aria-label={t("about.title")}
    >
      <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-center text-primary mb-8 md:mb-12">
        {t("about.title")} <span className="text-accent">{t("about.titleHighlight")}</span>
      </h2>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">

        {/* Left Column: Founder Image & Quote */}
        <div ref={leftColRef} className="relative w-full max-w-[280px] sm:max-w-sm mx-auto lg:sticky lg:top-24 mb-4 md:mb-0">
          {/* Background Shape */}
          <div className="absolute top-4 -left-4 w-full h-full bg-accent/5 rounded-4xl md:rounded-[2.5rem] -z-10 transform -rotate-2 scale-105" />

          <div className="relative aspect-4/5 w-full rounded-4xl md:rounded-[2.5rem] overflow-hidden shadow-2xl">
            {(() => {
              const blurUrl = getBlurPlaceholder("founder");
              return (
                <Image
                  src={getOptimizedImagePath("/images/founder.jpg")}
                  alt="Mr. Askar Neyyan - Founder"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  placeholder={blurUrl ? "blur" : "empty"}
                  blurDataURL={blurUrl}
                />
              );
            })()}

            {/* Founder Name on Image */}
            <div className="absolute bottom-0 left-0 w-full bg-linear-to-t from-black/80 to-transparent p-8 pt-24 text-white">
              <p className="font-bold text-xl">Mr. Askar Neyyan</p>
              <p className="text-white/80 text-sm">Founder & Managing Director</p>
            </div>
          </div>

          {/* Floating Quote Card - Desktop Only */}
          {!isMobile && (
            <div className="hidden md:block absolute bottom-12 -right-6 md:bottom-20 md:-right-20 bg-white/95 backdrop-blur-sm p-5 rounded-2xl shadow-xl max-w-[240px] animate-float border border-gray-100/50 z-20">
              <Quote className="text-accent w-6 h-6 mb-2 opacity-90" />
              <p className="text-gray-700 text-sm font-medium leading-relaxed italic">
                &quot;We don&apos;t just sell products; we build relationships. Our growth is fueled by trust and quality.&quot;
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Narrative & Stats */}
        <div ref={rightColRef} className="flex flex-col space-y-6 md:space-y-8 lg:pt-8">
          <div>
            <span className="text-accent font-bold text-lg md:text-xl mb-2 md:mb-3 block">Our Story</span>
            <h3 className="text-3xl md:text-4xl font-bold text-primary leading-tight">
              Who We Are
            </h3>
          </div>

          <div className="space-y-4 text-gray-600 text-base md:text-lg leading-relaxed relative">
            <p>
              THAHAMA:market is the fastest-growing supermarket chain in Saudi Arabia and the UAE, dedicated to providing the highest quality products and exceptional customer service.
            </p>

            {/* Mobile Quote Card - Embedded in text */}
            {isMobile && (
              <div className="md:hidden mt-6 bg-accent/5 p-5 rounded-2xl border-l-4 border-accent relative overflow-hidden">
                <Quote className="text-accent w-5 h-5 mb-2 opacity-90" />
                <p className="text-gray-700 text-sm font-medium leading-relaxed italic relative z-10">
                  &quot;We don&apos;t just sell products; we build relationships. Our growth is fueled by trust and quality.&quot;
                </p>
                <div className="absolute -right-4 -bottom-4 text-accent/10">
                  <Quote className="w-24 h-24 transform rotate-180" />
                </div>
              </div>
            )}
          </div>

          {/* Serving Locations */}
          <div className="pt-2 w-full overflow-x-auto no-scrollbar md:w-auto">
            <div className="inline-flex items-center space-x-3 bg-white px-5 py-3 md:px-6 md:py-4 rounded-full shadow-md border border-gray-100 whitespace-nowrap min-w-min">
              <span className="font-bold text-primary text-base md:text-lg">Serving</span>
              <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-accent" />
              <span className="font-medium text-gray-700 text-sm md:text-base">Jeddah</span>
              <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-accent" />
              <span className="font-medium text-gray-700 text-sm md:text-base">Mecca</span>
              <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-accent" />
              <span className="font-medium text-gray-700 text-sm md:text-base">Madinah</span>
            </div>
          </div>

          {/* Stats Section - Moved inside Right Column */}
          <div ref={statsRef} className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 pt-4 md:pt-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="group bg-white p-3 md:p-4 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 text-center border border-gray-50 hover:border-accent/30 flex flex-col items-center justify-center min-h-[100px] md:min-h-[120px] relative overflow-hidden"
              >
                {/* Subtle gradient background on hover */}
                <div className="absolute inset-0 bg-linear-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10">
                  <div className="flex items-center justify-center text-2xl md:text-3xl font-bold text-accent mb-1 group-hover:scale-110 transition-transform duration-300">
                    <span className="stat-number">0</span>
                    <span>{stat.suffix}</span>
                  </div>
                  <p className="text-gray-600 font-medium text-xs md:text-sm leading-tight group-hover:text-primary transition-colors">
                    {stat.sub}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Contextual CTA */}
          {/* <button className="mt-8 group flex items-center gap-2 text-primary font-bold hover:text-accent transition-colors w-fit">
            Read Full History 
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </button> */}
        </div>

      </div>
    </SectionWrapper>
  );
}
