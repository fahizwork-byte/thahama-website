"use client";

import { useEffect, useRef, useState } from "react";
import { FiMapPin, FiPhone, FiClock, FiCheck, FiArrowRight } from "react-icons/fi";
import Link from "next/link";
import { useLanguage } from "@/app/i18n/LanguageContext";
import { siteContent } from "@/app/data/siteContent";
import SectionWrapper from "@/app/components/ui/SectionWrapper";
import { createGSAPContext, createStaggerAnimation } from "@/app/lib/gsap-utils";

export default function Branches() {
  const { t, language } = useLanguage();
  const cardsRef = useRef<HTMLDivElement>(null);
  const [copiedPhone, setCopiedPhone] = useState<string | null>(null);

  const copyToClipboard = async (phone: string) => {
    try {
      await navigator.clipboard.writeText(phone);
      setCopiedPhone(phone);
      setTimeout(() => setCopiedPhone(null), 2000);
    } catch (err) {
      console.error("Failed to copy phone number:", err);
    }
  };

  useEffect(() => {
    // Only handle internal stagger animation for cards
    // Section fade-in is handled by SectionWrapper
    const cleanup = createGSAPContext(() => {
      if (cardsRef.current) {
        const cards = cardsRef.current.querySelectorAll(".branch-card");
        createStaggerAnimation(cards as NodeListOf<HTMLElement>, {
          trigger: cardsRef.current,
          y: 40,
          stagger: 0.15,
        });
      }
    }, cardsRef.current);

    return cleanup;
  }, []);

  return (
    <SectionWrapper
      id="branches"
      className="bg-light z-10"
      aria-label={t("branches.title")}
    >
      {/* Background Decoration */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl -z-10" />

      <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center text-primary mb-4 md:mb-6">
        {t("branches.title")} <span className="text-accent">{t("branches.titleHighlight")}</span>
      </h2>

      <p className="text-center text-gray-600 text-lg mb-8 md:mb-16 max-w-2xl mx-auto">
        {t("branches.subtitle")}
      </p>

      <div
        ref={cardsRef}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8"
      >
        {siteContent.branches.slice(0, 3).map((branch, index) => (
          <div
            key={index}
            className={`branch-card group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 opacity-0 ${branch.status === "coming_soon"
              ? "border-gray-300 opacity-75"
              : "border-transparent hover:border-accent"
              }`}
          >
            {/* Status Badge */}
            {branch.status === "coming_soon" && (
              <div className="inline-block bg-accent text-primary text-xs font-bold px-3 py-1 rounded-full mb-4">
                {t("branches.status.comingSoon")}
              </div>
            )}

            {branch.status === "open" && (
              <div className="inline-block bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-4">
                {t("branches.status.open")}
              </div>
            )}

            <h3 className="text-2xl font-bold text-primary mb-2 group-hover:text-accent transition-colors duration-300">
              {language === 'ar' ? branch.nameAr : branch.nameEn}
            </h3>

            <div className="space-y-4 mt-6">
              <div className="flex items-start gap-3">
                <FiMapPin className="text-accent text-xl mt-1 shrink-0" />
                <div>
                  <p className="text-gray-600 text-sm">{branch.address}</p>
                </div>
              </div>

              {branch.status === "open" && (
                <>
                  <div className="flex items-center gap-3">
                    <FiPhone className="text-accent text-xl shrink-0" />
                    <button
                      onClick={() => copyToClipboard(branch.phone)}
                      className="text-gray-600 hover:text-accent transition-all cursor-pointer flex items-center gap-2 underline"
                      title="Click to copy"
                    >
                      <span className="font-mono" dir="ltr">{branch.phone}</span>
                      {copiedPhone === branch.phone && (
                        <FiCheck className="text-green-500 text-sm shrink-0" />
                      )}
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <FiClock className="text-accent text-xl shrink-0" />
                    <p className="text-gray-600">{branch.hours}</p>
                  </div>
                </>
              )}

              {branch.status === "coming_soon" && (
                <p className="text-gray-500 italic">{t("branches.stayTuned")}</p>
              )}
            </div>

            {branch.status === "open" && (
              <button className="mt-6 w-full bg-primary hover:bg-accent text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105">
                {t("branches.getDirections")}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* View All Button */}
      <div className="mt-12 text-center">
        <Link
          href="/locations"
          className="inline-flex items-center gap-2 bg-white text-primary px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl hover:bg-gray-50 transition-all duration-300 group border border-gray-100"
        >
          View All {siteContent.statistics.branches} Locations
          <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </SectionWrapper>
  );
}
