import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { Heading, Text } from "@medusajs/ui"

import Divider from "@modules/common/components/divider"

type ShippingDetailsProps = {
  order: HttpTypes.StoreOrder
}

const ShippingDetails = ({ order }: ShippingDetailsProps) => {
  return (
    <div className="py-6 border-b border-[#D4AF37]/20">
      <Heading level="h2" className="font-cinzel text-2xl text-[#D4AF37] mb-6">
        Jornada da Relíquia
      </Heading>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div
          className="flex flex-col"
          data-testid="shipping-address-summary"
        >
          <Text className="font-cinzel text-lg text-emerald-500 mb-2">
            Morada de Destino
          </Text>
          <Text className="font-body text-neutral-300">
            {order.shipping_address?.first_name}{" "}
            {order.shipping_address?.last_name}
          </Text>
          <Text className="font-body text-neutral-400">
            {order.shipping_address?.address_1}{" "}
            {order.shipping_address?.address_2}
          </Text>
          <Text className="font-body text-neutral-400">
            {order.shipping_address?.postal_code},{" "}
            {order.shipping_address?.city}
          </Text>
          <Text className="font-body text-neutral-400">
            {order.shipping_address?.country_code?.toUpperCase()}
          </Text>
        </div>

        <div
          className="flex flex-col"
          data-testid="shipping-contact-summary"
        >
          <Text className="font-cinzel text-lg text-emerald-500 mb-2">Conexão</Text>
          <Text className="font-body text-neutral-400">
            {order.shipping_address?.phone}
          </Text>
          <Text className="font-body text-neutral-400">{order.email}</Text>
        </div>

        <div
          className="flex flex-col"
          data-testid="shipping-method-summary"
        >
          <Text className="font-cinzel text-lg text-emerald-500 mb-2">Mensageiros</Text>
          <Text className="font-body text-neutral-400">
            {(order as any).shipping_methods[0]?.name} (
            <span className="text-[#F1D06E]">
              {convertToLocale({
                amount: order.shipping_methods?.[0].total ?? 0,
                currency_code: order.currency_code,
              })}
            </span>
            )
          </Text>
        </div>
      </div>
    </div>
  )
}

export default ShippingDetails
