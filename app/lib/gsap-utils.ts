/**
 * GSAP Utilities
 * 
 * Shared GSAP configurations and optimized imports to reduce bundle size.
 * This file centralizes GSAP setup to enable better tree-shaking.
 */

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger once (shared across all components)
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Common GSAP animation configurations
 */
export const gsapConfig = {
  // Common easing functions
  ease: {
    smooth: "power3.out",
    bouncy: "elastic.out(1, 0.3)",
    quick: "power2.out",
  },
  
  // Common durations
  duration: {
    fast: 0.3,
    normal: 0.6,
    slow: 1.0,
  },
  
  // ScrollTrigger defaults
  scrollTrigger: {
    start: "top 80%",
    toggleActions: "play none none none",
  },
};

/**
 * Create a reusable fade-in animation
 */
export function createFadeInAnimation(
  element: HTMLElement | null,
  options?: {
    y?: number;
    duration?: number;
    delay?: number;
    ease?: string;
  }
) {
  if (!element) return null;
  
  const { y = 50, duration = 1, delay = 0, ease = gsapConfig.ease.smooth } = options || {};
  
  return gsap.fromTo(
    element,
    {
      opacity: 0,
      y,
    },
    {
      opacity: 1,
      y: 0,
      duration,
      delay,
      ease,
      scrollTrigger: {
        trigger: element,
        start: gsapConfig.scrollTrigger.start,
        toggleActions: gsapConfig.scrollTrigger.toggleActions,
      },
    }
  );
}

/**
 * Create a stagger animation for multiple elements
 */
export function createStaggerAnimation(
  elements: HTMLElement[] | NodeListOf<HTMLElement>,
  options?: {
    y?: number;
    duration?: number;
    stagger?: number;
    ease?: string;
    trigger?: HTMLElement | null; // Optional trigger for scroll animation
  }
) {
  if (!elements || elements.length === 0) return null;
  
  const { 
    y = 40, 
    duration = 0.8, 
    stagger = 0.1, 
    ease = gsapConfig.ease.quick,
    trigger = null 
  } = options || {};
  
  const vars: gsap.TweenVars = {
    opacity: 1,
    y: 0,
    duration,
    stagger,
    ease,
  };

  // Add scrollTrigger if a trigger element is provided
  if (trigger) {
    vars.scrollTrigger = {
      trigger: trigger,
      start: gsapConfig.scrollTrigger.start,
      toggleActions: gsapConfig.scrollTrigger.toggleActions,
    };
  }
  
  return gsap.fromTo(
    elements,
    {
      opacity: 0,
      y,
    },
    vars
  );
}

/**
 * Create a scroll-triggered animation with context
 */
export function createScrollTriggerAnimation(
  trigger: HTMLElement | null,
  animation: gsap.core.Tween | gsap.core.Timeline,
  options?: {
    start?: string;
    end?: string;
    toggleActions?: string;
  }
) {
  if (!trigger) return null;
  
  const {
    start = gsapConfig.scrollTrigger.start,
    toggleActions = gsapConfig.scrollTrigger.toggleActions,
  } = options || {};
  
  return ScrollTrigger.create({
    trigger,
    start,
    toggleActions,
    animation,
  });
}

/**
 * Optimized GSAP context helper
 * Use this to ensure proper cleanup of animations
 */
export function createGSAPContext(
  callback: (context: gsap.Context) => void,
  scope?: HTMLElement | null
): () => void {
  const ctx = gsap.context(callback, scope || undefined);
  return () => ctx.revert();
}

// Re-export commonly used GSAP functions for tree-shaking
export { gsap, ScrollTrigger };

