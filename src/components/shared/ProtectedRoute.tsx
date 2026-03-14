"use client";

import { useAuthStore } from "@/stores/user";
import type { AuthState } from "@/types/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((state:AuthState) => state.token);
  const isAuthenticated = useAuthStore((state:AuthState) => state.isAuthenticated);
  const router = useRouter();

  useEffect(() => {
    if (!token || !isAuthenticated) {
      router.replace("/login");
    }
  }, [token, isAuthenticated, router]);

  if (!token || !isAuthenticated) {
    return null; // Or a loader
  }

  return <>{children}</>;
}

