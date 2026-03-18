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

async function fetchSettings() {
  const settingsRes = await getSettings();
  return settingsRes.ok ? settingsRes.data?.data ?? null : null;
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await fetchSettings();

  return {
    title: settings?.metaTitle || settings?.siteName || "Car Auction",
    description: settings?.metaDescription || "Browse our wide range of heavy machinery solutions.",
    keywords: settings?.metaKeywords || "machinery, heavy equipment, auction",
    openGraph: {
      title: settings?.metaTitle || settings?.siteName || "Car Auction",
      description: settings?.metaDescription || "Providing high-performance heavy machinery solutions worldwide.",
      images: settings?.metaImage ? [settings.metaImage] : ["/hero-egypt.jpg"],
    },
    icons: {
      icon: settings?.siteLogo || "/favicon.ico",
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await fetchSettings();

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
