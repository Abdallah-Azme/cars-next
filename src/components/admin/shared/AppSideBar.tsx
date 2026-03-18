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
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { logout } from "@/lib/actions";
import { useAuthStore } from "@/stores/user";
import { toast } from "sonner";
import { useState } from "react";

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const clearAuth = useAuthStore((state) => state.logout);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const navigations = [
    {
      title: "Auctions",
      href: "/admin",
      icon: Truck,
    },
    {
      title: "Categories",
      href: "/admin/categories",
      icon: LayoutPanelTop,
    },
    {
      title: "Users",
      href: "/admin/users",
      icon: Users,
    },
    {
      title: "Settings",
      href: "/admin/settings",
      icon: Settings,
    },
  ];

  const handleLogout = async () => {
    setIsLoggingOut(true);
    const res = await logout();
    if (res.ok) {
        clearAuth();
        toast.success("Logged out successfully");
        router.replace("/admin/login");
    } else {
        toast.error(res.error || "Logout failed");
    }
    setIsLoggingOut(false);
  };

  return (
    <Sidebar>
      <SidebarHeader className="flex flex-col items-center gap-2 border-b-2">
        <img src="/logo-icon.jpeg" alt="logo" className="w-22" />
        <h1 className="text-xl font-bold">Cars Dashboard</h1>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="flex flex-col gap-2">
          {navigations.map((nav) => {
            const isActive = pathname === nav.href;
            return (
              <SidebarMenuItem key={nav.title}>
                <Link
                  href={nav.href}
                  className={cn(
                    "font-semibold flex items-center gap-2 p-2 rounded hover:bg-red-700 hover:text-white transition-colors",
                    isActive && "bg-red-700 text-white",
                  )}
                >
                  <nav.icon size={20} />
                  {nav.title}
                </Link>
              </SidebarMenuItem>
            );
          })}
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t-2">
        <Button 
          variant="destructive" 
          size={"lg"} 
          className="bg-red-700" 
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          {isLoggingOut ? (
            <Loader2 className="animate-spin" />
          ) : (
            <LogOut />
          )}
          Logout
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
