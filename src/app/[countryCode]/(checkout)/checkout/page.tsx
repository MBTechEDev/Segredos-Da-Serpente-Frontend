import { Suspense } from "react"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import { retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import { listCartShippingMethods } from "@lib/data/fulfillment"
import PaymentWrapper from "@modules/checkout/components/payment-wrapper"
import CheckoutForm from "@modules/checkout/templates/checkout-form"
import Spinner from "@modules/common/icons/spinner"


export const metadata: Metadata = {
  title: "Checkout | Segredos da Serpente",
  description: "Finalize sua jornada mística com segurança.",
}

const CheckoutSkeleton = () => (
  <div className="w-full h-full flex items-center justify-center p-12">
    <Spinner />
  </div>
)

export default async function Checkout() {
  const cart = await retrieveCart()
  if (!cart) return notFound()

  const customer = await retrieveCustomer()

  // Buscar as opções de frete disponíveis para este carrinho
  const shippingMethods = await listCartShippingMethods(cart.id)

  return (
    <div className="bg-background min-h-content">
      <div className="content-container py-12">
        <PaymentWrapper cart={cart}>
          <Suspense fallback={<CheckoutSkeleton />}>
            <CheckoutForm
              cart={cart}
              customer={customer}
              availableShippingMethods={shippingMethods}
            />
          </Suspense>
        </PaymentWrapper>
      </div>
    </div>
  )
}