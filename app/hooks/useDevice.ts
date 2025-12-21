"use client";

import { useDeviceContext } from "../context/DeviceContext";

/**
 * Hook to access device state globally.
 * Use this instead of window.innerWidth checks.
 * 
 * @returns {DeviceState} - { isMobile, isTablet, isDesktop, isTouch, orientation }
 */
export const useDevice = () => {
  return useDeviceContext();
};

