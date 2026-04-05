"use client";

import { getCategories } from "@/lib/actions";
import { CategoriesPageSimple } from "@/components/categories/CategoriesPageSimple";
import { PaginationControls } from "@/components/products/Pagination";
import EmailSubscription from "@/components/shared/EmailBox";
import PageHeader from "@/components/shared/PageHeader";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslations } from "next-intl";

const CategoriesPage = () => {
  const [page, setPage] = useState(1);
  const t = useTranslations("Vehicle.categoriesPage");
  
  const { data } = useQuery({
    queryKey: ["categories", page],
    queryFn: () => getCategories(),
  });

  const categories = data?.data?.data?? [];
  const pagination = data?.data?.pagination;

  return (
    <>
      <PageHeader title={t("title")} />
      <div className="container py-10 flex flex-col gap-10 text-start">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <h2 className="text-4xl md:text-5xl font-bold text-red-600">
              {t("header")}
            </h2>
            <p className="text-gray-400">
              {t("subtitle")}
            </p>
          </div>
        </div>
      </div>
      
      <CategoriesPageSimple categories={categories} />

      {/* Pagination */}
      {pagination && pagination.last_page > 1 && (
        <div className="container">
          <PaginationControls pagination={pagination} onPageChange={setPage} />
        </div>
      )}
      <EmailSubscription />
    </>
  );
};

export default CategoriesPage;

