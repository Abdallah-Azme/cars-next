"use client";

import { getCategories } from "@/lib/actions";
import { CategoriesPageSimple } from "@/components/categories/CategoriesPageSimple";
import { PaginationControls } from "@/components/products/Pagination";
import EmailSubscription from "@/components/shared/EmailBox";
import PageHeader from "@/components/shared/PageHeader";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const CategoriesPage = () => {
  const [page, setPage] = useState(1);
  const { data } = useQuery({
    queryKey: ["categories", page],
    queryFn: () => getCategories(), // Assume getCategories can take page if needed, or just update the action
  });

  const categories = data?.data?.data?? [];
  const pagination = data?.data?.pagination;
  return (
    <>
      <PageHeader title="Categories" />
      <CategoriesPageSimple categories={categories} />

      {/* Pagination */}
      {pagination && (
        <div className="container">
          <PaginationControls pagination={pagination} onPageChange={setPage} />
        </div>
      )}
      <EmailSubscription />
    </>
  );
};

export default CategoriesPage;

