"use client";

import { useEffect, useRef, useState } from "react";
import { siteContent } from "@/app/data/siteContent";
import { useLanguage } from "@/app/i18n/LanguageContext";
import SectionWrapper from "@/app/components/ui/SectionWrapper";
import { createGSAPContext, createStaggerAnimation } from "@/app/lib/gsap-utils";
import { FiCheck, FiClock, FiMapPin, FiArrowRight, FiInfo } from "react-icons/fi";

// --- Types & Helpers ---

type ServiceStatus = "available" | "limited" | "coming_soon";

interface StatusConfig {
  label: string;
  color: string;
  bg: string;
  border: string;
  icon: React.ElementType;
}

const getStatusFromDescription = (desc: string): ServiceStatus => {
  const lowerDesc = desc.toLowerCase();
  if (lowerDesc.includes("none")) return "coming_soon";
  if (lowerDesc.includes("only") || lowerDesc.includes("3 branches")) return "limited";
  return "available";
};

const statusConfig: Record<ServiceStatus, StatusConfig> = {
  available: {
    label: "Available",
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    icon: FiCheck,
  },
  limited: {
    label: "Select Locations",
    color: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
    icon: FiMapPin,
  },
  coming_soon: {
    label: "Coming Soon",
    color: "text-slate-500",
    bg: "bg-slate-50",
    border: "border-slate-200",
    icon: FiClock,
  },
};

// --- Spotlight Card Component ---

const SpotlightCard = ({
  children,
  className = "",
  spotlightColor = "rgba(255, 107, 53, 0.1)", // More subtle spotlight
}: {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
}) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseEnter = () => setOpacity(1);
  const handleMouseLeave = () => setOpacity(0);

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-md border border-white/60 shadow-lg transition-all duration-500 ease-out hover:border-accent/40 hover:shadow-2xl hover:shadow-accent/10 ${className}`}
    >
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-500"
        style={{
          opacity,
          background: `radial-gradient(800px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 40%)`,
        }}
      />
      <div className="relative h-full">{children}</div>
    </div>
  );
};

export default function Services() {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cleanup = createGSAPContext(() => {
      if (containerRef.current) {
        const cards = containerRef.current.querySelectorAll(".service-card-wrapper");
        createStaggerAnimation(cards as NodeListOf<HTMLElement>, {
          trigger: containerRef.current,
          stagger: 0.1,
          y: 60,
          duration: 1,
          ease: "power3.out",
          start: "top 85%",
        });
      }
    }, containerRef.current);

    return cleanup;
  }, []);

  return (
    <SectionWrapper
      id="services"
      className="relative z-30 pt-20! md:pt-32! pb-20! md:pb-24! -mt-0 md:-mt-4 rounded-t-[2.5rem] md:rounded-t-[5rem] overflow-hidden shadow-[0_-25px_50px_-12px_rgba(0,0,0,0.15)] border-t border-white/40 bg-slate-50"
      aria-label={`${t("services.title")} ${t("services.titleHighlight")}`}
      disableAnimation={true}
    >
      {/* Animated Gradient Background - Optimized with transform for performance */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div
          className="absolute -inset-[100%] w-[300%] h-[300%] animate-gradient-flow will-change-transform"
          style={{
            background: 'linear-gradient(-45deg, #eff6ff, #fff7ed, #f0fdf4, #f8fafc)',
            backgroundSize: '100% 100%',
          }}
        />
      </div>
      <style jsx>{`
        @keyframes gradient-flow {
          0% { transform: translate3d(0, 0, 0); }
          50% { transform: translate3d(-15%, -15%, 0); }
          100% { transform: translate3d(0, 0, 0); }
        }
        .animate-gradient-flow {
          /* Fallback: no animation if reduced motion is preferred */
        }
        @media (prefers-reduced-motion: no-preference) {
          .animate-gradient-flow {
            animation: gradient-flow 15s ease infinite;
          }
        }
      `}</style>

      <div className="container mx-auto" ref={containerRef}>

        {/* Editorial Header Layout */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-20">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold tracking-wider uppercase mb-6">
              <span className="w-2 h-2 rounded-full bg-accent"></span>
              Our Expertise
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight leading-[1.1]">
              {t("services.title")} <br className="hidden md:block" />
              <span className="text-accent inline-block relative">
                {t("services.titleHighlight")}
                {/* Subtle underline SVG */}
                <svg className="absolute w-full h-3 -bottom-2 left-0 text-accent/20" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="6" fill="none" />
                </svg>
              </span>
            </h2>
          </div>

          <div className="max-w-md lg:pb-4">
            <p className="text-lg text-slate-500 leading-relaxed">
              {t("services.subtitle")}
            </p>
          </div>
        </div>

        {/* Modern Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {siteContent.services.map((service) => {
            const Icon = service.icon;
            const status = getStatusFromDescription(service.description);
            const statusInfo = statusConfig[status];
            const StatusIcon = statusInfo.icon;

            return (
              <div key={service.id} className="service-card-wrapper">
                <SpotlightCard className="h-full group flex flex-col">
                  <div className="p-5 md:p-8 flex flex-col h-full">

                    {/* Top Row: Icon and Status */}
                    <div className="flex justify-between items-start mb-4 md:mb-8">
                      <div className="w-10 h-10 md:w-14 md:h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-primary group-hover:bg-accent group-hover:text-white group-hover:scale-110 transition-all duration-500 ease-out shadow-sm group-hover:shadow-accent/30">
                        <Icon className="text-lg md:text-2xl transition-transform duration-500 group-hover:rotate-[-5deg]" />
                      </div>

                      <div className={`flex items-center gap-1.5 px-2.5 py-0.5 md:px-3 md:py-1 rounded-full text-[10px] md:text-[11px] font-bold tracking-wide uppercase ${statusInfo.bg} ${statusInfo.color} ${statusInfo.border} border`}>
                        <StatusIcon className="w-3 h-3" />
                        <span>{statusInfo.label}</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-2 md:mb-3 group-hover:text-accent transition-colors duration-300">
                        {service.title}
                      </h3>

                      <p className="text-slate-500 text-sm leading-relaxed mb-4 md:mb-6 line-clamp-3 md:line-clamp-none">
                        {status === "coming_soon"
                          ? "We are working hard to bring this service to you soon."
                          : status === "limited"
                            ? `Currently available at select locations: ${service.description.replace("Only in ", "").replace("Yes ", "")}`
                            : "Experience our premium quality and dedicated service at all our branches."}
                      </p>
                    </div>

                    {/* Bottom Action */}
                    <div className="mt-auto pt-4 md:pt-6 border-t border-slate-50 flex items-center text-sm font-semibold text-slate-400 group-hover:text-primary transition-colors duration-300 cursor-pointer">
                      <span className="mr-2">Explore Service</span>
                      <FiArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300 text-accent" />
                    </div>
                  </div>
                </SpotlightCard>
              </div>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="mt-16 text-center">
          <p className="text-slate-400 text-sm flex items-center justify-center gap-2">
            <FiInfo className="w-4 h-4" />
            Services may vary by location. Please check with your local branch.
          </p>
        </div>

      </div>
    </SectionWrapper>
  );
}
