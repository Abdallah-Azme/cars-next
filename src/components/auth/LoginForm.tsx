"use client";

import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { login } from "@/lib/actions";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "@/stores/user";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
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
      toast.success(res?.data?.message || "Login successful");
      
      setAuth({
        token: accessToken,
        user,
      });
      
      router.push("/");
      router.refresh(); // Refresh to update server-side auth state
    } else {
      toast.error(res?.error || "Login failed");
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
                placeholder="your@email.com"
                className={inputStyle}
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
                className={inputStyle}
                {...field}
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <p className="text-sm font-semibold text-end ">
            Don&apos;t have an account{" "}
            <Link href={"/register"} className="font-bold underline text-red-700">
              Signup
            </Link>
          </p>
        </div>
        <Button type="submit" className="w-full h-11 " disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className=" animate-spin" /> : "Login"}
        </Button>
      </form>
    </FormProvider>

  );
}

