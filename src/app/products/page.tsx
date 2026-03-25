import ProductPage from "@/views/ProductPage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Machines",
};

export default function Page() {
  return <ProductPage />;
}
