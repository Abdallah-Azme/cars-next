import ProfilePage from "@/views/ProfilePage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile",
};

export default function Page() {
  return <ProfilePage />;
}
