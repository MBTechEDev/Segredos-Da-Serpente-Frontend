// src/modules/cart/components/item/index.tsx
"use client"

import { HttpTypes } from "@medusajs/types"
import { Trash2, Plus, Minus } from "lucide-react"
import { useCartContext } from "@lib/context/CartContext"
import { convertToLocale } from "@lib/util/money"
import { clx } from "@medusajs/ui"

type ItemProps = {
  item: HttpTypes.StoreCartLineItem
  currencyCode?: string
  type?: "full" | "preview"
}

const Item = ({ item, currencyCode, type = "full" }: ItemProps) => {
  const { updateItem, removeItem } = useCartContext()

  const handleUpdateQuantity = (newQuantity: number) => {
    if (newQuantity > 0) {
      updateItem(item.id, newQuantity)
    }
  }

  const thumbnail = item.thumbnail || "/placeholder.svg"

  return (
    <div className={clx(
      "bg-white/5 border border-white/10 rounded-lg p-4 flex gap-4 transition-all hover:border-primary/30 group",
      { "py-2 px-3 gap-2": type === "preview" }
    )}>
      <div className={clx(
        "flex-shrink-0 rounded-md overflow-hidden bg-black/40 border border-white/5",
        type === "preview" ? "w-12 h-12" : "w-20 h-20 md:w-24 md:h-24"
      )}>
        <img
          src={thumbnail}
          alt={item.title || "Item místico"}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>

      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div className="flex justify-between items-start gap-2">
          <div>
            <h3 className={clx(
              "font-display text-foreground leading-tight truncate",
              type === "preview" ? "text-sm" : "text-lg"
            )}>
              {item.title}
            </h3>
            {item.variant?.title !== "Default" && (
              <p className="text-[10px] md:text-xs text-muted-foreground font-body mt-1">
                Essência: <span className="text-secondary/80">{item.variant?.title}</span>
              </p>
            )}
          </div>

          {type === "full" && (
            <button
              onClick={() => removeItem(item.id)}
              className="text-muted-foreground hover:text-destructive transition-colors p-1"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-x-3 bg-black/40 rounded-full border border-white/5 p-1">
            <button
              onClick={() => handleUpdateQuantity(item.quantity - 1)}
              className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/10 text-muted-foreground transition-colors disabled:opacity-30"
              disabled={item.quantity <= 1}
            >
              <Minus size={14} />
            </button>
            <span className="text-sm font-medium min-w-[20px] text-center font-body">
              {item.quantity}
            </span>
            <button
              onClick={() => handleUpdateQuantity(item.quantity + 1)}
              className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/10 text-primary transition-colors"
            >
              <Plus size={14} />
            </button>
          </div>

          <div className="text-right">
            <p className="font-display text-lg bg-gradient-to-r from-[#D4AF37] via-[#F1D06E] to-[#996515] bg-clip-text text-transparent font-bold">
              {/* Solução para o erro de tipo: Garantindo que passamos um objeto que a lib money aceite ou forçando o valor */}
              {convertToLocale({ amount: item.total ?? 0, currency_code: currencyCode ?? 'br' })}
            </p>
            {item.quantity > 1 && type === "full" && (
              <p className="text-[10px] text-muted-foreground font-body uppercase tracking-tighter">
                {convertToLocale({ amount: item.unit_price ?? 0, currency_code: currencyCode ?? 'br' })} cada
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Item