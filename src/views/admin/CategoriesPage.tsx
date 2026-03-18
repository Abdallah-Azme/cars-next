"use client";

import { getCategories } from "@/lib/actions";
import { CategoriesPageSimple } from "@/components/admin/categories/CategoriesPageSimple";
import { PaginationControls } from "@/components/products/Pagination";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { CategoriesSResponse } from "@/types/categories";

const CategoriesPage = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useQuery<CategoriesSResponse>({
    queryKey: ["categories", page],
    queryFn: async () => {
      const res = await getCategories();
      if (!res.ok) throw new Error(res.error);
      return res.data;
    },
  });

  const categories = data?.data || [];
  const pagination = data?.pagination;

  return (
    <div className="flex flex-col gap-4 container mx-auto py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-red-700">
          Equipment Categories
        </h1>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-700"></div>
        </div>
      ) : (
        <>
          <CategoriesPageSimple categories={categories} />
          {pagination && pagination.last_page > 1 && (
            <div className="mt-8 flex justify-end">
              <PaginationControls
                pagination={pagination}
                onPageChange={setPage}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CategoriesPage;
