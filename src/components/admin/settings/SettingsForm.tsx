"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { SettingsResponse } from "@/types/settings";
import { updateSettings } from "@/lib/actions";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Textarea } from "../ui/textarea";
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

const statisticSchema = z.object({
  id: z.number().optional(),
  value: z.string().min(1, "Value is required"),
  label: z.string().min(1, "Label is required"),
});

const settingsSchema = z.object({
  siteName: z.string().nullable(),
  siteLogo: z.any().optional(),
  metaTitle: z.string().nullable(),
  metaDescription: z.string().nullable(),
  metaKeywords: z.string().nullable(),
  metaImage: z.any().optional(),
  heroTitle: z.string().min(1, "Hero title is required"),
  heroDescription: z.string().min(1, "Hero description is required"),
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
  statisticsHeading: z.string().min(1, "Statistics heading is required"),
  statisticsDescription: z.string().min(1, "Statistics description is required"),
  statistics: z.array(statisticSchema),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

interface SettingsFormProps {
  initialData: SettingsResponse["data"];
  onUpdate: () => void;
}

export function SettingsForm({ initialData, onUpdate }: SettingsFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("general");

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
      const appendSnakeCase = (key: string, value: any) => {
        const snakeKey = key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
        if (value instanceof FileList) {
          if (value.length > 0) {
            formData.append(snakeKey, value[0]);
          }
        } else if (value !== null && value !== undefined) {
           formData.append(snakeKey, value);
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
        toast.success("Settings updated successfully");
        onUpdate();
      } else {
        toast.error(res.error || "Failed to update settings");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-6 mb-8">
          <TabsTrigger value="general" className="gap-2">
            <SettingsIcon className="size-4" /> General
          </TabsTrigger>
          <TabsTrigger value="seo" className="gap-2">
            <Search className="size-4" /> SEO
          </TabsTrigger>
          <TabsTrigger value="hero" className="gap-2">
            <Rocket className="size-4" /> Hero
          </TabsTrigger>
          <TabsTrigger value="contact" className="gap-2">
            <Mail className="size-4" /> Contact
          </TabsTrigger>
          <TabsTrigger value="social" className="gap-2">
            <Share2 className="size-4" /> Social
          </TabsTrigger>
          <TabsTrigger value="statistics" className="gap-2">
            <BarChart3 className="size-4" /> Stats
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Basic website information and logo.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-2">
                <Label htmlFor="siteName">Site Name</Label>
                <Input id="siteName" {...register("siteName")} placeholder="Enter site name" />
                {errors.siteName && <p className="text-sm text-destructive">{errors.siteName.message}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="siteLogo">Site Logo</Label>
                {initialData.siteLogo && (
                  <div className="mb-2">
                    <img src={initialData.siteLogo} alt="Current Logo" className="h-20 object-contain rounded border p-1" />
                  </div>
                )}
                <Input id="siteLogo" type="file" accept="image/*" {...register("siteLogo")} />
                <p className="text-xs text-muted-foreground">Upload a new logo to replace the current one.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SEO Settings */}
        <TabsContent value="seo">
          <Card>
            <CardHeader>
              <CardTitle>SEO Settings</CardTitle>
              <CardDescription>Optimize your site for search engines.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-2">
                <Label htmlFor="metaTitle">Meta Title</Label>
                <Input id="metaTitle" {...register("metaTitle")} placeholder="Enter meta title" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="metaDescription">Meta Description</Label>
                <Textarea id="metaDescription" {...register("metaDescription")} placeholder="Enter meta description" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="metaKeywords">Meta Keywords</Label>
                <Input id="metaKeywords" {...register("metaKeywords")} placeholder="keyword1, keyword2, ..." />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="metaImage">Meta Image (OG Image)</Label>
                {initialData.metaImage && (
                    <div className="mb-2">
                      <img src={initialData.metaImage} alt="Current Meta Image" className="h-32 object-cover rounded border p-1" />
                    </div>
                )}
                <Input id="metaImage" type="file" accept="image/*" {...register("metaImage")} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Hero Settings */}
        <TabsContent value="hero">
          <Card>
            <CardHeader>
              <CardTitle>Hero Section</CardTitle>
              <CardDescription>Content for the main hero section of the homepage.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-2">
                <Label htmlFor="heroTitle">Hero Title</Label>
                <Input id="heroTitle" {...register("heroTitle")} />
                {errors.heroTitle && <p className="text-sm text-destructive">{errors.heroTitle.message}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="heroDescription">Hero Description</Label>
                <Textarea id="heroDescription" {...register("heroDescription")} />
                {errors.heroDescription && <p className="text-sm text-destructive">{errors.heroDescription.message}</p>}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="heroButton1Link">Button 1 Link</Label>
                  <Input id="heroButton1Link" {...register("heroButton1Link")} placeholder="/contact-us" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="heroButton2Link">Button 2 Link</Label>
                  <Input id="heroButton2Link" {...register("heroButton2Link")} placeholder="/request-quote" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contact Settings */}
        <TabsContent value="contact">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>Displayed in the footer and contact pages.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-2">
                <Label htmlFor="email" className="flex items-center gap-2"><Mail className="size-4" /> Email</Label>
                <Input id="email" {...register("email")} placeholder="contact@example.com" />
                {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone" className="flex items-center gap-2"><Phone className="size-4" /> Phone</Label>
                <Input id="phone" {...register("phone")} placeholder="0123456789" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address" className="flex items-center gap-2"><MapPin className="size-4" /> Address</Label>
                <Input id="address" {...register("address")} placeholder="Cairo, Egypt" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Social Links */}
        <TabsContent value="social">
          <Card>
            <CardHeader>
              <CardTitle>Social Media Links</CardTitle>
              <CardDescription>Links to your social media profiles.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                "facebook", "twitter", "instagram", "linkedin", "youtube", 
                "tiktok", "snapchat", "pinterest", "whatsapp", "telegram"
              ].map((platform) => (
                <div key={platform} className="grid gap-2 capitalize">
                  <Label htmlFor={platform}>{platform}</Label>
                  <Input id={platform} {...register(platform as any)} placeholder={`https://${platform}.com/yourprofile`} />
                  {errors[platform as keyof SettingsFormValues] && (
                    <p className="text-sm text-destructive">{(errors[platform as keyof SettingsFormValues] as any).message}</p>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Statistics */}
        <TabsContent value="statistics">
          <Card>
            <CardHeader>
              <CardTitle>Statistics Section</CardTitle>
              <CardDescription>Key performance indicators displayed on the site.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-2">
                <Label htmlFor="statisticsHeading">Section Heading</Label>
                <Input id="statisticsHeading" {...register("statisticsHeading")} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="statisticsDescription">Section Description</Label>
                <Textarea id="statisticsDescription" {...register("statisticsDescription")} />
              </div>

              <div className="space-y-4 pt-4">
                <div className="flex items-center justify-between">
                  <Label>Counters / Stats Items</Label>
                  <Button type="button" variant="outline" size="sm" onClick={() => append({ value: "", label: "" })}>
                    <Plus className="size-4 mr-2" /> Add Item
                  </Button>
                </div>
                
                <div className="grid gap-4">
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex items-end gap-4 p-4 border rounded-lg bg-muted/30">
                      <div className="grid flex-1 gap-2">
                        <Label>Value (e.g. 15+)</Label>
                        <Input {...register(`statistics.${index}.value` as const)} placeholder="150+" />
                      </div>
                      <div className="grid flex-2 gap-2">
                        <Label>Label (e.g. Years of Experience)</Label>
                        <Input {...register(`statistics.${index}.label` as const)} placeholder="Completed Projects" />
                      </div>
                      <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}>
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  ))}
                  {fields.length === 0 && (
                    <p className="text-center py-4 text-muted-foreground">No statistics items added.</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex items-center justify-end border-t pt-6">
        <Button type="submit" size="lg" className="bg-red-700 hover:bg-red-800" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save All Changes
        </Button>
      </div>
    </form>
  );
}
