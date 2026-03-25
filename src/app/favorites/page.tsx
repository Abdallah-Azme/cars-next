import FavoraitesPage from "@/views/FavoraitesPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Favorites",
};

export default function Page() {
  return <FavoraitesPage />;
}
