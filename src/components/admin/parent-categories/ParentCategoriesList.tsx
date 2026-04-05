"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/admin/ui/table";
import { Button } from "@/components/admin/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { ParentCategory, deleteParentCategory } from "@/lib/actions";
import { fixImageUrl } from "@/lib/utils";
import { toast } from "sonner";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";

interface ParentCategoriesListProps {
  categories: ParentCategory[];
  onEdit: (category: ParentCategory) => void;
  onRefresh: () => void;
}

export function ParentCategoriesList({
  categories,
  onEdit,
  onRefresh,
}: ParentCategoriesListProps) {
  const locale = useLocale();
  const t = useTranslations("admin.parentCategories.list");
  const isRtl = locale === 'ar';
  
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDelete = async (id: number) => {
    if (!confirm(t("confirmDelete"))) return;

    setDeletingId(id);
    try {
      const res = await deleteParentCategory(id);
      if (res.ok) {
        toast.success(t("successDelete"));
        onRefresh();
      } else {
        toast.error(res.error || t("failedDelete"));
      }
    } catch (error) {
      console.error(error);
      toast.error(t("failedDelete"));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className={isRtl ? 'flex-row-reverse' : ''}>
            <TableHead className={`w-[80px] ${isRtl ? 'text-right' : 'text-left'}`}>{t("image")}</TableHead>
            <TableHead className={isRtl ? 'text-right' : 'text-left'}>{t("name")}</TableHead>
            <TableHead className={isRtl ? 'text-right' : 'text-left'}>{t("children")}</TableHead>
            <TableHead className={isRtl ? 'text-left' : 'text-right'}>{t("actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                {t("noCategories")}
              </TableCell>
            </TableRow>
          ) : (
            categories.map((cat) => (
              <TableRow key={cat.id} className={isRtl ? 'flex-row-reverse' : ''}>
                <TableCell>
                  {cat.image ? (
                    <div className="relative w-10 h-10 overflow-hidden rounded shadow-sm border">
                      <Image
                        src={fixImageUrl(cat.image)}
                        alt={cat.name}
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    </div>
                  ) : (
                    <div className="w-10 h-10 bg-muted rounded flex items-center justify-center text-[10px] text-muted-foreground text-center px-1">
                      {t("noImg")}
                    </div>
                  )}
                </TableCell>
                <TableCell className={`font-medium text-red-700 ${isRtl ? 'text-right' : 'text-left'}`}>
                    {cat.name}
                </TableCell>
                <TableCell className={isRtl ? 'text-right' : 'text-left'}>
                  <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
                    {t("subCount", { count: cat.childrenCount })}
                  </span>
                </TableCell>
                <TableCell className={isRtl ? 'text-left' : 'text-right'}>
                  <div className={`flex gap-2 ${isRtl ? 'justify-start' : 'justify-end'}`}>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(cat)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDelete(cat.id)}
                      disabled={deletingId === cat.id}
                    >
                      {deletingId === cat.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
