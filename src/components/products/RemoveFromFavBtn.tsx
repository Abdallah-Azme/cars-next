"use client";

import { removeFromFav } from "@/lib/actions";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";

const RemoveFromFavBtn = ({ id }: { id: number }) => {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  
  const handleRemove = async () => {
    setLoading(true);
    const res = await removeFromFav(id);
    if (res.ok) {
      toast.success(res?.data?.message || "Removed from favorites");
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    } else {
      toast.error(res?.error || "Failed to remove from favorites");
    }
    setLoading(false);
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      className="rounded-full"
      aria-label="Remove from favorites"
      title="Remove from favorites"
      disabled={loading}
      onClick={handleRemove}
    >
      {loading ? <Loader2 className="animate-spin" /> : <X />}
    </Button>
  );
};

export default RemoveFromFavBtn;

