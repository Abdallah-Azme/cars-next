"use client";

import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/admin/ui/sidebar";
import { AppSidebar } from "@/components/admin/shared/AppSideBar";
import { usePathname } from "next/navigation";
import DashboardProtectedRoute from "@/components/admin/shared/DashboardProtectedRoute";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Don't show sidebar on login page
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <DashboardProtectedRoute>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <main className="p-4">
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 mb-4">
               <SidebarTrigger className="-ml-1" />
            </header>
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </DashboardProtectedRoute>
  );
}
