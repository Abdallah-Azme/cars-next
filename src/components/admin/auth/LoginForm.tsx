"use client";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { login } from "@/lib/actions";
import { useAuthStore } from "@/stores/user";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useState } from "react";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsPending(true);
    try {
      const res = await login(data);
      if (res.ok && res.data?.data) {
        const userData = res.data.data.user;
        
        // Ensure only Admins can log in to this dashboard
        if (userData.role !== "Admin") {
          toast.error("Access Denied", {
            description: "You do not have administrative privileges to access this dashboard."
          });
          setIsPending(false);
          return;
        }

        setAuth({
          token: res.data.data.accessToken,
          user: userData,
        });

        toast.success(res.data.message || "Welcome back, Admin!");
        router.replace("/admin");
      } else {
        toast.error("Login Failed", {
          description: res.error || "Invalid credentials. Please try again."
        });
      }
    } catch (error) {
       toast.error("Login Error", {
        description: "An unexpected error occurred. Please check your connection."
      });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <Label>Email</Label>
              <Input
                placeholder="admin@example.com"
                className="h-11 focus-visible:ring-red-600"
                disabled={isPending}
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
              <Label>Password</Label>
              <Input
                type="password"
                placeholder="******"
                className="h-11 focus-visible:ring-red-600"
                disabled={isPending}
                {...field}
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <Button 
          type="submit" 
          className="w-full h-11 bg-red-700 hover:bg-red-800"
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Logging in...
            </>
          ) : (
            "Login"
          )}
        </Button>
      </form>
    </FormProvider>
  );
}
