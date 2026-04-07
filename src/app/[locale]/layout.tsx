import QueryProvider from "@/components/providers/query-provider";
import CurrencyInitializer from "@/components/shared/CurrencyInitializer";
import { DynamicHead } from "@/components/shared/DynamicHead";
import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";
import SettingsInitializer from "@/components/shared/SettingsInitializer";
import WhatsAppButton from "@/components/shared/WhatsAppButton";
import { routing } from "@/i18n/routing";
import { getCurrencyRates, getSettings } from "@/lib/actions";
import { getLocalizedValue } from "@/lib/utils";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Inter } from "next/font/google";
import { notFound } from "next/navigation";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "sonner";
import "../globals.css";

const inter = Inter({ subsets: ["latin"] });

async function fetchSettings() {
  const settingsRes = await getSettings();
  return settingsRes.ok ? (settingsRes.data?.data ?? null) : null;
}

async function fetchCurrencyRates(): Promise<Record<string, number>> {
  const res = await getCurrencyRates();
  if (!res.ok || !res.data?.data) return { USD: 1 };
  const filtered: Record<string, number> = {};
  Object.entries(res.data.data).forEach(([k, v]) => {
    if (k !== "updated_at" && typeof v === "number") filtered[k] = v;
  });
  return filtered;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const settings = await fetchSettings();
  
  const siteName = getLocalizedValue(settings, "siteName", locale) || "Car Auction";

  return {
    title: {
      default: siteName,
      template: `%s | ${siteName}`,
    },
    description:
      getLocalizedValue(settings, "metaDescription", locale) ||
      "Browse our wide range of heavy machinery solutions.",
    keywords: getLocalizedValue(settings, "metaKeywords", locale) || "machinery, heavy equipment, auction",
    openGraph: {
      title: siteName,
      description:
        getLocalizedValue(settings, "metaDescription", locale) ||
        "Providing high-performance heavy machinery solutions worldwide.",
      images: settings?.metaImage ? [settings.metaImage] : ["/hero-egypt.jpg"],
    },
    icons: {
      icon: settings?.siteLogo || "/favicon.ico",
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();
  const settings = await fetchSettings();
  const currencyRates = await fetchCurrencyRates();

  const direction = locale === "ar" ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={direction}>
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages}>
          <QueryProvider>
            <NextTopLoader color="#dc2626" showSpinner={false} />
            <SettingsInitializer settings={settings} />
            <CurrencyInitializer rates={currencyRates} />
            <DynamicHead />
            <Navbar />
            {children}
            <WhatsAppButton />
            <Footer />
            <Toaster richColors position="bottom-right" />
          </QueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
