"use client";

import { useSettingsStore } from "@/stores/settings";
import { motion } from "framer-motion";
import Image from "next/image";

export default function WhatsAppButton() {
  const settings = useSettingsStore((state) => state.settings);

  // If there's no WhatsApp link, don't render anything
  if (!settings?.whatsapp) return null;

  // If the user entered just a number, convert it to a wa.me link
  const whatsappUrl = settings.whatsapp.startsWith("http")
    ? settings.whatsapp
    : `https://wa.me/${settings.whatsapp.replace(/\D/g, "")}`;

  return (
    <div className="fixed bottom-6 left-6 z-9999 group">
      <motion.a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1, y: -4 }}
        whileTap={{ scale: 0.9 }}
        className="relative flex h-16 w-16 items-center justify-center rounded-full bg-[#25D366] p-0 overflow-visible shadow-lg hover:shadow-[#25D366]/40 transition-shadow"
        aria-label="Contact us on WhatsApp"
      >
        {/* Pulse effect */}
        <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366]/40" />
        
        <div className="relative h-full w-full rounded-full overflow-hidden border-2 border-white shadow-sm bg-white">
           <Image
              src="/whatsapp.jpg" 
              alt="WhatsApp" 
              fill
              className="object-cover"
           />
        </div>
        
        {/* Tooltip */}
        <div className="absolute left-full ml-3 hidden group-hover:block whitespace-nowrap rounded-lg bg-gray-900 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white shadow-xl">
          Chat with us!
        </div>
      </motion.a>
    </div>
  );
}
