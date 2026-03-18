"use client";

import { useQuery } from "@tanstack/react-query";
import { getSettings } from "@/lib/actions";
import { SettingsResponse } from "@/types/settings";
import { SettingsForm } from "@/components/admin/settings/SettingsForm";

const SettingsPage = () => {
  const { data, isLoading, refetch } = useQuery<SettingsResponse>({
    queryKey: ["settings"],
    queryFn: async () => {
      const res = await getSettings();
      if (!res.ok) throw new Error(res.error);
      return res.data;
    },
  });

  const settings = data?.data;

  return (
    <div className="flex flex-col gap-6 container mx-auto py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-red-700">
          Site Settings
        </h1>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700"></div>
        </div>
      ) : settings ? (
        <SettingsForm initialData={settings} onUpdate={refetch} />
      ) : (
        <div className="text-center py-20 text-muted-foreground">
          Failed to load settings.
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
