"use client";

import { useLanguage } from "../i18n/LanguageContext";
import Image from "next/image";

export default function LanguageSwitcher({ className = "" }: { className?: string }) {
    const { language, setLanguage } = useLanguage();

    const toggleLanguage = () => {
        setLanguage(language === "en" ? "ar" : "en");
    };

    return (
        <button
            onClick={toggleLanguage}
            className={`
                group relative flex items-center gap-2.5 px-4 py-2 
                rounded-full bg-white/5 hover:bg-white/10 
                border border-white/10 hover:border-white/20
                backdrop-blur-md transition-all duration-300 
                hover:scale-105 active:scale-95
                ${className}
            `}
            aria-label={language === "en" ? "Switch to Arabic" : "Switch to English"}
        >
            <div className="relative w-5 h-5 rounded-full overflow-hidden shadow-sm border border-white/20">
                <Image
                    src={language === "en" ? "/flags/sa.svg" : "/flags/gb.svg"}
                    alt={language === "en" ? "Saudi Arabia Flag" : "UK Flag"}
                    fill
                    className="object-cover"
                />
            </div>
            <span className="text-sm font-medium text-white/90 group-hover:text-white transition-colors tracking-wide">
                {language === "en" ? "العربية" : "English"}
            </span>
            
            {/* Subtle glow effect on hover */}
            <div className="absolute inset-0 rounded-full bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </button>
    );
}
