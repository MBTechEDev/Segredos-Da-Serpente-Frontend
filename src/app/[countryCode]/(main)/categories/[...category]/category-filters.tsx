"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@components/ui/accordion"
import { Checkbox } from "@components/ui/checkbox"
import { Filter } from "lucide-react"

interface CategoryFiltersProps {
  availableTags: { label: string; count: number }[]
}

export default function CategoryFilters({ availableTags }: CategoryFiltersProps) {
  return (
    <aside className="w-full lg:w-72 flex-shrink-0">
      <div className="sticky top-24 p-6 rounded-lg border border-white/5 bg-card/30 glass-dark">
        <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-4">
          <Filter className="h-4 w-4 text-secondary" />
          <h2 className="font-display text-lg uppercase tracking-widest text-foreground">Filtros</h2>
        </div>

        <Accordion type="single" collapsible defaultValue="tags" className="w-full">
          <AccordionItem value="tags" className="border-white/5">
            <AccordionTrigger className="hover:no-underline py-3">
              <span className="text-sm font-medium text-foreground/80 uppercase tracking-tight font-display">
                Propriedades Místicas
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 pt-1 pb-4">
                {availableTags.length > 0 ? (
                  availableTags.map((tag) => (
                    <div key={tag.label} className="flex items-center justify-between group cursor-pointer">
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id={`tag-${tag.label}`}
                          className="border-white/20 data-[state=checked]:bg-secondary data-[state=checked]:border-secondary"
                        />
                        <label
                          htmlFor={`tag-${tag.label}`}
                          className="text-sm text-muted-foreground group-hover:text-secondary transition-colors cursor-pointer font-mystical"
                        >
                          {tag.label}
                        </label>
                      </div>
                      <span className="text-[10px] text-muted-foreground/50 font-mono">({tag.count})</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground italic">Nenhuma tag encontrada.</p>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </aside>
  )
}