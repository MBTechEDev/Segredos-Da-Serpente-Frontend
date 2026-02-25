"use client"

import { initiatePaymentSession } from "@lib/data/cart"
import { Button, Text, clx } from "@medusajs/ui"
import { Check, CreditCard, Edit3, Lock, ShieldCheck, QrCode, Loader2 } from "lucide-react"
import ErrorMessage from "@modules/checkout/components/error-message"
import MPCardContainer from "@modules/checkout/components/payment-container/mp-card-container"
import MPPixContainer from "@modules/checkout/components/payment-container/mp-pix-container"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"

const Payment = ({ cart }: { cart: any }) => {
  const activeSession = cart.payment_collection?.payment_sessions?.find(
    (s: any) => s.status === "pending" || s.status === "requires_more"
  )

  const [isLoading, setIsLoading] = useState(false)
  const [isInitiating, setIsInitiating] = useState(false)
  const [hasInitialized, setHasInitialized] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [cardComplete, setCardComplete] = useState(false)
  const [cardBrand, setCardBrand] = useState<string | null>(null)

  // Controle da aba escolhida (Cartão ou PIX)
  const [mpMethod, setMpMethod] = useState<"card" | "pix">("card")

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const isOpen = searchParams.get("step") === "payment"
  const paidByGiftcard = cart?.gift_cards && cart?.gift_cards?.length > 0 && cart?.total === 0
  const paymentReady = (activeSession && cart?.shipping_methods?.length !== 0) || paidByGiftcard

  // 1. Força a criação da sessão do Mercado Pago automaticamente se não existir
  useEffect(() => {
    if (!isOpen || paidByGiftcard || hasInitialized) return

    if (activeSession?.provider_id !== "pp_mercadopago_mercadopago") {
      setIsInitiating(true)
      initiatePaymentSession(cart, { provider_id: "pp_mercadopago_mercadopago" })
        .catch(() => setError("Erro ao conectar com o provedor de pagamento."))
        .finally(() => {
          setIsInitiating(false)
          setHasInitialized(true)
        })
    } else {
      setHasInitialized(true)
    }
  }, [isOpen, activeSession?.provider_id, paidByGiftcard, hasInitialized, cart])

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(name, value)
      return params.toString()
    },
    [searchParams]
  )

  const handleEdit = () => {
    router.push(pathname + "?" + createQueryString("step", "payment"), { scroll: false })
  }

  const goToReview = useCallback(() => {
    router.push(pathname + "?" + createQueryString("step", "review"), { scroll: false })
  }, [pathname, createQueryString, router])

  // 2. Fluxo de Submissão específico para o PIX
  const handlePixSubmit = async () => {
    setIsLoading(true)
    setError(null)
    try {
      // Injeta na sessão que a intenção é pagar com PIX
      await initiatePaymentSession(cart, {
        provider_id: "pp_mercadopago_mercadopago",
        data: { payment_method_id: "pix" }
      })
      goToReview()
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
          {!paidByGiftcard && (
            <>
              {isInitiating ? (
                <div className="flex flex-col items-center justify-center py-8 text-secondary">
                  <Loader2 className="animate-spin" size={32} />
                  <span className="text-sm mt-4 uppercase tracking-widest">Iniciando ambiente seguro...</span>
                </div>
              ) : (
                <>
                  {/* TOGGLE CARTÃO vs PIX */}
                  <div className="grid grid-cols-2 gap-4">
                    <div
                      onClick={() => setMpMethod("card")}
                      className={clx(
                        "cursor-pointer p-4 border rounded-lg flex flex-col items-center justify-center gap-2 transition-all duration-300",
                        mpMethod === "card"
                          ? "border-secondary bg-secondary/10 shadow-[0_0_15px_rgba(212,175,55,0.1)] text-secondary"
                          : "border-border/40 hover:border-secondary/50 text-ui-fg-base opacity-70"
                      )}
                    >
                      <CreditCard size={24} />
                      <span className="font-display uppercase tracking-wide text-sm font-semibold">Cartão</span>
                    </div>

                    <div
                      onClick={() => setMpMethod("pix")}
                      className={clx(
                        "cursor-pointer p-4 border rounded-lg flex flex-col items-center justify-center gap-2 transition-all duration-300",
                        mpMethod === "pix"
                          ? "border-secondary bg-secondary/10 shadow-[0_0_15px_rgba(212,175,55,0.1)] text-secondary"
                          : "border-border/40 hover:border-secondary/50 text-ui-fg-base opacity-70"
                      )}
                    >
                      <QrCode size={24} />
                      <span className="font-display uppercase tracking-wide text-sm font-semibold">PIX</span>
                    </div>
                  </div>

                  {/* CONTEÚDO DINÂMICO BASEADO NA ESCOLHA */}
                  {mpMethod === "card" ? (
                    <div className="animate-in fade-in duration-300 mt-6">
                      <div className="p-4 bg-background/40 border border-border/30 rounded-lg">
                        <MPCardContainer
                          cart={cart}
                          setCardComplete={setCardComplete}
                          setError={setError}
                          setCardBrand={setCardBrand}
                          onSuccess={goToReview}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="animate-in fade-in duration-300 mt-6 space-y-4">
                      <div className="p-6 bg-background/40 border border-border/30 rounded-lg text-center flex flex-col items-center">
                        <QrCode size={48} className="text-secondary mb-4 opacity-80" />
                        <Text className="text-ui-fg-base font-body text-lg italic mb-2">
                          Pagamento rápido e seguro via PIX.
                        </Text>
                        <Text className="text-ui-fg-subtle text-sm max-w-md mb-6">
                          Preencha os dados abaixo com o nome e documento do pagador. O código QR será gerado na próxima etapa.
                        </Text>

                        <div className="w-full text-left">
                          <MPPixContainer
                            cart={cart}
                            setPixComplete={setCardComplete} // Reutilizando flag
                            setError={setError}
                            onSuccess={goToReview}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          )}

          {paidByGiftcard && (
            <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
              <Text className="text-primary font-body italic flex items-center gap-2">
                <ShieldCheck size={18} /> Pago via Vale-Presente
              </Text>
            </div>
          )}

          <ErrorMessage error={error} />

          <div className="flex items-center justify-center gap-4 pt-6 opacity-50">
            <div className="flex items-center gap-1 text-[10px] uppercase tracking-tighter">
              <Lock size={12} /> SSL Seguro
            </div>
            <div className="flex items-center gap-1 text-[10px] uppercase tracking-tighter">
              <ShieldCheck size={12} /> Dados Criptografados
            </div>
          </div>
        </div>

        {/* Resumo quando o acordeão está fechado (na etapa de revisão) */}
        {!isOpen && (
          <div className="animate-in fade-in duration-300">
            {cart && paymentReady && activeSession ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-background/40 rounded-md border border-border/30">
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-widest text-secondary font-bold">Método</p>
                  <p className="text-sm text-ui-fg-base italic flex items-center gap-2">
                    {activeSession.data?.payment_method_id === "pix" ? (
                      <><QrCode size={12} /> PIX</>
                    ) : (
                      <><CreditCard size={12} /> Cartão de Crédito</>
                    )}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-widest text-secondary font-bold">Status</p>
                  <div className="flex items-center gap-2 text-sm text-ui-fg-subtle italic">
                    <ShieldCheck size={12} className="text-green-500" />
                    Processamento seguro
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  )
}

export default Payment