"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import FallbackImage from "@/components/shared/FallbackImage";

const ForgotPasswordPage = () => {
  return (
    <div className="min-h-screen container flex items-center justify-center py-12 px-4 shadow-sm">
      <Card className="lg:w-1/3 w-full shadow-lg border-none ring-1 ring-gray-100">
        <CardHeader className="flex flex-col items-center gap-1">
          <FallbackImage 
            src="/logo-icon.jpeg" 
            alt="logo" 
            width={112}
            height={112}
            className="w-28 h-auto object-contain mb-2" 
          />
          <CardTitle className="text-2xl font-bold">
            Forgot Password
          </CardTitle>
          <CardDescription className="text-center px-4">
            Enter your email address and we&apos;ll send you a 6-digit code to reset your password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ForgotPasswordForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPasswordPage;
