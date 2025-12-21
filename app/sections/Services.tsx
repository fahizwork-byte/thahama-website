"use client";

import { useEffect, useRef } from "react";
import { siteContent } from "@/app/data/siteContent";
import { useLanguage } from "@/app/i18n/LanguageContext";
import SectionWrapper from "@/app/components/ui/SectionWrapper";
import { createGSAPContext, createStaggerAnimation } from "@/app/lib/gsap-utils";

export default function Services() {
  const { t } = useLanguage();
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // We only need to handle the internal stagger animation
    // The main section fade-in is handled by SectionWrapper
    const cleanup = createGSAPContext(() => {
      if (cardsRef.current) {
        const cards = cardsRef.current.querySelectorAll(".service-card");
        createStaggerAnimation(cards as NodeListOf<HTMLElement>, {
          trigger: cardsRef.current,
          stagger: 0.1,
          y: 30,
        });
      }
    }, cardsRef.current);

    return cleanup;
  }, []);

  return (
    <SectionWrapper
      id="services"
      className="bg-white z-10"
      aria-label={t("services.title")}
    >
      {/* Background Decoration */}
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10" />

      <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center text-primary mb-4 md:mb-6">
        {t("services.title")} <span className="text-accent">{t("services.titleHighlight")}</span>
      </h2>

      <p className="text-center text-gray-600 text-lg mb-8 md:mb-16 max-w-2xl mx-auto">
        {t("services.subtitle")}
      </p>

      <div
        ref={cardsRef}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8"
      >
        {siteContent.services.map((service, index) => {
          const Icon = service.icon;
          return (
            <div
              key={index}
              className="service-card group bg-light hover:bg-white p-4 md:p-8 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-accent opacity-0" // Start hidden for stagger animation
            >
              {/* Mobile: Horizontal layout with icon on left, Desktop: Vertical layout */}
              <div className="flex flex-row md:flex-col items-start gap-3 md:gap-0">
                {/* Icon container */}
                <div className="w-12 h-12 md:w-16 md:h-16 bg-accent/10 group-hover:bg-accent rounded-xl flex items-center justify-center md:mb-6 transition-all duration-300 shrink-0">
                  <Icon className="text-2xl md:text-3xl text-accent group-hover:text-white transition-colors duration-300" />
                </div>

                {/* Text content - stacked vertically */}
                <div className="flex-1 md:flex-none">
                  <h3 className="text-lg md:text-xl font-bold text-primary mb-2 md:mb-3 group-hover:text-accent transition-colors duration-300">
                    {service.title}
                  </h3>

                  <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </SectionWrapper>
  );
}
