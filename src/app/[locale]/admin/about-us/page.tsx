import { getAboutUs } from "@/lib/actions";
import { getTranslations } from "next-intl/server";
import { AboutUsForm } from "@/components/admin/about-us/AboutUsForm";

export default async function AdminAboutUsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const aboutUsResponse = await getAboutUs(locale);

  const initialData = aboutUsResponse.ok && aboutUsResponse.data?.success 
    ? aboutUsResponse.data.data 
    : null;

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">About Us Content</h2>
      </div>
      <div className="mx-auto mt-6 w-full space-y-6">
         <AboutUsForm initialData={initialData} />
      </div>
    </div>
  );
}
