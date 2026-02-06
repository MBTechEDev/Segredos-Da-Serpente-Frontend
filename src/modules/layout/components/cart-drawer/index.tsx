"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Plus, Minus, Trash2, ShoppingBag, Truck, Loader2 } from "lucide-react"

import { Button } from "@components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@components/ui/sheet"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { cn } from "@lib/utils"
import { useCartContext } from "@lib/context/CartContext"

const formatMoney = (amount: number | undefined | null, currencyCode: string = "BRL") => {
    if (amount === undefined || amount === null) return "R$ 0,00"
    return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: currencyCode.toUpperCase(),
    }).format(amount)
}

const CartDrawer = ({ children }: { children: React.ReactNode }) => {
    const {
        cart,
        totalItems,
        updateItem,
        removeItem,
    } = useCartContext()

    const [isOpen, setIsOpen] = useState(false)
    const [updatingLineId, setUpdatingLineId] = useState<string | null>(null)
    const pathname = usePathname()

    // Regra de Ouro: Fechar ao navegar
    useEffect(() => {
        setIsOpen(false)
    }, [pathname])

    const currencyCode = cart?.currency_code || "brl"

    // Lógica de Frete Grátis (Mock de R$ 150,00)
    const freeShippingThreshold = 150
    const currentSubtotal = cart?.subtotal || 0
    const remainingForFreeShipping = Math.max(0, freeShippingThreshold - currentSubtotal)
    const progressPercentage = Math.min(100, (currentSubtotal / freeShippingThreshold) * 100)

    // Handlers com feedback de loading
    const handleUpdateQuantity = async (lineId: string, quantity: number) => {
        setUpdatingLineId(lineId)
        await updateItem(lineId, quantity)
        setUpdatingLineId(null)
    }

    const handleRemoveItem = async (lineId: string) => {
        setUpdatingLineId(lineId)
        await removeItem(lineId)
        setUpdatingLineId(null)
    }

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>{children}</SheetTrigger>
            <SheetContent className="w-full sm:max-w-md bg-background border-l border-white/10 flex flex-col p-0 h-full shadow-2xl">

                <SheetHeader className="p-6 pb-4 border-b border-white/5 bg-card/30 backdrop-blur-md">
                    <SheetTitle className="font-display text-xl flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5 text-secondary" />
                        <span className="bg-gradient-to-r from-[#D4AF37] via-[#F1D06E] to-[#996515] bg-clip-text text-transparent">
                            Carrinho
                        </span>
                        <span className="text-muted-foreground text-xs font-body font-normal ml-auto">
                            ({totalItems} {totalItems === 1 ? "artefato" : "itens"})
                        </span>
                    </SheetTitle>
                </SheetHeader>

                {!cart || cart.items?.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
                        <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center border border-secondary/20">
                            <ShoppingBag className="w-8 h-8 text-secondary/40" />
                        </div>
                        <h3 className="font-display text-lg">O baú está vazio</h3>
                        <p className="text-sm text-muted-foreground max-w-[200px]">
                            Seus tesouros místicos aparecerão aqui após serem invocados.
                        </p>
                        <Button asChild variant="outline" className="border-secondary/50 text-secondary hover:bg-secondary/10">
                            <LocalizedClientLink href="/store">Explorar Artefatos</LocalizedClientLink>
                        </Button>
                    </div>
                ) : (
                    <>
                        {/* Progress Bar de Frete */}
                        <div className="px-6 py-4 bg-emerald/5 border-b border-emerald/10">
                            <div className="flex justify-between text-xs mb-2">
                                <span className={cn(
                                    "flex items-center gap-1.5 transition-colors",
                                    remainingForFreeShipping > 0 ? "text-muted-foreground" : "text-emerald-400"
                                )}>
                                    <Truck className="w-3.5 h-3.5" />
                                    {remainingForFreeShipping > 0
                                        ? `Faltam ${formatMoney(remainingForFreeShipping, currencyCode)} para frete grátis`
                                        : "Bênção alcançada: Frete Grátis Liberado!"}
                                </span>
                                <span className="text-muted-foreground">{Math.round(progressPercentage)}%</span>
                            </div>
                            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-emerald-500 transition-all duration-700 shadow-[0_0_8px_#10b981]"
                                    style={{ width: `${progressPercentage}%` }}
                                />
                            </div>
                        </div>

                        {/* Lista de Itens */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {[...(cart.items || [])]
                                .sort((a, b) => new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime())
                                .map((item) => (
                                    <div key={item.id} className={cn(
                                        "flex gap-4 group animate-in fade-in slide-in-from-right-4 transition-opacity",
                                        updatingLineId === item.id && "opacity-50 pointer-events-none"
                                    )}>
                                        <div className="relative w-20 h-24 bg-white/5 border border-white/10 rounded overflow-hidden flex-shrink-0">
                                            <img
                                                src={item.thumbnail || "/placeholder.svg"}
                                                alt={item.title}
                                                className="object-cover w-full h-full transition-transform group-hover:scale-110"
                                            />
                                        </div>

                                        <div className="flex-1 flex flex-col justify-between">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className="text-sm font-medium line-clamp-1 pr-4">{item.title}</h4>
                                                    <p className="text-xs text-muted-foreground">{item.variant?.title}</p>
                                                </div>
                                                <button
                                                    onClick={() => handleRemoveItem(item.id)}
                                                    className="text-muted-foreground hover:text-destructive transition-colors"
                                                >
                                                    {updatingLineId === item.id ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        <Trash2 className="w-4 h-4" />
                                                    )}
                                                </button>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center border border-white/10 rounded bg-black/20">
                                                    <button
                                                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                                        className="p-1 hover:text-secondary disabled:opacity-30"
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        <Minus className="w-3 h-3" />
                                                    </button>
                                                    <span className="w-8 text-center text-xs font-mono">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                                        className="p-1 hover:text-secondary"
                                                    >
                                                        <Plus className="w-3 h-3" />
                                                    </button>
                                                </div>
                                                <span className="text-sm font-medium text-secondary">
                                                    {formatMoney(item.unit_price * item.quantity, currencyCode)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>

                        {/* Checkout Footer */}
                        <div className="p-6 bg-card/50 border-t border-white/5 space-y-4">
                            <div className="flex justify-between font-display text-lg">
                                <span>Total Ritual</span>
                                <span className="text-secondary font-bold">
                                    {formatMoney(cart.total, currencyCode)}
                                </span>
                            </div>
                            <Button asChild className="w-full cta-primary shadow-[0_0_20px_rgba(16,185,129,0.2)] py-6 text-md">
                                <LocalizedClientLink href="/checkout">
                                    Finalizar Pacto
                                </LocalizedClientLink>
                            </Button>
                        </div>
                    </>
                )}
            </SheetContent>
        </Sheet>
    )
}

export default CartDrawer