"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "@/stores/user";
import Link from "next/link";
import LogoutBtn from "./LogoutBtn";

const UserAvatar = () => {
  const { user } = useAuthStore();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center gap-2 cursor-pointer">
          <Avatar className="lg:size-10 size-8">
            <AvatarImage src={user?.avatar || ""} className="object-cover" />
            <AvatarFallback className="bg-red-700 text-white">
              {user?.name?.charAt(0).toUpperCase()}{" "}
              {user?.name?.charAt(1).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="hidden lg:block text-white">
            <p className="text-sm font-medium">{user?.name}</p>
            <p className="text-xs text-red-700 capitalize">{user?.role}</p>
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuItem asChild>
            <Link href={"/profile"}>Profile</Link>
          </DropdownMenuItem>
          <LogoutBtn />
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserAvatar;

