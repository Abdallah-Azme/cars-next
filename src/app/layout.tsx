import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/components/providers/query-provider";
import { Toaster } from "sonner";
import Navbar from "@/components/shared/Navbar";
import { DynamicHead } from "@/components/shared/DynamicHead";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Car Auction",
  description: "Browse our wide range of heavy machinery solutions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>
          <DynamicHead />
          <Navbar />
          {children}
          <Toaster richColors position="bottom-right" />
        </QueryProvider>
      </body>
    </html>
  );
}
