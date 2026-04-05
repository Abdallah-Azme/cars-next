"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { getParentCategories, getChildCategories, type ParentCategory, type ChildCategory } from "@/lib/actions";
import { HorizontalFilterRow } from "@/components/products/HorizontalFilters";
import { useTranslations } from "next-intl";

export default function HomeHorizontalFilters() {
  const router = useRouter();
  const [selectedParentId, setSelectedParentId] = useState<number | undefined>();
  const t = useTranslations("HomePage");
  const tFilter = useTranslations("Vehicle.inventory.filter");

  // Fetch Parent Categories
  const { data: parentData } = useQuery({
    queryKey: ["parentCategories"],
    queryFn: getParentCategories,
  });

  // Fetch Child Categories when a parent is selected
  const { data: childData } = useQuery({
    queryKey: ["childCategories", selectedParentId],
    queryFn: () => getChildCategories(selectedParentId!),
    enabled: !!selectedParentId,
  });

  const parentCategories: ParentCategory[] = parentData?.data?.data ?? [];
  const childCategories: ChildCategory[] = childData?.data?.data ?? [];

  const handleParentSelect = (name: string, checked: boolean) => {
    const cat = parentCategories.find(p => p.name === name);
    if (cat && checked) {
      setSelectedParentId(cat.id);
    } else {
      setSelectedParentId(undefined);
    }
  };

  const handleChildSelect = (name: string, checked: boolean) => {
    const cat = childCategories.find(c => c.name === name);
    if (cat && checked && selectedParentId) {
      router.push(`/products?parentId=${selectedParentId}&childId=${cat.id}`);
    }
  };

  return (
    <div className="container mx-auto py-12 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-slate-800 dark:text-white">{t('fleetCategories')}</h2>
        <p className="text-slate-500 dark:text-slate-400">{t('fleetCategoriesSubtitle')}</p>
      </div>

      <div className="space-y-12">
        {/* Parent Categories */}
        <HorizontalFilterRow
          title={tFilter('parentCategory')}
          items={parentCategories.map((cat) => ({ name: cat.name, image: cat.image }))}
          selectedItems={parentCategories.filter(p => p.id === selectedParentId).map(p => p.name)}
          onToggle={handleParentSelect}
        />

        {/* Child Categories - Only shown if parent is selected */}
        {selectedParentId && (
          <div className="animate-in fade-in slide-in-from-top-4 duration-500">
            <HorizontalFilterRow
              title={tFilter('selectSubCategory')}
              items={childCategories.map((cat) => ({ name: cat.name, image: cat.image }))}
              selectedItems={[]} // Nothing selected yet
              onToggle={handleChildSelect}
            />
          </div>
        )}
      </div>
    </div>
  );
}
