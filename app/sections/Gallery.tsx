"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import Image from "next/image";
import dynamic from "next/dynamic";
import { getBlurPlaceholder, getImageSizes } from "@/app/lib/image-utils";
import { useLanguage } from "@/app/i18n/LanguageContext";
import { siteContent } from "@/app/data/siteContent";
import SectionWrapper from "@/app/components/ui/SectionWrapper";
import { useDevice } from "@/app/hooks/useDevice";
import { createGSAPContext, createStaggerAnimation } from "@/app/lib/gsap-utils";

// Lazy load lightbox - only load when user opens it
const Lightbox = dynamic(
  () => import("yet-another-react-lightbox").then((mod) => mod.default),
  {
    ssr: false, // Don't render on server
    loading: () => null, // No loading state needed
  }
);

// Lazy load lightbox styles
if (typeof window !== "undefined") {
  import("yet-another-react-lightbox/styles.css");
}

// Gallery images with layout configuration
interface GalleryItem {
  id: string; // Changed to string for translation keys
  src: string;
  colSpan?: number; // Columns to span
  rowSpan?: number; // Rows to span
  aspectRatio?: "square" | "wide" | "tall"; // Aspect ratio type
}

const galleryItems: GalleryItem[] = siteContent.gallery.map((url, index) => ({
  id: `img-${index}`,
  src: url,
  // Assign dummy layouts or default
  colSpan: index % 4 === 0 ? 2 : 1,
  rowSpan: index % 4 === 0 ? 2 : 1,
  aspectRatio: "square"
}));

export default function Gallery() {
  const { t } = useLanguage();
  const { isMobile, isTablet } = useDevice();
  const gridRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const animationRef = useRef<gsap.core.Tween | null>(null);

  // Calculate masonry row spans based on image heights
  useEffect(() => {
    const calculateMasonryLayout = () => {
      if (!gridRef.current || isMobile) return;

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

    // Recalculate on resize
    const handleResize = () => {
      if (!isMobile) {
        setTimeout(calculateMasonryLayout, 100);
      }
    };

    window.addEventListener("resize", handleResize);
    
    // Initial calculation if not mobile
    if (!isMobile) {
      setTimeout(calculateMasonryLayout, 100);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isMobile]);

  useEffect(() => {
    const cleanup = createGSAPContext(() => {
      // Grid items animation (Desktop/Tablet)
      if (gridRef.current && !isMobile) {
        const items = gridRef.current.querySelectorAll(".gallery-item");
        createStaggerAnimation(items as NodeListOf<HTMLElement>, {
          trigger: gridRef.current,
          y: 50,
          stagger: 0.1,
          duration: 0.8,
        });
      }

      // Mobile carousel auto-scroll animation
      if (isMobile && carouselRef.current) {
        const carousel = carouselRef.current;
        const cards = carousel.querySelectorAll(".gallery-carousel-item");
        
        if (cards.length > 0) {
          const cardWidth = cards[0]?.clientWidth || 0;
          const gap = 32; // gap-8 = 32px (2rem)
          const totalWidth = (cardWidth + gap) * galleryItems.length;

          // Reset position
          gsap.set(carousel, { x: 0 });

          // Ensure cloning happens only once
          if (carousel.children.length === galleryItems.length) {
             carousel.innerHTML += carousel.innerHTML;
          }

          // Infinite scroll animation
          animationRef.current = gsap.to(carousel, {
            x: -(totalWidth),
            duration: 40,
            ease: "none",
            repeat: -1,
            modifiers: {
              x: gsap.utils.unitize((x) => parseFloat(x) % totalWidth),
            },
          });
        }
      }
    }, gridRef.current); // Scope to gridRef, though used for both

    return cleanup;
  }, [isMobile]);

  // Parallax zoom effect for gallery images (desktop only)
  useEffect(() => {
    if (isMobile) return;

    const handleGalleryScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;

      imageRefs.current.forEach((imageWrapper, index) => {
        if (!imageWrapper) return;
        const item = itemRefs.current[index];
        if (!item) return;

        const itemRect = item.getBoundingClientRect();
        const itemTop = itemRect.top + scrollY;
        const itemHeight = itemRect.height;
        const itemCenter = itemTop + itemHeight / 2;
        const viewportCenter = scrollY + windowHeight / 2;
        const distanceFromCenter = Math.abs(viewportCenter - itemCenter);
        const maxDistance = windowHeight;
        
        // Optimize: simplified math for proximity
        const proximityRatio = Math.max(0, 1 - distanceFromCenter / maxDistance);
        const scale = 1.0 + proximityRatio * 0.15;
        const clampedScale = Math.max(1.0, Math.min(1.15, scale));

        // Performance optimization: only animate if visible
        const isInViewport = itemRect.top < windowHeight && itemRect.bottom > 0;
        
        if (isInViewport) {
           // Direct DOM manipulation for performance in high-frequency scroll
           // Or use lightweight GSAP set if preferred, but direct style is fastest
           imageWrapper.style.transform = `scale(${clampedScale})`;
        }
      });
    };

    let ticking = false;
    const scrollHandler = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleGalleryScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", scrollHandler, { passive: true });
    return () => window.removeEventListener("scroll", scrollHandler);
  }, [isMobile]);


  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  const slides = galleryItems.map((item) => ({
    src: item.src,
    alt: t("gallery.title"),
  }));

  const getAspectClass = (item: GalleryItem) => {
    if (item.aspectRatio === "wide") return "aspect-[16/10] md:aspect-auto";
    if (item.aspectRatio === "tall") return "aspect-[3/4] md:aspect-auto";
    return "aspect-square md:aspect-auto";
  };

  return (
    <SectionWrapper
      id="gallery"
      className="bg-dark z-10"
      aria-label={t("gallery.title")}
    >
      <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center text-white mb-4 md:mb-6">
        {t("gallery.title")} <span className="text-accent">{t("gallery.titleHighlight")}</span>
      </h2>

      <p className="text-center text-gray-300 text-lg mb-8 md:mb-16 max-w-2xl mx-auto">
        {t("gallery.subtitle")}
      </p>

      {/* Mobile: Horizontal Scrolling Carousel */}
      {isMobile && (
        <div className="relative overflow-hidden -mx-4 sm:-mx-6">
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
                    alt={t("gallery.title")}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105 rounded-lg"
                    sizes="256px"
                    loading="lazy"
                    placeholder="blur"
                    blurDataURL={getBlurPlaceholder(item.src)}
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
      )}

      {/* Desktop: Masonry Collage Grid */}
      {!isMobile && (
        <div
          ref={gridRef}
          className="grid gallery-grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          {galleryItems.map((item, index) => (
            <div
              key={item.id}
              ref={(el) => {
                itemRefs.current[index] = el;
              }}
              className={`gallery-item ${getAspectClass(item)} group relative overflow-hidden rounded-lg cursor-pointer transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-2xl hover:shadow-accent/30 opacity-0`} // Start hidden
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
                  transformOrigin: "center center",
                }}
              >
                <Image
                  src={item.src}
                  alt={t("gallery.title")}
                  width={800}
                  height={1200}
                  className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes={getImageSizes({ mobile: "50vw", tablet: "33vw", desktop: "25vw" })}
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL={getBlurPlaceholder(item.src)}
                  style={{
                    height: "auto",
                    display: "block",
                    maxWidth: "100%"
                  }}
                  onLoad={(e) => {
                    // Trigger layout recalculation after image loads
                    setTimeout(() => {
                      if (!isMobile) {
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
      )}

      {/* Masonry-style CSS */}
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
          
          /* Desktop: Tight masonry layout */
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

            .gallery-item {
              margin: 0;
              padding: 0;
              min-height: 0;
            }
          }
        `
      }} />

      {/* Lightbox - lazy loaded */}
      {lightboxOpen && (
        <Lightbox
          open={lightboxOpen}
          close={() => setLightboxOpen(false)}
          slides={slides}
          index={currentIndex}
        />
      )}
    </SectionWrapper>
  );
}
