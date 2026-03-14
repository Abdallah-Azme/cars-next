"use client";

import { useAuthStore } from "@/stores/user";
import type { AuthState } from "@/types/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPublicRoute({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((state: AuthState) => state.token);
  const isAuthenticated = useAuthStore((state: AuthState) => state.isAuthenticated);
  const user = useAuthStore((state: AuthState) => state.user);
  const router = useRouter();

  useEffect(() => {
    if (token && isAuthenticated && user?.role === "Admin") {
        // Next.js equivalent for navigate dashboard. Adjusted to /admin depending on typical Next.js directory.
        // It was /dashboard previously, replacing with Next.js typical or preserving.
      router.replace("/admin");
    }
  }, [token, isAuthenticated, user, router]);

  if (token && isAuthenticated && user?.role === "Admin") {
    return null;
  }

  return <>{children}</>;
}
