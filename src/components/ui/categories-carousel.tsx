"use client"

import React from "react"
import { Sparkles, Gem, Droplets, Heart, Moon, Sun, Shield, Coins, Star, LucideIcon } from "lucide-react"
import { HttpTypes } from "@medusajs/types"
import useEmblaCarousel from "embla-carousel-react"
import { cn } from "@lib/utils"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

// Mapeamento de estilos por categoria conforme as imagens
const categoryStyles: Record<string, { icon: LucideIcon, color: string, glow: string }> = {
    cristais: { icon: Gem, color: "border-emerald-500/30", glow: "bg-emerald-500/10" },
    protecao: { icon: Shield, color: "border-slate-500/30", glow: "bg-slate-500/10" },
    amor: { icon: Heart, color: "border-rose-500/30", glow: "bg-rose-500/10" },
    prosperidade: { icon: Coins, color: "border-amber-600/30", glow: "bg-amber-600/10" },
    rituais: { icon: Moon, color: "border-secondary/30", glow: "bg-secondary/10" },
    colecoes: { icon: Star, color: "border-secondary/30", glow: "bg-secondary/10" },
}

interface CategoriesCarouselProps {
    categories: HttpTypes.StoreProductCategory[]
}

const CategoriesCarousel = ({ categories }: CategoriesCarouselProps) => {
    const [emblaRef] = useEmblaCarousel({
        loop: false,
        align: "start",
        containScroll: "trimSnaps",
    })

    return (
        <section className="w-full py-12 bg-background">
            <div className="container mx-auto px-6 md:px-12">
                <div className="overflow-visible" ref={emblaRef}>
                    <div className="flex -ml-4">
                        {categories.map((category) => {
                            const style = categoryStyles[category.handle] || {
                                icon: Sparkles,
                                color: "border-secondary/20",
                                glow: "bg-secondary/5"
                            }
                            const Icon = style.icon

                            return (
                                <div
                                    key={category.id}
                                    className="min-w-0 pl-4 flex-none w-[45%] sm:w-[30%] lg:w-[16.66%]"
                                >
                                    <LocalizedClientLink
                                        href={`/categories/${category.handle}`}
                                        className={cn(
                                            "group relative flex flex-col items-center text-center p-6 rounded-lg",
                                            "bg-[#111111] border transition-all duration-500",
                                            style.color,
                                            "hover:-translate-y-1.5 hover:shadow-2xl"
                                        )}
                                    >
                                        {/* Backlight Glow dinâmico */}
                                        <div className={cn(
                                            "absolute inset-0 -z-10 blur-[30px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full scale-75",
                                            style.glow
                                        )} />

                                        {/* Ícone Estilizado */}
                                        <div className="mb-6">
                                            <Icon className="h-8 w-8 text-secondary/80 group-hover:text-secondary transition-colors" strokeWidth={1.2} />
                                        </div>

                                        {/* Título (Cinzel) */}
                                        <h3 className="font-display text-sm md:text-base text-foreground mb-1 tracking-wider uppercase">
                                            {category.name}
                                        </h3>

                                        {/* Descrição (Cormorant Garamond) */}
                                        <p className="text-[11px] text-muted-foreground font-mystical italic leading-tight mb-3 px-2 line-clamp-1">
                                            {category.description || "Produtos selecionados"}
                                        </p>

                                        {/* Contador de Produtos (Simulado para o layout) */}
                                        <span className="text-[10px] text-muted-foreground/50 font-body uppercase tracking-[0.1em]">
                                            {category.products?.length || "0"} produtos
                                        </span>

                                        {/* Borda de realce no hover */}
                                        <div className="absolute inset-0 rounded-lg border border-transparent group-hover:border-secondary/30 transition-colors pointer-events-none" />
                                    </LocalizedClientLink>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default CategoriesCarousel