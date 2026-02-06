import { HttpTypes } from "@medusajs/types"
import MedusaProductCard from "@modules/products/components/product-card"

interface FlashDealsProps {
    products: HttpTypes.StoreProduct[]
    region: HttpTypes.StoreRegion
}

const FlashDeals = ({ products, region }: FlashDealsProps) => {
    return (
        <div className="container mx-auto px-4 py-12">
            <div className="flex items-center justify-between mb-8">
                <h2 className="font-display text-xl md:text-2xl uppercase tracking-widest text-foreground">
                    Ofertas <span className="text-primary italic">Efêmeras</span>
                </h2>
                {/* Contador ou Badge de Tempo aqui */}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {products.map((p) => (
                    <MedusaProductCard key={p.id} product={p} region={region} />
                ))}
            </div>
        </div>
    )
}

export default FlashDeals