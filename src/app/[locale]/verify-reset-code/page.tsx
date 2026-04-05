import VerifyResetCodePage from "@/views/VerifyResetCodePage";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "auth.verifyResetCode" });
  return {
    title: t("header"),
    description: t("subtitle"),
  };
}

export default function Page() {
  return <VerifyResetCodePage />;
}
