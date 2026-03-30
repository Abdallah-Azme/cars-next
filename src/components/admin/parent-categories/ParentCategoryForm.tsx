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

const childSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "Name is required"),
  searchKeywords: z.string().min(1, "Keywords are required"),
  image: z.any().optional(),
});

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  image: z.any().optional(),
  children: z.array(childSchema),
});

type FormValues = z.infer<typeof formSchema>;

interface ParentCategoryFormProps {
  initialData?: ParentCategory | null;
  onSuccess: () => void;
  onCancel: () => void;
}

// Helper component for live image preview
function ImagePreview({ file, fallbackUrl }: { file?: File | null; fallbackUrl?: string | null }) {
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
      <img
        src={fixImageUrl(displayUrl)}
        alt="Preview"
        className="h-full w-full object-cover"
      />
      {preview && (
        <div className="absolute top-0 right-0 bg-red-700 text-white text-[8px] px-1 rounded-bl">
          NEW
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
  const [loading, setLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || "",
      children: initialData?.children?.map((c) => ({
        id: c.id,
        name: c.name,
        searchKeywords: c.searchKeywords,
      })) || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "children",
  });

  // Watch for changes to show live previews
  const parentImage = useWatch({ control: form.control, name: "image" });
  const childrenData = useWatch({ control: form.control, name: "children" });

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      
      if (values.image instanceof File) {
        formData.append("image", values.image);
      }

      values.children.forEach((child, index) => {
        if (child.id) {
          formData.append(`children_ids[${index}]`, String(child.id));
        }
        formData.append(`children_names[${index}]`, child.name);
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
        toast.success(initialData ? "Category updated" : "Category created");
        onSuccess();
      } else {
        toast.error(res.error || "Something went wrong");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parent Category Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image"
              render={({ field: { value: _value, onChange, ...field } }) => (
                <FormItem>
                  <FormLabel>Parent Category Image</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-6 p-2 border rounded-md bg-muted/20">
                      <ImagePreview 
                        file={parentImage instanceof File ? parentImage : null} 
                        fallbackUrl={initialData?.image} 
                      />
                      <div className="flex-1 space-y-2">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) onChange(file);
                          }}
                          {...field}
                        />
                        <p className="text-[10px] text-muted-foreground">
                          Recommended format: PNG, JPG (Max 5MB)
                        </p>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Child Categories</CardTitle>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ name: "", searchKeywords: "" })}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Child
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {fields.length === 0 && (
              <p className="text-center py-4 text-muted-foreground">
                No child categories added.
              </p>
            )}
            {fields.map((field, index) => {
              const childImage = childrenData?.[index]?.image;
              const hasExistingImage = initialData?.children[index]?.image;

              return (
                <div
                  key={field.id}
                  className="p-4 border rounded-lg space-y-4 relative bg-gray-50/50"
                >
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`children.${index}.name`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Child Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Cars" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`children.${index}.searchKeywords`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Keywords (comma separated)</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. bmw,toyota" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name={`children.${index}.image`}
                    render={({ field: { value: _value, onChange, ...field } }) => (
                      <FormItem>
                        <FormLabel>Child Image</FormLabel>
                        <FormControl>
                          <div className="flex items-center gap-4 p-2 border rounded-md bg-white">
                            <ImagePreview 
                              file={childImage instanceof File ? childImage : null} 
                              fallbackUrl={hasExistingImage} 
                            />
                            <div className="flex-1 space-y-1">
                              <Input
                                type="file"
                                accept="image/*"
                                className="h-8 py-0.5 text-xs"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) onChange(file);
                                }}
                                {...field}
                              />
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              );
            })}
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" className="bg-red-700" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initialData ? "Update Category" : "Create Category"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
