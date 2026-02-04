"use client"

import { Heart, ShoppingBag, Eye } from "lucide-react"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@components/ui/button"
import { Badge } from "@components/ui/badge"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { cn } from "@lib/utils" // Utilitário obrigatório para classes dinâmicas

interface ProductCardProps {
    product: HttpTypes.StoreProduct
    region: HttpTypes.StoreRegion
    className?: string // Permite estender o estilo via props
}

const ProductCard = ({ product, region, className }: ProductCardProps) => {
    const cheapestPrice = product.variants?.[0]?.calculated_price?.calculated_amount || 0
    const originalPrice = product.variants?.[0]?.calculated_price?.original_amount
    const currencyCode = region.currency_code?.toUpperCase() || "BRL"

    const formatPrice = (value: number) => {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: currencyCode,
        }).format(value)
    }

    const discountPercentage = originalPrice
        ? Math.round(((originalPrice - cheapestPrice) / originalPrice) * 100)
        : 0

    return (
        <LocalizedClientLink
            href={`/products/${product.handle}`}
            className={cn(
                "group relative flex flex-col h-full rounded-lg overflow-hidden",
                "border border-border/40 bg-card/40 glass-dark transition-all duration-500",
                "hover:border-secondary/50 hover:shadow-[0_0_20px_rgba(212,175,55,0.1)]",
                className // Aplicação da Regra de Ouro: flexibilidade via cn()
            )}
        >
            {/* Container de Imagem */}
            <div className="relative aspect-[4/5] overflow-hidden bg-muted/10">
                <img
                    src={product.thumbnail || "/placeholder.svg"} // Fallback obrigatório
                    alt={product.title || "Produto"}
                    className={cn(
                        "w-full h-full object-cover transition-transform duration-700",
                        "group-hover:scale-110"
                    )}
                    loading="lazy"
                />

                {/* Overlay de Ações Rápidas */}
                <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 z-20">
                    <Button
                        size="icon"
                        variant="outline"
                        className="border-white/10 bg-background/80 hover:bg-secondary hover:text-secondary-foreground"
                        onClick={(e) => { e.preventDefault(); /* Logic Wishlist */ }}
                    >
                        <Heart className="h-4 w-4" />
                    </Button>
                    <Button
                        size="icon"
                        className="bg-primary text-primary-foreground hover:bg-primary/90"
                        onClick={(e) => { e.preventDefault(); /* Logic Cart */ }}
                    >
                        <ShoppingBag className="h-4 w-4" />
                    </Button>
                </div>

                {/* Selos (Badges) */}
                <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
                    {product.status === "proposed" && (
                        <Badge className="bg-emerald text-emerald-foreground font-display text-[10px] border-none">
                            NOVO
                        </Badge>
                    )}
                    {discountPercentage > 0 && (
                        <Badge className="bg-accent text-white font-display text-[10px] border-none animate-pulse">
                            -{discountPercentage}%
                        </Badge>
                    )}
                </div>
            </div>

            {/* Informações do Produto */}
            <div className="p-4 flex flex-col flex-grow">
                <p className="text-[10px] text-secondary font-medium uppercase tracking-[0.2em] mb-1">
                    {product.categories?.[0]?.name || "Místico"}
                </p>

                <h3 className="font-display text-sm md:text-base text-foreground line-clamp-2 group-hover:text-secondary transition-colors duration-300">
                    {product.title}
                </h3>

                <div className="mt-auto pt-4 flex flex-col">
                    <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold bg-gradient-to-r from-[#D4AF37] via-[#F1D06E] to-[#996515] bg-clip-text text-transparent">
                            {formatPrice(cheapestPrice)}
                        </span>
                        {originalPrice && originalPrice > cheapestPrice && (
                            <span className="text-xs text-muted-foreground line-through">
                                {formatPrice(originalPrice)}
                            </span>
                        )}
                    </div>

                    <p className="text-[10px] text-muted-foreground font-mystical italic mt-1">
                        ou 3x de {formatPrice(cheapestPrice / 3)} sem juros
                    </p>
                </div>
            </div>
        </LocalizedClientLink>
    )
}

export default ProductCard