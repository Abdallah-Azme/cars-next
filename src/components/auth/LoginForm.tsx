"use client";

import { useState } from "react";
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
import { cn } from "@/lib/utils";
import { PhoneInput } from "@/components/ui/phone-input";

export default function LoginForm() {
  const locale = useLocale();
  const t = useTranslations("auth.login");
  const tl = useTranslations("auth.labels");
  const tv = useTranslations("auth.validation");
  const isRtl = locale === 'ar';
  
  const [loginMethod, setLoginMethod] = useState<"email" | "phone">("email");

  const loginSchema = z.object({
    email: loginMethod === "email" ? z.string().email(tv("email")) : z.string().optional(),
    phone: loginMethod === "phone" ? z.string().min(7, tv("phone")) : z.string().optional(),
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
      phone: "",
      password: "",
    },
  });

  const { isSubmitting } = form.formState;
  
  const onSubmit = async (data: LoginFormValues) => {
    // Map phone to mobile for the backend and strip '+' if present
    const formattedPhone = data.phone?.startsWith("+") ? data.phone.slice(1) : data.phone;
    const payload = loginMethod === "email" 
      ? { email: data.email, password: data.password }
      : { mobile: formattedPhone, password: data.password };

    const res = await login(payload);

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
      <div className="mb-6 flex p-1 bg-muted rounded-lg w-full max-w-sm mx-auto border overflow-hidden shadow-sm">
        <button
          type="button"
          onClick={() => {
            setLoginMethod("email");
            form.clearErrors();
          }}
          className={cn(
            "flex-1 py-2 text-sm font-bold rounded-md transition-all duration-200",
            loginMethod === "email" 
              ? "bg-white dark:bg-slate-900 shadow-sm text-red-700" 
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {tl("email")}
        </button>
        <button
          type="button"
          onClick={() => {
            setLoginMethod("phone");
            form.clearErrors();
          }}
          className={cn(
            "flex-1 py-2 text-sm font-bold rounded-md transition-all duration-200",
            loginMethod === "phone" 
              ? "bg-white dark:bg-slate-900 shadow-sm text-red-700" 
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {tl("phone")}
        </button>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className={`space-y-4 text-start`}>
        {loginMethod === "email" ? (
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <Label>{tl("email")}</Label>
                <Input
                  placeholder="your@email.com"
                  className={`${inputStyle} text-start`}
                  {...field}
                />
                <FormMessage />
              </FormItem>
            )}
          />
        ) : (
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem className="flex flex-col items-start w-full" dir="ltr">
                <Label className={`w-full text-start`}>{tl("phone")}</Label>
                <PhoneInput
                  {...field}
                  defaultCountry="EG"
                  placeholder={tl("phone")}
                />
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <Label>{tl("password")}</Label>
              <Input
                type="password"
                placeholder="******"
                className={`${inputStyle} text-start`}
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

