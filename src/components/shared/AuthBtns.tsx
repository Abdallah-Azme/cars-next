"use client";
 
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/user";
import { UserKey, UserPlus } from "lucide-react";
import { Link } from "@/i18n/routing";
import UserAvatar from "./UserAvatar";
import { useTranslations } from "next-intl";

export default function AuthBtns() {
  const { token, isAuthenticated } = useAuthStore();
  const t = useTranslations("auth.login");
  const tr = useTranslations("auth.register");

  return token && isAuthenticated ? (
    <UserAvatar />
  ) : (
    <div className="flex gap-2">
      <Link href={"/login"}>
        <Button
          variant="ghost"
          size={"lg"}
          className="hover:bg-red-700 hover:text-white"
        >
          <UserKey className="mr-2 h-4 w-4" /> {t("submit")}
        </Button>
      </Link>
      <Link href={"/register"}>
        <Button size={"lg"}>
          <UserPlus className="mr-2 h-4 w-4" /> {tr("submit")}
        </Button>
      </Link>
    </div>
  );
}

