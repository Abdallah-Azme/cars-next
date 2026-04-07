"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { SettingsResponse } from "@/types/settings";
import { updateSettings } from "@/lib/actions";
import { fixImageUrl } from "@/lib/utils";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Textarea } from "../ui/textarea";
import Image from "next/image";
import {
  Trash2,
  Plus,
  Loader2,
  Phone,
  Mail,
  Share2,
  BarChart3,
  Rocket,
  Settings as SettingsIcon,
  Search
} from "lucide-react";
import { useState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";

interface SettingsFormProps {
  initialData: SettingsResponse["data"];
  onUpdate: () => void;
}

export function SettingsForm({ initialData, onUpdate }: SettingsFormProps) {
  const locale = useLocale();
  const t = useTranslations("admin.settings");
  const isRtl = locale === 'ar';
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("general");

  const statisticSchema = z.object({
    id: z.number().optional(),
    value: z.string().min(1, t("stats.valueLabel")),
    labelAr: z.string().min(1, "Required"),
    labelEn: z.string().min(1, "Required"),
    labelJp: z.string().min(1, "Required"),
    labelSw: z.string().min(1, "Required"),
  });

  const settingsSchema = z.object({
    siteNameAr: z.string().nullable(),
    siteNameEn: z.string().nullable(),
    siteNameJp: z.string().nullable(),
    siteNameSw: z.string().nullable(),
    siteLogo: z.instanceof(typeof window !== 'undefined' ? FileList : Object).optional(),
    metaTitleAr: z.string().nullable(),
    metaTitleEn: z.string().nullable(),
    metaTitleJp: z.string().nullable(),
    metaTitleSw: z.string().nullable(),
    metaDescriptionAr: z.string().nullable(),
    metaDescriptionEn: z.string().nullable(),
    metaDescriptionJp: z.string().nullable(),
    metaDescriptionSw: z.string().nullable(),
    metaKeywordsAr: z.string().nullable(),
    metaKeywordsEn: z.string().nullable(),
    metaKeywordsJp: z.string().nullable(),
    metaKeywordsSw: z.string().nullable(),
    metaImage: z.instanceof(typeof window !== 'undefined' ? FileList : Object).optional(),
    heroTitleAr: z.string().nullable(),
    heroTitleEn: z.string().nullable(),
    heroTitleJp: z.string().nullable(),
    heroTitleSw: z.string().nullable(),
    heroDescriptionAr: z.string().nullable(),
    heroDescriptionEn: z.string().nullable(),
    heroDescriptionJp: z.string().nullable(),
    heroDescriptionSw: z.string().nullable(),
    heroImage: z.instanceof(typeof window !== 'undefined' ? FileList : Object).optional(),
    heroButton1Link: z.string().nullable().or(z.literal("")),
    heroButton2Link: z.string().nullable().or(z.literal("")),
    email: z.string().email().nullable().or(z.literal("")),
    phone: z.string().nullable(),
    addressAr: z.string().nullable(),
    addressEn: z.string().nullable(),
    addressJp: z.string().nullable(),
    addressSw: z.string().nullable(),
    facebook: z.string().nullable().or(z.literal("")),
    twitter: z.string().nullable().or(z.literal("")),
    instagram: z.string().nullable().or(z.literal("")),
    linkedin: z.string().nullable().or(z.literal("")),
    youtube: z.string().nullable().or(z.literal("")),
    tiktok: z.string().nullable().or(z.literal("")),
    snapchat: z.string().nullable().or(z.literal("")),
    pinterest: z.string().nullable().or(z.literal("")),
    whatsapp: z.string().nullable().or(z.literal("")),
    telegram: z.string().nullable().or(z.literal("")),
    statisticsHeadingAr: z.string().nullable(),
    statisticsHeadingEn: z.string().nullable(),
    statisticsHeadingJp: z.string().nullable(),
    statisticsHeadingSw: z.string().nullable(),
    statisticsDescriptionAr: z.string().nullable(),
    statisticsDescriptionEn: z.string().nullable(),
    statisticsDescriptionJp: z.string().nullable(),
    statisticsDescriptionSw: z.string().nullable(),
    statistics: z.array(statisticSchema),
  });

  type SettingsFormValues = z.infer<typeof settingsSchema>;

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      ...(initialData as unknown as SettingsFormValues),
      siteLogo: undefined,
      metaImage: undefined,
      heroImage: undefined,
      siteNameAr: initialData.siteNameAr || "",
      siteNameEn: initialData.siteNameEn || "",
      siteNameJp: initialData.siteNameJp || "",
      siteNameSw: initialData.siteNameSw || "",
      metaTitleAr: initialData.metaTitleAr || "",
      metaTitleEn: initialData.metaTitleEn || "",
      metaTitleJp: initialData.metaTitleJp || "",
      metaTitleSw: initialData.metaTitleSw || "",
      metaDescriptionAr: initialData.metaDescriptionAr || "",
      metaDescriptionEn: initialData.metaDescriptionEn || "",
      metaDescriptionJp: initialData.metaDescriptionJp || "",
      metaDescriptionSw: initialData.metaDescriptionSw || "",
      metaKeywordsAr: initialData.metaKeywordsAr || "",
      metaKeywordsEn: initialData.metaKeywordsEn || "",
      metaKeywordsJp: initialData.metaKeywordsJp || "",
      metaKeywordsSw: initialData.metaKeywordsSw || "",
      phone: initialData.phone || "",
      addressAr: initialData.addressAr || "",
      addressEn: initialData.addressEn || "",
      addressJp: initialData.addressJp || "",
      addressSw: initialData.addressSw || "",
      email: initialData.email || "",
      heroTitleAr: initialData.heroTitleAr || "",
      heroTitleEn: initialData.heroTitleEn || "",
      heroTitleJp: initialData.heroTitleJp || "",
      heroTitleSw: initialData.heroTitleSw || "",
      heroDescriptionAr: initialData.heroDescriptionAr || "",
      heroDescriptionEn: initialData.heroDescriptionEn || "",
      heroDescriptionJp: initialData.heroDescriptionJp || "",
      heroDescriptionSw: initialData.heroDescriptionSw || "",
      heroButton1Link: initialData.heroButton1Link || "",
      heroButton2Link: initialData.heroButton2Link || "",
      facebook: initialData.facebook || "",
      twitter: initialData.twitter || "",
      instagram: initialData.instagram || "",
      linkedin: initialData.linkedin || "",
      youtube: initialData.youtube || "",
      tiktok: initialData.tiktok || "",
      snapchat: initialData.snapchat || "",
      pinterest: initialData.pinterest || "",
      whatsapp: initialData.whatsapp || "",
      telegram: initialData.telegram || "",
      statisticsHeadingAr: initialData.statisticsHeadingAr || "",
      statisticsHeadingEn: initialData.statisticsHeadingEn || "",
      statisticsHeadingJp: initialData.statisticsHeadingJp || "",
      statisticsHeadingSw: initialData.statisticsHeadingSw || "",
      statisticsDescriptionAr: initialData.statisticsDescriptionAr || "",
      statisticsDescriptionEn: initialData.statisticsDescriptionEn || "",
      statisticsDescriptionJp: initialData.statisticsDescriptionJp || "",
      statisticsDescriptionSw: initialData.statisticsDescriptionSw || "",
      statistics: initialData.statistics.map(s => ({
        id: s.id,
        value: s.value,
        labelAr: s.labelAr || "",
        labelEn: s.labelEn || "",
        labelJp: s.labelJp || "",
        labelSw: s.labelSw || "",
      }))
    },
  });

  useEffect(() => {
    reset({
      ...(initialData as unknown as SettingsFormValues),
      siteLogo: undefined,
      metaImage: undefined,
      heroImage: undefined,
      siteNameAr: initialData.siteNameAr || "",
      siteNameEn: initialData.siteNameEn || "",
      siteNameJp: initialData.siteNameJp || "",
      siteNameSw: initialData.siteNameSw || "",
      metaTitleAr: initialData.metaTitleAr || "",
      metaTitleEn: initialData.metaTitleEn || "",
      metaTitleJp: initialData.metaTitleJp || "",
      metaTitleSw: initialData.metaTitleSw || "",
      metaDescriptionAr: initialData.metaDescriptionAr || "",
      metaDescriptionEn: initialData.metaDescriptionEn || "",
      metaDescriptionJp: initialData.metaDescriptionJp || "",
      metaDescriptionSw: initialData.metaDescriptionSw || "",
      metaKeywordsAr: initialData.metaKeywordsAr || "",
      metaKeywordsEn: initialData.metaKeywordsEn || "",
      metaKeywordsJp: initialData.metaKeywordsJp || "",
      metaKeywordsSw: initialData.metaKeywordsSw || "",
      phone: initialData.phone || "",
      addressAr: initialData.addressAr || "",
      addressEn: initialData.addressEn || "",
      addressJp: initialData.addressJp || "",
      addressSw: initialData.addressSw || "",
      email: initialData.email || "",
      heroTitleAr: initialData.heroTitleAr || "",
      heroTitleEn: initialData.heroTitleEn || "",
      heroTitleJp: initialData.heroTitleJp || "",
      heroTitleSw: initialData.heroTitleSw || "",
      heroDescriptionAr: initialData.heroDescriptionAr || "",
      heroDescriptionEn: initialData.heroDescriptionEn || "",
      heroDescriptionJp: initialData.heroDescriptionJp || "",
      heroDescriptionSw: initialData.heroDescriptionSw || "",
      heroButton1Link: initialData.heroButton1Link || "",
      heroButton2Link: initialData.heroButton2Link || "",
      facebook: initialData.facebook || "",
      twitter: initialData.twitter || "",
      instagram: initialData.instagram || "",
      linkedin: initialData.linkedin || "",
      youtube: initialData.youtube || "",
      tiktok: initialData.tiktok || "",
      snapchat: initialData.snapchat || "",
      pinterest: initialData.pinterest || "",
      whatsapp: initialData.whatsapp || "",
      telegram: initialData.telegram || "",
      statisticsHeadingAr: initialData.statisticsHeadingAr || "",
      statisticsHeadingEn: initialData.statisticsHeadingEn || "",
      statisticsHeadingJp: initialData.statisticsHeadingJp || "",
      statisticsHeadingSw: initialData.statisticsHeadingSw || "",
      statisticsDescriptionAr: initialData.statisticsDescriptionAr || "",
      statisticsDescriptionEn: initialData.statisticsDescriptionEn || "",
      statisticsDescriptionJp: initialData.statisticsDescriptionJp || "",
      statisticsDescriptionSw: initialData.statisticsDescriptionSw || "",
      statistics: initialData.statistics.map(s => ({
        id: s.id,
        value: s.value,
        labelAr: s.labelAr || "",
        labelEn: s.labelEn || "",
        labelJp: s.labelJp || "",
        labelSw: s.labelSw || "",
      }))
    });
  }, [initialData, reset]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "statistics",
  });

  const onSubmit = async (values: SettingsFormValues) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();

      const appendSnakeCase = (key: string, value: unknown) => {
        const snakeKey = key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
        if (value instanceof FileList) {
          if (value.length > 0) {
            formData.append(snakeKey, value[0]);
          }
        } else if (value !== null && value !== undefined) {
           formData.append(snakeKey, String(value));
        }
      };

      Object.entries(values).forEach(([key, value]) => {
        if (key !== "statistics") {
          appendSnakeCase(key, value);
        }
      });

      values.statistics.forEach((stat, index) => {
        if (stat.id) formData.append(`statistics[${index}][id]`, stat.id.toString());
        formData.append(`statistics[${index}][value]`, stat.value);
        formData.append(`statistics[${index}][label_ar]`, stat.labelAr || "");
        formData.append(`statistics[${index}][label_en]`, stat.labelEn || "");
        formData.append(`statistics[${index}][label_jp]`, stat.labelJp || "");
        formData.append(`statistics[${index}][label_sw]`, stat.labelSw || "");
      });

      const res = await updateSettings(formData);
      if (res.ok) {
        toast.success(t("success"));
        onUpdate();
      } else {
        toast.error(res.error || t("failed"));
      }
    } catch (error) {
      toast.error(t("failed"));
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const socialPlatforms = [
    "facebook", "twitter", "instagram", "linkedin", "youtube", 
    "tiktok", "snapchat", "pinterest", "whatsapp", "telegram"
  ] as const;

  const languages = [
    { code: 'Ar', name: 'Arabic', flag: '🇸🇦' },
    { code: 'En', name: 'English', flag: '🇺🇸' },
    { code: 'Jp', name: 'Japanese', flag: '🇯🇵' },
    { code: 'Sw', name: 'Swahili', flag: '🇰🇪' }
  ];

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <form onSubmit={handleSubmit(onSubmit as any)} className={`space-y-8 text-start`}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className={`grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-6 mb-8`}>
          <TabsTrigger value="general" className="gap-2">
            <SettingsIcon className="size-4" /> {t("tabs.general")}
          </TabsTrigger>
          <TabsTrigger value="seo" className="gap-2">
            <Search className="size-4" /> {t("tabs.seo")}
          </TabsTrigger>
          <TabsTrigger value="hero" className="gap-2">
            <Rocket className="size-4" /> {t("tabs.hero")}
          </TabsTrigger>
          <TabsTrigger value="contact" className="gap-2">
            <Mail className="size-4" /> {t("tabs.contact")}
          </TabsTrigger>
          <TabsTrigger value="social" className="gap-2">
            <Share2 className="size-4" /> {t("tabs.social")}
          </TabsTrigger>
          <TabsTrigger value="statistics" className="gap-2">
            <BarChart3 className="size-4" /> {t("tabs.stats")}
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <Card>
            <CardHeader className="text-start">
              <CardTitle>{t("general.title")}</CardTitle>
              <CardDescription>{t("general.description")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {languages.map(lang => (
                  <div key={lang.code} className="grid gap-2">
                    <Label htmlFor={`siteName${lang.code}`} className="text-start">
                      {t("general.siteName")} ({lang.name}) {lang.flag}
                    </Label>
                    <Input 
                        id={`siteName${lang.code}`} 
                        {...register(`siteName${lang.code}` as keyof SettingsFormValues)} 
                        placeholder={`${t("general.siteName")} (${lang.name})`} 
                        className="text-start"
                    />
                  </div>
                ))}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="siteLogo" className="text-start">{t("general.siteLogo")}</Label>
                {initialData.siteLogo && (
                  <div className={`mb-2 flex ${isRtl ? 'justify-end' : ''}`}>
                    <div className="relative h-20 w-40 rounded border p-1 bg-white">
                      <Image 
                        src={fixImageUrl(initialData.siteLogo)} 
                        alt="Current Logo" 
                        fill
                        className="object-contain p-1"
                        sizes="160px"
                      />
                    </div>
                  </div>
                )}
                <Input id="siteLogo" type="file" accept="image/*" {...register("siteLogo")} className="text-start" />
                <p className={`text-xs text-muted-foreground `}>{t("general.logoHint")}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SEO Settings */}
        <TabsContent value="seo">
          <Card>
            <CardHeader className="text-start">
              <CardTitle>{t("seo.title")}</CardTitle>
              <CardDescription>{t("seo.description")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
               <Tabs defaultValue="Ar">
                  <TabsList className="mb-4">
                     {languages.map(lang => (
                        <TabsTrigger key={lang.code} value={lang.code}>{lang.flag} {lang.name}</TabsTrigger>
                     ))}
                  </TabsList>
                  {languages.map(lang => (
                     <TabsContent key={lang.code} value={lang.code} className="space-y-4">
                        <div className="grid gap-2">
                           <Label htmlFor={`metaTitle${lang.code}`} className="text-start">{t("seo.metaTitle")}</Label>
                           <Input id={`metaTitle${lang.code}`} {...register(`metaTitle${lang.code}` as keyof SettingsFormValues)} placeholder={t("seo.metaTitle")} className="text-start" />
                        </div>
                        <div className="grid gap-2">
                           <Label htmlFor={`metaDescription${lang.code}`} className="text-start">{t("seo.metaDescription")}</Label>
                           <Textarea id={`metaDescription${lang.code}`} {...register(`metaDescription${lang.code}` as keyof SettingsFormValues)} placeholder={t("seo.metaDescription")} className="text-start" />
                        </div>
                        <div className="grid gap-2">
                           <Label htmlFor={`metaKeywords${lang.code}`} className="text-start">{t("seo.metaKeywords")}</Label>
                           <Input id={`metaKeywords${lang.code}`} {...register(`metaKeywords${lang.code}` as keyof SettingsFormValues)} placeholder="keyword1, keyword2, ..." className="text-start" />
                        </div>
                     </TabsContent>
                  ))}
               </Tabs>
              <div className="grid gap-2">
                <Label htmlFor="metaImage" className="text-start">{t("seo.metaImage")}</Label>
                {initialData.metaImage && (
                    <div className={`mb-2 flex ${isRtl ? 'justify-end' : ''}`}>
                      <div className="relative h-32 w-64 rounded border p-1 bg-white">
                        <Image 
                          src={fixImageUrl(initialData.metaImage)} 
                          alt="Current Meta Image" 
                          fill
                          className="object-cover rounded"
                          sizes="256px"
                        />
                      </div>
                    </div>
                )}
                <Input id="metaImage" type="file" accept="image/*" {...register("metaImage")} className="text-start" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Hero Settings */}
        <TabsContent value="hero">
          <Card>
            <CardHeader className="text-start">
              <CardTitle>{t("hero.title")}</CardTitle>
              <CardDescription>{t("hero.description")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <Tabs defaultValue="Ar">
                  <TabsList className="mb-4">
                     {languages.map(lang => (
                        <TabsTrigger key={lang.code} value={lang.code}>{lang.flag} {lang.name}</TabsTrigger>
                     ))}
                  </TabsList>
                  {languages.map(lang => (
                     <TabsContent key={lang.code} value={lang.code} className="space-y-4">
                        <div className="grid gap-2">
                           <Label htmlFor={`heroTitle${lang.code}`} className="text-start">{t("hero.heroTitle")}</Label>
                           <Input id={`heroTitle${lang.code}`} {...register(`heroTitle${lang.code}` as keyof SettingsFormValues)} className="text-start" />
                        </div>
                        <div className="grid gap-2">
                           <Label htmlFor={`heroDescription${lang.code}`} className="text-start">{t("hero.heroDescription")}</Label>
                           <Textarea id={`heroDescription${lang.code}`} {...register(`heroDescription${lang.code}` as keyof SettingsFormValues)} className="text-start" />
                        </div>
                     </TabsContent>
                  ))}
               </Tabs>

              <div className={`grid grid-cols-1 md:grid-cols-2 gap-4`}>
                <div className="grid gap-2">
                  <Label htmlFor="heroButton1Link" className="text-start">{t("hero.button1")}</Label>
                  <Input id="heroButton1Link" {...register("heroButton1Link")} placeholder="/contact-us" className="text-start" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="heroButton2Link" className="text-start">{t("hero.button2")}</Label>
                  <Input id="heroButton2Link" {...register("heroButton2Link")} placeholder="/request-quote" className="text-start" />
                </div>
              </div>

               <div className="grid gap-2">
                <Label htmlFor="heroImage" className="text-start">{t("hero.heroImage") || "Hero Image"}</Label>
                {initialData.heroImage && (
                    <div className={`mb-2 flex ${isRtl ? 'justify-end' : ''}`}>
                      <div className="relative h-32 w-64 rounded border p-1 bg-white">
                        <Image 
                          src={fixImageUrl(initialData.heroImage)} 
                          alt="Current Hero Image" 
                          fill
                          className="object-cover rounded"
                          sizes="256px"
                        />
                      </div>
                    </div>
                )}
                <Input id="heroImage" type="file" accept="image/*" {...register("heroImage")} className="text-start" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>


        {/* Contact Settings */}
        <TabsContent value="contact">
          <Card>
            <CardHeader className="text-start">
              <CardTitle>{t("contact.title")}</CardTitle>
              <CardDescription>{t("contact.description")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-2">
                <Label htmlFor="email" className={`flex items-center gap-2`}><Mail className="size-4" /> {t("contact.email")}</Label>
                <Input id="email" {...register("email")} placeholder="contact@example.com" className="text-start" />
                {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone" className={`flex items-center gap-2`}><Phone className="size-4" /> {t("contact.phone")}</Label>
                <Input id="phone" {...register("phone")} placeholder="0123456789" className="text-start" />
              </div>

              <div className="border-t pt-4">
                 <Label className={`mb-4 block `}>{t("contact.address")}</Label>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {languages.map(lang => (
                       <div key={lang.code} className="grid gap-2">
                          <Label htmlFor={`address${lang.code}`} className="text-start">{lang.name} {lang.flag}</Label>
                          <Input id={`address${lang.code}`} {...register(`address${lang.code}` as keyof SettingsFormValues)} placeholder={`${t("contact.address")} (${lang.name})`} className="text-start" />
                       </div>
                    ))}
                 </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Social Links */}
        <TabsContent value="social">
          <Card>
            <CardHeader className="text-start">
              <CardTitle>{t("social.title")}</CardTitle>
              <CardDescription>{t("social.description")}</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {socialPlatforms.map((platform) => (
                <div key={platform} className={`grid gap-2 capitalize `}>
                  <Label htmlFor={platform} className="text-start">{platform}</Label>
                  <Input id={platform} {...register(platform)} placeholder={`https://${platform}.com/yourprofile`} className="text-start" />
                  {errors[platform] && (
                    <p className="text-sm text-destructive">{errors[platform]?.message}</p>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Statistics */}
        <TabsContent value="statistics">
          <Card>
            <CardHeader className="text-start">
              <CardTitle>{t("stats.title")}</CardTitle>
              <CardDescription>{t("stats.description")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
               <Tabs defaultValue="Ar">
                  <TabsList className="mb-4">
                     {languages.map(lang => (
                        <TabsTrigger key={lang.code} value={lang.code}>{lang.flag} {lang.name}</TabsTrigger>
                     ))}
                  </TabsList>
                  {languages.map(lang => (
                     <TabsContent key={lang.code} value={lang.code} className="space-y-4">
                        <div className="grid gap-2">
                           <Label htmlFor={`statisticsHeading${lang.code}`} className="text-start">{t("stats.heading")}</Label>
                           <Input id={`statisticsHeading${lang.code}`} {...register(`statisticsHeading${lang.code}` as keyof SettingsFormValues)} className="text-start" />
                        </div>
                        <div className="grid gap-2">
                           <Label htmlFor={`statisticsDescription${lang.code}`} className="text-start">{t("stats.subtext")}</Label>
                           <Textarea id={`statisticsDescription${lang.code}`} {...register(`statisticsDescription${lang.code}` as keyof SettingsFormValues)} className="text-start" />
                        </div>
                     </TabsContent>
                  ))}
               </Tabs>

              <div className="space-y-4 pt-4">
                <div className={`flex items-center justify-between`}>
                  <Label className="text-start">{t("stats.addItem")}</Label>
                  <Button type="button" variant="outline" size="sm" onClick={() => append({ value: "", labelAr: "", labelEn: "", labelJp: "", labelSw: "" })}>
                    <Plus className={`me-2 size-4`} /> {t("stats.addItem")}
                  </Button>
                </div>
                
                <div className="grid gap-6">
                  {fields.map((field, index) => (
                    <div key={field.id} className={`flex flex-col gap-4 p-4 border rounded-lg bg-muted/30 relative`}>
                      <Button 
                        type="button" 
                        variant="destructive" 
                        size="icon" 
                        className={`absolute top-2 ${isRtl ? 'left-2' : 'right-2'}`} 
                        onClick={() => remove(index)}
                       >
                        <Trash2 className="size-4" />
                      </Button>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div className="grid gap-2">
                           <Label className="text-start">{t("stats.valueLabel")}</Label>
                           <Input {...register(`statistics.${index}.value` as const)} placeholder="150+" className="text-start" />
                         </div>
                         <div className="grid gap-2 grid-cols-2">
                            {languages.map(lang => (
                               <div key={lang.code} className="grid gap-1">
                                  <Label className={`text-[10px] `}>{lang.name} {lang.flag}</Label>
                                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                  <Input {...register(`statistics.${index}.label${lang.code}` as any)} placeholder={lang.name} className={`h-8 text-xs `} />
                               </div>
                            ))}
                         </div>
                      </div>
                    </div>
                  ))}
                  {fields.length === 0 && (
                    <p className="text-center py-4 text-muted-foreground">{t("stats.noItems")}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className={`flex items-center border-t pt-6 ${isRtl ? 'justify-start' : 'justify-end'}`}>
        <Button type="submit" size="lg" className="bg-red-700 hover:bg-red-800 font-bold" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className={`me-2 h-4 w-4 animate-spin`} />}
          {isSubmitting ? t("saving") : t("saveChanges")}
        </Button>
      </div>
    </form>
  );
}

