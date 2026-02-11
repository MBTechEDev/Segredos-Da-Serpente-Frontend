"use client"

import { useState } from "react"
import { HttpTypes } from "@medusajs/types"
import { ChevronDown, ChevronRight, Grid3X3, LayoutGrid, List, TrendingUp } from "lucide-react"

import { Button } from "@components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/ui/select"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@components/ui/collapsible"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@components/ui/breadcrumb"
import { ProductFiltersSidebar, ProductFiltersMobile } from "../components/product-filters"
import CategoriesCarousel from "@components/ui/categories-carousel"
import MedusaProductCard from "@modules/products/components/product-card"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { BenefitsBar, FlashDeals, PromotionalBanner } from "../components/store-sections"

interface StoreTemplateProps {
  products: HttpTypes.StoreProduct[]
  count: number
  categories: HttpTypes.StoreProductCategory[]
  region: HttpTypes.StoreRegion
  searchParams: Record<string, string | string[] | undefined>
}

export default function StoreTemplate({
  products,
  count,
  categories,
  region,
  searchParams
}: StoreTemplateProps) {
  const [gridCols, setGridCols] = useState<3 | 4>(4)
  const [seoExpanded, setSeoExpanded] = useState(false)

  // Filtros blindados contra nulos (Regra de Ouro 4)
  const discountedProducts = products.filter(p =>
    p.variants?.some(v => {
      const calc = v.calculated_price?.calculated_amount ?? 0
      const orig = v.calculated_price?.original_amount ?? 0
      return calc > 0 && calc < orig
    })
  ).slice(0, 4)

  return (
    <div className="min-h-screen bg-background text-foreground">
      <BenefitsBar />
      <PromotionalBanner />
      <CategoriesCarousel categories={categories} />

      {discountedProducts.length > 0 && (
        <div className="border-y border-white/5 bg-card/30">
          <FlashDeals products={discountedProducts} region={region} />
        </div>
      )}

      <section className="py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <Breadcrumb className="mb-3">
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <LocalizedClientLink href="/" className="text-muted-foreground hover:text-secondary font-body">Início</LocalizedClientLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator><ChevronRight size={14} /></BreadcrumbSeparator>
                  <BreadcrumbItem><BreadcrumbPage className="text-secondary font-body">Loja</BreadcrumbPage></BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
              <h1 className="text-2xl md:text-3xl font-display uppercase tracking-widest">
                Catálogo <span className="text-gradient-gold">Místico</span>
              </h1>
            </div>

            <Tabs defaultValue="all" className="w-auto">
              <TabsList className="bg-card/50 border border-white/10 glass-dark">
                <TabsTrigger value="all">Todos</TabsTrigger>
                <TabsTrigger value="offers">Ofertas</TabsTrigger>
                <TabsTrigger value="trending" className="gap-1.5"><TrendingUp size={14} /> Em Alta</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <aside className="hidden lg:block w-64 shrink-0">
              {/* Passamos o searchParams original para que o sidebar saiba o que marcar como "checked" */}
              <ProductFiltersSidebar searchParams={searchParams} categories={categories} />
            </aside>

            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 p-4 bg-card/40 rounded-xl border border-white/10 glass-dark">
                <div className="flex items-center gap-4">
                  <ProductFiltersMobile searchParams={searchParams} categories={categories} />
                  <p className="text-sm text-muted-foreground font-body">
                    Mostrando <span className="text-foreground font-medium">{products.length}</span> de <span className="text-foreground font-medium">{count}</span> cristais
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="hidden xl:flex items-center gap-1 border border-white/10 rounded-lg p-1 bg-background/50">
                    <Button variant="ghost" size="icon" className={gridCols === 3 ? "text-secondary" : "text-muted-foreground"} onClick={() => setGridCols(3)}><Grid3X3 size={18} /></Button>
                    <Button variant="ghost" size="icon" className={gridCols === 4 ? "text-secondary" : "text-muted-foreground"} onClick={() => setGridCols(4)}><LayoutGrid size={18} /></Button>
                  </div>

                  <Select defaultValue={searchParams.order as string || "created_at"}>
                    <SelectTrigger className="w-[180px] bg-background/50 border-white/10 font-body">
                      <SelectValue placeholder="Ordenar por" />
                    </SelectTrigger>
                    <SelectContent className="bg-background border-white/10 text-foreground">
                      <SelectItem value="created_at">Lançamentos</SelectItem>
                      <SelectItem value="price_asc">Menor Preço</SelectItem>
                      <SelectItem value="price_desc">Maior Preço</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {products.length > 0 ? (
                <div className={`grid grid-cols-2 md:grid-cols-3 ${gridCols === 4 ? "xl:grid-cols-4" : "xl:grid-cols-3"} gap-6`}>
                  {products.map((p) => (
                    <MedusaProductCard key={p.id} product={p} region={region} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-24 bg-card/20 rounded-xl border border-dashed border-white/10">
                  <List className="mx-auto h-12 w-12 text-muted-foreground mb-4 opacity-20" />
                  <h3 className="text-xl font-display text-secondary">A névoa encobre estes itens...</h3>
                  <p className="text-muted-foreground mt-2 font-body italic">Tente ajustar seus filtros para revelar novos tesouros.</p>
                </div>
              )}
            </div>
          </div>

          <Collapsible open={seoExpanded} onOpenChange={setSeoExpanded} className="mt-20">
            <CollapsibleTrigger className="flex items-center justify-between group w-full border-t border-white/10 pt-10">
              <h2 className="text-2xl font-display group-hover:text-secondary transition-colors text-left">O Legado da Serpente</h2>
              <ChevronDown className={`text-secondary transition-transform ${seoExpanded ? "rotate-180" : ""}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-6 text-muted-foreground font-body text-lg leading-relaxed max-w-4xl">
              <p>Descubra a força telúrica de cada pedra selecionada para sua jornada espiritual.</p>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </section>
    </div>
  )
}