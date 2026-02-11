"use client"

import { HttpTypes } from "@medusajs/types"
import ProductPreview from "@modules/products/components/product-preview"
import CategoryFilters from "./category-filters"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@components/ui/select"

/**
 * Propriedades do componente:
 * Recebe os produtos iniciais, o objeto da categoria e as tags extraídas dinamicamente.
 */
interface CategoryFiltersAndProductsProps {
    initialProducts: HttpTypes.StoreProduct[]
    category: HttpTypes.StoreProductCategory
    count: number
    availableTags: { label: string; count: number }[]
}

export default function CategoryFiltersAndProducts({
    initialProducts,
    count,
    availableTags
}: CategoryFiltersAndProductsProps) {

    return (
        <section className="container mx-auto px-4 pb-16">
            {/* Layout Principal: Sidebar à esquerda e Grid à direita */}
            <div className="flex flex-col lg:flex-row gap-8">

                {/* Sidebar Dinâmica com dados do Medusa */}
                <CategoryFilters availableTags={availableTags} />

                {/* Área de Conteúdo de Produtos */}
                <div className="flex-1">
                    {/* Header da Listagem: Contador e Ordenação */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-white/10">
                        <p className="text-sm text-muted-foreground font-mystical italic">
                            Mostrando <span className="text-foreground font-sans not-italic font-medium">{initialProducts.length}</span> de{" "}
                            <span className="text-foreground font-sans not-italic font-medium">{count}</span> produtos encontrados
                        </p>

                        <Select defaultValue="newest">
                            <SelectTrigger className="w-full sm:w-[220px] bg-card/50 border-white/10 text-sm focus:ring-secondary">
                                <SelectValue placeholder="Ordenar por" />
                            </SelectTrigger>
                            <SelectContent className="bg-card border-white/10">
                                <SelectItem value="best-sellers">Mais Vendidos</SelectItem>
                                <SelectItem value="newest">Lançamentos</SelectItem>
                                <SelectItem value="price-asc">Menor Preço</SelectItem>
                                <SelectItem value="price-desc">Maior Preço</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Grid de Produtos: 3 colunas no desktop para acomodar a sidebar */}
                    {initialProducts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
                            {initialProducts.map((product) => (
                                <ProductPreview key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="py-24 text-center border rounded-lg border-dashed border-white/10">
                            <p className="text-muted-foreground italic font-mystical">
                                Nenhuma energia mística encontrada para estes critérios...
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}