# Device Detection & Optimization System

## Overview
The Thahama codebase now uses a centralized Device Intelligence System to handle responsive behavior and conditional logic. This replaces scattered `window.innerWidth` checks with a performant, context-based approach.

## Key Components

### 1. `DeviceContext` (Source of Truth)
- Located at: `app/context/DeviceContext.tsx`
- Wraps the entire application in `app/layout.tsx`.
- Provides the following state safely (SSR-compatible):
  - `isMobile` (< 768px)
  - `isTablet` (768px - 1024px)
  - `isDesktop` (> 1024px)
  - `isTouch` (Touch capability detection)
  - `orientation` ('portrait' | 'landscape')

### 2. `useDevice` Hook
- Located at: `app/hooks/useDevice.ts`
- The primary way to consume device state in components.
- **Usage:**
  ```typescript
  import { useDevice } from "@/app/hooks/useDevice";
  
  const MyComponent = () => {
    const { isMobile, isDesktop } = useDevice();
    
    if (isMobile) return <MobileView />;
    return <DesktopView />;
  }
  ```

### 3. `SectionWrapper`
- Located at: `app/components/ui/SectionWrapper.tsx`
- A unified wrapper for all page sections.
- **Features:**
  - Standardizes padding and layout.
  - Handles automatic entrance animations (fade-in).
  - Integrates with `DeviceContext` for optimization.
- **Usage:**
  ```typescript
  import SectionWrapper from "@/app/components/ui/SectionWrapper";
  
  export default function MySection() {
    return (
      <SectionWrapper id="my-section">
        <h2>Content</h2>
      </SectionWrapper>
    );
  }
  ```

### 4. Animation Best Practices (Updated)
- **Hero Section**: The Hero section now uses `useDevice` to intelligently disable the heavy parallax effect on mobile devices.
  - Desktop: Full 1.25x -> 1.0x parallax zoom.
  - Mobile: Static 1.1x zoom (improves scroll FPS significantly).
- **Image Loading**: Quality is dynamically adjusted (75% on mobile, 90% on desktop) to reduce LCP (Largest Contentful Paint).

## Best Practices
1. **Always use `useDevice`** instead of checking `window.innerWidth` manually.
2. **Wrap new sections** in `<SectionWrapper>` to ensure consistent spacing and animations.
3. **Avoid heavy animations on mobile** by checking `isMobile` before initializing complex GSAP timelines.
