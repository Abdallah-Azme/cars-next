"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { AboutUsData } from "@/lib/actions";
import { fixImageUrl } from "@/lib/utils";
import PageHeader from "@/components/shared/PageHeader";

interface AboutUsPageProps {
  data: AboutUsData | null;
  locale: string;
}

const AboutUsPage = ({ data, locale }: AboutUsPageProps) => {
  const t = useTranslations("AboutUs");
  const isRtl = locale === "ar";
  
  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
         <h1 className="text-2xl font-bold text-neutral-800 mb-2">Information Not Available</h1>
         <p className="text-neutral-500">We could not load the About Us information at this time. Please try again later.</p>
      </div>
    );
  }

  const typedData = data as any;
  
  // Helper to get localized value handling both camelCase (from API) and snake_case
  const getLocalizedValue = (prefix: string) => {
    const capitalizedLocale = locale.charAt(0).toUpperCase() + locale.slice(1);
    return typedData[`${prefix}${capitalizedLocale}`] || typedData[`${prefix}_${locale}`];
  };

  const title = getLocalizedValue("title") || typedData.titleEn || typedData.title_en || t("title");
  const description = getLocalizedValue("description") || typedData.descriptionEn || typedData.description_en || "";

  const imageUrl = data?.image || typedData?.imageUrl;

  return (
    <>
      <PageHeader title={title} />
      
      <section className="py-16 md:py-24 bg-white relative overflow-hidden">
        {/* Dynamic Background Element */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-red-50/50 blur-3xl opacity-60 pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-neutral-100/50 blur-3xl opacity-60 pointer-events-none" />

        <div className="container px-4 md:px-8 max-w-6xl relative z-10">
          <div className={`flex flex-col lg:flex-row gap-12 lg:gap-20 items-center ${isRtl ? 'lg:flex-row-reverse' : ''}`}>
             
             {/* Left Text Content */}
             <div className={`flex-1 space-y-6 ${isRtl ? 'text-right' : 'text-left'}`}>
               <div className="space-y-4">
                 <h4 className="text-red-700 font-bold uppercase tracking-widest text-sm inline-block px-3 py-1 bg-red-50 rounded-full">
                    {t("badge")}
                 </h4>
                 <h2 className="text-4xl md:text-5xl font-black text-neutral-900 tracking-tight leading-tight">
                   {title}
                 </h2>
                 <div className="w-20 h-2 bg-red-600 rounded-full" />
               </div>
               
               <div className="prose prose-lg text-neutral-600 leading-relaxed max-w-none">
                 {description.split('\n').map((paragraph: string, index: number) => (
                    <p key={index} className="mb-4">{paragraph}</p>
                 ))}
               </div>
             </div>

             {/* Right Image */}
             {imageUrl && (
               <div className="flex-1 w-full relative">
                 <div className="relative aspect-square md:aspect-4/3 lg:aspect-square overflow-hidden rounded-3xl shadow-2xl before:absolute before:inset-0 before:bg-linear-to-t before:from-black/30 before:to-transparent before:z-10 group cursor-pointer transition-transform duration-500 hover:scale-[1.02]">
                    <Image
                      src={fixImageUrl(imageUrl)}
                      alt={title}
                      fill
                      className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                 </div>
                 {/* Decorative element */}
                 <div className={`absolute -bottom-6 ${isRtl ? '-right-6' : '-left-6'} w-32 h-32 bg-red-100 rounded-full -z-10 blur-2xl opacity-70`} />
                 <div className={`absolute -top-6 ${isRtl ? '-left-6' : '-right-6'} w-40 h-40 bg-neutral-200 rounded-full -z-10 blur-3xl opacity-50`} />
               </div>
             )}
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutUsPage;
