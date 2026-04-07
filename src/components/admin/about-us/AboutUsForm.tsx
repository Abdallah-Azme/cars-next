"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/admin/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/admin/ui/form";
import { Input } from "@/components/admin/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/admin/ui/card";
import { Loader2, Image as ImageIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { updateAboutUs, AboutUsData } from "@/lib/actions";
import { fixImageUrl } from "@/lib/utils";
import { toast } from "sonner";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface AboutUsFormProps {
  initialData?: AboutUsData | null;
}

function ImagePreview({ file, fallbackUrl }: { file?: File | null; fallbackUrl?: string | null }) {
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    let objectUrl: string | null = null;
    if (file) {
      objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
    } else {
      setPreview(null);
    }

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [file]);

  const displayUrl = preview || fallbackUrl;

  if (!displayUrl) {
    return (
      <div className="flex h-32 w-full max-w-sm items-center justify-center rounded-md border-2 border-dashed bg-muted">
        <ImageIcon className="h-8 w-8 text-muted-foreground/50" />
      </div>
    );
  }

  return (
    <div className="relative h-32 w-full max-w-sm rounded-md border overflow-hidden shadow-sm">
      <Image
        src={fixImageUrl(displayUrl)}
        alt="Preview"
        fill
        className="object-cover"
        sizes="384px"
      />
    </div>
  );
}

export function AboutUsForm({
  initialData,
}: AboutUsFormProps) {
  const locale = useLocale();
  const router = useRouter();
  const isRtl = locale === 'ar';
  
  const [loading, setLoading] = useState(false);

  // Reusable schema for each language string
  const langString = z.string().min(1, "Required");

  const formSchema = z.object({
    title_ar: langString,
    title_en: langString,
    title_ja: langString,
    title_sw: langString,
    description_ar: langString,
    description_en: langString,
    description_ja: langString,
    description_sw: langString,
    image: z.any().optional(),
  });

  type FormValues = z.infer<typeof formSchema>;

  // Map camelCase from API to snake_case used in Form
  const mapInitialData = (data: any) => ({
    title_ar: data?.titleAr || data?.title_ar || "",
    title_en: data?.titleEn || data?.title_en || "",
    title_ja: data?.titleJa || data?.title_ja || "",
    title_sw: data?.titleSw || data?.title_sw || "",
    description_ar: data?.descriptionAr || data?.description_ar || "",
    description_en: data?.descriptionEn || data?.description_en || "",
    description_ja: data?.descriptionJa || data?.description_ja || "",
    description_sw: data?.descriptionSw || data?.description_sw || "",
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: mapInitialData(initialData),
  });

  // Reset form when initialData changes (e.g. after router.refresh())
  useEffect(() => {
    if (initialData) {
      form.reset(mapInitialData(initialData));
    }
  }, [initialData, form]);

  const parentImage = useWatch({ control: form.control, name: "image" });

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title_ar", values.title_ar);
      formData.append("title_en", values.title_en);
      formData.append("title_ja", values.title_ja);
      formData.append("title_sw", values.title_sw);
      formData.append("description_ar", values.description_ar);
      formData.append("description_en", values.description_en);
      formData.append("description_ja", values.description_ja);
      formData.append("description_sw", values.description_sw);
      
      if (values.image instanceof File) {
        formData.append("image", values.image);
      }

      const res = await updateAboutUs(formData);

      if (res.ok) {
        toast.success("About Us updated successfully");
        router.refresh();
      } else {
        toast.error(res.error || "Failed to update");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const languages = [
    { key: "ar", label: "Arabic" },
    { key: "en", label: "English" },
    { key: "ja", label: "Japanese" },
    { key: "sw", label: "Swahili" },
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={`space-y-6 ${isRtl ? 'text-right' : 'text-left'}`}>
        <Card>
          <CardHeader className={isRtl ? 'text-right' : ''}>
            <CardTitle>Image Section</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="image"
              render={({ field: { onChange, value: _, ...field } }) => (
                <FormItem>
                  <FormLabel className={isRtl ? 'text-right block w-full' : ''}>About Us Image</FormLabel>
                  <FormControl>
                    <div className={`flex flex-col gap-4 p-4 border rounded-md bg-muted/20`}>
                      <ImagePreview 
                        file={parentImage instanceof File ? parentImage : null} 
                        fallbackUrl={initialData?.image || (initialData as any)?.imageUrl} 
                      />
                      <div className={`flex-1 space-y-2 ${isRtl ? 'text-right' : ''}`}>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) onChange(file);
                          }}
                          {...field}
                          className={isRtl ? 'text-right' : ''}
                        />
                        <p className="text-[10px] text-muted-foreground">
                          Recommended format: PNG, JPG, WEBP (Max 5MB)
                        </p>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage className={isRtl ? 'text-right' : ''} />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {languages.map((lang) => (
            <Card key={lang.key}>
              <CardHeader className={isRtl ? 'text-right' : ''}>
                <CardTitle className="flex items-center gap-2">
                   {lang.label} Content
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name={`title_${lang.key}` as keyof FormValues}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={isRtl ? 'text-right block w-full' : ''}>Title ({lang.label})</FormLabel>
                      <FormControl>
                        <Input placeholder={`Enter ${lang.label} title`} {...field} className={isRtl ? 'text-right' : ''} />
                      </FormControl>
                      <FormMessage className={isRtl ? 'text-right' : ''} />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`description_${lang.key}` as keyof FormValues}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={isRtl ? 'text-right block w-full' : ''}>Description ({lang.label})</FormLabel>
                      <FormControl>
                        <textarea 
                          placeholder={`Enter ${lang.label} description`} 
                          {...field} 
                          className={`flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${isRtl ? 'text-right' : ''}`}
                        />
                      </FormControl>
                      <FormMessage className={isRtl ? 'text-right' : ''} />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className={`flex gap-2 ${isRtl ? 'justify-start flex-row-reverse' : 'justify-end'}`}>
          <Button type="submit" className="bg-red-700 font-bold" disabled={loading}>
            {loading && <Loader2 className={`${isRtl ? 'ml-2' : 'mr-2'} h-4 w-4 animate-spin`} />}
            Save Changes
          </Button>
        </div>
      </form>
    </Form>
  );
}
