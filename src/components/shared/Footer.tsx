"use client";

import { useSettingsStore } from "@/stores/settings";
import { usePathname } from "next/navigation";
import { fixImageUrl, getLocalizedValue } from "@/lib/utils";
import { Link } from "@/i18n/routing";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Music2,
  Ghost,
  Pin,
  MessageCircle,
  Send,
  Phone,
  MapPin,
  Mail,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";

const socialPlatforms = [
  { id: "facebook", icon: Facebook, label: "Facebook" },
  { id: "twitter", icon: Twitter, label: "Twitter" },
  { id: "instagram", icon: Instagram, label: "Instagram" },
  { id: "linkedin", icon: Linkedin, label: "LinkedIn" },
  { id: "youtube", icon: Youtube, label: "YouTube" },
  { id: "tiktok", icon: Music2, label: "TikTok" },
  { id: "snapchat", icon: Ghost, label: "Snapchat" },
  { id: "pinterest", icon: Pin, label: "Pinterest" },
  { id: "whatsapp", icon: MessageCircle, label: "WhatsApp" },
  { id: "telegram", icon: Send, label: "Telegram" },
];

export default function Footer() {
  const pathname = usePathname();
  const settings = useSettingsStore((state) => state.settings);
  const locale = useLocale();
  const t = useTranslations("Footer");
  const isRtl = locale === 'ar';

  const siteName = getLocalizedValue(settings, "siteName", locale) || "Sub Coders";
  const address = getLocalizedValue(settings, "address", locale);

  if (pathname?.includes("/admin")) return null;

  const importantLinks = [
    { label: t("links.home"), href: "/" },
    { label: t("links.inventory"), href: "/products" },
    { label: t("links.aboutUs"), href: "/about-us" },
    { label: t("links.services"), href: "/#services" },
    { label: t("links.contact"), href: "/#contact" },
  ];

  const categories = [
    { label: t("categories.construction"), href: "/products?category=construction" },
    { label: t("categories.excavators"), href: "/products?category=excavator" },
    { label: t("categories.loaders"), href: "/products?category=loader" },
    { label: t("categories.cranes"), href: "/products?category=crane" },
  ];

  const activeSocials = socialPlatforms.filter(
    (platform) => settings?.[platform.id as keyof typeof settings],
  ).map(p => ({
    ...p,
    url: settings?.[p.id as keyof typeof settings] as string
  }));
  const mobileSocials = activeSocials.slice(0, 5);

  return (
    <footer className="bg-[#0f0f0f] text-white pt-8 pb-6 md:pt-14 md:pb-8 border-t border-white/5">
      <div className="container mx-auto px-4">
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10 mb-6 md:mb-10 py-1 md:py-2 text-center md:text-start`}>
          {/* Brand Column */}
          <div className="space-y-3">
            <Link
              href="/"
              className={`inline-block transition-transform hover:scale-105 mx-auto md:ms-0`}
            >
              <div className={`flex items-center justify-center gap-3 md:justify-start`}>
                {settings?.siteLogo ? (
                  <div className="relative w-12 h-12">
                    <Image
                      src={fixImageUrl(settings.siteLogo)}
                      alt={siteName}
                      fill
                      className="object-contain"
                      sizes="48px"
                    />
                  </div>
                ) : (
                  <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(220,38,38,0.3)]">
                    <span className="text-white font-black text-xl italic font-serif">
                      A
                    </span>
                  </div>
                )}
                <span className="text-xl md:text-2xl font-black tracking-tighter uppercase italic">
                  {siteName}
                </span>
              </div>
            </Link>
            <p className="hidden sm:block text-gray-400 text-sm leading-relaxed max-w-sm mx-auto md:mx-0">
              {t("description")}
            </p>
            <div className={`grid grid-cols-5 gap-2 md:flex md:flex-wrap md:gap-3 pt-1 md:pt-2 justify-items-center max-w-[250px] mx-auto md:max-w-none md:mx-0 md:justify-start`}>
              <div className="contents md:hidden">
                {mobileSocials.map((platform) => (
                  <a
                    key={platform.id}
                    href={platform.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center text-gray-300 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-300"
                    aria-label={platform.label}
                  >
                    <platform.icon size={16} />
                  </a>
                ))}
              </div>
              <div className="hidden md:contents">
                {activeSocials.map((platform) => (
                  <a
                    key={platform.id}
                    href={platform.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center text-gray-300 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-300"
                    aria-label={platform.label}
                  >
                    <platform.icon size={18} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Important Links */}
          <div className="space-y-3">
            <h4 className={`text-lg font-bold tracking-tight border-red-600 inline-block md:block mb-4 ${isRtl ? 'border-r-4 pr-4' : 'border-l-4 pl-4'}`}>
              {t('importantLinks')}
            </h4>
            <ul className="space-y-2">
              {importantLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className={`text-gray-500 hover:text-red-600 transition-all inline-block text-sm font-medium ${isRtl ? 'hover:-translate-x-1' : 'hover:translate-x-1'}`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div className="hidden md:block space-y-3">
            <h4 className={`text-lg font-bold tracking-tight border-red-600 inline-block md:block mb-4 ${isRtl ? 'border-r-4 pr-4' : 'border-l-4 pl-4'}`}>
              {t('topCategories')}
            </h4>
            <ul className="space-y-3">
              {categories.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className={`text-gray-500 hover:text-red-600 transition-all inline-block text-sm font-medium ${isRtl ? 'hover:-translate-x-1' : 'hover:translate-x-1'}`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="hidden sm:block space-y-3">
            <h4 className={`text-lg font-bold tracking-tight border-red-600 inline-block md:block mb-4 ${isRtl ? 'border-r-4 pr-4' : 'border-l-4 pl-4'}`}>
              {t('quickContact')}
            </h4>
            <div className={`space-y-4 flex flex-col items-center ${isRtl ? 'md:items-end' : 'md:items-start'}`}>
              {settings?.phone && (
                <div className={`flex flex-col items-center gap-3 md:gap-4 group md:flex-row`}>
                  <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-red-500 group-hover:bg-red-600 group-hover:text-white transition-colors">
                    <Phone size={18} />
                  </div>
                  <div className={`flex flex-col items-center text-center md:text-start md:items-start`}>
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                      {t('callUs')}
                    </span>
                    <a
                      href={`tel:${settings.phone}`}
                      className="text-sm font-bold text-gray-400 hover:text-red-600 transition-colors"
                    >
                      {settings.phone}
                    </a>
                  </div>
                </div>
              )}
              
              {settings?.email && (
                <div className={`flex flex-col items-center gap-3 md:gap-4 group md:flex-row`}>
                  <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-red-500 group-hover:bg-red-600 group-hover:text-white transition-colors">
                    <Mail size={18} />
                  </div>
                  <div className={`flex flex-col items-center text-center md:text-start md:items-start`}>
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                      {t('email')}
                    </span>
                    <a
                      href={`mailto:${settings.email}`}
                      className="text-sm font-bold text-gray-400 hover:text-red-600 transition-colors break-all"
                    >
                      {settings.email}
                    </a>
                  </div>
                </div>
              )}

              {address && (
                <div className={`flex flex-col items-center gap-3 md:gap-4 group md:flex-row`}>
                  <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-red-500">
                    <MapPin size={18} />
                  </div>
                  <div className={`flex flex-col items-center text-center md:text-start md:items-start`}>
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                      {t('location')}
                    </span>
                    <span className="text-sm font-bold text-gray-300">
                      {address}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="pt-4 md:pt-6 border-t border-white/5 flex flex-col items-center">
          <p className="text-gray-500 text-xs font-medium text-center">
            © {new Date().getFullYear()}{" "}
            <span className="text-gray-500 underline underline-offset-4 decoration-red-600/30 font-black">
              {siteName}
            </span>
            . {t('rights')}
          </p>
        </div>
      </div>
    </footer>
  );
}
