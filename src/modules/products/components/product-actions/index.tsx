"use client"

import { useIntersection } from "@lib/hooks/use-in-view"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@components/ui/button"
import Divider from "@modules/common/components/divider"
import OptionSelect from "@modules/products/components/product-actions/option-select"
import { isEqual } from "lodash"
import { useParams, usePathname, useSearchParams, useRouter } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"
import ProductPrice from "../product-price"
import MobileActions from "./mobile-actions"
import { useCartContext } from "@lib/context/CartContext"
import { Loader2, Sparkles } from "lucide-react"

type ProductActionsProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  disabled?: boolean
}

const optionsAsKeymap = (variantOptions: any) => {
  return variantOptions?.reduce((acc: Record<string, string>, varopt: any) => {
    acc[varopt.option_id] = varopt.value
    return acc
  }, {})
}

export default function ProductActions({ product, disabled }: ProductActionsProps) {
  const router = useRouter()
  const pathname = usePathname()
  const params = useParams()
  const searchParams = useSearchParams()
  const { addItem } = useCartContext()

  const [options, setOptions] = useState<Record<string, string | undefined>>({})
  const [isAdding, setIsAdding] = useState(false)

  useEffect(() => {
    if (product.variants?.length === 1) {
      setOptions(optionsAsKeymap(product.variants[0].options) ?? {})
    }
  }, [product.variants])

  const selectedVariant = useMemo(() => {
    if (!product.variants) return
    return product.variants.find((v) => isEqual(optionsAsKeymap(v.options), options))
  }, [product.variants, options])

  const isValidVariant = useMemo(() => !!selectedVariant, [selectedVariant])

  const inStock = useMemo(() => {
    if (selectedVariant && !selectedVariant.manage_inventory) return true
    if (selectedVariant?.allow_backorder) return true
    return (selectedVariant?.inventory_quantity || 0) > 0
  }, [selectedVariant])

  const handleAddToCart = async () => {
    if (!selectedVariant?.id) return // Blindagem contra ID nulo

    setIsAdding(true)
    try {
      await addItem({
        variantId: selectedVariant.id,
        quantity: 1,
      })
    } finally {
      setIsAdding(false)
    }
  }

  const actionsRef = useRef<HTMLDivElement>(null)
  const inView = useIntersection(actionsRef, "0px")

  return (
    <div className="flex flex-col gap-y-2" ref={actionsRef}>
      <div>
        {(product.variants?.length ?? 0) > 1 && (
          <div className="flex flex-col gap-y-4">
            {(product.options || []).map((option) => (
              <OptionSelect
                key={option.id}
                option={option}
                current={options[option.id]}
                updateOption={(id, val) => setOptions(prev => ({ ...prev, [id]: val }))}
                title={option.title ?? ""}
                disabled={!!disabled || isAdding}
              />
            ))}
            <Divider />
          </div>
        )}
      </div>

      <ProductPrice product={product} variant={selectedVariant} />

      <Button
        onClick={handleAddToCart}
        disabled={!selectedVariant?.id || !inStock || isAdding || !!disabled}
        variant="cta"
        className="w-full h-12 uppercase tracking-widest font-display shadow-gold"
      >
        {isAdding ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : !selectedVariant?.id ? (
          "Selecione as Opções"
        ) : !inStock ? (
          "Esgotado"
        ) : (
          <span className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#F1D06E]" />
            Adicionar ao Ritual
          </span>
        )}
      </Button>

      <MobileActions
        product={product}
        variant={selectedVariant}
        options={options}
        updateOptions={(id, val) => setOptions(prev => ({ ...prev, [id]: val }))}
        inStock={inStock}
        handleAddToCart={handleAddToCart}
        isAdding={isAdding}
        show={!inView}
        optionsDisabled={!!disabled || isAdding}
      />
    </div>
  )
}