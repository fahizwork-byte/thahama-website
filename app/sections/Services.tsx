"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FiShoppingBag, FiTruck, FiCoffee, FiPackage, FiGift, FiHome, FiAward } from "react-icons/fi";

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    icon: FiShoppingBag,
    title: "In-Store Shopping",
    description: "Browse our wide selection of quality products in comfortable, modern stores",
  },
  {
    icon: FiTruck,
    title: "Fast Home Delivery",
    description: "Get your groceries delivered fresh to your doorstep in record time",
  },
  {
    icon: FiCoffee,
    title: "Fresh Bakery",
    description: "Daily fresh bread, pastries, and baked goods made with premium ingredients",
  },
  {
    icon: FiPackage,
    title: "Fresh Vegetables",
    description: "Farm-fresh produce delivered daily for maximum freshness and quality",
  },
  {
    icon: FiGift,
    title: "Meat & Seafood",
    description: "Premium quality meat and fresh seafood from trusted suppliers",
  },
  {
    icon: FiHome,
    title: "Household Essentials",
    description: "Everything you need for your home, from cleaning to personal care",
  },
  {
    icon: FiAward,
    title: "Rewards & Loyalty",
    description: "Earn points with every purchase and enjoy exclusive member benefits",
  },
];

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

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

      // Cards stagger animation
      if (cardsRef.current) {
        const cards = cardsRef.current.querySelectorAll(".service-card");

        gsap.fromTo(
          cards,
          {
            opacity: 0,
            y: 60,
            scale: 0.9,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: cardsRef.current,
              start: "top 70%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="services"
      ref={sectionRef}
      className="py-20 md:py-32 bg-white relative overflow-hidden z-10"
    >
      {/* Background Decoration */}
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <h2
          ref={titleRef}
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-center text-primary mb-6"
        >
          Our <span className="text-accent">Services</span>
        </h2>

        <p className="text-center text-gray-600 text-lg mb-16 max-w-2xl mx-auto">
          Everything you need, all in one place. Experience convenience like never before.
        </p>

        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                className="service-card group bg-light hover:bg-white p-4 md:p-8 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-accent"
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
      </div>
    </section>
  );
}

