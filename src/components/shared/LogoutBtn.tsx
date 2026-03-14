"use client";

import { logout } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/user";
import { Loader2, LogOut } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const LogoutBtn = ({size="sm"}: {size?: "sm"|"lg"}) => {
  const { logout: clearAuth } = useAuthStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const handleLogout = async () => {
    setLoading(true);
    const res = await logout();
    if (res?.ok) {
      toast.success(res?.data?.message || "Logged out successfully");
      clearAuth();
      router.push("/");
      router.refresh();
    } else {
      toast.error(res?.error || "Logout failed");
    }
    setLoading(false);
  };

  return (
    <Button
      onClick={handleLogout}
      variant="destructive"
      size={size}
      className="w-full mt-2"
      disabled={loading}
    >
      {loading ? (
        <Loader2 className="animate-spin" />
      ) : (
        <>
          <LogOut className="mr-2 h-4 w-4" /> Logout
        </>
      )}
    </Button>
  );
};

export default LogoutBtn;

