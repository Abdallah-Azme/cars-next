import { getAboutUs } from "@/lib/actions";
import { getTranslations } from "next-intl/server";
import AboutUsPage from "@/views/AboutUsPage";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "AboutUs" });
  return {
    title: t("title") || "About Us",
  };
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const aboutUsResponse = await getAboutUs(locale);

  const data = aboutUsResponse.ok && aboutUsResponse.data?.success 
    ? aboutUsResponse.data.data 
    : null;

  return <AboutUsPage data={data} locale={locale} />;
}
