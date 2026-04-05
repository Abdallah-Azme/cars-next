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
  MapPin,
  Share2,
  BarChart3,
  Rocket,
  Settings as SettingsIcon,
  Search
} from "lucide-react";
import { useState } from "react";
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
    label: z.string().min(1, t("stats.labelLabel")),
  });

  const settingsSchema = z.object({
    siteName: z.string().nullable(),
    siteLogo: z.instanceof(typeof window !== 'undefined' ? FileList : Object).optional(),
    metaTitle: z.string().nullable(),
    metaDescription: z.string().nullable(),
    metaKeywords: z.string().nullable(),
    metaImage: z.instanceof(typeof window !== 'undefined' ? FileList : Object).optional(),
    heroTitle: z.string().min(1, t("hero.heroTitle")),
    heroDescription: z.string().min(1, t("hero.heroDescription")),
    heroButton1Link: z.string().nullable().or(z.literal("")),
    heroButton2Link: z.string().nullable().or(z.literal("")),
    email: z.string().email().nullable().or(z.literal("")),
    phone: z.string().nullable(),
    address: z.string().nullable(),
    facebook: z.string().url().nullable().or(z.literal("")),
    twitter: z.string().url().nullable().or(z.literal("")),
    instagram: z.string().url().nullable().or(z.literal("")),
    linkedin: z.string().url().nullable().or(z.literal("")),
    youtube: z.string().url().nullable().or(z.literal("")),
    tiktok: z.string().url().nullable().or(z.literal("")),
    snapchat: z.string().url().nullable().or(z.literal("")),
    pinterest: z.string().url().nullable().or(z.literal("")),
    whatsapp: z.string().url().nullable().or(z.literal("")),
    telegram: z.string().url().nullable().or(z.literal("")),
    statisticsHeading: z.string().min(1, t("stats.heading")),
    statisticsDescription: z.string().min(1, t("stats.subtext")),
    statistics: z.array(statisticSchema),
  });

  type SettingsFormValues = z.infer<typeof settingsSchema>;

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      ...initialData,
      siteName: initialData.siteName || "",
      metaTitle: initialData.metaTitle || "",
      metaDescription: initialData.metaDescription || "",
      metaKeywords: initialData.metaKeywords || "",
      phone: initialData.phone || "",
      address: initialData.address || "",
      email: initialData.email || "",
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
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "statistics",
  });

  const onSubmit = async (values: SettingsFormValues) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();

      // Helper to map camelCase to snake_case for the API
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

      // Append all simple fields
      Object.entries(values).forEach(([key, value]) => {
        if (key !== "statistics") {
          appendSnakeCase(key, value);
        }
      });

      // Append statistics array
      values.statistics.forEach((stat, index) => {
        if (stat.id) formData.append(`statistics[${index}][id]`, stat.id.toString());
        formData.append(`statistics[${index}][value]`, stat.value);
        formData.append(`statistics[${index}][label]`, stat.label);
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={`space-y-8 ${isRtl ? 'text-right' : 'text-left'}`}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className={`grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-6 mb-8 ${isRtl ? 'flex-row-reverse' : ''}`}>
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
            <CardHeader className={isRtl ? 'text-right' : ''}>
              <CardTitle>{t("general.title")}</CardTitle>
              <CardDescription>{t("general.description")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-2">
                <Label htmlFor="siteName" className={isRtl ? 'text-right' : ''}>{t("general.siteName")}</Label>
                <Input 
                    id="siteName" 
                    {...register("siteName")} 
                    placeholder={t("general.siteName")} 
                    className={isRtl ? 'text-right' : ''}
                />
                {errors.siteName && <p className="text-sm text-destructive">{errors.siteName.message}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="siteLogo" className={isRtl ? 'text-right' : ''}>{t("general.siteLogo")}</Label>
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
                <Input id="siteLogo" type="file" accept="image/*" {...register("siteLogo")} className={isRtl ? 'text-right' : ''} />
                <p className={`text-xs text-muted-foreground ${isRtl ? 'text-right' : ''}`}>{t("general.logoHint")}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SEO Settings */}
        <TabsContent value="seo">
          <Card>
            <CardHeader className={isRtl ? 'text-right' : ''}>
              <CardTitle>{t("seo.title")}</CardTitle>
              <CardDescription>{t("seo.description")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-2">
                <Label htmlFor="metaTitle" className={isRtl ? 'text-right' : ''}>{t("seo.metaTitle")}</Label>
                <Input id="metaTitle" {...register("metaTitle")} placeholder={t("seo.metaTitle")} className={isRtl ? 'text-right' : ''} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="metaDescription" className={isRtl ? 'text-right' : ''}>{t("seo.metaDescription")}</Label>
                <Textarea id="metaDescription" {...register("metaDescription")} placeholder={t("seo.metaDescription")} className={isRtl ? 'text-right' : ''} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="metaKeywords" className={isRtl ? 'text-right' : ''}>{t("seo.metaKeywords")}</Label>
                <Input id="metaKeywords" {...register("metaKeywords")} placeholder="keyword1, keyword2, ..." className={isRtl ? 'text-right' : ''} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="metaImage" className={isRtl ? 'text-right' : ''}>{t("seo.metaImage")}</Label>
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
                <Input id="metaImage" type="file" accept="image/*" {...register("metaImage")} className={isRtl ? 'text-right' : ''} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Hero Settings */}
        <TabsContent value="hero">
          <Card>
            <CardHeader className={isRtl ? 'text-right' : ''}>
              <CardTitle>{t("hero.title")}</CardTitle>
              <CardDescription>{t("hero.description")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-2">
                <Label htmlFor="heroTitle" className={isRtl ? 'text-right' : ''}>{t("hero.heroTitle")}</Label>
                <Input id="heroTitle" {...register("heroTitle")} className={isRtl ? 'text-right' : ''} />
                {errors.heroTitle && <p className="text-sm text-destructive">{errors.heroTitle.message}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="heroDescription" className={isRtl ? 'text-right' : ''}>{t("hero.heroDescription")}</Label>
                <Textarea id="heroDescription" {...register("heroDescription")} className={isRtl ? 'text-right' : ''} />
                {errors.heroDescription && <p className="text-sm text-destructive">{errors.heroDescription.message}</p>}
              </div>
              <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${isRtl ? 'flex-row-reverse' : ''}`}>
                <div className="grid gap-2">
                  <Label htmlFor="heroButton1Link" className={isRtl ? 'text-right' : ''}>{t("hero.button1")}</Label>
                  <Input id="heroButton1Link" {...register("heroButton1Link")} placeholder="/contact-us" className={isRtl ? 'text-right' : ''} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="heroButton2Link" className={isRtl ? 'text-right' : ''}>{t("hero.button2")}</Label>
                  <Input id="heroButton2Link" {...register("heroButton2Link")} placeholder="/request-quote" className={isRtl ? 'text-right' : ''} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>


        {/* Contact Settings */}
        <TabsContent value="contact">
          <Card>
            <CardHeader className={isRtl ? 'text-right' : ''}>
              <CardTitle>{t("contact.title")}</CardTitle>
              <CardDescription>{t("contact.description")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-2">
                <Label htmlFor="email" className={`flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}><Mail className="size-4" /> {t("contact.email")}</Label>
                <Input id="email" {...register("email")} placeholder="contact@example.com" className={isRtl ? 'text-right' : ''} />
                {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone" className={`flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}><Phone className="size-4" /> {t("contact.phone")}</Label>
                <Input id="phone" {...register("phone")} placeholder="0123456789" className={isRtl ? 'text-right' : ''} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address" className={`flex items-center gap-2 ${isRtl ? 'flex-row-reverse' : ''}`}><MapPin className="size-4" /> {t("contact.address")}</Label>
                <Input id="address" {...register("address")} placeholder="Cairo, Egypt" className={isRtl ? 'text-right' : ''} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Social Links */}
        <TabsContent value="social">
          <Card>
            <CardHeader className={isRtl ? 'text-right' : ''}>
              <CardTitle>{t("social.title")}</CardTitle>
              <CardDescription>{t("social.description")}</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {socialPlatforms.map((platform) => (
                <div key={platform} className={`grid gap-2 capitalize ${isRtl ? 'text-right' : ''}`}>
                  <Label htmlFor={platform} className={isRtl ? 'text-right' : ''}>{platform}</Label>
                  <Input id={platform} {...register(platform)} placeholder={`https://${platform}.com/yourprofile`} className={isRtl ? 'text-right' : ''} />
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
            <CardHeader className={isRtl ? 'text-right' : ''}>
              <CardTitle>{t("stats.title")}</CardTitle>
              <CardDescription>{t("stats.description")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-2">
                <Label htmlFor="statisticsHeading" className={isRtl ? 'text-right' : ''}>{t("stats.heading")}</Label>
                <Input id="statisticsHeading" {...register("statisticsHeading")} className={isRtl ? 'text-right' : ''} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="statisticsDescription" className={isRtl ? 'text-right' : ''}>{t("stats.subtext")}</Label>
                <Textarea id="statisticsDescription" {...register("statisticsDescription")} className={isRtl ? 'text-right' : ''} />
              </div>

              <div className="space-y-4 pt-4">
                <div className={`flex items-center justify-between ${isRtl ? 'flex-row-reverse' : ''}`}>
                  <Label className={isRtl ? 'text-right' : ''}>{t("stats.addItem")}</Label>
                  <Button type="button" variant="outline" size="sm" onClick={() => append({ value: "", label: "" })}>
                    <Plus className={`${isRtl ? 'ml-2' : 'mr-2'} size-4`} /> {t("stats.addItem")}
                  </Button>
                </div>
                
                <div className="grid gap-4">
                  {fields.map((field, index) => (
                    <div key={field.id} className={`flex items-end gap-4 p-4 border rounded-lg bg-muted/30 ${isRtl ? 'flex-row-reverse' : ''}`}>
                      <div className="grid flex-1 gap-2">
                        <Label className={isRtl ? 'text-right' : ''}>{t("stats.valueLabel")}</Label>
                        <Input {...register(`statistics.${index}.value` as const)} placeholder="150+" className={isRtl ? 'text-right' : ''} />
                      </div>
                      <div className="grid flex-2 gap-2">
                        <Label className={isRtl ? 'text-right' : ''}>{t("stats.labelLabel")}</Label>
                        <Input {...register(`statistics.${index}.label` as const)} placeholder="Completed Projects" className={isRtl ? 'text-right' : ''} />
                      </div>
                      <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}>
                        <Trash2 className="size-4" />
                      </Button>
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
          {isSubmitting && <Loader2 className={`${isRtl ? 'ml-2' : 'mr-2'} h-4 w-4 animate-spin`} />}
          {isSubmitting ? t("saving") : t("saveChanges")}
        </Button>
      </div>
    </form>
  );
}
