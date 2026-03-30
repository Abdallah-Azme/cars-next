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
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    setDeletingId(id);
    try {
      const res = await deleteParentCategory(id);
      if (res.ok) {
        toast.success("Category deleted");
        onRefresh();
      } else {
        toast.error(res.error || "Delete failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Children</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                No parent categories found.
              </TableCell>
            </TableRow>
          ) : (
            categories.map((cat) => (
              <TableRow key={cat.id}>
                <TableCell>
                  {cat.image ? (
                    <img
                      src={fixImageUrl(cat.image)}
                      alt={cat.name}
                      className="w-10 h-10 object-cover rounded shadow-sm border"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-muted rounded flex items-center justify-center text-[10px] text-muted-foreground">
                      No Img
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-medium text-red-700">{cat.name}</TableCell>
                <TableCell>
                  <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
                    {cat.childrenCount} subcategories
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
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
