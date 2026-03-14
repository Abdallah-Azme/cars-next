import RegisterForm from "@/components/auth/RegisterForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
const RegisterPage = () => {
  return (
    <div className="min-h-screen container flex items-center justify-center">
      <Card className="lg:w-1/3 w-full">
        <CardHeader className="flex flex-col items-center gap-1 ">
          <img src="/logo-icon.jpeg" alt="logo" className="w-36" />
          <CardTitle className="text-2xl font-bold">
            Create your account
          </CardTitle>
          <CardDescription>
            Enter your data below to create  your account
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
