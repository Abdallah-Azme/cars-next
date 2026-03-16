"use client";

import { useEffect } from "react";

import { useSettingsStore } from "@/stores/settings";

export function DynamicHead() {
  const setSettings = useSettingsStore((state) => state.setSettings);
  const settings = useSettingsStore((state) => state.settings);

  useEffect(() => {
    if (!settings) {
      const fetchSettings = async () => {
        const { getSettings } = await import("@/lib/actions");
        const res = await getSettings();
        if (res.ok && res.data?.data) {
          setSettings(res.data.data);
        }
      };
      fetchSettings();
    }
  }, [settings, setSettings]);

  useEffect(() => {
    if (!settings) return;

    // 1. Update Title
    if (settings.metaTitle || settings.siteName) {
      document.title = settings.metaTitle || settings.siteName || "Car Auction";
    }

    // 2. Update Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc && settings.metaDescription) {
      metaDesc = document.createElement("meta");
      metaDesc.setAttribute("name", "description");
      document.head.appendChild(metaDesc);
    }
    if (metaDesc && settings.metaDescription) {
      metaDesc.setAttribute("content", settings.metaDescription);
    }

    // 3. Update Keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords && settings.metaKeywords) {
      metaKeywords = document.createElement("meta");
      metaKeywords.setAttribute("name", "keywords");
      document.head.appendChild(metaKeywords);
    }
    if (metaKeywords && settings.metaKeywords) {
      metaKeywords.setAttribute("content", settings.metaKeywords);
    }

    // 4. Update Favicon
    if (settings.siteLogo) {
      let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement("link");
        link.rel = "icon";
        document.head.appendChild(link);
      }
      link.href = settings.siteLogo;
    }
  }, [settings]);

  return null;
}
