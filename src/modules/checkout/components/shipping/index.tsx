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
  const [calculatedPricesMap, setCalculatedPricesMap] = useState<Record<string, { amount: number, delivery_time?: string | number }>>({})
  const [error, setError] = useState<string | null>(null)

  // Fallback para o ID do método já selecionado no carrinho
  const [shippingMethodId, setShippingMethodId] = useState<string | undefined>(
    cart.shipping_methods?.at(-1)?.shipping_option_id ?? undefined
  )

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const isOpen = searchParams.get("step") === "delivery"

  const _shippingMethods = useMemo(() => {
    return availableShippingMethods || []
  }, [availableShippingMethods])

  // Efeito para calcular preços de opções dinâmicas (Melhor Envio)
  useEffect(() => {
    const fetchPrices = async () => {
      if (!_shippingMethods.length) return

      setIsLoadingPrices(true)
      const calculatedMethods = _shippingMethods.filter((sm) => sm.price_type === "calculated")

      if (calculatedMethods.length === 0) {
        setIsLoadingPrices(false)
        return
      }

      const pricesMap: Record<string, { amount: number, delivery_time?: string | number }> = {}

      // Executa as cotações em paralelo para não travar o UI
      const results = await Promise.allSettled(
        calculatedMethods.map(async (sm) => {
          const resOption = await calculatePriceForShippingOption(sm.id, cart.id)

          // Função para procurar chaves comuns de prazo de entrega nos plugins (Melhor Envio / Correios)
          const extractDeliveryTime = (opt: any) => {
            if (!opt) return null;
            return opt.data?.delivery_time || opt.data?.custom_delivery_time || opt.data?.prazo || opt.metadata?.delivery_time || opt.metadata?.prazo_entrega || null;
          }

          const deliveryTime = extractDeliveryTime(resOption) || extractDeliveryTime(sm)

          // SOLUÇÃO: Garantir que amount nunca seja nulo
          return {
            id: sm.id,
            amount: resOption?.amount ?? 0,
            delivery_time: deliveryTime
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
            {_shippingMethods
              .filter((option) => {
                // Regra de Filtragem:
                // 1. Flat Rate: Exibe sempre.
                if (option.price_type === "flat") return true;

                // 2. Calculado: Verifica no mapa de preços.
                const priceObj = calculatedPricesMap[option.id];

                // Se undefined (ainda carregando), mantém na lista para mostrar o spinner.
                if (!priceObj) return true;

                // Se tiver preço e for > 0, exibe. Se for 0 (erro do backend), esconde.
                return priceObj.amount > 0;
              })
              .map((option) => {
                const isSelected = option.id === shippingMethodId

                // Define o valor: se for flat usa o fixo, se for calculado busca no map
                const amount = option.price_type === "flat"
                  ? (option.amount as number)
                  : calculatedPricesMap[option.id]?.amount

                const deliveryTime = option.price_type === "flat"
                  ? null
                  : calculatedPricesMap[option.id]?.delivery_time

                return (
                  <div
                    key={option.id}
                    onClick={() => !isLoadingPrices && handleSetShippingMethod(option.id)}
                    className={clx(
                      "relative flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all duration-300 bg-background/20",
                      isSelected
                        ? "border-secondary bg-secondary/10 shadow-[0_0_15px_rgba(212,175,55,0.1)]"
                        : "border-border/40 hover:border-secondary/50",
                      isLoadingPrices && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    <div className="flex items-center gap-x-4">
                      <div className={clx(
                        "w-5 h-5 rounded-full border flex items-center justify-center transition-colors flex-shrink-0",
                        isSelected ? "border-secondary bg-secondary" : "border-border"
                      )}>
                        {isSelected && <div className="w-2 h-2 rounded-full bg-background" />}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-display text-sm tracking-wide text-ui-fg-base uppercase">
                          {option.name}
                        </span>
                        {deliveryTime && (
                          <span className="text-xs text-ui-fg-muted font-body italic mt-0.5">
                            {deliveryTime} dias úteis
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
                className="w-1/3 h-12 bg-transparent border border-border/50 text-foreground/80 hover:bg-transparent hover:text-secondary hover:border-secondary/50 font-display uppercase tracking-widest font-semibold"
                onClick={() => router.push(pathname + "?step=address", { scroll: false })}
              >
                Voltar
              </Button>
              <Button
                className="w-2/3 bg-gradient-to-r from-[#D4AF37] via-[#F1D06E] to-[#996515] hover:brightness-110 text-black font-display font-bold tracking-[0.2em] uppercase text-[12px] h-12 rounded-md shadow-[0_0_15px_rgba(212,175,55,0.15)] transition-all duration-300 active:scale-[0.98]"
                onClick={handleSubmit}
                isLoading={isLoading}
                disabled={!hasSelectedMethod || isLoadingPrices}
                variant="secondary"
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