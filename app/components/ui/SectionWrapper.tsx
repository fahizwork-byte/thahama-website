"use client";

import React, { useRef, useEffect, ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useDevice } from "@/app/hooks/useDevice";
import { createFadeInAnimation, createGSAPContext } from "@/app/lib/gsap-utils";

interface SectionWrapperProps {
  id: string;
  children: ReactNode;
  className?: string;
  disableAnimation?: boolean;
  role?: string;
  "aria-label"?: string;
  animationStart?: string;
}

gsap.registerPlugin(ScrollTrigger);

/**
 * Unified Section Wrapper
 * 
 * Handles:
 * - Standard Layout & Spacing
 * - Entrance Animations (Auto Fade-In)
 * - Device-Specific Optimization
 * - Accessibility
 */
export default function SectionWrapper({
  id,
  children,
  className = "",
  disableAnimation = false,
  role = "region",
  "aria-label": ariaLabel,
  animationStart,
}: SectionWrapperProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const { isMobile, isTouch } = useDevice();

  useEffect(() => {
    // Skip animation if explicitly disabled
    if (disableAnimation) return;

    // Optional: Simplified animation for low-power devices could be handled here
    // For now, we keep the standard smooth fade-in

    const cleanup = createGSAPContext(() => {
      if (contentRef.current) {
        createFadeInAnimation(contentRef.current, {
          y: 30,
          duration: 0.8,
          ease: "power2.out",
          start: animationStart,
        });
      }
    }, sectionRef.current);

    return cleanup;
  }, [disableAnimation, isMobile, animationStart]);

  return (
    <section
      id={id}
      ref={sectionRef}
      role={role}
      aria-label={ariaLabel}
      className={`relative w-full py-16 md:py-24 overflow-hidden ${className}`}
    >
      <div 
        ref={contentRef}
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 ${disableAnimation ? "" : "opacity-0"}`} // Start invisible only if animating
      >
        {children}
      </div>
    </section>
  );
}

