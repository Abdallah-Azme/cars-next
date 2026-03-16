"use client";

import { useFavoritesStore } from "@/stores/favorites";
import { X } from "lucide-react";
import { Button } from "../ui/button";

const RemoveFromFavBtn = ({ id }: { id: number }) => {
  const { removeFavorite } = useFavoritesStore();
  
  const handleRemove = async () => {
    await removeFavorite(id);
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      className="rounded-full"
      aria-label="Remove from favorites"
      title="Remove from favorites"
      onClick={handleRemove}
    >
      <X />
    </Button>
  );
};

export default RemoveFromFavBtn;
