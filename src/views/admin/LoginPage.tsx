import LoginForm from "@/components/admin/auth/LoginForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/admin/ui/card";
import Image from "next/image";

const LoginPage = () => {
  return (
    <div className="min-h-screen container flex items-center justify-center p-4">
      <Card className="lg:w-1/3 w-full shadow-2xl">
        <CardHeader className="flex flex-col items-center gap-4">
          <Image src="/logo-icon.jpeg" alt="logo" width={144} height={144} className="rounded-lg"/>
          <div className="text-center space-y-1">
            <CardTitle className="text-2xl font-bold">Admin Dashboard</CardTitle>
            <CardDescription>
              Login to manage auctions and users
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <LoginForm/>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
