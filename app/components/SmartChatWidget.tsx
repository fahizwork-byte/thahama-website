"use client";

import { useState, useEffect } from "react";
import { FiMessageSquare, FiX, FiMapPin, FiClock, FiSmartphone, FiChevronRight } from "react-icons/fi";
import { siteContent } from "@/app/data/siteContent";
import { useLanguage } from "@/app/i18n/LanguageContext";

export default function SmartChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeMessage, setActiveMessage] = useState<string | null>(null);
    const { t } = useLanguage();

    // Close message bubble after a delay if set
    useEffect(() => {
        if (activeMessage) {
            const timer = setTimeout(() => setActiveMessage(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [activeMessage]);

    const toggleOpen = () => {
        setIsOpen(!isOpen);
        if (!isOpen) setActiveMessage(null); // Clear temporary messages when opening menu
    };

    const handleAction = (action: string) => {
        if (action === "locations") {
            document.getElementById("branches")?.scrollIntoView({ behavior: "smooth" });
            setIsOpen(false);
        } else if (action === "hours") {
            setActiveMessage(`We are open ${siteContent.hero.businessHours}!`);
            // Don't close menu, just show message inside or above? 
            // Better UI: Show a temporary bubble, then close menu or keep it open.
            // Let's close menu and show a "toast" style message or just keep it active.
            // Simpler: Just show text in the UI.
        } else if (action === "whatsapp") {
            const phone = siteContent.hero.phone.replace(/[^0-9]/g, "");
            window.open(`https://wa.me/${phone}?text=Hi%20Thahama%2C%20I%20have%20a%20question...`, "_blank");
            setIsOpen(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">

            {/* Temporary Message Bubble (e.g. Opening Hours) */}
            {activeMessage && (
                <div className="bg-white px-6 py-4 rounded-2xl rounded-br-none shadow-xl border border-gray-100 animate-slide-up max-w-[280px]">
                    <div className="flex items-start gap-3">
                        <div className="bg-emerald-100 p-2 rounded-full text-emerald-600 shrink-0">
                            <FiClock className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-gray-800 font-medium text-sm leading-relaxed">{activeMessage}</p>
                        </div>
                        <button onClick={() => setActiveMessage(null)} className="text-gray-400 hover:text-gray-600">
                            <FiX className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* Main Menu */}
            {isOpen && !activeMessage && (
                <div className="bg-white/90 backdrop-blur-xl border border-white/50 shadow-2xl rounded-3xl overflow-hidden w-[320px] animate-scale-in origin-bottom-right">
                    {/* Header */}
                    <div className="bg-linear-to-r from-primary to-slate-800 p-6 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />

                        <h3 className="text-lg font-bold mb-1 relative z-10 flex items-center gap-2">
                            👋 Hi there!
                        </h3>
                        <p className="text-white/80 text-sm relative z-10">
                            Welcome to Thahama Market. <br /> How can we help you today?
                        </p>
                    </div>

                    {/* Actions List */}
                    <div className="p-2 space-y-1">
                        <button
                            onClick={() => handleAction("locations")}
                            className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors rounded-xl group text-left"
                        >
                            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                <FiMapPin className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold text-gray-800 text-sm">Find Nearest Branch</p>
                                <p className="text-gray-400 text-xs">View all our locations</p>
                            </div>
                            <FiChevronRight className="text-gray-300 group-hover:text-primary transition-colors" />
                        </button>

                        <button
                            onClick={() => handleAction("hours")}
                            className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors rounded-xl group text-left"
                        >
                            <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                <FiClock className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold text-gray-800 text-sm">Opening Hours</p>
                                <p className="text-gray-400 text-xs">Check when we&apos;re open</p>
                            </div>
                            <FiChevronRight className="text-gray-300 group-hover:text-primary transition-colors" />
                        </button>

                        <button
                            onClick={() => handleAction("whatsapp")}
                            className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors rounded-xl group text-left"
                        >
                            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                <FiSmartphone className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold text-gray-800 text-sm">Chat on WhatsApp</p>
                                <p className="text-gray-400 text-xs">Talk to a human</p>
                            </div>
                            <FiChevronRight className="text-gray-300 group-hover:text-primary transition-colors" />
                        </button>
                    </div>

                    <div className="bg-gray-50 p-3 text-center border-t border-gray-100">
                        <p className="text-[10px] text-gray-400">Typically replies immediately</p>
                    </div>
                </div>
            )}

            {/* FAB Toggle Button */}
            <button
                onClick={toggleOpen}
                className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center text-white transition-all duration-300 hover:scale-110 active:scale-95 ${isOpen ? 'bg-gray-800 rotate-90' : 'bg-accent animate-bounce-subtle'}`}
                aria-label="Toggle Support Chat"
            >
                {isOpen ? <FiX className="w-6 h-6" /> : <FiMessageSquare className="w-6 h-6" />}
            </button>

            <style jsx global>{`
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes bounce-subtle {
           0%, 100% { transform: translateY(0); }
           50% { transform: translateY(-5px); }
        }
        .animate-slide-up { animation: slide-up 0.3s ease-out forwards; }
        .animate-scale-in { animation: scale-in 0.2s ease-out forwards; }
        .animate-bounce-subtle { animation: bounce-subtle 3s ease-in-out infinite; }
      `}</style>
        </div>
    );
}
