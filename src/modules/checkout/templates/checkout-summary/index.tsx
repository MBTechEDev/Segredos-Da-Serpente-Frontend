// src/modules/checkout/templates/checkout-summary/index.tsx
import { HttpTypes } from "@medusajs/types"
import { convertToLocale } from "@lib/util/money"
import { Separator } from "@components/ui/separator"
import { Shield, Clock, Gift, Ticket } from "lucide-react"

export default function CheckoutSummary({ cart }: { cart: HttpTypes.StoreCart }) {
  // Função auxiliar para formatar preços usando o padrão da loja
  const formatPrice = (amount: number | null | undefined) => {
    return convertToLocale({
      amount: amount ?? 0,
      currency_code: cart.currency_code,
    })
  }

  return (
    <div className="sticky top-28 bg-card border border-border rounded-lg p-6 glass-dark shadow-2xl animate-in fade-in slide-in-from-right-4 duration-700">
      <h2 className="font-display text-xl text-secondary mb-6 tracking-wide uppercase italic">
        Resumo do Pedido
      </h2>

      {/* Lista de Itens do Carrinho */}
      <div className="flex flex-col gap-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
        {cart.items?.map((item) => (
          <div key={item.id} className="flex gap-x-4 animate-in fade-in duration-500">
            <div className="w-16 h-20 bg-background border border-border/50 rounded overflow-hidden flex-shrink-0">
              <img
                src={item.thumbnail || "/placeholder.svg"} // Fallback conforme regras
                alt={item.title || "Produto"}
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
              />
            </div>
            <div className="flex flex-col justify-between py-1 flex-1">
              <div>
                <span className="text-sm font-body text-ui-fg-base line-clamp-1 italic">
                  {item.title}
                </span>
                <span className="text-xs text-ui-fg-muted font-light">Qtd: {item.quantity}</span>
              </div>
              <span className="text-sm font-medium text-secondary">
                {formatPrice(item.unit_price * item.quantity)}
              </span>
            </div>
          </div>
        ))}
      </div>

      <Separator className="bg-border/30 mb-6" />

      {/* Seção de Totais */}
      <div className="flex flex-col gap-y-2 text-sm font-body text-ui-fg-subtle">
        <div className="flex items-center justify-between">
          <span>Subtotal</span>
          <span className="text-ui-fg-base">{formatPrice(cart.subtotal)}</span>
        </div>

        <div className="flex items-center justify-between">
          <span>Frete</span>
          <span className={cart.shipping_total === 0 ? "text-primary italic" : "text-ui-fg-base"}>
            {cart.shipping_total && cart.shipping_total > 0
              ? formatPrice(cart.shipping_total)
              : "Grátis"}
          </span>
        </div>

        {/* Descontos/Promoções */}
        {cart.discount_total ? (
          <div className="flex items-center justify-between text-primary animate-pulse">
            <span className="flex items-center gap-1">
              <Ticket size={14} /> Desconto aplicado
            </span>
            <span>-{formatPrice(cart.discount_total)}</span>
          </div>
        ) : null}
      </div>

      <Separator className="my-6 bg-border/30" />

      {/* Total Final */}
      <div className="flex items-baseline justify-between mb-6">
        <span className="font-display text-lg text-ui-fg-base uppercase">Total</span>
        <div className="text-right">
          <span className="text-2xl font-semibold text-secondary drop-shadow-[0_0_8px_rgba(212,175,55,0.4)]">
            {formatPrice(cart.total)}
          </span>
          <p className="text-tiny text-ui-fg-muted italic">Taxas inclusas</p>
        </div>
      </div>

      {/* Urgência e Gatilho Mental (Inspirado no vídeo) */}
      <div className="mb-8 p-3 bg-primary/5 border border-primary/20 rounded-lg text-center">
        <p className="text-[11px] text-primary font-body tracking-tight">
          🔥 Complete seu pedido agora e garanta sua entrega prioritária.
        </p>
      </div>

      {/* Selos de Confiança */}
      <div className="grid grid-cols-3 gap-3 border-t border-border/30 pt-6">
        {[
          { icon: Shield, label: "Seguro", desc: "Checkout SSL" },
          { icon: Clock, label: "Suporte", desc: "24/7 Ativo" },
          { icon: Gift, label: "Místico", desc: "Embalagem Luxo" },
        ].map((item, index) => (
          <div key={index} className="flex flex-col items-center text-center">
            <item.icon size={18} className="text-secondary mb-1 opacity-80" />
            <p className="text-[10px] text-ui-fg-base font-bold uppercase tracking-tighter">{item.label}</p>
            <p className="text-[9px] text-ui-fg-muted italic leading-none">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}