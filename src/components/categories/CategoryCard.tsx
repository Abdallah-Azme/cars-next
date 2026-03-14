import type { Category } from "@/types/categories";
import Link from "next/link";
import FallbackImage from "../shared/FallbackImage";

export default function CategoryCard({category}: {category: Category}) {
  return (
    <Link href={`/categories`} className="flex flex-col gap-2 items-center group cursor-pointer">
      <div className="relative size-50 overflow-hidden border-2 border-background rounded-full flex items-center justify-center group-hover:border-red-600 transition-colors duration-500">
        <FallbackImage
          src={category?.image}
          alt={category?.title || "category"}
          width={144}
          height={144}
          className="w-36 object-contain group-hover:scale-110 transition-transform duration-500"
        />
      </div>
      <h3 className="text-lg font-semibold text-white group-hover:text-red-600 transition-colors duration-500">
        {category?.title}
      </h3>
    </Link>
  );
}

