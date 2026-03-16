"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { forgotPassword } from "@/lib/actions";
import { toast } from "sonner";
import { Loader2, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const ForgotPasswordSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

export default function ForgotPasswordForm() {
  const router = useRouter();
  const form = useForm<z.infer<typeof ForgotPasswordSchema>>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const { isSubmitting } = form.formState;

  async function onSubmit(data: z.infer<typeof ForgotPasswordSchema>) {
    const res = await forgotPassword(data.email);

    if (res.ok) {
      toast.success(res.data?.message || "Reset code sent to your email.");
      // Pass the code if available, otherwise just redirect
      const query = new URLSearchParams({ email: data.email });
      if (res.data?.data?.reset_code) {
        query.set("code", res.data.data.reset_code.toString());
      }
      router.push(`/verify-reset-code?${query.toString()}`);
    } else {
      toast.error(res.error || "Failed to send reset code.");
    }
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="name@example.com" 
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
            {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Send Reset Code"}
          </Button>
        </form>
      </Form>

      <div className="text-center pt-2">
         <Link href="/login" className="text-sm font-semibold text-gray-500 hover:text-red-700 flex items-center justify-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Login
         </Link>
      </div>
    </div>
  );
}
