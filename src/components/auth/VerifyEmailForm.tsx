"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, Suspense, useState } from "react";
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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { verifyEmail, resendVerification } from "@/lib/actions";
import { toast } from "sonner";
import { Loader2, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

function VerifyEmailFormContent() {
  const locale = useLocale();
  const t = useTranslations("auth.verifyEmail");
  const tv = useTranslations("auth.validation");
  const isRtl = locale === 'ar';
  
  const FormSchema = z.object({
    email: z.string().email({
      message: tv("email"),
    }),
    code: z.string().length(6, {
      message: tv("required"),
    }),
    mobile: z.string().optional(),
  });

  const searchParams = useSearchParams();
  const router = useRouter();
  const [countdown, setCountdown] = useState(0);
  const [isResending, setIsResending] = useState(false);

  const emailParam = searchParams.get("email") || "";
  const codeParam = searchParams.get("code") || "";
  const mobileParam = searchParams.get("mobile") || "";

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: emailParam,
      code: codeParam,
      mobile: mobileParam,
    },
  });

  useEffect(() => {
    if (codeParam) {
      form.setValue("code", codeParam);
    }
    if (emailParam) {
      form.setValue("email", emailParam);
    }
    if (mobileParam) {
      form.setValue("mobile", mobileParam);
    }
  }, [codeParam, emailParam, mobileParam, form]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const res = await verifyEmail(data);

    if (res.ok) {
      toast.success(res.data?.message || t("success"));
      router.push("/login");
    } else {
      toast.error(res.error || t("failed"));
    }
  }

  async function handleResend() {
    const email = form.getValues("email");
    const mobile = form.getValues("mobile");
    if (!email) {
      toast.error(tv("email"));
      return;
    }

    setIsResending(true);
    const res = await resendVerification(email, mobile);
    setIsResending(false);

    if (res.ok) {
      toast.success(res.data?.message || t("resendSuccess"));
      setCountdown(30);
    } else {
      toast.error(res.error || t("resendFailed"));
    }
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <input type="hidden" {...field} />
            )}
          />

          <FormField
            control={form.control}
            name="mobile"
            render={({ field }) => (
              <input type="hidden" { ...field } />
            )}
          />

          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem className="flex flex-col items-center space-y-6">
                <div className={`flex items-center justify-between w-full px-2`}>
                  <FormLabel className="text-base font-bold">{t("otpLabel")}</FormLabel>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    type="button" 
                    onClick={handleResend}
                    disabled={countdown > 0 || isResending}
                    className="rounded-full h-8 text-[10px] font-semibold gap-2 border-gray-200 transition-all active:scale-95"
                  >
                    {isResending ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <RefreshCw className={cn("w-3 h-3", countdown > 0 && "opacity-50")} />
                    )}
                    {countdown > 0 
                      ? t("resendIn", { seconds: countdown }) 
                      : t("resendCode")
                    }
                  </Button>
                </div>
                <FormControl>
                  <div dir="ltr">
                    <InputOTP maxLength={6} {...field}>
                      <div className="flex items-center gap-2 sm:gap-6">
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                        </InputOTPGroup>
                        <div className="flex items-center justify-center">
                          <div className="w-3 sm:w-5 h-[2px] bg-neutral-400 rounded-full" />
                        </div>
                        <InputOTPGroup>
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </div>
                    </InputOTP>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            className="w-full h-12 bg-red-700 hover:bg-red-800 text-white font-bold text-base transition-all active:scale-[0.98] shadow-lg shadow-red-700/20" 
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>{t("verifying")}</span>
              </div>
            ) : (
              t("submit")
            )}
          </Button>
        </form>
      </Form>

      <div className={`text-center pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-center gap-1 text-sm text-gray-500`}>
         <span>{t("alreadyVerified")}</span>
         <Link href="/login" className="font-bold text-red-700 hover:text-red-800 underline">
            {t("login")}
         </Link>
      </div>
    </div>
  );
}

export default function VerifyEmailForm() {
    const t = useTranslations("auth.verifyEmail");
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center p-12 space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-red-700" />
        <p className="text-sm text-muted-foreground animate-pulse">{t("verifying")}</p>
      </div>
    }>
      <VerifyEmailFormContent />
    </Suspense>
  );
}
