"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/stores/user";
import { LayoutDashboard, Settings, User as UserIcon } from "lucide-react";
import Link from "next/link";
import LogoutBtn from "./LogoutBtn";

const UserAvatar = () => {
  const { user } = useAuthStore();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center gap-2 cursor-pointer outline-none">
          <Avatar className="lg:size-10 size-8 border-2 border-transparent hover:border-red-600 transition-all">
            <AvatarImage src={user?.avatar || ""} className="object-cover" />
            <AvatarFallback className="bg-red-700 text-white font-bold">
              {user?.name?.charAt(0).toUpperCase()}
              {user?.name?.charAt(1).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="hidden lg:block text-neutral-800">
            <p className="text-sm font-bold leading-tight">
              {user?.name}
            </p>
            <p className="text-[10px] text-red-600 font-black uppercase tracking-widest">
              {user?.role}
            </p>
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 p-2">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-bold leading-none">{user?.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup className="space-y-1">
          {user?.role === "Admin" && (
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link href={"/admin"} className="flex items-center gap-2 w-full">
                <LayoutDashboard className="size-4 text-red-600" />
                <span className="font-semibold">Dashboard</span>
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link href={"/profile"} className="flex items-center gap-2 w-full">
              <UserIcon className="size-4" />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link href={"/profile"} className="flex items-center gap-2 w-full">
              <Settings className="size-4" />
              <span>Settings</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <div className="pt-1">
          <LogoutBtn />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserAvatar;
