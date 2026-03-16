"use client";

import { Button } from "@/components/ui/button";
import { CircleDollarSign, Phone } from "lucide-react";
import { useSettingsStore } from "@/stores/settings";
import { fixImageUrl } from "@/lib/utils";

export default function Hero() {
  const settings = useSettingsStore((state) => state.settings);

  return (
    <section
      className="relative md:h-[60vh] h-[70vh] text-white bg-no-repeat bg-center bg-cover"
      style={{
        backgroundImage: `url('${fixImageUrl(settings?.heroImage) || "/hero.jpg"}')`,
      }}
    >
      {/* Background */}
      <div className="w-full h-full bg-black/70 ">
        <div className="h-full w-full container flex items-center justify-center">
          {/* Content */}
          <div className=" text-center max-w-5xl flex flex-col gap-4 ">
            <h1 className="text-3xl md:text-6xl font-black leading-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
              {settings?.heroTitle || "Powerful Heavy Equipment"}
            </h1>

            <p className=" md:text-lg text-sm text-gray-200 font-medium drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
              {settings?.heroDescription ||
                "We provide high-performance heavy machinery for construction, roadwork, infrastructure, and industrial projects — built for reliability and maximum productivity."}
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size={"lg"}
                className="bg-red-600 hover:bg-red-700 text-white font-bold text-lg shadow-[0_0_20px_rgba(220,38,38,0.3)] transition-all hover:scale-105"
                asChild
              >
                <a href={settings?.email ? `mailto:${settings.email}` : "#"}>
                  <CircleDollarSign size={20} />
                  Request a Quote
                </a>
              </Button>

              <Button
                size={"lg"}
                className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 text-lg font-bold transition-all hover:scale-105 shadow-xl"
                asChild
              >
                <a href={settings?.phone ? `tel:${settings.phone}` : "#"}>
                  <Phone size={20} />
                  Contact Us
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

