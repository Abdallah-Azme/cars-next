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
import WhatsAppButton from "@/components/shared/WhatsAppButton";
import NextTopLoader from "nextjs-toploader";

const inter = Inter({ subsets: ["latin"] });

async function fetchSettings() {
  const settingsRes = await getSettings();
  return settingsRes.ok ? settingsRes.data?.data ?? null : null;
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await fetchSettings();
  const siteName = settings?.siteName || "Car Auction";

  return {
    title: {
      default: siteName, // strictly using siteName as the meta title base
      template: `%s | ${siteName}`,
    },
    description: settings?.metaDescription || "Browse our wide range of heavy machinery solutions.",
    keywords: settings?.metaKeywords || "machinery, heavy equipment, auction",
    openGraph: {
      title: siteName,
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
          <NextTopLoader color="#dc2626" showSpinner={false} />
          <SettingsInitializer settings={settings} />
          <DynamicHead />
          <Navbar />
          {children}
          <WhatsAppButton />
          <Footer />
          <Toaster richColors position="bottom-right" />
        </QueryProvider>
      </body>
    </html>
  );
}
