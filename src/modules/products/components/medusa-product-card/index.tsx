"use client"

import React from "react"
import { Heart, ShoppingBag, Eye } from "lucide-react"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@components/ui/button"
import { Badge } from "@components/ui/badge"
import { useCartContext } from "@lib/context/CartContext"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { cn } from "@lib/utils"

interface MedusaProductCardProps {
    product: HttpTypes.StoreProduct
    region: HttpTypes.StoreRegion
}

const MedusaProductCard = ({ product, region }: MedusaProductCardProps) => {
    const { addItem } = useCartContext()

    const variant = product.variants?.[0]
    const currentPrice = variant?.calculated_price?.calculated_amount || 0
    const originalPrice = variant?.calculated_price?.original_amount || 0
    const currencyCode = region.currency_code?.toUpperCase() || "BRL"

    const discount = originalPrice > currentPrice
        ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
        : 0

    // CORREÇÃO TS: Garantindo que stock seja tratado como número ou 0
    const stock = variant?.inventory_quantity ?? 0
    const isNew = product.metadata?.is_new as boolean
    const category = product.categories?.[0]?.name || product.collection?.title || "Místico"

    const formatPrice = (value: number) => {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: currencyCode,
        }).format(value)
    }

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        if (variant?.id) {
            // CORREÇÃO TS: Adicionado o segundo argumento 'quantity' exigido pelo Contexto
            await addItem({ variantId: variant.id, quantity: 1 })
        }
    }

    return (
        <LocalizedClientLink
            href={`/products/${product.handle}`}
            className={cn(
                "group relative flex flex-col h-full rounded-lg overflow-hidden",
                "border border-border/40 bg-card/40 glass-dark transition-all duration-500",
                "hover:border-secondary/50 hover:shadow-gold"
            )}
        >
            <div className="relative aspect-square overflow-hidden bg-muted/20">
                <img
                    src={product.thumbnail || "/placeholder.svg"}
                    alt={product.title || "Produto"}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 z-20">
                    <Button size="icon" variant="outline" className="border-white/10 bg-background/80 hover:bg-secondary hover:text-secondary-foreground" onClick={(e) => e.preventDefault()}>
                        <Heart className="h-4 w-4" />
                    </Button>
                    <Button size="icon" className="bg-primary text-primary-foreground hover:shadow-emerald" onClick={handleAddToCart}>
                        <ShoppingBag className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="outline" className="border-white/10 bg-background/80 hover:bg-foreground hover:text-background">
                        <Eye className="h-4 w-4" />
                    </Button>
                </div>

                <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
                    {isNew && (
                        <Badge className="bg-emerald text-emerald-foreground font-display text-[10px] tracking-widest border-none">
                            NOVO
                        </Badge>
                    )}
                    {discount > 0 && (
                        <Badge className="bg-accent text-white font-display text-[10px] border-none animate-pulse">
                            -{discount}%
                        </Badge>
                    )}
                </div>

                {/* CORREÇÃO TS: 'stock' agora é garantido como number, evitando erro de null */}
                {stock > 0 && stock <= 5 && (
                    <div className="absolute bottom-3 left-3 right-3 z-10 pointer-events-none">
                        <div className="bg-accent/90 backdrop-blur-sm text-white text-[10px] py-1 px-2 text-center rounded font-medium shadow-lg animate-bounce">
                            🔥 Apenas {stock} em estoque!
                        </div>
                    </div>
                )}
            </div>

            <div className="p-4 flex flex-col flex-grow">
                <span className="text-[10px] text-secondary font-medium uppercase tracking-[0.2em] font-body mb-1">
                    {category}
                </span>
                <h3 className="font-display text-sm md:text-base text-foreground mt-1 line-clamp-2 group-hover:text-secondary transition-colors leading-tight">
                    {product.title}
                </h3>

                <div className="mt-auto pt-4">
                    <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold bg-gradient-to-r from-[#D4AF37] via-[#F1D06E] to-[#996515] bg-clip-text text-transparent">
                            {formatPrice(currentPrice)}
                        </span>
                        {discount > 0 && (
                            <span className="text-xs text-muted-foreground line-through font-body">
                                {formatPrice(originalPrice)}
                            </span>
                        )}
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1 font-mystical italic leading-relaxed">
                        ou 3x de {formatPrice(currentPrice / 3)} sem juros
                    </p>
                </div>
            </div>
        </LocalizedClientLink>
    )
}

export default MedusaProductCard