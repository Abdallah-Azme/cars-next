import CategorySection from "@/components/categories/CategorySection";
import MergedHero from "@/components/home/MergedHero";
import StatsSection from "@/components/home/StateSection";
import { ProductCarousel } from "@/components/products/ProductCarousel";
import EmailSubscription from "@/components/shared/EmailBox";

export default function HomePage() {
  return (
    <main>
      <MergedHero />
      <CategorySection />
      <ProductCarousel />
      <EmailSubscription />
      <StatsSection />
    </main>
  );
}
