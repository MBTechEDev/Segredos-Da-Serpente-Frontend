import { listRegions } from "@lib/data/regions"
import { listCategories } from "@lib/data/categories"
import { StoreRegion, StoreProductCategory } from "@medusajs/types"
import NavClient from "@modules/layout/components/nav-client"

export default async function Nav() {
  // 1. Buscamos as regiões
  const regions: StoreRegion[] = await listRegions().catch(() => [])

  // 2. Buscamos as categorias.
  // Removemos o filtro 'parent_category_id: null' da query pois pode falhar na serialização.
  // Pedimos um limite maior para garantir que trazemos tudo e filtramos nós mesmos.
  const allCategories: StoreProductCategory[] = await listCategories({
    limit: 100,
    // Garantimos que os campos necessários para filtrar venham na resposta
    fields: "*category_children, *parent_category, parent_category_id"
  }).catch(() => [])

  // 3. FILTRO MANUAL (A Correção)
  // Só aceitamos categorias onde 'parent_category_id' é nulo (ou seja, são Raízes)
  const rootCategories = allCategories.filter(
    (c) => c.parent_category_id === null || c.parent_category_id === undefined
  )

  return (
    <NavClient
      regions={regions}
      categories={rootCategories}
    />
  )
}