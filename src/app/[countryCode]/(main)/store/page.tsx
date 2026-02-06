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

  // No Medusa v2, listCategories costuma retornar o array diretamente ou 
  // um objeto com a propriedade product_categories.
  const categories = await listCategories()

  // Regra de Ouro: Filtrar categorias raiz com tipagem estrita do Medusa
  const rootCategories = categories.filter(
    (c: HttpTypes.StoreProductCategory) => !c.parent_category_id
  )

  // Busca de produtos via SDK
  const { response } = await listProducts({
    countryCode,
    queryParams: {
      limit: 12,
      offset: 0,
      // Aqui poderíamos passar filtros vindos de sParams
    }
  })

  if (!region) return null

  return (
    <StoreTemplate
      products={response.products}
      count={response.count}
      categories={rootCategories}
      region={region}
    />
  )
}