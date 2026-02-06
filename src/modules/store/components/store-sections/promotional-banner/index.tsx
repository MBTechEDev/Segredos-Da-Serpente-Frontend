"use client"

import { useState, useEffect, useCallback } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@components/ui/button"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { cn } from "@lib/utils"

interface BannerSlide {
    id: string
    title: string
    subtitle: string
    cta: string
    link: string
    bgGradient: string
}

const bannerSlides: BannerSlide[] = [
    {
        id: "1",
        title: "Coleção Lua Nova",
        subtitle: "Cristais selecionados para rituais de renovação e novos começos",
        cta: "Explorar Coleção",
        link: "/categories/lua-nova",
        bgGradient: "from-[#064e3b]/40 via-background to-background",
    },
    {
        id: "2",
        title: "Até 50% OFF",
        subtitle: "Semana da Proteção Espiritual - Turmalinas e Obsidianas",
        cta: "Ver Ofertas",
        link: "/store?ofertas=true",
        bgGradient: "from-[#996515]/20 via-background to-background",
    },
    {
        id: "3",
        title: "Kits Exclusivos",
        subtitle: "Monte seu altar sagrado com nossos kits especiais",
        cta: "Conhecer Kits",
        link: "/categories/kits",
        bgGradient: "from-primary/20 via-background to-background",
    },
]

const PromotionalBanner = () => {
    const [currentSlide, setCurrentSlide] = useState(0)
    const [isExiting, setIsExiting] = useState(false)

    const nextSlide = useCallback(() => {
        setIsExiting(true)
        setTimeout(() => {
            setCurrentSlide((prev) => (prev + 1) % bannerSlides.length)
            setIsExiting(false)
        }, 300)
    }, [])

    const prevSlide = () => {
        setIsExiting(true)
        setTimeout(() => {
            setCurrentSlide((prev) => (prev - 1 + bannerSlides.length) % bannerSlides.length)
            setIsExiting(false)
        }, 300)
    }

    useEffect(() => {
        const timer = setInterval(nextSlide, 8000)
        return () => clearInterval(timer)
    }, [nextSlide])

    const slide = bannerSlides[currentSlide]

    return (
        <section className="relative overflow-hidden min-h-[400px] md:min-h-[500px] flex items-center border-b border-white/5">
            {/* Background Transition Layer */}
            <div
                className={cn(
                    "absolute inset-0 transition-opacity duration-1000 bg-gradient-to-r",
                    slide.bgGradient
                )}
            />

            <div className="container mx-auto px-4 relative z-10">
                <div className={cn(
                    "max-w-3xl transition-all duration-500 transform",
                    isExiting ? "opacity-0 translate-x-4" : "opacity-100 translate-x-0"
                )}>
                    {/* Título com Gradiente Dourado (Regra de Ouro) */}
                    <h2 className="text-4xl md:text-6xl font-display mb-4 bg-gradient-to-r from-[#D4AF37] via-[#F1D06E] to-[#996515] bg-clip-text text-transparent drop-shadow-sm">
                        {slide.title}
                    </h2>

                    <p className="text-lg md:text-2xl text-zinc-400 font-mystical italic mb-8 max-w-xl">
                        {slide.subtitle}
                    </p>

                    <LocalizedClientLink href={slide.link}>
                        <Button size="lg" className="cta-primary text-base px-10 h-14 rounded-none tracking-widest uppercase font-display">
                            {slide.cta}
                        </Button>
                    </LocalizedClientLink>
                </div>
            </div>

            {/* Decorative Glass Element */}
            <div className="absolute right-0 top-0 h-full w-1/3 bg-emerald-500/5 blur-[120px] pointer-events-none" />

            {/* Navigation Controls */}
            <div className="absolute bottom-8 right-4 md:right-12 flex items-center gap-4 z-20">
                <div className="flex gap-2 mr-4">
                    {bannerSlides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                setIsExiting(true)
                                setTimeout(() => {
                                    setCurrentSlide(index)
                                    setIsExiting(false)
                                }, 300)
                            }}
                            className={cn(
                                "h-1 transition-all duration-300",
                                index === currentSlide ? "w-8 bg-secondary" : "w-4 bg-white/20"
                            )}
                            aria-label={`Ir para slide ${index + 1}`}
                        />
                    ))}
                </div>

                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={prevSlide}
                        className="rounded-full bg-background/50 border-white/10 hover:bg-secondary hover:text-background transition-colors"
                    >
                        <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={nextSlide}
                        className="rounded-full bg-background/50 border-white/10 hover:bg-secondary hover:text-background transition-colors"
                    >
                        <ChevronRight className="h-5 w-5" />
                    </Button>
                </div>
            </div>
        </section>
    )
}

export default PromotionalBanner