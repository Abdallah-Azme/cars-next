"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { resetPassword } from "@/lib/actions";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

function ResetPasswordFormContent() {
  const locale = useLocale();
  const t = useTranslations("auth.resetPassword");
  const tv = useTranslations("auth.validation");
  const isRtl = locale === 'ar';

  const ResetPasswordSchema = z.object({
    token: z.string().min(1),
    password: z.string().min(8, {
      message: tv("password"),
    }),
    password_confirmation: z.string(),
  }).refine((data) => data.password === data.password_confirmation, {
    message: tv("match"),
    path: ["password_confirmation"],
  });

  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") || "";

  const form = useForm<z.infer<typeof ResetPasswordSchema>>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      token: token,
      password: "",
      password_confirmation: "",
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(data: z.infer<typeof ResetPasswordSchema>) {
    const res = await resetPassword({
        token: data.token,
        password: data.password,
        password_confirmation: data.password_confirmation
    });

    if (res.ok) {
      toast.success(res.data?.message || t("success"));
      router.push("/login");
    } else {
      toast.error(res.error || t("failed"));
    }
  }

  if (!token) {
    return (
        <div className="text-center p-6 space-y-4">
            <p className="text-red-600 font-semibold">{t("invalidToken")}</p>
            <Button variant="outline" onClick={() => router.push("/forgot-password")}>
                {t("goBack")}
            </Button>
        </div>
    );
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className={`space-y-4 ${isRtl ? 'text-right' : 'text-left'}`}>
          <FormField
            control={form.control}
            name="token"
            render={({ field }) => (
              <input type="hidden" {...field} />
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("newPassword")}</FormLabel>
                <FormControl>
                  <Input 
                    type="password" 
                    placeholder="********" 
                    className={`${isRtl ? 'text-right' : 'text-left'} h-11 focus-visible:ring-red-600`}
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password_confirmation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("confirmNewPassword")}</FormLabel>
                <FormControl>
                  <Input 
                    type="password" 
                    placeholder="********" 
                    className={`${isRtl ? 'text-right' : 'text-left'} h-11 focus-visible:ring-red-600`}
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            className="w-full h-11 bg-red-700 hover:bg-red-800 text-white font-bold transition-all shadow-md shadow-red-700/20" 
            disabled={isSubmitting}
          >
            {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : t("submit")}
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default function ResetPasswordForm() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center p-12 space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-red-700" />
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-red-600 animate-pulse" style={{ width: '60%' }} />
        </div>
      </div>
    }>
      <ResetPasswordFormContent />
    </Suspense>
  );
}
