"use client";

import Link from "next/link";
import { useSettingsStore } from "@/stores/settings";
import { usePathname } from "next/navigation";
import { fixImageUrl } from "@/lib/utils";
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

  if (pathname?.startsWith("/admin")) return null;

  const importantLinks = [
    { label: "Home", href: "/" },
    { label: "All Vehicles", href: "/products" },
    { label: "Our Services", href: "/#services" },
    { label: "Contact Us", href: "/#contact" },
  ];

  const categories = [
    { label: "Construction", href: "/products?category=construction" },
    { label: "Excavators", href: "/products?category=excavator" },
    { label: "Loaders", href: "/products?category=loader" },
    { label: "Cranes", href: "/products?category=crane" },
  ];

  const activeSocials = socialPlatforms.filter(
    (platform) => settings?.[platform.id as keyof typeof settings],
  ).map(p => ({
    ...p,
    url: settings?.[p.id as keyof typeof settings] as string
  }));

  return (
    <footer className="bg-[#0f0f0f] text-white pt-20 pb-10 border-t border-white/5">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16 py-4">
          {/* Brand Column */}
          <div className="space-y-6">
            <Link
              href="/"
              className="inline-block transition-transform hover:scale-105"
            >
              <div className="flex items-center gap-3">
                {settings?.siteLogo ? (
                  <div className="relative w-12 h-12">
                    <img
                      src={fixImageUrl(settings.siteLogo)}
                      alt={settings?.siteName || "Logo"}
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(220,38,38,0.3)]">
                    <span className="text-white font-black text-xl italic font-serif">
                      A
                    </span>
                  </div>
                )}
                <span className="text-2xl font-black tracking-tighter uppercase italic">
                  {settings?.siteName || "Sub Coders"}
                </span>
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm" dir="rtl">
              {settings?.metaDescription || "للخدمات اللوجيستية ومتخصصون في استيراد المعدات الثقيلة وتجهيز المصانع من اليابان للمصانع والتجار والأفراد – من مزادات اليابان لحد عندك في مصر."}
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              {activeSocials.map((platform) => (
                <a
                  key={platform.id}
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-gray-100/50 border border-gray-100 flex items-center justify-center text-gray-500 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-300"
                  aria-label={platform.label}
                >
                  <platform.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Important Links */}
          <div className="space-y-6">
            <h4 className="text-lg font-bold tracking-tight border-l-4 border-red-600 pl-4">
              Important Links
            </h4>
            <ul className="space-y-4">
              {importantLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-500 hover:text-red-600 hover:translate-x-1 transition-all inline-block text-sm font-medium"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-6">
            <h4 className="text-lg font-bold tracking-tight border-l-4 border-red-600 pl-4">
              Top Categories
            </h4>
            <ul className="space-y-4">
              {categories.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-500 hover:text-red-600 hover:translate-x-1 transition-all inline-block text-sm font-medium"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h4 className="text-lg font-bold tracking-tight border-l-4 border-red-600 pl-4">
              Quick Contact
            </h4>
            <div className="space-y-5">
              {settings?.phone && (
                <div className="flex items-start gap-4 group">
                  <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-red-500 group-hover:bg-red-600 group-hover:text-white transition-colors">
                    <Phone size={18} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                      Call Us
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
                <div className="flex items-start gap-4 group">
                  <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-red-500 group-hover:bg-red-600 group-hover:text-white transition-colors">
                    <Mail size={18} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                      Email
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

              {settings?.address && (
                <div className="flex items-start gap-4 group">
                  <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-red-500">
                    <MapPin size={18} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                      Location
                    </span>
                    <span className="text-sm font-bold text-gray-300" dir={settings.address.match(/[أ-ي]/) ? "rtl" : "ltr"}>
                      {settings.address}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="pt-10 border-t border-white/5 flex flex-col items-center">
          <p className="text-gray-500 text-xs font-medium text-center">
            © {new Date().getFullYear()}{" "}
            <span className="text-gray-500 underline underline-offset-4 decoration-red-600/30 font-black">
              {settings?.siteName || "Sub Coders"}
            </span>
            . All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
