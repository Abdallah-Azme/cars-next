import ResetPasswordPage from "@/views/ResetPasswordPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Set your new account password",
};

export default function Page() {
  return <ResetPasswordPage />;
}
