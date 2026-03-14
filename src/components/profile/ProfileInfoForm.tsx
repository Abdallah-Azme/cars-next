"use client";

import { updateProfile } from "@/lib/actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { useAuthStore } from "@/stores/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, Loader2 } from "lucide-react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
});

export default function ProfileInfoForm() {
  const { user, setAuth, token } = useAuthStore();

  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    user?.avatar || null,
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
    },
  });

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;

    if (!file) return;

    setSelectedFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const { isSubmitting } = form.formState;

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

async function onSubmit(values: z.infer<typeof profileSchema>) {
  try {
    const formData = new FormData();
    formData.append("name", values.name);

    if (selectedFile) {
      formData.append("avatar", selectedFile);
    }


    const res = await updateProfile(formData);

    if (res?.ok && res.data?.data?.user) {
      toast.success(res.data.message);
      setAuth({ token: token!, user: res.data.data.user });
    } else {
      toast.error(res?.error || "Failed to update profile");
    }
  } catch (error) {
    console.log(error);
    toast.error("Something went wrong");
  }
}

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-4">
        <div className="relative group">
          <Avatar className="h-32 w-32 border-4 border-muted">
            <AvatarImage src={avatarPreview || ""} className="object-cover" />
            <AvatarFallback className="text-2xl bg-red-700 text-white">
              {user?.name?.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <button
            type="button"
            onClick={handleAvatarClick}
            className="absolute bottom-0 right-0 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors shadow-lg"
          >
            <Camera size={18} />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={onFileChange}
          />
        </div>

        <div className="text-center">
          <h3 className="text-lg font-medium">{user?.name}</h3>
          <p className="text-sm text-muted-foreground capitalize">
            {user?.role}
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-2">
            <FormLabel>Email</FormLabel>
            <Input value={user?.email || ""} disabled className="bg-muted" />
            <p className="text-[0.8rem] text-muted-foreground">
              Email cannot be changed.
            </p>
          </div>

          <div className="space-y-2">
            <FormLabel>Role</FormLabel>
            <Input
              value={user?.role || ""}
              disabled
              className="bg-muted capitalize"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Update Profile"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}

