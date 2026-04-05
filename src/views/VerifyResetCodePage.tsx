"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import VerifyResetCodeForm from "@/components/auth/VerifyResetCodeForm";
import FallbackImage from "@/components/shared/FallbackImage";
import { useTranslations } from "next-intl";

const VerifyResetCodePage = () => {
  const t = useTranslations("auth.verifyResetCode");

  return (
    <div className="min-h-screen container flex items-center justify-center py-12">
      <Card className="lg:w-1/3 w-full shadow-lg border-none ring-1 ring-gray-100">
        <CardHeader className="flex flex-col items-center gap-1">
          <FallbackImage 
            src="/logo-icon.jpeg" 
            alt="logo" 
            width={112}
            height={112}
            className="w-28 h-auto object-contain mb-2" 
          />
          <CardTitle className="text-2xl font-bold text-center">
            {t("header")}
          </CardTitle>
          <CardDescription className="text-center px-4">
            {t("subtitle")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <VerifyResetCodeForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyResetCodePage;
