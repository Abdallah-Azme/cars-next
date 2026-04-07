"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getParentCategories, ParentCategory } from "@/lib/actions";
import { ParentCategoriesList } from "@/components/admin/parent-categories/ParentCategoriesList";
import { ParentCategoryForm } from "@/components/admin/parent-categories/ParentCategoryForm";
import { Button } from "@/components/admin/ui/button";
import { Plus, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/admin/ui/dialog";
import { useLocale, useTranslations } from "next-intl";

const ParentCategoriesPage = () => {
  const locale = useLocale();
  const t = useTranslations("admin.parentCategories");
  const isRtl = locale === 'ar';

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<ParentCategory | null>(null);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["parent-categories"],
    queryFn: async () => {
      const res = await getParentCategories();
      if (!res.ok) throw new Error(res.error);
      return res.data;
    },
  });
  const categories = data?.data || [];

  const handleCreate = () => {
    setSelectedCategory(null);
    setIsModalOpen(true);
  };

  const handleEdit = (category: ParentCategory) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleSuccess = () => {
    setIsModalOpen(false);
    refetch();
  };

  return (
    <div className={`flex flex-col gap-6 text-start`}>
      <div className={`flex items-center justify-between`}>
        <div>
          <h1 className="text-3xl font-bold text-red-700">{t("title")}</h1>
          <p className="text-muted-foreground">
            {t("subtitle")}
          </p>
        </div>
        <Button onClick={handleCreate} className={`bg-red-700 font-bold`}>
          <Plus className={`me-2 h-4 w-4`} />
          {t("addBtn")}
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-10 w-10 animate-spin text-red-700" />
        </div>
      ) : (
        <ParentCategoriesList
          categories={categories}
          onEdit={handleEdit}
          onRefresh={refetch}
        />
      )}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className={`sm:max-w-3xl max-h-[90vh] overflow-y-auto text-start`}>
          <DialogHeader className={"text-start items-start"}>
            <DialogTitle>
              {selectedCategory ? t("modal.edit") : t("modal.add")}
            </DialogTitle>
            <DialogDescription>
              {selectedCategory
                ? t("modal.editDesc")
                : t("modal.addDesc")}
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <ParentCategoryForm
              initialData={selectedCategory}
              onSuccess={handleSuccess}
              onCancel={() => setIsModalOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ParentCategoriesPage;
