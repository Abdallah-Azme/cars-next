import VerifyEmailForm from "@/components/auth/VerifyEmailForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import FallbackImage from "@/components/shared/FallbackImage";

const VerifyEmailPage = () => {
  return (
    <div className="min-h-screen container flex items-center justify-center py-12">
      <Card className="lg:w-1/3 w-full shadow-lg border-none ring-1 ring-gray-100">
        <CardHeader className="flex flex-col items-center gap-1">
          <FallbackImage 
            src="/logo-icon.jpeg" 
            alt="logo" 
            width={144} 
            height={144} 
            className="w-36 h-auto object-contain mb-2" 
            priority
          />
          <CardTitle className="text-2xl font-bold text-center">
            Verify Your Email
          </CardTitle>
          <CardDescription className="text-center">
            We&apos;ve sent a 6-digit verification code to your email.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <VerifyEmailForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmailPage;
