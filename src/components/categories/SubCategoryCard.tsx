import { Link } from "@/i18n/routing";
import type { ChildCategory } from "@/lib/actions";
import FallbackImage from "../shared/FallbackImage";
import { ArrowUpRight } from "lucide-react";
import { useLocale } from "next-intl";
import { getCategoryName } from "@/lib/utils";

export default function SubCategoryCard({
  category,
  parentId,
}: {
  category: ChildCategory;
  parentId: number;
}) {
  const locale = useLocale();
  return (
    <Link
      href={`/products?parentId=${parentId}&childId=${category.id}`}
      className="group relative block w-full max-w-[350px] aspect-4/3 rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
    >
      <FallbackImage
        src={category.image || ""}
        alt={getCategoryName(category, locale)}
        width={600}
        height={450}
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
      />
      {/* Gradient Overlay for text readability */}
      <div className="absolute inset-0 bg-linear-to-t from-black/20 via-black/10 to-black/60 pointer-events-none" />

      {/* Text Container at Top */}
      <div className="absolute top-0 inset-x-0 p-5 flex flex-col items-center">
        <h3 className="text-xl md:text-2xl font-bold text-white drop-shadow-md flex items-center justify-center  text-center">
          - {getCategoryName(category, locale)} -
        </h3>
        {category.vehiclesCount !== undefined && (
          <p className="text-sm font-medium text-white/90 drop-shadow mt-1">
            ({category.vehiclesCount})
          </p>
        )}
      </div>

      {/* Arrow Button at Bottom Left/Right depending on direction */}
      <div className="absolute bottom-4 left-4 rtl:left-auto rtl:right-4 bg-[#0168b4] group-hover:bg-[#015392] transition-colors duration-300 w-10 md:w-12 h-10 md:h-12 rounded-full flex items-center justify-center shadow-lg">
        <ArrowUpRight className="text-white w-5 h-5 rtl:scale-x-[-1]" />
      </div>
    </Link>
  );
}
