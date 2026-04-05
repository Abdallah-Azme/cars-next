"use client";

import { subscribeNewsletter } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export interface EmailFormData {
  email: string;
}

export default function EmailSubscription() {
  const t = useTranslations("HomePage.newsletter");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<EmailFormData>();

  const onSubmit = async (data: EmailFormData) => {
    const res = await subscribeNewsletter(data.email);
    if (res?.ok) {
      toast.success(res?.data?.message || t("success"));
      reset();
    } else {
      toast.error(res?.error || t("error"));
    }
  };

  return (
    <section className=" py-10">
      <div className="container">
        <div className=" bg-primary rounded-lg">
          <div className="py-12 px-6 md:px-16 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-red-600">
              {t("title")}
            </h2>

            <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
              {t("subtitle")}
            </p>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="mt-8 flex flex-col sm:flex-row gap-4 justify-center max-w-xl mx-auto"
            >
              <div className="w-full text-left">
                <Input
                  type="email"
                  placeholder={t("placeholder")}
                  className=" text-white"
                  {...register("email", {
                    required: t("emailRequired"),
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: t("invalidEmail"),
                    },
                  })}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.email.message as string}
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
                  t("button")
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
