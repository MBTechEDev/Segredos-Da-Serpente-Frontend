// src/modules/checkout/components/review/index.tsx
"use client"

import { Heading, Text, clx } from "@medusajs/ui"
import { useSearchParams } from "next/navigation"
import { ShieldCheck, FileText, Check } from "lucide-react"
import PaymentButton from "../payment-button"

const Review = ({ cart }: { cart: any }) => {
  const searchParams = useSearchParams()

  const isOpen = searchParams.get("step") === "review"

  const paidByGiftcard =
    cart?.gift_cards && cart?.gift_cards?.length > 0 && cart?.total === 0

  // Proteção contra undefined nos arrays do Medusa v2
  const previousStepsCompleted =
    cart?.shipping_address &&
    (cart?.shipping_methods?.length ?? 0) > 0 &&
    (cart?.payment_collection || paidByGiftcard)

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

      {isOpen && previousStepsCompleted && (
        <div className="animate-in slide-in-from-top-4 duration-500">
          <div className="flex items-start gap-x-4 w-full mb-8 p-4 bg-background/30 border border-border/20 rounded-lg">
            <ShieldCheck className="text-primary shrink-0" size={24} />
            <div className="w-full text-sm">
              <Text className="font-body text-ui-fg-subtle leading-relaxed italic">
                Ao clicar no botão <span className="text-secondary font-bold uppercase tracking-widest">Finalizar Pedido</span>, você confirma que leu e aceita nossos
                Termos de Uso, Termos de Venda e Política de Devolução, bem como a Política de Privacidade da
                <span className="font-mystical text-ui-fg-base ml-1">Segredos da Serpente</span>.
              </Text>
            </div>
          </div>

          {/* SOLUÇÃO: Envolvemos o PaymentButton em uma div para aplicar o estilo, 
              evitando o erro de 'className' no componente interno */}
          <div className="w-full [&>button]:cta-primary [&>button]:w-full [&>button]:h-14 [&>button]:text-lg [&>button]:font-display [&>button]:tracking-[0.2em] [&>button]:uppercase">
            <PaymentButton cart={cart} data-testid="submit-order-button" />
          </div>

          <p className="text-center text-[10px] text-ui-fg-muted mt-4 uppercase tracking-widest font-body">
            Transação criptografada e segura
          </p>
        </div>
      )}

      {!isOpen && (
        <Text className="text-ui-fg-muted italic text-sm font-body">
          Complete os passos anteriores para revisar seu pedido.
        </Text>
      )}
    </div>
  )
}

export default Review