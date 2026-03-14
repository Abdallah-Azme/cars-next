"use client";

import { Heart, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { addToFav, removeFromFav, getFavorites } from "@/lib/actions";
import { toast } from "sonner";
import { useState } from "react";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/user";
import type { VehicleData } from "@/types/vehicles";

const AddToFavBtn = ({ id }: { id: number }) => {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const { data: favsData } = useQuery({
    queryKey: ["favorites"],
    queryFn: () => getFavorites(),
    enabled: isAuthenticated,
  });

  const favorites = favsData?.data?.data ?? [];
  const isFavorite = favorites.some((fav: VehicleData) => fav.id === id);

  const toggleFav = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to manage favorites");
      return;
    }
    setLoading(true);
    const res = isFavorite ? await removeFromFav(id) : await addToFav(id);
    if (res.ok) {
      toast.success(res?.data?.message);
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    } else {
      toast.error(res?.error || "Failed to update favorites");
    }
    setLoading(false);
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      className="rounded-full"
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      title={isFavorite ? "Remove from favorites" : "Add to favorites"}
      disabled={loading}
      onClick={toggleFav}
    >
      {loading ? (
        <Loader2 className="animate-spin" />
      ) : (
        <Heart className={isFavorite ? "fill-red-600 text-red-600" : ""} />
      )}
    </Button>
  );
};

export default AddToFavBtn;
