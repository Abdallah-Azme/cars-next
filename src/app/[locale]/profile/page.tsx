import ProfilePage from "@/views/ProfilePage";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "auth.profile" });
  return {
    title: t("title"),
  };
}

export default function Page() {
  return <ProfilePage />;
}
