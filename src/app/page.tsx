import CategorySection from "@/components/categories/CategorySection";
import Hero from "@/components/home/HeroSection";
import StatsSection from "@/components/home/StateSection";
import { ProductSection } from "@/components/products/ProductsSection";
import EmailSubscription from "@/components/shared/EmailBox";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <StatsSection />
      <CategorySection />
      <ProductSection />
      {/* <SocialLinksSection /> */}
      <EmailSubscription />
    </main>
  );
}
