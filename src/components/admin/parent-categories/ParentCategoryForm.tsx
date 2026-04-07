"use client";

import { useFieldArray, useForm, useWatch } from "react-hook-form";
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
import { Plus, Trash2, Loader2, Image as ImageIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { createParentCategory, updateParentCategory, ParentCategory } from "@/lib/actions";
import { fixImageUrl } from "@/lib/utils";
import { toast } from "sonner";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";

interface ParentCategoryFormProps {
  initialData?: ParentCategory | null;
  onSuccess: () => void;
  onCancel: () => void;
}

// Helper component for live image preview
function ImagePreview({ file, fallbackUrl, newFlag }: { file?: File | null; fallbackUrl?: string | null, newFlag: string }) {
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const displayUrl = preview || fallbackUrl;

  if (!displayUrl) {
    return (
      <div className="flex h-20 w-20 items-center justify-center rounded-md border-2 border-dashed bg-muted">
        <ImageIcon className="h-8 w-8 text-muted-foreground/50" />
      </div>
    );
  }

  return (
    <div className="relative h-20 w-20 rounded-md border overflow-hidden shadow-sm">
      <Image
        src={fixImageUrl(displayUrl)}
        alt="Preview"
        fill
        className="object-cover"
        sizes="80px"
      />
      {preview && (
        <div className="absolute top-0 right-0 bg-red-700 text-white text-[8px] px-1 rounded-bl">
          {newFlag}
        </div>
      )}
    </div>
  );
}

export function ParentCategoryForm({
  initialData,
  onSuccess,
  onCancel,
}: ParentCategoryFormProps) {
  const locale = useLocale();
  const t = useTranslations("admin.parentCategories.form");
  const isRtl = locale === 'ar';
  
  const [loading, setLoading] = useState(false);

  const childSchema = z.object({
    id: z.number().optional(),
    name: z.string().min(1, t("validation.name")),
    name_ar: z.string().optional(),
    name_ja: z.string().optional(),
    name_sw: z.string().optional(),
    searchKeywords: z.string().min(1, t("validation.keywords")),
    image: z.any().optional(),
  });

  const formSchema = z.object({
    name: z.string().min(1, t("validation.name")),
    name_ar: z.string().optional(),
    name_ja: z.string().optional(),
    name_sw: z.string().optional(),
    image: z.any().optional(),
    children: z.array(childSchema),
  });

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      name_ar: initialData?.nameAr || "",
      name_ja: initialData?.nameJa || "",
      name_sw: initialData?.nameSw || "",
      children: initialData?.children?.map((c) => ({
        id: c.id,
        name: c.name,
        name_ar: c.nameAr || "",
        name_ja: c.nameJa || "",
        name_sw: c.nameSw || "",
        searchKeywords: c.searchKeywords,
      })) || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "children",
    keyName: "_uuid",
  });

  const parentImage = useWatch({ control: form.control, name: "image" });
  const childrenData = useWatch({ control: form.control, name: "children" });

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      if (values.name_ar) formData.append("name_ar", values.name_ar);
      if (values.name_ja) formData.append("name_ja", values.name_ja);
      if (values.name_sw) formData.append("name_sw", values.name_sw);
      
      if (values.image instanceof File) {
        formData.append("image", values.image);
      }

      values.children.forEach((child, index) => {
        if (child.id) {
          formData.append(`children_ids[${index}]`, String(child.id));
        }
        formData.append(`children_names[${index}]`, child.name);
        if (child.name_ar) formData.append(`children_names_ar[${index}]`, child.name_ar);
        if (child.name_ja) formData.append(`children_names_ja[${index}]`, child.name_ja);
        if (child.name_sw) formData.append(`children_names_sw[${index}]`, child.name_sw);
        formData.append(`children_keywords[${index}]`, child.searchKeywords);
        
        if (child.image instanceof File) {
          formData.append(`children_images[${index}]`, child.image);
        }
      });

      let res;
      if (initialData) {
        res = await updateParentCategory(initialData.id, formData);
      } else {
        res = await createParentCategory(formData);
      }

      if (res.ok) {
        toast.success(initialData ? t("successUpdate") : t("successCreate"));
        onSuccess();
      } else {
        toast.error(res.error || t("failed"));
      }
    } catch (error) {
      console.error(error);
      toast.error(t("error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={`space-y-6 text-start`}>
        <Card>
          <CardHeader className="text-start">
            <CardTitle>{t("basicInfo")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={"block w-full text-start"}>{t("categoryName")} (EN)</FormLabel>
                    <FormControl>
                      <Input placeholder={t("namePlaceholder")} {...field} className="text-start" disabled={!!initialData} />
                    </FormControl>
                    <FormMessage className="text-start" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name_ar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={"block w-full text-start"}>{t("categoryName")} (AR)</FormLabel>
                    <FormControl>
                      <Input placeholder={`${t("namePlaceholder")} (AR)`} {...field} className="text-start" dir="rtl" />
                    </FormControl>
                    <FormMessage className="text-start" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name_ja"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={"block w-full text-start"}>{t("categoryName")} (JA)</FormLabel>
                    <FormControl>
                      <Input placeholder={`${t("namePlaceholder")} (JA)`} {...field} className="text-start" />
                    </FormControl>
                    <FormMessage className="text-start" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name_sw"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={"block w-full text-start"}>{t("categoryName")} (SW)</FormLabel>
                    <FormControl>
                      <Input placeholder={`${t("namePlaceholder")} (SW)`} {...field} className="text-start" />
                    </FormControl>
                    <FormMessage className="text-start" />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="image"
              render={({ field: { value: _value, onChange, ...field } }) => (
                <FormItem>
                  <FormLabel className={"block w-full text-start"}>{t("categoryImg")}</FormLabel>
                  <FormControl>
                    <div className={`flex items-center gap-6 p-2 border rounded-md bg-muted/20`}>
                      <ImagePreview 
                        file={parentImage instanceof File ? parentImage : null} 
                        fallbackUrl={initialData?.image} 
                        newFlag={t("newFlag")}
                      />
                      <div className={`flex-1 space-y-2 `}>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) onChange(file);
                          }}
                          {...field}
                          className="text-start"
                        />
                        <p className="text-[10px] text-muted-foreground">
                          {t("imgHint")}
                        </p>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage className="text-start" />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className={`flex flex-row items-center justify-between`}>
            <CardTitle>{t("childCategories")}</CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ name: "", searchKeywords: "" })}
              
            >
              <Plus className={`me-2 h-4 w-4`} />
              {t("addChild")}
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {fields.length === 0 && (
              <p className="text-center py-4 text-muted-foreground">
                {t("noChildren")}
              </p>
            )}
            {fields.map((field, index) => {
              const childImage = childrenData?.[index]?.image;
              const hasExistingImage = field.id ? initialData?.children?.find(c => c.id === field.id)?.image : undefined;

              return (
                <div
                  key={field._uuid}
                  className="p-4 border rounded-lg space-y-4 relative bg-gray-50/50"
                >
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className={`absolute top-2 ${isRtl ? 'left-2' : 'right-2'} text-red-500 hover:text-red-700 hover:bg-red-50`}
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>

                  <div className={`grid grid-cols-1 md:grid-cols-2 gap-4`}>
                    <FormField
                      control={form.control}
                      name={`children.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={"block w-full text-start"}>{t("childName")} (EN)</FormLabel>
                          <FormControl>
                            <Input placeholder={t("childPlaceholder")} {...field} className="text-start" disabled={!!initialData} />
                          </FormControl>
                          <FormMessage className="text-start" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`children.${index}.name_ar`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={"block w-full text-start"}>{t("childName")} (AR)</FormLabel>
                          <FormControl>
                            <Input placeholder={`${t("childPlaceholder")} (AR)`} {...field} className="text-start" dir="rtl" />
                          </FormControl>
                          <FormMessage className="text-start" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`children.${index}.name_ja`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={"block w-full text-start"}>{t("childName")} (JA)</FormLabel>
                          <FormControl>
                            <Input placeholder={`${t("childPlaceholder")} (JA)`} {...field} className="text-start" />
                          </FormControl>
                          <FormMessage className="text-start" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`children.${index}.name_sw`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={"block w-full text-start"}>{t("childName")} (SW)</FormLabel>
                          <FormControl>
                            <Input placeholder={`${t("childPlaceholder")} (SW)`} {...field} className="text-start" />
                          </FormControl>
                          <FormMessage className="text-start" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name={`children.${index}.searchKeywords`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={"block w-full text-start"}>{t("keywords")}</FormLabel>
                        <FormControl>
                          <Input placeholder={t("keywordsPlaceholder")} {...field} className="text-start" />
                        </FormControl>
                        <FormMessage className="text-start" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`children.${index}.image`}
                    render={({ field: { value: _value, onChange, ...field } }) => (
                      <FormItem>
                        <FormLabel className={"block w-full text-start"}>{t("childImg")}</FormLabel>
                        <FormControl>
                          <div className={`flex items-center gap-4 p-2 border rounded-md bg-white`}>
                            <ImagePreview 
                              file={childImage instanceof File ? childImage : null} 
                              fallbackUrl={hasExistingImage} 
                              newFlag={t("newFlag")}
                            />
                            <div className={`flex-1 space-y-1 `}>
                              <Input
                                type="file"
                                accept="image/*"
                                className={`h-8 py-0.5 text-xs `}
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) onChange(file);
                                }}
                                {...field}
                              />
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage className="text-start" />
                      </FormItem>
                    )}
                  />
                </div>
              );
            })}
          </CardContent>
        </Card>

        <div className={`flex gap-2 ${isRtl ? 'justify-start flex-row-reverse' : 'justify-end'}`}>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
          >
            {t("cancel")}
          </Button>
          <Button type="submit" className="bg-red-700 font-bold" disabled={loading}>
            {loading && <Loader2 className={`me-2 h-4 w-4 animate-spin`} />}
            {initialData ? t("update") : t("create")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
