// src/modules/checkout/templates/checkout-form/index.tsx
"use client"

import { HttpTypes } from "@medusajs/types"
import { useSearchParams } from "next/navigation"
import { cn } from "@lib/utils"

import Addresses from "@modules/checkout/components/addresses"
import Shipping from "@modules/checkout/components/shipping"
import Payment from "@modules/checkout/components/payment"
import Review from "@modules/checkout/components/review"
import CheckoutProgress from "../../components/checkout-progress"
import CheckoutSummary from "../checkout-summary"

export default function CheckoutForm({
  cart,
  customer,
  availableShippingMethods,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
  availableShippingMethods: HttpTypes.StoreCartShippingOption[] | null
}) {
  const searchParams = useSearchParams()
  const step = searchParams.get("step") || "address"

  if (!cart) return null

  const stepNumber =
    step === "address" ? 1 :
      step === "delivery" ? 2 :
        step === "payment" ? 3 : 4

  const renderCurrentStep = () => {
    switch (step) {
      case "address":
        return <Addresses cart={cart} customer={customer} />
      case "delivery":
        return (
          <Shipping
            cart={cart}
            availableShippingMethods={availableShippingMethods} // <--- PASSANDO A LISTA CORRETA
          />
        )
      case "payment":
        return (
          <Payment
            cart={cart}
          />
        )
      case "review":
        return <Review cart={cart} />
      default:
        return <Addresses cart={cart} customer={customer} />
    }
  }

  return (
    // Reduzido padding lateral (px-12), removido padding inferior e margens
    <div className="w-full lg:px-12 animate-in fade-in duration-700">

      {/* Reduzido padding vertical do stepper e margem inferior (mb-4) */}
      <div className="py-4 flex justify-center border-b border-white/5 mb-4">
        <div className="w-full max-w-xl">
          <CheckoutProgress activeStep={stepNumber} />
        </div>
      </div>

      {/* Reduzido gap entre formulário e resumo (gap-x-6) e removido paddings internos */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-x-6 gap-y-0 items-start px-[15%]">
        {renderCurrentStep()}
        <CheckoutSummary cart={cart} />
      </div>

    </div>
  )
}