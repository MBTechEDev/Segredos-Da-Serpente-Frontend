"use client"

import * as React from "react"
import { Filter, X } from "lucide-react"
import { Button } from "@components/ui/button"
import { Checkbox } from "@components/ui/checkbox"
import { Slider } from "@components/ui/slider"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@components/ui/sheet"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@components/ui/accordion"
import { cn } from "@lib/utils"
import { HttpTypes } from "@medusajs/types"

export interface FiltersState {
    intentions: string[]
    chakras: string[]
    stoneTypes: string[]
    priceRange: [number, number]
}

interface ProductFiltersProps {
    filters: FiltersState
    onFiltersChange: (filters: FiltersState) => void
    categories: HttpTypes.StoreProductCategory[]
}

const FilterContent = ({ filters, onFiltersChange, categories }: ProductFiltersProps) => {
    // Filtramos as categorias baseado no handle definido no Medusa Admin
    const stoneTypes = categories.find(c => c.handle === "pedras")?.category_children || []
    const intentions = categories.find(c => c.handle === "intencoes")?.category_children || []

    const handleCheckboxChange = (
        category: keyof Omit<FiltersState, "priceRange">,
        id: string,
        checked: boolean
    ) => {
        const currentValues = filters[category]
        const newValues = checked
            ? [...currentValues, id]
            : currentValues.filter((v) => v !== id)

        onFiltersChange({ ...filters, [category]: newValues })
    }

    const activeFiltersCount =
        filters.intentions.length +
        filters.chakras.length +
        filters.stoneTypes.length +
        (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000 ? 1 : 0)

    return (
        <div className="space-y-2">
            {activeFiltersCount > 0 && (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onFiltersChange({
                        intentions: [], chakras: [], stoneTypes: [], priceRange: [0, 1000]
                    })}
                    className="w-full justify-start text-secondary hover:text-secondary/80 mb-4"
                >
                    <X className="h-4 w-4 mr-2" />
                    Limpar filtros ({activeFiltersCount})
                </Button>
            )}

            <Accordion type="multiple" defaultValue={["price"]} className="w-full">
                <AccordionItem value="price" className="border-border/50">
                    <AccordionTrigger className="font-display text-sm uppercase tracking-widest">Preço</AccordionTrigger>
                    <AccordionContent className="pt-4 pb-6 px-2">
                        <Slider
                            value={filters.priceRange}
                            onValueChange={(val) => onFiltersChange({ ...filters, priceRange: val as [number, number] })}
                            max={1000}
                            step={50}
                        />
                        <div className="flex justify-between mt-4 text-xs font-mono text-muted-foreground">
                            <span>R$ {filters.priceRange[0]}</span>
                            <span>R$ {filters.priceRange[1]}</span>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* Mapeamento dinâmico de categorias do Medusa */}
                {[
                    { label: "Intenção", options: intentions, key: "intentions" as const },
                    { label: "Tipo de Pedra", options: stoneTypes, key: "stoneTypes" as const },
                ].map((section) => section.options.length > 0 && (
                    <AccordionItem key={section.key} value={section.key} className="border-border/50">
                        <AccordionTrigger className="font-display text-sm uppercase tracking-widest">{section.label}</AccordionTrigger>
                        <AccordionContent>
                            <div className="space-y-3 pt-2">
                                {section.options.map((option) => (
                                    <label key={option.id} className="flex items-center gap-3 cursor-pointer group">
                                        <Checkbox
                                            checked={filters[section.key].includes(option.id)}
                                            onCheckedChange={(checked) => handleCheckboxChange(section.key, option.id, !!checked)}
                                        />
                                        <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                                            {option.name}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    )
}

export const ProductFiltersSidebar = (props: ProductFiltersProps) => (
    <aside className="hidden lg:block w-64 shrink-0">
        <div className="sticky top-28 glass-dark rounded-xl border border-white/10 p-6">
            <h3 className="font-display text-lg text-gradient-gold mb-6 flex items-center gap-2">
                <Filter className="h-5 w-5 text-secondary" /> Filtros
            </h3>
            <FilterContent {...props} />
        </div>
    </aside>
)

export const ProductFiltersMobile = (props: ProductFiltersProps) => {
    const [open, setOpen] = React.useState(false)
    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="outline" className="lg:hidden gap-2 border-border">
                    <Filter className="h-4 w-4" /> Filtrar
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-background border-white/10">
                <SheetHeader><SheetTitle className="font-display text-gradient-gold">Filtros</SheetTitle></SheetHeader>
                <div className="mt-8"><FilterContent {...props} /></div>
            </SheetContent>
        </Sheet>
    )
}