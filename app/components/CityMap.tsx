"use client";

import { useState, useEffect, useMemo, useCallback, memo, useRef } from "react";
import dynamic from "next/dynamic";
import type { Map } from "leaflet";

// Define the location type
export interface Location {
  city: string;
  lat: number;
  lng: number;
}

// Icon SVG data as constants (base64 encoded)
const ACTIVE_ICON_URL =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjUiIGhlaWdodD0iNDEiIHZpZXdCb3g9IjAgMCAyNSA0MSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyLjUgMEM1LjU5IDAgMCA1LjU5IDAgMTIuNUMwIDIxLjY5IDEyLjUgNDEgMTIuNSA0MUMxMi41IDQxIDI1IDIxLjY5IDI1IDEyLjVDMjUgNS41OSAxOS40MSAwIDEyLjUgMFoiIGZpbGw9IiNGRjZCMzUiLz4KPHBhdGggZD0iTTEyLjUgMThDMTUuNTM3MyAxOCAxOCAxNS41MzczIDE4IDEyLjVDMTggOS40NjI3IDE1LjUzNzMgNyAxMi41IDdDOS40NjI3IDcgNyA5LjQ2MjcgNyAxMi41QzcgMTUuNTM3MyA5LjQ2MjcgMTggMTIuNSAxOFoiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo=";

const DEFAULT_ICON_URL =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjUiIGhlaWdodD0iNDEiIHZpZXdCb3g9IjAgMCAyNSA0MSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyLjUgMEM1LjU5IDAgMCA1LjU5IDAgMTIuNUMwIDIxLjY5IDEyLjUgNDEgMTIuNSA0MUMxMi41IDQxIDI1IDIxLjY5IDI1IDEyLjVDMjUgNS41OSAxOS40MSAwIDEyLjUgMFoiIGZpbGw9IiMwRjE3MkEiLz4KPHBhdGggZD0iTTEyLjUgMThDMTUuNTM3MyAxOCAxOCAxNS41MzczIDE4IDEyLjVDMTggOS40NjI3IDE1LjUzNzMgNyAxMi41IDdDOS40NjI3IDcgNyA5LjQ2MjcgNyAxMi41QzcgMTUuNTM3MyA5LjQ2MjcgMTggMTIuNSAxOFoiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo=";

// Debounce utility function
function useDebounce<T extends (...args: any[]) => void>(
  callback: T,
  delay: number
): T {
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const debouncedCallback = useCallback(
    ((...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    }) as T,
    [callback, delay]
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedCallback;
}

// Memoized CityButtons component
const CityButtons = memo(function CityButtons({
  locations,
  activeCity,
  onCityClick,
}: {
  locations: Location[];
  activeCity: string | null;
  onCityClick: (location: Location) => void;
}) {
  return (
    <div className="mb-4 overflow-x-auto pb-2">
      <div className="flex gap-3 min-w-max px-1">
        {locations.map((location) => (
          <button
            key={location.city}
            onClick={() => onCityClick(location)}
            className={`
              px-6 py-3 rounded-lg font-semibold text-sm md:text-base
              transition-all duration-300 transform hover:scale-105
              whitespace-nowrap
              ${
                activeCity === location.city
                  ? "bg-accent text-primary shadow-lg"
                  : "bg-white text-primary hover:bg-accent/10 shadow-md hover:shadow-lg"
              }
            `}
          >
            {location.city}
          </button>
        ))}
      </div>
    </div>
  );
});

CityButtons.displayName = "CityButtons";

// Map content component - must be inside MapContainer to use useMap hook
// Uses proper type-safe imports (require is necessary for client-side only dynamic loading)
function MapContent({
  locations,
  mapCenter,
  mapZoom,
  activeMarker,
  onMarkerClick,
  iconCache,
}: {
  locations: Location[];
  mapCenter: [number, number];
  mapZoom: number;
  activeMarker: string | null;
  onMarkerClick: (location: Location) => void;
  iconCache: { active: any; default: any };
}) {
  // Type-safe require for react-leaflet (client-side only, loaded dynamically)
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { useMap, TileLayer, Marker, Popup } = require("react-leaflet") as {
    useMap: () => Map;
    TileLayer: React.ComponentType<any>;
    Marker: React.ComponentType<any>;
    Popup: React.ComponentType<any>;
  };

  const map = useMap();
  const animationRef = useRef<boolean>(false);

  // Debounced map view update to prevent animation queueing
  const debouncedFlyTo = useDebounce(
    (center: [number, number], zoom: number) => {
      if (map && !animationRef.current) {
        animationRef.current = true;
        try {
          if (map.flyTo) {
            map.flyTo(center, zoom, {
              duration: 3,
              easeLinearity: 0.5,
            });
          } else {
            map.setView(center, zoom, { animate: true, duration: 3 });
          }
        } catch (e) {
          console.error("Map animation error:", e);
          map.setView(center, zoom, { animate: true, duration: 3 });
        } finally {
          // Reset animation flag after animation completes
          setTimeout(() => {
            animationRef.current = false;
          }, 3100); // Slightly longer than animation duration
        }
      }
    },
    150
  );

  // Update map view when center/zoom changes with debouncing
  useEffect(() => {
    if (map && mapCenter && mapZoom) {
      debouncedFlyTo(mapCenter, mapZoom);
    }

    // Cleanup: cancel any pending animations on unmount or dependency change
    return () => {
      if (animationRef.current && map) {
        try {
          map.stop(); // Stop any ongoing animations
        } catch (e) {
          // Ignore errors when stopping
        }
      }
    };
  }, [map, mapCenter, mapZoom, debouncedFlyTo]);

  // Memoized marker click handlers
  const markerClickHandlers = useMemo(() => {
    return locations.reduce((acc, location) => {
      acc[location.city] = () => onMarkerClick(location);
      return acc;
    }, {} as Record<string, () => void>);
  }, [locations, onMarkerClick]);

  return (
    <>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        maxZoom={19}
        minZoom={1}
        keepBuffer={3}
        updateWhenZooming={true}
        updateWhenIdle={false}
        updateInterval={200}
      />

      {locations.map((location) => (
        <Marker
          key={location.city}
          position={[location.lat, location.lng]}
          icon={
            activeMarker === location.city ? iconCache.active : iconCache.default
          }
          eventHandlers={{
            click: markerClickHandlers[location.city],
          }}
        >
          <Popup>
            <div className="text-center">
              <h3 className="font-bold text-primary">{location.city}</h3>
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
}

// Inner map component that uses react-leaflet
function LeafletMap({
  locations,
  mapCenter,
  mapZoom,
  activeMarker,
  onMarkerClick,
  iconCache,
}: {
  locations: Location[];
  mapCenter: [number, number];
  mapZoom: number;
  activeMarker: string | null;
  onMarkerClick: (location: Location) => void;
  iconCache: { active: any; default: any };
}) {
  // Type-safe require for MapContainer (client-side only, loaded dynamically)
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { MapContainer } = require("react-leaflet") as {
    MapContainer: React.ComponentType<any>;
  };

  return (
    <MapContainer
      center={mapCenter}
      zoom={mapZoom}
      style={{ height: "100%", width: "100%", zIndex: 1 }}
      zoomControl={true}
      scrollWheelZoom={true}
    >
      <MapContent
        locations={locations}
        mapCenter={mapCenter}
        mapZoom={mapZoom}
        activeMarker={activeMarker}
        onMarkerClick={onMarkerClick}
        iconCache={iconCache}
      />
    </MapContainer>
  );
}

// Dynamically import the map component with SSR disabled
const DynamicLeafletMap = dynamic(() => Promise.resolve(LeafletMap), {
  ssr: false,
  loading: () => (
    <div className="bg-white rounded-2xl shadow-lg h-[600px] flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-accent mb-4"></div>
        <p className="text-gray-600">Loading map...</p>
      </div>
    </div>
  ),
});

// Main CityMap component
interface CityMapProps {
  locations: Location[];
  defaultCenter?: [number, number];
  defaultZoom?: number;
}

export default function CityMap({
  locations,
  defaultCenter,
  defaultZoom = 12,
}: CityMapProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [selectedCity, setSelectedCity] = useState<string | null>(
    locations[0]?.city || null
  );
  const [mapCenter, setMapCenter] = useState<[number, number]>(
    defaultCenter || [locations[0]?.lat || 21.4858, locations[0]?.lng || 39.1925]
  );
  const [mapZoom, setMapZoom] = useState<number>(defaultZoom);
  const [activeMarker, setActiveMarker] = useState<string | null>(null);

  // Memoize icon creation - icons are created once and cached
  const iconCache = useMemo(() => {
    // Only create icons on client side after mounting
    if (typeof window === "undefined") {
      return { active: null, default: null };
    }

    // Type-safe require for Leaflet Icon (client-side only)
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { Icon } = require("leaflet") as {
      Icon: new (options: {
        iconUrl: string;
        iconSize: [number, number];
        iconAnchor: [number, number];
        popupAnchor: [number, number];
      }) => any;
    };

    return {
      active: new Icon({
        iconUrl: ACTIVE_ICON_URL,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [0, -41],
      }),
      default: new Icon({
        iconUrl: DEFAULT_ICON_URL,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [0, -41],
      }),
    };
  }, []); // Empty deps - icons never change

  // Handle client-side mounting
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Memoize calculated center to avoid recalculation
  const calculatedCenter = useMemo(() => {
    if (defaultCenter || locations.length === 0) {
      return null;
    }

    const avgLat =
      locations.reduce((sum, loc) => sum + loc.lat, 0) / locations.length;
    const avgLng =
      locations.reduce((sum, loc) => sum + loc.lng, 0) / locations.length;
    return [avgLat, avgLng] as [number, number];
  }, [locations, defaultCenter]);

  // Calculate default center and zoom if not provided
  useEffect(() => {
    if (calculatedCenter) {
      setMapCenter(calculatedCenter);
      // If multiple locations, use a zoom level that shows all
      if (locations.length > 1) {
        setMapZoom(10);
      }
    }
  }, [calculatedCenter, locations.length]);

  // Memoized event handlers to prevent child re-renders
  const handleCityClick = useCallback((location: Location) => {
    setSelectedCity(location.city);
    setMapCenter([location.lat, location.lng]);
    setMapZoom(12);
    setActiveMarker(null);
  }, []);

  const handleMarkerClick = useCallback((location: Location) => {
    setSelectedCity(location.city);
    setMapCenter([location.lat, location.lng]);
    setMapZoom(15);
    setActiveMarker(location.city);
  }, []);

  // Early return for empty locations
  if (!locations || locations.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg h-[600px] flex items-center justify-center">
        <p className="text-gray-600">No locations provided</p>
      </div>
    );
  }

  // Early return if icons not ready
  if (isMounted && (!iconCache.active || !iconCache.default)) {
    return (
      <div className="bg-white rounded-2xl shadow-lg h-[600px] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-accent mb-4"></div>
          <p className="text-gray-600">Initializing map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-[600px] relative">
      {/* City Buttons */}
      <div className="absolute top-4 left-4 right-4 z-1000 bg-white/95 backdrop-blur-sm p-3 rounded-lg shadow-md">
        <CityButtons
          locations={locations}
          activeCity={selectedCity}
          onCityClick={handleCityClick}
        />
      </div>

      {/* Map Container */}
      {isMounted && iconCache.active && iconCache.default && (
        <DynamicLeafletMap
          locations={locations}
          mapCenter={mapCenter}
          mapZoom={mapZoom}
          activeMarker={activeMarker}
          onMarkerClick={handleMarkerClick}
          iconCache={iconCache}
        />
      )}
    </div>
  );
}
