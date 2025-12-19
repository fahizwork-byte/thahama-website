"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import dynamic from "next/dynamic";
import { gsap } from "gsap";
import { FiSearch, FiMapPin, FiNavigation, FiPhone, FiClock, FiX, FiFilter } from "react-icons/fi";
import { useLanguage } from "../i18n/LanguageContext";

import { siteContent } from "@/app/data/siteContent";

// --- Types ---
export interface StoreLocation {
    id: string;
    name: string;
    city: string;
    address: string;
    phone: string;
    hours: string;
    status: "open" | "closed" | "coming_soon";
    lat: number;
    lng: number;
}

// --- Coordinates Helper ---
// Approximate coordinates for cities/areas mentioned in the data
const COORDINATES_MAP: Record<string, { lat: number; lng: number }> = {
    "Jeddah": { lat: 21.4858, lng: 39.1925 },
    "Wadi Qudaid": { lat: 22.3333, lng: 39.5833 }, // Approximate
    "Khulais": { lat: 22.1469, lng: 39.2981 },
    "Wadi Stharah": { lat: 22.5, lng: 39.7 }, // Approximate
    "Duba, Tabuk": { lat: 27.3516, lng: 35.6963 },
    "Al Qaseem": { lat: 26.3475, lng: 43.9735 }, // Buraydah/Qassim
    "Al Jumoom, Makkah": { lat: 21.6167, lng: 39.7 },
    "Al Sharaya, Makkah": { lat: 21.4333, lng: 39.95 },
    "Asfan Road": { lat: 21.8, lng: 39.3 }, // Approximate
    "Asfan": { lat: 21.9167, lng: 39.3333 },
    "Abyar": { lat: 22.0, lng: 39.4 }, // Approximate
    "Riyadh": { lat: 24.7136, lng: 46.6753 },
    "Dammam": { lat: 26.4207, lng: 50.0888 },
    "Dubai": { lat: 25.2048, lng: 55.2708 },
    "Abu Dhabi": { lat: 24.4539, lng: 54.3773 },
};

// --- Mock Data ---
const generateStores = (): StoreLocation[] => {
    return siteContent.branches.map((branch, index) => {
        // Try to find a matching location for coordinates
        let coords = { lat: 21.4858, lng: 39.1925 }; // Default to Jeddah

        // Simple string matching for coordinates
        for (const [key, val] of Object.entries(COORDINATES_MAP)) {
            if (branch.address.includes(key) || branch.nameEn.includes(key) || branch.nameAr.includes(key)) {
                coords = val;
                break;
            }
        }

        // Add small random offset so markers don't perfectly overlap if they have same base location
        const latOffset = (Math.random() - 0.5) * 0.01;
        const lngOffset = (Math.random() - 0.5) * 0.01;

        return {
            id: `store-${index + 1}`,
            name: branch.nameEn,
            city: branch.address.split(',')[0] || "Unknown", // Approximate city from address
            address: branch.address,
            phone: branch.phone,
            hours: branch.hours,
            status: branch.status === "open" ? "open" : "coming_soon",
            lat: coords.lat + latOffset,
            lng: coords.lng + lngOffset,
        };
    });
};

const STORES_DATA = generateStores();
// Derive unique cities from the data for the filter
const CITIES = ["All", ...Array.from(new Set(STORES_DATA.map(s => s.city)))].sort();

// --- Map Component (Client Side Only) ---
// We define this inside to avoid SSR issues with Leaflet
const MapContent = ({
    stores,
    selectedStoreId,
    onMarkerClick
}: {
    stores: StoreLocation[],
    selectedStoreId: string | null,
    onMarkerClick: (store: StoreLocation) => void
}) => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { useMap, TileLayer, Marker, Popup } = require("react-leaflet");
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const L = require("leaflet");

    const map = useMap();
    const markerRefs = useRef<Record<string, any>>({});

    // Custom Icons
    const createIcon = (isActive: boolean) => {
        return new L.DivIcon({
            className: "custom-marker",
            html: `<div class="w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center transition-all duration-300 ${isActive ? "bg-accent scale-125 z-20" : "bg-primary scale-100 opacity-90 hover:scale-110"
                }">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="16" height="16">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
      </div>`,
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -34],
        });
    };

    // Fly to selected store
    useEffect(() => {
        if (selectedStoreId) {
            const store = stores.find(s => s.id === selectedStoreId);
            if (store) {
                map.flyTo([store.lat, store.lng], 15, {
                    duration: 1.5,
                    easeLinearity: 0.25
                });
            }
        }
    }, [selectedStoreId, map, stores]);

    // Fit bounds on initial load
    useEffect(() => {
        if (stores.length > 0 && !selectedStoreId) {
            const bounds = L.latLngBounds(stores.map(s => [s.lat, s.lng]));
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }, []);

    return (
        <>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />
            {stores.map((store) => (
                <Marker
                    key={store.id}
                    position={[store.lat, store.lng]}
                    icon={createIcon(store.id === selectedStoreId)}
                    eventHandlers={{
                        click: () => onMarkerClick(store),
                    }}
                    ref={(ref: any) => {
                        if (ref) markerRefs.current[store.id] = ref;
                    }}
                >
                </Marker>
            ))}
        </>
    );
};

const LeafletMap = ({
    stores,
    selectedStoreId,
    onMarkerClick
}: {
    stores: StoreLocation[],
    selectedStoreId: string | null,
    onMarkerClick: (store: StoreLocation) => void
}) => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { MapContainer } = require("react-leaflet");

    return (
        <MapContainer
            center={[24.7136, 46.6753]}
            zoom={5}
            style={{ width: "100%", height: "100%" }}
            zoomControl={false}
        >
            <MapContent
                stores={stores}
                selectedStoreId={selectedStoreId}
                onMarkerClick={onMarkerClick}
            />
        </MapContainer>
    );
};

const DynamicLeafletMap = dynamic(() => Promise.resolve(LeafletMap), {
    ssr: false,
    loading: () => <div className="w-full h-full bg-gray-100 animate-pulse" />,
});

// --- Main Store Locator Component ---
export default function StoreLocator() {
    const { t } = useLanguage();
    const [selectedCity, setSelectedCity] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedStore, setSelectedStore] = useState<string | null>(null);
    const [isMobileListOpen, setIsMobileListOpen] = useState(false);

    const listRef = useRef<HTMLDivElement>(null);

    // Filter stores
    const filteredStores = useMemo(() => {
        return STORES_DATA.filter(store => {
            const matchesCity = selectedCity === "All" || store.city === selectedCity;
            const matchesSearch = store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                store.address.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCity && matchesSearch;
        });
    }, [selectedCity, searchQuery]);

    // Handle store selection
    const handleStoreSelect = (storeId: string) => {
        setSelectedStore(storeId);
        if (window.innerWidth < 768) {
            setIsMobileListOpen(false); // Close list on mobile to show map
        }
    };

    // GSAP Animations
    useEffect(() => {
        if (listRef.current) {
            gsap.fromTo(listRef.current.children,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.4, stagger: 0.05, ease: "power2.out" }
            );
        }
    }, [filteredStores]);

    return (
        <div className="flex-1 w-full h-full relative overflow-hidden flex flex-col md:flex-row">

            {/* Sidebar / Floating Panel */}
            <div className={`
        absolute md:relative z-20 bg-white/95 backdrop-blur-xl shadow-2xl 
        w-full md:w-[450px] h-[70vh] md:h-full 
        flex flex-col border-t md:border-r border-gray-200
        transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]
        ${isMobileListOpen ? "translate-y-0" : "translate-y-full"}
        bottom-0 md:translate-y-0 md:top-0 md:left-0
      `}>

                {/* Mobile Handle */}
                <div
                    className="w-full h-8 flex items-center justify-center md:hidden cursor-pointer active:bg-gray-50"
                    onClick={() => setIsMobileListOpen(!isMobileListOpen)}
                >
                    <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
                </div>

                {/* Header Section */}
                <div className="p-6 pb-4 border-b border-gray-100 bg-white/50 space-y-4">
                    <div>
                        <h1 className="text-2xl font-bold text-primary mb-1">Our Locations</h1>
                        <p className="text-sm text-gray-500">{filteredStores.length} stores found</p>
                    </div>

                    {/* Search Bar */}
                    <div className="relative">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search city, district or street..."
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* City Filters */}
                    <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                        {CITIES.map(city => (
                            <button
                                key={city}
                                onClick={() => setSelectedCity(city)}
                                className={`
                            px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300
                            ${selectedCity === city
                                        ? "bg-primary text-white shadow-md transform scale-105"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"}
                        `}
                            >
                                {city}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Store List */}
                <div ref={listRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/50">
                    {filteredStores.length === 0 ? (
                        <div className="text-center py-10 text-gray-500">
                            <FiSearch className="mx-auto text-4xl mb-3 opacity-20" />
                            <p>No stores found matching your criteria.</p>
                        </div>
                    ) : (
                        filteredStores.map(store => (
                            <div
                                key={store.id}
                                onClick={() => handleStoreSelect(store.id)}
                                className={`
                            group p-4 rounded-xl border transition-all duration-300 cursor-pointer relative overflow-hidden
                            ${selectedStore === store.id
                                        ? "bg-white border-accent shadow-lg ring-1 ring-accent scale-[1.02]"
                                        : "bg-white border-transparent hover:border-gray-200 hover:shadow-md"}
                        `}
                            >
                                {selectedStore === store.id && (
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent" />
                                )}

                                <div className="flex justify-between items-start mb-2">
                                    <h3 className={`font-bold text-lg ${selectedStore === store.id ? "text-accent" : "text-primary"}`}>
                                        {store.name}
                                    </h3>
                                    {store.status === "open" ? (
                                        <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-medium">Open</span>
                                    ) : (
                                        <span className="bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full font-medium">Coming Soon</span>
                                    )}
                                </div>

                                <div className="space-y-2 text-sm text-gray-600">
                                    <div className="flex items-start gap-2">
                                        <FiMapPin className="shrink-0 mt-0.5 text-gray-400" />
                                        <span>{store.address}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FiClock className="shrink-0 text-gray-400" />
                                        <span>{store.hours}</span>
                                    </div>
                                </div>

                                {selectedStore === store.id && (
                                    <div className="mt-4 pt-3 border-t border-gray-100 flex gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                                        <button className="flex-1 bg-primary text-white py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                                            <FiNavigation /> Directions
                                        </button>
                                        <button className="flex-1 bg-gray-100 text-primary py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                                            <FiPhone /> Call
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Map Area */}
            <div className="flex-1 relative h-[40vh] md:h-full bg-gray-200 z-10">
                <DynamicLeafletMap
                    stores={STORES_DATA}
                    selectedStoreId={selectedStore}
                    onMarkerClick={(store) => {
                        setSelectedStore(store.id);
                        // Open list on mobile if marker clicked
                        if (window.innerWidth < 768) {
                            setIsMobileListOpen(true);
                        }
                    }}
                />

                {/* Floating Action Button (Mobile) - View List */}
                {!isMobileListOpen && (
                    <button
                        onClick={() => setIsMobileListOpen(true)}
                        className="md:hidden absolute bottom-6 left-1/2 -translate-x-1/2 bg-primary text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-2 z-50 animate-in fade-in zoom-in duration-300"
                    >
                        <FiFilter /> View List
                    </button>
                )}
            </div>

        </div>
    );
}
