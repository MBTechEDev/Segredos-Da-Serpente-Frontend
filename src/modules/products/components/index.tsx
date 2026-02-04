"use client"

import { useState, useEffect } from "react"
import { HttpTypes } from "@medusajs/types"
import {
    Heart, ShoppingBag, Share2, ChevronLeft, ChevronRight,
    Shield, Truck, RotateCcw, Eye, Flame, Clock, Users, Star, Minus, Plus
} from "lucide-react"
import { Button } from "@components/ui/button"
import { Badge } from "@components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs"
import { useCartContext } from "@lib/context/CartContext"
import { convertToLocale } from "@lib/util/money"
import { cn } from "@lib/utils"

export default function ProductTemplate({
    product,
    region
}: {
    product: HttpTypes.StoreProduct,
    region: HttpTypes.StoreRegion
}) {
    const { addItem } = useCartContext()
    const [selectedImage, setSelectedImage] = useState(0)
    const [quantity, setQuantity] = useState(1)
    const [selectedVariantId, setSelectedVariantId] = useState(product.variants?.[0]?.id)
    const [viewingNow, setViewingNow] = useState(12)

    // Variantes e Preços Reais
    const selectedVariant = product.variants?.find(v => v.id === selectedVariantId) || product.variants?.[0]

    // Medusa v2: O preço calculado já vem formatado ou em centavos dependendo da sua lib
    const price = selectedVariant?.calculated_price?.calculated_amount || 0
    const originalPrice = selectedVariant?.calculated_price?.original_amount
    const hasDiscount = originalPrice && originalPrice > price

    // Correção do Erro ts(2554): Ajustando para o formato de objeto esperado pela maioria das implementações Medusa
    // E garantindo um fallback para o currency_code (Regra de Ouro 4)
    const formattedPrice = convertToLocale({
        amount: price,
        currency_code: region.currency_code || "brl"
    })

    const formattedOriginalPrice = hasDiscount ? convertToLocale({
        amount: originalPrice,
        currency_code: region.currency_code || "brl"
    }) : null

    // Simulação de Escassez Mística
    useEffect(() => {
        const interval = setInterval(() => {
            setViewingNow(prev => Math.max(5, Math.min(30, prev + (Math.random() > 0.5 ? 1 : -1))))
        }, 5000)
        return () => clearInterval(interval)
    }, [])

    const handleAddToCart = async () => {
        if (selectedVariantId) {
            if (selectedVariantId) {
                await addItem({ variantId: selectedVariantId, quantity })
            }
        }
    }

    return (
        <div className="min-h-screen bg-background pb-20">
            <main className="container mx-auto px-4 pt-32">
                <div className="grid lg:grid-cols-2 gap-12">

                    {/* Coluna Esquerda: Galeria Glassmorphism */}
                    <div className="space-y-4">
                        <div className="relative aspect-square overflow-hidden rounded-2xl glass-dark border border-white/10">
                            <img
                                src={product.images?.[selectedImage]?.url || product.thumbnail || "/placeholder.svg"}
                                alt={product.title ?? "Produto místico"}
                                className="w-full h-full object-cover transition-all duration-700 hover:scale-110"
                            />

                            <div className="absolute top-4 left-4 flex flex-col gap-2">
                                {hasDiscount && (
                                    <Badge className="bg-accent text-accent-foreground font-display animate-pulse">
                                        OFERTA MÍSTICA
                                    </Badge>
                                )}
                                {selectedVariant?.inventory_quantity && selectedVariant.inventory_quantity <= 5 && (
                                    <Badge variant="destructive" className="font-display">
                                        <Flame className="w-3 h-3 mr-1" /> ÚLTIMAS UNIDADES
                                    </Badge>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-4 overflow-x-auto pb-2">
                            {product.images?.map((img, i) => (
                                <button
                                    key={img.id}
                                    onClick={() => setSelectedImage(i)}
                                    className={cn(
                                        "w-20 h-20 rounded-lg overflow-hidden border-2 transition-all",
                                        selectedImage === i ? "border-secondary" : "border-transparent opacity-50 hover:opacity-100"
                                    )}
                                >
                                    <img src={img.url ?? ""} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Coluna Direita: Info & Ações */}
                    <div className="space-y-8">
                        <div className="space-y-2">
                            <span className="text-secondary font-display tracking-widest text-sm uppercase">
                                {product.collection?.title || "Coleção Exclusiva"}
                            </span>
                            <h1 className="text-4xl lg:text-5xl font-display text-gradient-gold">
                                {product.title}
                            </h1>
                        </div>

                        {/* Social Proof Section */}
                        <div className="flex flex-wrap gap-6 py-4 border-y border-white/10">
                            <div className="flex items-center gap-2 text-sm text-accent">
                                <Eye className="w-4 h-4 animate-pulse" />
                                <span>{viewingNow} buscando equilíbrio agora</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-emerald">
                                <Users className="w-4 h-4" />
                                <span>Energizado por centenas de buscadores</span>
                            </div>
                        </div>

                        {/* Preços Reais Medusa */}
                        <div className="space-y-1">
                            <div className="flex items-baseline gap-4">
                                <span className="text-4xl font-semibold text-foreground">
                                    {formattedPrice}
                                </span>
                                {hasDiscount && (
                                    <span className="text-xl text-muted-foreground line-through">
                                        {formattedOriginalPrice}
                                    </span>
                                )}
                            </div>
                            <p className="text-sm text-muted-foreground font-body">
                                ou em até 10x no portal de pagamentos
                            </p>
                        </div>

                        {/* Seletor de Opções Medusa */}
                        {product.options?.map((option) => (
                            <div key={option.id} className="space-y-3">
                                <label className="text-sm font-display uppercase tracking-wider text-secondary">
                                    {option.title}
                                </label>
                                <div className="flex flex-wrap gap-3">
                                    {option.values?.map((val) => (
                                        <button
                                            key={val.id}
                                            className={cn(
                                                "px-6 py-2 rounded-full border text-sm transition-all",
                                                selectedVariant?.options?.some(o => o.value === val.value)
                                                    ? "border-secondary bg-secondary/10 text-secondary"
                                                    : "border-white/10 hover:border-secondary/50"
                                            )}
                                            onClick={() => {
                                                const variant = product.variants?.find(v => v.options?.some(o => o.value === val.value))
                                                if (variant) setSelectedVariantId(variant.id)
                                            }}
                                        >
                                            {val.value}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}

                        {/* Ações de Compra */}
                        <div className="flex flex-col gap-4 pt-6">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center border border-white/10 rounded-lg glass-dark">
                                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 hover:text-secondary"><Minus size={16} /></button>
                                    <span className="w-8 text-center font-display">{quantity}</span>
                                    <button onClick={() => setQuantity(quantity + 1)} className="p-3 hover:text-secondary"><Plus size={16} /></button>
                                </div>
                                <Button
                                    onClick={handleAddToCart}
                                    className="flex-1 h-14 cta-primary text-lg font-display tracking-widest"
                                >
                                    <ShoppingBag className="mr-2" /> REIVINDICAR AGORA
                                </Button>
                            </div>
                        </div>

                        {/* Selos de Confiança Místicos */}
                        <div className="grid grid-cols-3 gap-4 pt-8 border-t border-white/10">
                            <div className="text-center space-y-2">
                                <Truck className="mx-auto text-secondary" />
                                <p className="text-[10px] uppercase tracking-tighter text-muted-foreground">Entrega Astral</p>
                            </div>
                            <div className="text-center space-y-2">
                                <Shield className="mx-auto text-secondary" />
                                <p className="text-[10px] uppercase tracking-tighter text-muted-foreground">Portal Seguro</p>
                            </div>
                            <div className="text-center space-y-2">
                                <RotateCcw className="mx-auto text-secondary" />
                                <p className="text-[10px] uppercase tracking-tighter text-muted-foreground">Troca Serena</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Abas de Conhecimento Sagrado */}
                <div className="mt-20">
                    <Tabs defaultValue="desc" className="w-full">
                        <TabsList className="bg-transparent border-b border-white/10 w-full justify-start rounded-none h-auto p-0">
                            <TabsTrigger value="desc" className="data-[state=active]:border-secondary border-b-2 border-transparent rounded-none pb-4 font-display uppercase tracking-widest bg-transparent">O Cristal</TabsTrigger>
                            <TabsTrigger value="ritual" className="data-[state=active]:border-secondary border-b-2 border-transparent rounded-none pb-4 font-display uppercase tracking-widest bg-transparent">O Ritual</TabsTrigger>
                        </TabsList>
                        <TabsContent value="desc" className="py-8 font-mystical text-lg text-muted-foreground leading-relaxed">
                            {product.description}
                        </TabsContent>
                        <TabsContent value="ritual" className="py-8 font-mystical text-lg text-muted-foreground leading-relaxed italic">
                            Este item foi purificado sob a luz da lua cheia e aguarda sua intenção para manifestar seu pleno poder.
                        </TabsContent>
                    </Tabs>
                </div>
            </main>
        </div>
    )
}