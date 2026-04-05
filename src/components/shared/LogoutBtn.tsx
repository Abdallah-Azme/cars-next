"use client";

import { logout } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/user";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useLocale, useTranslations } from "next-intl";

const LogoutBtn = ({size="sm"}: {size?: "sm"|"lg"}) => {
  const { logout: clearAuth } = useAuthStore();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("Common");
  const isRtl = locale === 'ar';
  
  const handleLogout = () => {
    // Fire the request but don't await it — we want to get out immediately
    logout().catch(console.error);

    // Immediately clear local state and redirect
    clearAuth();
    router.push("/");
    router.refresh();
    
    toast.success(t("logoutSuccess"));
  };

  return (
    <Button
      onClick={handleLogout}
      variant="destructive"
      size={size}
      className="w-full mt-2"
    >
      <LogOut className={isRtl ? "ml-2 h-4 w-4" : "mr-2 h-4 w-4"} /> 
      {t("logout")}
    </Button>
  );
};

export default LogoutBtn;

