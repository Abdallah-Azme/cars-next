import CategorySection from "@/components/categories/CategorySection";
import MergedHero from "@/components/home/MergedHero";
import AboutSection from "@/components/home/AboutSection";
import EmailSubscription from "@/components/shared/EmailBox";

export default function HomePage() {
  return (
    <main>
      <MergedHero />
      <AboutSection />
      <CategorySection />
      {/* <ProductCarousel /> */}

      {/* <div className="bg-slate-50/50 dark:bg-slate-900/50 border-y border-slate-100 dark:border-slate-800">
        <HomeHorizontalFilters />
      </div> */}

      <EmailSubscription />
    </main>
  );
}
