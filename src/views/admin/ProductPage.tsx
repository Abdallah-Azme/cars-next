"use client";

import { ProductsGrid } from "@/components/admin/products/ProductsGrid";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/admin/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { getVehicles } from "@/lib/actions";
import { useState, useMemo } from "react";
import { PaginationControls } from "@/components/products/Pagination";
import { Loader2 } from "lucide-react";
import { VehicleSResponse, AuctionSummaryItem } from "@/types/vehicles";

const ProductPage = () => {
  const [page, setPage] = useState(1);
  const [activeDate, setActiveDate] = useState<string | undefined>(undefined);

  const { data, isLoading } = useQuery<VehicleSResponse>({
    queryKey: ["dashboard-vehicles", page, activeDate],
    queryFn: async () => {
      const res = await getVehicles({
        page,
        holdingDate: activeDate,
        per_page: 10,
      });
      if (!res.ok) throw new Error(res.error);
      return res.data;
    },
  });

  const vehicles = data?.data?.vehicles ?? [];
  const pagination = data?.data?.pagination;
  const summary = useMemo(() => data?.data?.summary ?? [], [data]);

  // Derive active date to avoid useEffect setState
  const selectedDate = activeDate ?? summary[0]?.date;

  const handleTabChange = (value: string) => {
    setActiveDate(value);
    setPage(1); // Reset to page 1 when switching days
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-red-700"> Auction Products</h1>
      </div>

      {isLoading && summary.length === 0 ? (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-red-700" />
        </div>
      ) : summary.length > 0 ? (
        <Tabs
          value={selectedDate}
          onValueChange={handleTabChange}
          className="gap-4"
        >
          <TabsList className="mb-4 h-auto p-1 bg-muted/50 overflow-x-auto justify-start">
            {summary.map((tab: AuctionSummaryItem) => (
              <TabsTrigger
                key={tab.date}
                value={tab.date}
                className="md:px-6 flex flex-col gap-1 items-center data-[state=active]:bg-red-700 data-[state=active]:text-white min-w-[100px] py-2"
              >
                <span className="text-[10px] uppercase font-bold opacity-80">
                  {tab.auctionDay}
                </span>
                <p className="text-sm font-bold">{tab.date}</p>
                <span className="text-[10px]">{tab.itemsCount} items</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {summary.map((tab: AuctionSummaryItem) => (
            <TabsContent
              key={tab.date}
              value={tab.date}
              className="flex flex-col gap-4 mt-0"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold">
                  {tab.auctionDay} {tab.date}
                </p>
                <span className="text-xs">{tab.itemsCount} items total</span>
              </div>

              {isLoading ? (
                <div className="flex justify-center items-center py-10">
                  <Loader2 className="h-8 w-8 animate-spin text-red-700" />
                </div>
              ) : (
                <>
                  <ProductsGrid vehicles={vehicles} />
                  {pagination && pagination.last_page > 1 && (
                    <PaginationControls
                      pagination={pagination}
                      onPageChange={setPage}
                    />
                  )}
                </>
              )}
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        <div className="text-center py-10 text-muted-foreground">
          No auction sessions found.
        </div>
      )}
    </div>
  );
};

export default ProductPage;
