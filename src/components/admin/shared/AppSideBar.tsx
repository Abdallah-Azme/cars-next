"use client";

import Image from "next/image";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/admin/ui/sidebar";
import { cn } from "@/lib/utils";
import { LayoutPanelTop, LogOut, Truck, Users, Loader2, Settings, Info } from "lucide-react";
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
    {
      title: t("aboutUs"),
      href: "/admin/about-us",
      icon: Info,
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
    <Sidebar side={isRtl ? "right" : "left"} className="border-none shadow-xl">
      <SidebarHeader className="p-6 border-b border-neutral-100 bg-white">
        <div className={cn("flex items-center gap-4", isRtl && "flex-row-reverse")}>
          <div className="relative size-12 overflow-hidden rounded-xl border border-neutral-100 shadow-sm bg-neutral-50 p-1">
             <Image 
                src="/logo-icon.jpeg" 
                alt="logo" 
                fill 
                className="object-contain p-1" 
             />
          </div>
          <div className={cn("text-start")}>
            <h1 className="text-lg font-extrabold tracking-tight text-neutral-900 leading-none">{t("title")}</h1>
            <p className="mt-1 text-[10px] uppercase tracking-widest text-neutral-400 font-bold block">Dashboard</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-white">
        <SidebarGroup className="px-4 py-6">
          <div className={cn("px-4 py-2 mb-4", "text-start")}>
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Main Navigation</h2>
          </div>
          <SidebarMenu className="gap-2">
            {navigations.map((nav) => {
              const isActive = pathname === nav.href;
              return (
                <SidebarMenuItem key={nav.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    className={cn(
                      "group relative flex items-center gap-4 rounded-xl px-4 py-6 transition-all duration-300 ease-in-out border border-transparent",
                      isActive
                        ? "bg-red-700 text-white shadow-lg shadow-red-200 border-red-800"
                        : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900 hover:border-neutral-100",
                      "text-start"
                    )}
                  >
                    <Link href={nav.href} className="w-full h-full">
                      <nav.icon 
                        size={22} 
                        className={cn(
                          "transition-all duration-300 group-hover:scale-110",
                          isActive ? "text-white rotate-3" : "text-neutral-400 group-hover:text-red-600"
                        )} 
                      />
                      <span className="font-semibold tracking-tight text-sm">{nav.title}</span>
                      
                      {isActive && (
                        <span className={cn(
                          "absolute w-1.5 h-6 bg-white rounded-full transition-all duration-300",
                          isRtl ? "left-2" : "right-2"
                        )} />
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>      <SidebarFooter className="p-4 border-t border-neutral-100 bg-white">
        <Button 
          variant="ghost" 
          size="lg"
          className={cn(
            "w-full group flex items-center gap-4 rounded-xl px-4 py-7 text-neutral-500 hover:bg-neutral-50 hover:text-red-700 transition-all duration-300 border border-transparent hover:border-red-100", 
            "text-start"
          )}
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          <div className="flex size-10 items-center justify-center rounded-lg bg-neutral-50 group-hover:bg-red-50 transition-colors">
            {isLoggingOut ? (
              <Loader2 className="animate-spin size-5 text-red-600" />
            ) : (
              <LogOut className={cn("size-5 transition-transform group-hover:scale-110 group-hover:text-red-600", isRtl ? "rotate-180" : "")} />
            )}
          </div>
          <span className="font-bold tracking-tight">{t("logout")}</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
