import type { Category } from "@/types/categories";
import FallbackImage from "../shared/FallbackImage";

export default function CategoryCard({category}: {category: Category}) {
  return (
    <div className="flex flex-col gap-2 items-center group">
      <div className="relative size-32 overflow-hidden border-2 border-border rounded-full flex items-center justify-center group-hover:border-red-600 transition-colors duration-500">
        <FallbackImage
          src={category?.image}
          alt={category?.title || "category"}
          width={96}
          height={96}
          className="w-24 object-contain group-hover:scale-110 transition-transform duration-500"
        />
      </div>
      <h3 className="text-lg font-semibold text-black group-hover:text-red-600 transition-colors duration-500">
        {category?.title}
      </h3>
    </div>
  );
}

