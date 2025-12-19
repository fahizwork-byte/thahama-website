"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FiChevronDown } from "react-icons/fi";

gsap.registerPlugin(ScrollTrigger);

import { useLanguage } from "@/app/i18n/LanguageContext";
import { siteContent } from "@/app/data/siteContent";

gsap.registerPlugin(ScrollTrigger);

export default function FAQ() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

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

      // FAQ items animation
      if (containerRef.current) {
        const items = containerRef.current.querySelectorAll(".faq-item");

        gsap.fromTo(
          items,
          {
            opacity: 0,
            y: 30,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 70%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id="faq"
      ref={sectionRef}
      className="py-12 md:py-32 bg-white relative overflow-hidden z-10"
    >
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-full h-full bg-[url('/images/pattern.png')] opacity-[0.03] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <h2
          ref={titleRef}
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-center text-primary mb-4 md:mb-6"
        >
          {t("faq.title")} <span className="text-accent">{t("faq.titleHighlight")}</span>
        </h2>

        <p className="text-center text-gray-600 text-lg mb-12 md:mb-20 max-w-2xl mx-auto">
          {t("faq.subtitle")}
        </p>

        <div ref={containerRef} className="space-y-4">
          {siteContent.faq.map((item, index) => (
            <div
              key={item.id}
              className={`faq-item border border-gray-200 rounded-2xl overflow-hidden transition-all duration-300 ${openIndex === index ? "bg-light shadow-md border-accent/30" : "bg-white hover:border-accent/50"
                }`}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left rtl:text-right focus:outline-none"
                aria-expanded={openIndex === index}
              >
                <span className={`text-lg md:text-xl font-bold transition-colors duration-300 ${openIndex === index ? "text-accent" : "text-primary"
                  }`}>
                  {item.question}
                </span>
                <span className={`ml-4 rtl:mr-4 rtl:ml-0 transform transition-transform duration-300 text-accent text-xl ${openIndex === index ? "rotate-180" : ""
                  }`}>
                  <FiChevronDown />
                </span>
              </button>

              <div
                className={`overflow-hidden transition-all duration-500 ease-in-out ${openIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  }`}
              >
                <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                  {item.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

