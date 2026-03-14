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

const passwordSchema = z
  .object({
    new_password: z.string().min(8, "Password must be at least 8 characters"),
    new_password_confirmation: z.string(),
  })
  .refine((data) => data.new_password === data.new_password_confirmation, {
    message: "Passwords don't match",
    path: ["new_password_confirmation"],
  });

export type ChangePasswordFormValues = z.infer<typeof passwordSchema>;

export default function ChangePasswordForm() {
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
      toast.success(res?.data?.message || "Password changed successfully");
      form.reset();
    } else {
      toast.error(res?.error || "Failed to change password");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="new_password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
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
              <FormLabel>Confirm New Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
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
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            "Change Password"
          )}
        </Button>
      </form>
    </Form>
  );
}

