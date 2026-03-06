import { HttpTypes } from "@medusajs/types"
import { Text } from "@medusajs/ui"

type OrderDetailsProps = {
  order: HttpTypes.StoreOrder
  showStatus?: boolean
}

const OrderDetails = ({ order, showStatus }: OrderDetailsProps) => {
  const formatStatus = (str: string) => {
    const formatted = str.split("_").join(" ")

    return formatted.slice(0, 1).toUpperCase() + formatted.slice(1)
  }

  return (
    <div className="flex flex-col gap-3 pb-6 border-b border-[#D4AF37]/20">
      <p className="font-body text-sm md:text-base text-neutral-400">
        Os detalhes deste ritual foram enviados para a essência{" "}
        <span
          className="text-[#F1D06E] font-semibold"
          data-testid="order-email"
        >
          {order.email}
        </span>
        .
      </p>
      <p className="font-body text-sm md:text-base text-neutral-400">
        Forjado em:{" "}
        <span className="text-neutral-200" data-testid="order-date">
          {new Date(order.created_at).toLocaleDateString('pt-BR')}
        </span>
      </p>
      <p className="font-body text-sm md:text-base text-neutral-400">
        Número do Ritual: <span className="text-[#F1D06E]" data-testid="order-id">{order.display_id}</span>
      </p>

      <div className="flex flex-col sm:flex-row sm:items-center text-sm gap-4 mt-2 bg-black/40 p-4 rounded-lg border border-[#D4AF37]/10 w-fit">
        {showStatus && (
          <>
            <p className="font-body text-neutral-400">
              Estado do Ritual:{" "}
              <span className="text-emerald-400 font-semibold uppercase tracking-wider text-xs ml-1" data-testid="order-status">
                {formatStatus(order.fulfillment_status)}
              </span>
            </p>
            <div className="hidden sm:block w-px h-4 bg-[#D4AF37]/30" />
            <p className="font-body text-neutral-400">
              Tributos:{" "}
              <span
                className="text-[#F1D06E] font-semibold uppercase tracking-wider text-xs ml-1"
                sata-testid="order-payment-status"
              >
                {formatStatus(order.payment_status)}
              </span>
            </p>
          </>
        )}
      </div>
    </div>
  )
}

export default OrderDetails
