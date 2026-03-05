import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"

type OrderSummaryProps = {
  order: HttpTypes.StoreOrder
}

const OrderSummary = ({ order }: OrderSummaryProps) => {
  const getAmount = (amount?: number | null) => {
    if (!amount) {
      return
    }

    return convertToLocale({
      amount,
      currency_code: order.currency_code,
    })
  }

  return (
    <div className="py-6 border-b border-[#D4AF37]/20">
      <h2 className="font-cinzel text-2xl text-[#D4AF37] mb-6">Soma dos Tributos</h2>
      <div className="font-body text-sm md:text-base text-neutral-300 my-2">
        <div className="flex items-center justify-between mb-4">
          <span>Oferendas (Subtotal)</span>
          <span>{getAmount(order.item_subtotal)}</span>
        </div>
        <div className="flex flex-col gap-y-2 mb-4">
          {order.discount_total > 0 && (
            <div className="flex items-center justify-between text-[#F1D06E]">
              <span>Bênção (Desconto)</span>
              <span>- {getAmount(order.discount_total)}</span>
            </div>
          )}
          {order.gift_card_total > 0 && (
            <div className="flex items-center justify-between text-[#F1D06E]">
              <span>Essência Extra (Cartão Presente)</span>
              <span>- {getAmount(order.gift_card_total)}</span>
            </div>
          )}
          <div className="flex items-center justify-between text-neutral-400">
            <span>Mensageiros (Frete)</span>
            <span>{getAmount(order.shipping_total)}</span>
          </div>
          <div className="flex items-center justify-between text-neutral-400">
            <span>Impostos</span>
            <span>{getAmount(order.tax_total)}</span>
          </div>
        </div>
        <div className="h-px w-full border-b border-[#D4AF37]/20 border-dashed my-4" />
        <div className="flex items-center justify-between font-cinzel text-xl md:text-2xl text-emerald-400 font-bold mb-2">
          <span>Pacto Final (Total)</span>
          <span>{getAmount(order.total)}</span>
        </div>
      </div>
    </div>
  )
}

export default OrderSummary
