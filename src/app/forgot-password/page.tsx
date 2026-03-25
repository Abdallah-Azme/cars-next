import ForgotPasswordPage from "@/views/ForgotPasswordPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Reset your account password",
};

export default function Page() {
  return <ForgotPasswordPage />;
}
