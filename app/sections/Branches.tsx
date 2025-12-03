"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FiMapPin, FiPhone, FiClock, FiCheck } from "react-icons/fi";
import branchesData from "@/app/data/branches.json";

gsap.registerPlugin(ScrollTrigger);

export default function Branches() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
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

      // Cards animation
      if (cardsRef.current) {
        const cards = cardsRef.current.querySelectorAll(".branch-card");

        gsap.fromTo(
          cards,
          {
            opacity: 0,
            y: 60,
            rotateY: -15,
          },
          {
            opacity: 1,
            y: 0,
            rotateY: 0,
            duration: 0.8,
            stagger: 0.15,
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
      id="branches"
      ref={sectionRef}
      className="py-20 md:py-32 bg-light relative overflow-hidden z-10"
    >
      {/* Background Decoration */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <h2
          ref={titleRef}
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-center text-primary mb-6"
        >
          Our <span className="text-accent">Branches</span>
        </h2>

        <p className="text-center text-gray-600 text-lg mb-16 max-w-2xl mx-auto">
          Visit us at any of our conveniently located branches across Saudi Arabia and UAE
        </p>

        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {branchesData.branches.map((branch) => (
            <div
              key={branch.id}
              className={`branch-card group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 ${branch.status === "coming_soon"
                ? "border-gray-300 opacity-75"
                : "border-transparent hover:border-accent"
                }`}
            >
              {/* Status Badge */}
              {branch.status === "coming_soon" && (
                <div className="inline-block bg-accent text-primary text-xs font-bold px-3 py-1 rounded-full mb-4">
                  Coming Soon
                </div>
              )}

              {branch.status === "open" && (
                <div className="inline-block bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-4">
                  Open Now
                </div>
              )}

              <h3 className="text-2xl font-bold text-primary mb-2 group-hover:text-accent transition-colors duration-300">
                {branch.name}
              </h3>

              <p className="text-gray-500 text-sm mb-6">{branch.nameArabic}</p>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <FiMapPin className="text-accent text-xl mt-1 shrink-0" />
                  <div>
                    <p className="font-semibold text-primary">{branch.city}</p>
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
                        <span className="font-mono">{branch.phone}</span>
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
                  <p className="text-gray-500 italic">Stay tuned for opening date!</p>
                )}
              </div>

              {branch.status === "open" && (
                <button className="mt-6 w-full bg-primary hover:bg-accent text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105">
                  Get Directions
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

