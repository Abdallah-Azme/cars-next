"use client";

import { updateProfile } from "@/lib/actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/stores/user";
import { fixImageUrl } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, Loader2 } from "lucide-react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { useLocale, useTranslations } from "next-intl";

export default function ProfileInfoForm() {
  const locale = useLocale();
  const t = useTranslations("profile.info");
  const tv = useTranslations("auth.validation");
  const isRtl = locale === 'ar';

  const profileSchema = z.object({
    name: z.string().min(2, tv("required")),
  });

  const { user, setAuth, token } = useAuthStore();

  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    fixImageUrl(user?.avatar) || null,
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
    },
  });

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;

    if (!file) return;

    setSelectedFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const { isSubmitting } = form.formState;

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  async function onSubmit(values: z.infer<typeof profileSchema>) {
    try {
      const formData = new FormData();
      formData.append("name", values.name);

      if (selectedFile) {
        formData.append("avatar", selectedFile);
      }

      const res = await updateProfile(formData);

      if (res?.ok && res.data?.data?.user) {
        toast.success(res.data.message || t("success"));
        setAuth({ token: token!, user: res.data.data.user });
      } else {
        toast.error(res?.error || t("failed"));
      }
    } catch (error) {
      toast.error(t("failed"));
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-4">
        <div className="relative group">
          <Avatar className="h-32 w-32 border-4 border-muted">
            <AvatarImage
              src={
                avatarPreview
                  ? avatarPreview.startsWith("data:")
                    ? avatarPreview
                    : fixImageUrl(avatarPreview)
                  : ""
              }
              className="object-cover"
            />
            <AvatarFallback className="text-2xl bg-red-700 text-white">
              {user?.name?.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <button
            type="button"
            onClick={handleAvatarClick}
            className={`absolute bottom-0 ${isRtl ? 'left-0' : 'right-0'} p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors shadow-lg`}
          >
            <Camera size={18} />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={onFileChange}
          />
        </div>

        <div className="text-center">
          <h3 className="text-lg font-medium">{user?.name}</h3>
          <p className="text-sm text-muted-foreground capitalize">
            {user?.role}
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className={`space-y-4 ${isRtl ? 'text-right' : 'text-left'}`}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("nameLabel")}</FormLabel>
                <FormControl>
                  <Input 
                    placeholder={t("nameLabel")} 
                    className={`${isRtl ? 'text-right' : 'text-left'}`}
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-2">
            <FormLabel>{t("emailLabel")}</FormLabel>
            <Input 
              value={user?.email || ""} 
              disabled 
              className={`bg-muted ${isRtl ? 'text-right' : 'text-left'}`} 
            />
            <p className={`text-[0.8rem] text-muted-foreground ${isRtl ? 'text-right' : 'text-left'}`}>
              {t("emailReadOnly")}
            </p>
          </div>

          <div className="space-y-2">
            <FormLabel>{t("roleLabel")}</FormLabel>
            <Input
              value={user?.role || ""}
              disabled
              className={`bg-muted capitalize ${isRtl ? 'text-right' : 'text-left'}`}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className={`${isRtl ? 'ml-2' : 'mr-2'} h-4 w-4 animate-spin`} />
            ) : (
              t("submit")
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
