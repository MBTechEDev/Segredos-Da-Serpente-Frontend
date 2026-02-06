// src/modules/checkout/components/addresses/index.tsx

"use client"

import { useActionState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { HttpTypes } from "@medusajs/types"
import { useToggleState } from "@medusajs/ui"
import { Check, MapPin, Edit3, ArrowRight } from "lucide-react"

import { setAddresses } from "@lib/data/cart"
import compareAddresses from "@lib/util/compare-addresses"
import { cn } from "@lib/utils"
import Spinner from "@modules/common/icons/spinner"
import BillingAddress from "../billing_address"
import ErrorMessage from "../error-message"
import ShippingAddress from "../shipping-address"
import { SubmitButton } from "../submit-button"
import { Button } from "@components/ui/button"

const Addresses = ({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  // O passo está aberto se o parâmetro "step" for "address" ou se não houver parâmetro (início do checkout)
  const isOpen = searchParams.get("step") === "address" || !searchParams.get("step")

  const { state: sameAsBilling, toggle: toggleSameAsBilling } = useToggleState(
    cart?.shipping_address && cart?.billing_address
      ? compareAddresses(cart?.shipping_address, cart?.billing_address)
      : true
  )

  const handleEdit = () => {
    router.push(pathname + "?step=address", { scroll: false })
  }

  // Função para avançar manualmente sem re-submeter o formulário caso os dados já existam
  const handleProceed = () => {
    router.push(pathname + "?step=delivery", { scroll: false })
  }

  const [message, formAction] = useActionState(setAddresses, null)

  // Verifica se o passo de endereço já possui dados básicos
  const isCompleted = !!cart?.shipping_address && !!cart?.email

  return (
    <div className="bg-card border border-border rounded-lg p-6 glass-dark animate-in fade-in duration-500">
      {/* CABEÇALHO DO PASSO */}
      <div className="flex flex-row items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center border transition-colors",
            isOpen ? "border-secondary bg-secondary/10 text-secondary" : "border-primary bg-primary/10 text-primary"
          )}>
            {!isOpen && isCompleted ? <Check size={20} /> : <MapPin size={20} />}
          </div>
          <h2 className="font-display text-xl md:text-2xl text-ui-fg-base tracking-wide uppercase italic">
            Endereço de Entrega
          </h2>
        </div>

        {!isOpen && isCompleted && (
          <button
            onClick={handleEdit}
            className="flex items-center gap-2 text-sm text-secondary hover:text-secondary/80 transition-colors font-body italic"
          >
            <Edit3 size={16} />
            <span>Editar</span>
          </button>
        )}
      </div>

      {/* CONTEÚDO */}
      {isOpen ? (
        <form action={formAction}>
          <div className="space-y-6">
            <ShippingAddress
              customer={customer}
              checked={sameAsBilling}
              onChange={toggleSameAsBilling}
              cart={cart}
            />

            {!sameAsBilling && (
              <div className="pt-8 border-t border-border/50 animate-in slide-in-from-top-4 duration-300">
                <h2 className="font-display text-xl mb-6 text-ui-fg-base italic">
                  Endereço de Cobrança
                </h2>
                <BillingAddress cart={cart} />
              </div>
            )}

            <div className="flex flex-col gap-y-2 pt-4">
              <Button
                className="w-full cta-primary h-12 text-base uppercase tracking-widest font-display"
                variant="secondary"
              >
                Continuar
              </Button>
              <ErrorMessage error={message} />
            </div>
          </div>
        </form>
      ) : (
        <div className="font-body animate-in fade-in duration-500">
          {cart && cart.shipping_address ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-4 border-t border-border/10">
                {/* Coluna 1: Entrega */}
                <div className="space-y-2">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-secondary font-bold">Entrega</p>
                  <div className="flex flex-col text-sm text-ui-fg-base">
                    <span className="font-semibold uppercase">
                      {cart.shipping_address.first_name} {cart.shipping_address.last_name}
                    </span>
                    <span className="text-ui-fg-subtle italic">
                      {cart.shipping_address.address_1}
                      {cart.shipping_address.address_2 && `, ${cart.shipping_address.address_2}`}
                    </span>
                    <span className="text-ui-fg-subtle italic">
                      {cart.shipping_address.postal_code}, {cart.shipping_address.city}
                    </span>
                  </div>
                </div>

                {/* Coluna 2: Contato */}
                <div className="space-y-2">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-secondary font-bold">Contato</p>
                  <div className="flex flex-col text-sm text-ui-fg-subtle">
                    <span>{cart.shipping_address.phone}</span>
                    <span className="italic opacity-80">{cart.email}</span>
                  </div>
                </div>

                {/* Coluna 3: Cobrança */}
                <div className="space-y-2 border-l border-border/10 pl-8 hidden md:block">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-secondary font-bold">Cobrança</p>
                  <div className="text-xs text-ui-fg-subtle italic leading-relaxed">
                    {sameAsBilling ? "Mesmo endereço de entrega." : cart.billing_address?.address_1}
                  </div>
                </div>
              </div>

              {/* BOTÃO DE CONTINUAR - APARECE QUANDO O PASSO ESTÁ FECHADO MAS HÁ DADOS */}
              <div className="pt-4 border-t border-border/10">
                <Button
                  onClick={handleProceed}
                  className="w-full md:w-auto min-w-[250px] cta-primary h-12 gap-2 font-display uppercase tracking-widest"
                >
                  Confirmar e Ir para Entrega
                  <ArrowRight size={18} />
                </Button>
                <p className="text-[10px] text-ui-fg-muted mt-2 italic">
                  Verifique se os dados acima estão corretos antes de prosseguir.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center py-4">
              <Spinner />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Addresses