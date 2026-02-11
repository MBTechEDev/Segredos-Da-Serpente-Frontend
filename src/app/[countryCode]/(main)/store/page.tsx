// Arquivo: src/app/[countryCode]/(main)/store/page.tsx
import { Metadata } from "next"
import { listCategories } from "@lib/data/categories"
import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import StoreTemplate from "@modules/store/templates"
import { HttpTypes } from "@medusajs/types"

export const metadata: Metadata = {
  title: "Loja | Segredos da Serpente",
  description: "Explore nossa coleção mística de cristais e amuletos.",
}

type Props = {
  params: Promise<{ countryCode: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function StorePage({ params, searchParams }: Props) {
  const { countryCode } = await params
  const sParams = await searchParams

  const region = await getRegion(countryCode)
  const categories = await listCategories()

  // Regra de Ouro: Filtrar categorias raiz no Server Component
  const rootCategories = categories.filter(
    (c: HttpTypes.StoreProductCategory) => !c.parent_category_id
  )

  /**
   * Filtros Oficiais Medusa v2:
   * Mapeamos os handles/IDs da URL para os filtros do Store Get Products
   */
  const { response } = await listProducts({
    countryCode,
    queryParams: {
      limit: 12,
      offset: sParams.offset ? parseInt(sParams.offset as string) : 0,
      order: sParams.order as string,
      // O Medusa v2 aceita array de IDs para categorias
      category_id: Array.isArray(sParams.category_id)
        ? sParams.category_id
        : sParams.category_id ? [sParams.category_id] : undefined,
      // Filtro de coleção se necessário
      collection_id: Array.isArray(sParams.collection_id)
        ? sParams.collection_id
        : sParams.collection_id ? [sParams.collection_id] : undefined,
    }
  })

  if (!region) return null

  return (
    <StoreTemplate
      products={response.products}
      count={response.count}
      categories={rootCategories}
      region={region}
      searchParams={sParams}
    />
  )
}