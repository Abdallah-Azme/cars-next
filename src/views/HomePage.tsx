import CategorySection from "@/components/categories/CategorySection"
import Hero from "@/components/home/HeroSection"
import StatsSection from "@/components/home/StateSection"
import { ProductSection } from "@/components/products/ProductsSection"
import EmailSubscription from "@/components/shared/EmailBox"


const HomePage = () => {
  return (
    <main>
      <Hero />
      <StatsSection />
      <CategorySection/>
      <ProductSection />
      <EmailSubscription />
      
    </main>
  )
}

export default HomePage