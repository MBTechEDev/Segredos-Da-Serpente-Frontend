// src/modules/cart/templates/summary.tsx
"use client"

import { HttpTypes } from "@medusajs/types"
import { Tag, ShieldCheck } from "lucide-react"
import { useState } from "react"
import { Button, Input } from "@medusajs/ui"
import CartTotals from "@modules/common/components/cart-totals"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { useCartContext } from "@lib/context/CartContext"

type SummaryProps = {
  cart: HttpTypes.StoreCart & {
    promotions: HttpTypes.StorePromotion[]
  }
}

const Summary = ({ cart }: SummaryProps) => {
  const [discountCode, setDiscountCode] = useState("")
  const { applyDiscount, isLoading } = useCartContext()

  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) return
    await applyDiscount(discountCode)
    setDiscountCode("")
  }

  return (
    <div className="glass-dark border border-white/10 rounded-xl p-6 flex flex-col gap-y-6">
      <h2 className="font-display text-2xl text-foreground">Resumo do Pedido</h2>

      {/* Discount Code */}
      <div className="space-y-3">
        <label className="text-sm text-muted-foreground font-body">Cupom de Desconto</label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
            <input
              placeholder="Digite o código"
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
              className="w-full pl-10 pr-4 py-2 bg-background/50 border border-white/10 rounded-md focus:border-primary outline-none transition-all text-sm"
            />
          </div>
          <Button
            variant="secondary"
            className="border-primary text-primary hover:bg-primary hover:text-background"
            onClick={handleApplyDiscount}
            disabled={isLoading || !discountCode.trim()}
          >
            Aplicar
          </Button>
        </div>
      </div>

      <div className="h-px bg-white/5 w-full" />

      {/* Totals Section */}
      <CartTotals totals={cart} />

      <LocalizedClientLink href="/checkout" className="w-full">
        <Button className="w-full h-12 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-display text-lg tracking-wider transition-transform active:scale-[0.98]">
          Finalizar Compra
        </Button>
      </LocalizedClientLink>

      <div className="flex flex-col items-center gap-y-2">
        <div className="flex items-center gap-x-2 text-xs text-muted-foreground font-body">
          <ShieldCheck className="h-4 w-4 text-primary" />
          Pagamento seguro • Entrega garantida
        </div>
      </div>
    </div>
  )
}

export default Summary