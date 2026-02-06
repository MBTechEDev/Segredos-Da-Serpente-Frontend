"use client"

import { useActionState, useMemo } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { HttpTypes } from "@medusajs/types"
import { useToggleState } from "@medusajs/ui"
import { Check, MapPin, Edit3 } from "lucide-react"

import { setAddresses } from "@lib/data/cart"
import compareAddresses from "@lib/util/compare-addresses"
import { cn } from "@lib/utils"
import Spinner from "@modules/common/icons/spinner"
import BillingAddress from "../billing_address"
import ErrorMessage from "../error-message"
import ShippingAddress from "../shipping-address"
import { SubmitButton } from "../submit-button"

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

  const isOpen = searchParams.get("step") === "address"

  const { state: sameAsBilling, toggle: toggleSameAsBilling } = useToggleState(
    cart?.shipping_address && cart?.billing_address
      ? compareAddresses(cart?.shipping_address, cart?.billing_address)
      : true
  )

  const handleEdit = () => {
    router.push(pathname + "?step=address", { scroll: false })
  }

  const [message, formAction] = useActionState(setAddresses, null)

  // Verifica se o passo de endereço foi concluído com sucesso
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
            data-testid="edit-address-button"
          >
            <Edit3 size={16} />
            <span>Editar</span>
          </button>
        )}
      </div>

      {/* CONTEÚDO: FORMULÁRIO ABERTO OU RESUMO HORIZONTAL */}
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
              <SubmitButton
                className="w-full cta-primary h-12 text-base uppercase tracking-widest font-display"
                data-testid="submit-address-button"
              >
                Continuar para Entrega
              </SubmitButton>
              <ErrorMessage error={message} data-testid="address-error-message" />
            </div>
          </div>
        </form>
      ) : (
        <div className="font-body animate-in fade-in duration-500">
          {cart && cart.shipping_address ? (
            /* GRID HORIZONTAL CONFORME IMAGEM 6 */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-4 border-t border-border/10">

              {/* Coluna 1: Entrega */}
              <div className="space-y-2" data-testid="shipping-address-summary">
                <p className="text-[10px] uppercase tracking-[0.2em] text-secondary font-bold">Entrega</p>
                <div className="flex flex-col text-sm text-ui-fg-base">
                  <span className="font-semibold uppercase tracking-tight">
                    {cart.shipping_address.first_name} {cart.shipping_address.last_name}
                  </span>
                  <span className="text-ui-fg-subtle italic leading-relaxed">
                    {cart.shipping_address.address_1}
                    {cart.shipping_address.address_2 && `, ${cart.shipping_address.address_2}`}
                  </span>
                  <span className="text-ui-fg-subtle italic">
                    {cart.shipping_address.postal_code}, {cart.shipping_address.city}
                  </span>
                </div>
              </div>

              {/* Coluna 2: Contato */}
              <div className="space-y-2" data-testid="shipping-contact-summary">
                <p className="text-[10px] uppercase tracking-[0.2em] text-secondary font-bold">Contato</p>
                <div className="flex flex-col text-sm text-ui-fg-subtle">
                  <span>{cart.shipping_address.phone}</span>
                  <span className="italic opacity-80">{cart.email}</span>
                </div>
              </div>

              {/* Coluna 3: Cobrança */}
              <div className="space-y-2 border-l border-border/10 pl-8 hidden md:block" data-testid="billing-address-summary">
                <p className="text-[10px] uppercase tracking-[0.2em] text-secondary font-bold">Cobrança</p>
                <p className="text-xs text-ui-fg-subtle italic leading-relaxed">
                  {sameAsBilling ? (
                    "Mesmo endereço de entrega."
                  ) : (
                    <>
                      {cart.billing_address?.first_name} {cart.billing_address?.last_name}<br />
                      {cart.billing_address?.address_1}
                    </>
                  )}
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