"use client";

import { useEffect } from "react";
import { useSettingsStore } from "@/stores/settings";
import type { SettingsResponse } from "@/types/settings";

export default function SettingsInitializer({
  settings,
}: {
  settings: SettingsResponse["data"] | null;
}) {
  const setSettings = useSettingsStore((state) => state.setSettings);

  useEffect(() => {
    if (settings) {
      setSettings(settings);
    }
  }, [settings, setSettings]);

  return null;
}
