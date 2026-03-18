"use client";

import { motion } from "framer-motion";
import { useSettingsStore } from "@/stores/settings";
import {
  Phone,
  Facebook,
  Instagram,
  MessageCircle,
  Twitter,
  Linkedin,
  Youtube,
  Music2,
  Ghost,
  Pin,
  Send,
  ArrowRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function MergedHero() {
  const settings = useSettingsStore((state) => state.settings);

  const socialPlatforms = [
    { id: "facebook", icon: Facebook, label: "Facebook", color: "rgba(24,119,242,0.25)", border: "rgba(24,119,242,0.45)" },
    { id: "twitter", icon: Twitter, label: "Twitter", color: "rgba(29,161,242,0.25)", border: "rgba(29,161,242,0.45)" },
    { id: "instagram", icon: Instagram, label: "Instagram", color: "rgba(225,48,108,0.25)", border: "rgba(225,48,108,0.45)" },
    { id: "linkedin", icon: Linkedin, label: "LinkedIn", color: "rgba(0,119,181,0.25)", border: "rgba(0,119,181,0.45)" },
    { id: "youtube", icon: Youtube, label: "YouTube", color: "rgba(255,0,0,0.25)", border: "rgba(255,0,0,0.45)" },
    { id: "tiktok", icon: Music2, label: "TikTok", color: "rgba(0,0,0,0.25)", border: "rgba(0,0,0,0.45)" },
    { id: "snapchat", icon: Ghost, label: "Snapchat", color: "rgba(255,252,0,0.25)", border: "rgba(255,252,0,0.45)" },
    { id: "pinterest", icon: Pin, label: "Pinterest", color: "rgba(189,8,28,0.25)", border: "rgba(189,8,28,0.45)" },
    { id: "whatsapp", icon: MessageCircle, label: "WhatsApp", color: "rgba(37,211,102,0.25)", border: "rgba(37,211,102,0.45)" },
    { id: "telegram", icon: Send, label: "Telegram", color: "rgba(0,136,204,0.25)", border: "rgba(0,136,204,0.45)" },
  ];

  const activeSocials = socialPlatforms
    .filter((p) => settings?.[p.id as keyof typeof settings])
    .map((p) => ({
      ...p,
      url: settings?.[p.id as keyof typeof settings] as string,
    }));

  const heroImage = "/hero-egypt.jpg";
  const heroTitle = settings?.heroTitle || "Powerful Heavy Equipment";
  const heroDescription = settings?.heroDescription || "Follow us on social media or contact us directly for the latest offers and updates.";

  return (
    <section className="relative w-full h-[90vh] min-h-[500px] overflow-hidden">
      {/* Full-bleed background image */}
      <Image
        src={heroImage}
        alt="Hero Background"
        fill
        className="object-cover"
        style={{ objectPosition: "center" }}
        priority
      />

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-linear-to-r from-black/60 via-black/25 to-transparent" />

      {/* Hero Content panel — overlaid on the left */}
      <div className="absolute inset-y-0 left-0 flex items-center px-6 md:px-12 lg:px-16">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-[400px] space-y-6"
          style={{
            background: "rgba(10, 10, 20, 0.35)",
            backdropFilter: "blur(18px)",
            WebkitBackdropFilter: "blur(18px)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: "1.5rem",
            padding: "2.5rem 2rem",
          }}
        >
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-black text-white leading-tight">
              {heroTitle.split(" ").slice(0, -1).join(" ")} <span className="text-red-500">{heroTitle.split(" ").slice(-1)}</span>
            </h1>
            <p className="text-white/60 text-sm md:text-base font-medium leading-relaxed">
              {heroDescription}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            {settings?.heroButton1Link && (
              <Link href={settings.heroButton1Link} className="grow cursor-pointer outline-none">
                 <ButtonWrapper color="bg-red-600 hover:bg-red-700">
                    Contact Us
                    <ArrowRight className="size-4 ml-2" />
                 </ButtonWrapper>
              </Link>
            )}
            {settings?.heroButton2Link && (
              <Link href={settings.heroButton2Link} className="grow cursor-pointer outline-none">
                 <ButtonWrapper color="bg-white/10 hover:bg-white/20 border border-white/20">
                    Get Quote
                 </ButtonWrapper>
              </Link>
            )}
          </div>

          {/* Social Links */}
          <div className="pt-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-3">Connect With Us</p>
            <div className="flex flex-wrap gap-2">
              {activeSocials.slice(0, 5).map((platform) => (
                <motion.a
                  key={platform.id}
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white transition-all border border-white/10"
                  style={{ background: "rgba(255,255,255,0.05)" }}
                  title={platform.label}
                >
                  <platform.icon size={18} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div
            className="h-px w-full"
            style={{ background: "rgba(255,255,255,0.12)" }}
          />

          {/* Phone Contact */}
          {settings?.phone && (
            <motion.a
              href={`tel:${settings.phone}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-4 p-4 rounded-2xl transition-all"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 bg-red-600 shadow-lg shadow-red-600/20"
              >
                <Phone size={18} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">
                  Direct Line
                </span>
                <span className="text-base font-black text-white">{settings.phone}</span>
              </div>
            </motion.a>
          )}
        </motion.div>
      </div>
    </section>
  );
}

function ButtonWrapper({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <div className={`flex items-center justify-center px-6 py-3 rounded-xl text-white font-bold text-sm transition-all duration-300 ${color}`}>
      {children}
    </div>
  )
}
