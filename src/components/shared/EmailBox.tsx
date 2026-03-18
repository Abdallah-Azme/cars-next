"use client";

import { subscribeNewsletter } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export interface EmailFormData {
  email: string;
}

export default function EmailSubscription() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<EmailFormData>();

  const onSubmit = async (data: EmailFormData) => {
    const res = await subscribeNewsletter(data.email);
    if (res?.ok) {
      toast.success(res?.data?.message || "Subscribed successfully!");
      reset();
    } else {
      toast.error(res?.error || "Subscription failed");
    }
  };

  return (
    <section className=" py-10">
      <div className="container">
        <div className=" bg-primary rounded-lg">
          <div className="py-12 px-6 md:px-16 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-red-600">
              Stay Updated
            </h2>

            <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
              Subscribe to receive the latest heavy equipment arrivals, rental
              offers, and project updates.
            </p>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="mt-8 flex flex-col sm:flex-row gap-4 justify-center max-w-xl mx-auto"
            >
              <div className="w-full text-left">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  className=" text-white"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white font-semibold px-8"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Subscribe"
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
