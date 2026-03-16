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

const ResetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  password_confirmation: z.string(),
}).refine((data) => data.password === data.password_confirmation, {
  message: "Passwords don't match",
  path: ["password_confirmation"],
});

function ResetPasswordFormContent() {
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
      toast.success(res.data?.message || "Password updated successfully.");
      router.push("/login");
    } else {
      toast.error(res.error || "Failed to update password.");
    }
  }

  if (!token) {
    return (
        <div className="text-center p-6 space-y-4">
            <p className="text-red-600 font-semibold">Invalid or missing reset token.</p>
            <Button variant="outline" onClick={() => router.push("/forgot-password")}>
                Go back to Forgot Password
            </Button>
        </div>
    );
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input 
                    type="password" 
                    placeholder="********" 
                    className="h-11 focus-visible:ring-red-600" 
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
                <FormLabel>Confirm New Password</FormLabel>
                <FormControl>
                  <Input 
                    type="password" 
                    placeholder="********" 
                    className="h-11 focus-visible:ring-red-600" 
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
            {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Reset Password"}
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
        <p className="text-sm text-muted-foreground animate-pulse">Loading...</p>
      </div>
    }>
      <ResetPasswordFormContent />
    </Suspense>
  );
}
