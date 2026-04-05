"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenuItem,
} from "@/components/admin/ui/sidebar";
import { cn } from "@/lib/utils";
import { LayoutPanelTop, LogOut, Truck, Users, Loader2, Settings } from "lucide-react";
import { Link } from "@/i18n/routing";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { logout } from "@/lib/actions";
import { useAuthStore } from "@/stores/user";
import { toast } from "sonner";
import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";

export function AppSidebar() {
  const locale = useLocale();
  const t = useTranslations("admin.sidebar");
  const isRtl = locale === 'ar';
  
  const pathname = usePathname();
  const router = useRouter();
  const clearAuth = useAuthStore((state) => state.logout);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const navigations = [
    {
      title: t("auctions"),
      href: "/admin",
      icon: Truck,
    },
    {
      title: t("parentCategories"),
      href: "/admin/parent-categories",
      icon: LayoutPanelTop,
    },
    {
      title: t("categories"),
      href: "/admin/categories",
      icon: LayoutPanelTop,
    },
    {
      title: t("users"),
      href: "/admin/users",
      icon: Users,
    },
    {
      title: t("settings"),
      href: "/admin/settings",
      icon: Settings,
    },
  ];

  const handleLogout = async () => {
    setIsLoggingOut(true);
    const res = await logout();
    if (res.ok) {
        clearAuth();
        toast.success(t("logout"));
        router.replace("/admin/login");
    } else {
        toast.error(res.error || "Logout failed");
    }
    setIsLoggingOut(false);
  };

  return (
    <Sidebar side={isRtl ? "right" : "left"}>
      <SidebarHeader className={`flex flex-col items-center gap-2 border-b-2 ${isRtl ? 'text-right' : 'text-left'}`}>
        <img src="/logo-icon.jpeg" alt="logo" className="w-22" />
        <h1 className="text-xl font-bold">{t("title")}</h1>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="flex flex-col gap-2 p-4">
          {navigations.map((nav) => {
            const isActive = pathname === nav.href;
            return (
              <SidebarMenuItem key={nav.title}>
                <Link
                  href={nav.href}
                  className={cn(
                    "font-semibold flex items-center gap-2 p-2 rounded hover:bg-red-700 hover:text-white transition-colors",
                    isRtl && "flex-row-reverse text-right",
                    isActive && "bg-red-700 text-white",
                  )}
                >
                  <nav.icon size={20} className={isRtl ? "ml-2" : "mr-2"} />
                  {nav.title}
                </Link>
              </SidebarMenuItem>
            );
          })}
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t-2 p-4">
        <Button 
          variant="destructive" 
          size={"lg"} 
          className={cn("bg-red-700 w-full flex items-center gap-2", isRtl && "flex-row-reverse")}
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          {isLoggingOut ? (
            <Loader2 className="animate-spin" />
          ) : (
            <LogOut className={isRtl ? "rotate-180" : ""} />
          )}
          {t("logout")}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
