"use client"

import { useState } from "react"
import { Heart, ShoppingCart, Eye, Star, Sparkles } from "lucide-react"
import { Button } from "@components/ui/button"
import { Badge } from "@components/ui/badge"
import { cn } from "@lib/utils"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"
import Image from "next/image"

// Assumindo que formatAmount vem de um utilitário de preço do Medusa v2
// Se não tiver um, pode-se usar uma função simples de Intl.NumberFormat
const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(amount / 100)
}

interface ProductCardProps {
    product: HttpTypes.StoreProduct
    region: HttpTypes.StoreRegion
}

const ProductCard = ({ product, region }: ProductCardProps) => {
    const [isWishlisted, setIsWishlisted] = useState(false)
    const [isHovered, setIsHovered] = useState(false)

    // Extração de dados do modelo Medusa v2
    const {
        id,
        title,
        handle,
        thumbnail,
        categories,
        variants
    } = product

    // Lógica simples de preço baseada na primeira variante
    const variant = variants?.[0]
    const price = variant?.calculated_price?.calculated_amount || 0
    const originalPrice = variant?.calculated_price?.original_amount
    const hasDiscount = originalPrice && originalPrice > price
    const discountPercentage = hasDiscount
        ? Math.round(((originalPrice - price) / originalPrice) * 100)
        : 0

    return (
        <div
            className="group relative bg-card rounded-xl border border-border overflow-hidden transition-all duration-300 hover:border-secondary/50 hover:shadow-[0_0_20px_rgba(212,175,55,0.15)]"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Image Container */}
            <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                <LocalizedClientLink href={`/products/${handle}`}>
                    <Image
                        src={thumbnail || "/placeholder.svg"}
                        alt={title || "Produto Segredos da Serpente"}
                        fill
                        className={cn(
                            "object-cover transition-transform duration-700 ease-in-out",
                            isHovered && "scale-110"
                        )}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                </LocalizedClientLink>

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {product.created_at && (
                        <Badge className="bg-emerald-600 text-white border-none text-[10px] font-bold uppercase tracking-wider">
                            <Sparkles className="h-3 w-3 mr-1" />
                            Místico
                        </Badge>
                    )}
                    {hasDiscount && (
                        <Badge className="bg-accent text-accent-foreground text-xs font-bold border-none">
                            -{discountPercentage}%
                        </Badge>
                    )}
                </div>

                {/* Wishlist Button */}
                <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                        "absolute top-3 right-3 h-9 w-9 rounded-full bg-background/40 backdrop-blur-md border border-white/10 hover:bg-background/60 transition-all",
                        isWishlisted ? "text-secondary" : "text-white hover:text-secondary"
                    )}
                    onClick={(e) => {
                        e.preventDefault()
                        setIsWishlisted(!isWishlisted)
                    }}
                >
                    <Heart className={cn("h-5 w-5", isWishlisted && "fill-current")} />
                </Button>

                {/* Quick Actions Overlay (Glassmorphism) */}
                <div
                    className={cn(
                        "absolute inset-x-0 bottom-0 p-4 bg-background/20 backdrop-blur-md border-t border-white/10 transition-all duration-500 transform",
                        isHovered ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
                    )}
                >
                    <div className="flex gap-2">
                        <Button
                            size="sm"
                            className="flex-1 bg-emerald-700 hover:bg-emerald-600 text-white font-body"
                        >
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Adicionar
                        </Button>
                        <LocalizedClientLink href={`/products/${handle}`}>
                            <Button
                                size="sm"
                                variant="outline"
                                className="h-9 w-9 p-0 border-white/20 bg-white/5 hover:bg-white/10 text-white"
                            >
                                <Eye className="h-4 w-4" />
                            </Button>
                        </LocalizedClientLink>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
                {/* Category */}
                {categories && categories.length > 0 && (
                    <p className="text-[10px] text-secondary/80 uppercase tracking-[0.2em] font-medium font-body">
                        {categories[0].name}
                    </p>
                )}

                {/* Title (Cinzel Font) */}
                <LocalizedClientLink href={`/products/${handle}`}>
                    <h3 className="font-display text-base text-foreground line-clamp-1 group-hover:text-secondary transition-colors uppercase tracking-wide">
                        {title}
                    </h3>
                </LocalizedClientLink>

                {/* Rating Placeholder */}
                <div className="flex items-center gap-2">
                    <div className="flex items-center text-gold">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className={cn("h-3 w-3 fill-current", i === 4 && "opacity-30")} />
                        ))}
                    </div>
                    <span className="text-[10px] text-muted-foreground font-body">(12)</span>
                </div>

                {/* Prices */}
                <div className="flex flex-col pt-1">
                    <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold bg-gradient-to-r from-[#D4AF37] via-[#F1D06E] to-[#996515] bg-clip-text text-transparent font-display">
                            {formatPrice(price)}
                        </span>
                        {hasDiscount && (
                            <span className="text-xs text-muted-foreground line-through decoration-emerald-900/50">
                                {formatPrice(originalPrice)}
                            </span>
                        )}
                    </div>
                    <p className="text-[10px] text-muted-foreground/60 font-body italic">
                        Em até 3x de {formatPrice(price / 3)}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default ProductCard