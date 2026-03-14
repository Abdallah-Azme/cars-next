import { ProductSection } from '@/components/products/ProductsSection'
import EmailSubscription from '@/components/shared/EmailBox'
import PageHeader from '@/components/shared/PageHeader'

const ProductPage = () => {
  return (
    <>
      <PageHeader title="Machines"/>
      <ProductSection />
      <EmailSubscription/>
    
    </>
  )
}

export default ProductPage