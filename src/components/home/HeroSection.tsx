"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CircleDollarSign, Phone } from "lucide-react";
import { useSettingsStore } from "@/stores/settings";
import { getSettings } from "@/lib/actions";

export default function Hero() {
  const settings = useSettingsStore((state) => state.settings);
  const setSettings = useSettingsStore((state) => state.setSettings);

  useEffect(() => {
    if (!settings) {
      const fetchSettings = async () => {
        const res = await getSettings();
        if (res.ok && res.data?.data) {
          setSettings(res.data.data);
        }
      };
      fetchSettings();
    }
  }, [settings, setSettings]);

  return (
    <section
      className="relative md:h-[90vh] h-screen text-white bg-no-repeat bg-center bg-cover"
      style={{
        backgroundImage: `url('${settings?.heroImage || "/hero.jpg"}')`,
      }}
    >
      {/* Background */}
      <div className="w-full h-full bg-black/70 ">
        <div className="h-full w-full container flex items-center justify-center">
          {/* Content */}
          <div className=" text-center max-w-5xl flex flex-col gap-4 ">
            <h1 className="text-3xl md:text-6xl font-bold leading-tight">
              {settings?.heroTitle || "Powerful Heavy Equipment"}
            </h1>

            <p className=" md:text-lg text-sm text-gray-300">
              {settings?.heroDescription ||
                "We provide high-performance heavy machinery for construction, roadwork, infrastructure, and industrial projects — built for reliability and maximum productivity."}
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size={"lg"}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold text-lg"
                asChild
              >
                <a href={settings?.email ? `mailto:${settings.email}` : "#"}>
                  <CircleDollarSign size={20} />
                  Request a Quote
                </a>
              </Button>

              <Button
                size={"lg"}
                variant="outline"
                className="border-white text-white hover:bg-white/10 text-lg"
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

