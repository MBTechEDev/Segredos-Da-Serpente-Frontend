"use client"

import * as React from "react"
import { Filter, X } from "lucide-react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { HttpTypes } from "@medusajs/types"

import { Button } from "@components/ui/button"
import { Checkbox } from "@components/ui/checkbox"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@components/ui/sheet"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@components/ui/accordion"

interface ProductFiltersProps {
    searchParams: Record<string, string | string[] | undefined>
    categories: HttpTypes.StoreProductCategory[] // Categorias Raiz vindas do Server Component
}

const FilterContent = ({ searchParams, categories }: ProductFiltersProps) => {
    const router = useRouter()
    const pathname = usePathname()
    const currentParams = useSearchParams()

    // Helper para extrair filtros ativos da URL
    const getActiveFilters = (key: string): string[] => {
        const value = searchParams[key]
        if (!value) return []
        return Array.isArray(value) ? value : [value]
    }

    const activeCategoryIds = getActiveFilters("category_id")

    const handleFilterChange = (id: string, checked: boolean) => {
        const params = new URLSearchParams(currentParams.toString())
        const currentIds = new Set(getActiveFilters("category_id"))

        if (checked) {
            currentIds.add(id)
        } else {
            currentIds.delete(id)
        }

        params.delete("category_id")
        currentIds.forEach(val => params.append("category_id", val))
        params.delete("offset") // Reset de página ao filtrar

        router.push(`${pathname}?${params.toString()}`, { scroll: false })
    }

    return (
        <div className="space-y-4">
            {activeCategoryIds.length > 0 && (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push(pathname)}
                    className="w-full justify-start text-secondary hover:text-secondary/80 border border-secondary/20 bg-secondary/5 mb-2 font-body"
                >
                    <X className="h-4 w-4 mr-2" />
                    Limpar Filtros ({activeCategoryIds.length})
                </Button>
            )}

            <Accordion type="multiple" className="w-full">
                {/* Mapeamento Dinâmico: Cada Categoria Raiz vira um grupo de filtros */}
                {categories.map((parent) => (
                    <AccordionItem key={parent.id} value={parent.id} className="border-white/10">
                        <AccordionTrigger className="font-display text-xs uppercase tracking-[0.2em] hover:text-secondary py-4 text-left">
                            {parent.name}
                        </AccordionTrigger>
                        <AccordionContent className="pb-6">
                            <div className="space-y-3 pt-2">
                                {parent.category_children && parent.category_children.length > 0 ? (
                                    parent.category_children.map((child) => (
                                        <label key={child.id} className="flex items-center gap-3 cursor-pointer group">
                                            <Checkbox
                                                id={child.id}
                                                checked={activeCategoryIds.includes(child.id)}
                                                onCheckedChange={(checked) => handleFilterChange(child.id, !!checked)}
                                                className="border-white/20 data-[state=checked]:bg-secondary data-[state=checked]:border-secondary"
                                            />
                                            <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors font-body">
                                                {child.name}
                                            </span>
                                        </label>
                                    ))
                                ) : (
                                    <p className="text-xs text-muted-foreground italic font-body">
                                        Sem subcategorias nesta seção.
                                    </p>
                                )}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    )
}

export const ProductFiltersSidebar = (props: ProductFiltersProps) => (
    <div className="sticky top-28 glass-dark rounded-xl border border-white/10 p-6">
        <h3 className="font-display text-lg bg-gradient-to-r from-[#D4AF37] via-[#F1D06E] to-[#996515] bg-clip-text text-transparent mb-6 flex items-center gap-2">
            <Filter className="h-5 w-5 text-secondary" /> Filtros Místicos
        </h3>
        <FilterContent {...props} />
    </div>
)

export const ProductFiltersMobile = (props: ProductFiltersProps) => {
    const [open, setOpen] = React.useState(false)
    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="outline" className="lg:hidden gap-2 border-white/10 bg-card/50 hover:bg-card">
                    <Filter className="h-4 w-4 text-secondary" /> Filtrar
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-background border-white/10 w-[300px]">
                <SheetHeader>
                    <SheetTitle className="font-display text-gradient-gold text-left uppercase tracking-widest text-lg">
                        Filtros
                    </SheetTitle>
                </SheetHeader>
                <div className="mt-8">
                    <FilterContent {...props} />
                </div>
            </SheetContent>
        </Sheet>
    )
}