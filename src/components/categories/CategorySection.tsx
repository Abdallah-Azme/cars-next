"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import SubCategoryCard from "./SubCategoryCard";
import { getParentCategories } from "@/lib/actions";
import { useQuery } from "@tanstack/react-query";
import type { ParentCategory } from "@/lib/actions";

export default function CategorySection() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["parentCategories"],
    queryFn: () => getParentCategories(),
  });

  console.log({ data });
  const parentCategories: ParentCategory[] = data?.data?.data ?? [];

  // Flatten out all subcategories
  const subCategories = parentCategories.flatMap((parent) =>
    (parent.children || []).map((child) => ({
      ...child,
      parentId: parent.id,
    })),
  );

  if (isLoading) {
    return <div className="py-20 text-center">Loading categories...</div>;
  }

  if (error) {
    return (
      <div className="py-20 text-center text-red-500">
        Error loading categories
      </div>
    );
  }

  if (subCategories.length === 0) {
    return <div className="py-20 text-center">No categories found.</div>;
  }

  return (
    <section className="bg-slate-50/50 dark:bg-slate-900/50 py-8 md:py-10 my-6 md:my-8 border-y border-slate-100 dark:border-slate-800 overflow-x-clip">
      <div className="container relative group/section space-y-8">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl md:text-4xl font-bold text-red-600">
            Browse by Subcategory
          </h2>
          <p className="text-gray-400">
            Find the perfect vehicle or equipment from our extensive
            subcategories
          </p>
        </div>
        {/* Slider */}
        <Carousel
          opts={{ align: "center", loop: true, dragFree: true }}
          className="w-full flex flex-col gap-6"
        >
          <CarouselContent className="items-center -ml-4">
            {subCategories.map((sub, index) => (
              <CarouselItem
                key={index}
                className="pl-4 basis-[80%] sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5 flex justify-center"
              >
                <SubCategoryCard category={sub} parentId={sub.parentId} />
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Navigation Arrows, hidden on mobile to avoid overflow */}
          <div className="absolute top-1/2 -translate-y-1/2 inset-x-0 hidden md:flex justify-between pointer-events-none opacity-0 group-hover/section:opacity-100 transition-opacity duration-300">
            <CarouselPrevious className="pointer-events-auto bg-white/80 hover:bg-white text-blue-600 border-none shadow-md size-12" />
            <CarouselNext className="pointer-events-auto bg-white/80 hover:bg-white text-blue-600 border-none shadow-md size-12" />
          </div>
        </Carousel>
      </div>
    </section>
  );
}
