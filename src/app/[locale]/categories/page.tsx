import CategoriesPage from "@/views/CategoriesPage";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Vehicle.categoriesPage" });
  return {
    title: t("title"),
  };
}

export default function Page() {
  return <CategoriesPage />;
}
