import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { VehicleData } from "@/types/vehicles";
import { addToFav, removeFromFav } from "@/lib/actions";

interface FavoritesState {
  favorites: VehicleData[];
  addFavorite: (vehicle: VehicleData) => Promise<void>;
  removeFavorite: (id: number) => Promise<void>;
  setFavorites: (favorites: VehicleData[]) => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      
      setFavorites: (favorites: VehicleData[]) => set({ favorites }),

      addFavorite: async (vehicle) => {
        const { favorites } = get();
        if (favorites.some((v) => v.id === vehicle.id)) return;
        
        set({ favorites: [...favorites, vehicle] });
        
        // Background sync
        try {
          await addToFav(vehicle.id);
        } catch (error) {
          // Fail silently as requested
          console.error("Background sync failed (addFavorite):", error);
        }
      },

      removeFavorite: async (id) => {
        const { favorites } = get();
        set({ favorites: favorites.filter((v) => v.id !== id) });
        
        // Background sync
        try {
          await removeFromFav(id);
        } catch (error) {
          // Fail silently as requested
          console.error("Background sync failed (removeFavorite):", error);
        }
      },
    }),
    {
      name: "favorites-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
