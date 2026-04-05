"use client";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Link } from "@/i18n/routing";
import { useRouter } from "next/navigation";
import { login } from "@/lib/actions";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "@/stores/user";
import { useLocale, useTranslations } from "next-intl";

export default function LoginForm() {
  const locale = useLocale();
  const t = useTranslations("auth.login");
  const tl = useTranslations("auth.labels");
  const tv = useTranslations("auth.validation");
  const isRtl = locale === 'ar';
  
  const loginSchema = z.object({
    email: z.string().email(tv("email")),
    password: z.string().min(6, tv("password")),
  });

  type LoginFormValues = z.infer<typeof loginSchema>;

  const inputStyle = "h-11! focus-visible:black";
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { isSubmitting } = form.formState;
  
  const onSubmit = async (data: LoginFormValues) => {
    const res = await login(data);

    if (res?.ok) {
      const accessToken = res?.data?.data?.accessToken;
      const user = res?.data?.data?.user;
      toast.success(res?.data?.message || t("success"));
      
      setAuth({
        token: accessToken,
        user,
      });
      
      router.push("/");
      router.refresh(); 
    } else {
      toast.error(res?.error || t("failed"));
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={`space-y-4 ${isRtl ? 'text-right' : 'text-left'}`}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <Label>{tl("email")}</Label>
              <Input
                placeholder="your@email.com"
                className={`${inputStyle} ${isRtl ? 'text-right' : 'text-left'}`}
                {...field}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <Label>{tl("password")}</Label>
              <Input
                type="password"
                placeholder="******"
                className={`${inputStyle} ${isRtl ? 'text-right' : 'text-left'}`}
                {...field}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col gap-2">
          <p className={`text-sm font-semibold ${isRtl ? 'text-start' : 'text-end'}`}>
            {t("noAccount")}{" "}
            <Link href={"/register"} className="font-bold underline text-red-700">
              {useTranslations("auth.register")("submit")}
            </Link>
          </p>
          <p className={`text-sm font-semibold ${isRtl ? 'text-start' : 'text-end'}`}>
            <Link href={"/forgot-password"} className="font-bold underline text-gray-500 hover:text-red-700">
              {t("forgot")}
            </Link>
          </p>
        </div>
        <Button type="submit" className="w-full h-11 " disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className=" animate-spin" /> : t("submit")}
        </Button>
      </form>
    </FormProvider>
  );
}

