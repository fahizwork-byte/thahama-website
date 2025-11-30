"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { number: 5, suffix: "+", label: "Branches" },
  { number: 10000, suffix: "+", label: "Happy Customers" },
  { number: 15, suffix: "+", label: "Years Experience" },
  { number: 500, suffix: "+", label: "Products" },
];

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Parallax zoom effect on about image
      // Zoom in when scrolling up, zoom out when scrolling down
      if (imageRef.current && sectionRef.current) {
        // Set initial scale (zoomed in)
        gsap.set(imageRef.current, { scale: 1.25 });

        const handleScroll = () => {
          const scrollY = window.scrollY;
          const sectionTop = sectionRef.current?.offsetTop || 0;
          const sectionHeight = sectionRef.current?.offsetHeight || 0;
          const windowHeight = window.innerHeight;
          
          // Calculate when section enters viewport
          const sectionStart = sectionTop - windowHeight;
          const sectionEnd = sectionTop + sectionHeight;
          
          // Calculate scroll progress relative to section
          // When section is at top of viewport: progress = 0 (zoomed in)
          // When section is scrolled past: progress = 1 (normal size)
          let scrollProgress = 0;
          
          if (scrollY > sectionStart && scrollY < sectionEnd) {
            // Section is in viewport
            scrollProgress = (scrollY - sectionStart) / (sectionEnd - sectionStart);
          } else if (scrollY >= sectionEnd) {
            // Section is scrolled past
            scrollProgress = 1;
          }
          
          // Zoom out as you scroll down through the section
          // At top: scale = 1.25 (zoomed in)
          // At bottom: scale = 1.0 (normal size)
          const scale = 1.25 - scrollProgress * 0.25;
          
          // Clamp scale between 1.0 and 1.25
          const clampedScale = Math.max(1.0, Math.min(1.25, scale));
          
          gsap.to(imageRef.current, {
            scale: clampedScale,
            duration: 0.2,
            ease: "none",
          });
        };

        // Use requestAnimationFrame for smooth performance
        let ticking = false;
        const scrollHandler = () => {
          if (!ticking) {
            window.requestAnimationFrame(() => {
              handleScroll();
              ticking = false;
            });
            ticking = true;
          }
        };

        window.addEventListener("scroll", scrollHandler, { passive: true });
        
        // Initial call to set correct scale
        handleScroll();

        return () => {
          window.removeEventListener("scroll", scrollHandler);
        };
      }
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
              end: "top 50%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      // Content animation
      if (contentRef.current) {
        gsap.fromTo(
          contentRef.current,
          {
            opacity: 0,
            x: -50,
          },
          {
            opacity: 1,
            x: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: contentRef.current,
              start: "top 80%",
              end: "top 50%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      // Stats animation with counter
      if (statsRef.current) {
        const statElements = statsRef.current.querySelectorAll(".stat-number");

        statElements.forEach((element, index) => {
          const target = stats[index].number;
          const obj = { value: 0 };

          gsap.to(obj, {
            value: target,
            duration: 2,
            ease: "power2.out",
            onUpdate: () => {
              element.textContent = Math.round(obj.value).toLocaleString();
            },
            scrollTrigger: {
              trigger: statsRef.current,
              start: "top 75%",
              toggleActions: "play none none none",
            },
          });
        });

        gsap.fromTo(
          statsRef.current.children,
          {
            opacity: 0,
            y: 30,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: statsRef.current,
              start: "top 75%",
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
      id="about"
      ref={sectionRef}
      className="pt-16 md:pt-20 pb-12 md:pb-16 bg-light relative overflow-hidden -mt-20 md:-mt-32 rounded-t-3xl z-10"
    >
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <h2
          ref={titleRef}
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-center text-primary mb-8"
        >
          About <span className="text-accent">Thahama Market</span>
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-12">
          <div ref={contentRef}>
            <h3 className="text-2xl md:text-3xl font-bold text-primary mb-6">
              Who We Are
            </h3>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              THAHAMA:market is the fastest-growing supermarket chain in Saudi Arabia and the UAE,
              dedicated to providing the highest quality products and exceptional customer service.
            </p>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              Our commitment to freshness, quality, and community has made us a trusted name
              across the region. From fresh produce to household essentials, we ensure every
              product meets our rigorous standards.
            </p>
            <p className="text-gray-600 text-lg leading-relaxed">
              With multiple branches strategically located throughout Jeddah and expanding to the UAE,
              we're bringing premium shopping experiences closer to you.
            </p>
          </div>

          <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl">
            <div
              ref={imageRef}
              className="absolute inset-0"
              style={{ 
                willChange: "transform",
                transformOrigin: "center center"
              }}
            >
              <Image
                src="/images/about_image.png"
                alt="About Thahama Market"
                fill
                className="object-cover rounded-2xl"
              />
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div
          ref={statsRef}
          className="grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center p-8 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300"
            >
              <div className="text-4xl md:text-5xl font-bold text-accent mb-2">
                <span className="stat-number">0</span>
                <span>{stat.suffix}</span>
              </div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

