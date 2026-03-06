"use client"

import { XMark } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Help from "@modules/order/components/help"
import Items from "@modules/order/components/items"
import OrderDetails from "@modules/order/components/order-details"
import OrderSummary from "@modules/order/components/order-summary"
import ShippingDetails from "@modules/order/components/shipping-details"
import React from "react"

type OrderDetailsTemplateProps = {
  order: HttpTypes.StoreOrder
}

const OrderDetailsTemplate: React.FC<OrderDetailsTemplateProps> = ({
  order,
}) => {
  return (
    <div className="flex flex-col justify-center gap-y-6">
      <div className="flex gap-2 justify-between items-center">
        <h1 className="font-cinzel text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#D4AF37] via-[#F1D06E] to-[#D4AF37] bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(212,175,55,0.3)]">
          Ritual #{order.display_id}
        </h1>
        <LocalizedClientLink
          href="/account/orders"
          className="flex gap-2 items-center text-[#D4AF37] hover:text-[#F1D06E] transition-colors font-body text-sm uppercase tracking-wider"
          data-testid="back-to-overview-button"
        >
          <XMark /> Voltar ao Cofre
        </LocalizedClientLink>
      </div>
      <div
        className="flex flex-col gap-6 glass-dark border border-[#D4AF37]/20 rounded-xl p-6 md:p-8 w-full shadow-[0_0_30px_rgba(0,0,0,0.5)]"
        data-testid="order-details-container"
      >
        <OrderDetails order={order} showStatus />
        <Items order={order} />
        <ShippingDetails order={order} />
        <OrderSummary order={order} />
        <Help />
      </div>
    </div>
  )
}

export default OrderDetailsTemplate
