import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/components/providers/query-provider";
import { Toaster } from "sonner";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { DynamicHead } from "@/components/shared/DynamicHead";
import { getSettings } from "@/lib/actions";
import SettingsInitializer from "@/components/shared/SettingsInitializer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Car Auction",
  description: "Browse our wide range of heavy machinery solutions.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settingsRes = await getSettings();
  const settings = settingsRes.ok ? settingsRes.data?.data : null;

  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>
          <SettingsInitializer settings={settings} />
          <DynamicHead />
          <Navbar />
          {children}
          <Footer />
          <Toaster richColors position="bottom-right" />
        </QueryProvider>
      </body>
    </html>
  );
}
