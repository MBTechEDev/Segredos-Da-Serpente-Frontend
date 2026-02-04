import { listProducts } from "@lib/data/products"
import { listCategories } from "@lib/data/categories"
import { getRegion } from "@lib/data/regions" // Importamos a função de mapeamento
import StoreTemplate from "@modules/store/templates"
import { notFound } from "next/navigation"

export default async function StorePage({
  params,
  searchParams,
}: {
  params: Promise<{ countryCode: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { countryCode } = await params
  const sParams = await searchParams

  // 1. Utilizamos sua função getRegion para converter "br" no objeto Region real
  const region = await getRegion(countryCode)

  // 2. Se o país na URL não estiver mapeado em nenhuma região no Medusa Admin
  if (!region) {
    return notFound()
  }

  // 3. Buscamos produtos e categorias em paralelo
  // Passamos region.id (o ID real reg_...) para o Medusa buscar os preços corretos
  const [productsData, categories] = await Promise.all([
    listProducts({
      countryCode,
      queryParams: {
        limit: 12,
        ...sParams,
        region_id: region.id
      }
    }),
    listCategories()
  ])

  return (
    <StoreTemplate
      products={productsData.response.products}
      count={productsData.response.count}
      categories={categories}
      region={region}
    />
  )
}