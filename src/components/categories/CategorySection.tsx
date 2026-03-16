"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import CategoryCard from "./CategoryCard";
import { getCategories } from "@/lib/actions";
import { useQuery } from "@tanstack/react-query";
import type { Category } from "@/types/categories";

export default function CategorySection() {
  const { data } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategories(),
  });

  const categories = data?.data?.data ?? [];

  return (
    <section className="bg-primary py-4">
      <div className="container">
        {/* Slider */}
        <Carousel
          opts={{ align: "start", loop: true }}
          className="w-full flex flex-col gap-6"
        >
          <div className="flex items-center justify-between gap-4">
            {/* Header */}
            <h2 className="text-2xl font-bold text-red-600">Categories</h2>
            <div className="flex items-center gap-2">
              <CarouselPrevious className="bg-red-600 border-none text-white size-8! static translate-x-0 translate-y-0" />
              <CarouselNext className="bg-red-600 border-none text-white size-8! static translate-x-0 translate-y-0" />
            </div>
          </div>
          <CarouselContent>
            {categories.map((category: Category, index: number) => (
              <CarouselItem
                key={index}
                className="basis-1/3 sm:basis-1/4 lg:basis-1/5 xl:basis-1/6"
              >
                <CategoryCard category={category} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}
