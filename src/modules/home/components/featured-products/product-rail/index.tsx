import { listProducts } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"
import { Text } from "@medusajs/ui"

import InteractiveLink from "@modules/common/components/interactive-link"
import ProductCard from "@modules/products/components/product-card"

export default async function ProductRail({
  collection,
  region,
}: {
  collection: HttpTypes.StoreCollection
  region: HttpTypes.StoreRegion
}) {
  const {
    response: { products: pricedProducts },
  } = await listProducts({
    regionId: region.id,
    queryParams: {
      collection_id: collection.id,
      fields: "*variants.calculated_price",
    },
  })

  if (!pricedProducts) {
    return null
  }

  return (
    <div className="container mx-auto px-6 md:px-12 py-8 md:py-12">
      <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
        <Text className="text-2xl md:text-3xl font-display text-foreground">{collection.title}</Text>
        <InteractiveLink href={`/collections/${collection.handle}`}>
          <span className="text-secondary font-display uppercase tracking-widest text-sm hover:text-gold-light transition-colors">
            Ver Todos
          </span>
        </InteractiveLink>
      </div>
      <ul className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-x-6 gap-y-12 md:gap-y-24">
        {pricedProducts &&
          pricedProducts.map((product) => (
            <li key={product.id}>
              <ProductCard product={product} region={region} />
            </li>
          ))}
      </ul>
    </div>
  )
}
