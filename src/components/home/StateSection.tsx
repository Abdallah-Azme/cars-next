"use client";

import { useSettingsStore } from "@/stores/settings";

export default function StatsSection() {
  const settings = useSettingsStore((state) => state.settings);

  const stats = settings?.statistics?.length
    ? settings.statistics.map((s) => ({
        number: s.value,
        label: s.label,
      }))
    : [
        { number: "15+", label: "Years of Experience" },
        { number: "250+", label: "Completed Projects" },
        { number: "120+", label: "Available Machines" },
        { number: "98%", label: "Client Satisfaction" },
      ];

  return (
    <section className="py-10">
      <div className="container flex flex-col gap-6">
        {/* Header */}
        <div className="text-center flex flex-col gap-2">
          <h2 className="text-3xl md:text-4xl font-bold text-red-600">
            {settings?.statisticsHeading || "Our Performance in Numbers"}
          </h2>
          <p className=" text-gray-400 max-w-2xl mx-auto">
            {settings?.statisticsDescription ||
              "Delivering strength, reliability, and excellence in every project."}
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
