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
  const [calculatedPricesMap, setCalculatedPricesMap] = useState<Record<string, number>>({})
  const [error, setError] = useState<string | null>(null)

  // SOLUÇÃO ERRO 1: Usar undefined como fallback para bater com o tipo esperado
  const [shippingMethodId, setShippingMethodId] = useState<string | undefined>(
    cart.shipping_methods?.at(-1)?.shipping_option_id ?? undefined
  )

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const isOpen = searchParams.get("step") === "delivery"
  const _shippingMethods = useMemo(() => availableShippingMethods || [], [availableShippingMethods])

  useEffect(() => {
    setIsLoadingPrices(true)
    if (_shippingMethods.length) {
      const promises = _shippingMethods
        .filter((sm) => sm.price_type === "calculated")
        .map((sm) => calculatePriceForShippingOption(sm.id, cart.id))

      if (promises.length) {
        Promise.allSettled(promises).then((res) => {
          const pricesMap: Record<string, number> = {}
          res.forEach((p) => {
            if (p.status === "fulfilled" && p.value) {
              pricesMap[p.value.id] = p.value.amount
            }
          })
          setCalculatedPricesMap(pricesMap)
          setIsLoadingPrices(false)
        })
      } else {
        setIsLoadingPrices(false)
      }
    }
  }, [_shippingMethods, cart.id])

  const handleEdit = () => router.push(pathname + "?step=delivery", { scroll: false })
  const handleSubmit = () => router.push(pathname + "?step=payment", { scroll: false })

  const handleSetShippingMethod = async (id: string) => {
    setError(null)
    setIsLoading(true)
    const prevId = shippingMethodId
    setShippingMethodId(id)

    try {
      await setShippingMethod({ cartId: cart.id, shippingMethodId: id })
    } catch (err: any) {
      setShippingMethodId(prevId)
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const hasSelectedMethod = (cart.shipping_methods?.length ?? 0) > 0

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
          <h2 className="font-display text-xl md:text-2xl text-ui-fg-base tracking-wide uppercase italic">
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
            {/* SOLUÇÃO ERRO 2: Substituímos o Radio do HeadlessUI por divs nativas com onClick 
                Isso remove o erro ts(2607) e mantém o controle total do estilo místico. */}
            {_shippingMethods.map((option) => {
              const isSelected = option.id === shippingMethodId
              const amount = option.price_type === "flat"
                ? option.amount
                : calculatedPricesMap[option.id]

              return (
                <div
                  key={option.id}
                  onClick={() => handleSetShippingMethod(option.id)}
                  className={clx(
                    "relative flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all duration-300 bg-background/20",
                    isSelected
                      ? "border-secondary bg-secondary/10 shadow-[0_0_15px_rgba(212,175,55,0.1)]"
                      : "border-border/40 hover:border-secondary/50"
                  )}
                >
                  <div className="flex items-center gap-x-4">
                    <div className={clx(
                      "w-5 h-5 rounded-full border flex items-center justify-center transition-colors",
                      isSelected ? "border-secondary bg-secondary" : "border-border"
                    )}>
                      {isSelected && <div className="w-2 h-2 rounded-full bg-background" />}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-display text-sm tracking-wide text-ui-fg-base uppercase">
                        {option.name}
                      </span>
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
            <Button
              className="w-full cta-primary h-12 text-base uppercase tracking-widest font-display"
              onClick={handleSubmit}
              isLoading={isLoading}
              disabled={!hasSelectedMethod}
            >
              Continuar para Pagamento
            </Button>
          </div>
        </div>
      ) : (
        <div className="font-body">
          {hasSelectedMethod ? (
            <div className="flex items-center justify-between p-4 bg-background/40 rounded-md border border-border/30 animate-in slide-in-from-top-2">
              <div className="flex items-center gap-4 text-sm text-ui-fg-base italic">
                <Truck size={20} className="text-secondary" />
                <span>{cart.shipping_methods?.at(-1)?.name}</span>
              </div>
              <p className="text-sm font-semibold text-secondary">
                {convertToLocale({
                  amount: cart.shipping_methods?.at(-1)?.amount ?? 0,
                  currency_code: cart.currency_code,
                })}
              </p>
            </div>
          ) : (
            <p className="text-ui-fg-muted italic text-sm">Selecione um endereço para calcular o frete.</p>
          )}
        </div>
      )}
    </div>
  )
}

export default Shipping