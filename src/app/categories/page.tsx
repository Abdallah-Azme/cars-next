import CategoriesPage from "@/views/CategoriesPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Categories",
};

export default function Page() {
  return <CategoriesPage />;
}
