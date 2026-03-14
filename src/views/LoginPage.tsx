import LoginForm from "@/components/auth/LoginForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
const LoginPage = () => {
  return (
    <div className="min-h-screen container flex items-center justify-center">
      <Card className="lg:w-1/3 w-full">
        <CardHeader className="flex flex-col items-center gap-1 ">
          <img src="/logo-icon.jpeg" alt="logo" className="w-36"/>
          <CardTitle className="text-2xl font-bold">Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm/>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
