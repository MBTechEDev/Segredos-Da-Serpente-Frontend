"use client"

import { Heading, Text, clx } from "@medusajs/ui"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { ShieldCheck, FileText, Check, MapPin, Truck, CreditCard, QrCode, Edit3 } from "lucide-react"
import PaymentButton from "../payment-button"
import { useCallback } from "react"

const Review = ({ cart }: { cart: any }) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const isOpen = searchParams.get("step") === "review"

  const paidByGiftcard =
    cart?.gift_cards && cart?.gift_cards?.length > 0 && cart?.total === 0

  const previousStepsCompleted =
    cart?.shipping_address &&
    (cart?.shipping_methods?.length ?? 0) > 0 &&
    (cart?.payment_collection || paidByGiftcard)

  // Extraindo os dados do carrinho para o resumo
  const shippingAddress = cart?.shipping_address
  const shippingMethod = cart?.shipping_methods?.at(-1)

  // Pegando os dados da sessão de pagamento ativa
  const activeSession = cart?.payment_collection?.payment_sessions?.find(
    (s: any) => s.status === "pending" || s.status === "requires_more" || s.status === "authorized"
  )

  const paymentData = activeSession?.data
  const isPix = paymentData?.payment_method_id === "pix"
  const cardBrand = paymentData?.payment_method_id && !isPix ? paymentData.payment_method_id.toUpperCase() : ""

  // Função para navegar de volta a um passo específico
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(name, value)
      return params.toString()
    },
    [searchParams]
  )

  const goToStep = (step: string) => {
    router.push(pathname + "?" + createQueryString("step", step), { scroll: false })
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6 glass-dark animate-in fade-in duration-500">
      <div className="flex flex-row items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={clx(
            "w-10 h-10 rounded-full flex items-center justify-center border transition-colors",
            isOpen ? "border-secondary bg-secondary/10 text-secondary" : "border-primary bg-primary/10 text-primary"
          )}>
            {isOpen ? <FileText size={20} /> : <Check size={20} />}
          </div>
          <Heading
            level="h2"
            className={clx(
              "font-display text-xl md:text-2xl text-ui-fg-base tracking-wide uppercase italic",
              {
                "opacity-50 pointer-events-none select-none": !isOpen,
              }
            )}
          >
            Revisão Final
          </Heading>
        </div>
      </div>

      {isOpen && previousStepsCompleted ? (
        <div className="animate-in slide-in-from-top-4 duration-500 space-y-8">

          {/* GRID DE RESUMO DOS PASSOS ANTERIORES */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-border/30">

            {/* Bloco 1: Endereço */}
            <div className="space-y-3 bg-background/20 p-4 rounded-lg border border-border/40 relative group">
              <div className="flex items-center justify-between text-secondary">
                <div className="flex items-center gap-2">
                  <MapPin size={18} />
                  <span className="font-display text-xs uppercase tracking-widest font-bold">Entrega</span>
                </div>
                <button onClick={() => goToStep("delivery")} className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <Edit3 size={14} className="hover:text-white" />
                </button>
              </div>
              <div className="text-sm text-ui-fg-subtle font-body space-y-1">
                <p className="text-ui-fg-base">{shippingAddress?.first_name} {shippingAddress?.last_name}</p>
                <p>{shippingAddress?.address_1}{shippingAddress?.address_2 ? `, ${shippingAddress?.address_2}` : ""}</p>
                <p>{shippingAddress?.city}, {shippingAddress?.province}</p>
                <p>{shippingAddress?.postal_code}</p>
              </div>
            </div>

            {/* Bloco 2: Frete */}
            <div className="space-y-3 bg-background/20 p-4 rounded-lg border border-border/40 relative group">
              <div className="flex items-center justify-between text-secondary">
                <div className="flex items-center gap-2">
                  <Truck size={18} />
                  <span className="font-display text-xs uppercase tracking-widest font-bold">Frete</span>
                </div>
                <button onClick={() => goToStep("delivery")} className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <Edit3 size={14} className="hover:text-white" />
                </button>
              </div>
              <div className="text-sm text-ui-fg-subtle font-body">
                <p className="text-ui-fg-base">{shippingMethod?.name || "Frete Padrão"}</p>
                <p className="italic opacity-80 mt-1">Estimativa calculada</p>
              </div>
            </div>

            {/* Bloco 3: Pagamento */}
            <div className="space-y-3 bg-background/20 p-4 rounded-lg border border-border/40 relative group">
              <div className="flex items-center justify-between text-secondary">
                <div className="flex items-center gap-2">
                  {isPix ? <QrCode size={18} /> : <CreditCard size={18} />}
                  <span className="font-display text-xs uppercase tracking-widest font-bold">Pagamento</span>
                </div>
                <button onClick={() => goToStep("payment")} className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <Edit3 size={14} className="hover:text-white" />
                </button>
              </div>
              <div className="text-sm text-ui-fg-subtle font-body">
                {isPix ? (
                  <>
                    <p className="text-ui-fg-base">Mercado Pago (PIX)</p>
                    <p className="italic opacity-80 mt-1">Geração de QR Code</p>
                  </>
                ) : (
                  <>
                    <p className="text-ui-fg-base">{cardBrand || "Cartão de Crédito"}</p>
                    {paymentData?.installments && (
                      <p className="italic opacity-80 mt-1">{paymentData.installments}x sem juros</p>
                    )}
                  </>
                )}
              </div>
            </div>

          </div>

          {/* TERMOS E CONDIÇÕES */}
          <div className="flex items-start gap-x-4 w-full p-4 bg-background/30 border border-border/20 rounded-lg">
            <ShieldCheck className="text-primary shrink-0" size={24} />
            <div className="w-full text-sm">
              <Text className="font-body text-ui-fg-subtle leading-relaxed italic">
                Ao clicar no botão <span className="text-secondary font-bold uppercase tracking-widest">Finalizar Pedido</span>, você confirma que leu e aceita nossos
                Termos de Uso, Termos de Venda e Política de Devolução, bem como a Política de Privacidade da
                <span className="font-mystical text-ui-fg-base ml-1">Segredos da Serpente</span>.
              </Text>
            </div>
          </div>

          {/* BOTÃO DE FINALIZAR */}
          <div className="w-full">
            <PaymentButton cart={cart} data-testid="submit-order-button" />
          </div>

          <p className="text-center text-[10px] text-ui-fg-muted mt-4 uppercase tracking-widest font-body">
            Transação criptografada e segura via Mercado Pago
          </p>
        </div>
      ) : !isOpen ? (
        <Text className="text-ui-fg-muted italic text-sm font-body">
          Complete os passos anteriores para revisar seu pedido.
        </Text>
      ) : null}
    </div>
  )
}

export default Review