"use client";

import RegisterForm from "@/components/auth/RegisterForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTranslations } from "next-intl";

const RegisterPage = () => {
  const t = useTranslations("auth.register");

  return (
    <div className="min-h-screen container flex items-center justify-center py-10">
      <Card className="lg:w-1/3 w-full">
        <CardHeader className="flex flex-col items-center gap-1 text-center">
          <img src="/logo-icon.jpeg" alt="logo" className="w-36" />
          <CardTitle className="text-2xl font-bold">
            {t("header")}
          </CardTitle>
          <CardDescription>
            {t("subtitle")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RegisterForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterPage;
