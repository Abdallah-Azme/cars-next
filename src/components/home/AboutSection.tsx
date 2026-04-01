"use client";

import { useSettingsStore } from "@/stores/settings";
import { fixImageUrl } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function AboutSection() {
  const settings = useSettingsStore((state) => state.settings);

  // Performance stats from existing statistics field
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

  const features = [
    "Genuine Spare Parts",
    "Expert Maintenance Team",
    "Flexible Rental & Sales",
    "Global Quality Standards"
  ];

  return (
    <section id="about-us" className="py-20 md:py-32 bg-slate-50 dark:bg-slate-900/50 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column: Image with dynamic elements */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src={settings?.heroImage ? fixImageUrl(settings.heroImage) : "/about-machinery.jpg"} 
                alt="Our Performance" 
                className="w-full h-[450px] md:h-[600px] object-cover hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            </div>
            
            {/* Decorative Shapes */}
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-red-600/10 rounded-full blur-3xl z-0"></div>
            <div className="absolute -top-10 -right-10 w-60 h-60 bg-red-600/5 rounded-full blur-3xl z-0"></div>
            
            {/* Floating Experience Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="absolute -bottom-6 -right-4 md:right-8 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-2xl z-20 flex items-center gap-4 border border-slate-100 dark:border-slate-700"
            >
              <div className="bg-red-600 w-16 h-16 rounded-xl flex items-center justify-center text-white shadow-lg shadow-red-600/30">
                <span className="text-2xl font-bold">15+</span>
              </div>
              <div>
                <div className="text-slate-900 dark:text-white font-bold text-lg leading-tight text-nowrap">Years of</div>
                <div className="text-red-600 font-semibold">Excellence</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column: Content */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col gap-8"
          >
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-[2px] bg-red-600"></div>
                <span className="text-red-600 font-bold tracking-widest uppercase text-xs">About Us</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white leading-[1.15]">
                {settings?.statisticsHeading || "Our Performance in Numbers"}
                <span className="text-red-600">.</span>
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed max-w-xl">
                {settings?.statisticsDescription || "Delivering strength, reliability, and excellence in every project."}
              </p>
            </div>
            
            {/* Features List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {features.map((feature, i) => (
                <div key={i} className="flex items-center gap-2">
                  <CheckCircle2 className="text-red-600 size-5 shrink-0" />
                  <span className="text-slate-700 dark:text-slate-300 font-medium">{feature}</span>
                </div>
              ))}
            </div>

            <hr className="border-slate-200 dark:border-slate-800" />

            {/* Performance Stats (Merged) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-6">
              {stats.slice(0, 4).map((stat, index) => (
                <div key={index} className="flex flex-col">
                  <span className="text-3xl font-black text-slate-900 dark:text-white tabular-nums">
                    {stat.number}
                  </span>
                  <span className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1 leading-tight text-nowrap">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4">
              <Button size="lg" className="bg-red-700 hover:bg-red-800 text-white rounded-full px-10 h-14 text-lg shadow-lg shadow-red-900/20 group" asChild>
                <a href="/products">
                  Explore Our Fleet
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                </a>
              </Button>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
