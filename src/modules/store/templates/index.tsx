"use client"

import { useState } from "react"
import { HttpTypes } from "@medusajs/types"
import { Grid3X3, LayoutGrid } from "lucide-react"
import { ProductFiltersSidebar, ProductFiltersMobile, FiltersState } from "../components/product-filters"
import MedusaProductCard from "@modules/products/components/product-card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/ui/select"
import { cn } from "@lib/utils"

export default function StoreTemplate({
  products,
  count,
  categories,
  region
}: {
  products: HttpTypes.StoreProduct[]
  count: number
  categories: HttpTypes.StoreProductCategory[]
  region: HttpTypes.StoreRegion
}) {
  const [gridCols, setGridCols] = useState<3 | 4>(4)

  // Inicialização explícita para evitar o erro de never[]
  const [filters, setFilters] = useState<FiltersState>({
    intentions: [],
    chakras: [],
    stoneTypes: [],
    priceRange: [0, 1000],
  })

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col lg:flex-row gap-8">
        <ProductFiltersSidebar
          filters={filters}
          onFiltersChange={setFilters}
          categories={categories}
        />

        <div className="flex-1">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              <ProductFiltersMobile filters={filters} onFiltersChange={setFilters} categories={categories} />
              <p className="text-sm text-muted-foreground">
                {products.length} de {count} cristais
              </p>
            </div>

            <div className="flex items-center gap-4">
              {/* Select agora sendo utilizado corretamente para Ordenação */}
              <Select defaultValue="newest">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Ordenar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Lançamentos</SelectItem>
                  <SelectItem value="price_asc">Menor Preço</SelectItem>
                </SelectContent>
              </Select>

              <div className="hidden xl:flex border border-white/10 rounded p-1">
                <button onClick={() => setGridCols(3)} className={cn("p-1", gridCols === 3 && "text-secondary")}><Grid3X3 size={18} /></button>
                <button onClick={() => setGridCols(4)} className={cn("p-1", gridCols === 4 && "text-secondary")}><LayoutGrid size={18} /></button>
              </div>
            </div>
          </div>

          <div className={cn("grid grid-cols-2 md:grid-cols-3 gap-6", gridCols === 4 ? "xl:grid-cols-4" : "xl:grid-cols-3")}>
            {products.map((p) => (
              <MedusaProductCard
                key={p.id}
                product={p}
                region={region} // Prop region obrigatória adicionada
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}