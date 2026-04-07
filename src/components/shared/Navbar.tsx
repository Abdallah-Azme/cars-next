"use client";

import { cn } from "@/lib/utils";
import { useSettingsStore } from "@/stores/settings";
import { useAuthStore } from "@/stores/user";
import {
  Heart,
  Home,
  UserKey,
  Van
} from "lucide-react";
import { Link, usePathname } from "@/i18n/routing";
import AuthBtns from "./AuthBtns";
import FallbackImage from "./FallbackImage";
import LanguageSwitcher from "./LanguageSwitcher";
import CurrencySwitcher from "./CurrencySwitcher";
import { useTranslations } from 'next-intl';

export default function Navbar() {
  const t = useTranslations('Navbar');
  const pathname = usePathname();
  const { token, isAuthenticated } = useAuthStore();
  const settings = useSettingsStore((state) => state.settings);

  const links = [
    {
      name: t('home'),
      path: "/",
      icon: Home,
    },
    {
      name: t('machines'),
      path: "/products",
      icon: Van,
    },
    {
      name: t('favorites'),
      path: "/favorites",
      icon: Heart,
    },
  ];

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="hidden md:block border-b bg-background sticky top-0 left-0 right-0 z-50">
        <div className="container flex items-center justify-between">
          {/* Logo */}
          <Link href={"/"} className="text-xl font-bold flex items-center gap-2">
            <FallbackImage 
              src={settings?.siteLogo || "/logo-icon.jpeg"}
              alt={settings?.siteName && !settings.siteName.includes("site_nan") ? settings.siteName : "Car Auction"}
              width={80}
              height={80}
              className="size-20 object-contain"
              priority
            />
            {settings?.siteName && !settings.siteName.includes("site_nan") && (
              <span className="hidden lg:block">{settings.siteName}</span>
            )}
            {(!settings?.siteName || settings.siteName.includes("site_nan")) && (
              <span className="hidden lg:block text-2xl font-black italic tracking-tighter uppercase">{t('siteName')}</span>
            )}
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
                    "group font-medium transition-colors hover:border-primary flex items-center gap-1 pb-1 relative",
                    isActive && "text-primary after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary",
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

          {/* auth btns & i18n */}
          <div className="flex items-center gap-4">
            <CurrencySwitcher />
            <LanguageSwitcher />
            <AuthBtns />
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navbar */}
      <nav className="fixed bottom-0 left-0 right-0 md:hidden border-t bg-background z-50">
        <div className="flex justify-around items-center py-2 relative">
          <div className="absolute flex gap-2 -top-12 right-4">
             <CurrencySwitcher />
             <LanguageSwitcher />
          </div>

          {links.map((link) => {
            const isActive = pathname === link.path;
            return (
              <Link
                key={link.path}
                href={link.path}
                className={cn(
                  "group font-medium flex flex-col items-center hover:text-primary",
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
                <span className="text-[10px]">{link.name}</span>
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
                <span className="text-[10px]">{t('profile')}</span>
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
                <span className="text-[10px]">{t('login')}</span>
              </Link>
            )}
        </div>
      </nav>
    </>
  );
}

