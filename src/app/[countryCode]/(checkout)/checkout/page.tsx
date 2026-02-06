import { Metadata } from "next"
import { notFound } from "next/navigation"
import { retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import PaymentWrapper from "@modules/checkout/components/payment-wrapper"
import CheckoutForm from "@modules/checkout/templates/checkout-form"
import CheckoutSummary from "@modules/checkout/templates/checkout-summary"

export const metadata: Metadata = {
  title: "Checkout | Segredos da Serpente",
  description: "Finalize sua jornada mística com segurança.",
}

export default async function Checkout() {
  const cart = await retrieveCart()
  if (!cart) return notFound()

  const customer = await retrieveCustomer()

  return (
    <div className="bg-background min-h-content">
      <div className="content-container py-12">
        <PaymentWrapper cart={cart}>
          <CheckoutForm cart={cart} customer={customer} />
        </PaymentWrapper>
      </div>
    </div>
  )
}