import SingleProductPage from "@/views/SingleProductPage";
import { getSingleVehicle } from "@/lib/actions";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const res = await getSingleVehicle(id);
  const vehicle = res.data?.data;

  if (!vehicle) return { title: "Vehicle Not Found" };

  return {
    title: `${vehicle.maker} ${vehicle.model}`,
    description: vehicle.equipment || `Check out this ${vehicle.maker} ${vehicle.model} on our platform.`,
    openGraph: {
      images: vehicle.images?.[0]?.download_url ? [vehicle.images[0].download_url] : [],
    },
  };
}

export default function Page() {
  return <SingleProductPage />;
}
