"use client"

import { HttpTypes } from "@medusajs/types"
import Item from "@modules/cart/components/item"
import SkeletonLineItem from "@modules/skeletons/components/skeleton-line-item"

type ItemsTemplateProps = {
  cart?: HttpTypes.StoreCart
}

const ItemsTemplate = ({ cart }: ItemsTemplateProps) => {
  const items = cart?.items

  return (
    <div className="flex flex-col gap-y-6">
      <div className="pb-4 border-b border-white/5 flex items-center justify-between">
        <h2 className="font-display text-2xl text-foreground">Itens no Caldeirão</h2>
        <span className="text-xs text-muted-foreground uppercase tracking-widest font-body">
          Preço Unitário / Total
        </span>
      </div>

      <div className="flex flex-col gap-y-4">
        {items
          ? items
            .sort((a, b) => {
              // Regra de Ouro 4: Ordenação segura para TypeScript
              return new Date(a.created_at ?? 0).getTime() - new Date(b.created_at ?? 0).getTime()
            })
            .map((item) => {
              return (
                <Item
                  key={item.id}
                  item={item}
                  currencyCode={cart?.currency_code}
                />
              )
            })
          : Array.from({ length: 3 }).map((_, i) => (
            <SkeletonLineItem key={i} />
          ))}
      </div>
    </div>
  )
}

export default ItemsTemplate