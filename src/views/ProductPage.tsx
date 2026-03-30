import { ProductSection } from '@/components/products/ProductsSection'
import EmailSubscription from '@/components/shared/EmailBox'

const ProductPage = () => {
  return (
    <>
      <div className="pt-8">
        <ProductSection />
      </div>
      <EmailSubscription/>
    </>
  )
}

export default ProductPage