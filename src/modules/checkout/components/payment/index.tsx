// src/modules/checkout/components/payment/index.tsx
"use client"

import { isStripeLike, paymentInfoMap } from "@lib/constants"
import { initiatePaymentSession } from "@lib/data/cart"
import { Button, Text, clx } from "@medusajs/ui"
import { Check, CreditCard, Edit3, Lock, ShieldCheck } from "lucide-react"
import ErrorMessage from "@modules/checkout/components/error-message"
import PaymentContainer, {
  StripeCardContainer,
} from "@modules/checkout/components/payment-container"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"

const Payment = ({
  cart,
  availablePaymentMethods,
}: {
  cart: any
  availablePaymentMethods: any[]
}) => {
  const activeSession = cart.payment_collection?.payment_sessions?.find(
    (paymentSession: any) => paymentSession.status === "pending"
  )

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cardBrand, setCardBrand] = useState<string | null>(null)
  const [cardComplete, setCardComplete] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
    activeSession?.provider_id ?? ""
  )

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const isOpen = searchParams.get("step") === "payment"

  const setPaymentMethod = async (method: string) => {
    setError(null)
    setSelectedPaymentMethod(method)
    if (isStripeLike(method)) {
      await initiatePaymentSession(cart, {
        provider_id: method,
      })
    }
  }

  const paidByGiftcard =
    cart?.gift_cards && cart?.gift_cards?.length > 0 && cart?.total === 0

  const paymentReady =
    (activeSession && cart?.shipping_methods.length !== 0) || paidByGiftcard

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(name, value)
      return params.toString()
    },
    [searchParams]
  )

  const handleEdit = () => {
    router.push(pathname + "?" + createQueryString("step", "payment"), {
      scroll: false,
    })
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      const shouldInputCard =
        isStripeLike(selectedPaymentMethod) && !activeSession

      const checkActiveSession =
        activeSession?.provider_id === selectedPaymentMethod

      if (!checkActiveSession) {
        await initiatePaymentSession(cart, {
          provider_id: selectedPaymentMethod,
        })
      }

      if (!shouldInputCard) {
        return router.push(
          pathname + "?" + createQueryString("step", "review"),
          { scroll: false }
        )
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    setError(null)
  }, [isOpen])

  return (
    <div className="bg-card border border-border rounded-lg p-6 glass-dark animate-in fade-in duration-500">
      <div className="flex flex-row items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={clx(
            "w-10 h-10 rounded-full flex items-center justify-center border transition-colors",
            isOpen ? "border-secondary bg-secondary/10 text-secondary" : "border-primary bg-primary/10 text-primary"
          )}>
            {!isOpen && paymentReady ? <Check size={20} /> : <CreditCard size={20} />}
          </div>
          <h2 className="font-display text-xl md:text-2xl text-ui-fg-base tracking-wide uppercase italic">
            Pagamento
          </h2>
        </div>

        {!isOpen && paymentReady && (
          <button
            onClick={handleEdit}
            className="flex items-center gap-2 text-sm text-secondary hover:text-secondary/80 transition-colors font-body italic"
          >
            <Edit3 size={16} />
            <span>Editar</span>
          </button>
        )}
      </div>

      <div>
        <div className={isOpen ? "block space-y-6" : "hidden"}>
          {!paidByGiftcard && availablePaymentMethods?.length && (
            <div className="grid grid-cols-1 gap-4">
              {availablePaymentMethods.map((paymentMethod) => {
                const isSelected = selectedPaymentMethod === paymentMethod.id
                const info = paymentInfoMap[paymentMethod.id]

                return (
                  <div key={paymentMethod.id} className="space-y-4">
                    <div
                      onClick={() => setPaymentMethod(paymentMethod.id)}
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
                            {info?.title || paymentMethod.id}
                          </span>
                        </div>
                      </div>
                      <div className="text-secondary opacity-80">
                        {info?.icon || <CreditCard size={20} />}
                      </div>
                    </div>

                    {/* Container expandido para Stripe ou detalhes */}
                    {isSelected && (
                      <div className="animate-in slide-in-from-top-2 duration-300">
                        {isStripeLike(paymentMethod.id) ? (
                          <div className="p-4 bg-background/40 border border-border/30 rounded-lg">
                            <StripeCardContainer
                              paymentProviderId={paymentMethod.id}
                              selectedPaymentOptionId={selectedPaymentMethod}
                              paymentInfoMap={paymentInfoMap}
                              setCardBrand={setCardBrand}
                              setError={setError}
                              setCardComplete={setCardComplete}
                            />
                          </div>
                        ) : (
                          <div className="p-4 bg-background/40 border border-border/30 rounded-lg">
                            <PaymentContainer
                              paymentInfoMap={paymentInfoMap}
                              paymentProviderId={paymentMethod.id}
                              selectedPaymentOptionId={selectedPaymentMethod}
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}

          {paidByGiftcard && (
            <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
              <Text className="text-primary font-body italic flex items-center gap-2">
                <ShieldCheck size={18} /> Pago via Vale-Presente
              </Text>
            </div>
          )}

          <ErrorMessage error={error} />

          <Button
            className="w-full cta-primary h-12 text-base uppercase tracking-widest font-display mt-6"
            onClick={handleSubmit}
            isLoading={isLoading}
            disabled={
              (isStripeLike(selectedPaymentMethod) && !cardComplete) ||
              (!selectedPaymentMethod && !paidByGiftcard)
            }
          >
            {!activeSession && isStripeLike(selectedPaymentMethod)
              ? "Inserir Dados do Cartão"
              : "Revisar Pedido"}
          </Button>

          <div className="flex items-center justify-center gap-4 pt-4 opacity-50">
            <div className="flex items-center gap-1 text-[10px] uppercase tracking-tighter">
              <Lock size={12} /> SSL Seguro
            </div>
            <div className="flex items-center gap-1 text-[10px] uppercase tracking-tighter">
              <ShieldCheck size={12} /> Dados Criptografados
            </div>
          </div>
        </div>

        {/* Resumo quando fechado */}
        {!isOpen && (
          <div className="animate-in fade-in duration-300">
            {cart && paymentReady && activeSession ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-background/40 rounded-md border border-border/30">
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-widest text-secondary font-bold">Método</p>
                  <p className="text-sm text-ui-fg-base italic">
                    {paymentInfoMap[activeSession?.provider_id]?.title || activeSession?.provider_id}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-widest text-secondary font-bold">Detalhes</p>
                  <div className="flex items-center gap-2 text-sm text-ui-fg-subtle">
                    {paymentInfoMap[selectedPaymentMethod]?.icon || <CreditCard size={16} />}
                    <span className="italic">
                      {isStripeLike(selectedPaymentMethod) && cardBrand ? cardBrand : "Processamento seguro"}
                    </span>
                  </div>
                </div>
              </div>
            ) : paidByGiftcard ? (
              <div className="p-4 bg-background/40 rounded-md border border-border/30">
                <p className="text-sm text-primary italic">Pago integralmente com Vale-Presente.</p>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  )
}

export default Payment