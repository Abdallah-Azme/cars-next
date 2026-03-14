import type { SettingsResponse } from "@/types/settings";
import { create } from "zustand";

interface SettingsState {
  settings: SettingsResponse["data"] | null;
  setSettings: (settings: SettingsResponse["data"]) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  settings: null,
  setSettings: (settings) => set({ settings }),
}));
