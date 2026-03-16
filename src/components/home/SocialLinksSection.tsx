"use client";

import { useEffect, useState } from "react";
import { useSettingsStore } from "@/stores/settings";
import { getSettings } from "@/lib/actions";
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
  Mail,
  MapPin,
} from "lucide-react";
import { motion } from "framer-motion";

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

export default function SocialLinksSection() {
  const settings = useSettingsStore((state) => state.settings);
  const setSettings = useSettingsStore((state) => state.setSettings);
  const [loading, setLoading] = useState(!settings);

  useEffect(() => {
    if (!settings) {
      const fetchSettings = async () => {
        const res = await getSettings();
        if (res.ok && res.data?.data) {
          setSettings(res.data.data);
        }
        setLoading(false);
      };
      fetchSettings();
    }
  }, [settings, setSettings]);

  if (loading) return null;

  const activeSocials = socialPlatforms.filter(
    (platform) => settings?.[platform.id as keyof typeof settings]
  );

  const hasContactInfo = settings?.phone || settings?.email || settings?.address;

  if (activeSocials.length === 0 && !hasContactInfo) return null;

  return (
    <section className="py-20 bg-white border-t border-gray-100">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto bg-slate-50/50 rounded-[2.5rem] p-8 md:p-16 border border-slate-100 flex flex-col gap-16">
          
          {/* Header */}
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-gray-900">
              Connect <span className="text-red-600">With Us</span>
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Follow us for the latest arrivals, industry news, and exclusive heavy machinery updates.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Minimal Social Grid */}
            <div className="space-y-8">
              <h3 className="text-xl font-bold text-gray-900 border-b pb-4 border-gray-100">Social Networks</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                {activeSocials.map((platform) => {
                  const url = settings?.[platform.id as keyof typeof settings] as string;
                  return (
                    <motion.a
                      key={platform.id}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-red-600 hover:bg-red-50/50 transition-all group"
                    >
                      <platform.icon size={20} className="text-gray-400 group-hover:text-red-600 transition-colors" />
                      <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900">{platform.label}</span>
                    </motion.a>
                  );
                })}
              </div>
            </div>

            {/* Premium Contact Details */}
            <div className="space-y-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="h-8 w-1.5 bg-red-600 rounded-full shadow-[0_0_15px_rgba(220,38,38,0.3)]" />
                <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight">Contact Information</h3>
              </div>
              
              <div className="flex flex-col gap-5">
                {settings?.phone && (
                  <a href={`tel:${settings.phone}`} className="flex items-center gap-6 p-6 rounded-2xl border border-gray-100 bg-white hover:border-red-100 hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] transition-all duration-300 group relative">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-red-600 transition-all duration-300 group-hover:h-[60%] rounded-r-full" />
                    <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center text-gray-400 group-hover:from-red-600 group-hover:to-red-700 group-hover:text-white transition-all duration-500 shadow-inner">
                      <Phone size={28} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[11px] font-black uppercase tracking-[0.25em] text-gray-400 mb-1 group-hover:text-red-600/70 transition-colors">Line 01</span>
                      <span className="text-2xl font-black text-gray-900 leading-tight group-hover:text-red-600 transition-colors uppercase tabular-nums">
                        {settings.phone}
                      </span>
                    </div>
                  </a>
                )}

                {settings?.email && (
                  <a href={`mailto:${settings.email}`} className="flex items-center gap-6 p-6 rounded-2xl border border-gray-100 bg-white hover:border-red-100 hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] transition-all duration-300 group relative">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-red-600 transition-all duration-300 group-hover:h-[60%] rounded-r-full" />
                    <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-gray-50 to-gray-100 flex items-center justify-center text-gray-400 group-hover:from-red-600 group-hover:to-red-700 group-hover:text-white transition-all duration-500 shadow-inner">
                      <Mail size={28} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[11px] font-black uppercase tracking-[0.25em] text-gray-400 mb-1 group-hover:text-red-600/70 transition-colors">Direct Mail</span>
                      <span className="text-xl font-bold text-gray-900 leading-tight group-hover:text-red-600 transition-colors break-all">
                        {settings.email}
                      </span>
                    </div>
                  </a>
                )}

                {settings?.address && (
                  <div className="flex items-center gap-6 p-6 rounded-2xl border border-gray-100 bg-white shadow-sm border-l-4 border-l-red-600/10">
                    <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 shadow-inner border border-gray-100">
                      <MapPin size={28} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[11px] font-black uppercase tracking-[0.25em] text-gray-400 mb-1">Corporate Address</span>
                      <span className="text-xl font-bold text-gray-900 leading-tight">
                        {settings.address}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
