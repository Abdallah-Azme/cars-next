"use client";

import { Heart } from "lucide-react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/user";
import { useFavoritesStore } from "@/stores/favorites";
import type { VehicleData } from "@/types/vehicles";

const AddToFavBtn = ({ vehicle }: { vehicle: VehicleData }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { favorites, addFavorite, removeFavorite } = useFavoritesStore();
  const isFavorite = favorites.some((fav) => fav.id === vehicle.id);

  const toggleFav = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to manage favorites");
      return;
    }

    if (isFavorite) {
      await removeFavorite(vehicle.id);
    } else {
      await addFavorite(vehicle);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      className="rounded-full"
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      title={isFavorite ? "Remove from favorites" : "Add to favorites"}
      onClick={toggleFav}
    >
      <Heart className={isFavorite ? "fill-red-600 text-red-600" : ""} />
    </Button>
  );
};

export default AddToFavBtn;
