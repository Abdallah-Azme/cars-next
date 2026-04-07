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
import { cn } from "@/lib/utils";
import { PhoneInput } from "@/components/ui/phone-input";

export default function LoginForm() {
  const [isPending, setIsPending] = useState(false);
  const [loginMethod, setLoginMethod] = useState<"email" | "phone">("email");
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const loginSchema = z.object({
    email: loginMethod === "email" ? z.string().email({ message: "Invalid email address" }) : z.string().optional(),
    phone: loginMethod === "phone" ? z.string().min(7, { message: "Phone number is too short" }) : z.string().optional(),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  });

  type LoginFormValues = z.infer<typeof loginSchema>;

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      phone: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsPending(true);
    try {
      const formattedPhone = data.phone?.startsWith("+") ? data.phone.slice(1) : data.phone;
      const payload = loginMethod === "email" 
        ? { email: data.email, password: data.password }
        : { mobile: formattedPhone, password: data.password };

      const res = await login(payload);
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
    } catch {
       toast.error("Login Error", {
        description: "An unexpected error occurred. Please check your connection."
      });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <FormProvider {...form}>
      <div className="mb-6 flex p-1 bg-gray-100 dark:bg-slate-800 rounded-lg w-full border overflow-hidden shadow-sm">
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
              : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-100"
          )}
        >
          Email
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
              : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-100"
          )}
        >
          Phone
        </button>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {loginMethod === "email" ? (
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
        ) : (
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem className="flex flex-col items-start w-full" dir="ltr">
                <Label className="w-full text-left">Phone Number</Label>
                <PhoneInput
                  {...field}
                  defaultCountry="EG"
                  placeholder="Phone Number"
                  disabled={isPending}
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
