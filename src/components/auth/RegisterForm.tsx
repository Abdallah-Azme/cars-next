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

const registerSchema = z
  .object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    email: z.string().email({ message: "Invalid email" }),
    role: z.string().min(1, { message: "Role is required" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
    password_confirmation: z
      .string()
      .min(6, { message: "Confirm your password" }),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterForm() {
  const inputStyle = " focus-visible:black";
  const router = useRouter();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
      role: "",
    },
  });
  const { isSubmitting } = form.formState;
  
  const onSubmit = async (data: RegisterFormValues) => {
    const res = await register(data);
    
    if (res?.ok) {
      toast.success(res?.data?.message || "Registration successful");
      router.push("/login");
    } else {
      toast.error(res?.error || "Registration failed");
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 ">
        {/* Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <Label>Name</Label>
              <Input
                className={inputStyle}
                placeholder="Your name"
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
              <Label>Email</Label>
              <Input
                className={inputStyle}
                placeholder="your@email.com"
                {...field}
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
              <Label>Role</Label>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger className="w-full ">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="User">User</SelectItem>
                  <SelectItem value="Viewer">Viewer</SelectItem>
                  <SelectItem value="Moderator">Moderator</SelectItem>
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
              <Label>Password</Label>
              <Input
                className={inputStyle}
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
              <Label>Confirm Password</Label>
              <Input
                className={inputStyle}
                type="password"
                placeholder="******"
                {...field}
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <div>
          <p className="text-sm font-semibold text-end ">
            Already have an account{" "}
            <Link href={"/login"} className="font-bold underline text-red-700">
              Login
            </Link>
          </p>
        </div>

        <Button type="submit" className="w-full h-11" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="animate-spin"/> : "Signup"}
        </Button>
      </form>
    </FormProvider>
  );
}

