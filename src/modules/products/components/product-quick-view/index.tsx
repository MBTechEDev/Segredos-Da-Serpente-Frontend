"use client"

import React, { useState } from "react"
import { HttpTypes } from "@medusajs/types"
import { ShoppingBag, Loader2, Eye, Users, Minus, Plus, Truck, ShieldCheck, RefreshCw } from "lucide-react"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@components/ui/dialog"
import { Button } from "@components/ui/button"
import { Badge } from "@components/ui/badge"
import { useCartContext } from "@lib/context/CartContext"
import { cn } from "@lib/utils"

interface ProductQuickViewProps {
    product: HttpTypes.StoreProduct
    region: HttpTypes.StoreRegion
    isOpen: boolean
    setIsOpen: (isOpen: boolean) => void
}

const ProductQuickView = ({ product, region, isOpen, setIsOpen }: ProductQuickViewProps) => {
    const { addItem } = useCartContext()
    const [isAdding, setIsAdding] = useState(false)
    const [quantity, setQuantity] = useState(1)
    const [activeImage, setActiveImage] = useState(product.images?.[0]?.url || product.thumbnail || "/placeholder.svg")

    // Pegamos a primeira variante para o Quick View, ou lidamos com opções.
    // Para simplificar no Quick View, o clique na cor/tamanho poderia atualizar esse selectedVariant
    const [selectedVariant, setSelectedVariant] = useState(product.variants?.[0])

    const currentPrice = selectedVariant?.calculated_price?.calculated_amount || 0
    const originalPrice = selectedVariant?.calculated_price?.original_amount
    const currencyCode = region.currency_code?.toUpperCase() || "BRL"

    const isNew = product.metadata?.is_new as boolean || product.status === "proposed"
    const category = product.categories?.[0]?.name || product.collection?.title || "Místico"

    const discountPercentage = originalPrice && originalPrice > currentPrice
        ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
        : 0

    const formatPrice = (value: number) => {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: currencyCode,
        }).format(value)
    }

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        if (selectedVariant?.id) {
            setIsAdding(true)
            try {
                await addItem({ variantId: selectedVariant.id, quantity })
                setIsOpen(false)
            } finally {
                setIsAdding(false)
            }
        }
    }

    // Gerando um número aleatório realista e fixo para as métricas da loja mística
    const randomEyes = React.useMemo(() => Math.floor(Math.random() * (24 - 5 + 1)) + 5, [])

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="max-w-4xl lg:max-w-5xl p-0 overflow-hidden bg-[#0A0A0A] border-white/10 shadow-2xl">
                <div className="grid grid-cols-1 md:grid-cols-2 h-full max-h-[90vh]">

                    {/* Coluna da Imagem - Estilo Foco */}
                    <div className="relative w-full h-full bg-[#050505] p-6 lg:p-10 flex flex-col justify-center items-center overflow-hidden">
                        <div className="relative w-full max-w-sm aspect-[4/5] rounded-xl overflow-hidden border border-white/5 shadow-2xl">
                            <img
                                src={activeImage}
                                alt={product.title}
                                className="object-cover w-full h-full transition-opacity duration-300"
                            />
                            <div className="absolute top-4 left-4 flex gap-2 z-10">
                                {isNew && (
                                    <Badge className="bg-emerald text-emerald-foreground font-display text-[10px] tracking-widest border-none">
                                        NOVO
                                    </Badge>
                                )}
                                {discountPercentage > 0 && (
                                    <Badge className="bg-[#D4AF37] text-black font-display text-[10px] border-none">
                                        -{discountPercentage}%
                                    </Badge>
                                )}
                            </div>
                        </div>

                        {/* Pseudo-galeria (caso haja mais imagens) */}
                        {product.images && product.images.length > 1 && (
                            <div className="flex gap-2 mt-4 max-w-sm w-full overflow-x-auto pb-2 scrollbar-hide">
                                {product.images.slice(0, 4).map((img) => (
                                    <button
                                        key={img.id}
                                        className={cn(
                                            "w-16 h-16 rounded-md overflow-hidden border transition-colors flex-shrink-0",
                                            activeImage === img.url ? "border-secondary" : "border-white/10 hover:border-secondary/50"
                                        )}
                                        onClick={() => setActiveImage(img.url)}
                                    >
                                        <img src={img.url} alt="Thumbnail" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Coluna de Informações e Compra */}
                    <div className="flex flex-col p-6 lg:p-10 overflow-y-auto">
                        <DialogHeader className="mb-6 text-left space-y-2">
                            <p className="text-[10px] text-secondary font-medium uppercase tracking-[0.2em] font-body">
                                {category}
                            </p>
                            <DialogTitle className="text-3xl md:text-4xl font-display text-foreground leading-tight tracking-wide">
                                {product.title}
                            </DialogTitle>
                        </DialogHeader>

                        {/* Social Proof / Mystical Metrics */}
                        <div className="flex flex-wrap gap-4 items-center py-4 border-y border-white/5 mb-6 text-[10px] font-display uppercase tracking-wider text-emerald-600/80">
                            <div className="flex items-center gap-1.5">
                                <Eye className="w-3.5 h-3.5" />
                                <span>{randomEyes} Buscando equilíbrio agora</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Users className="w-3.5 h-3.5" />
                                <span>Energizado por centenas de buscadores</span>
                            </div>
                        </div>

                        {/* Preços */}
                        <div className="flex flex-col mb-8">
                            <span className="text-3xl font-bold bg-gradient-to-r from-[#D4AF37] via-[#F1D06E] to-[#996515] bg-clip-text text-transparent">
                                {formatPrice(currentPrice)}
                            </span>
                            {originalPrice && originalPrice > currentPrice && (
                                <span className="text-sm text-muted-foreground line-through font-body mt-1">
                                    De: {formatPrice(originalPrice)}
                                </span>
                            )}
                        </div>

                        {/* Opções (Mapeando dinamicamente do produto) */}
                        {product.options && product.options.length > 0 && (
                            <div className="space-y-4 mb-8">
                                {product.options.map((option) => (
                                    <div key={option.id} className="space-y-2">
                                        <p className="text-[10px] uppercase tracking-widest text-secondary/80 font-display">
                                            {option.title}
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {/* O Medusa traz os values unicos na option */}
                                            {option.values?.map((val) => (
                                                <button
                                                    key={val.id}
                                                    className="px-4 py-2 text-[10px] uppercase font-display border border-white/10 rounded-full text-foreground/80 hover:border-secondary/50 hover:text-secondary transition-colors"
                                                >
                                                    {val.value}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Add to Cart Actions */}
                        <div className="mt-auto grid grid-cols-[auto_1fr] gap-4 mb-8">
                            {/* Quantity Selector */}
                            <div className="flex items-center bg-black/40 border border-white/10 rounded-md h-[52px]">
                                <button
                                    className="w-10 h-full flex items-center justify-center text-muted-foreground hover:text-white transition-colors"
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                >
                                    <Minus className="w-3 h-3" />
                                </button>
                                <span className="w-8 text-center font-body text-sm">{quantity}</span>
                                <button
                                    className="w-10 h-full flex items-center justify-center text-muted-foreground hover:text-white transition-colors"
                                    onClick={() => setQuantity(quantity + 1)}
                                >
                                    <Plus className="w-3 h-3" />
                                </button>
                            </div>

                            <Button
                                className="h-[52px] bg-[#1a4a38] hover:bg-[#133628] text-white border border-[#23634b] font-display font-medium tracking-[0.1em] uppercase text-xs shadow-[0_0_20px_rgba(26,74,56,0.5)] hover:shadow-[0_0_30px_rgba(26,74,56,0.7)] transition-all duration-300 active:scale-[0.98]"
                                onClick={handleAddToCart}
                                disabled={isAdding || !selectedVariant}
                            >
                                {isAdding ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <ShoppingBag className="h-4 w-4 mr-2" />}
                                {isAdding ? "Reivindicando..." : "Reivindicar Agora"}
                            </Button>
                        </div>

                        {/* Footer Badges */}
                        <div className="grid grid-cols-3 gap-2 border-t border-white/5 pt-6 mt-4">
                            <div className="flex flex-col items-center text-center gap-2 text-secondary/70">
                                <Truck className="w-5 h-5 text-secondary" />
                                <span className="text-[8px] uppercase tracking-widest font-display">Entrega Astral</span>
                            </div>
                            <div className="flex flex-col items-center text-center gap-2 text-secondary/70">
                                <ShieldCheck className="w-5 h-5 text-secondary" />
                                <span className="text-[8px] uppercase tracking-widest font-display">Portal Seguro</span>
                            </div>
                            <div className="flex flex-col items-center text-center gap-2 text-secondary/70">
                                <RefreshCw className="w-5 h-5 text-secondary" />
                                <span className="text-[8px] uppercase tracking-widest font-display">Troca Serena</span>
                            </div>
                        </div>

                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default ProductQuickView
