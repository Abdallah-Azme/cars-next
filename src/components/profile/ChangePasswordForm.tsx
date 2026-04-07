"use client";

import { changePassword } from "@/lib/actions";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { useLocale, useTranslations } from "next-intl";

export default function ChangePasswordForm() {
  const locale = useLocale();
  const t = useTranslations("profile.security");
  const tv = useTranslations("auth.validation");
  const isRtl = locale === 'ar';

  const passwordSchema = z
    .object({
      new_password: z.string().min(8, tv("password")),
      new_password_confirmation: z.string(),
    })
    .refine((data) => data.new_password === data.new_password_confirmation, {
      message: tv("match"),
      path: ["new_password_confirmation"],
    });

  type ChangePasswordFormValues = z.infer<typeof passwordSchema>;

  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      new_password: "",
      new_password_confirmation: "",
    },
  });

  const {isSubmitting} = form.formState;
  async function onSubmit(values: ChangePasswordFormValues) {
    const res = await changePassword(values);
    if (res?.ok) {
      toast.success(res?.data?.message || t("success"));
      form.reset();
    } else {
      toast.error(res?.error || t("failed"));
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={`space-y-4 text-start`}>
        <FormField
          control={form.control}
          name="new_password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("newPassword")}</FormLabel>
              <FormControl>
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  className={`text-start`}
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="new_password_confirmation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("confirmPassword")}</FormLabel>
              <FormControl>
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  className={`text-start`}
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full bg-red-600 hover:bg-red-700"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Loader2 className={`me-2 h-4 w-4 animate-spin`} />
          ) : (
            t("submit")
          )}
        </Button>
      </form>
    </Form>
  );
}

