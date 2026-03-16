"use client";

import { cn } from "@/lib/utils";
import { useSettingsStore } from "@/stores/settings";
import { useAuthStore } from "@/stores/user";
import {
  Heart,
  Home,
  LayoutPanelTop,
  UserKey,
  Van
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AuthBtns from "./AuthBtns";
import { fixImageUrl } from "@/lib/utils";

const links = [
  {
    name: "Home",
    path: "/",
    icon: Home,
  },
  {
    name: "Categories",
    path: "/categories",
    icon: LayoutPanelTop,
  },
  {
    name: "Machines",
    path: "/products",
    icon: Van,
  },
  {
    name: "Favorite",
    path: "/favorites",
    icon: Heart,
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const { token, isAuthenticated } = useAuthStore();
  const settings = useSettingsStore((state) => state.settings);

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="hidden md:block   border-b bg-background sticky top-0 left-0 right-0 z-50">
        <div className="container flex items-center justify-between">
          {/* Logo */}
          <Link href={"/"} className="text-xl font-bold flex items-center gap-2">
            <img
              src={fixImageUrl(settings?.siteLogo) || "/logo-icon.jpeg"}
              alt={settings?.siteName || "logo"}
              className="size-20 object-contain"
            />
          </Link>

          {/* Links */}
          <div className="flex gap-6">
            {links.map((link) => {
              const isActive = pathname === link.path;
              return (
                <Link
                  key={link.path}
                  href={link.path}
                  className={cn(
                    "group font-medium transition-colors hover:border-b-2 hover:border-primary flex items-center gap-1 pb-1",
                    isActive && "text-primary border-b-2 border-primary",
                  )}
                >
                  <link.icon
                    size={20}
                    className={cn(
                      "transition-colors group-hover:text-red-700",
                      isActive && "text-red-700",
                    )}
                  />
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* auth btns */}
          <AuthBtns />
        </div>
      </nav>

      {/* Mobile Bottom Navbar */}
      <nav className="fixed bottom-0 left-0 right-0 md:hidden border-t bg-background z-50">
        <div className="flex justify-around items-center py-2">
          {links.map((link) => {
            const isActive = pathname === link.path;
            return (
              <Link
                key={link.path}
                href={link.path}
                className={cn(
                  "group  font-medium flex flex-col items-center hover:text-primary",
                  isActive ? "text-primary" : "text-muted-foreground",
                )}
              >
                <link.icon
                  size={20}
                  className={cn(
                    "transition-colors group-hover:text-red-700",
                    isActive && "text-red-700",
                  )}
                />
                {link.name}
              </Link>
            );
          })}

          {
            token && isAuthenticated ? (
              <Link
                key={"profile"}
                href={"/profile"}
                className={cn(
                  "group text-sm font-medium flex flex-col items-center hover:text-primary",
                  pathname === "/profile" ? "text-primary" : "text-muted-foreground",
                )}
              >
                <UserKey
                  size={20}
                  className={cn(
                    "transition-colors group-hover:text-red-700",
                    pathname === "/profile" && "text-red-700",
                  )}
                />
                Profile
              </Link>
            ) : (
              <Link
                key={"login"}
                href={"/login"}
                className={cn(
                  "group text-sm font-medium flex flex-col items-center hover:text-primary",
                  pathname === "/login" ? "text-primary" : "text-muted-foreground",
                )}
              >
                <UserKey
                  size={16}
                  className={cn(
                    "transition-colors group-hover:text-red-700",
                    pathname === "/login" && "text-red-700",
                  )}
                />
                Login
              </Link>
            )}
        </div>
      </nav>
    </>
  );
}

