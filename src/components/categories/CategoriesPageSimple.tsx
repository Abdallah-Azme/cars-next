"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { Category } from "@/types/categories";
import { useLocale, useTranslations } from "next-intl";

export function CategoriesPageSimple({ categories }: { categories: Category[] }) {
  const locale = useLocale();
  const t = useTranslations("categories");
  const isRtl = locale === 'ar';

  return (
    <div className={`space-y-6 container my-12 ${isRtl ? 'text-right' : 'text-left'}`}>
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h2 className="text-4xl md:text-5xl font-bold text-red-600">
          {t("title")}
        </h2>
        <p className="text-gray-400">
          {t("subtitle")}
        </p>
      </div>

      {categories.length === 0 ? (
        <div className="text-center text-gray-500 py-10">{t("noCategories")}</div>
      ) : (
        <div className="space-y-5">
          {categories?.map((cat) => (
            <Card key={cat?.title} className="overflow-hidden">
              <CardHeader className="p-4 pb-3">
                <div className={`flex items-center gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
                  <div className="flex-1">
                    <div className={`flex items-center justify-between gap-3 ${isRtl ? 'flex-row-reverse' : ''}`}>
                      <h2 className="text-xl font-semibold text-red-600">
                        {cat?.title}
                      </h2>
                      <Badge variant="secondary" className="font-normal shrink-0">
                        {t("subCount", { count: cat?.subCategoriesCount })}
                      </Badge>
                    </div>
                    <p className={`text-sm text-muted-foreground mt-1 ${isRtl ? 'text-right' : ''}`}>
                      {cat?.description}
                    </p>
                  </div>
                </div>
              </CardHeader>

              <Separator />

              <CardContent className="p-4">
                {/* Subcategories grid */}
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {cat?.subCategories?.map((sub) => (
                    <div
                      key={sub?.title}
                      className={`flex items-center gap-3 rounded-lg border p-3 hover:bg-muted/30 transition-colors ${isRtl ? 'flex-row-reverse justify-end' : 'justify-start'}`}
                    >
                      <div className={`min-w-0 ${isRtl ? 'text-right' : 'text-left'}`}>
                        <div className="truncate text-red-600 font-medium">
                          {sub?.title}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {sub?.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
