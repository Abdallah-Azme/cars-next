"use client";

import { getFavorites } from "@/lib/actions";
import { FavCard } from "@/components/products/FavCard";
import EmailSubscription from "@/components/shared/EmailBox";
import PageHeader from "@/components/shared/PageHeader";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import type { VehicleData } from "@/types/vehicles";

const FavoraitesPage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["favorites"],
    queryFn: () => getFavorites(),
  });

  const vehicles = data?.data?.data ?? [];
  
  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin" />
      </div>
    );
    
  return (
    <>
      <PageHeader title="Favorites" />
      <div className="container py-20 flex flex-col gap-10">
        <div className="flex flex-col gap-4">
          <div className=" flex flex-col gap-2 ">
            <h2 className="text-4xl md:text-5xl font-bold text-red-600">
              Your favorites
            </h2>
            <p className=" text-gray-400">
              Here are the machines you&apos;ve added to your favorites.
            </p>
          </div>
        </div>

        {vehicles.length === 0 ? (
          <div className="flex justify-center items-center py-12">
            <p className="text-2xl font-bold text-red-600">
              No favorites found
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {vehicles.map((vehicle: VehicleData) => (
              <FavCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        )}
      </div>
      <EmailSubscription />
    </>
  );
};


export default FavoraitesPage;
