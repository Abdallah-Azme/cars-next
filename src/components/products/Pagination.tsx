import type { Pagination } from "@/types/vehicles";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

interface PaginationProps {
  pagination: Pagination;
  onPageChange: (page: number) => void;
}

export function PaginationControls({
  pagination,
  onPageChange,
}: PaginationProps) {
  const { current_page, last_page, per_page, total } = pagination;

  // Build page numbers to show (current ± 2, always show first & last)
  const getPageNumbers = (): (number | "...")[] => {
    const pages: (number | "...")[] = [];
    const delta = 2;

    const range = {
      start: Math.max(2, current_page - delta),
      end: Math.min(last_page - 1, current_page + delta),
    };

    pages.push(1);

    if (range.start > 2) pages.push("...");
    for (let i = range.start; i <= range.end; i++) pages.push(i);
    if (range.end < last_page - 1) pages.push("...");

    if (last_page > 1) pages.push(last_page);

    return pages;
  };

  const from = (current_page - 1) * per_page + 1;
  const to = Math.min(current_page * per_page, total);

  return (
    <div className="flex flex-col items-center gap-4 py-6 sm:flex-row sm:justify-between">
      {/* Info */}
      <p className="text-sm text-muted-foreground">
        Showing{" "}
        <span className="font-medium text-foreground">
          {from}–{to}
        </span>{" "}
        of{" "}
        <span className="font-medium text-foreground">{total}</span> results
      </p>

      {/* Controls */}
      <div className="flex items-center gap-1">
        {/* First */}
        <PaginationBtn
          onClick={() => onPageChange(1)}
          disabled={current_page === 1}
          title="First page"
        >
          <ChevronsLeft className="h-4 w-4" />
        </PaginationBtn>

        {/* Prev */}
        <PaginationBtn
          onClick={() => onPageChange(current_page - 1)}
          disabled={current_page === 1}
          title="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </PaginationBtn>

        {/* Page numbers */}
        {getPageNumbers().map((page, idx) =>
          page === "..." ? (
            <span
              key={`ellipsis-${idx}`}
              className="px-2 text-muted-foreground select-none"
            >
              …
            </span>
          ) : (
            <PaginationBtn
              key={page}
              onClick={() => onPageChange(page as number)}
              active={page === current_page}
            >
              {page}
            </PaginationBtn>
          )
        )}

        {/* Next */}
        <PaginationBtn
          onClick={() => onPageChange(current_page + 1)}
          disabled={current_page === last_page}
          title="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </PaginationBtn>

        {/* Last */}
        <PaginationBtn
          onClick={() => onPageChange(last_page)}
          disabled={current_page === last_page}
          title="Last page"
        >
          <ChevronsRight className="h-4 w-4" />
        </PaginationBtn>
      </div>
    </div>
  );
}

// ─── Small button helper ──────────────────────────────────────────────────────
interface BtnProps {
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
  title?: string;
  children: React.ReactNode;
}

function PaginationBtn({
  onClick,
  disabled,
  active,
  title,
  children,
}: BtnProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`
        inline-flex h-9 min-w-9 items-center justify-center rounded-md border px-2
        text-sm font-medium transition-colors
        ${
          active
            ? "border-red-600 bg-red-600 text-white"
            : "border-border bg-background text-foreground hover:bg-muted"
        }
        disabled:pointer-events-none disabled:opacity-40
      `}
    >
      {children}
    </button>
  );
}
