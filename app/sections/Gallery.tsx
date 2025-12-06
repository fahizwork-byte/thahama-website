"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

gsap.registerPlugin(ScrollTrigger);

// Gallery images with layout configuration
interface GalleryItem {
  id: number;
  src: string;
  alt: string;
  isMain?: boolean; // Main hero image
  colSpan?: number; // Columns to span
  rowSpan?: number; // Rows to span
  aspectRatio?: "square" | "wide" | "tall"; // Aspect ratio type
}

const galleryItems: GalleryItem[] = [
  {
    id: 1,
    src: "/images/ChatGPT Image Nov 29, 2025, 04_01_26 PM.png",
    alt: "Store Interior",
    isMain: true,
    colSpan: 2,
    rowSpan: 2,
    aspectRatio: "square",
  },
  {
    id: 2,
    src: "/images/Family Shopping for Fresh Produce.png",
    alt: "Fresh Produce",
    aspectRatio: "wide",
  },
  {
    id: 3,
    src: "/images/ChatGPT Image Nov 29, 2025, 03_37_33 PM.png",
    alt: "Fresh Bakery Items",
    aspectRatio: "tall",
  },
  {
    id: 4,
    src: "/images/Untitled design (1).png",
    alt: "Shopping Aisle",
    colSpan: 2,
    aspectRatio: "wide",
  },
  {
    id: 5,
    src: "/images/ChatGPT Image Nov 29, 2025, 03_52_44 PM.png",
    alt: "Store Entrance",
    aspectRatio: "tall",
  },
  {
    id: 6,
    src: "/images/about_image.png",
    alt: "Checkout Area",
    aspectRatio: "square",
  },
];

export default function Gallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const animationRef = useRef<gsap.core.Tween | null>(null);
  const resumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate masonry row spans based on image heights
  useEffect(() => {
    const calculateMasonryLayout = () => {
      if (!gridRef.current || window.innerWidth < 1024) return;

      const rowHeight = 8; // Base row height in pixels (matches CSS)
      const gap = 16; // Gap in pixels (gap-4 = 16px)
      const items = itemRefs.current.filter(Boolean) as HTMLDivElement[];

      items.forEach((item) => {
        const img = item.querySelector("img");
        if (img && img.complete) {
          const itemHeight = item.offsetHeight;
          const rowSpan = Math.ceil((itemHeight + gap) / (rowHeight + gap));
          item.style.gridRowEnd = `span ${Math.max(rowSpan, 1)}`;
        }
      });
    };

    // Wait for images to load, then calculate layout
    const images = gridRef.current?.querySelectorAll("img") || [];
    let loadedCount = 0;
    const totalImages = images.length;

    const handleImageLoad = () => {
      loadedCount++;
      if (loadedCount === totalImages) {
        setTimeout(calculateMasonryLayout, 100);
      }
    };

    images.forEach((img) => {
      if (img.complete) {
        handleImageLoad();
      } else {
        img.addEventListener("load", handleImageLoad, { once: true });
      }
    });

    // Recalculate on resize
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setTimeout(calculateMasonryLayout, 100);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      images.forEach((img) => {
        img.removeEventListener("load", handleImageLoad);
      });
    };
  }, []);

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

      // Gallery items animation - fade in and slide up with stagger
      if (gridRef.current) {
        const items = gridRef.current.querySelectorAll(".gallery-item");

        gsap.fromTo(
          items,
          {
            opacity: 0,
            y: 40,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: gridRef.current,
              start: "top 75%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      // Mobile carousel auto-scroll animation (only on mobile)
      let carouselCleanup: (() => void) | null = null;

      const initCarousel = () => {
        if (!carouselRef.current || typeof window === "undefined" || window.innerWidth >= 768) {
          return null;
        }

        const carousel = carouselRef.current;
        const cards = carousel.querySelectorAll(".gallery-carousel-item");
        if (cards.length === 0) return null;

        // Clear any existing animation
        if (animationRef.current) {
          animationRef.current.kill();
        }

        const cardWidth = cards[0]?.clientWidth || 0;
        const gap = 32; // gap-8 = 32px (2rem) - matching testimonials
        const totalWidth = (cardWidth + gap) * galleryItems.length;

        // Reset position and remove duplicates if they exist
        gsap.set(carousel, { x: 0 });
        const existingItems = carousel.querySelectorAll(".gallery-carousel-item");
        if (existingItems.length > galleryItems.length) {
          // Remove duplicates
          Array.from(existingItems).slice(galleryItems.length).forEach((el) => el.remove());
        }

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
          if (resumeTimeoutRef.current) {
            clearTimeout(resumeTimeoutRef.current);
          }
        };

        // Function to resume animation after delay
        const resumeAnimation = (delay: number = 3000) => {
          if (resumeTimeoutRef.current) {
            clearTimeout(resumeTimeoutRef.current);
          }
          resumeTimeoutRef.current = setTimeout(() => {
            carouselAnimation.timeScale(1);
          }, delay);
        };

        // Pause on hover (for tablets that might have hover)
        carousel.addEventListener("mouseenter", pauseAnimation);
        const handleMouseLeave = () => {
          carouselAnimation.timeScale(1);
        };
        carousel.addEventListener("mouseleave", handleMouseLeave);

        // Pause on card click/touch and resume after 3 seconds
        const handleCardInteraction = () => {
          pauseAnimation();
          resumeAnimation(3000);
        };

        const allCards = carousel.querySelectorAll(".gallery-carousel-item");
        allCards.forEach((card) => {
          card.addEventListener("click", handleCardInteraction);
          card.addEventListener("touchstart", handleCardInteraction, { passive: true });
        });

        // Return cleanup function
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
      };

      // Initialize carousel with a small delay to ensure DOM is ready
      const timeoutId = setTimeout(() => {
        carouselCleanup = initCarousel();
      }, 100);

      // Handle window resize
      const handleResize = () => {
        if (animationRef.current) {
          animationRef.current.kill();
          animationRef.current = null;
        }
        if (carouselCleanup) {
          carouselCleanup();
          carouselCleanup = null;
        }
        if (resumeTimeoutRef.current) {
          clearTimeout(resumeTimeoutRef.current);
        }
        // Reinitialize if on mobile
        setTimeout(() => {
          carouselCleanup = initCarousel();
        }, 100);
      };

      if (typeof window !== "undefined") {
        window.addEventListener("resize", handleResize);
      }

      // Parallax zoom effect for all gallery images (desktop only)
      const handleGalleryScroll = () => {
        if (typeof window !== "undefined" && window.innerWidth < 768) return; // Skip on mobile

        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;

        imageRefs.current.forEach((imageWrapper, index) => {
          if (!imageWrapper) return;

          const item = itemRefs.current[index];
          if (!item) return;

          const itemRect = item.getBoundingClientRect();
          const itemTop = itemRect.top + scrollY;
          const itemHeight = itemRect.height;

          // Calculate when item enters viewport
          const itemCenter = itemTop + itemHeight / 2;
          const viewportCenter = scrollY + windowHeight / 2;

          // Calculate distance from viewport center
          const distanceFromCenter = Math.abs(viewportCenter - itemCenter);
          const maxDistance = windowHeight;

          // Calculate scale based on proximity to viewport center
          // Closer to center = more zoomed in (1.15), further = less zoomed (1.0)
          const proximityRatio = Math.max(0, 1 - distanceFromCenter / maxDistance);
          const scale = 1.0 + proximityRatio * 0.15; // Scale between 1.0 and 1.15

          // Clamp scale
          const clampedScale = Math.max(1.0, Math.min(1.15, scale));

          gsap.to(imageWrapper, {
            scale: clampedScale,
            duration: 0.3,
            ease: "power1.out",
          });
        });
      };

      // Throttled scroll handler for gallery parallax (desktop only)
      let galleryTicking = false;
      const galleryScrollHandler = () => {
        if (!galleryTicking && typeof window !== "undefined" && window.innerWidth >= 768) {
          window.requestAnimationFrame(() => {
            handleGalleryScroll();
            galleryTicking = false;
          });
          galleryTicking = true;
        }
      };

      if (typeof window !== "undefined" && window.innerWidth >= 768) {
        window.addEventListener("scroll", galleryScrollHandler, { passive: true });
        handleGalleryScroll();
      }

      return () => {
        clearTimeout(timeoutId);
        if (typeof window !== "undefined") {
          window.removeEventListener("scroll", galleryScrollHandler);
          window.removeEventListener("resize", handleResize);
        }
        if (animationRef.current) {
          animationRef.current.kill();
        }
        if (carouselCleanup) {
          carouselCleanup();
        }
        if (resumeTimeoutRef.current) {
          clearTimeout(resumeTimeoutRef.current);
        }
      };
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  // Generate slides for lightbox
  const slides = galleryItems.map((item) => ({
    src: item.src,
    alt: item.alt,
  }));

  // Get aspect ratio class - only use on mobile, desktop uses natural heights for masonry
  const getAspectClass = (item: GalleryItem) => {
    // Only apply aspect ratios on mobile for consistency
    if (item.aspectRatio === "wide") {
      return "aspect-[16/10] md:aspect-auto";
    } else if (item.aspectRatio === "tall") {
      return "aspect-[3/4] md:aspect-auto";
    }
    return "aspect-square md:aspect-auto";
  };

  return (
    <section
      id="gallery"
      ref={sectionRef}
      className="py-20 md:py-32 bg-dark relative overflow-hidden z-10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <h2
          ref={titleRef}
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-center text-white mb-6"
        >
          Our <span className="text-accent">Gallery</span>
        </h2>

        <p className="text-center text-gray-300 text-lg mb-16 max-w-2xl mx-auto">
          Take a look inside our stores and discover the quality we offer
        </p>

        {/* Mobile: Horizontal Scrolling Carousel */}
        <div className="md:hidden relative overflow-hidden -mx-4 sm:-mx-6">
          <div
            ref={carouselRef}
            className="flex gap-8 will-change-transform px-4 sm:px-6"
          >
            {galleryItems.map((item, index) => (
              <div
                key={`mobile-${item.id}`}
                className="gallery-carousel-item shrink-0 w-64 group relative overflow-hidden rounded-lg cursor-pointer transition-all duration-300"
                onClick={() => openLightbox(index)}
              >
                <div className="aspect-square relative">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105 rounded-lg"
                    sizes="256px"
                  />
                  {/* Subtle overlay on hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 pointer-events-none rounded-lg" />
                  {/* Hover indicator */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <span className="text-xl">🔍</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop: Masonry Collage Grid - Pinterest/Dribbble style with auto-fill */}
        <div
          ref={gridRef}
          className="hidden md:grid gallery-grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          {galleryItems.map((item, index) => (
            <div
              key={item.id}
              ref={(el) => {
                itemRefs.current[index] = el;
              }}
              className={`gallery-item ${getAspectClass(item)} group relative overflow-hidden rounded-lg cursor-pointer transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-2xl hover:shadow-accent/30`}
              onClick={() => openLightbox(index)}
              data-col-span={item.colSpan || 1}
              data-row-span={item.rowSpan || 1}
              data-item-index={index}
            >
              <div
                ref={(el) => {
                  imageRefs.current[index] = el;
                }}
                className="absolute inset-0 w-full h-full"
                style={{
                  willChange: "transform",
                  transformOrigin: "center center",
                }}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  width={800}
                  height={1200}
                  className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  style={{
                    height: "auto",
                    display: "block",
                    maxWidth: "100%"
                  }}
                  onLoad={(e) => {
                    // Trigger layout recalculation after image loads
                    setTimeout(() => {
                      if (window.innerWidth >= 1024) {
                        const rowHeight = 8;
                        const gap = 16;
                        const item = itemRefs.current[index];
                        if (item) {
                          const img = e.currentTarget;
                          if (img && img.complete) {
                            const itemHeight = item.offsetHeight;
                            const rowSpan = Math.ceil((itemHeight + gap) / (rowHeight + gap));
                            item.style.gridRowEnd = `span ${Math.max(rowSpan, 1)}`;
                          }
                        }
                      }
                    }, 100);
                  }}
                />

                {/* Subtle overlay on hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 pointer-events-none rounded-lg" />

                {/* Hover indicator */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <span className="text-2xl">🔍</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Masonry-style CSS for tight packing with no gaps - Pinterest/Dribbble style */}
        <style dangerouslySetInnerHTML={{
          __html: `
            .gallery-grid {
              grid-auto-flow: dense;
              align-items: start;
            }

            .gallery-item {
              display: block;
              break-inside: avoid;
            }

            .gallery-item > div {
              width: 100%;
              height: 100%;
            }

            /* Mobile: All items span 1 column with fixed aspect ratios */
            @media (max-width: 767px) {
              .gallery-item {
                grid-column: span 1 !important;
                grid-row: span 1 !important;
              }

              .gallery-item img {
                width: 100%;
                height: 100%;
                object-fit: cover;
              }
            }
            
            /* Tablet: Masonry layout with spans */
            @media (min-width: 768px) and (max-width: 1023px) {
              .gallery-grid {
                grid-auto-rows: 10px;
              }

              .gallery-item[data-col-span="2"] {
                grid-column: span 2;
              }

              .gallery-item img {
                width: 100%;
                height: auto;
                display: block;
              }
            }
            
            /* Desktop: Tight masonry layout with auto-fill - no gaps */
            @media (min-width: 1024px) {
              .gallery-grid {
                grid-auto-rows: 8px;
                grid-auto-flow: row dense;
              }

              .gallery-item[data-col-span="2"] {
                grid-column: span 2;
              }

              .gallery-item img {
                width: 100%;
                height: auto;
                display: block;
              }

              .gallery-item > div {
                position: relative;
                width: 100%;
              }

              /* Ensure tight packing */
              .gallery-item {
                margin: 0;
                padding: 0;
                min-height: 0;
              }
            }
          `
        }} />
      </div>

      {/* Lightbox */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        slides={slides}
        index={currentIndex}
      />
    </section>
  );
}

