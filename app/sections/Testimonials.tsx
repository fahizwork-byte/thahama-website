"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FiStar } from "react-icons/fi";

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    id: 1,
    name: "Ahmed Al-Shahrani",
    nameArabic: "أحمد الشهراني",
    role: "Regular Customer",
    rating: 5,
    text: "Best supermarket in Jeddah! Fresh products, excellent service, and great prices. My family shops here every week.",
  },
  {
    id: 2,
    name: "Fatima Mohammed",
    nameArabic: "فاطمة محمد",
    role: "Loyal Member",
    rating: 5,
    text: "The home delivery service is amazing! Always on time and products are always fresh. The rewards program is a bonus!",
  },
  {
    id: 3,
    name: "Khalid bin Saleh",
    nameArabic: "خالد بن صالح",
    role: "Happy Shopper",
    rating: 5,
    text: "I love the bakery section! Fresh bread every morning and the staff is always helpful and friendly.",
  },
  {
    id: 4,
    name: "Sara Abdullah",
    nameArabic: "سارة عبدالله",
    role: "Verified Buyer",
    rating: 5,
    text: "Clean store, organized aisles, and quality products. Thahama Market has become our go-to grocery store.",
  },
  {
    id: 5,
    name: "Mohammed Al-Ghamdi",
    nameArabic: "محمد الغامدي",
    role: "Regular Customer",
    rating: 5,
    text: "Excellent variety of products and competitive prices. The meat and seafood section is outstanding!",
  },
];

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<gsap.core.Tween | null>(null);
  const resumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

      // Carousel auto-scroll animation
      if (carouselRef.current) {
        const carousel = carouselRef.current;
        const cards = carousel.querySelectorAll(".testimonial-card");
        const cardWidth = cards[0]?.clientWidth || 0;
        const gap = 32; // 2rem gap
        const totalWidth = (cardWidth + gap) * testimonials.length;

        // Duplicate for seamless loop
        const clone = carousel.innerHTML;
        carousel.innerHTML += clone;

        // Infinite scroll animation
        const carouselAnimation = gsap.to(carousel, {
          x: -(totalWidth),
          duration: 40,
          ease: "none",
          repeat: -1,
          modifiers: {
            x: gsap.utils.unitize((x) => parseFloat(x) % totalWidth),
          },
        });

        animationRef.current = carouselAnimation;

        // Function to pause animation
        const pauseAnimation = () => {
          carouselAnimation.timeScale(0);
          // Clear any existing resume timeout
          if (resumeTimeoutRef.current) {
            clearTimeout(resumeTimeoutRef.current);
          }
        };

        // Function to resume animation after delay
        const resumeAnimation = (delay: number = 3000) => {
          // Clear any existing resume timeout
          if (resumeTimeoutRef.current) {
            clearTimeout(resumeTimeoutRef.current);
          }
          // Resume after delay
          resumeTimeoutRef.current = setTimeout(() => {
            carouselAnimation.timeScale(1);
          }, delay);
        };

        // Pause on hover
        carousel.addEventListener("mouseenter", pauseAnimation);

        const handleMouseLeave = () => {
          carouselAnimation.timeScale(1);
        };
        carousel.addEventListener("mouseleave", handleMouseLeave);

        // Pause on card click/touch and resume after 3 seconds
        const handleCardInteraction = () => {
          pauseAnimation();
          resumeAnimation(3000); // Resume after 3 seconds
        };

        // Add event listeners to all cards (including duplicates)
        const allCards = carousel.querySelectorAll(".testimonial-card");
        allCards.forEach((card) => {
          card.addEventListener("click", handleCardInteraction);
          card.addEventListener("touchstart", handleCardInteraction, { passive: true });
        });

        // Cleanup function
        return () => {
          carousel.removeEventListener("mouseenter", pauseAnimation);
          carousel.removeEventListener("mouseleave", handleMouseLeave);
          allCards.forEach((card) => {
            card.removeEventListener("click", handleCardInteraction);
            card.removeEventListener("touchstart", handleCardInteraction);
          });
          if (resumeTimeoutRef.current) {
            clearTimeout(resumeTimeoutRef.current);
          }
        };
      }
    }, sectionRef);

    return () => {
      if (resumeTimeoutRef.current) {
        clearTimeout(resumeTimeoutRef.current);
      }
      ctx.revert();
    };
  }, []);

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      className="py-20 md:py-32 bg-light relative overflow-hidden z-10"
    >
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mb-16">
        <h2
          ref={titleRef}
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-center text-primary mb-6"
        >
          What Our <span className="text-accent">Customers Say</span>
        </h2>

        <p className="text-center text-gray-600 text-lg max-w-2xl mx-auto">
          Join thousands of satisfied customers who trust us for their daily needs
        </p>
      </div>

      {/* Carousel Container */}
      <div className="relative overflow-hidden">
        <div
          ref={carouselRef}
          className="flex gap-8 will-change-transform"
        >
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="testimonial-card shrink-0 w-64 md:w-96 bg-white p-5 md:p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <FiStar key={i} className="text-accent fill-accent" />
                ))}
              </div>

              {/* Testimonial Text */}
              <p className="text-gray-700 leading-relaxed mb-6 italic">
                &ldquo;{testimonial.text}&rdquo;
              </p>

              {/* Customer Info */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-linear-to-br from-accent to-primary rounded-full flex items-center justify-center text-white text-xl font-bold shrink-0">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-primary">{testimonial.name}</h4>
                  <p className="text-gray-500 text-sm">{testimonial.nameArabic}</p>
                  <p className="text-accent text-xs font-medium">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gradient Overlays */}
      <div className="absolute top-0 left-0 bottom-0 w-32 bg-linear-to-r from-light to-transparent pointer-events-none" />
      <div className="absolute top-0 right-0 bottom-0 w-32 bg-linear-to-l from-light to-transparent pointer-events-none" />
    </section>
  );
}

