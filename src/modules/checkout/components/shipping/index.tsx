"use client"
import { setShippingMethod } from "@lib/data/cart"
import { calculatePriceForShippingOption } from "@lib/data/fulfillment"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { Button, clx } from "@medusajs/ui"
import { Check, Truck, Loader2, Edit3 } from "lucide-react"
import ErrorMessage from "@modules/checkout/components/error-message"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState, useMemo } from "react"

type ShippingProps = {
  cart: HttpTypes.StoreCart
  availableShippingMethods: HttpTypes.StoreCartShippingOption[] | null
}

const Shipping: React.FC<ShippingProps> = ({
  cart,
  availableShippingMethods,
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingPrices, setIsLoadingPrices] = useState(true)
  const [calculatedPricesMap, setCalculatedPricesMap] = useState<Record<string, { amount: number, delivery_time?: { min: string, max: string } | null }>>({})
  const [error, setError] = useState<string | null>(null)

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const isOpen = searchParams.get("step") === "delivery"

  const shippingMethodId = useMemo(() => {
    return cart.shipping_methods?.at(-1)?.shipping_option_id
  }, [cart.shipping_methods])

  const extractDeliveryTime = (opt: any) => {
    if (!opt) return null
    const data = opt.calculated_price || opt.data?.calculated_price || opt.metadata || opt
    const raw = data.delivery_range || data.delivery_time

    if (!raw) {
      const min = data.delivery_time_min || data.min_delivery_time
      const max = data.delivery_time_max || data.max_delivery_time
      if (min !== undefined && min !== null) {
        return { min: String(min), max: String(max ?? min) }
      }
      return null
    }

    if (typeof raw === "object" && raw !== null) {
      return {
        min: String(raw.min ?? ""),
        max: String(raw.max ?? raw.min ?? "")
      }
    }

    if (typeof raw === "string") {
      const parts = raw.match(/\d+/g)
      if (parts && parts.length >= 2) {
        return { min: parts[0], max: parts[parts.length - 1] }
      }
      if (parts && parts.length === 1) {
        return { min: parts[0], max: parts[0] }
      }
    }

    return null
  }

  const _shippingMethods = useMemo(() => {
    return availableShippingMethods || []
  }, [availableShippingMethods])

  useEffect(() => {
    const fetchPrices = async () => {
      if (!_shippingMethods.length) {
        setIsLoadingPrices(false)
        return
      }
      const calculatedMethods = _shippingMethods.filter((sm) => sm.price_type === "calculated")
      if (calculatedMethods.length === 0) {
        setIsLoadingPrices(false)
        return
      }

      setIsLoadingPrices(true)
      const pricesMap: Record<string, any> = {}

      const results = await Promise.allSettled(
        calculatedMethods.map(async (sm) => {
          const resOption = await calculatePriceForShippingOption(sm.id, cart.id)
          return {
            id: sm.id,
            amount: resOption?.amount ?? 0,
            delivery_time: extractDeliveryTime(resOption) || extractDeliveryTime(sm)
          }
        })
      )

      results.forEach((result) => {
        if (result.status === "fulfilled" && result.value) {
          pricesMap[result.value.id] = {
            amount: result.value.amount,
            delivery_time: result.value.delivery_time
          }
        }
      })

      setCalculatedPricesMap(prev => ({ ...prev, ...pricesMap }))
      setIsLoadingPrices(false)
    }

    fetchPrices()
  }, [_shippingMethods, cart.id])

  const handleEdit = () => router.push(pathname + "?step=delivery", { scroll: false })
  const handleSubmit = () => router.push(pathname + "?step=payment", { scroll: false })

  const handleSetShippingMethod = async (id: string) => {
    setError(null)
    setIsLoading(true)
    try {
      await setShippingMethod({ cartId: cart.id, shippingMethodId: id })
    } catch (err: any) {
      setError(err.message || "Erro ao selecionar método")
    } finally {
      setIsLoading(false)
    }
  }

  const selectedMethod = cart.shipping_methods?.at(-1)
  const hasSelectedMethod = !!selectedMethod

  return (
    <div className="bg-card border border-border rounded-lg p-6 glass-dark animate-in fade-in duration-500">
      <div className="flex flex-row items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={clx(
            "w-10 h-10 rounded-full flex items-center justify-center border transition-colors",
            isOpen ? "border-secondary bg-secondary/10 text-secondary" : "border-primary bg-primary/10 text-primary"
          )}>
            {!isOpen && hasSelectedMethod ? <Check size={20} /> : <Truck size={20} />}
          </div>
          <h2 className="font-display text-xl md:text-2xl text-white tracking-wide uppercase italic">
            Método de Entrega
          </h2>
        </div>

        {!isOpen && hasSelectedMethod && (
          <button
            onClick={handleEdit}
            className="flex items-center gap-2 text-sm text-secondary hover:text-secondary/80 transition-colors font-body italic"
          >
            <Edit3 size={16} />
            <span>Editar</span>
          </button>
        )}
      </div>

      {isOpen ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            {_shippingMethods
              .filter((option) => {
                if (option.price_type === "flat") return true
                const priceObj = calculatedPricesMap[option.id]
                if (!priceObj && isLoadingPrices) return true
                return (priceObj?.amount ?? 0) > 0
              })
              .map((option) => {
                const isSelected = option.id === shippingMethodId

                const amount = option.price_type === "flat"
                  ? (option.amount as number)
                  : calculatedPricesMap[option.id]?.amount

                const deliveryTime = option.price_type === "flat"
                  ? extractDeliveryTime(option)
                  : (calculatedPricesMap[option.id]?.delivery_time || extractDeliveryTime(option))

                return (
                  <div
                    key={option.id}
                    onClick={() => !isLoadingPrices && !isLoading && handleSetShippingMethod(option.id)}
                    className={clx(
                      "relative flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all duration-300 bg-background/20",
                      isSelected
                        ? "border-secondary bg-secondary/10 shadow-[0_0_15px_rgba(212,175,55,0.1)]"
                        : "border-border/40 hover:border-secondary/50",
                      (isLoadingPrices || isLoading) && "opacity-50 pointer-events-none"
                    )}
                  >
                    <div className="flex items-center gap-x-4">
                      <div className={clx(
                        "w-5 h-5 rounded-full border flex items-center justify-center transition-colors flex-shrink-0",
                        isSelected ? "border-secondary bg-secondary" : "border-border"
                      )}>
                        {isSelected && <div className="w-2 h-2 rounded-full bg-background" />}
                      </div>

                      {/* NOME E TEMPO NA MESMA LINHA */}
                      <div className="flex items-baseline gap-2">
                        <span className="font-display text-sm tracking-wide text-white uppercase">
                          {option.name}
                        </span>
                        {deliveryTime && (
                          <span className="text-[11px] text-white/90 font-body italic">
                            ({deliveryTime.min === deliveryTime.max
                              ? `${deliveryTime.min} ${Number(deliveryTime.min) <= 1 ? 'dia útil' : 'dias úteis'}`
                              : `${deliveryTime.min} a ${deliveryTime.max} dias úteis`})
                          </span>
                        )}
                      </div>
                    </div>

                    <span className="font-medium text-secondary font-body">
                      {amount !== undefined ? (
                        convertToLocale({ amount, currency_code: cart.currency_code })
                      ) : (
                        <Loader2 className="animate-spin" size={16} />
                      )}
                    </span>
                  </div>
                )
              })}
          </div>

          <div className="pt-4 border-t border-border/30">
            <ErrorMessage error={error} />
            <div className="flex items-center gap-4">
              <Button
                type="button"
                variant="secondary"
                className="w-1/3 h-12 bg-transparent border border-border/50 text-white/80 hover:bg-transparent hover:text-secondary hover:border-secondary/50 font-display uppercase tracking-widest font-semibold"
                onClick={() => router.push(pathname + "?step=address", { scroll: false })}
              >
                Voltar
              </Button>
              <Button
                className="w-2/3 bg-gradient-to-r from-[#D4AF37] via-[#F1D06E] to-[#996515] hover:brightness-110 text-black font-display font-bold tracking-[0.2em] uppercase text-[12px] h-12 rounded-md shadow-[0_0_15px_rgba(212,175,55,0.15)] transition-all duration-300"
                onClick={handleSubmit}
                isLoading={isLoading}
                disabled={!hasSelectedMethod || isLoadingPrices}
              >
                Continuar
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="font-body">
          {hasSelectedMethod ? (
            <div className="flex items-center justify-between p-4 bg-background/40 rounded-md border border-border/30 animate-in slide-in-from-top-2">
              <div className="flex items-center gap-4 text-sm text-white italic">
                <Truck size={20} className="text-secondary" />
                <div className="flex items-baseline gap-2">
                  <span className="font-semibold uppercase font-display tracking-tight text-white">{selectedMethod.name}</span>
                  {extractDeliveryTime(selectedMethod) && (
                    <span className="text-[14px] text-white whitespace-nowrap">
                      - {extractDeliveryTime(selectedMethod)?.max} dias úteis
                    </span>
                  )}
                </div>
              </div>
              <p className="text-sm font-semibold text-secondary">
                {convertToLocale({
                  amount: selectedMethod.amount ?? 0,
                  currency_code: cart.currency_code,
                })}
              </p>
            </div>
          ) : (
            <p className="text-white/60 italic text-sm">Selecione um endereço para calcular o frete.</p>
          )}
        </div>
      )}
    </div>
  )
}

export default Shipping