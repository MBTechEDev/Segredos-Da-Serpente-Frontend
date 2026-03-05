import { HttpTypes } from "@medusajs/types"
import { Table, Text } from "@medusajs/ui"

import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import LineItemUnitPrice from "@modules/common/components/line-item-unit-price"
import Thumbnail from "@modules/products/components/thumbnail"

type ItemProps = {
  item: HttpTypes.StoreCartLineItem | HttpTypes.StoreOrderLineItem
  currencyCode: string
}

const Item = ({ item, currencyCode }: ItemProps) => {
  return (
    <Table.Row className="w-full hover:bg-black/20 transition-colors border-b border-[#D4AF37]/10 last:border-0" data-testid="product-row">
      <Table.Cell className="p-4 w-24">
        <div className="flex w-16">
          <Thumbnail thumbnail={item.thumbnail} size="square" />
        </div>
      </Table.Cell>

      <Table.Cell className="text-left font-body p-4">
        <Text
          className="text-base text-neutral-200 font-semibold"
          data-testid="product-name"
        >
          {item.product_title}
        </Text>
        <div className="text-[#D4AF37]/80 text-sm mt-1">
          <LineItemOptions variant={item.variant} data-testid="product-variant" />
        </div>
      </Table.Cell>

      <Table.Cell className="p-4 font-body">
        <span className="flex flex-col items-end h-full justify-center">
          <span className="flex gap-x-1 ">
            <Text className="text-neutral-500">
              <span data-testid="product-quantity">{item.quantity}</span>x{" "}
            </Text>
            <div className="text-neutral-400">
              <LineItemUnitPrice
                item={item}
                style="tight"
                currencyCode={currencyCode}
              />
            </div>
          </span>

          <div className="text-emerald-400 font-bold mt-1">
            <LineItemPrice
              item={item}
              style="tight"
              currencyCode={currencyCode}
            />
          </div>
        </span>
      </Table.Cell>
    </Table.Row>
  )
}

export default Item
