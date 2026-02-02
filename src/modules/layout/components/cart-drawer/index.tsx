"use client"

import { useState, useMemo } from "react"
import { usePathname } from "next/navigation"
import { HttpTypes } from "@medusajs/types"
import { Plus, Minus, Trash2, ShoppingBag, Flame, Truck, Tag, ArrowRight, Loader2 } from "lucide-react"

import { Button } from "@components/ui/button"
import { Input } from "@components/ui/input"
import { Separator } from "@components/ui/separator"
import { Badge } from "@components/ui/badge"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@components/ui/sheet"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { cn } from "@lib/utils"

// Funções utilitárias para formatar dinheiro baseado na moeda do carrinho
const formatMoney = (amount: number | undefined | null, currencyCode: string = "BRL") => {
    if (amount === undefined || amount === null) return "0"

    return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: currencyCode.toUpperCase(),
        minimumFractionDigits: 2,
    }).format(amount) // Medusa v2 geralmente envia valores 'raw' (ex: 10.50), mas se vier em centavos, dividir por 100
}

// Interface que simula o que o Hook do Medusa deve entregar
type UseCartType = {
    cart: HttpTypes.StoreCart | null
    totalItems: number
    updateItem: (lineId: string, quantity: number) => Promise<void>
    removeItem: (lineId: string) => Promise<void>
    applyDiscount: (code: string) => Promise<void>
    isLoading: boolean
}

// Vamos usar um hook fictício por enquanto, ou podes importar o teu Contexto real aqui.
// import { useCart } from "@/lib/context/cart-context" 
// Para este exemplo funcionar, vou receber estas props ou usar um mock de contexto.
import { useCartContext } from "@lib/context/CartContext" // Assumindo que criaremos este contexto no futuro próximo

interface CartDrawerProps {
    children: React.ReactNode
}

const CartDrawer = ({ children }: CartDrawerProps) => {
    // Hook do contexto (ajustaremos o contexto no próximo passo se necessário)
    const {
        cart,
        totalItems,
        updateItem,
        removeItem,
        applyDiscount,
        isLoading
    } = useCartContext() as unknown as UseCartType

    const [couponCode, setCouponCode] = useState("")
    const [isApplyingCoupon, setIsApplyingCoupon] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [updatingLineId, setUpdatingLineId] = useState<string | null>(null)

    const pathname = usePathname()

    // Fechar o drawer ao mudar de rota
    useMemo(() => {
        setIsOpen(false)
    }, [pathname])

    // Lógica de Frete Grátis (Exemplo: R$ 150,00)
    // Nota: O Medusa pode gerir isso via Promotion Rules, mas visualmente fazemos assim:
    const freeShippingThreshold = 150;
    const currentSubtotal = cart?.subtotal || 0
    const remainingForFreeShipping = Math.max(0, freeShippingThreshold - currentSubtotal)
    const progressPercentage = Math.min(100, (currentSubtotal / freeShippingThreshold) * 100)

    const handleApplyCoupon = async () => {
        if (!couponCode) return
        setIsApplyingCoupon(true)
        try {
            await applyDiscount(couponCode)
            setCouponCode("")
        } catch (e) {
            console.error("Erro ao aplicar cupom", e)
        } finally {
            setIsApplyingCoupon(false)
        }
    }

    const handleUpdateQuantity = async (lineItemId: string, currentQuantity: number, change: number) => {
        const newQuantity = Math.max(1, currentQuantity + change)
        if (newQuantity === currentQuantity) return

        setUpdatingLineId(lineItemId)
        try {
            await updateItem(lineItemId, newQuantity)
        } finally {
            setUpdatingLineId(null)
        }
    }

    const handleRemoveItem = async (lineItemId: string) => {
        setUpdatingLineId(lineItemId)
        try {
            await removeItem(lineItemId)
        } finally {
            setUpdatingLineId(null)
        }
    }

    const currencyCode = cart?.currency_code || "BRL"

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                {children}
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md bg-card border-l border-mystical flex flex-col p-0 h-full">

                {/* Header */}
                <SheetHeader className="p-6 pb-4 border-b border-border bg-card/50 backdrop-blur-sm">
                    <SheetTitle className="font-display text-xl flex items-center gap-2 text-foreground">
                        <ShoppingBag className="w-5 h-5 text-secondary" />
                        Carrinho <span className="text-muted-foreground text-sm font-normal">({totalItems} {totalItems === 1 ? "item" : "itens"})</span>
                    </SheetTitle>
                </SheetHeader>

                {isLoading && !cart ? (
                    <div className="flex-1 flex items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-secondary" />
                    </div>
                ) : !cart || cart.items?.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                        <div className="w-20 h-20 rounded-full bg-muted/20 flex items-center justify-center mb-6">
                            <ShoppingBag className="w-10 h-10 text-muted-foreground/50" />
                        </div>
                        <h3 className="font-display text-xl mb-2 text-foreground">Seu carrinho está vazio</h3>
                        <p className="text-muted-foreground text-sm mb-8 max-w-[200px]">
                            Explore nossos produtos místicos e encontre o que sua alma procura
                        </p>
                        <Button asChild className="cta-primary w-full max-w-[200px]" onClick={() => setIsOpen(false)}>
                            <LocalizedClientLink href="/store">Explorar Loja</LocalizedClientLink>
                        </Button>
                    </div>
                ) : (
                    <>
                        {/* Barra de Frete Grátis */}
                        <div className="bg-muted/10 px-6 py-4 border-b border-border/50">
                            {remainingForFreeShipping > 0 ? (
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Truck className="w-4 h-4 text-secondary" />
                                        <span>
                                            Faltam <span className="font-semibold text-secondary">{formatMoney(remainingForFreeShipping, currencyCode)}</span> para frete grátis
                                        </span>
                                    </div>
                                    <div className="h-1.5 bg-muted rounded-full overflow-hidden w-full">
                                        <div
                                            className="h-full bg-gradient-gold transition-all duration-500 ease-out"
                                            style={{ width: `${progressPercentage}%` }}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 text-sm text-emerald">
                                    <Truck className="w-4 h-4" />
                                    <span className="font-medium">Parabéns! Você ganhou frete grátis! 🎉</span>
                                </div>
                            )}
                        </div>

                        {/* Lista de Itens */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {cart.items?.sort((a, b) => new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime()).map((item) => (
                                <div key={item.id} className="flex gap-4 group">
                                    {/* Imagem do Produto */}
                                    <div className="w-20 h-24 rounded-md overflow-hidden bg-muted flex-shrink-0 border border-border relative">
                                        {item.thumbnail ? (
                                            <img
                                                src={item.thumbnail}
                                                alt={item.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-muted">
                                                <ShoppingBag className="w-6 h-6 text-muted-foreground/50" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Detalhes do Produto */}
                                    <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                                        <div className="space-y-1">
                                            <div className="flex justify-between items-start gap-2">
                                                <LocalizedClientLink
                                                    href={`/products/${item.product_handle}`}
                                                    className="text-sm font-medium hover:text-secondary transition-colors line-clamp-2"
                                                    onClick={() => setIsOpen(false)}
                                                >
                                                    {item.product_title}
                                                </LocalizedClientLink>
                                                <button
                                                    onClick={() => handleRemoveItem(item.id)}
                                                    className="text-muted-foreground hover:text-destructive transition-colors p-1 -mr-2"
                                                    disabled={updatingLineId === item.id}
                                                >
                                                    {updatingLineId === item.id ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        <Trash2 className="w-4 h-4" />
                                                    )}
                                                </button>
                                            </div>
                                            <p className="text-xs text-muted-foreground">{item.variant_title}</p>
                                        </div>

                                        <div className="flex items-end justify-between mt-2">
                                            {/* Controles de Quantidade */}
                                            <div className="flex items-center border border-input rounded-md h-8 bg-background">
                                                <button
                                                    onClick={() => handleUpdateQuantity(item.id, item.quantity, -1)}
                                                    className="w-8 h-full flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-50"
                                                    disabled={item.quantity <= 1 || updatingLineId === item.id}
                                                >
                                                    <Minus className="w-3 h-3" />
                                                </button>
                                                <span className="w-8 text-center text-xs font-medium tabular-nums">
                                                    {updatingLineId === item.id ? (
                                                        <Loader2 className="w-3 h-3 animate-spin mx-auto" />
                                                    ) : (
                                                        item.quantity
                                                    )}
                                                </span>
                                                <button
                                                    onClick={() => handleUpdateQuantity(item.id, item.quantity, 1)}
                                                    className="w-8 h-full flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-50"
                                                    disabled={updatingLineId === item.id}
                                                >
                                                    <Plus className="w-3 h-3" />
                                                </button>
                                            </div>

                                            {/* Preço */}
                                            <div className="text-right">
                                                <span className="text-sm font-semibold text-secondary">
                                                    {formatMoney(item.total, currencyCode)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Footer / Totals */}
                        <div className="border-t border-border p-6 bg-card space-y-4 shadow-[0_-5px_20px_rgba(0,0,0,0.2)] z-10">

                            {/* Cupom */}
                            <div className="space-y-2">
                                {/* Se houver desconto aplicado, mostramos aqui */}
                                {cart.discount_total > 0 && (
                                    <div className="flex items-center justify-between text-xs text-emerald bg-emerald/10 p-2 rounded border border-emerald/20">
                                        <span className="flex items-center gap-1">
                                            <Tag className="w-3 h-3" /> Cupom aplicado
                                        </span>
                                        <span>-{formatMoney(cart.discount_total, currencyCode)}</span>
                                    </div>
                                )}

                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <Input
                                            value={couponCode}
                                            onChange={(e) => setCouponCode(e.target.value)}
                                            placeholder="Código do cupom"
                                            className="h-9 text-xs bg-background/50"
                                        />
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleApplyCoupon}
                                        disabled={isApplyingCoupon || !couponCode}
                                        className="h-9 border-input hover:bg-muted"
                                    >
                                        {isApplyingCoupon ? <Loader2 className="w-3 h-3 animate-spin" /> : "Aplicar"}
                                    </Button>
                                </div>
                            </div>

                            <Separator className="bg-border/50" />

                            {/* Totais */}
                            <div className="space-y-1.5 text-sm">
                                <div className="flex justify-between text-muted-foreground">
                                    <span>Subtotal</span>
                                    <span>{formatMoney(cart.subtotal, currencyCode)}</span>
                                </div>
                                {/* O Medusa calcula impostos automaticamente se configurado */}
                                {cart.tax_total > 0 && (
                                    <div className="flex justify-between text-muted-foreground text-xs">
                                        <span>Impostos</span>
                                        <span>{formatMoney(cart.tax_total, currencyCode)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-lg font-display text-foreground pt-2">
                                    <span>Total</span>
                                    <span className="text-secondary">{formatMoney(cart.total, currencyCode)}</span>
                                </div>
                                <p className="text-xs text-muted-foreground/60 text-right">
                                    Envio e impostos calculados no checkout
                                </p>
                            </div>

                            {/* Botões de Ação */}
                            <div className="space-y-2 pt-2">
                                <Button asChild className="w-full cta-primary h-12 text-base shadow-gold">
                                    <LocalizedClientLink href="/checkout" onClick={() => setIsOpen(false)}>
                                        Finalizar Compra
                                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </LocalizedClientLink>
                                </Button>

                                {/* Urgency Badge */}
                                <div className="flex justify-center pt-2">
                                    <Badge variant="outline" className="border-accent/20 text-accent bg-accent/5 text-[10px] py-0.5 h-auto">
                                        <Flame className="w-3 h-3 mr-1 fill-current" />
                                        Alta procura. Finalize logo o seu pedido.
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </SheetContent>
        </Sheet>
    )
}

export default CartDrawer