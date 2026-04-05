"use client";

import { useSettingsStore } from "@/stores/settings";
import { useTranslations } from "next-intl";

export default function StatsSection() {
  const settings = useSettingsStore((state) => state.settings);
  const t = useTranslations("HomePage.about");

  const stats = settings?.statistics?.length
    ? settings.statistics.map((s) => ({
        number: s.value,
        label: s.label,
      }))
    : [
        { number: "15+", label: t("stats.experience") },
        { number: "250+", label: t("stats.projects") },
        { number: "120+", label: t("stats.machines") },
        { number: "98%", label: t("stats.satisfaction") },
      ];

  return (
    <section className="py-10">
      <div className="container flex flex-col gap-6">
        {/* Header */}
        <div className="text-center flex flex-col gap-2">
          <h2 className="text-3xl md:text-4xl font-bold text-red-600">
            {settings?.statisticsHeading || t('title')}
          </h2>
          <p className=" text-gray-400 max-w-2xl mx-auto">
            {settings?.statisticsDescription || t('subtitle')}
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="py-5">
                <h3 className="text-xl md:text-3xl font-bold text-red-600">
                  {stat.number}
                </h3>
                <p className="mt-3 text-primary">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

