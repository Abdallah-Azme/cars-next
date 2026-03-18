"use client";

import { getVehicles } from "@/lib/actions";
import { useQuery } from "@tanstack/react-query";
import { ProductCard } from "./ProductCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function ProductCarousel() {
  const { data, isLoading } = useQuery({
    queryKey: ["vehicles", "home-carousel"],
    queryFn: () => getVehicles({ page: 1 }),
  });

  const vehicles = data?.data?.data?.vehicles ?? [];

  return (
    <section className="container py-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="space-y-3">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black tracking-tight text-neutral-900"
          >
            Featured <span className="text-red-600">Machines</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-neutral-500 text-lg max-w-2xl"
          >
            Explore our curated selection of high-performance heavy machinery
            and commercial vehicles.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <Link
            href="/products"
            className="group flex items-center gap-2 px-6 py-3 bg-neutral-900 text-white rounded-full font-bold transition-all hover:bg-red-600 hover:scale-105 active:scale-95"
          >
            Explore All
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>

      <div className="relative group">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-[400px] rounded-2xl bg-neutral-100 animate-pulse"
              />
            ))}
          </div>
        ) : vehicles.length === 0 ? (
          <div className="text-center py-10 rounded-3xl border-2 border-dashed border-neutral-200">
            <p className="text-neutral-400 font-medium text-lg">
              No vehicles found in our current inventory.
            </p>
          </div>
        ) : (
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4 md:-ml-6">
              {vehicles.map((vehicle, i) => (
                <CarouselItem
                  key={vehicle.id || i}
                  className="pl-4 md:pl-6 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <ProductCard vehicle={vehicle} />
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Custom styled navigation buttons that appear on hover */}
            <div className="hidden md:block">
              <CarouselPrevious className="absolute -left-16 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full border-neutral-200 bg-white shadow-lg transition-all hover:bg-neutral-50 hover:scale-110 active:scale-95 opacity-0 group-hover:opacity-100" />
              <CarouselNext className="absolute -right-16 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full border-neutral-200 bg-white shadow-lg transition-all hover:bg-neutral-50 hover:scale-110 active:scale-95 opacity-0 group-hover:opacity-100" />
            </div>

            {/* Mobile navigation or indicator could go here if needed */}
          </Carousel>
        )}
      </div>
    </section>
  );
}
