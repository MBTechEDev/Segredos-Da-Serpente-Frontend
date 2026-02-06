// Arquivo: src/modules/store/templates/index.tsx
"use client"

import { useState } from "react"
import { HttpTypes } from "@medusajs/types"
import {
  ChevronDown,
  ChevronRight,
  Grid3X3,
  LayoutGrid,
  List,
  TrendingUp
} from "lucide-react"

// UI & Components
import { Button } from "@components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/ui/select"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@components/ui/collapsible"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@components/ui/breadcrumb"
import { ProductFiltersSidebar, ProductFiltersMobile, FiltersState } from "../components/product-filters"
import CategoriesCarousel from "@components/ui/categories-carousel"
import MedusaProductCard from "@modules/products/components/product-card"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

// Store Modules (Supondo que existam ou serão criados)
import { BenefitsBar, FlashDeals, PromotionalBanner } from "../components/store-sections"

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
  const [viewTab, setViewTab] = useState("all")
  const [seoExpanded, setSeoExpanded] = useState(false)
  const [filters, setFilters] = useState<FiltersState>({
    intentions: [],
    chakras: [],
    stoneTypes: [],
    priceRange: [0, 1000],
  })

  return (
    <div className="min-h-screen bg-background">
      <BenefitsBar />
      <PromotionalBanner />
      <CategoriesCarousel categories={categories} />

      <div className="border-y border-white/5 bg-card/30">
        <FlashDeals
          products={products.slice(0, 4)}
          region={region}
        />
      </div>

      <section className="py-10">
        <div className="container mx-auto px-4">
          {/* Header da Seção */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <Breadcrumb className="mb-3">
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <LocalizedClientLink href="/" className="text-muted-foreground hover:text-secondary transition-colors">
                      Início
                    </LocalizedClientLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator><ChevronRight size={14} /></BreadcrumbSeparator>
                  <BreadcrumbItem>
                    <BreadcrumbPage className="text-secondary">Todos os Produtos</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
              <h1 className="text-2xl md:text-3xl font-display text-foreground">
                Todos os <span className="bg-gradient-to-r from-[#D4AF37] via-[#F1D06E] to-[#996515] bg-clip-text text-transparent">Produtos</span>
              </h1>
            </div>

            <Tabs value={viewTab} onValueChange={setViewTab} className="w-auto">
              <TabsList className="bg-card/50 border border-white/10">
                <TabsTrigger value="all">Todos</TabsTrigger>
                <TabsTrigger value="offers">Ofertas</TabsTrigger>
                <TabsTrigger value="new">Novidades</TabsTrigger>
                <TabsTrigger value="trending" className="gap-1.5">
                  <TrendingUp size={14} /> Em Alta
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar - Desktop */}
            <aside className="hidden lg:block w-64 shrink-0">
              <ProductFiltersSidebar filters={filters} onFiltersChange={setFilters} categories={categories} />
            </aside>

            <div className="flex-1">
              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 p-4 bg-card/40 rounded-xl border border-white/10 glass-dark">
                <div className="flex items-center gap-4">
                  <ProductFiltersMobile filters={filters} onFiltersChange={setFilters} categories={categories} />
                  <p className="text-sm text-muted-foreground">
                    Mostrando <span className="text-foreground font-medium">{products.length}</span> de <span className="text-foreground font-medium">{count}</span> cristais
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="hidden xl:flex items-center gap-1 border border-white/10 rounded-lg p-1 bg-background/50">
                    <Button
                      variant="ghost" size="icon" className={gridCols === 3 ? "text-secondary" : "text-muted-foreground"}
                      onClick={() => setGridCols(3)}
                    >
                      <Grid3X3 size={18} />
                    </Button>
                    <Button
                      variant="ghost" size="icon" className={gridCols === 4 ? "text-secondary" : "text-muted-foreground"}
                      onClick={() => setGridCols(4)}
                    >
                      <LayoutGrid size={18} />
                    </Button>
                  </div>

                  <Select defaultValue="newest">
                    <SelectTrigger className="w-[180px] bg-background/50 border-white/10">
                      <SelectValue placeholder="Ordenar por" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Lançamentos</SelectItem>
                      <SelectItem value="price_asc">Menor Preço</SelectItem>
                      <SelectItem value="price_desc">Maior Preço</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Grid de Produtos */}
              {products.length > 0 ? (
                <div className={`grid grid-cols-2 md:grid-cols-3 ${gridCols === 4 ? "xl:grid-cols-4" : "xl:grid-cols-3"} gap-6`}>
                  {products.map((p) => (
                    <MedusaProductCard key={p.id} product={p} region={region} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-card/20 rounded-xl border border-dashed border-white/10">
                  <List className="mx-auto h-12 w-12 text-muted-foreground mb-4 opacity-20" />
                  <h3 className="text-xl font-display">Nenhum cristal encontrado</h3>
                  <p className="text-muted-foreground mt-2">Tente ajustar seus filtros místicos.</p>
                </div>
              )}
            </div>
          </div>

          {/* SEO Section */}
          <Collapsible open={seoExpanded} onOpenChange={setSeoExpanded} className="mt-20">
            <CollapsibleTrigger className="flex items-center gap-3 group w-full border-t border-white/10 pt-10">
              <h2 className="text-2xl font-display group-hover:text-secondary transition-colors">
                Descubra o Universo das Pedras e Cristais
              </h2>
              <ChevronDown className={`text-secondary transition-transform ${seoExpanded ? "rotate-180" : ""}`} />
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-6 text-muted-foreground font-mystical text-lg leading-relaxed max-w-4xl animate-accordion-down">
              <p>Bem-vindo à nossa curadoria mística...</p>
              {/* Conteúdo SEO conforme seu mock */}
            </CollapsibleContent>
          </Collapsible>
        </div>
      </section>
    </div>
  )
}