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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { register } from "@/lib/actions";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { PhoneInput } from "../ui/phone-input";
import { useLocale, useTranslations } from "next-intl";

export default function RegisterForm() {
  const locale = useLocale();
  const t = useTranslations("auth.register");
  const tl = useTranslations("auth.labels");
  const tr = useTranslations("auth.roles");
  const tv = useTranslations("auth.validation");
  const isRtl = locale === 'ar';

  const registerSchema = z
    .object({
      name: z.string().min(2, { message: tv("required") }),
      email: z.string().email({ message: tv("email") }),
      phone: z.string().min(7, { message: tv("required") }),
      role: z.string().min(1, { message: tv("required") }),
      password: z
        .string()
        .min(6, { message: tv("password") })
        .regex(/[a-z]/, { message: tv("password") })
        .regex(/[A-Z]/, { message: tv("password") }),
      password_confirmation: z
        .string()
        .min(6, { message: tv("required") }),
    })
    .refine((data) => data.password === data.password_confirmation, {
      message: tv("match"),
      path: ["password_confirmation"],
    });

  type RegisterFormValues = z.infer<typeof registerSchema>;

  const inputStyle = " focus-visible:black";
  const router = useRouter();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      password_confirmation: "",
      role: "",
    },
  });
  const { isSubmitting } = form.formState;
  
  const onSubmit = async (data: RegisterFormValues) => {
    // Map phone to mobile for the backend - maintain original format (with +) for register
    const { phone, ...rest } = data;
    const res = await register({ ...rest, mobile: phone });
    
    if (res?.ok) {
      toast.success(res?.data?.message || t("success"));
      const email = res.data?.data?.user?.email || data.email;
      const code = res.data?.data?.verificationCode;
      const mobile = data.phone;
      
      const params = new URLSearchParams();
      params.set("email", email);
      if (code) params.set("code", code);
      if (mobile) params.set("mobile", mobile);
      
      router.push(`/verify-email?${params.toString()}`);
    } else {
      toast.error(res?.error || t("failed"));
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={`space-y-4 text-start`}>
        {/* Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <Label>{tl("name")}</Label>
              <Input
                className={`${inputStyle} text-start`}
                placeholder={tl("name")}
                {...field}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <Label>{tl("email")}</Label>
              <Input
                className={`${inputStyle} text-start`}
                placeholder="your@email.com"
                {...field}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Phone */}
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
        {/* role */}
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <Label>{tr("label")}</Label>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className={`w-full`}>
                  <SelectValue placeholder={tr("placeholder")} />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="User">{tr("user")}</SelectItem>
                  <SelectItem value="Viewer">{tr("viewer")}</SelectItem>
                  <SelectItem value="Moderator">{tr("moderator")}</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Password */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <Label>{tl("password")}</Label>
              <Input
                className={`${inputStyle} text-start`}
                type="password"
                placeholder="******"
                {...field}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Confirm Password */}
        <FormField
          control={form.control}
          name="password_confirmation"
          render={({ field }) => (
            <FormItem>
              <Label>{tl("confirmPassword")}</Label>
              <Input
                className={`${inputStyle} text-start`}
                type="password"
                placeholder="******"
                {...field}
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <div>
          <p className={`text-sm font-semibold ${isRtl ? 'text-start' : 'text-end'}`}>
            {t("hasAccount")}{" "}
            <Link href={"/login"} className="font-bold underline text-red-700">
              {useTranslations("auth.login")("submit")}
            </Link>
          </p>
        </div>

        <Button type="submit" className="w-full h-11" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="animate-spin"/> : t("submit")}
        </Button>
      </form>
    </FormProvider>
  );
}

