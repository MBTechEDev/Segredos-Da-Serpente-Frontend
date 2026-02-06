"use client"

import React from "react"
import { HttpTypes } from "@medusajs/types"
import { Sparkles, Gem, Droplets, Heart, Tag, User, LogIn, ChevronRight } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@components/ui/accordion"
import { Button } from "@components/ui/button"
import { Checkbox } from "@components/ui/checkbox"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

// Tipagem das PropsS
type MobileMenuProps = {
    categories: HttpTypes.StoreProductCategory[]
    isOpen?: boolean // Caso queiras controlar o estado externamente depois
}

// Utilitário para mapear ícones baseados no handle da categoria (opcional, para manter o visual)
const getCategoryIcon = (handle: string) => {
    if (handle.includes("ritual") || handle.includes("velas")) return Sparkles
    if (handle.includes("cristal") || handle.includes("pedra")) return Gem
    if (handle.includes("oleo") || handle.includes("banho")) return Droplets
    if (handle.includes("cuidado") || handle.includes("corpo")) return Heart
    return Sparkles // Ícone padrão
}

const MobileMenu = ({ categories }: MobileMenuProps) => {
    // Filtros estáticos (Filtros dinâmicos complexos geralmente ficam na página de busca, não no menu)
    const priceRanges = [
        "Até R$ 50",
        "R$ 50 - R$ 100",
        "R$ 100 - R$ 200",
        "Acima de R$ 200",
    ]

    return (
        <div className="h-full flex flex-col bg-background">
            {/* Header */}
            <div className="p-6 border-b border-border">
                <LocalizedClientLink href="/" className="flex items-baseline">
                    <span className="font-display text-xl text-gradient-gold tracking-wider bg-gradient-to-r from-[#D4AF37] via-[#F1D06E] to-[#996515] bg-clip-text text-transparent drop-shadow-sm">
                        Segredos
                    </span>
                    <span className="font-mystical text-lg text-foreground/80 italic ml-1">
                        da Serpente
                    </span>
                </LocalizedClientLink>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 scrollbar-hide">
                <Accordion type="multiple" className="space-y-2">

                    {/* CATEGORIAS DINÂMICAS DO MEDUSA */}
                    <AccordionItem value="categories" className="border-border">
                        <AccordionTrigger className="text-foreground hover:text-gold py-3">
                            <span className="font-display text-sm tracking-wide">CATEGORIAS</span>
                        </AccordionTrigger>
                        <AccordionContent>
                            <div className="space-y-3 pt-2">
                                {categories && categories.length > 0 ? (
                                    categories.map((category) => {
                                        const Icon = getCategoryIcon(category.handle)
                                        const hasChildren = category.category_children && category.category_children.length > 0

                                        // Se tiver subcategorias, renderiza um Accordion interno
                                        if (hasChildren) {
                                            return (
                                                <Accordion type="single" collapsible key={category.id}>
                                                    <AccordionItem value={category.id} className="border-0">
                                                        <AccordionTrigger className="py-2 hover:no-underline group">
                                                            <div className="flex items-center gap-3">
                                                                <Icon className="h-4 w-4 text-secondary group-hover:text-gold transition-colors" />
                                                                <span className="text-sm text-foreground/80 group-hover:text-gold transition-colors">
                                                                    {category.name}
                                                                </span>
                                                            </div>
                                                        </AccordionTrigger>
                                                        <AccordionContent>
                                                            <div className="pl-7 space-y-2 pt-1 border-l border-white/5 ml-2">
                                                                {category.category_children?.map((child) => (
                                                                    <LocalizedClientLink
                                                                        key={child.id}
                                                                        href={`/categories/${child.handle}`}
                                                                        className="block text-sm text-muted-foreground hover:text-gold transition-colors py-1 pl-2"
                                                                    >
                                                                        {child.name}
                                                                    </LocalizedClientLink>
                                                                ))}
                                                            </div>
                                                        </AccordionContent>
                                                    </AccordionItem>
                                                </Accordion>
                                            )
                                        }

                                        // Se não tiver subcategorias, é apenas um link direto
                                        return (
                                            <LocalizedClientLink
                                                key={category.id}
                                                href={`/categories/${category.handle}`}
                                                className="flex items-center gap-3 py-2 text-sm text-foreground/80 hover:text-gold transition-colors"
                                            >
                                                <Icon className="h-4 w-4 text-secondary" />
                                                <span>{category.name}</span>
                                            </LocalizedClientLink>
                                        )
                                    })
                                ) : (
                                    <p className="text-sm text-muted-foreground pl-2">Nenhuma categoria encontrada.</p>
                                )}
                            </div>
                        </AccordionContent>
                    </AccordionItem>

                    {/* FAIXA DE PREÇO (Estático - Filtros visuais) */}
                    <AccordionItem value="price" className="border-border">
                        <AccordionTrigger className="text-foreground hover:text-gold py-3">
                            <span className="font-display text-sm tracking-wide">FAIXA DE PREÇO</span>
                        </AccordionTrigger>
                        <AccordionContent>
                            <div className="space-y-3 pt-2">
                                {priceRanges.map((range) => (
                                    <div key={range} className="flex items-center gap-3">
                                        <Checkbox id={range} className="border-secondary data-[state=checked]:bg-secondary" />
                                        <label
                                            htmlFor={range}
                                            className="text-sm text-foreground/80 cursor-pointer hover:text-gold transition-colors"
                                        >
                                            {range}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </AccordionContent>
                    </AccordionItem>

                    {/* PROMOÇÕES (Estático - Links de marketing) */}
                    <AccordionItem value="promos" className="border-border">
                        <AccordionTrigger className="text-foreground hover:text-gold py-3">
                            <div className="flex items-center gap-2">
                                <Tag className="h-4 w-4 text-accent" />
                                <span className="font-display text-sm tracking-wide">PROMOÇÕES</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent>
                            <div className="space-y-3 pt-2">
                                <div className="flex items-center gap-3 group cursor-pointer">
                                    <Checkbox className="border-accent data-[state=checked]:bg-accent" />
                                    <span className="text-sm text-foreground/80 group-hover:text-accent transition-colors">
                                        Ofertas Relâmpago ⚡
                                    </span>
                                </div>
                                {/* Outros itens de promoção */}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>

            {/* Footer Actions */}
            <div className="p-4 border-t border-border space-y-3 bg-card/30">
                <LocalizedClientLink href="/account" className="w-full block">
                    <Button className="w-full cta-primary py-6">
                        <User className="h-4 w-4 mr-2" />
                        Minha Conta
                    </Button>
                </LocalizedClientLink>

                <LocalizedClientLink href="/account/login" className="w-full block">
                    <Button variant="outline" className="w-full border-secondary/50 text-secondary hover:bg-secondary hover:text-secondary-foreground py-6 border-mystical">
                        <LogIn className="h-4 w-4 mr-2" />
                        Entrar / Cadastrar
                    </Button>
                </LocalizedClientLink>
            </div>
        </div>
    )
}

export default MobileMenu