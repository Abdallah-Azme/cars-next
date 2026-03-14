"use client";

import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/user";
import { UserKey, UserPlus } from "lucide-react";
import Link from "next/link";
import UserAvatar from "./UserAvatar";

export default function AuthBtns() {
  const { token, isAuthenticated } = useAuthStore();

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
          <UserKey /> Login
        </Button>
      </Link>
      <Link href={"/register"}>
        <Button size={"lg"}>
          <UserPlus /> Signup
        </Button>
      </Link>
    </div>
  );
}

