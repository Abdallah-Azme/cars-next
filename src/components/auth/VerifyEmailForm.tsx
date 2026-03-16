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
import { cn } from "@/lib/utils"; // Assuming cn utility is available from lib/utils

const FormSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email.",
  }),
  code: z.string().length(6, {
    message: "Code must be exactly 6 digits.",
  }),
});

function VerifyEmailFormContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [countdown, setCountdown] = useState(0);
  const [isResending, setIsResending] = useState(false);

  const emailParam = searchParams.get("email") || "";
  const codeParam = searchParams.get("code") || "";

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: emailParam,
      code: codeParam,
    },
  });

  useEffect(() => {
    if (codeParam) {
      form.setValue("code", codeParam);
    }
    if (emailParam) {
      form.setValue("email", emailParam);
    }
  }, [codeParam, emailParam, form]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const res = await verifyEmail(data);

    if (res.ok) {
      toast.success(res.data?.message || "Email verified successfully.");
      router.push("/login");
    } else {
      toast.error(res.error || "Email verification failed.");
    }
  }

  async function handleResend() {
    const email = form.getValues("email");
    if (!email) {
      toast.error("Email is required to resend verification code.");
      return;
    }

    setIsResending(true);
    const res = await resendVerification(email);
    setIsResending(false);

    if (res.ok) {
      toast.success(res.data?.message || "Verification code resent.");
      setCountdown(30);
    } else {
      toast.error(res.error || "Failed to resend code.");
    }
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Email is hidden but stays in the form state for submission */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <input type="hidden" {...field} />
            )}
          />

          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem className="flex flex-col items-center space-y-6">
                <div className="flex items-center justify-between w-full px-2">
                  <FormLabel className="text-base font-bold">Verification code</FormLabel>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    type="button" 
                    onClick={handleResend}
                    disabled={countdown > 0 || isResending}
                    className="rounded-full h-8 text-xs font-semibold gap-2 border-gray-200 transition-all active:scale-95"
                  >
                    {isResending ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <RefreshCw className={cn("w-3 h-3", countdown > 0 && "opacity-50")} />
                    )}
                    {countdown > 0 ? `Resend in ${countdown}s` : "Resend Code"}
                  </Button>
                </div>
                <FormControl>
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
                <span>Verifying...</span>
              </div>
            ) : (
              "Complete Verification"
            )}
          </Button>
        </form>
      </Form>

      <div className="text-center pt-4 border-t border-gray-100">
         <p className="text-sm text-gray-500">
            Already verified?{" "}
            <Button variant="link" onClick={() => router.push("/login")} className="p-0 h-auto font-bold text-red-700 hover:text-red-800 underline">
               Login here
            </Button>
         </p>
      </div>
    </div>
  );
}

export default function VerifyEmailForm() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center p-12 space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-red-700" />
        <p className="text-sm text-muted-foreground animate-pulse">Loading verification details...</p>
      </div>
    }>
      <VerifyEmailFormContent />
    </Suspense>
  );
}
