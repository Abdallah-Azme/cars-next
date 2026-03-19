"use client";

import { logout } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/user";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const LogoutBtn = ({size="sm"}: {size?: "sm"|"lg"}) => {
  const { logout: clearAuth } = useAuthStore();
  const router = useRouter();
  
  const handleLogout = () => {
    // Fire the request but don't await it — we want to get out immediately
    logout().catch(console.error);

    // Immediately clear local state and redirect
    clearAuth();
    router.push("/");
    router.refresh();
    
    toast.success("Logged out successfully");
  };

  return (
    <Button
      onClick={handleLogout}
      variant="destructive"
      size={size}
      className="w-full mt-2"
    >
      <LogOut className="mr-2 h-4 w-4" /> Logout
    </Button>
  );
};

export default LogoutBtn;

