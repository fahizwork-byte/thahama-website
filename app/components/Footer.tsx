"use client";

/**
 * Footer Component - Client Component
 * 
 * Footer with company info, links, and social media.
 * Converted to client component to support phone number copy functionality.
 * 
 * @component
 * @returns {JSX.Element} Footer with company info, links, and social media
 */
import { useState } from "react";
import { FiPhone, FiMail, FiMapPin, FiFacebook, FiInstagram, FiTwitter, FiCheck } from "react-icons/fi";
import { useLanguage } from "../i18n/LanguageContext";
import { siteContent } from "@/app/data/siteContent";

export default function Footer() {
  // Get current year for copyright
  const currentYear = new Date().getFullYear();
  const [copiedPhone, setCopiedPhone] = useState(false);
  const { t } = useLanguage();

  const copyToClipboard = async (phone: string) => {
    try {
      await navigator.clipboard.writeText(phone);
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    } catch (err) {
      console.error("Failed to copy phone number:", err);
    }
  };

  return (
    <footer className="bg-primary text-white relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold mb-4">
              <span className="text-white">THAHAMA</span>
              <span className="text-accent">:market</span>
            </h3>
            <p className="text-gray-300 mb-4 leading-relaxed">
              {t("footer.description")}
            </p>
            <p className="text-gray-400 text-sm">
              {siteContent.hero.tagline}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-accent">{t("footer.quickLinks")}</h4>
            <ul className="space-y-2">
              <li>
                <a href="#about" className="text-gray-300 hover:text-accent transition-colors">
                  {t("footer.aboutUs")}
                </a>
              </li>
              <li>
                <a href="#services" className="text-gray-300 hover:text-accent transition-colors">
                  {t("footer.ourServices")}
                </a>
              </li>
              <li>
                <a href="#branches" className="text-gray-300 hover:text-accent transition-colors">
                  {t("footer.branches")}
                </a>
              </li>
              <li>
                <a href="#gallery" className="text-gray-300 hover:text-accent transition-colors">
                  {t("footer.gallery")}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-accent">{t("footer.contactUs")}</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-gray-300">
                <FiPhone className="text-accent shrink-0" />
                <button
                  onClick={() => copyToClipboard(siteContent.hero.phone)}
                  className="hover:text-accent transition-all cursor-pointer flex items-center gap-2 underline"
                  title="Click to copy"
                >
                  <span className="font-mono" dir="ltr">{siteContent.hero.phone}</span>
                  {copiedPhone && (
                    <FiCheck className="text-green-500 text-sm shrink-0" />
                  )}
                </button>
              </li>
              <li className="flex items-center gap-2 text-gray-300">
                <FiMail className="text-accent" />
                <span>{siteContent.hero.email}</span>
              </li>
              <li className="flex items-start gap-2 text-gray-300">
                <FiMapPin className="text-accent mt-1" />
                <span>{siteContent.hero.address}</span>
              </li>
            </ul>
          </div>

          {/* Hours & Social */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-accent">{t("footer.openingHours")}</h4>
            <p className="text-gray-300 mb-6">
              {siteContent.hero.businessHours}
            </p>
            <div className="flex gap-4">
              {siteContent.socialLinks.facebook && (
                <a
                  href={siteContent.socialLinks.facebook}
                  className="w-10 h-10 bg-accent/10 hover:bg-accent rounded-full flex items-center justify-center transition-all"
                >
                  <FiFacebook className="text-accent hover:text-primary" />
                </a>
              )}
              {siteContent.socialLinks.instagram && (
                <a
                  href={siteContent.socialLinks.instagram}
                  className="w-10 h-10 bg-accent/10 hover:bg-accent rounded-full flex items-center justify-center transition-all"
                >
                  <FiInstagram className="text-accent hover:text-primary" />
                </a>
              )}
              {siteContent.socialLinks.twitter && (
                <a
                  href={siteContent.socialLinks.twitter}
                  className="w-10 h-10 bg-accent/10 hover:bg-accent rounded-full flex items-center justify-center transition-all"
                >
                  <FiTwitter className="text-accent hover:text-primary" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; {currentYear} THAHAMA:market. {t("footer.rights")}</p>
        </div>
      </div>
    </footer>
  );
}

