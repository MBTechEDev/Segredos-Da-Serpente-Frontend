import { Metadata } from "next"
import { notFound } from "next/navigation"
import { ChevronRight } from "lucide-react"

import { getCategoryByHandle } from "@lib/data/categories"
import { listProducts } from "@lib/data/products"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@components/ui/breadcrumb"
import CategoryFiltersAndProducts from "./category-filters-and-products"

type Props = {
  params: Promise<{ countryCode: string; category: string[] }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params
  const categoryObject = await getCategoryByHandle(category)

  if (!categoryObject) return { title: "Categoria não encontrada" }

  return {
    title: `${categoryObject.name} | Segredos da Serpente`,
    description: categoryObject.description ?? "",
  }
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { countryCode, category } = await params

  // Busca a categoria (já retorna o objeto único conforme sua lib/data)
  const categoryObject = await getCategoryByHandle(category)

  if (!categoryObject) {
    notFound()
  }

  // Busca os produtos com fields expandidos para pegar as tags
  const { response } = await listProducts({
    countryCode,
    queryParams: {
      category_id: [categoryObject.id],
      fields: "*tags,*variants.calculated_price",
      limit: 100, // Limite maior para extrair um conjunto completo de filtros
    }
  })

  // Lógica de extração de Tags Únicas do Medusa para os Filtros
  const allTags = response.products
    .flatMap(p => p.tags || [])
    .reduce((acc, tag) => {
      if (tag.value) {
        acc[tag.value] = (acc[tag.value] || 0) + 1
      }
      return acc
    }, {} as Record<string, number>)

  const dynamicFilters = Object.entries(allTags).map(([value, count]) => ({
    label: value,
    count: count
  }))

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative pt-20 pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-card/50 via-background to-background" />

        <div className="container mx-auto px-4 relative z-10">
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <LocalizedClientLink href="/" className="text-muted-foreground hover:text-secondary transition-colors text-sm">
                  Início
                </LocalizedClientLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <ChevronRight className="h-4 w-4" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage className="text-secondary font-medium uppercase tracking-wider text-sm">
                  {categoryObject.name}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-display text-foreground mb-4">
              {categoryObject.name.split(" ").map((word: string, i: number, arr: string[]) =>
                i === arr.length - 1 ? (
                  <span key={i} className="bg-gradient-to-r from-[#D4AF37] via-[#F1D06E] to-[#996515] bg-clip-text text-transparent">
                    {word}
                  </span>
                ) : (
                  <span key={i}>{word} </span>
                )
              )}
            </h1>
            {categoryObject.description && (
              <p className="font-mystical text-lg text-muted-foreground italic">
                {categoryObject.description}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Componente que orquestra Sidebar (Filtros) e o Grid de Produtos */}
      <CategoryFiltersAndProducts
        initialProducts={response.products}
        category={categoryObject}
        count={response.count}
        availableTags={dynamicFilters}
      />
    </div>
  )
}