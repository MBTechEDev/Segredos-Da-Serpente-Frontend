"use client"

import React from "react"
import { Sparkles, Gem, Droplets, Heart, Moon, Sun, LucideIcon } from "lucide-react"
import { HttpTypes } from "@medusajs/types"
import useEmblaCarousel from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay"
import { cn } from "@lib/utils"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const iconMap: Record<string, LucideIcon> = {
    rituais: Sparkles,
    cristais: Gem,
    oleos: Droplets,
    cuidados: Heart,
    lua: Moon,
    protecao: Sun,
}

interface CategoriesCarouselProps {
    categories: HttpTypes.StoreProductCategory[]
}

const CategoriesCarousel = ({ categories }: CategoriesCarouselProps) => {
    const isCarousel = categories.length > 6

    const [emblaRef] = useEmblaCarousel(
        {
            loop: true,
            align: "start",
            active: isCarousel
        },
        isCarousel ? [Autoplay({ delay: 4000, stopOnInteraction: false })] : []
    )

    return (
        <div
            className={cn("overflow-hidden", !isCarousel && "flex justify-center")}
            ref={emblaRef}
        >
            <div className={cn(
                "flex",
                isCarousel ? "cursor-grab active:cursor-grabbing" : "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 w-full"
            )}>
                {categories.map((category) => {
                    const Icon = iconMap[category.handle] || Sparkles

                    return (
                        <div
                            key={category.id}
                            className={cn(
                                "min-w-0 px-3",
                                isCarousel ? "flex-[0_0_50%] md:flex-[0_0_33.33%] lg:flex-[0_0_16.66%]" : "w-full"
                            )}
                        >
                            {/* CORREÇÃO: Removido 'block', mantido 'flex flex-col' para alinhamento interno */}
                            <LocalizedClientLink
                                href={`/categories/${category.handle}`}
                                className="group relative flex flex-col items-center text-center p-6 rounded-xl border border-secondary/20 bg-gradient-to-br from-secondary/5 to-background glass-dark transition-all duration-500 hover:border-secondary hover:-translate-y-2 h-full shadow-lg"
                            >
                                <div className="w-12 h-12 rounded-full bg-background/50 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all duration-300">
                                    <Icon className="h-6 w-6 text-secondary" />
                                </div>

                                <h3 className="font-display text-sm md:text-base text-foreground group-hover:text-secondary transition-colors uppercase tracking-widest">
                                    {category.name}
                                </h3>

                                {category.description && (
                                    <p className="text-[10px] text-muted-foreground mt-2 line-clamp-2 font-mystical leading-relaxed">
                                        {category.description}
                                    </p>
                                )}

                                {/* Efeito visual de brilho no hover */}
                                <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-secondary/0 via-secondary/5 to-secondary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                            </LocalizedClientLink>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default CategoriesCarousel