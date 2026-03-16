import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { Category } from "@/types/categories";


export function CategoriesPageSimple( {categories}:{categories:Category[]}) {


  return (
    <div className="space-y-6 container my-12">
      {/* Header */}
      <div className=" flex flex-col gap-2 ">
        <h2 className="text-4xl md:text-5xl font-bold text-red-600">
          Equipment Categories
        </h2>
        <p className=" text-gray-400">
          Browse our wide range of heavy machinery solutions.
        </p>
      </div>
      {categories.length === 0 ? (
        <div className="text-center text-gray-500">No categories found</div>
      ) : (
        <div className="space-y-5">
          {categories?.map((cat) => (
            <Card key={cat?.title} className="overflow-hidden">
              <CardHeader className="p-4 pb-3">
                <div className="flex items-center gap-3">
                  {/* Category name */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <h2 className="text-xl font-semibold text-red-600">
                        {cat?.title}
                      </h2>
                      <Badge variant="secondary" className="font-normal">
                        {cat?.subCategoriesCount} sub
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
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
                      className="flex items-center gap-3 rounded-lg border p-3 hover:bg-muted/30 transition-colors"
                    >

                      <div className="min-w-0">
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
