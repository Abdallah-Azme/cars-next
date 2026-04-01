import CategorySection from "@/components/categories/CategorySection";
import MergedHero from "@/components/home/MergedHero";
import AboutSection from "@/components/home/AboutSection";
import { ProductCarousel } from "@/components/products/ProductCarousel";
import HomeHorizontalFilters from "@/components/home/HomeHorizontalFilters";
import EmailSubscription from "@/components/shared/EmailBox";

export default function HomePage() {
  return (
    <main>
      <MergedHero />
      {/* <CategorySection /> */}
      {/* <ProductCarousel /> */}
      
      <div className="bg-slate-50/50 dark:bg-slate-900/50 border-y border-slate-100 dark:border-slate-800">
        <HomeHorizontalFilters />
      </div>

      <EmailSubscription />
      <AboutSection />
    </main>
  );
}
