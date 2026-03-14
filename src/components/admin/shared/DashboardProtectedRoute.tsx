"use client";

import { useAuthStore } from "@/stores/user";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useEffect, useState } from "react";

export default function DashboardProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((state) => state.token);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (mounted) {
      if (!token || !isAuthenticated || (user && user.role !== "Admin")) {
        if (isAuthenticated && user && user.role !== "Admin") {
          toast.error("Access Denied", {
            description: "Admins only.",
          });
        }
        router.replace("/admin/login");
      }
    }
  }, [mounted, token, isAuthenticated, user, router]);

  if (!mounted) return null;
  if (!token || !isAuthenticated || (user && user.role !== "Admin")) return null;

  return <>{children}</>;
}
