"use client";

import { motion } from "framer-motion";
import { useSettingsStore } from "@/stores/settings";
import {
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
  Phone,
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

const PageHeader = ({ title }: { title: string }) => {
  const settings = useSettingsStore((state) => state.settings);

  const activeSocials = socialPlatforms
    .filter((p) => settings?.[p.id as keyof typeof settings])
    .map((p) => ({
      ...p,
      url: settings?.[p.id as keyof typeof settings] as string,
    }));

  return (
    <div className="relative md:h-[45vh] h-[30vh] bg-[url(/hero.jpg)] bg-cover bg-center bg-no-repeat overflow-hidden">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/75 backdrop-blur-[2px]" />

      <div className="container relative h-full flex flex-col md:flex-row items-center justify-between gap-8 py-8">
        {/* Title Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 text-center md:text-left"
        >
          <h1 className="text-3xl md:text-6xl font-black text-white tracking-tight uppercase italic">
            {title}
          </h1>
          <div className="h-1 w-20 bg-red-600 mt-4 mx-auto md:ml-0" />
        </motion.div>

        {/* Social Card overlaying the background */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col gap-4 p-5 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl w-full max-w-[320px] md:max-w-[280px]"
        >
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Connect With Us</p>
            <div className="flex flex-wrap gap-2">
              {activeSocials.slice(0, 5).map((platform) => (
                <a
                  key={platform.id}
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all border border-white/5"
                  title={platform.label}
                >
                  <platform.icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {settings?.phone && (
            <div className="pt-4 border-t border-white/10">
              <a
                href={`tel:${settings.phone}`}
                className="flex items-center gap-3 transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white shadow-lg shadow-red-600/20">
                  <Phone size={14} />
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-white/30">Direct Line</span>
                  <span className="text-sm font-black text-white group-hover:text-red-500 transition-colors">
                    {settings.phone}
                  </span>
                </div>
              </a>
            </div>
          )}
        </motion.div>
      </div>

      {/* Decorative gradient */}
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-linear-to-t from-black/50 to-transparent pointer-events-none" />
    </div>
  );
};

export default PageHeader;
